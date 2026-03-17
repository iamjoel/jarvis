---
status: stable
category: coding
tags: usb, disk, hardware, block-device, python, bash
important level: 3
create_date: 2026-03-17
---

# USB 机械硬盘数据读取
> 读取 USB 机械硬盘（设备路径 `/dev/sda`）的数据，包括分区信息查看、原始数据读取、文件系统挂载读取等方式。

## 前置条件
- 需要 root 权限（或 sudo）才能直接读取块设备
- 确认设备路径：`lsblk` 或 `fdisk -l` 查看

## 1. 查看磁盘信息

```bash
# 查看所有块设备
lsblk /dev/sda

# 查看分区表和磁盘大小
sudo fdisk -l /dev/sda

# 查看文件系统类型
sudo blkid /dev/sda*
```

## 2. 挂载后读取文件（推荐）

如果硬盘有文件系统（如 ext4、ntfs、exfat），挂载后直接读取是最安全的方式。

```bash
# 创建挂载点
sudo mkdir -p /mnt/usb_disk

# 挂载第一个分区（根据 lsblk 输出调整分区号）
sudo mount /dev/sda1 /mnt/usb_disk

# 读取文件
ls /mnt/usb_disk
cat /mnt/usb_disk/somefile.txt

# 用完后卸载
sudo umount /mnt/usb_disk
```

## 3. Python 读取原始数据（块设备级别）

```python
import os
import sys

DEVICE_PATH = "/dev/sda"
BLOCK_SIZE = 512  # 标准扇区大小


def read_raw_blocks(device: str, offset: int = 0, count: int = 1) -> bytes:
    """从块设备读取原始数据。

    Args:
        device: 设备路径，如 /dev/sda
        offset: 起始扇区号
        count:  读取的扇区数量

    Returns:
        读取到的原始字节数据

    Raises:
        FileNotFoundError: 设备路径不存在
        PermissionError:   无 root 权限
        OSError:           设备读取失败
    """
    fd = os.open(device, os.O_RDONLY)
    try:
        os.lseek(fd, offset * BLOCK_SIZE, os.SEEK_SET)
        data = os.read(fd, count * BLOCK_SIZE)
    finally:
        os.close(fd)
    return data


def read_mbr(device: str) -> None:
    """读取并解析 MBR（主引导记录，第一个扇区）。"""
    mbr = read_raw_blocks(device, offset=0, count=1)

    print(f"MBR 大小: {len(mbr)} bytes")
    print(f"引导签名: 0x{mbr[510]:02X}{mbr[511]:02X}")

    if mbr[510] == 0x55 and mbr[511] == 0xAA:
        print("✓ 有效的 MBR 引导签名")
    else:
        print("✗ 无效的 MBR 引导签名（可能是 GPT 磁盘）")

    # 解析四个主分区表项（偏移 446，每个 16 字节）
    for i in range(4):
        entry_offset = 446 + i * 16
        entry = mbr[entry_offset : entry_offset + 16]
        partition_type = entry[4]
        if partition_type != 0:
            start_lba = int.from_bytes(entry[8:12], "little")
            size_sectors = int.from_bytes(entry[12:16], "little")
            size_mb = size_sectors * BLOCK_SIZE / (1024 * 1024)
            print(
                f"分区 {i + 1}: 类型=0x{partition_type:02X}, "
                f"起始LBA={start_lba}, "
                f"大小={size_mb:.1f} MB"
            )


def read_file_with_buffered_io(device: str, size: int = 4096) -> bytes:
    """使用 Python 标准 I/O 读取设备数据。"""
    with open(device, "rb") as f:
        return f.read(size)


def hexdump(data: bytes, bytes_per_line: int = 16) -> None:
    """以十六进制格式打印数据。"""
    for i in range(0, len(data), bytes_per_line):
        chunk = data[i : i + bytes_per_line]
        hex_str = " ".join(f"{b:02X}" for b in chunk)
        ascii_str = "".join(chr(b) if 32 <= b < 127 else "." for b in chunk)
        print(f"{i:08X}  {hex_str:<{bytes_per_line * 3}}  |{ascii_str}|")


if __name__ == "__main__":
    device = sys.argv[1] if len(sys.argv) > 1 else DEVICE_PATH

    print(f"=== 读取设备: {device} ===\n")

    # 读取 MBR
    print("--- MBR 信息 ---")
    read_mbr(device)

    # 读取前 512 字节并显示 hexdump
    print("\n--- 前 512 字节 Hexdump ---")
    data = read_raw_blocks(device, offset=0, count=1)
    hexdump(data)
```

## 4. Shell 读取原始数据

```bash
# 读取前 512 字节（MBR）
sudo dd if=/dev/sda bs=512 count=1 status=progress | xxd | head -32

# 读取前 1MB
sudo dd if=/dev/sda bs=1M count=1 of=/tmp/disk_head.bin status=progress

# 按偏移量读取（跳过前 1MB，读取 4KB）
sudo dd if=/dev/sda bs=4096 count=1 skip=256 status=progress | xxd

# 创建完整磁盘镜像（注意：耗时较长，需要足够存储空间）
# sudo dd if=/dev/sda bs=4M conv=sync,noerror status=progress of=/path/to/disk.img
```

## 5. Python 流式读取大量数据

```python
import os
import hashlib


def stream_read(device: str, total_bytes: int, chunk_size: int = 1024 * 1024) -> str:
    """流式读取设备数据并计算 SHA-256 校验和。

    适用于读取大量数据而不占用大量内存。

    Args:
        device:      设备路径
        total_bytes: 要读取的总字节数
        chunk_size:  每次读取的块大小（默认 1MB）

    Returns:
        SHA-256 校验和（十六进制字符串）
    """
    sha256 = hashlib.sha256()
    bytes_read = 0

    with open(device, "rb") as f:
        while bytes_read < total_bytes:
            to_read = min(chunk_size, total_bytes - bytes_read)
            chunk = f.read(to_read)
            if not chunk:
                print(f"\n⚠ 设备在 {bytes_read} 字节处到达末尾（预期 {total_bytes}）")
                break
            sha256.update(chunk)
            bytes_read += len(chunk)
            progress = bytes_read / total_bytes * 100
            print(f"\r进度: {progress:.1f}% ({bytes_read}/{total_bytes})", end="")

    print()
    return sha256.hexdigest()


if __name__ == "__main__":
    # 读取前 100MB 并计算校验和
    checksum = stream_read("/dev/sda", total_bytes=100 * 1024 * 1024)
    print(f"SHA-256: {checksum}")
```

## 注意事项
- **始终以只读方式打开设备**（`O_RDONLY` / `"rb"`），避免误写入导致数据损坏
- 直接读取块设备需要 root 权限：`sudo python3 script.py`
- 大容量硬盘的完整镜像需要同等大小的存储空间
- 如果只需要读取文件，优先使用挂载方式（第 2 节）
