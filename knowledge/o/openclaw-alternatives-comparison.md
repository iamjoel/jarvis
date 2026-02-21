# OpenClaw 及同类产品对比

> **聚焦范围**：本文主要收录 OpenClaw 走红（2026 年 1 月）之后涌现的产品，而非之前就已存在的 Auto-GPT、BabyAGI 等老牌框架。

## OpenClaw 背景

[OpenClaw](https://openclaw.im/) 原名 **Clawdbot**，由奥地利开发者 Peter Steinberger 于 2025 年 11 月发布。经历商标纠纷后，2026 年 1 月 27 日改名为 Moltbot，3 天后再次改名为 **OpenClaw**，随即病毒式爆发，数日内突破 **100,000 GitHub Stars**（峰值约 157k）。

### OpenClaw 核心特性

| 特性 | 说明 |
|------|------|
| 多平台消息 | WhatsApp、Telegram、Slack、Discord、Signal、iMessage、Teams 等 |
| 持久化记忆 | SQLite / PostgreSQL / Redis，跨会话保留上下文 |
| 全系统访问 | 读写文件、执行 shell 命令、运行脚本 |
| Skills 生态 | 3,000+ 社区插件，支持 TypeScript/YAML 自定义 |
| BYOM | OpenAI / Anthropic / Gemini / 本地 Ollama 均可接入 |
| 自主后台任务 | cron 任务、事件监听、工作流自动触发 |
| 开源协议 | MIT，无遥测，代码可审计 |

### OpenClaw 已知问题

- **代码体量庞大**：430,000+ 行代码，难以审计
- **安全漏洞**：2026 年 2 月曝出严重 RCE 漏洞（CVE-2026-25253），约 18,000 个暴露实例；Skills 市场发现 341 个恶意插件
- **资源消耗高**：>1 GB RAM，启动慢
- **主机访问不受限**：AI 可直接操作宿主机文件系统和进程

---

## OpenClaw 走红后涌现的产品

### 1. Nanobot（2026 年 2 月 2 日）

- **作者**：香港大学数据智能实验室（HKUDS）
- **语言**：Python，约 **4,000 行代码**（OpenClaw 的 1%）
- **定位**：极简、可审计的 OpenClaw 替代品
- **核心功能**：
  - 支持 Telegram、Discord、WhatsApp、Slack、Email、飞书、QQ、钉钉等 8+ 通信渠道
  - 接入 OpenAI、Claude、DeepSeek、Gemini、Qwen、vLLM 等 11+ LLM 提供商
  - 混合记忆（向量检索 + 关键词），长期 Markdown 知识库
  - 模块化 Skills 系统 + cron 后台任务
  - `pip install nanobot-ai` 一键安装
- **优点**：代码极简易读，安全可审计，适合低功耗设备（树莓派等）
- **缺点**：插件生态远少于 OpenClaw，没有独立沙箱
- **GitHub**：[github.com/HKUDS/nanobot](https://github.com/HKUDS/nanobot)

---

### 2. NanoClaw（2026 年 1 月/2 月）

- **语言**：TypeScript（~500 行）
- **定位**：安全优先的 OpenClaw 替代品
- **核心功能**：
  - 每个用户/群组在独立 Docker 容器（Linux）或 Apple Container（macOS）中运行
  - OS 级隔离：bash 命令、文件系统、进程命名空间全部隔离于沙箱内
  - 每个群组有独立文件系统和记忆（`CLAUDE.md`）
  - 代码极简，方便个人审计和定制
- **优点**：安全性业界最强，完全杜绝 AI 对宿主机的意外访问
- **缺点**：仅支持 Telegram，集成数量少
- **GitHub**：[github.com/gavrielc/nanoclaw](https://github.com/gavrielc/nanoclaw)

---

### 3. ZeroClaw（2026 年 2 月 16 日）

- **语言**：Rust
- **定位**：超轻量、零开销的 Agent 运行时
- **核心功能**：
  - 单一静态二进制文件，**3.4 MB**，内存占用 **<5 MB**，冷启动 **<10 ms**
  - Trait 驱动的模块化架构（Provider / Channel / Tool / Memory 均可热插拔）
  - Rust 内存安全 + 插件沙箱隔离
  - 支持 ARM、x86、RISC-V，可运行在 $10 硬件上
  - 内置 cron 调度器、自动重启 supervisor、一键诊断
  - 支持 22+ API 集成，多 Agent 编排
- **优点**：资源极省、可移植性强、安全性好，适合边缘/IoT 部署
- **缺点**：Rust 生态门槛较高，社区规模仍在成长
- **网站**：[zeroclaw.net](https://zeroclaw.net/)

---

### 4. PicoClaw（2026 年 2 月初）

- **语言**：Go
- **定位**：为 $10 级廉价硬件设计的轻量 Agent
- **核心功能**：
  - 内存占用 **<10 MB**，启动时间 **<1 秒**，静态二进制 ~8 MB
  - 无需 Node.js 运行时，直接下载单文件运行
  - 基本任务和 Agent 管理
  - 支持主流聊天平台和 API
- **优点**：对硬件要求极低，部署极简，适合 RISC-V / ARM 嵌入式设备
- **缺点**：功能相比 OpenClaw 较为有限，多 Agent 能力受限
- **网站**：[picoclaw.ai](https://picoclaw.ai/)

---

### 5. memU（2026 年初）

- **语言**：Python + Rust
- **定位**：面向生产级 AI Agent 的层次化记忆框架
- **核心功能**：
  - 三层记忆架构：**Resource**（原始数据）→ **Item**（提取信息）→ **Category**（汇总聚合）
  - 双重检索：向量嵌入（快速）+ LLM 语义搜索（深度）
  - 文件系统隐喻：文件夹=类别，文件=记忆单元，符号链接=交叉引用
  - 支持多模态（对话、文档、图片）
  - 适配 Discord、Telegram、Slack 等平台
- **优点**：记忆管理最先进，真正实现跨天跨会话的持久上下文
- **缺点**：定位更像记忆模块而非独立 Agent，集成需要一定开发工作
- **GitHub**：[github.com/NevaMind-AI/memU](https://github.com/NevaMind-AI/memU)

---

### 6. Goose（Block，2026 年 2 月）

- **语言**：Rust（Apache 2.0 开源）
- **定位**：企业级自主软件工程 Agent，Block（Square 母公司）内部 1,000+ 工程师在用
- **核心功能**：
  - 自主执行端到端编程任务（写代码、运行、调试）
  - 原生支持本地 LLM（Ollama 开箱即用）及所有主流云端模型
  - Model Context Protocol（MCP）扩展机制
  - 支持 macOS / Linux / Windows
  - 模块化 Cargo 工作区，Rust 内存安全
- **优点**：生产验证、稳定可靠、Rust 安全性；适合开发者和企业团队
- **缺点**：无内置 OS 级沙箱，Rust 门槛较高；偏重编程场景
- **GitHub**：[github.com/block/goose](https://github.com/block/goose)

---

### 7. Moltworker（2026 年初）

- **语言**：Python + Rust
- **定位**：无服务器版 OpenClaw，部署在 Cloudflare Workers
- **核心功能**：
  - 免去本地安装和维护，直接在云端运行 Agent
  - 多 Agent 编排，Python API 可扩展
  - 文件式记忆
- **优点**：对不想自建服务器的用户友好，部署简单
- **缺点**：资源占用相对较高（~20 MB），依赖第三方云基础设施

---

## 综合对比表

| 产品 | 语言 | 发布时间 | 内存占用 | 启动速度 | 安全沙箱 | 多平台消息 | 上手难度 | 核心亮点 |
|------|------|---------|---------|---------|---------|----------|---------|---------|
| **OpenClaw** | TypeScript | 2026.01 | >1 GB | 慢（>500s） | ❌ | ✅ 20+ | 高 | 功能最全，生态最大 |
| **Nanobot** | Python | 2026.02.02 | 极小 | 快 | ❌ | ✅ 8+ | 低 | 代码量最小，最易审计 |
| **NanoClaw** | TypeScript | 2026.01 | 极小 | 快 | ✅ 容器级 | ✅ Telegram | 中 | 安全性最强 |
| **ZeroClaw** | Rust | 2026.02.16 | <5 MB | <10 ms | ✅ 插件沙箱 | ✅ 22+ | 中高 | 最轻量，边缘/IoT |
| **PicoClaw** | Go | 2026.02 | <10 MB | <1 s | 有限 | ✅ 主流 | 低 | $10 硬件可运行 |
| **memU** | Python+Rust | 2026 初 | 中等 | 中 | - | ✅ 多平台 | 中高 | 最先进的层次化记忆 |
| **Goose** | Rust | 2026.02 | 180-250 MB | 快 | ❌（依赖 OS） | ❌ | 中高 | 企业级代码自动化 |
| **Moltworker** | Python+Rust | 2026 初 | ~20 MB | ~2.5 s | 部分 | ✅ Python API | 低 | 无服务器，免运维 |

---

## 选型建议

| 需求 | 推荐 |
|------|------|
| 功能最全，不在意安全风险 | **OpenClaw** |
| 代码极简，自己能看懂 | **Nanobot** |
| 安全第一，容器级隔离 | **NanoClaw** |
| 边缘设备/IoT/资源极省 | **ZeroClaw** 或 **PicoClaw** |
| 需要强大的跨会话记忆 | **memU** |
| 企业级代码自动化 | **Goose** |
| 不想自建服务器 | **Moltworker** |

---

## 相关资源

- [OpenClaw 官网](https://openclaw.im/) · [OpenClaw 文档](https://docs.openclaw.ai/)
- [Nanobot GitHub](https://github.com/HKUDS/nanobot) · [Nanobot 官网](https://nanobot.club/)
- [NanoClaw GitHub](https://github.com/gavrielc/nanoclaw) · [NanoClaw 官网](https://nanoclaw.dev/)
- [ZeroClaw 官网](https://zeroclaw.net/)
- [PicoClaw 官网](https://picoclaw.ai/)
- [memU GitHub](https://github.com/NevaMind-AI/memU)
- [Goose GitHub](https://github.com/block/goose)
