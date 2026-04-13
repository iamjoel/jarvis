# AGENTS
## Store Research Results
For any research task requested by the user:
1. Write the final research output to `data/`.
2. Review `data/readme.md`.
3. Update `data/readme.md` if the new or changed output should be indexed, linked, or described there.

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
