# 用 AI 编程
> 你不会被 AI 取代，但会被更会用 AI 的人取代。  

> [我不再写代码——我在雕刻它。](https://www.jerpint.io/blog/2026-01-24-i-dont-write-code-anymore-i-sculpt-it/)

## 编程代理可以完成大多数编程任务
> (2026) 五月我还惊讶于有些提示能直接产出可用代码，现在这已经是我的预期。
> [Peter Steinberger](https://steipete.me/posts/2025/shipping-at-inference-speed)

> 鉴于最新 LLM 编码能力的提升，像很多人一样，我在 (2025) 11 月迅速从约 80% 手写+补全、20% 代理编程，转为 (2025) 12 月 80% 代理编程、20% 修改+修补。也就是说，我真的几乎是在用英语编程了，有点不好意思地告诉 LLM 该写什么代码。
> [Andrej Karpathy](https://x.com/karpathy/status/2015883857489522876?s=20)

现实中的例子： [terminal-bench](https://www.tbench.ai/)：一个用于终端环境中 AI 代理的基准测试。

## 如何用 AI 提升编码质量
### 提供更多上下文
你给代理的上下文越多，结果越好。

#### 1) 每次对话前
把项目背景和规则写进 [`AGENTS.md`](https://agents.md/)。它是 AI 代理的 readme。比如：  
```md
# AGENTS.md

## Setup commands
- Install deps: `pnpm install`
- Start dev server: `pnpm dev`
- Run tests: `pnpm test`

## Code style
- TypeScript strict mode
- Single quotes, no semicolons
- Use functional patterns where possible
```

更多示例： [Codex Agents.md](https://github.com/openai/codex/blob/main/AGENTS.md)

建议阅读：
- [AGENTS.md outperforms skills in our agent evals](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)：把文档索引直接嵌到 `AGENTS.md` 就能通过所有代码生成任务（对比使用 skills 或带明确指令的 Skill）。
- 不断修补 `AGENTS.md` 让 agent 少犯错。

#### 2) 澄清需求
指明确切文件或入口点，并补充相关工具与运行时上下文。
当上下文太长时，开一个新窗口。

做前端时，请明确要改的元素或组件，例如在 [agentation](https://github.com/benjitaylor/agentation) 中的写法。

#### 3) 把 SOP 封装成 [skills](../../data/s/skill.md)
把你的标准作业流程（SOP）封装成可复用的 skills，能保证一致性并节省时间。示例：
- [Next.js Agent Skills](https://github.com/vercel-labs/next-skills)
- [React Best Practices](https://github.com/vercel-labs/agent-skills/blob/react-best-practices/skills/react-best-practices/SKILL.md)
- [vue](https://github.com/antfu/skills/tree/main/skills/vue) 

用 `$` 主动触发某个 skill，或让 skills 自动触发。

#### 4) 额外工具
##### CLI 工具
建议给代理提供 CLI 工具，因为代理擅长使用工具。它可以用 `--help` 学习用法，也很容易组合使用。

##### MCP
- 引入新依赖时提供包文档（比如 Context7 MCP）。  
- 需要做 UI 检查时使用 Chrome DevTools MCP。

## 如何用 AI 加速编码
[Vibe Kanban](https://github.com/BloopAI/vibe-kanban) 用于编排多个编程代理。

### 1) 并行编码
代理生成代码可能要几分钟。用 Git worktrees 并行处理不冲突的任务。Codex、Claude Code、Cursor 都支持 worktrees，创建和删除都很方便。

一个 worktree 就像带有独立文件夹的轻量克隆。它通过共享 `.git/objects` 目录（包含 blobs、commits、tags）来节省磁盘空间。

查看所有 worktree： `git worktree list`。

### 2) 把高频工作流配置成 skills


### 3) 把高频提示配置成 [custom prompts](https://developers.openai.com/codex/custom-prompts/)
已弃用。用 skills 代替可复用提示。

### 4) 在云端运行
[Codex Web](https://developers.openai.com/codex/cloud/)


### 5) 权限配置
只有在你真的不需要确认时才使用 “YOLO” 模式。

## 资源
* [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) 面向生产的代理、skills、hooks、commands、rules 与 MCP 配置，积累超过 10 个月。
* [Superpowers](https://github.com/obra/superpowers) 一个完整的软件开发 [workflow](https://github.com/obra/superpowers/tree/main/skills)：头脑风暴、规划、子代理开发、TDD、代码审查。
* [Codex CLI 1UP](https://github.com/regenrek/codex-1up) 为 Codex CLI 代理提供强大工具。
* [Skills for iOS and Swift development workflows](https://github.com/Dimillian/Skills) 面向 iOS 与 Swift 开发流程的 skills。
* [How Boris(Author of Claude Code) use Claude Code](https://x.com/bcherny/status/2007179832300581177)
