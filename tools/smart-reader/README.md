# smart-reader

Read SMART (Self-Monitoring, Analysis and Reporting Technology) information from a disk device on Linux — **without** shelling out to any third-party CLI tool (e.g. `smartctl`).

## How it works

1. Opens the block device (e.g. `/dev/sda`).
2. Sends an **ATA SMART READ DATA** command through the Linux **SG_IO** ioctl interface, using the SCSI **ATA PASS-THROUGH (12)** command defined by the SAT (SCSI-ATA Translation) standard.
3. Parses the 512-byte SMART data sector and prints all attribute entries (ID, current/worst values, raw value).
4. Highlights commonly useful attributes such as **temperature** and **power-on hours**.

## Build

```bash
cd tools/smart-reader
cargo build --release
```

## Run

Root privileges are required to issue SG_IO commands:

```bash
# Default device /dev/sda
sudo ./target/release/smart-reader

# Specify a different device
sudo ./target/release/smart-reader /dev/sdb
```

### Example output

```
Reading SMART data from /dev/sda ...

SMART data structure revision: 16

ID    Attribute                                    Cur   Worst      Raw Value
-----------------------------------------------------------------------------
1     Raw Read Error Rate                          200     200              0
3     Spin-Up Time                                 188     186           1758
4     Start/Stop Count                              99      99            834
5     Reallocated Sectors Count                    200     200              0
9     Power-On Hours                               88      88           9116
194   Temperature (°C)                             111     100             32

🌡  Temperature (attr 194): 32°C
⏱  Power-On Hours (attr 9): 9116 h
```

## Requirements

- Linux (uses the SG_IO ioctl interface)
- Rust 1.56+ (edition 2021)
- Root / `sudo` access
- A disk device that supports SMART (most SATA / USB mechanical drives)
