---
status: draft
category: tool
tags: multi-agent, CLI, AI-collaboration
create_date: 2026-01-04
---

## Solved problem
Stigmergy CLI turns a sprawling multi-model workflow into a single orchestrated terminal experience, letting engineering and research teams route tasks to Claude, Gemini, Qwen, iFlow, Qoder, CodeBuddy, Copilot, Codex, Kode, and other assistants without jumping between vendor consoles. It keeps shared workspaces, ResumeSession v1.2.1 memory, and install/deploy/init hooks aligned so every participant has the same context and cross-CLI routing logic.

## Features
- Unified install/deploy/init orchestration (`stigmergy setup`) plus modular hooks that auto-configure each agent and workspace.
- Smart natural-language routing that understands 12 languages and chooses the best AI tool while sharing ResumeSession history across providers.
- Intelligent CLI discovery and auto-deploy scripts (`stigmergy install`, `stigmergy deploy`, `stigmergy init`) that preflight each tool, surface availability, and recover sessions when a process fails.
- Hook integration invites targeted automation by surfacing CLI commands, scanners, or scanners into the shared orchestration layer.
- Rolling beta improvements (v1.3.0-beta.0) focused on smart routing, smaller modular builds, and npm postinstall auto-configuration to minimize manual setup.

## Different voices
- Loves: “One command like `stigmergy call “create a modern web app”` or `stigmergy claude “write a helper”` routes tasks across models while preserving shared session history, so we treat Stigmergy as a single cross-CLI assistant.”
- Wishes: The public README still lacks a discoverable tagline or website link, so newcomers discover the project via npm or GitHub without a clear positioning pitch.

## Roadmap
- The 1.3 beta roadmap doubles down on modular architecture, smart auto-routing, full setup wizard, and ResumeSession recovery, signaling that each upcoming release will polish CLI discovery, hook automation, and npm postinstall conveniences before the next stable channel.

## Compare with other tools
| Tool | Core functions | Key differentiators |
| --- | --- | --- |
| Stigmergy | Multi-agent CLI orchestrator that installs/deploys/initializes cross-tool hooks, shares ResumeSession memory, and auto-routes natural-language commands across Claude, Gemini, Qwen, iFlow, and more. | Terminal-first experience with 12-language commands, zero-Python footprint, smart routing (`stigmergy call`), and bundled setup/deploy workflow for consistent multi-CLI collaboration. |
| MassGen | Parallel multi-agent system (CLI, Web UI, and APIs) that runs voting-driven agents over Claude, Gemini, GPT, Grok, and LiteLLM with heavy tooling via MCP, config templates, and reactive context compression. | Voting-based consensus, flexible CLI/web interfaces, active release cadence (v0.1.33 Jan 2 2026 release), and robust CLI / config discovery that highlights cross-model synergy and multi-turn session preservation. |
| ccswarm | Rust-native orchestrator centered on Claude Code with Git worktree isolation, ProactiveMaster planning, and a message bus for specialized agent roles. | Low-level performance, built-in security scans, and ACP-backed sessions that keep state in isolated worktrees; targets high-stability automation with transparent diagnostics. |

## How to use
### Install
- `npm install -g stigmergy` (macOS/Linux: `sudo npm install -g stigmergy`; Windows PowerShell run as administrator). Use `--unsafe-perm`/`--force` when permission issues arise.

### Config
- Run `stigmergy setup` to install, deploy, and init in one wizard. Alternatively, run `stigmergy install`, `stigmergy deploy`, `stigmergy init` to stage each phase manually. Hook deployment verifies CLI availability and configures ResumeSession recovery.

### Run
- Invoke `stigmergy <tool> "<task>"` (examples: `stigmergy claude "write a Python function"`, `stigmergy gemini "translate this text"`, `stigmergy kode "analyze this code"`). Use `stigmergy call "<problem>"` to trigger automatic routing, or run natural-language commands in any of the 12 supported languages to let Stigmergy pick the best agent via its smart routing mesh.

## Related
- [evomap](../e/evomap.md) — AI agent self-evolution infrastructure via GEP; where Stigmergy orchestrates agents across models, evomap enables those agents' skills to persist, evolve, and propagate globally.
