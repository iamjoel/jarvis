---
status: done
category: tech
tags: [llm, ai-agent, harness, evaluation, testing, claude, openai, codex]
create_date: 2026-03-27
---

# Harness：Claude 和 OpenAI 语境下的含义与用法

> **Harness**（直译"挽具/套具"）在 AI 编程与评估领域，指**一套将被测对象包裹起来、提供执行环境与反馈闭环的脚手架**。无论是跑单元测试、评估模型能力，还是驱动 Agent 完成任务，harness 都充当"中间层"，让外部系统可以以标准化方式触发、观察、评分。

---

## 一、概念速览

| 维度 | 说明 |
|------|------|
| **字面意思** | 挽具、套具——把零散部件"套"在一起、形成可控系统 |
| **核心作用** | 提供标准化的执行环境、输入/输出接口、评分机制 |
| **常见形态** | 测试 harness、评估 harness、Agent harness |
| **关键特征** | 可重复、可对比、与被测对象解耦 |

---

## 二、OpenAI 语境下的 Harness

### 2.1 SWE-bench 测试 Harness

OpenAI 用 [SWE-bench](https://www.swebench.com/) 基准测试来衡量 AI 模型（包括 Codex、GPT-4o 等）修复真实 GitHub Issue 的能力。

**Harness 的作用：**
1. **克隆仓库、切换到指定 commit**，搭建与 Issue 相关的代码环境。
2. **运行对应的测试套件**（通常是 `pytest`），收集测试结果。
3. **对比修复前/后的测试通过率**，输出 `resolved` / `unresolved` 结论。
4. 对每个样例独立执行，保证可复现性。

```
┌──────────────────────────────────────────┐
│              SWE-bench Harness            │
│  ┌─────────┐    ┌─────────────────────┐  │
│  │  Issue  │───▶│  模型生成 patch       │  │
│  └─────────┘    └────────┬────────────┘  │
│                          │               │
│                  ┌───────▼──────────┐    │
│                  │  应用 patch 到仓库 │    │
│                  └───────┬──────────┘    │
│                          │               │
│                  ┌───────▼──────────┐    │
│                  │  运行测试套件      │    │
│                  └───────┬──────────┘    │
│                          │               │
│                  ┌───────▼──────────┐    │
│                  │  输出 pass/fail   │    │
│                  └──────────────────┘    │
└──────────────────────────────────────────┘
```

### 2.2 OpenAI Evals 框架

OpenAI 开源了 [openai/evals](https://github.com/openai/evals) 框架，用于评估模型输出质量。其核心概念就是 **eval harness**：

- **Eval 类**：每种评估类型（Match、ModelGraded、Fuzzy…）是一个 harness，定义"如何跑"和"如何评分"。
- **Registry**：统一注册和调用各种 eval harness。
- **Runner**：遍历数据集，调用 harness，汇总指标。

示例（`evals/registry/evals/` 中一个典型 eval 配置）：

```yaml
coding/python-basic:
  id: coding/python-basic
  metrics: [accuracy]
  class: evals.elsuite.basic.match:Match   # ← 这就是 harness 类
```

### 2.3 Codex / Agents SDK 中的 Harness

在 Codex CLI 或 OpenAI Agents SDK 的工程实践中，harness 特指：

> **在沙盒容器里包住 Agent，统一提供文件系统、Shell 执行、测试反馈的执行层。**

- Codex 在执行代码变更后，会通过 harness **自动运行 `npm test` / `pytest`** 等命令，把结果作为工具调用的返回值反馈给模型。
- Harness 负责超时、进程隔离、结果解析，让模型只需关注"测试过了吗"。

---

## 三、Claude（Anthropic）语境下的 Harness

### 3.1 Claude Code 的 Test Harness 实践

Claude Code（`claude` CLI）在协助工程师做代码任务时，会遵循一套以 harness 为核心的工作流：

1. **理解 harness 的存在**：Claude 会主动询问或探测项目里的测试命令（`package.json` 的 `test` 脚本、`Makefile` 的 `test` target 等），把它们视为"harness 入口"。
2. **修改代码 → 跑 harness → 观察结果 → 再修改**：每次代码变更后，Claude 都会调用测试 harness，以测试输出作为验证信号。
3. **在 CLAUDE.md 中声明 harness**：推荐在项目根目录的 `CLAUDE.md` 里写明如何运行测试（即 harness 命令），让 Claude 能自动发现并复用。

```markdown
<!-- CLAUDE.md 示例 -->
## Running Tests
Use `pytest tests/ -x` to run the test harness.
On failure, check `tests/fixtures/` for expected outputs.
```

### 3.2 Anthropic 的模型评估 Harness

Anthropic 内部使用评估 harness 来：

- 评测 Claude 在编码、推理、安全对齐等维度的能力（类似 OpenAI Evals）。
- 对接 EleutherAI 的 **lm-evaluation-harness**（见下节），在标准化基准上对比不同版本的 Claude。
- 运行 "红队测试"（Red Teaming）时，harness 提供统一的对话脚手架和打分规则。

### 3.3 Computer Use 的 Tool Harness

Claude 的 **Computer Use** 功能使用了一个工具 harness：

- 屏幕截图、鼠标点击、键盘输入等工具被统一注册到 harness 中。
- Harness 在每次 Claude 发出工具调用时负责执行、截图、返回结果，形成"视觉反馈闭环"。
- 官方 demo 仓库 `anthropics/anthropic-quickstarts` 中的 `computer-use-demo` 就是一个完整的 harness 实现。

---

## 四、业界通用的 lm-evaluation-harness

OpenAI、Anthropic 以及几乎所有主流 AI 实验室都会使用 [EleutherAI/lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) 进行标准化评测。

**核心设计：**

| 层次 | 说明 |
|------|------|
| **Task** | 一个评测任务（如 HellaSwag、MMLU、HumanEval）|
| **Harness** | 包住 Task 的执行框架：加载数据、调用模型、对比答案、汇总指标 |
| **Model Wrapper** | 把 OpenAI API / Anthropic API / HuggingFace 模型统一抽象为相同接口 |
| **CLI** | `lm_eval --model openai-chat-completions --tasks mmlu` |

```
lm-evaluation-harness
├── lm_eval/
│   ├── tasks/           ← 各个评测任务（HellaSwag, MMLU, HumanEval…）
│   ├── models/          ← 模型 wrapper（openai, anthropic, hf…）
│   └── evaluator.py     ← 核心 harness 逻辑
```

---

## 五、Harness 的三种典型模式总结

| 模式 | 场景 | 代表实现 |
|------|------|---------|
| **测试 Harness** | 验证代码修改是否正确 | SWE-bench harness、pytest/Jest 封装 |
| **评估 Harness** | 评测模型在标准基准上的能力 | lm-evaluation-harness、openai/evals |
| **Agent Harness** | 给 Agent 提供工具执行环境与反馈闭环 | Claude Computer Use、Codex 沙盒 |

---

## 六、为什么 Harness 对 AI 编程 Agent 如此重要？

> **没有 harness，Agent 就是"盲人开车"。**

1. **闭环验证**：Agent 每次修改代码后，harness 给出"通过/失败"信号，使 Agent 能自我纠错，而不只靠模型猜测。
2. **可重复性**：任何人在任何机器上运行同一 harness，结果一致——这是对比不同模型/方案的前提。
3. **隔离性**：Harness 在沙盒中运行，避免 Agent 的代码执行影响宿主环境。
4. **可观察性**：Harness 记录每一步的输入输出、耗时、错误信息，方便调试和审计。

---

## 七、实践建议

**在使用 Claude Code 或 Codex 时：**

1. **先写 harness，再让 AI 写代码**：有了可运行的测试套件，AI 才能用测试结果验证自己的修改。
2. **在 `CLAUDE.md` / `AGENTS.md` 中声明测试命令**：如 `pytest tests/ -x -q`，让 Agent 自动发现入口。
3. **保持 harness 快速**：测试在 30 秒内跑完，AI 才有足够多的"尝试-验证"循环。
4. **用 harness 结果作为验收标准**：与其描述"实现 XX 功能"，不如说"让 `npm test` 全部通过"——这对 Agent 更可操作。

---

## 参考资料

- [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://www.swebench.com/)
- [openai/evals: Evals is a framework for evaluating LLMs](https://github.com/openai/evals)
- [EleutherAI/lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness)
- [Anthropic: Claude Code Best Practices](https://docs.anthropic.com/en/docs/claude-code/best-practices)
- [anthropics/anthropic-quickstarts: computer-use-demo](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)
