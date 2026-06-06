---
status: done
category: tool
tags: [gtm, sales-intelligence, ai-agent]
create_date: 2026-06-06
---

# [Lev8](https://lev8.com/) 产品调研

## 高密度摘要

Lev8 是 Simplex AI 做的 AI-first GTM 平台，核心不是传统 CRM，而是把“找谁、为什么现在、怎么触达”压缩到一个自然语言驱动的销售/招聘/投资线索工作流里。它的机制是：自然语言搜索目标人群 → 多源数据和公开网页补全 → 实体校验与 360 度画像 → 实时信号监测 → 多渠道个性化触达。判断入口：如果团队缺的是“快速从信号变成行动”，Lev8 值得试；如果缺的是高度可控的数据编排、企业级治理或成熟 CRM/SEP 集成，Clay、Apollo、ZoomInfo 仍可能更稳。常见误解：Lev8 不是单纯 email finder，也不是完整 CRM；它更像轻量 GTM agent。相关文档：[LLM 资源](./llm-resource.md)、[iFlow](../i/iFlow.md)。

## 一句话判断

Lev8 是一个面向 GTM 团队的“AI 销售/增长队友”：用自然语言定义目标客户或人才，自动找人、补数据、判断信号、生成触达内容，并尝试把 prospecting、enrichment、intent signal、outbound 放进同一个闭环。

它最适合：

- 早期创业公司、BDR/SDR、小型增长团队，需要快速起量但没有专门 RevOps/GTM Engineer。
- 招聘、投资、BD、渠道合作等“找对人 + 找对时机 + 发出第一条消息”的工作流。
- 想替代一部分 Clay/Apollo/ZoomInfo/n8n 组合，但暂时不需要复杂企业级配置的团队。

它不一定适合：

- 已有复杂 CRM、Sales Engagement Platform、数据仓库和合规审批流程的大型企业。
- 需要完全控制数据源、字段逻辑、workflow DAG、API 错误处理和治理权限的 RevOps 团队。
- 对 B2B 联系人数据来源、跨境隐私合规、自动外联责任边界非常敏感但不愿自己审查的人。

## 产品定位

官网把 Lev8 定义为 “Agentic GTM Platform for AI Prospecting & Outbound”，并在 `llms.txt` 里进一步描述为 AI-first GTM 平台，服务 sales teams、recruiters、founders、investors，目标是把互联网变成实时情报引擎。

从产品结构看，它想解决的不是单点“找邮箱”，而是 GTM 链条里的四个断点：

| 断点 | Lev8 的解法 |
|------|-------------|
| 不知道该找谁 | 用自然语言描述 ICP、公司、职位、地域、融资、技术栈等条件 |
| 数据不完整或过期 | 用多源数据库、公开网页、第三方数据源做 enrichment 和校验 |
| 信号来了但没人行动 | 跟踪招聘、融资、技术变化、网页访问、竞品搜索等 buying signals |
| 触达内容模板化 | 根据最新信号生成 email/LinkedIn/WhatsApp/X/Instagram 等渠道消息 |

它的核心叙事是从“数据工具”转向“信号到行动系统”：不是给你更多列表，而是告诉你现在谁值得联系、为什么值得联系、应该怎么说。

## 核心能力

### 1. One-Prompt Prospecting

用户可以用一句自然语言描述目标，例如“找最近两年由 MIT 或 Stanford 前教授/研究员创立的早期 biotech 公司”。Lev8 声称会做数据搜索、身份校验、可达性排序和持续更新。

公开能力页提到的数据源包括 web search、patent databases、niche forums、50+ providers、1B+ contacts。这里应理解为官网自述，未看到第三方审计证明。

### 2. Waterfall Enrichment

Lev8 把 enrichment 包装成 360 度画像：基础联系方式、职位、公司、行业、规模、LinkedIn、技术栈、融资、决策权、社交活跃度、下一步动作建议。

它与传统 enrichment 工具的差异点在于“下一步动作”而不只是字段补全：例如基于 Series B、HubSpot、预算持有人等信息建议在 LinkedIn 触达并强调 GTM ROI。

### 3. Live Signals

Lev8 的信号层覆盖：

- hiring spike、funding rounds、tech changes、competitor moves；
- 自定义 ICP trigger；
- social listening；
- 网站访客、pricing page view、content download、竞品搜索；
- 根据信号强度生成 “why now” 和 ice-breaker。

这部分是 Lev8 最有差异化的地方：它把“买方意图”从静态标签变成触发外联的理由。

### 4. Multi-channel AI Outbound

Lev8 支持 email、LinkedIn、WhatsApp、Instagram、X 等多渠道消息生成和统一 inbox 叙事。价格页显示 LinkedIn automation 在 Starter 为 Basic、Pro 为 Full；Gmail & Outlook Sync 分别为 Free 1 个 mailbox、Starter 3 个、Pro unlimited。

需要注意：条款要求用户自行负责 AI 生成内容审核、外联法律合规、退订机制、发件身份和物理地址等。Lev8 明确声明 AI 输出可能 hallucinate，用户承担未审查发送的风险。

## 商业与价格

官网价格页截至 2026-06-06 显示：

| Plan | 月费 | Credits | 适合 |
|------|------|---------|------|
| Free | $0/month | 800 credits/month | 个人试用、低频 sourcing/outreach |
| Starter | $49/month | 5,000 credits | 小团队启动外联 |
| Pro | $199/month | 25,000 credits | 增长团队跑完整 GTM stack |

官网称所有 plan credits 可按月 rollover，最多到 2x 月 allowance。

典型信用消耗：

| 动作 | Credit 成本 |
|------|-------------|
| Typical matched lead | 约 20 credits/lead |
| Lead match, no enrichment | 1 credit |
| Email enrichment | 10 credits |
| Phone enrichment | 30 credits |
| Other field enrichment | 2 credits/cell |
| Buying intent scan | 5 credits/company |
| AI email draft | 5 credits/email |
| Multi-channel outreach send | 1 credit/person |
| AI research agent run | 15 credits |
| Persona message generation | 8 credits |
| Generate report | 50 credits |
| LinkedIn automation action | 3 credits |
| AI smart action | 2 credits |

定价页同时声称：只有交付正确结果才扣费，如果结果不匹配过滤器、lookup 失败或数据过期，不扣 credit。这个承诺很关键，但真实争议处理标准需要实际试用或合同确认。

## 公司与融资

Lev8 背后公司是 SIMPLEX AI TECHNOLOGIES PTE. LTD.。官网 About 页说 Simplex AI 的使命是 “Simplify the complex with AI”，Lev8 是其第一个产品答案：找到正确的人、捕捉正确的信号、发送正确的信息。

官网博客在 2026-01-19 公告称 Simplex AI 完成 600 万美元 seed round，由 GL Ventures 领投，用于加速 Lev8 发布。公告提到资金用途包括：

- 扩展 hiring、funding、leadership、technology changes 的实时信号覆盖；
- 加深公司和联系人记录验证；
- 提升产品可靠性和响应速度；
- 招聘 AI infrastructure、search quality、GTM product design 人才。

## 数据、合规与风险

Lev8 的隐私政策和服务条款比普通营销页更值得看，因为它直接暴露产品边界。

### 数据来源

隐私政策说明，Lev8 对 Prospects/Business Profiles 作为 data controller，收集公开可得信息和第三方数据合作伙伴信息。典型 prospect data 包括姓名、职位、部门、公司、firmographic details、business email、business phone、LinkedIn URL 等。

这意味着 Lev8 的价值基础是 B2B 联系人数据库 + 公开网页信号 + 第三方 data brokers。对欧美市场外联而言，需要关注 GDPR/CCPA/CASL/CAN-SPAM 等合规责任。

### 用户输入与 AI 训练

隐私政策和条款都提到 Lev8 会使用 prompts、queries、business objectives、enriched data、usage data 来改进模型和搜索算法，并承诺在可行时聚合或去标识化。Google/Gmail/Outlook connected account 中的受限数据不会用于 generalized AI training。

如果用户输入包含敏感商业策略、未公开名单或客户数据，建议先确认企业版 DPA、数据保留、训练退出选项和子处理方。

### 外联责任

服务条款强调：

- 用户负责审查、编辑和批准 AI 生成邮件或消息；
- 用户负责 CAN-SPAM、GDPR、CCPA/CPRA、CASL、EU AI Act 等适用法律；
- 用户必须提供合法联系依据、退订机制、准确发件身份和物理地址；
- 数据是 snapshot，不保证实时准确；
- 邮箱、电话、职位、送达率不保证。

所以 Lev8 可以降低 GTM 操作成本，但不会替用户承担外联合规和品牌风险。

## 竞品对比

| 工具 | 核心定位 | 强项 | 弱项 | 与 Lev8 的关系 |
|------|----------|------|------|----------------|
| Lev8 | AI-first GTM teammate | 自然语言找人、实时信号、从 discovery 到 outreach 的短闭环 | 企业集成、治理、第三方验证仍需确认 | 适合想少配置、快启动的前线 GTM 团队 |
| Clay | GTM data enrichment + workflow operating system | 150+ data providers、waterfall、Claygent、signals、sequencer、CRM/warehouse/API 等编排能力 | 学习和维护成本高，像数据工程系统 | Clay 更像可编排数据实验室；Lev8 更像自然语言 GTM agent |
| Apollo | AI sales platform / outbound execution | 数据、外联、workflow automation、Chrome extension、inbound/outbound/deal execution 都在产品内 | 深度个性化和“为什么现在”判断相对依赖前置研究 | Apollo 更偏大规模执行；Lev8 更偏前置信号和研究 |
| ZoomInfo | 企业级 GTM intelligence/data platform | 数据规模、治理、企业采购、集成成熟度 | 价格和部署重，前线试错不轻 | ZoomInfo 更适合大组织数据底座；Lev8 更适合轻量快速行动 |
| n8n | 通用自动化/集成引擎 | 自托管、API 连接、流程控制、错误处理灵活 | 不理解 GTM 语义，所有判断逻辑要自己搭 | n8n 是底层管道；Lev8 是垂直 GTM 应用 |

## 选型建议

优先试 Lev8 的场景：

- 你能用一句话说清楚“我要找什么公司/什么人”，但不想自己搭筛选字段和 API workflow。
- 你关心 timing：融资、招聘、技术栈、竞品搜索、网站访问等信号出现后马上触达。
- 你希望一个工具同时做找人、补数据、写首封消息和轻量外联。
- 团队愿意从小规模试点开始，接受新产品的不确定性。

优先选 Clay 的场景：

- 你有 RevOps/GTM Engineer，想精细控制数据源、字段、waterfall、API、CRM sync。
- 你要把 GTM 数据流嵌进现有系统，而不是让一个 agent 替你判断。

优先选 Apollo 的场景：

- 你已经有清晰 ICP，只需要大规模 outbound、sequencing、call/email execution 和基础数据。

优先选 ZoomInfo 的场景：

- 你是中大型企业，需要成熟采购、合规、权限、数据覆盖和系统集成。

## 试用检查清单

1. 用 3 个真实 ICP prompt 测试：看返回结果是否真的匹配语义，而不是只匹配关键词。
2. 抽样 50 条联系人：验证邮箱、职位、公司、LinkedIn、近期信号是否准确。
3. 跑一次 buying signal → message generation：看 “why now” 是否可用于真实外联。
4. 连接邮箱前先确认：Gmail/Outlook scopes、数据保留、训练政策、断开后的删除机制。
5. 计算 credit economics：按目标每月 lead 数、email/phone enrichment 比例、AI draft 数量，估算真实每条有效线索成本。
6. 如果团队已有 CRM/SEP，确认：Salesforce/HubSpot、Outreach/Salesloft、CSV/API、去重、退订同步、bounce/reply tracking。
7. 低量试发，人工审查 AI 消息，避免 hallucination 和合规问题。

## 结论

Lev8 的机会在于它抓住了 GTM 工具的新痛点：数据已经不稀缺，稀缺的是“实时信号出现后，系统能否判断优先级并推动下一步动作”。它用自然语言和 agent 形态降低了 GTM workflow 的使用门槛。

但它仍应被当作新兴 AI GTM 产品来验证，而不是直接替代成熟企业数据平台。最合理的采用方式是：先拿一个明确细分场景做 2-4 周试点，衡量有效线索率、回复率、每条有效线索 credit 成本、人工审查时间和合规风险，再决定是否扩大使用。

## References

- https://lev8.com/
- https://lev8.com/llms.txt
- https://lev8.com/pricing
- https://lev8.com/about
- https://lev8.com/skills/one-prompt-prospecting
- https://lev8.com/skills/waterfall-enrichment
- https://lev8.com/skills/live-signals
- https://lev8.com/skills/multichannel-outreach
- https://lev8.com/privacy
- https://lev8.com/term-service
- https://lev8.com/rss.xml
- https://lev8.com/blog/gl-ventures-investment
- https://lev8.com/blog/best-clay-alternatives-gtm-teams-2026
- https://www.clay.com/
- https://www.clay.com/pricing
- https://www.apollo.io/
