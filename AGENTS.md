# AGENTS
## Store Research Results
For any research task requested by the user:
1. Write the final research output to `data/`.
2. Review `data/readme.md`.
3. Update `data/readme.md` if the new or changed output should be indexed, linked, or described there.

## Maintain Document Density
When creating or editing Markdown documents under `data/`:
1. Add a high-density summary block near the top of the document, immediately after the main title when practical. Match the block heading and content language to the current document's primary language, such as `## 高密度摘要` for Chinese documents or `## High-Density Summary` for English documents.
2. Use the block to capture the document's most reusable knowledge: one-sentence conclusion, core mechanism, judgment entry point, common misconceptions, and related documents.
3. When changing a document's conclusions, structure, scope, or important details, update its high-density summary block in the same edit.
4. If an existing `data/` document does not yet have a high-density summary block and you make a meaningful content edit, add one instead of leaving the document in the older format.

## Fetch Information from the Web
If the user needs information from Twitter/X, Reddit, WeRead (微信读书), or any specific website:
1. Use `Bash` to inspect available tools with `opencli list`.
2. Choose the most relevant tool available.
3. Use that tool to retrieve the information.
4. Only use fallback methods if no suitable tool is available.

## HTML Design System
When creating or editing HTML pages and their CSS:
1. Treat `design-system/miro.md` as the default design system. [Preview](https://getdesign.md/design-md/miro/preview).
2. Unless the user says otherwise, follow the Miro-inspired direction: light canvas, near-black text, generous whitespace, pastel accents, rounded components, and minimal shadow depth.
3. Use `design-system/Supabase.md` when the page is better served by a dark, developer-facing, terminal-like, or more technical product aesthetic. [Preview](https://getdesign.md/design-md/supabase/preview).
4. If both references are relevant, keep one system dominant instead of blending them evenly.
5. When no explicit design direction is given, start from Miro and switch to Supabase only with a concrete reason.
