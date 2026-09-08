# AGENTS

## Writing Style

Avoid using slop words or phrases like "Bottom Line:" in conclusions, "delve," "foster," "leverage," "it's worth noting," "importantly," "Question? Answer." or "This isn't about X. It's about Y.", "genuinely" or hyphenated compound descriptions and adjectives. Do not use concluding summary statements such as "In short:..", "The simplest mental model is:...".

State the intended action directly. Avoid adding what you won't do, what will remain unchanged, or how you'll separate or categorize results. Do not use contrastive framing such as "X, not Y" or "X—not Y" that introduces an unprompted alternative that the user didn't ask about. Avoid invented compound labels like "exact-head checks" and "editorial-row layouts", vague qualifiers, and canned transitions; use plain verbs and prepositions to state the actual relationship directly.

These style preferences apply to prose you write. Preserve exact code identifiers, established technical terms, quotations, and required artifact fields.

## Task Execution

Use the user's request and prior authorization to complete the work within scope. Resolve routine choices from context; ask when missing information materially changes the result or an action needs authorization. Skill guidance should support that scope and existing authorization.

## Research and Knowledge Documents

- Save requested research reports and reusable findings under `data/`. A brief factual answer or conversational follow-up does not by itself require a new document.
- Read `data/readme.md` and link reusable output from the relevant secondary index. Update the top-level index when its navigation needs to change.
- Put a summary near the top of `data/` Markdown documents, using the document's language (`高密度摘要` or `High-Density Summary`). Capture the conclusion, mechanism, decision entry point, misconceptions, and useful related links; short documents may combine these into a few sentences without empty fields or a duplicate introduction.
- Keep the summary consistent with meaningful changes. Add one when substantially editing an existing document that lacks it.
- In question-driven indexes, briefly explain what each question helps the reader judge or choose. Use a `为什么重要` column for tables of questions. An adjacent explanation can serve this purpose; update the entries involved in the task.

## Web Information

Choose an available tool suited to the source and required access. Prefer a relevant connector or direct source reader when it can retrieve the needed content. For platform-specific capabilities, inspect `opencli list` when OpenCLI is available and needed. If a tool is unavailable or fails, use another suitable route and state material source limitations.

## Output Templates

Use the matching template for document creation or revision. Scale sections to the request; preserve facts, source requirements, and fields required by the consuming system.

| Document | Template |
|---|---|
| Exercise modality | `knowledge/t/template-exercise-project-output.md` |
| Body indicator | `knowledge/t/template-body-indicator-output.md` |
| Health risk behavior | `knowledge/t/template-health-risk-behavior-output.md` |
| Disease | `knowledge/t/template-disease-output.md` |
| Feature or behavior change issue | `knowledge/t/template-project-issue-feat.md` |
| Bug fix issue | `knowledge/t/template-project-issue-fix.md` |
| Maintenance issue | `knowledge/t/template-project-issue-chore.md` |

For project and diary data writes, use the environment-specific entry described in `private/projects/readme.md`. Pilot applies changes through its plan/apply approval tools. A Codex session without those tools prepares the complete handoff for Pilot using that entry. Editing the project's workflow documentation, templates, and implementation follows the user's normal authorization for those files.

## HTML Design System

Use `design-system/miro.md` by default: a light canvas, near-black text, generous whitespace, pastel accents, rounded components, and minimal shadows. Use `design-system/Supabase.md` for a dark developer-facing or terminal-like product. Keep one system dominant and follow any explicit user design direction.
