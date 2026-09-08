# Planning with Files

This local adaptation keeps task state for work that needs recovery across sessions, collaboration or a long investigation. Read [SKILL.md](SKILL.md) for the workflow.

## Helpers

From a project directory:

```bash
bash /path/to/skill/scripts/init-session.sh .plans/my-task
bash /path/to/skill/scripts/init-session.sh .plans/my-task --with-notes
bash /path/to/skill/scripts/check-complete.sh .plans/my-task/task_plan.md
```

The initializer preserves existing files and copies the maintained templates. The optional notes are findings and progress logs. The checker examines recorded statuses; successful output is not verification of the underlying deliverable.

See [examples.md](examples.md), [reference.md](reference.md) and [migration notes](MIGRATION.md) as needed.

Adapted from [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files). See [LICENSE](LICENSE).
