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
- Question (include background/context)
- Solution

## Workflow
1. Read the current chat context carefully.
2. Identify the user's primary request and its background/context.
3. Choose the best-fitting category:
   - Problem Solving
   - Creative Generation
   - Decision Support
   - Emotional Support
   - Other (specify)
4. Extract up to 3 keywords (prefer nouns or noun phrases).
5. Draft the solution in 1–3 sentences, faithful to what was provided or agreed upon.
6. If the user's question includes a URL, include that URL in the Question section.
7. Present the extracted summary and ask the user to confirm it is correct.
8. If the user confirms, append the summary to `./daily-data/YYYY/MM/dd.md` (create folders/files if missing):
   - YYYY and MM are folder names. Eq: 2024/06/03.md
   - Use `## <Topic>` as a heading.
   - Put the rest of the fields under that heading.
   - Append at the end of the file.
9. If any field is missing or unclear, ask a brief clarification question before writing.

## Output format
Use this exact structure:

## <Topic>
- Category: <one of the categories above>
- Keywords: <k1>, <k2>, <k3>

### Question
<include background/context in 1–3 sentences>

### Solution
<1–3 sentences>

### Notes
<optional; extract user's notes if present>

## Language
- Match the language of the user's request.
- If mixed, default to the user's most recent language.
