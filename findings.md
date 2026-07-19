# Findings & Decisions

## Requirements
- I need to add missing major Chinese dynasties/periods to `knowledge/h/history-china.md`.
- I need to create matching content pages, not just nav links.
- I need to keep the existing style: standalone dynasty notes with a title, a short summary block, and chronological sections organized around people and geography.

## Research Findings
- `knowledge/h/history-china.md` currently contains a simple bullet list of dynasty pages.
- Existing pages follow a longform educational format with headings like `## 一、...`, people labels, and historically grounded chronological bullets.
- The current set already includes `商、周、春秋战国、秦、汉、三国、隋、唐、五代十国、宋、元、明、清`.
- The major missing periods are `夏、晋、南北朝、辽、西夏、金`.
- `knowledge/h/history-china-qing.md` is actually the `秦朝` page, so I should not infer meaning from that filename.
- I created six new history pages and added them to the index in chronological reading order.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Create six new markdown files under `knowledge/h/` | Matches the existing content layout |
| Name `金朝` as `history-china-jin-dynasty.md` | Avoid conflict with `晋朝` |
| Keep nav in chronological order by major period emergence | Makes the index easier to scan |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Existing `秦朝` filename uses `qing` | I preserved the current file and linked to it as-is |

## Resources
- `/Users/joel/joel/jarvis/knowledge/h/history-china.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-han.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-sui.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-xia.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-jin.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-nanbeichao.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-liao.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-xixia.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-jin-dynasty.md`

## Visual/Browser Findings
- No browser work was needed.

---

# Findings: 工厂类大屏 Dashboard 开源项目与 UI 设计调研（2026-07-19）

## Requirements

- 搜集工厂/工业场景的大屏 Dashboard 开源项目与高质量 UI 设计。
- 按行业分组，既能做项目选型，也能做视觉参考。
- 最终研究输出写入 `data/`，带高密度摘要并加入技术索引。
- 不覆盖工作树中用户已有的 `data/technology.md` 修改。

## Initial Scope and Criteria

- 行业暂定：通用制造/工业 IoT、汽车与离散制造、能源电力、石油化工、钢铁矿山、物流仓储、环境水务、农业食品/医药。
- 项目分三类：可直接部署的业务平台、适合二次开发的可视化底座、只作视觉参考的设计案例。
- 核验字段：来源链接、场景、技术栈、许可证、维护状态、演示/截图、适用理由、局限。
- UI 评价字段：信息层级、空间组织、实时状态、告警、趋势、地理/流程/设备视图、动效、可读性。

## Repository Context

- `data/readme.md` 要求具体资料进入二级索引；本题属于 `data/technology.md` 的“软件、前端与可视化”。
- 工作树已有用户修改：`data/technology.md`、`data/r/react-maintainable-code-scenarios.md`、`data/t/typescript-7-vs-6.md`，编辑时需做最小增量补丁。

## Research Findings

- 第一轮一手来源确认：
  - FUXA 是真正面向工业现场的 Web SCADA/HMI：Node.js + Angular + SVG，支持 Modbus、OPC-UA、MQTT、Siemens S7 等，MIT；GitHub 显示 2026-04-09 发布 v1.3.1。它比纯大屏模板更接近可落地的“设备接入 + 画面编辑 + 历史数据”底座。
  - OpenEMS 是能源管理全栈，Edge/Backend 为 EPL-2.0，UI 为 AGPL-3.0；覆盖储能、光伏、充电、热泵等，GitHub 显示 2026-05-01 发布 2026.5.0。适合能源行业，不适合仅追求快速换皮。
  - Grafana 是通用实时监控与告警底座，适合工业时序数据，但本身不提供 PLC/SCADA 语义和工艺流程编辑。
  - ThingsBoard Gateway 能接入 Modbus、CAN、BACnet、OPC-UA、MQTT、ODBC、REST，可作为旧设备与 ThingsBoard 的桥；需与主平台一起评估。
- 第一轮视觉来源：
  - Behance 上的 “Industrial Monitoring Dashboard UI/UX Case Study”（2026-03-30）强调制造环境的清晰层级与决策速度，可作为现代浅/深色工业 SaaS 参考。
  - “Factory Management Dashboard”（2023-12-26）偏桌面管理端，适合表格、筛选与明细交互，不等同于远距离观看的大屏。
- 初步判断：工业大屏应优先解决跨距离扫读、告警定位和产线状态；仅有霓虹边框与 3D 地图的模板不能视为业务系统。
- 第二轮核验：
  - ThingsBoard Community Edition（Java + Angular）本身即包含设备/资产管理、遥测、规则链、告警、可定制 Dashboard 与 SCADA 符号；Apache-2.0，GitHub 显示 2026-03-31 发布 4.3.1.1。Gateway 应视为配套组件，不单独算一个“大屏项目”。
  - Rapid SCADA 6 是 C# 工业自动化平台，可做监控、控制、IIoT、过程控制和能源计量；标准版 Apache-2.0，但扩展模块可能使用其他开源或商业许可证，需逐项核对。GitHub 显示 2026-04-14 发布 v6.4.6。
  - SCADA-LTS 的搜索结果只出现 Wiki 子页，尚未获得足够的一手维护/许可证证据，暂不纳入推荐清单，后续若补证再评估。
- 第三轮“大屏底座”检索：
  - DataV-Team/DataV 是 Vue 大屏组件库，提供 SVG 边框、装饰、折线图、水位图、飞线图和轮播表，MIT。它适合快速搭出国内常见“科技蓝”外观，但不是数据接入、权限、告警或历史库平台；仓库 README 的 TODO 仍包含地图与 TypeScript 重构，需评估现代 Vue 项目兼容性。
  - 搜索没有可靠命中 GoView、AJ-Report、DataEase、DataGear 的一手页面，不能根据二手列表推定许可证或维护状态，需用精确仓库名再次核验。
  - CBoard 虽为 Apache-2.0 BI，但搜索摘要明确显示完整的全屏驾驶舱/高度可定制大屏属于企业版，开源社区版不应作为本次强推荐。
- 第四轮精确核验：
  - DataEase 是 Vue + AntV + Spring Boot + MySQL 的拖拽 BI，GPL-3.0；支持 OLTP/OLAP/文件/API 数据源，GitHub 显示 2026-05-28 发布 v2.10.23。适合经营分析和管理驾驶舱，不含工业协议接入/设备控制，需接入数据仓库或 API。
  - DataGear 的官方 Gitee README 显示 Spring Boot/MyBatis/Freemarker + Vue3/PrimeVue/ECharts，提供数据集、图表与看板 API；仍需从许可证文件和发行页补证后再决定等级。
  - AJ-Report 搜索仅命中较旧的 Gitee README 分支，GoView 未命中可信官方页；二者暂不作为“已核验推荐”。
- 第五轮直接打开官方仓库：
  - AJ-Report 的 GitHub README 顶部明确写“本项目暂停维护”；虽为 Apache-2.0 且具拖拽 SQL 大屏能力，也只能列入“历史参考/不建议新项目”。
  - DataGear 已补证：仓库识别 GPL-3.0/LGPL-3.0，多数据源（SQL、CSV、Excel、HTTP、JSON）、70+ 图表、原生 HTML 模板、可视/源码双模式、响应式大屏、联动/钻取/实时图表；README 宣布 6.0.0。它适合高自由度自建看板，但工业协议和设备控制仍需外围系统。
  - `KuaJiangLab/GoView` 直链抓取出现 cache miss，未取得可验证证据，继续不纳入核心推荐。
  - United Manufacturing Hub 官方仓库可访问，定位为 manufacturing data platform；需进一步打开 README 关键段落核验许可证、架构与维护状态。
- 第六轮 UMH 细核：
  - United Manufacturing Hub（Apache-2.0）面向工厂数据摄取、语义化、存储和 Unified Namespace。UMH Core 是 Go + Benthos-UMH + Redpanda 的单容器边缘网关；Classic Helm 栈含 TimescaleDB、Node-RED、Grafana。GitHub 显示 2026-07-14 发布 v0.44.29。
  - 选型边界：UMH 强项是工厂数据骨干与断网缓冲，不是成品“酷炫大屏”。Core 快速启动示例需要连接 `management.umh.app` 的 token/API；若要求完全离线或纯本地管理，应先核对当前部署/授权方案。Classic 才直接附带 Grafana 可视化。
- 第一轮图像检索的可复用 UI 模式：
  - FlowFuse OEE 教程是少数“视觉 + 可运行实现”兼具的案例：顶部 OEE/Performance/Availability/Quality 四主指标，中部停机原因与良/废品对比，底部低效设备和停机事件表。它比纯效果图更适合做制造业基线。
  - Dribbble “Machine Monitoring Dashboard” 用产线分组的设备状态卡（运行/故障/空闲/维护/无数据）与停机原因，适合车间层级；远距离大屏应放大状态和批次剩余时间，移除侧栏管理导航。
  - “Floware Smart Warehouse” 以仓库平面/地图为核心，配机器人电量、温度、载荷、任务进度、存储利用率；适合 AMR/AGV 场景。
  - “Logistics Management Dashboard” 强调车队/订单状态和 mobile robot、forklift、worker 三类运力，可借鉴为物流控制塔；Dribbble 作品只作视觉参考，不能推定有源码。
  - 反复出现的有效设计不是“更多图表”，而是：主 KPI 4–6 个、状态颜色语义固定、空间/流程视图居中、异常表收底、管理导航从电视大屏剥离。

## Resources

- `data/readme.md`
- `data/technology.md`
- https://github.com/frangoteam/FUXA
- https://github.com/OpenEMS/openems
- https://github.com/grafana/grafana
- https://github.com/thingsboard/thingsboard-gateway
- https://github.com/thingsboard/thingsboard
- https://github.com/RapidScada/scada-v6
- https://github.com/DataV-Team/DataV
- https://github.com/TuiQiao/CBoard
- https://github.com/dataease/dataease
- https://github.com/datageartech/datagear
- https://github.com/anji-plus/report
- https://github.com/united-manufacturing-hub/united-manufacturing-hub
- https://flowfuse.com/blog/2025/04/building-oee-dashboard-with-flowfuse-part-3/
- https://dribbble.com/shots/16576057-Machine-Monitoring-Dashboard
- https://dribbble.com/shots/27213762-Floware-Clean-Smart-Warehouse-Management-Dashboard-UI-Design
- https://dribbble.com/shots/21072405-Logistics-Management-Dashboard
- https://www.behance.net/gallery/246547267/Industrial-Monitoring-Dashboard-UIUX-Case-Study
- https://www.behance.net/gallery/187515975/Factory-Management-Dashboard-UXUI-Design-
