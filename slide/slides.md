---
title: 用 AI 编程
subtitle: 基于 coding-with-ai-zh.md
layout: cover
---

# 用 AI 编程

你不会被 AI 取代，但会被更会用 AI 的人取代。

---
layout: quote
---

“我不再写代码——我在雕刻它。”  
<https://www.jerpint.io/blog/2026-01-24-i-dont-write-code-anymore-i-sculpt-it/>

---
# 编程代理可以完成大多数编程任务

- 现在我期待提示能直接产出可用代码。
- 我已经从手写为主转向代理编程为主。
- 现实中的例子：terminal-bench。  
  <https://www.tbench.ai/>

> Peter Steinberger  
> <https://steipete.me/posts/2025/shipping-at-inference-speed>

> Andrej Karpathy  
> <https://x.com/karpathy/status/2015883857489522876?s=20>

---
# 提升编码质量：提供更多上下文

- 把项目背景与规则写进 `AGENTS.md`。
- 提前放好安装、启动、测试与代码风格。
- 不断修补 `AGENTS.md` 让 agent 少犯错。

---
# 提升编码质量：澄清需求

- 指明确切文件与入口点。
- 说明相关工具与运行时上下文。
- 上下文过长时，开新窗口。
- 前端工作要点名组件或元素。

---
# 提升编码质量：SOP -> skills

- 把标准流程封装成可复用 skills。
- 通过 `$` 主动触发或自动触发。
- 示例：Next.js、React Best Practices、Vue。

---
# 提升编码质量：额外工具

- CLI 工具：代理擅长通过 `--help` 学习并组合使用。
- MCP：引入新依赖时附包文档；UI 检查时用 Chrome DevTools MCP。

---
# 加速编码：并行编程

- 用 Git worktrees 并行处理不冲突任务。
- worktree 是轻量克隆，共享 `.git/objects`。
- 查看所有 worktree：`git worktree list`。

---
# 加速编码：高频配置

- 高频工作流 → skills。
- 高频提示 → custom prompts（已弃用，改用 skills）。
- 云端运行：Codex Web。
- 权限配置：只在不需要确认时使用 YOLO。

---
# 资源

- Everything Claude Code  
  <https://github.com/affaan-m/everything-claude-code>
- Superpowers  
  <https://github.com/obra/superpowers>
- Codex CLI 1UP  
  <https://github.com/regenrek/codex-1up>
- Skills for iOS and Swift development workflows  
  <https://github.com/Dimillian/Skills>
- How Boris use Claude Code  
  <https://x.com/bcherny/status/2007179832300581177>
