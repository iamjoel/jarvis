---
name: company-success-deep-dive
description: Produce a deep investigative report explaining why a specific company succeeds, using structured methodologies common in professional research firms.
---

# Company Success Deep Dive

## Input expectations
- The user provides a single target company (name + optional ticker, region, industry).
- The user can optionally provide scope (time period), audience (investor, executive, general), and report length.
- If any of these are missing, I ask for them before drafting.

## Methodology backbone (use all, cite as applicable)
- **MECE issue tree** to structure the investigation (market, company, competitive advantage, execution, risks).
- **Triangulation**: validate key claims with at least two sources or one source + inference note.
- **Porter’s Five Forces** for industry structure.
- **7 Powers (Hamilton Helmer)** for durable advantage.
- **Value Chain** + **Business Model** analysis (where profits come from and who pays).
- **Unit economics** + **scaling dynamics** (margins, CAC/LTV, operating leverage).
- **Strategy vs. execution** split (what the company chose vs. how it delivers).

## Workflow
1. **Confirm scope.** Restate company, region, period, and audience. Ask missing details.
2. **Build the research plan** using the template in `templates/research-plan.md`.
3. **Collect evidence** (public filings, interviews, customer reviews, hiring signals, product docs).
4. **Synthesize** using the report template in `templates/report.md`.
5. **Quality check**: flag weak evidence, add caveats, list open questions.
6. **Request confirmation** before writing the final report to disk.
7. **Write the report** to `/data/company-reports/[Company Name].md`.

## Output requirements
- Use the report outline in `templates/report.md`.
- Mark every claim as **Evidence**, **Inference**, or **Speculation**.
- Include a **Sources & Evidence Log** section with URLs or file paths.
- Keep tone professional, investigative, and concise.

## Additional guidance
- If the user requests a “short” report, compress to Executive Summary + 4 core sections + Risks.
- If sources are thin, say so explicitly and propose what additional data is needed.
- Never invent numbers. If data is missing, estimate and label as **Inference**.
