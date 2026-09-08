---
name: planning-with-files
description: Maintain persistent task state for work that needs recovery across sessions, a handoff, or a long investigation with substantial decisions and evidence.
---

# Planning with Files

Use persistent planning when future recovery or collaboration needs a durable record. Ordinary searches and edits can use the current conversation. Tool-call counts do not determine whether files are useful.

## Task directory and contents

Choose a directory dedicated to the task, such as `.plans/<task-slug>/` under the project, or use the user's specified location. Check for an existing plan for the same task before creating one. Each concurrent task should have its own directory; collaborators on the same task should coordinate edits.

Start with [task_plan.md](templates/task_plan.md): goal, constraints, phases, decisions, important evidence, and the next action. Add [findings.md](templates/findings.md) or [progress.md](templates/progress.md) only when the evidence or execution history would make the plan difficult to scan. Keep each fact in one place and link to it elsewhere.

```bash
bash /path/to/skill/scripts/init-session.sh .plans/<task-slug>
# Add separate evidence and execution logs when useful:
bash /path/to/skill/scripts/init-session.sh .plans/<task-slug> --with-notes
```

The initializer copies the templates and preserves existing files. It requires an explicit task directory.

## Updates and recovery

Record material findings, changed decisions and verification results at phase boundaries, before a handoff, or before context might be lost. Save difficult-to-recover evidence earlier when warranted. Include source or artifact paths so another session can inspect the basis for conclusions.

On resumption, read the current plan and the supporting material needed for the next action. Verify external state when it may have changed. Keep completed work, remaining work, unresolved constraints and the next action clear.

## Handling failures

Choose recovery based on the error:

- For transient timeouts or rate limits, use bounded retries with suitable backoff; check whether a failed mutation may already have taken effect before repeating it.
- For invalid inputs, unavailable tools or reproducible implementation errors, inspect the cause and fix it or choose a viable alternative.
- When progress needs missing user information, authorization or an external change, explain the specific blocker and ask for what resolves it. A fixed failure count does not decide escalation.

Record failed approaches when the information will prevent repeated investigation. Keep retry details in the relevant log rather than duplicating them across files.

## Completion

Verify the actual deliverable against the task's acceptance criteria. Mark phases complete when their work is done, and record evidence and remaining limitations.

```bash
bash /path/to/skill/scripts/check-complete.sh .plans/<task-slug>/task_plan.md
```

The checker reports recorded phase status only: exit 0 means all phases are marked complete, 1 means some remain, and 2 means the input is missing or malformed. It does not prove the outcome or force continuation after the user stops or changes scope.

See [examples.md](examples.md) for task selection and [reference.md](reference.md) for handoff details.
