---
name: extract-chat-summary
description: Extract structured summaries from the current chat conversation. Use when the user asks to pull out a topic, category (problem solving/creation/decision support/emotional support, etc.), up to 3 keywords, the question with background/context, and the solution, or requests a structured recap of a chat session.
---

# Extract Chat Summary

## Goal
Produce a concise, structured summary of the current conversation focused on:
- Topic
- Category
- Keywords (max 3)
- Background
- Solution
- Detail

## Workflow
1. Read the current chat context carefully.
2. Identify the user's primary request and its background/context. If multiple topics are present, split into multiple topics.
   - Topic must be a question.
   - Topic must be a simple sentence. If that is not possible, split into multiple topics.
3. Choose the best-fitting category:
   - Problem Solving
   - Creative Generation
   - Decision Support
   - Emotional Support
   - Other (specify)
4. Extract up to 3 keywords (prefer nouns or noun phrases).
5. Draft the solution in 1–3 sentences, faithful to what was provided or agreed upon.
6. If the user's question includes a URL, include that URL in the Background section.
7. Present the extracted summary and ask the user to confirm it is correct.
8. Determine RelateId by locating a related topic in `./daily-data/YYYY/readme.md` under "All Topics". Use that related topic's Id (from its entry in `./daily-data/YYYY/MM/dd.md`) as RelateId. If no suitable related topic exists, ask a brief clarification question before writing.
9. If the user confirms, append the summary to `./daily-data/YYYY/MM/dd.md` (create folders/files if missing):
   - YYYY and MM are folder names. Eq: 2024/06/03.md
   - Use `## <Topic>` as a heading.
   - Put the rest of the fields under that heading.
   - Append at the end of the file.
10. After writing the topic entry, update `./daily-data/YYYY/readme.md` under "All Topics":
   - Add a markdown bullet link to the new topic under the same group as the related topic (RelateId).
   - Link format: `- [<Topic>](./MM/dd.md#<topic-anchor>)` where `<topic-anchor>` is the GitHub-style anchor (lowercase, spaces to hyphens).
   - Do not duplicate existing links.
11. If any field is missing or unclear, ask a brief clarification question before writing.
12. After writing, ask whether to create a git commit; if confirmed, stage the affected `/daily-data/YYYY/MM/dd.md` and `/daily-data/YYYY/readme.md` files and commit with the message `feat: <Topic>`. `daily-data/` is another repo, so ensure to run git commands in that repo. Then push the commit.

## Output format
Use this exact structure:

## <Topic>
- Id: YYYYMMDD-Index
- RelateId: <find related topic from ./daily-data/YYYY/readme.md All Topics except current topic. If not found, don't output this line>
- Category: <one of the categories above>
- Keywords: <k1>, <k2>, <k3>

### Background
<topic background/context in 1–3 sentences>

### Solution
<1–3 sentence summary>

### Detail
<expanded details in paragraph(s) or bullets>

### Notes(Output this if notes is not null)
<optional; extract user's notes if present>

## Language
- Match the language of the user's request.
- If mixed, default to the user's most recent language.
