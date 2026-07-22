# 工厂类大屏 Dashboard：开源项目与酷炫 UI 设计（按行业）

## 高密度摘要

- **一句话结论**：没有一个开源项目能同时做好工业协议、设备模型、实时计算、告警、权限和“酷炫大屏”；最稳妥的路线是按场景组合“工业数据底座 + 可视化层”，而不是直接套一个 1920×1080 模板。
- **核心机制**：现场协议与边缘采集负责拿到可信数据，SCADA/IoT/UNS 平台负责资产、规则和告警，Grafana、FlowFuse、DataGear 等负责看板；电视大屏只做态势总览，控制动作放在有权限、确认和审计的操作端。
- **判断入口**：要接 PLC/OPC-UA/Modbus，先看 FUXA、ThingsBoard、Rapid SCADA；要做跨工厂数据骨干，看 United Manufacturing Hub；要做能源管理，看 OpenEMS；已有数据库只缺经营驾驶舱，看 DataGear 或 DataEase。
- **常见误区**：GitHub 上“能打开的蓝色大屏”不等于工业系统；Dribbble/Behance 效果图不等于有源码；霓虹、3D 地球和持续动效也不等于态势感知。
- **相关文档**：[技术索引](../technology.md)、[前端资源](./frontend.md)、[AntV 信息图表](../a/antv-infographic.md)。

> 调研日期：2026-07-19。版本、许可证与维护状态以当天官方仓库或项目页面为准；正式商用前仍需重新核对许可证、社区版/商业版边界和安全公告。

## 先给选型结论

| 需求 | 首选 | 备选 | 原因 |
|---|---|---|---|
| 快速接 PLC，画工艺流程和设备 HMI | [FUXA](https://github.com/frangoteam/FUXA) | [Rapid SCADA](https://github.com/RapidScada/scada-v6) | 都是真正的工业监控底座，不是静态大屏模板 |
| 多设备、多客户、规则链、告警和 SCADA Dashboard | [ThingsBoard CE](https://github.com/thingsboard/thingsboard) | [OpenRemote](https://github.com/openremote/openremote) | 资产模型、遥测、规则与看板较完整 |
| 跨产线/跨工厂建设 Unified Namespace | [United Manufacturing Hub](https://github.com/united-manufacturing-hub/united-manufacturing-hub) + [Grafana](https://github.com/grafana/grafana) | ThingsBoard | UMH 强在数据摄取、语义化、存储和断网缓冲，Grafana 强在展示与告警 |
| 光伏、储能、充电、负载协同 | [OpenEMS](https://github.com/OpenEMS/openems) | Emoncms + Grafana | OpenEMS 有现场 Edge、Backend、UI 与控制算法 |
| 一条产线或小工厂低代码 PoC | [Node-RED](https://github.com/node-red/node-red) + [FlowFuse Dashboard](https://github.com/FlowFuse/node-red-dashboard) | FUXA | 上手快，适合 OEE、安灯和环境监控原型 |
| 数据已经在 MySQL/ClickHouse/API，只缺经营大屏 | [DataGear](https://github.com/datageartech/datagear) | [DataEase](https://github.com/dataease/dataease) | 拖拽/源码看板和多数据源能力强，但不负责 PLC 接入 |
| 要做独特的 4K 视觉、关系图和流程动画 | [Apache ECharts](https://github.com/apache/echarts) + 任一数据平台 | GoView 原型 | ECharts 自由度与生态更强；GoView 出原型更快但不是生产平台 |
| 园区车辆、矿卡、叉车、外部物流轨迹 | [Traccar](https://github.com/traccar/traccar) | OpenRemote | Traccar 专注 GPS/车队，OpenRemote 适合车辆与其他园区资产统一管理 |

## 研究口径：先分清三种东西

| 类型 | 能解决什么 | 不能假设什么 |
|---|---|---|
| **工业/业务平台** | 协议接入、资产、数据存储、规则、告警、权限，部分带可视化 | 默认就有适合本企业的 KPI、工艺语义和安全认证 |
| **可视化/低代码底座** | 从数据库或消息流做图表、页面、联动和告警 | 能直接控制 PLC，或理解设备、批次、工单和质量语义 |
| **视觉设计案例** | 提供布局、配色、图表与交互灵感 | 有源码、真实数据、远距离可读性或 24×7 生产验证 |

## 已核验的开源项目

### 工业与行业平台

| 项目 | 类型与技术 | 许可证 | 维护信号 | 最适合 | 主要边界 |
|---|---|---|---|---|---|
| [FUXA](https://github.com/frangoteam/FUXA) | Web SCADA/HMI；Node.js、Angular、SVG；Modbus、OPC-UA、MQTT、S7、BACnet 等 | MIT | [v1.3.3](https://github.com/frangoteam/FUXA/releases/tag/v1.3.3)，2026-06-21 | 设备接入、工艺流程图、实时监控、历史数据 | 大规模权限、审计、冗余和项目治理要单独验证 |
| [ThingsBoard CE](https://github.com/thingsboard/thingsboard) + [Gateway](https://github.com/thingsboard/thingsboard-gateway) | IoT/SCADA；Java、Angular；设备/资产、遥测、规则链、告警、Dashboard | Apache-2.0 | [4.3.1.3](https://github.com/thingsboard/thingsboard/releases/tag/v4.3.1.3)，2026-06-30 | 多站点、多设备、客户门户、规则驱动告警 | 部署复杂度较高；先核对 CE 与 PE 的 HA、白标及高级能力边界 |
| [Rapid SCADA 6](https://github.com/RapidScada/scada-v6) | 工业自动化平台；C#；SCADA、IIoT、过程控制、能源计量 | 核心 Apache-2.0 | [v6.4.7](https://github.com/RapidScada/scada-v6/releases/tag/v6.4.7)，2026-06-23 | Windows/.NET 团队、分布式 SCADA、MES 二开 | Dashboard、Chart Pro、Map 等部分模块可能付费，不能把完整方案都视为开源 |
| [United Manufacturing Hub](https://github.com/united-manufacturing-hub/united-manufacturing-hub) | 制造数据平台/UNS；Go、Benthos-UMH、Redpanda；Classic 含 TimescaleDB、Node-RED、Grafana | Apache-2.0 | v0.44.29，2026-07-14 | 工厂数据骨干、边缘缓冲、跨产线语义统一 | Core 更像数据平面而非成品大屏；完全离线时先核对管理控制面依赖 |
| [Apache StreamPipes](https://github.com/apache/streampipes) | IIoT 数据/流处理；Java、Angular，可扩展 Python/TypeScript；OPC-UA、S7、Modbus、MQTT | Apache-2.0 | 0.98.0，2025-12-15；2026-07 仍活跃 | 钢铁、矿山、能源的采集、清洗、流处理和 Charts/Data Explorer | 视觉精致度需定制；不要依赖已迁移路线的旧 Live Dashboard |
| [OpenEMS](https://github.com/OpenEMS/openems) | 能源管理；Java、TypeScript；Edge、Backend、UI | Edge/Backend：EPL-2.0；UI：AGPL-3.0 | [2026.7.0](https://github.com/OpenEMS/openems/releases/tag/2026.7.0)，2026-07-01 | 光伏、储能、充电、热泵、峰谷电价与微网 | 学习和设备适配成本高，不适合只想快速换皮的项目 |
| [FlexMeasures](https://github.com/FlexMeasures/flexmeasures) | 能源灵活性/调度；Python、Flask、PostgreSQL、Vega | Apache-2.0 | v0.33.1，2026-07-03 | 电池、EV、热泵、需求响应、价格和约束优化 | 内置 UI 主要服务开发/分析，生产大屏通常需另做前端 |
| [OpenRemote](https://github.com/openremote/openremote) | IoT 资产平台；Java、Groovy、TypeScript；规则、地图、车队、能源、Insights | AGPL-3.0-or-later | [1.26.2](https://github.com/openremote/openremote/releases/tag/1.26.2)，2026-07-15 | 园区资产、能源、车队、环境监测的统一门户 | AGPL 网络使用义务需评估；工业协议覆盖要按现场设备核对 |
| [Traccar](https://github.com/traccar/traccar) | GPS/车队平台；Java 后端及独立 Web App；200+ 协议、2000+ 设备 | Apache-2.0 | v6.14.5，2026-06-18 | 矿卡、叉车、园区车辆、外部物流和地理围栏 | 不是 WMS，也不管理库存、库位或生产工艺；只使用已修复安全问题的新版本 |
| [Emoncms](https://github.com/emoncms/emoncms) | 能源/环境数据 Web 应用；PHP、MySQL/MariaDB、Redis | AGPL-3.0 | [11.15.15](https://github.com/emoncms/emoncms/releases/tag/11.15.15)，2026-06-15 | 电力、温度、环境数据的处理、记录和可视化 | 更接近能源监测，不是复杂 MES、SCADA 或多租户 IoT 平台 |

### 可视化、BI 与低代码层

| 项目 | 类型与技术 | 许可证 | 维护信号 | 最适合 | 主要边界 |
|---|---|---|---|---|---|
| [Grafana](https://github.com/grafana/grafana) | 指标、日志、时序数据看板与告警；Go、TypeScript | AGPL-3.0-only，部分 Apache-2.0 例外 | 13.1.0，2026-07-01 | InfluxDB、TimescaleDB、Prometheus、SQL 上的实时监控 | 不负责 PLC 接入、资产模型和工艺控制；商业插件另算 |
| [Apache ECharts](https://github.com/apache/echarts) | 定制图表与 4K 视觉层；TypeScript、Canvas/SVG、自定义系列和动画 | Apache-2.0 | v6.1.0，2026-05-19 | 产线流、物流路径、设备节拍、OEE、能耗与高度定制页面 | 只是图表库；认证、协议、数据、告警、权限和持久化均需自行实现 |
| [FlowFuse Dashboard](https://github.com/FlowFuse/node-red-dashboard) | Node-RED Dashboard 2.0；HTML、JavaScript、Vue；图表、主题、自定义组件 | Apache-2.0 | v1.30.2，2026-01-21 | 小中型产线、边缘设备、OEE/安灯 PoC | 官方路线图仍在追平旧版 Dashboard 的部分能力 |
| [DataGear](https://github.com/datageartech/datagear) | 数据可视化平台；Spring Boot、Vue 3、PrimeVue、ECharts；可视/源码双模式 | GPL-3.0 / LGPL-3.0，按模块核对 | README 宣布 6.0.0；GitHub 无 Releases | 需要 HTML/CSS/JS 自由度、联动、钻取、实时图表和响应式大屏 | 工业协议、告警生命周期和控制能力需外接；版本审计要适配其官网发布流程 |
| [DataEase](https://github.com/dataease/dataease) | 拖拽式 BI；Vue、AntV、Spring Boot、MySQL、Calcite | GPL-3.0 | v2.10.23，2026-05-28 | 经营分析、质量/产量/成本驾驶舱和多数据源 BI | 不是实时 SCADA；X-Pack 标识能力属于企业版 |
| [GoView（Dromara）](https://gitee.com/dromara/go-view) | 纯前端拖拽大屏；Vue 3、TypeScript、Vite、Naive UI、ECharts/VChart | MIT | 无正式 GitHub Release；Gitee 2026-07-16 仍有推送 | 快速制作“酷炫管理驾驶舱”原型 | 无完整后端、权限和工业协议；依赖、安全与发布治理需自行补齐 |
| [AJ-Report 社区延续版](https://gitee.com/belief-team/report) | 数据库驱动大屏设计器；Spring Boot、Vue 2.7、ECharts、SQL 数据集 | Apache-2.0 | v1.7.1，2025-08-08；2026-02 仍有推送 | MES/ERP/质量数据库的非开发拖拽大屏 | Vue 2 技术栈较旧，维护放缓；脚本、SQL 和分享权限需重点加固 |
| [DataV-Team/DataV](https://github.com/DataV-Team/DataV) | Vue 大屏装饰组件；SVG 边框、水位图、飞线图、轮播表 | MIT | 45 tags，但未核验最新日期 | 参考国内“科技蓝”视觉和少量装饰组件 | Vue 2 风格、个人兴趣项目、TODO 仍含 TS 重构；不建议作为新系统核心依赖 |

### 业务系统：可作为大屏的权威数据源

这些项目解决库存、农业记录、医药供应链或实验室流程；它们不是电视大屏或 SCADA，但比在看板中重复造业务模型更可靠。

| 项目 | 行业与能力 | 许可证 / 技术 | 维护信号 | 作为大屏数据源时的边界 |
|---|---|---|---|---|
| [OpenBoxes](https://github.com/openboxes/openboxes) | 仓储/医药物资；库存、库位、批次、效期、收发货、缺货、fill rate | EPL-1.0；Grails/Spring/Hibernate/MySQL/React | v0.9.7-hotfix1，2026-04-23 | 是 WMS，不是 MES/SCADA；运营页面需重做远距离展示 |
| [OpenLMIS Reference Distribution](https://github.com/OpenLMIS/openlmis-ref-distro) | 医药/医疗供应链；申领、库存、批号、履约、冷链设备、设施地图 | AGPL-3.0；Java/Spring 微服务与 JavaScript UI | v3.19.2，2025-11-28 | 部署较重且偏公共卫生；分析屏依赖独立报表链路 |
| [farmOS](https://github.com/farmOS/farmOS) | 农业/温室/养殖；地块、资产、作业、传感器和追溯记录 | GPL-2.0；Drupal/PHP、JavaScript、JSON:API | v3.5.2，2026-04-16 | 更像农业记录系统；实时 IoT 与 OEE 需外接 |
| [SENAITE LIMS](https://github.com/senaite/senaite.core) | 食品、制药、环境实验室；样品、批次、仪器、规格、OOS 和周转时间 | GPL-2.0；Plone/Zope、Python、JavaScript | v2.6.0，2025-04-04；2026 仍有开发活动 | LIMS 开源不等于自动满足 GxP、21 CFR Part 11 等验证要求 |

## 按行业分组

### 1. 通用制造、汽车、3C 与离散制造

**应该回答的问题**：今天是否按节拍完成？哪条线、哪台设备、哪种停机原因正在拖累 OEE、一次合格率和交付？

| 层级 | 推荐项目 | 关键对象与指标 |
|---|---|---|
| 单机/单线 HMI | FUXA 或 Rapid SCADA | 设备状态、节拍、当前工单、故障、参数趋势 |
| 多线 IoT | ThingsBoard + Gateway | 设备/产线资产树、遥测、规则链、安灯和通知 |
| 跨厂数据骨干 | UMH + TimescaleDB/Grafana | UNS、OEE、产量、停机、良废品、跨厂对标 |
| 流式计算与数据探索 | Apache StreamPipes + Grafana | OPC-UA/S7/Modbus/MQTT、规则计算、状态热图与趋势 |
| 小型 PoC | Node-RED + FlowFuse Dashboard | MQTT/OPC-UA 数据、OEE、安灯、班次报表 |
| 经营驾驶舱 | DataGear 或 DataEase | 订单达成、WIP、质量、成本、交付和库存 |
| 定制 4K 视觉 | ECharts + 上述任一平台 API | 产线流、设备关系、物流路径和专用图形 |

推荐的 16:9 总览布局：顶部 4–6 个 KPI；中央放产线流程/车间平面；左侧放计划与产量、质量；右侧放设备状态与分级告警；底部放小时趋势、停机 Pareto 和最新事件。

视觉参考：

- [FlowFuse OEE Dashboard 教程](https://flowfuse.com/blog/2025/04/building-oee-dashboard-with-flowfuse-part-3/)：少数同时提供实现过程与真实 OEE 结构的案例，优先参考。
- [Machine Monitoring Dashboard](https://dribbble.com/shots/16576057-Machine-Monitoring-Dashboard)：借鉴按产线分组的设备状态卡、停机原因和剩余时间；电视屏应去掉桌面侧栏。
- [Industrial Monitoring Dashboard Case Study](https://www.behance.net/gallery/246547267/Industrial-Monitoring-Dashboard-UIUX-Case-Study)：借鉴清晰层级和制造环境的决策路径。
- [Production Analysis Dashboard](https://www.behance.net/gallery/146811759/Production-Analysis-Dashboard)：适合作为管理层产量、质量和可用率入口，不替代现场 HMI。
- [Siemens WinCC OA 电池生产工程指南（PDF）](https://support.industry.siemens.com/cs/attachments/109955740/ProductionManagementForBatteriesEngineeringGuideline_V1_2_en.pdf)：真实工程参考，借鉴工序树、设备/OEE、持久告警栏和克制状态色。
- [Tulip：6 类制造 Dashboard](https://tulip.co/blog/6-manufacturing-dashboards-for-visualizing-production/)：借鉴超大 KPI、目标/实际、设备矩阵和逐层下钻。
- [Grafana + Factry Historian](https://grafana.com/blog/how-the-factry-historian-data-source-for-grafana-enables-data-driven-insights-for-factory-teams/)：借鉴 ISA-88/95 资产层级、批次、阈值和停机事件上下文。

### 2. 能源电力、光伏、储能与工厂能源管理

**应该回答的问题**：电从哪里来、流向哪里、现在是否平衡，储能是否健康，未来负荷和电价会让系统采取什么动作？

| 场景 | 推荐项目 | 必看指标 |
|---|---|---|
| 光储充/微网控制 | OpenEMS | PV、Grid、Load、ESS 功率流，SOC/SOH，充放电计划 |
| 多站点能源 IoT | ThingsBoard 或 OpenRemote | 站点/设备状态、规则告警、能耗分项、地图 |
| 电力与温度监测 | Emoncms + Grafana | 实时功率、电量、温度、碳排与历史趋势 |
| 柔性负荷/需求响应 | FlexMeasures + 自定义大屏 | 电池/EV/热泵计划、电价、约束、基线和优化结果 |
| 工业能源计量 | Rapid SCADA 或 FUXA | 电表/变频器/保护设备接入、工艺联动与告警 |

中央画面优先使用 **PV → 直流/交流母线 → 储能 → 负载 → 电网** 的能量流；颜色表达来源和方向，但功率、方向箭头和文字必须同时存在。旁边再放 SOC/SOH、需量、功率因数、峰谷成本、预测与异常。

视觉参考：

- [AI-Powered Solar Management Dashboard](https://dribbble.com/shots/27322978-AI-Powered-Solar-Management-Dashboard)：最值得借鉴的是 Solar/Grid/Home/Battery 能量流，而不是玻璃拟态。
- [Next-Gen Power Grid Dashboard](https://dribbble.com/shots/26698408-Next-Gen-Power-Grid-Dashboard)：适合电网/多能源总览的暗色气氛和来源编码。
- [SolnEst Solar Dashboard](https://dribbble.com/shots/27003669-SolnEst-Solar-Energy-Dashboard-Power-Monitoring)：可借鉴低认知负担的发电、储能和用电结构，工业版需要加强告警与设备层级。
- [ThingsBoard Smart Energy 官方案例](https://thingsboard.io/use-cases/smart-energy/)：设备总览、实时数据、能耗趋势与告警；普通 Demo 可导出，适合作为 CE 起点。
- [ThingsBoard SCADA Energy](https://thingsboard.io/use-cases/scada-energy-management/)：中性灰 HMI、能流和设备详情值得参考；完整 Solution Template 属于 PE，不能当成 CE 开源模板。

### 3. 石油化工、钢铁、矿山与流程工业

**应该回答的问题**：工艺是否在安全包络内？异常会沿哪条物料/能量路径扩散？哪台关键设备、哪支车队正在形成安全或产能风险？

| 子场景 | 推荐项目 | 中央视觉对象 |
|---|---|---|
| 油气、化工、冶炼流程 | FUXA 或 Rapid SCADA + Grafana | PFD/P&ID 简化流程、关键回路、联锁与报警 |
| 多装置/多站点 IIoT | ThingsBoard 或 StreamPipes | 装置资产树、流处理、站点地图、设备健康与规则链 |
| 矿区车队与重型设备 | Traccar 或 OpenRemote | 采区地图、车辆位置、active/idle/down、油耗和载荷 |
| 经营层驾驶舱 | DataGear/DataEase | 产量、收率、能耗、库存、订单与成本 |

必须拆成至少三类屏：**工艺操作屏**、**设备/车队健康屏**、**经营总览屏**。不要把联锁/报警、产量和供应链塞进同一视觉层级。

视觉参考：

- [SCADA Dashboard – Industrial Monitoring](https://www.behance.net/gallery/75053039/SCADA-Dashboard-UXUI-for-Industrial-Monitoring)：油、水、气通用的设备状态与即时告警结构。
- [MineralSoft Oil & Gas Operations](https://dribbble.com/shots/27272867-MineralSoft-Oil-Gas-Operations-Dashboard-UI)：借鉴产量、设备健康和预测维护分区；降低玻璃拟态透明度以保证对比。
- [Mining Dashboard Design Concept](https://dribbble.com/shots/24184064-Mining-Dashboard-Design-Concept)：借鉴地图、产量、设备和动态告警的组合。
- [CoreFleet Heavy Equipment Dashboard](https://dribbble.com/shots/26310862-CoreFleet-Smart-Fleet-Monitoring-Dashboard-UI)：借鉴利用率、油耗、项目时间线和分级告警。
- [Oil Refinery Dashboard](https://www.behance.net/gallery/225517839/Oil-Refinery-Dashboard)：只适合经营/供应链层，不可直接当 SCADA 工艺屏。
- [ThingsBoard Oil & Gas Drilling SCADA](https://thingsboard.io/use-cases/scada-oil-and-gas-drilling-system/)：钻机、泵、泥浆罐、流向和设备告警的完整信息架构；完整模板属于 PE，只作视觉/商业方案参考。
- [Live Mineral Mining Dashboard](https://www.behance.net/gallery/197798643/Live-Mineral-Mining-Dashboard-UI-with-Dark-Mode)：借鉴中央现场地图/3D、矿卡、设备、限制区和地理围栏；3D 只有在空间定位有价值时使用。
- [Steel Factory Management Dashboard](https://dribbble.com/shots/26610087-Steel-Factory-Management-Dashboard-UI)：暖白、鼠尾草绿与陶土色提供了“非科技蓝”路径，适合厂长经营屏。

### 4. 仓储物流、厂内运输与园区控制塔

**应该回答的问题**：货、车、人和机器人在哪里？哪个库位、月台或路径正在拥堵？订单是否会按承诺时间出库？

| 场景 | 推荐项目 | 关键指标 |
|---|---|---|
| AMR/AGV、叉车和园区车辆 | Traccar、OpenRemote 或 ThingsBoard | 位置、任务、电量/油量、载荷、健康、路线与地理围栏 |
| 仓储业务数据 | OpenBoxes + DataGear/Grafana | 入库/出库、库位、批次、效期、库存准确率、订单周期、延误 |
| 纯经营分析 | DataGear 或 DataEase | 吞吐、OTIF、库容、缺货、拣选积压和成本 |
| 设备/传感器快速接入 | Node-RED + FlowFuse | 门禁、月台、称重、温湿度、输送线和简单告警 |
| 园区统一态势 | ThingsBoard/OpenRemote + Grafana | 地图、资产、事件、历史趋势和多站点对比 |

中央区域应是仓库平面、物流拓扑或园区地图；左右只保留吞吐、库容、任务和异常。轨迹线只显示当前任务或拥堵路径，避免同时播放全部历史轨迹。

视觉参考：

- [Floware Smart Warehouse](https://dribbble.com/shots/27213762-Floware-Clean-Smart-Warehouse-Management-Dashboard-UI-Design)：仓库空间 + 机器人电量、温度、载荷和任务进度。
- [Logistics Management Dashboard](https://dribbble.com/shots/21072405-Logistics-Management-Dashboard)：车队、订单和 mobile robot/forklift/worker 三类运力的控制塔结构。
- [Warehouse Management Dashboard 搜索页](https://dribbble.com/search/warehouse-management-dashboard)：适合广泛浏览，但每个作品都需重新判断是否只是概念稿。
- [Warehouse Management Dashboard（Behance）](https://www.behance.net/gallery/242693227/Warehouse-Management-Dashboard-UI-Design-project)：借鉴“计划 → 风险/瓶颈 → 待处理动作”的决策链。
- [WareHub Warehouse Logistics Dashboard](https://www.behance.net/gallery/215261729/WareHub-Warehouse-Logistics-Dashboard)：适合参考轻色信息层级、库存/订单/作业区和仓库空间感。

### 5. 环境、水务、污水与固废处理

**应该回答的问题**：水、气、废弃物在流程中的量与质量是否达标？哪台泵阀或哪一处理阶段导致超限、能耗或回用率恶化？

| 场景 | 推荐项目 | 关键对象 |
|---|---|---|
| 水厂/污水厂工艺运行 | FUXA 或 Rapid SCADA | 池体、泵阀、液位、流量、压力、pH、COD、氨氮、浊度 |
| 多站点环境传感 | ThingsBoard 或 OpenRemote | 站点地图、传感器、数据质量、阈值与通知 |
| 能耗/温度/环境趋势 | Emoncms + Grafana | 时间序列、分项能耗、排放和长期基线 |
| 企业水资源/ESG 经营屏 | DataGear/DataEase | 取水、用水、回用、排放、强度和目标达成 |

水务经营屏和工艺运行屏不要混用：前者以来源、用量、回用率和趋势为主；后者以流程、泵阀状态、关键水质和超标响应为主。

视觉参考：

- [AquaCheck Water Management](https://dribbble.com/shots/27076643-AquaCheck-Water-Management-Dashboard-UI)：适合企业取水、用水、回用和水源分布。
- [Water Operation Monitoring System](https://dribbble.com/shots/6110383-Water-operation-monitoring-system)：轻色水处理监控方向；状态必须再配文字/图标。
- [Industrial Waste Monitoring Dashboard](https://dribbble.com/shots/26199836-Industrial-Waste-Monitoring-Dashboard-UI-UX)：按处理阶段展示物料、水分、能耗和废水，是很好的流程链参考。
- [VASTER Waste Water Management Dashboard](https://www.behance.net/gallery/183776463/VASTER-Waste-Water-Management-Dashboard)：中央工艺流程、两侧设备/告警、底部趋势的完整污水大屏结构。

### 6. 智慧农业、食品与医药制造

**应该回答的问题**：农业要看环境与地块，食品要看批次、关键控制点和冷链，医药要看洁净环境、偏差和审计；三者不能套同一套“绿色农业大屏”。

| 子行业 | 推荐项目 | 大屏核心 |
|---|---|---|
| 温室/智慧农业 | farmOS + ThingsBoard/OpenRemote | 地块/温室、作业记录、土壤水分、灌溉、气象、作物健康 |
| 食品加工 | FUXA/ThingsBoard + Grafana | 批次、温度、产量、收率、CCP、清洗消毒、冷链和追溯 |
| 医药供应链/实验室 | OpenLMIS 或 SENAITE + 只读可视化层 | 批号、冷链、样品、仪器、OOS/OOT、放行与周转时间 |
| 医药/洁净室 IoT | ThingsBoard/FUXA + 受控数据层 | 温湿度、压差、粒子、设备、批次、偏差/CAPA 和审计状态 |
| 管理驾驶舱 | DataGear/DataEase | 订单、批次放行、质量、库存、交付和成本 |

视觉参考：

- [Smart Farming Dashboard](https://dribbble.com/shots/27172426-Smart-Farming-Dashboard)：借鉴作物、灌溉、土壤水分和天气结构；大屏版应把地块/温室放在中央。
- [Pharma AI & IoT Dashboard](https://dribbble.com/shots/26947906-Pharma-AI-IoT-Dashboard-UI-Cleanroom-Equipment-Monitoring)：借鉴洁净室环境与设备诊断分组。
- [Manufacturing Dashboard – WCAG 2.1](https://dribbble.com/shots/27262358-Manufacturing-Dashboard-UI-Design)：适合参考端到端制造、物流与流程的无障碍方向，但仍需现场验证。
- [AgriVision AI Smart Agriculture](https://www.behance.net/gallery/241773665/AI-Smart-Agriculture-SaaS-Platform-UXUI-Case-Study)：借鉴地块地图、作物健康、灌溉与预测式决策。
- [Cold Chain Management Dashboard](https://www.behance.net/gallery/185185679/Cold-Chain-Management-Dashboard-UI-Design)：借鉴温度越界、运输节点和站点状态的统一时间轴。

## 跨行业的 UI 设计模式

| 行业 | 中央主画布 | 左侧信息 | 右侧信息 | 底部信息 |
|---|---|---|---|---|
| 离散制造 | 产线/车间拓扑 | 计划、产量、质量 | 设备状态、安灯、告警 | 小时趋势、停机 Pareto、事件 |
| 能源 | 能量流/单线图 | 发电与预测 | 负荷、储能、告警 | 功率、电量、成本趋势 |
| 化工/水务 | 简化 PFD/P&ID | 进料与关键参数 | 联锁、报警、设备健康 | 趋势、报警时间线 |
| 矿山/物流 | 地图/仓库平面 | 任务、吞吐、库容 | 车队/机器人状态 | 拥堵、延误、维护事件 |
| 农业 | 地块/温室平面 | 天气、灌溉 | 作物/设备健康 | 环境与产量趋势 |
| 医药 | 区域/洁净室平面 | 批次、环境 | 偏差、设备、告警 | 审计与关键参数趋势 |

### “酷炫但可用”的八条规则

1. **先做 5–10 米扫读，再做桌面交互**：主 KPI 不超过 4–6 个；字号、单位、目标和更新时间必须同时可见。
2. **正常态克制，异常态醒目**：背景和正常设备低饱和；黄色/红色留给需要注意或行动的状态。
3. **颜色不能单独编码**：告警同时使用颜色、图标/形状、文字、优先级和时间；色弱用户也能判断。
4. **动效只表达业务变化**：能量/物料流向、设备状态切换和告警出现可以动；装饰性粒子、旋转地球和持续呼吸光应删除。
5. **趋势优先于仪表盘堆叠**：需要判断变化率和历史上下文时用折线/带状区间；仪表只保留少量需要与上下限比较的瞬时量。
6. **把“无数据”当成一种状态**：断线、延迟、估算值和坏点要与正常、停止、故障明确区分，并显示最后更新时间。
7. **显示屏和操作屏分离**：公共大屏默认只读；启停、设定值、联锁旁路等操作放在具备权限、二次确认和审计的终端。
8. **每个告警都要能回答下一步**：显示对象、原因、严重度、持续时间和建议响应，并治理报警洪泛。

暗色屏适合灯光受控的指挥中心和品牌展示；明亮车间通常更适合中性浅灰或中灰底。无论明暗，避免纯黑底 + 大面积高饱和霓虹、细线小字、低透明玻璃卡片和过多发光边框。

## 四套可落地的参考架构

| 规模 | 数据链路 | 适用情况 | 风险点 |
|---|---|---|---|
| 快速 PoC | PLC/传感器 → Node-RED → InfluxDB → FlowFuse/Grafana | 1–20 台设备、验证 OEE/安灯/能耗 | 配置治理、权限、备份和高可用要补齐 |
| 单厂生产 | PLC/OPC-UA/Modbus → FUXA 或 ThingsBoard Gateway → 平台/时序库 → 大屏 | 多产线、设备监控与告警 | OT/IT 网络隔离、协议适配、报警管理、审计 |
| 多厂集团 | Edge → UMH/UNS → Redpanda/TimescaleDB → Grafana + 经营 BI | 多站点、跨厂指标与数据产品 | 统一命名/语义、离线容错、控制面依赖和跨厂权限 |
| 工厂能源 | OpenEMS Edge → OpenEMS Backend/UI → Grafana/经营 BI | 光储充、需量和能源优化 | 设备驱动、控制策略验证、时钟与计量准确性 |

## 上线前核对清单

- [ ] 仓库有明确许可证；依赖、插件、模板、字体、地图和图标也逐项可商用。
- [ ] 社区版确实包含需要的协议、HA、白标、多租户、导出、审计和告警能力。
- [ ] 现场协议、点位量、采样频率、断网缓存、时钟同步和数据质量已做压力测试。
- [ ] 公共大屏只读；OT 网络分区、TLS、最小权限、补丁和备份策略明确。
- [ ] 告警经过优先级、去重、抑制和洪泛测试，并有明确响应人和处置动作。
- [ ] 1920×1080、4K、拼接屏和不同浏览器缩放下都无裁切；断网后能自动恢复。
- [ ] 用实际观看距离、车间光照、色弱模式和 24×7 burn-in 验证字号、对比度和性能。
- [ ] 显示最后更新时间、数据来源、单位、目标/上下限和“无数据/估算/坏点”状态。
- [ ] 配置、Dashboard JSON、规则链和资产模型进入版本控制，具备回滚与灾备演练。

## 不建议直接用于新项目的候选

| 候选 | 原因 |
|---|---|
| [AJ-Report 原仓](https://github.com/anji-plus/report) | README 明确写“本项目暂停维护”；如要评估，应改看上文 `belief-team/report` 社区延续版并接受旧 Vue 技术栈风险 |
| [CBoard 社区版](https://github.com/TuiQiao/CBoard) | 官方功能表显示完整全屏驾驶舱与高度可定制大屏主要在企业版，容易误判社区版能力 |
| GoView 直接进入生产 | 当前 Dromara 主仓可核验且活跃，但它是纯前端原型工具；未补齐后端、RBAC、审计、发布、依赖和安全治理前不应直接上线 |
| 随机 `big-screen` / `datav` 模板 | 常见问题是无许可证、硬编码 mock 数据、固定 1920×1080、旧 Vue 依赖、没有权限/告警/测试 |
| DataV 作为核心框架 | 可作视觉组件参考，但 Vue 2 风格与维护信号不足，不承担数据平台职责 |

## 设计与报警依据

- [ISA-101 Series of Standards](https://www.isa.org/standards-and-publications/isa-standards/isa-101-standards)：覆盖 HMI 设计、实施、运行与维护生命周期，适用于连续、批次和离散行业。
- [EEMUA Publication 191](https://www.eemua.org/products/publications/digital/eemua-publication-191)：工业报警系统设计与管理指南，第四版与 ISA-18.2、IEC 62682:2023 对齐。
- [UK HSE Control Room Design](https://www.hse.gov.uk/comah/sragtech/techmeascontrol.htm)：强调任务分析、人体工学、报警不能只靠颜色、防止报警掩蔽和洪泛，并比较数字、仪表、流程图与趋势图的适用性。

> 本文不是工业功能安全认证或法律意见。石油化工、电力、医药等高风险场景，应由具备相应资质的自动化、安全、质量与合规人员完成 HAZOP、报警哲学、验证和变更管理。
