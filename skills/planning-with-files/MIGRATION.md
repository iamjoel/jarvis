# Local Workflow Migration

The local skill now creates state only when persistence helps recovery, handoff or substantial investigation. A task-specific directory replaces shared planning filenames at the project root.

For an existing task, continue with its current files or move the relevant files together into the chosen task directory when useful. Update their links after a move. Preserve unrelated tasks' state.

The initializer now takes an explicit directory:

```bash
bash /path/to/skill/scripts/init-session.sh .plans/my-task
```

Add `--with-notes` to create findings and progress logs as well. Existing files are preserved. Templates are the single source for generated content.

Pass the exact plan path to the completion checker. The checker reports recorded state and is not a Stop hook or an acceptance test. Existing caller configuration that assumes root filenames or uses the old checker as a mandatory gate should be updated to match this workflow.
