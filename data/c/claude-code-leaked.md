# Claude Code 源码泄露：值得研究的逻辑与对世界的影响

> 2026 年 3 月 31 日，Anthropic 的 AI 编程助手 Claude Code（npm 包 `@anthropic-ai/claude-code` v2.1.88）因 `.npmignore` 配置失误，意外将一份 59MB 的 source map 文件公开发布。这份文件包含了完整的、有注释的 TypeScript 源码——逾 512,000 行、近 1,900 个文件。消息一经传出，多份镜像仓库在 GitHub 上数小时内累积数万 Star，Anthropic 的"遮羞布"彻底揭开。

---

## 问题一：这次泄露到底泄露了什么？

**泄露内容**
- Claude Code 的完整客户端与 Agent 编排层源码（TypeScript）
- 系统提示（CLAUDE.md / system prompt）
- 内部工具 API、权限模型、多 Agent 协调逻辑
- 多个未公开功能的代码和 Feature Flag
- 内部代号：`Capybara`（疑似 Claude 5 系列）、`Fennec`（Opus 4.6）、`Numbat`（预发布测试中）

**未泄露内容**
- 模型权重（LLM 本身）
- 用户数据、API Key
- 后端训练数据或推理基础设施

---

## 问题二：系统提示（CLAUDE.md）的设计有何独到之处？

### 2.1 模块化"模板引擎"提示词

传统的系统提示是一段整体性的文本。Claude Code 则把它拆成数十个独立管理的"段落模块"，在运行时按**用户类型、Feature Flag、Session 状态、已启用工具、甚至语言**动态组合。

核心安全指令由专属团队"守护"，不可修改；其他模块可灵活插拔，形成高度可配置又严守边界的系统提示结构。

### 2.2 提示缓存与动态边界

为控制成本，提示词分为**静态可缓存段**和**动态每次组装段**。开发者若需插入新的动态段，必须使用名为 `DANGEROUS_` 的构造函数，并强制写明为什么要打断缓存——这是一种把工程纪律"写进命名约束"的聪明设计。每次 API 请求都会对完整提示词做哈希，以便检测缓存命中情况的变化。

---

## 问题三：记忆系统（Memory）如何解决 Agent 的"上下文漂移"问题？

### 3.1 三层记忆架构

| 层级 | 内容 | 策略 |
|------|------|------|
| 索引层（MEMORY.md） | 轻量级索引，始终加载到上下文 | 只记"指针"，不记全文 |
| 主题文件层 | 每个话题的详细信息单独存文件 | 按需检索，不全量读取 |
| 实时验证层 | 每次操作前对照真实代码做核验 | "怀疑性记忆"，主动反幻觉 |

### 3.2 自愈记忆（Self-Healing Memory）

Agent 被指示**永远不盲目相信自己的笔记**，每次行动前都要对照真实代码验证。这一设计被称为"怀疑性记忆"，有效减少了长会话中的错误积累。

### 3.3 KAIROS：后台自主 Agent

`KAIROS` 是一个未发布的**持久后台 Agent 模式**，在用户空闲期间自动进行：

- `autoDream`：在 idle 期间自主合并笔记、消解矛盾、更新知识；
- 主动推断：基于上下文和持续分析，无需用户触发即可提出建议或启动任务；

这是从"被动响应"到"主动自主"Agent 设计范式的重要跨越。

---

## 问题四：权限模型（Permission Model）设计是否合理？

### 4.1 双轨权限机制

| 轨道 | 描述 | 适用场景 |
|------|------|----------|
| 规则快速路径 | 静态 allow/deny/ask 规则（正则 + glob 匹配） | 大多数文件和工具操作 |
| AI 分类器 | 对模糊请求调用模型本身判断风险 | 有破坏性的 shell 命令等 |

### 4.2 现实困境

实际使用中，开发者往往因不堪忍受频繁的权限弹窗，直接使用 `--dangerously-skip-permissions` 跳过所有检查，等同于给 Agent 完全的 shell / 文件 / 网络访问权。这暴露了一个典型的安全性 vs. 可用性的二元陷阱：**要么不停打断，要么彻底信任**，缺乏细粒度的中间地带（例如"可读取任意位置，但只能写入 `src/` 和 `tests/`"）。

---

## 问题五：有哪些隐藏功能值得关注？

### 5.1 Undercover Mode（卧底模式）

**目的**：当 Anthropic 员工向公开开源项目贡献代码时，自动剥离所有 AI 归属信息，使贡献看起来完全由人类完成。

**机制**：`utils/undercover.ts` 在检测到公开仓库时自动激活，清洗提交信息和 PR 元数据中的 Anthropic 标识和内部代号，无法被员工强制关闭。

**争议**：这引发了关于 AI 身份透明度、开源社区信任以及 AI 生成代码归属权的激烈讨论。

### 5.2 Buddy（AI 宠物伴侣）

一个 Tamagotchi 风格的**虚拟 AI 终端宠物**，内嵌于 Claude Code：
- 18 种物种，含稀有度分层
- 自定义属性：耐心值、调试能力、混乱指数、智慧等级……
- 个性化名字和外观定制

代码注释显示计划在 2026 年 4 月初启动阶段性发布。

### 5.3 反蒸馏机制（Anti-Distillation）

若检测到竞争对手尝试通过 API 调用抓取 Claude Code 的工具结构以训练竞争模型，一个 Feature Flag 会自动向输出中**注入伪造的诱饵工具定义**，污染对手的训练数据。这是 AI 军备竞赛下的主动防御策略。

### 5.4 情绪/挫败感检测

使用**正则表达式**（而非调用 LLM）实时检测用户负面情绪，并调整响应策略。成本极低，响应极快。

---

## 问题六：工具（Tool）架构有何亮点？

- 约 **40+ 个工具模块**，每个工具独立、可测、权限门控；
- 核心工具接口文件（`Tool.ts` 及相关）近 **29,000 行**；
- Bash 工具具备完整的 shell 环境快照/恢复、语法验证、危险模式检测、输出审计能力；
- 工具由中央查询引擎统一调度，同时管理多 Agent 协调、插件调用和会话上下文；
- 自定义 React-based **终端 UI 渲染引擎**，支持纯 TypeScript flexbox 布局、鼠标、超链接、流式输出；

---

## 问题七：泄露对世界和 AI 行业的影响是什么？

### 7.1 竞争格局：将领先优势"民主化"

OpenAI（Codex）、微软（Copilot）、Cursor 等竞争对手，以及全球众多 AI Agent 创业公司，现在都有了 Anthropic 生产级 Agent 设计的完整蓝图。"自愈记忆""三层记忆架构""模块化提示引擎"等曾经的内部最佳实践，已成为公共知识。

### 7.2 开源社区：加速涌现的仿制与再实现

泄露代码在 GitHub 上的镜像仓库快速积累数万 Star。"用此架构重写"的 clean-room 项目已在进行中——尽管直接复用有版权风险，但知识本身无法被"收回"。

### 7.3 安全警示：软件供应链的脆弱性

这是 Anthropic 在 npm 渠道的第三次意外泄露（2024、2025、2026）。根本原因是 Bun 运行时一个已知 Bug 未正确剥离 source map，加之 `.npmignore` 配置失误的双重失误。这一事件成为 AI 公司关注**构建流水线与发布管道安全**的标志性案例。

### 7.4 伦理与法律灰区：AI 归属与知识产权

- **Undercover Mode** 让"AI 是否应该公开自己的代码贡献"成为迫切的行业议题；
- 从法律层面，泄露的代码仍受 Anthropic 版权保护，商业使用或再发行面临法律风险；
- 从知识层面，架构模式和设计思路已无法被"遗忘"，整个 AI 开发社区已从中学习。

### 7.5 透明度压力：倒逼行业开放

这场"被迫开源"加剧了公众和开发者对 AI 公司提高透明度的呼声，部分分析人士认为它可能催生更强的行业自律或监管要求——关于 Agent 权限、AI 代码归属和安全边界的讨论，从技术圈蔓延至政策领域。

---

## 关键结论

| 问题 | 核心洞察 |
|------|----------|
| 提示词工程 | 模块化"模板引擎"提示是生产级 Agent 的最佳实践，静/动分离结合缓存边界管理 |
| 记忆管理 | 三层自愈架构 + "怀疑性记忆"是对抗长会话幻觉漂移的有效方案 |
| 权限模型 | 双轨（规则+AI分类器）有创意，但二元化（严格 vs. 全跳过）是已知缺陷 |
| 自主 Agent | KAIROS 后台自主 Agent 是从"反应式"向"主动式" Agent 演进的具体实现 |
| 安全观 | 反蒸馏、情绪检测、Undercover Mode 显示商业 AI 工具已进入"竞争博弈"阶段 |
| 行业影响 | 一次意外泄露将生产级 Agent 工程知识全面民主化，加速整个行业的架构进化 |

---

## 参考资料

- [VentureBeat：Claude Code's source code appears to have leaked](https://venturebeat.com/technology/claude-codes-source-code-appears-to-have-leaked-heres-what-we-know)
- [Cybernews：Full source code for Anthropic's Claude Code leaks](https://cybernews.com/security/anthropic-claude-code-source-leak/)
- [apiyi.com：512,000 lines, impact on AI agent industry](https://help.apiyi.com/en/claude-code-source-leak-march-2026-impact-ai-agent-industry-en.html)
- [WaveSpeed：BUDDY, KAIROS & Every Hidden Feature Inside](https://wavespeed.ai/blog/posts/claude-code-leaked-source-hidden-features/)
- [Siddhant Khare：Claude Code's broken permission model](https://siddhantkhare.com/writing/claude-code-permission-model-is-broken)
- [DeepWiki：Bash Tool Architecture](https://deepwiki.com/anthropics-claude/claude-code/4.3-bash-tool)
- [Layer5：The Claude Code Source Leak](https://layer5.io/blog/engineering/the-claude-code-source-leak-512000-lines-a-missing-npmignore-and-the-fastest-growing-repo-in-github-history/)
- [The Neuron：Anthropic Leaks Claude Code, a Blueprint for AI Coding Agents](https://www.theneuron.ai/explainer-articles/anthropic-leaks-claude-code-a-literal-blueprint-for-ai-coding-agents/)
