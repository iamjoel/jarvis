---
name: compose-good-questions
description: Framework for evaluating or crafting questions that lead to actionable answers, covering objectives, scope, context, verification, focus, and answerer guidance. Trigger this skill when the user asks to improve a question, diagnose why a question is unclear, or needs a template/checklist for high-quality prompts.
---

# Compose Good Questions

## When to use this skill
- The user needs help turning a vague ask into a concrete request that can be answered without follow-up.
- The user wants to review an existing question with a checklist (e.g., decision-making prompts, investigation tasks, research queries).
- The user asks for a naming convention, template, or testing approach for “good questions.”

## Core checklist
Use the six characteristics below to diagnose or rewrite the question. Mention the section explicitly as you evaluate the draft so Codex follows each step.

1. **Clear Objective:** Restate the desired outcome (decision, conclusion, action) and ensure the question explicitly says why the answer matters. If the user already knows the goal, confirm it; if not, suggest a goal the question should aim for.
2. **Clear Boundaries:** Add constraints (timeframe, data, scope, assumptions) that prevent “any idea” answers. If the question is broad, break it into smaller, scoped parts with fixed limits.
3. **Sufficient Context:** List what is known, what was tried, and any relevant background the answerer needs before suggesting a path forward. Avoid forcing the answerer to guess missing premises.
4. **Verifiable:** Clarify how the answer will be evaluated. Favor measurable criteria or testable trade-offs over purely subjective opinions.
5. **Single Focus:** Ensure the question asks about one core issue. When multiple issues exist, either split them into separate numbered questions or explicitly label them as linked sub-questions.
6. **Answerer-Friendly:** State the expected output format (summary, steps, comparison, prototype, code, etc.) and mention any extra work the answerer should assume to keep the cognitive load manageable.

## Workflow
1. **Assess the draft question** with the checklist above, noting which characteristics are missing or weak.
2. **Ask clarifying follow-up questions** only if facts are missing that prevent applying the checklist; otherwise, rewrite the question.
3. **Rewrite in one sentence** (best when the user is unsure) or provide a short template that incorporates the checklist explicitly.
4. **Apply the “One-Sentence Test”**: confirm a responder could answer the question without needing clarification; if not, repeat the checklist.

## Output guidance
- When improving a question, return both the revised question and a short report (bullet list) referencing the checklist sections you strengthened.
- If the user only wants a checklist or explanation, provide the section names with concise prompts (e.g., Objective: “Decide whether…”, Boundaries: “Limit to Q1 2025 metrics for the enterprise team.”).
- When a question is meant to lead to a concrete action (code, research, policy, etc.), include a **Validation** step that explains how an answer can be verified (tests to run, data to compare, stakeholders to confirm). Add that validation note to the report so future responders can confirm success.
*** End Patch*** 
