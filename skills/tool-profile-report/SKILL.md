---
name: tool-profile-report
description: Create a structured, up-to-date profile for a named tool, including what problem it solves, features, roadmap, comparative table, and install/config/run guidance. Trigger when the user supplies a tool name and asks for a profile, briefing, or detailed comparison.
---

# Tool Profile Report

## Input expectations
- The user will supply the tool name as the core input (e.g., “Profile the tool X” or “Write a tool profile for Y”). Treat that name as the subject of every section.


## Workflow
1. **Confirm the subject.** Restate the tool name before proceeding.
2. **Search the web for the latest information.** Use up-to-date sources, focus on the tool’s official site, changelog, blog posts, and reputable comparison articles. Always aim for the most recent details (future dates relative to 2026-01-04 need verification).
3. **Compose the report** following the user’s output requirements.
4. **Request confirmation** by explicitly asking the user to review and say “confirm” (or equivalent) before persisting the report to disk.
5. **Write the file** only after confirmation. Store it at `/data/[tool_initial]/[tool_name].md` under the repo root (e.g., tool “EchoAI” → `/data/e/EchoAI.md`). Create the directory if needed and ensure the filename uses the exact tool name the user provided (case preserved) to match future lookups.

## Output requirements
```
---
status: draft
category: tool
tags: tag1, tag2, tag3(are limited to three; select the most defining keywords)
create_date: YYYY-MM-DD (use current date in ISO format)
---

# [Tool Name](Official Website URL)
## Solved problem
- Summarize the primary pain point or use case the tool addresses. Mention the industries or teams that benefit most.

## Features
- List the standout capabilities (3–6 bullets) with short explanations. Highlight any recent updates you discovered.

## Different voices
- Provide at least two contrasting user perspectives (e.g., “Loves…” / “Wishes…”). Frame them as brief, persona-like statements (specify “like” or “dislike” language if present in sources).

## Roadmap
- Outline near-term items or publicly announced plans. If the roadmap is speculative, label it as such and cite the source date.

## Compare with other tools
- Present a table that compares the subject tool to 2–3 competitors. Include columns for “Tool,” “Core functions,” and “Key differentiators.” Cite release/date info if available.

## How to use
### Install
- Provide the standard installation option(s) (package managers, cloud signup, download links) and mention prerequisites.

## Config
- Detail any essential configuration steps, required accounts, or environment variables.

## Run
- Describe how to launch or operate the tool, including typical first actions or workflow tips.

## References
- List URLs of all sources used to compile the report, formatted as a bulleted list.
```

## Additional guidance
- Never answer without searching for up-to-date information; the skill’s purpose is to document current tool intelligence.
- When referencing multiple sources, note the most reliable ones and date them to clarify freshness.
- Keep the language concise and professional, mirroring the tone of a concise product brief.
