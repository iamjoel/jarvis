# Coding with AI
> You won’t be replaced by AI, but you will be replaced by someone who uses AI better than you.
> [I don't write code anymore - I sculpt it.](https://www.jerpint.io/blog/2026-01-24-i-dont-write-code-anymore-i-sculpt-it/)


## Coding Agent can complete most programming tasks
> (2026) May I was amazed that some prompts produced code that worked out of the box, this is now my expectation. 
> [Peter Steinberger](https://steipete.me/posts/2025/shipping-at-inference-speed)

> Given the latest lift in LLM coding capability, like many others I rapidly went from about 80% manual+autocomplete coding and 20% agents in (2025) November to 80% agent coding and 20% edits+touchups in (2025) December. i.e. I really am mostly programming in English now, a bit sheepishly telling the LLM what code to write.
> [Andrej Karpathy](https://x.com/karpathy/status/2015883857489522876?s=20)

See in the yield [terminal-bench](https://www.tbench.ai/): a benchmark for ai agents in terminal environments.

## How to improve coding quality with AI
### More Context
The more context you provide to the AI, the better the results.

#### 1 Before each conversation
Give the background information by Agents.md.

#### 2 Clarify requirements
The entrance of the files. Tools: 

In frontend, the element need to modify, like [agentation](https://github.com/benjitaylor/agentation)。

#### 3 Extra tools
The doc of the new package: Context 7 MCP.

Chrome dev mcp.

## How to speed up coding with AI
[Vibe kanban](https://github.com/BloopAI/vibe-kanban) Orchestrate multiple coding agents.

### Parallel Coding
It costs minutes of time for agents to generate code. By use worktree(feature support by git), we can parallel some not conflicted tasks to speed up the coding process. Codex, Claude Code, Cursor both support worktree(easy to create and remove worktree).

The worktree is like clone, the same part is they both have separate folders. Worktree save storage space, because it share the same `.git/object` folder. The `.git/object` folder is big, it includes all files(blob), commits and tag.

View all worktree: `git worktree list`.

### Config high frequency workflow to skills

### Config high frequency prompt to [custom prompts](https://developers.openai.com/codex/custom-prompts/)

### Priviage config
Yolo if you think it's no need to confirm 

## Framework
* [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) Production-ready agents, skills, hooks, commands, rules, and MCP configurations evolved over 10+ months of intensive daily use building real products.
* [Superpowers](https://github.com/obra/superpowers): a complete software development [workflow](https://github.com/obra/superpowers/tree/main/skills). Include: brainstorming, writing-plans, subagent-driven-development or executing-plans, test-driven-development, code-review
* [Codex CLI 1UP](https://github.com/regenrek/codex-1up) equips your Codex CLI coding agent with powerful tools.
