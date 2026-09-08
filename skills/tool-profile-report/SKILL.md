---
name: tool-profile-report
description: Create a current profile or detailed comparison of a named tool, covering its purpose, capabilities, alternatives, and practical setup.
---

# Tool Profile Report

Use the named tool as the subject. Resolve ambiguity only when the name could identify materially different products. Default to a concise brief in the user's language, with current information as of the research date.

## Research and delivery

1. Check current official documentation, releases, pricing and public plans through suitable available tools. Use dated user reports for experiences and limitations; distinguish them from product claims.
2. Compose the profile using the sections below, adjusting depth to the request and available evidence.
3. Save the report to `data/<tool-initial>/<tool-name>.md` relative to the repository root. Preserve the product's name and case where the filename permits; replace path separators or unsafe filename characters. Review `data/readme.md` and maintain the relevant index under the project's rules. Existing authorization to research includes this save; honor an explicit request to review a draft first.

## Report structure

Use frontmatter with `status: draft`, `category: tool`, up to three defining tags, and the current `create_date` in ISO format.

- **Title:** Tool name linked to its official site.
- **High-density summary:** Follow the project's document rules in the report's language.
- **Solved problem:** Primary use case and the teams or people who benefit.
- **Features:** Distinctive capabilities and relevant recent changes.
- **User perspectives:** Source-backed strengths and limitations when available. State any gaps; do not invent customer quotes or personas to fill a quota.
- **Roadmap:** Dated public commitments or plans. If none are available, say so; label material inference clearly.
- **Comparison:** Compare relevant alternatives on capabilities and meaningful differences. Two or three alternatives usually suffice for a full profile.
- **How to use:** Applicable installation or signup, prerequisites, essential configuration, and a first useful workflow. Use `pnpm` for package installation guidance when applicable to this project.
- **References:** Link the sources used, with dates where freshness affects the conclusion. Place citations near supported claims as well.

Keep missing facts explicit. When access prevents current verification, describe the limitation and qualify the affected sections.
