---
name: prompt-engineering
description: Create or revise reusable prompts, agent instructions, and LLM output contracts when the user requests prompt design or an observed failure needs a prompt change.
---

# Prompt Engineering

Write instructions that define the intended result and supply context the model cannot infer. Match the prompt to the actual user request and execution environment.

## Define the contract

- State the task, audience, useful inputs, and what a successful result contains.
- Include project conventions, concrete constraints, and source requirements that change the model's decisions.
- Specify output structure only when the reader or consuming system needs it. A short edit can produce just the edited text.
- Treat missing optional details with reasonable defaults. Ask about ambiguity that changes the objective, correctness, or authorization; continue independent work while waiting when the environment supports it.

## Design agent instructions

- Keep stable project rules in one maintained location. Put task-specific procedures in the relevant skill or reference and give it a precise trigger.
- Describe available capabilities and how to recover when a tool is unavailable. Verify any named tool or path before making it a required step.
- Carry existing user authorization through the task. Require approval at actual permission boundaries, with a concrete preview prepared first where possible.
- Make external actions such as publishing, sending, committing, or pushing explicit parts of the requested workflow. A request for a draft does not authorize these actions.
- Use persistent state for work that needs recovery or handoff. Choose the amount of planning, delegation, and verification based on the task's dependencies and impact.
- Define completion through the requested deliverable and relevant checks. Escalate a blocker when progress actually requires user input or an external change.

## Revise from observed failures

1. Identify the unwanted behavior and the exact instruction, missing context, or unavailable capability that could explain it.
2. Make the smallest coherent correction. Remove conflicting requirements and stale assumptions from linked references as well as the main prompt.
3. Check the prompt against realistic requests, including a small task and the failure case. Preserve useful behavior in neighboring cases.
4. Compare outcomes under comparable model and tool settings when making performance claims. Record actual results and remaining uncertainty.

Request concise supporting evidence, assumptions, calculations, or verification results when they help the reader assess an answer. Reasoning models do not need a command to expose private reasoning or a ritual phrase to activate reasoning.

Use examples when a format or decision boundary remains ambiguous after a direct instruction. Keep examples consistent with the contract. Model limits, context retention, modes, and tool APIs are environment properties; look them up when needed instead of baking in guessed constants.

## Example contract

```text
Review the supplied bug report and relevant implementation.
Identify the failure scenario, likely cause, and a concrete fix supported by the available evidence.
Use existing project conventions. Mark unresolved assumptions and verify the affected behavior.
Return actionable findings with file references; scale the explanation to the change.
```

Adapt these fields to the task; this example is not a required output layout or an instruction-priority hierarchy.

For model-specific changes, consult the current official guidance for the requested model. Useful starting points: [OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model) and [reasoning practices](https://developers.openai.com/api/docs/guides/reasoning-best-practices).
