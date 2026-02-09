# Coding with AI
> You won’t be replaced by AI, but you will be replaced by someone who uses AI better than you.  

> [I don't write code anymore - I sculpt it.](https://www.jerpint.io/blog/2026-01-24-i-dont-write-code-anymore-i-sculpt-it/)

## Coding agents can complete most programming tasks
> (2026) May I was amazed that some prompts produced code that worked out of the box, this is now my expectation.
> [Peter Steinberger](https://steipete.me/posts/2025/shipping-at-inference-speed)

> Given the latest lift in LLM coding capability, like many others I rapidly went from about 80% manual+autocomplete coding and 20% agents in (2025) November to 80% agent coding and 20% edits+touchups in (2025) December. i.e. I really am mostly programming in English now, a bit sheepishly telling the LLM what code to write.
> [Andrej Karpathy](https://x.com/karpathy/status/2015883857489522876?s=20)

See in the real: [terminal-bench](https://www.tbench.ai/): a benchmark for ai agents in terminal environments.

## How to improve coding quality with AI
### Provide more context
The more context you give the agent, the better the results.

#### 1) Before each conversation
Put project background and rules in [`AGENTS.md`](https://agents.md/). It's a readme for AI agents. For example:  
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

More examples: [Codex Agents.md](https://github.com/openai/codex/blob/main/AGENTS.md)

Suggest reading:
- [AGENTS.md outperforms skills in our agent evals](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals): Embed a docs index directly in `AGENTS.md` passed all coding generate tasks(Compare to using skills and Skill with explicit instructions).
- 不断修补 `AGENTS.md` 让 agent 少犯错。

#### 2) Clarify requirements
Point to the exact files or entry points. Include relevant tools and runtime context.
When the context gets too long, open a new window.

For frontend work, specify the exact element or component to modify, for example in [agentation](https://github.com/benjitaylor/agentation).

#### 3) Wrap SOP to [skills](../../data/s/skill.md)
Wrap your standard operating procedures (SOP) into reusable skills. This ensures consistency and saves time. Examples of skills:
- [Next.js Agent Skills](https://github.com/vercel-labs/next-skills)
- [React Best Practices](https://github.com/vercel-labs/agent-skills/blob/react-best-practices/skills/react-best-practices/SKILL.md)
- [vue](https://github.com/antfu/skills/tree/main/skills/vue) 

Use `$` to proactively invoke a skill, Or skills would be triggered automatically.

#### 4) Extra tools
##### CLI Tools
Recommend providing CLI tools to the agent, because agents are good at using tools. It can use `--help` to learn how to use them and easy to combine them.

##### MCP
- Provide package docs when introducing new dependencies (e.g. Context7 MCP).  
- Use Chrome DevTools MCP when UI inspection is needed.

## How to speed up coding with AI
[Vibe Kanban](https://github.com/BloopAI/vibe-kanban) orchestrates multiple coding agents.

### 1) Parallel Coding
Agents can take minutes to generate code. Use Git worktrees to parallelize tasks that won't conflict. Codex, Claude Code, and Cursor support worktrees and make them easy to create and remove.

A worktree is like a lightweight clone with its own folder. It saves disk space by sharing the same `.git/objects` directory, which contains blobs, commits, and tags.

View all worktree: `git worktree list`.

### 2) Config high frequency workflow to skills


### 3) Use sub-agents
Sub agents speed up the speed and not mixing the prompts.

### 4) Run in cloud
[Codex Web](https://developers.openai.com/codex/cloud/)


### 5) Privilege config
Use "YOLO" mode only when you truly don't need confirmations.

## Resources
* [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) production-ready agents, skills, hooks, commands, rules, and MCP configs built over 10+ months.
* [Superpowers](https://github.com/obra/superpowers) a complete software development [workflow](https://github.com/obra/superpowers/tree/main/skills): brainstorming, planning, subagent development, TDD, code review.
* [Codex CLI 1UP](https://github.com/regenrek/codex-1up) equips your Codex CLI agent with powerful tools.
* [Skills for iOS and Swift development workflows](https://github.com/Dimillian/Skills)
* [How Boris(Author of Claude Code) use Claude Code](https://x.com/bcherny/status/2007179832300581177)
