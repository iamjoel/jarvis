# Workflow 框架深度调研：DeepAgents vs Vercel Workflow vs VoltAgent

> 调研时间：2026-04-02

---

## 一、框架概览

| 维度 | LangChain DeepAgents | Vercel Workflow SDK | VoltAgent |
|------|---------------------|-------------------|-----------|
| **仓库** | [langchain-ai/deepagents](https://github.com/langchain-ai/deepagents) | [vercel/workflow](https://github.com/vercel/workflow) (npm: `workflow`) | [VoltAgent/voltagent](https://github.com/voltagent/voltagent) |
| **语言** | Python | TypeScript | TypeScript |
| **定位** | AI Agent 编排平台（多步骤、长任务、自主规划） | 通用异步持久化工作流引擎 | AI Agent 工程化框架（多 Agent 编排 + 可观测） |
| **核心关键词** | 规划、子 Agent、文件系统、上下文管理 | 持久化函数、Step 容错、sleep/replay | 模块化 Agent、Supervisor、工具、记忆、RAG |
| **LLM 支持** | OpenAI / Anthropic / Gemini 等多家 | 不直接涉及 LLM（通用工作流） | 30+ LLM（OpenAI / Anthropic / Google / Mistral 等） |
| **成熟度** | 基于 LangChain/LangGraph 生态，较成熟 | Vercel 官方，2025 年发布，迭代中 | 开源 Beta，社区快速增长中 |

---

## 二、LangChain DeepAgents

### 2.1 简介

DeepAgents 是 LangChain 官方推出的**高级 Agent 骨架**，构建在 LangGraph 之上。它让 AI Agent 能够自主规划、分解任务、执行代码、管理文件，并在超长任务中保持上下文一致性。

### 2.2 核心优势

1. **自主规划（write_todos）**：Agent 可自动将大任务分解为子步骤，动态追踪和调整进度。
2. **子 Agent 派生**：将子任务委托给独立的子 Agent，每个子 Agent 拥有隔离的上下文，适合并行或专业化场景。
3. **文件系统 + 持久化记忆**：Agent 可读写、编辑文件，克服 LLM 上下文窗口限制，实现跨会话持久记忆。
4. **沙箱 Shell 执行**：支持安全的命令执行，可直接编写和运行代码。
5. **上下文管理策略**：内置对话压缩、上下文卸载、大输出自动保存等机制。
6. **模型中立**：支持 OpenAI、Anthropic、Gemini 等多种 LLM。
7. **CLI + SDK 双模式**：既可作为 Python 库集成，也可作为终端 AI 助手直接使用。
8. **LangSmith 集成**：原生支持追踪、调试与工作流可视化。

### 2.3 缺点

1. **抽象层复杂**：Chains / Agents / Graphs 多层抽象叠加，学习曲线陡峭，调试困难。
2. **扩展性挑战**：当工作流增长时，Agent 间交互的追踪和治理变得困难。
3. **控制力不足**：很多决策（工具选择、推理路径）由 LLM 黑箱决定，难以强制执行业务规则。
4. **简单任务过重**：对简单线性流程来说是"杀鸡用牛刀"。
5. **生态绑定**：深度依赖 LangChain 生态，后期迁移成本高。
6. **仅限 Python**：不适合 TypeScript / JavaScript 技术栈的团队。

### 2.4 Demo

```python
# 安装
# pip install deepagents

from deepagents import create_deep_agent
from langchain_core.tools import tool
from langchain.chat_models import init_chat_model

# 1. 自定义工具
@tool
def search_database(query: str) -> str:
    """搜索内部数据库"""
    return f"数据库中关于 '{query}' 的搜索结果：找到 3 条记录。"

@tool
def send_email(to: str, subject: str, body: str) -> str:
    """发送邮件"""
    return f"邮件已发送至 {to}，主题: {subject}"

# 2. 创建 Agent
agent = create_deep_agent(
    model=init_chat_model("openai:gpt-4o"),
    tools=[search_database, send_email],
    system_prompt="你是一个企业助手，可以搜索数据库和发送邮件。",
)

# 3. 调用 Agent
result = agent.invoke({
    "messages": [
        {"role": "user", "content": "帮我查一下最近的客户投诉记录，然后把摘要邮件发给 manager@example.com"}
    ]
})
print(result)
```

**子 Agent 协作示例：**

```python
from deepagents import create_deep_agent

# 主 Agent 自动分解任务并派生子 Agent
agent = create_deep_agent()
result = agent.invoke({
    "messages": [
        {"role": "user", "content": "调研 React 和 Vue 的最新版本差异，分别写摘要，然后合并成一份对比报告保存到 report.md"}
    ]
})
# Agent 会: 1) 写 todo 分解任务 2) 派生子 Agent 分别调研 3) 合并并写入文件
```

---

## 三、Vercel Workflow SDK（npm: `workflow`）

### 3.1 简介

Vercel Workflow SDK 是一个**通用持久化工作流引擎**，让普通的 TypeScript async/await 函数变成**可恢复、可重试、可观测**的持久化工作流。它不直接面向 AI/LLM 场景，而是解决**长时间运行、容错、异步编排**这类通用工程问题。

### 3.2 核心优势

1. **极简 API**：只需 `"use workflow"` 和 `"use step"` 两个指令，普通函数即变持久化。
2. **持久化 & 可恢复**：工作流可 sleep 数天甚至数月，恢复后继续执行，不消耗资源。
3. **Step 级容错**：每个 step 独立隔离，失败自动重试，不需要手动重试逻辑。
4. **确定性重放（Replay）**：失败后可从断点重放，保证一致性。
5. **内置可观测性**：日志、追踪、指标开箱即用，可在 Vercel 仪表盘查看。
6. **框架兼容**：支持 Next.js / SvelteKit / Astro / Nuxt 等多种前端框架。
7. **可移植**：可在本地、Vercel 或容器中运行。

### 3.3 缺点

1. **厂商锁定风险**：`"use workflow"` 指令看似标准 JS，但实际只在 Vercel 环境完整工作，迁移成本高。
2. **"魔法"隐藏复杂度**：指令化设计隐藏了编排机制，调试时可能难以追踪实际执行路径。
3. **生产级容错不足**：相比 Temporal / Step Functions，缺少精细的重试策略、补偿机制和幂等控制。
4. **长时间后台任务受限**：受 Vercel Serverless 超时限制，不适合计算密集或需要持久后台 Worker 的场景。
5. **可观测性仍有差距**：相比 Temporal 的细粒度事件回放，Vercel 的追踪能力仍较初级。
6. **成本可能攀升**：函数调用 + 状态存储的费用在大规模场景下可能显著增长。
7. **非 AI 原生**：不内置 LLM 集成，如果需要 AI 能力需自行组合。

### 3.4 Demo

```typescript
// 安装
// npm i workflow

// === 用户注册工作流 ===

// 定义 step：创建用户
async function createUser(email: string) {
  "use step";
  // 调用数据库创建用户
  const user = await db.users.create({ email });
  return user;
}

// 定义 step：发送欢迎邮件
async function sendWelcomeEmail(email: string) {
  "use step";
  await emailService.send({
    to: email,
    subject: "欢迎加入！",
    body: "感谢您的注册，这是您的入门指南...",
  });
}

// 定义 step：发送 7 天回访邮件
async function sendCheckInEmail(email: string) {
  "use step";
  await emailService.send({
    to: email,
    subject: "您使用一周了，感觉如何？",
    body: "希望一切顺利，有任何问题请联系我们。",
  });
}

// 定义 workflow：完整注册流程
export async function userSignupWorkflow(email: string) {
  "use workflow";

  // Step 1: 创建用户
  const user = await createUser(email);

  // Step 2: 发送欢迎邮件
  await sendWelcomeEmail(email);

  // Step 3: 等待 7 天（不消耗资源）
  await sleep("7 days");

  // Step 4: 发送回访邮件
  await sendCheckInEmail(email);

  return { userId: user.id, status: "onboarding_complete" };
}

// 如果 Step 2 失败，只会重试 Step 2，不会重新执行 Step 1
// 如果服务重启，workflow 会从上次断点恢复
```

**AI 场景结合示例：**

```typescript
export async function aiResearchWorkflow(topic: string) {
  "use workflow";

  const searchResults = await webSearch(topic);   // step: 搜索
  const summary = await llmSummarize(searchResults); // step: LLM 摘要
  await sleep("1 hour");                          // 等待人工审核
  const approved = await checkApproval(topic);    // step: 检查审核状态
  if (approved) {
    await publishReport(summary);                 // step: 发布
  }
  return { topic, published: approved };
}
```

---

## 四、VoltAgent

### 4.1 简介

VoltAgent 是一个**TypeScript 优先的 AI Agent 工程框架**，专注于让开发者用代码优先（code-first）的方式构建、编排和部署生产级 AI Agent 系统。核心亮点是**多 Agent 编排 + 内置可观测性 + 类型安全的工具系统**。

### 4.2 核心优势

1. **TypeScript 原生 + 类型安全**：工具定义使用 Zod schema，编译时即可发现错误。
2. **多 Agent 编排模式**：支持 Supervisor / Pipeline / Parallel 等多种模式，可构建层级化 Agent 团队。
3. **声明式工作流引擎**：可定义 Trigger → Action 的自动化流程，连接外部事件源。
4. **MCP（Model Context Protocol）支持**：标准化工具调用协议，兼容 Claude / Cursor 等。
5. **内置 RAG 支持**：包含文档分块、嵌入、检索的完整链路。
6. **插件化记忆系统**：支持内存、SQL、向量数据库等多种记忆后端。
7. **VoltOps 可观测控制台**：内置可视化调试、日志检查、工作流可视化，本地优先保障隐私。
8. **Guardrails（护栏）**：内置输入/输出验证、PII 保护、Prompt 注入防护、工具访问控制。
9. **30+ LLM 支持**：OpenAI / Anthropic / Google / Mistral / Groq 等，切换无需改代码。

### 4.3 缺点

1. **仅限 TypeScript**：Python / Java 团队需要额外学习成本或桥接方案。
2. **社区与成熟度**：相比 LangChain 仍较新，第三方插件和社区资源较少。
3. **Beta 状态**：API 可能在大版本间发生破坏性变更。
4. **企业功能依赖 VoltOps**：部分高级运维功能（分析、多云部署）依赖 VoltOps 控制台。
5. **水平扩展文档不足**：高并发和大规模场景的性能优化文档较少。
6. **非开箱即用**：仍需开发者自行设计 Agent 逻辑、工作流和错误处理。

### 4.4 Demo

```typescript
// 安装
// npm create voltagent-app@latest

import { VoltAgent, createTool } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// 1. 定义工具（类型安全）
const weatherTool = createTool({
  name: "getWeather",
  description: "获取指定城市的天气信息",
  inputSchema: z.object({
    city: z.string().describe("城市名称"),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    condition: z.string(),
  }),
  async execute({ input }) {
    // 真实场景替换为 API 调用
    return {
      temperature: 22,
      condition: `${input.city} 今天晴朗，气温 22°C`,
    };
  },
});

const searchTool = createTool({
  name: "searchKnowledge",
  description: "搜索内部知识库",
  inputSchema: z.object({
    query: z.string(),
  }),
  outputSchema: z.object({
    results: z.array(z.string()),
  }),
  async execute({ input }) {
    return {
      results: [`关于 "${input.query}" 的知识库结果 1`, `结果 2`, `结果 3`],
    };
  },
});

// 2. 创建 Agent
const agent = new VoltAgent({
  name: "智能助手",
  description: "可以查天气和搜索知识库的助手",
  llm: new VercelAIProvider(),
  model: openai("gpt-4o"),
  tools: [weatherTool, searchTool],
  systemPrompt: "你是一个友好的中文助手，可以查询天气和搜索知识库。",
});

// 3. 运行
async function main() {
  const response = await agent.chat([
    { role: "user", content: "北京今天天气怎么样？" },
  ]);
  console.log(response);
}

main();
```

**多 Agent Supervisor 模式：**

```typescript
import { VoltAgent, createSupervisor } from "@voltagent/core";

// 专业 Agent：天气
const weatherAgent = new VoltAgent({
  name: "天气专家",
  tools: [weatherTool],
  systemPrompt: "你只负责天气查询。",
  /* ...llm 配置... */
});

// 专业 Agent：知识库
const knowledgeAgent = new VoltAgent({
  name: "知识库专家",
  tools: [searchTool],
  systemPrompt: "你只负责知识库检索。",
  /* ...llm 配置... */
});

// Supervisor：协调分发
const supervisor = createSupervisor({
  name: "总调度员",
  agents: [weatherAgent, knowledgeAgent],
  systemPrompt: "根据用户问题判断应该交给哪个专家处理。",
  /* ...llm 配置... */
});

// 用户提问自动路由到合适的子 Agent
const result = await supervisor.chat([
  { role: "user", content: "北京天气怎么样？另外帮我查下公司的出差政策。" },
]);
```

---

## 五、横向对比

| 维度 | DeepAgents | Vercel Workflow | VoltAgent |
|------|-----------|----------------|-----------|
| **核心场景** | AI 自主规划 & 执行复杂任务 | 通用异步持久化工作流 | AI Agent 团队编排 & 生产化 |
| **语言** | Python | TypeScript | TypeScript |
| **LLM 集成** | ⭐⭐⭐ 原生深度集成 | ⭐ 无内置，需自行组合 | ⭐⭐⭐ 30+ 模型统一接口 |
| **持久化/容错** | ⭐⭐ 文件系统 + LangGraph 状态 | ⭐⭐⭐ 原生持久化/重放/重试 | ⭐⭐ 插件化记忆系统 |
| **多 Agent** | ⭐⭐⭐ 子 Agent 派生 | ⭐ 不直接支持 | ⭐⭐⭐ Supervisor/Pipeline/Parallel |
| **工具系统** | ⭐⭐ LangChain tools | ⭐ 无专用工具系统 | ⭐⭐⭐ Zod 类型安全 + MCP |
| **可观测性** | ⭐⭐ LangSmith 追踪 | ⭐⭐ Vercel 仪表盘 | ⭐⭐⭐ VoltOps 可视化控制台 |
| **学习曲线** | 陡峭（多层抽象） | 低（async/await 风格） | 中等（TypeScript + Agent 概念） |
| **厂商锁定** | 中（LangChain 生态） | 高（Vercel 平台） | 低（开源可自部署） |
| **适合团队** | Python AI/ML 团队 | 全栈/前端 + Vercel 用户 | TypeScript 全栈团队 |

---

## 六、选型建议

| 场景 | 推荐 |
|------|------|
| 需要 AI Agent 自主规划并执行多步骤任务（如自动调研、代码生成） | **DeepAgents** |
| Python 技术栈，已在使用 LangChain 生态 | **DeepAgents** |
| 需要通用持久化工作流（用户注册、定时任务、多步骤业务流程） | **Vercel Workflow** |
| 已使用 Vercel + Next.js，需要 serverless 工作流 | **Vercel Workflow** |
| TypeScript 团队，需要构建多 Agent 协作系统 | **VoltAgent** |
| 需要内置可观测性、安全护栏、类型安全 | **VoltAgent** |
| 需要快速切换 LLM 供应商，避免厂商锁定 | **VoltAgent** |

---

## 参考链接

- [DeepAgents GitHub](https://github.com/langchain-ai/deepagents)
- [DeepAgents 文档](https://docs.langchain.com/oss/python/deepagents/overview)
- [Vercel Workflow SDK](https://useworkflow.dev/)
- [Vercel Workflow GitHub](https://github.com/vercel/workflow)
- [VoltAgent 官网](https://voltagent.dev/)
- [VoltAgent GitHub](https://github.com/voltagent/voltagent)
