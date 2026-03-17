//! Read SMART information from a disk device using the Linux SG_IO ioctl interface.
//!
//! This program sends an ATA SMART READ DATA command via the SCSI ATA Translation
//! (SAT) layer using ATA PASS-THROUGH (12). It works with USB mechanical hard drives
//! that support SMART, without requiring any third-party CLI tools (e.g. smartctl).
//!
//! Usage: sudo ./smart-reader [/dev/sdX]
//!        Defaults to /dev/sda if no device path is provided.

use std::fs::OpenOptions;
use std::io;
use std::os::unix::io::AsRawFd;

// ---------------------------------------------------------------------------
// Linux SCSI Generic (SG) constants
// ---------------------------------------------------------------------------

/// SG_IO ioctl request code (defined in <scsi/sg.h>)
const SG_IO: libc::c_ulong = 0x2285;

/// Interface ID for SCSI generic v3
const SG_INTERFACE_ID: i32 = b'S' as i32;

/// Data transfer direction: from device to host
const SG_DXFER_FROM_DEV: i32 = -3;

// ---------------------------------------------------------------------------
// ATA / SAT constants
// ---------------------------------------------------------------------------

/// ATA command code for SMART operations
const ATA_OP_SMART: u8 = 0xB0;

/// SMART sub-command: READ DATA
const SMART_READ_DATA: u8 = 0xD0;

/// SMART signature bytes required in LBA Mid / LBA High
const SMART_LBA_MID: u8 = 0x4F;
const SMART_LBA_HI: u8 = 0xC2;

/// SCSI opcode for ATA PASS-THROUGH (12)
const ATA_12: u8 = 0xA1;

/// SMART data sector size (always 512 bytes)
const SMART_DATA_LEN: usize = 512;

// ---------------------------------------------------------------------------
// sg_io_hdr — mirrors the kernel struct in <scsi/sg.h>
// ---------------------------------------------------------------------------
#[repr(C)]
#[allow(non_camel_case_types)]
struct sg_io_hdr {
    interface_id: i32,
    dxfer_direction: i32,
    cmd_len: u8,
    mx_sb_len: u8,
    iovec_count: u16,
    dxfer_len: u32,
    dxferp: *mut u8,
    cmdp: *const u8,
    sbp: *mut u8,
    timeout: u32,
    flags: u32,
    pack_id: i32,
    usr_ptr: *mut libc::c_void,
    status: u8,
    masked_status: u8,
    msg_status: u8,
    sb_len_wr: u8,
    host_status: u16,
    driver_status: u16,
    resid: i32,
    duration: u32,
    info: u32,
}

// ---------------------------------------------------------------------------
// Send SMART READ DATA via SG_IO
// ---------------------------------------------------------------------------

/// Issue an ATA SMART READ DATA command through the SCSI generic (SG_IO) interface
/// and return the 512-byte SMART data sector.
fn read_smart_data(device_path: &str) -> io::Result<[u8; SMART_DATA_LEN]> {
    let file = OpenOptions::new()
        .read(true)
        .write(true)
        .open(device_path)?;
    let fd = file.as_raw_fd();

    let mut data = [0u8; SMART_DATA_LEN];
    let mut sense = [0u8; 32];

    // Build an ATA PASS-THROUGH (12) CDB for SMART READ DATA.
    //
    // Byte layout (SAT-2 §12.2.2):
    //   [0]  Operation code   = 0xA1  (ATA PASS-THROUGH 12)
    //   [1]  Protocol         = PIO Data-In (4) shifted into bits 4-1
    //   [2]  Flags            = T_DIR=1, BYT_BLOK=1, T_LENGTH=10b  → 0x0E
    //   [3]  Features         = 0xD0  (SMART READ DATA)
    //   [4]  Sector Count     = 1
    //   [5]  LBA Low          = 0
    //   [6]  LBA Mid          = 0x4F  (SMART signature)
    //   [7]  LBA High         = 0xC2  (SMART signature)
    //   [8]  Device           = 0
    //   [9]  Command          = 0xB0  (SMART)
    //   [10] Reserved         = 0
    //   [11] Reserved         = 0
    let cdb: [u8; 12] = [
        ATA_12,
        0x08,            // protocol: PIO Data-In (4 << 1)
        0x0E,            // T_DIR=1, BYT_BLOK=1, T_LENGTH=10
        SMART_READ_DATA, // features register
        0x01,            // sector count
        0x00,            // LBA low
        SMART_LBA_MID,   // LBA mid  (SMART signature)
        SMART_LBA_HI,    // LBA high (SMART signature)
        0x00,            // device
        ATA_OP_SMART,    // command register
        0x00,
        0x00,
    ];

    let mut hdr = sg_io_hdr {
        interface_id: SG_INTERFACE_ID,
        dxfer_direction: SG_DXFER_FROM_DEV,
        cmd_len: cdb.len() as u8,
        mx_sb_len: sense.len() as u8,
        iovec_count: 0,
        dxfer_len: SMART_DATA_LEN as u32,
        dxferp: data.as_mut_ptr(),
        cmdp: cdb.as_ptr(),
        sbp: sense.as_mut_ptr(),
        timeout: 20_000, // 20 seconds
        flags: 0,
        pack_id: 0,
        usr_ptr: std::ptr::null_mut(),
        status: 0,
        masked_status: 0,
        msg_status: 0,
        sb_len_wr: 0,
        host_status: 0,
        driver_status: 0,
        resid: 0,
        duration: 0,
        info: 0,
    };

    // SAFETY: we pass a valid fd and a properly initialised sg_io_hdr whose
    // buffer pointers (dxferp, cmdp, sbp) are valid for the declared lengths.
    let ret = unsafe { libc::ioctl(fd, SG_IO, &mut hdr as *mut sg_io_hdr) };

    if ret < 0 {
        return Err(io::Error::last_os_error());
    }

    if hdr.status != 0 || hdr.host_status != 0 || hdr.driver_status != 0 {
        return Err(io::Error::other(format!(
            "SG_IO failed — SCSI status={:#04x}, host_status={:#06x}, driver_status={:#06x}",
            hdr.status, hdr.host_status, hdr.driver_status,
        )));
    }

    Ok(data)
}

// ---------------------------------------------------------------------------
// SMART attribute parsing
// ---------------------------------------------------------------------------

#[allow(dead_code)]
struct SmartAttribute {
    id: u8,
    flags: u16,
    current: u8,
    worst: u8,
    raw: u64,
}

/// Parse the 30 SMART attribute entries from the 512-byte data sector.
///
/// Layout (ATA/ATAPI-7 §A.1):
///   Bytes  0–1  : Data structure revision
///   Bytes  2–361: 30 × 12-byte attribute entries
///   Bytes 362–511: Vendor-specific
fn parse_smart_attributes(data: &[u8; SMART_DATA_LEN]) -> Vec<SmartAttribute> {
    let mut attrs = Vec::new();
    for i in 0..30 {
        let off = 2 + i * 12;
        let id = data[off];
        if id == 0 {
            continue;
        }
        attrs.push(SmartAttribute {
            id,
            flags: u16::from_le_bytes([data[off + 1], data[off + 2]]),
            current: data[off + 3],
            worst: data[off + 4],
            raw: u64::from_le_bytes([
                data[off + 5],
                data[off + 6],
                data[off + 7],
                data[off + 8],
                data[off + 9],
                data[off + 10],
                0,
                0,
            ]),
        });
    }
    attrs
}

/// Return a human-readable name for common SMART attribute IDs.
fn attr_name(id: u8) -> &'static str {
    match id {
        1 => "Raw Read Error Rate",
        2 => "Throughput Performance",
        3 => "Spin-Up Time",
        4 => "Start/Stop Count",
        5 => "Reallocated Sectors Count",
        7 => "Seek Error Rate",
        8 => "Seek Time Performance",
        9 => "Power-On Hours",
        10 => "Spin Retry Count",
        11 => "Calibration Retry Count",
        12 => "Power Cycle Count",
        183 => "Runtime Bad Block",
        184 => "End-to-End Error",
        187 => "Reported Uncorrectable Errors",
        188 => "Command Timeout",
        189 => "High Fly Writes",
        190 => "Airflow Temperature (°C)",
        191 => "G-Sense Error Rate",
        192 => "Power-Off Retract Count",
        193 => "Load/Unload Cycle Count",
        194 => "Temperature (°C)",
        195 => "Hardware ECC Recovered",
        196 => "Reallocation Event Count",
        197 => "Current Pending Sector Count",
        198 => "Offline Uncorrectable",
        199 => "Ultra DMA CRC Error Count",
        200 => "Multi-Zone Error Rate",
        _ => "Unknown",
    }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

fn main() {
    let device = std::env::args()
        .nth(1)
        .unwrap_or_else(|| "/dev/sda".to_string());

    println!("Reading SMART data from {} ...\n", device);

    let data = match read_smart_data(&device) {
        Ok(d) => d,
        Err(e) => {
            eprintln!("Error: {}", e);
            eprintln!();
            eprintln!("Hints:");
            eprintln!("  • This program must be run as root (sudo).");
            eprintln!("  • The device must support SMART and the SG_IO interface.");
            std::process::exit(1);
        }
    };

    let revision = u16::from_le_bytes([data[0], data[1]]);
    println!("SMART data structure revision: {}\n", revision);

    let attrs = parse_smart_attributes(&data);

    println!(
        "{:<5} {:<40} {:>7} {:>7} {:>14}",
        "ID", "Attribute", "Cur", "Worst", "Raw Value"
    );
    println!("{}", "-".repeat(77));

    for a in &attrs {
        println!(
            "{:<5} {:<40} {:>7} {:>7} {:>14}",
            a.id,
            attr_name(a.id),
            a.current,
            a.worst,
            a.raw,
        );
    }

    // Highlight temperature information
    for a in &attrs {
        match a.id {
            194 => println!(
                "\n🌡  Temperature (attr 194): {}°C",
                a.raw & 0xFF
            ),
            190 => println!(
                "\n🌡  Airflow Temperature (attr 190): {}°C",
                a.raw & 0xFF
            ),
            9 => println!("⏱  Power-On Hours (attr 9): {} h", a.raw),
            _ => {}
        }
    }
}
