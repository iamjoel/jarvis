---
name: github-ai-trends
description: Browse GitHub trending repositories, filter and categorize AI-related ones, and for each repo display what problem it solves, how it solves it, and what still needs to be improved. Trigger when the user asks to explore GitHub AI trends, discover trending AI repos, or get a structured overview of what's hot in the AI open-source world.
---

# GitHub AI Trends

Browse GitHub trending repositories, filter the AI-related ones, group them by category, and produce a structured summary for each repo covering the problem it solves, the solution approach, and known gaps or areas that still need improvement.

## When to Use This Skill

- User asks to "browse GitHub AI trends" or "show trending AI repos"
- User wants a categorised overview of what's popular in AI open source
- User wants to quickly understand what new AI tools/frameworks are gaining traction
- User wants to evaluate AI repos for adoption, contribution, or learning

## Workflow

1. **Fetch trending repos** — Navigate to `https://github.com/trending` and apply the language/topic filter for AI (try `https://github.com/trending?spoken_language_code=&since=daily` and then look for AI-related repos, or try topic pages such as `https://github.com/topics/artificial-intelligence`, `https://github.com/topics/llm`, `https://github.com/topics/machine-learning`).
2. **Filter AI-related repos** — Keep only repos whose name, description, or topic tags indicate AI/ML relevance. Keywords: `ai`, `llm`, `gpt`, `ml`, `deep-learning`, `neural`, `agent`, `rag`, `diffusion`, `vision`, `nlp`, `transformer`, `embedding`, `inference`, `fine-tune`, `copilot`, `chatbot`, `multimodal`.
3. **Categorize** — Assign each repo to one of the categories below. A repo may fit more than one; pick the primary one.
4. **Enrich each repo** — For each filtered repo, visit its GitHub page (README + About section) to extract the three required fields.
5. **Compose the report** — Follow the output template exactly.
6. **Ask for confirmation** — Ask the user to confirm ("confirm" or equivalent) before saving.
7. **Save the report** — Write to `/data/github-ai-trends/YYYY-MM-DD.md` (use today's date). Create the directory if it does not exist.

## Categories

| ID | Category | Examples |
|----|----------|---------|
| `llm` | Large Language Models & Foundation Models | New model weights, training frameworks |
| `agent` | AI Agents & Autonomous Systems | Multi-agent frameworks, tool-use, planning |
| `rag` | Retrieval-Augmented Generation & Knowledge | Vector stores, RAG pipelines, doc Q&A |
| `infra` | AI Infrastructure & MLOps | Serving, fine-tuning, evaluation, observability |
| `app` | AI-Powered Applications | Coding assistants, writing tools, search, creative apps |
| `data` | Data & Datasets | Synthetic data, annotation, data pipelines for AI |
| `vision` | Computer Vision & Multimodal | Image/video generation, understanding, diffusion |
| `other` | Other AI / ML | Everything else that is AI-related but does not fit above |

## Output Template

```markdown
---
status: draft
category: github-ai-trends
create_date: YYYY-MM-DD
---

# GitHub AI Trends — YYYY-MM-DD

> Sourced from GitHub Trending. AI-related repos only.

---

## 📂 [Category Name]

### [Repo Name](https://github.com/owner/repo) ⭐ [stars today]

| 字段 | 内容 |
|------|------|
| **解决什么问题** | One or two sentences describing the pain point or gap this repo addresses. |
| **怎么解决的** | One or two sentences on the technical approach, key design decisions, or unique method. |
| **目前还有什么要完善** | One or two sentences on known limitations, open issues, missing features, or stated roadmap items. |

---

[Repeat for each repo, grouped by category]
```

## Enrichment Guidelines

For each repo, gather the following to fill in the three fields:

- **解决什么问题 (What problem does it solve)**
  - Read the repo's one-line description and the first paragraph of the README.
  - Identify the target audience and the pain point they face without this tool.

- **怎么解决的 (How does it solve it)**
  - Read the "Features", "Architecture", or "How it works" sections of the README.
  - Summarise the core technical mechanism in plain language (no marketing fluff).

- **目前还有什么要完善 (What still needs improvement)**
  - Check the "Roadmap", "Known issues", "TODO", or "Contributing" sections.
  - If absent, check recent open Issues or Discussions for recurring pain points.
  - If no explicit source, note what is obviously missing based on the scope of the project (e.g., "No support for X yet", "Documentation sparse").

## Additional Guidance

- **Depth over breadth**: Cover 10–20 repos thoroughly rather than listing 50 superficially.
- **Freshness**: Always fetch live data; never use cached or pre-trained knowledge for the repo list.
- **Neutral tone**: Report facts and evidence; avoid hype or dismissal.
- **Chinese labels**: The three field labels in the output table must remain in Chinese (`解决什么问题`, `怎么解决的`, `目前还有什么要完善`) to match the original requirement, but the content may be in English or Chinese depending on the user's language preference.
- **Source links**: Include the direct GitHub URL for every repo.
- **Star count**: Include today's star gain (shown on the trending page) next to the repo name.
