# 常见传感器硬件项目方案与选型指南

## 高密度摘要

- **一句话结论**：第一套硬件优先买一块 ESP32-C6、带统一 I²C 接口的 SHT40/SHT45、环境光和 ToF 模块，再按具体项目增加真 CO₂、颗粒物、IMU 或毫米波传感器。
- **核心机制**：主控负责采样、休眠和联网；传感器优先通过 I²C 接入；先用成品模块验证，再决定是否画 PCB；项目可靠性主要取决于供电、安装、校准和数据解释，而不只是传感器型号。
- **判断入口**：先确定测量对象、刷新率、精度、供电方式、通信距离和安装环境，再选传感器；第一次写固件用 Arduino C++，需要完整控制时再转 ESP-IDF。
- **常见误区**：VOC 传感器给出的 eCO₂ 不等于真实 CO₂；ESP32-C6 能运行嵌入式 JavaScript，但不能运行完整 Node.js；廉价电阻式土壤探针会腐蚀。
- **相关文档**：[技术索引](../technology.md)、[M5Stack 深度指南](../m/m5stack.md)。

> 资料核对日期：2026-07-10。以下推荐以开发模块而非裸芯片为默认购买形态；同一芯片的不同模块可能带有稳压、上拉和电平转换，接线前应检查模块原理图。

## 先选主控

| 主控 | 推荐场景 | 优点 | 注意点 |
|------|----------|------|--------|
| **ESP32-C6 开发板** | 默认首选、智能家居、Wi-Fi 数据上报、Matter/Thread/Zigbee 实验 | 集成 2.4 GHz Wi-Fi 6、BLE 5 和 802.15.4；接口丰富；Arduino、ESP-IDF、MicroPython 生态完善 | 单核，摄像头和较重的本地推理不如 ESP32-S3；无线发射瞬时电流要求供电稳定 |
| **ESP32-S3 开发板** | 摄像头、语音、显示屏、本地轻量 AI | 双核、较强的向量指令与 USB 能力，常见带 PSRAM 型号多 | 不带 802.15.4，做 Thread/Zigbee 不如 C6 直接 |
| **Raspberry Pi Pico 2 W** | 学习 MicroPython/C/C++、实时控制、希望无线逻辑与传感器逻辑清晰分离 | RP2350 性能强，支持 C/C++ 与 Python；Pico 2 W 带 2.4 GHz Wi-Fi 和 Bluetooth 5.2 | 物联网成品生态、Matter/Thread 和一站式配网通常不如 ESP32-C6 |
| **nRF52840 开发板** | 纽扣电池 BLE、可穿戴、HID | BLE 生态成熟，适合低功耗无线 | 没有 Wi-Fi；初学整体成本和调试门槛略高 |

ESP32-C6 的官方资料明确列出 Wi-Fi 6、Bluetooth LE、Thread/Zigbee，以及 I²C、SPI、UART、I²S、ADC 等外设，适合作为通用 IoT 传感器节点；Pico 2 W 官方资料则确认其 2.4 GHz Wi-Fi、Bluetooth 5.2 以及 C/C++、Python 支持。[Espressif ESP32-C6](https://www.espressif.com/en/node/5997) · [Raspberry Pi Pico 2 W](https://www.raspberrypi.com/products/raspberry-pi-pico-2/?variant=pico-2-w)

## 六套可直接开工的方案

### 方案 A：桌面环境监测站——最适合作为第一个项目

**组合**：ESP32-C6 + SHT40/SHT45 温湿度 + BMP390 气压 + VEML7700 环境光 + 1.3 英寸 I²C OLED。

能完成温度、湿度、气压趋势、粗略高度变化、环境明暗和露点计算；数据可显示在 OLED，也可经 Wi-Fi 发到 Home Assistant、MQTT 或 InfluxDB/Grafana。

- SHT40 性价比更好；需要高精度时选 SHT45。SHT45 官方典型精度为 ±1%RH、±0.1°C，I²C 接口，平均电流 0.4 µA。[Sensirion SHT45](https://sensirion.com/products/catalog/SHT45)
- 先只接 SHT40/SHT45 和 OLED，跑通后再加气压与光照，便于隔离接线和 I²C 地址问题。
- 外壳必须通风，温湿度传感器要远离主控、稳压器、屏幕和阳光直射，否则测到的主要是设备自身发热。

**难度**：低。**供电**：USB 最省事；降低刷新率并使用深度睡眠后可改锂电池。

### 方案 B：真正有意义的室内空气质量仪

**组合**：ESP32-C6/S3 + SCD41 真 CO₂ + SPS30 PM1/PM2.5/PM10 + SHT40/SHT45；可选 BME688 做 VOC 趋势。

- SCD41 使用光声 NDIR 原理，量程 400–5000 ppm，并支持单次测量模式，适合判断通风需求。[Sensirion SCD41](https://sensirion.com/products/catalog/SCD41)
- SPS30 用激光散射测颗粒物，输出 PM1.0、PM2.5、PM4、PM10，I²C/UART 接口，平均电流约 55 mA，因此整机更适合 USB 常供电。[Sensirion SPS30](https://sensirion.com/products/catalog/SPS30)
- BME688 可测温湿度、气压和气体电阻并输出 IAQ/VOC 相关结果，但其 CO₂-equivalent 是算法估计值，不应替代 SCD41 的真实 CO₂ 测量。[Bosch BME688](https://www.bosch-sensortec.com/en/products/environmental-sensors/gas-sensors/bme688)
- PM 传感器有风扇和明确气路，进出风口不能贴墙或被外壳遮挡；CO₂ 传感器也应避免人呼吸直接吹向进气区域。

**难度**：中。**供电**：5 V USB，建议 1 A 以上电源并留出峰值余量。

### 方案 C：房间存在感知与自动灯光

**组合**：ESP32-C6 + 24 GHz 毫米波存在模块 + VEML7700 环境光；需要空间分区时加 VL53L5CX。

- 毫米波适合检测静坐、呼吸等微动，PIR 更适合低成本检测明显移动；两者可组合降低误报。
- 环境光用于避免白天无意义开灯；门磁可帮助建立“进入/离开”的状态机。
- VL53L5CX 可提供 4×4 或 8×8 多区域深度，最远约 4 m、最高 60 Hz，可做方向、手势或粗略区域占用；它不是摄像头，隐私负担较小。[ST VL53L5CX](https://www.st.com/en/imaging-and-photonics-solutions/vl53l5cx.html)
- 毫米波会穿过部分薄材料并可能感知墙后、窗帘后或摆动风扇，必须在真实安装位置调距离门限和灵敏度。

**难度**：中。**供电**：USB 或墙内 AC-DC 模块；涉及市电时优先使用有认证的成品电源，不把裸露市电放在面包板上。

### 方案 D：小车、机械臂或姿态记录器

**组合**：ESP32-S3/Pico 2 W + ICM-42688-P 六轴 IMU + VL53L1X（单点避障）或 VL53L5CX（多区感知）+ 电机编码器。

- ICM-42688-P 提供三轴陀螺仪和三轴加速度计，支持 I²C/SPI，并带计步、倾斜、敲击、运动唤醒等功能。[TDK ICM-42688-P](https://www.invensense.tdk.com/en-us/products/consumer/icm-42688-p)
- VL53L1X 适合单方向测距，官方规格最高约 4 m、50 Hz；多方向避障或简单手势再升级 VL53L5CX。[ST VL53L1X](https://www.st.com/en/imaging-and-photonics-solutions/vl53l1x.html)
- 只有 IMU 会随时间漂移。小车定位应融合轮编码器，姿态项目可加磁力计，但磁力计要远离电机、磁铁和大电流导线。
- 电机与逻辑电源建议分轨，必须共地；电机端加合适的驱动器、续流和去耦，不要用主控 GPIO 直接带电机。

**难度**：中到高。**供电**：电池 + 降压模块，按电机堵转电流而不是空载电流选电源与驱动器。

### 方案 E：植物、温室或户外数据节点

**组合**：ESP32-C6 + 防护型 SHT4x + DS18B20 防水温度探头 + 电容式土壤含水探头 + 翻斗雨量计；远距离可改 LoRa 节点。

- 土壤水分先做“干土—目标湿度—饱和”三点标定，输出更适合作相对趋势而不是未经标定的体积含水率。
- 不买裸铜电阻式叉形探头做长期部署，它会电解腐蚀；电容探头也需选择封边、防水处理可靠的版本。
- 温湿度传感器需要防辐射罩、通风和防凝露设计，不能简单塞进完全密封盒。
- 太阳能节点优先考虑 LiFePO₄、适配的太阳能充电器、负载开关和深度睡眠；先测整板休眠电流，因为开发板上的电源灯和稳压器可能比传感器更耗电。

**难度**：中到高。**通信**：有稳定 Wi-Fi 用 ESP32-C6；距离远、数据量小且法规允许时用 LoRa。

### 方案 F：称重、用电或设备状态监测

**组合 1**：ESP32-C6 + 5/20 kg 应变片称重传感器 + HX711，用于智能粮桶、蜂箱或余量监测。

**组合 2**：ESP32-C6 + INA219/INA226，用于低压直流设备的电压、电流和功率记录。

**组合 3**：ESP32-C6 + 霍尔开关/光电开关/编码器，用于转速、次数、开合状态和设备运行时长。

- 称重结构的机械设计往往比代码更关键：受力方向、固定方式、偏载、温漂和蠕变都会影响结果，必须用已知砝码做两点或多点校准。
- INA219/INA226 只适合其额定共模电压和分流器范围内的低压直流测量；不要直接测市电。市电能耗优先采购隔离、认证的成品电表或模块。

**难度**：低到中；涉及市电则风险显著提高，不建议作为入门项目。

## 用什么语言，代码怎样运行

ESP32-C6 最常用的是 **C/C++**，也可以运行 MicroPython：

| 开发方式 | 语言 | 适合谁 | 特点 |
|----------|------|--------|------|
| Arduino IDE / PlatformIO + Arduino Core | C++ | 初学者、传感器原型 | 库多、示例多、`setup()`/`loop()` 模型简单；ESP32-C6 已获稳定支持 |
| ESP-IDF | C 为主，也支持 C++ | 正式产品、Matter/Thread、复杂联网与低功耗 | 乐鑫官方框架，可完整使用 FreeRTOS、网络栈和芯片功能，配置与工程结构更复杂 |
| MicroPython | Python | 快速实验、交互式学习 | 修改和验证快，但执行速度、内存效率和驱动覆盖不如编译型 C/C++ |

第一次使用建议选择 **Arduino IDE + C++**。它的运行过程是：

1. 在电脑上写 C++ 源码。
2. Arduino 工具链把源码交叉编译成 ESP32-C6 能执行的 RISC-V 机器码固件。
3. 用 USB 把固件烧录到开发板的 Flash。
4. 开发板复位后，Boot ROM/Bootloader 从 Flash 加载程序；断开电脑再通电，程序仍会自动运行。
5. USB 串口只负责烧录、查看日志和调试，不是让电脑代替开发板执行代码。

最小 Arduino 程序：

```cpp
void setup() {
  Serial.begin(115200);
}

void loop() {
  Serial.println("Hello from ESP32-C6");
  delay(1000);
}
```

最短上手步骤：

1. 安装 Arduino IDE，在“开发板管理器”安装 Espressif 的 `esp32` 平台。
2. 用可传数据的 USB 线连接开发板。
3. 在“工具 → 开发板”选择板子的准确型号；没有专用条目时通常选择 `ESP32C6 Dev Module`。
4. 在“工具 → 端口”选择新出现的串口。
5. 粘贴上面的程序，点击“上传”，然后打开串口监视器并设为 115200 波特率。
6. 如果连接失败，按住 `BOOT`，短按一次 `RESET`，松开 `BOOT` 后重试；官方 C6 开发板通常能自动进入下载模式。

乐鑫官方 Arduino 文档确认 ESP32-C6 受稳定版本支持，并推荐通过开发板管理器安装。[Arduino ESP32 入门](https://docs.espressif.com/projects/arduino-esp32/en/latest/getting_started.html) 如果转向正式产品，ESP-IDF 的典型命令流程是 `idf.py set-target esp32c6`，随后执行 `idf.py -p PORT flash monitor` 完成编译、烧录与日志监视。[ESP-IDF ESP32-C6 入门](https://docs.espressif.com/projects/esp-idf/en/stable/esp32c6/get-started/index.html) MicroPython 也提供 ESP32-C6 官方固件下载和 `esptool` 烧录说明。[MicroPython ESP32-C6](https://www.micropython.org/download/ESP32_GENERIC_C6/)

### 如果希望使用 Node.js / JavaScript

ESP32-C6 只有数百 KB 片上 RAM，也不运行 Linux，因此不能直接安装或运行完整的 Node.js、V8 和任意 npm 包。可选架构有两种：

| 架构 | 代码运行位置 | 推荐度 | 适用情况 |
|------|--------------|--------|----------|
| **Moddable SDK / XS** | JavaScript 字节码直接运行在 ESP32-C6 | 有明确 JS 需求时推荐 | 传感器、网络、小屏 UI；接受嵌入式 API 而非 Node API |
| **Node.js + ESP32 固件** | Node.js 在电脑、树莓派或服务器；C6 运行 Arduino/ESP-IDF | 默认推荐 | 希望使用 npm、数据库、Web 框架、Home Assistant/MQTT |

Moddable SDK 的 XS 引擎专为内存受限的微控制器设计：JavaScript 会先在电脑上编译成字节码，再烧录到芯片执行。其 2026 年官方文档明确列出 ESP32-C6 支持，构建目标为 `esp32/esp32c6`。[Moddable ESP32 文档](https://www.moddable.com/documentation/devices/esp32) XS 高度兼容 ECMAScript，但不是 Node.js：没有完整的 `fs`、`child_process`、Node 原生插件和通用 npm 运行环境，硬件与网络应使用 Moddable 提供的模块。[XS 与桌面 JavaScript 的差异](https://www.moddable.com/documentation/xs/XS%20Differences)

更稳妥的 Node.js 方案是把职责拆开：

```text
传感器 → ESP32-C6 固件 → MQTT/HTTP/WebSocket → Node.js 服务
```

这样 ESP32-C6 负责实时采样、控制、断网缓存和低功耗；Node.js 负责 npm 包、数据库、Web API、图表、规则和消息通知。如果项目要求 Node.js 本身就在设备内运行，应把主控换成能运行 Linux 的 Raspberry Pi 等单板机，再把 ESP32-C6 作为低功耗传感器节点或实时控制协处理器。

### Raspberry Pi 与 ESP32 的区别

通常所说的 Raspberry Pi 4/5、Zero 是单板计算机，能运行 Linux；ESP32 是微控制器，主要运行一个烧录好的固件。Raspberry Pi Pico/Pico 2 则是微控制器，分类上反而更接近 ESP32。

| 维度 | Raspberry Pi 单板机 | ESP32 |
|------|---------------------|-------|
| 本质 | 小型完整电脑 | 微控制器 |
| 系统 | Linux，可同时运行多个进程 | 固件 + RTOS/事件循环，通常围绕一个嵌入式应用 |
| 常用语言 | Node.js、Python、Go、Java、C/C++ 等 | C/C++、MicroPython、嵌入式 JavaScript 等 |
| 内存与存储 | GB 级 RAM，microSD/SSD | 数百 KB 片上 RAM，MB 级 Flash；部分型号可带 PSRAM |
| 启动 | 通常数秒到数十秒 | 通常毫秒级 |
| 功耗 | 通常瓦级 | 活跃时通常远低于树莓派，并支持微安级芯片深睡眠 |
| 实时控制 | Linux 默认不是硬实时，GPIO 时序可能抖动 | 更适合精确定时、PWM、ADC、传感器与电机控制 |
| 联网与应用 | 可直接运行数据库、Web 服务、Docker 和完整 npm | 适合 MQTT/HTTP 客户端或轻量服务器，不能运行完整 Node.js |
| 断电风险 | SD 卡和文件系统需正常关机或做只读保护 | 固件设备通常可直接断电，但仍需保护正在写入的数据 |

选择原则：只做传感器、开关、电机、低功耗电池设备时优先 ESP32；需要摄像头视觉、完整 Node.js、数据库、复杂网页或多个服务时优先 Raspberry Pi；既要 Linux 应用又要可靠实时控制时，两者组合往往最好。

## 第一批采购清单

建议少量、成体系购买，先让每个模块都能独立工作：

1. ESP32-C6 开发板 ×2，其中一块可用于排查主控损坏或做网关。
2. SHT40 或 SHT45、VEML7700、VL53L1X 各 1 个，优先选 Qwiic、STEMMA QT、Grove 等带连接器的模块。
3. 0.96/1.3 英寸 I²C OLED、面包板、硅胶线、JST 线、逻辑分析仪和质量可靠的 USB 线。
4. 根据项目只加一个专项传感器：空气质量选 SCD41；运动选 ICM-42688-P；存在感知选 24 GHz 毫米波；称重选称重片 + HX711。
5. 需要电池时再买带保护锂电池、合适的充电/稳压模块和 USB 功率计；不要一开始就同时调传感器、无线和电池管理。

## 接口与工程规则

| 接口 | 适合 | 关键风险 |
|------|------|----------|
| I²C | 低速环境传感器、显示屏、短距离板内连接 | 地址冲突、上拉过多、线过长、3.3/5 V 电平不一致 |
| SPI | IMU、高速 ADC、屏幕、短距离高速连接 | 占用引脚多，每个设备通常需要独立片选 |
| UART | GPS、颗粒物、毫米波、调试串口 | 电平与波特率，TX/RX 要交叉 |
| 1-Wire | DS18B20 等温度探头 | 长线拓扑、上拉、电源方式与抗干扰 |
| 模拟 ADC | 土壤、光敏、电位器、部分气体模块 | MCU ADC 精度、参考电压、噪声和输入范围；高精度时用外置 ADC |

工程上建议遵循以下顺序：

1. 用 USB 供电，每次只接一个传感器，先跑厂商或成熟库的最小示例。
2. 扫描 I²C 地址，记录模块电压、地址、采样周期和单位。
3. 写入时间戳并同时保存原始值和换算值，暂时不要过度平滑数据。
4. 加入断线、超时、CRC、异常值和传感器预热处理。
5. 在真实外壳和安装位置与可信参考仪器对照，再做校准。
6. 最后才加入电池、深度睡眠、OTA 和云端服务。

## 不建议默认购买的“常见模块”

| 模块 | 何时还能用 | 为什么不作为默认推荐 |
|------|------------|----------------------|
| DHT11 | 课堂演示、验证数字 IO | 精度、分辨率、刷新率和一致性有限；SHT4x 更适合认真记录 |
| DHT22 | 已有库存、低预算演示 | 比 DHT11 好，但体积、响应和长期一致性通常不如新一代数字温湿度模块 |
| MQ-2/MQ-135 等 | 学习加热型气敏电阻、粗略检测显著变化 | 功耗高、需预热与标定、交叉敏感，不能凭单一电压可靠识别或定量某种气体 |
| HC-SR04 | 室内大目标、厘米级教学测距 | 体积大、盲区与声学反射明显，常见模块回波为 5 V；紧凑项目优先 ToF |
| 裸铜电阻式土壤探针 | 短时实验 | 通电后易腐蚀，盐分也显著影响读数 |
| BME688 的 eCO₂ | 观察空气质量趋势 | 是从气体响应推算的等效值，不是真 CO₂ 浓度 |

## 推荐起步路径

如果还没确定具体目标，直接做方案 A，并按四个里程碑推进：

1. SHT40/SHT45 每 10 秒串口输出温湿度。
2. OLED 显示当前值、24 小时极值和露点。
3. Wi-Fi 通过 MQTT 上报，断网时继续本地采样。
4. 加外壳并与参考温湿度计对照 48 小时，修正自热和安装误差。

完成后，主控、I²C、显示、联网、数据记录、外壳和校准这条完整链路都已走通；后续换成 CO₂、距离、姿态或称重传感器，工程方法基本相同。
