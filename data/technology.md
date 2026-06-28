# 技术索引

## 高密度摘要

- **一句话结论**：技术索引用来集中查找 AI、Agent、软件工程、前后端、可视化、关键产业和未来技术相关资料。
- **核心机制**：把技术分成产业格局、AI/Agent 协作、Prompt 与 Workflow、软件构建、前后端与可视化几条线。
- **判断入口**：想解决工具协作问题先看 LLM/Agent；想做软件系统先看前后端与 Workflow；想理解产业格局先看关键技术与产业。
- **常见误区**：不要只按工具名找技术资料；更稳定的入口是“我想完成什么工作流”或“这项技术改变了什么系统约束”。
- **相关文档**：[社会问题索引](./society.md)、[书籍索引](./books.md)、[精选文章](./a/awesome-articles.md)。

## 技术、AI 与工具

### 关键技术与产业

**哪些技术与产业正在重塑世界格局？**

| 文档 | 简介 |
|------|------|
| [光刻机行业深度介绍](./g/guangkeji.md) | 光刻机的工作原理、发展史、ASML 垄断逻辑、EUV 技术解析、芯片战争中的地缘博弈与中国突围之路 |
| [M5Stack 深度指南](./m/m5stack.md) | 深圳出品的模块化 ESP32 开发平台：产品线全览（Core/Stick/Atom）、UIFlow 2 图形化编程、与 Arduino 对比，以及 IoT 原型到工业边缘 AI 的应用路径 |
| [GD01 对比 Atlas / 外骨骼 / 工程机械](./g/gd01-vs-atlas-exoskeleton-engineering-machinery.md) | 从“人在系统中的位置、控制难点、风险与商业成熟度”对比四条技术路线，帮助判断载人机甲的真实技术坐标与落地约束 |

### 人类的未来

**人类的未来可能是什么样的？**

| 文档 | 简介 |
|------|------|
| [《未来简史》](./b/book-homo-deus.md) | 当技术改变“人是什么”，未来会走向哪里 |
| [《Life 3.0》](./b/book-life-3-0.md) | AI 时代的智能、文明与存在风险 |
| [《奇点临近》](./b/book-the-singularity-is-near.md) | 技术指数增长、人机融合与奇点叙事 |

## 附录：方法与工具

### 如何更高效地解决问题？

**如何与 LLM、Agent 和自动化系统协作？**

| 文档 | 简介 |
|------|------|
| [LLM 资源](./l/llm-resource.md) | LLM 相关人物、工具与学习资源汇总 |
| [Lev8 产品调研](./l/lev8.md) | AI-first GTM 平台调研：自然语言 prospecting、waterfall enrichment、live signals、多渠道 outbound、credit 定价、合规风险与 Clay/Apollo/ZoomInfo 对比 |
| [深入解读 Google 的 Gemma 4](./g/gemma-4.md) | Gemma 4 家族（E2B/E4B/26B MoE/31B Dense）的架构、性能、Agent 能力、与 Gemma 3 的对比及对开源 AI 生态的影响 |
| [Codex](./c/codex.md) | OpenAI Codex 与编程 Agent 的能力边界 |
| [Claude Code 源码泄露：值得研究的逻辑与对世界的影响](./c/claude-code-leaked.md) | 2026 年 3 月 Anthropic Claude Code 512K 行源码意外泄露的完整分析：模块化提示引擎、三层自愈记忆、双轨权限模型、KAIROS 后台 Agent、Undercover Mode 等核心设计，及其对 AI 行业竞争、开源社区与安全合规的深远影响 |
| [Harness](./h/harness.md) | Claude 和 OpenAI 语境下 harness（测试/评估套具）的含义、典型模式与实践建议 |
| [上下文管理](./c/context-manage.md) | 长对话、长任务中的上下文压缩与管理 |
| [AIEOS](./a/aieos.md) | AI Agent 可移植身份标准 |
| [信息素协作（Stigmergy）](./s/stigmergy.md) | 多 Agent 协作的一种组织思路 |
| [工具转 POSIX 命令](./t/tool-transformed-into-posix.md) | 把工具统一为 Agent 更容易调用的接口 |
| [AI Skills](./s/skill.md) | Agent Skills 平台与相关技能资源 |

**如何写出更稳定、更清晰的 Prompt？**

| 文档 | 简介 |
|------|------|
| [Chain of Thought（CoT）](./p/prompt-fw-cot.md) | 让模型分步推理 |
| [Few Shot](./p/prompt-fw-few-shots.md) | 用示例约束输出格式与风格 |
| [MBRY 框架](./p/prompt-fw-mbry.md) | Mission / Background / Route / Yield |
| [ReAct](./p/prompt-fw-react.md) | 推理与行动交替的工作流 |
| [Role Task Format（RTF）](./p/prompt-fw-rtf.md) | 结构清晰的通用 Prompt 框架 |
| [Prompt 优先级](./p/prompt-priority.md) | 多层 Prompt 冲突时如何判断 |
| [翻译场景 Prompt](./p/prompt-scence-translator.md) | 面向翻译任务的 Prompt 模板 |
| [运动项目输出模板](../knowledge/t/template-exercise-project-output.md) | 用“介绍、好处、风险、适用情况、怎么做、引用、推荐资源”约束 HIIT、动物流等运动项目介绍 |

**Workflow / Agent 框架调研**

| 文档 | 简介 |
|------|------|
| [Workflow 框架深度对比：DeepAgents vs Vercel Workflow vs VoltAgent](./w/workflow-frameworks-comparison.md) | 三大 Workflow 框架（LangChain DeepAgents / Vercel Workflow SDK / VoltAgent）的优缺点、横向对比与 Demo |

**如何构建软件、前端与可视化？**

| 文档 | 简介 |
|------|------|
| [前端资源](./f/frontend.md) | UI 组件库、工具链与前端生态入口 |
| [Next.js、Astro、Hono、VoidZero/Vite+ 框架对比](./f/frontend-frameworks-nextjs-astro-hono-voidzero.md) | 从页面应用、内容站、API 服务、工具链四个层级对比 Next.js、Astro、Hono 与 VoidZero/Vite+ 的适用场景 |
| [前端技术史](./f/frontend-history.md) | Web 前端技术脉络梳理 |
| [Web 后端整体技术发展史](./b/backend-history.md) | 主要后端语言、生态与演变路线 |
| [AntV 信息图表](./a/antv-infographic.md) | 信息可视化与图表表达的相关资源 |

**还想继续扩展阅读？**

| 文档 | 简介 |
|------|------|
| [精选文章](./a/awesome-articles.md) | 值得深读的长文与跨学科文章入口 |
