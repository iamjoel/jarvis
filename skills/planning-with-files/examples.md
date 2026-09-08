# Planning Examples

## Investigation spanning several sessions

A user asks for a substantial comparison with evidence collected over several days. Create `.plans/vendor-comparison/task_plan.md`, record selection criteria and planned phases, and use `findings.md` for dated sources. At the end of a research phase, note conclusions, unresolved claims and the next step. Save the final report under the project's research-output rules.

## Implementation with a handoff

A migration requires separate contributors and later verification. Keep `.plans/migration/task_plan.md` with the scope, file ownership and acceptance criteria. Link to `progress.md` for test results and recovery notes. A new contributor reads the plan and checks repository state before continuing.

## Small edit or ordinary lookup

A request to change one label or answer a straightforward question can be completed using the conversation. Create persistent state only if the user asks for it or a concrete recovery need arises.

## Transient failure during research

A read request times out. Retry within a bounded budget when the error appears transient. If the endpoint is unavailable, use another suitable source. Record the gap when it affects the conclusion. For uncertain mutations, inspect whether the action succeeded before retrying.
