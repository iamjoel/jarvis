# Persistent Task State Reference

## What a handoff needs

A returning session or collaborator should be able to locate:

- The user's intended outcome and current scope.
- Decisions already made, their reasons and material authorization constraints.
- Completed work, verification evidence and remaining work.
- Relevant files, source links and commands needed to resume.
- A concrete next action and any external dependency.

Keep these in the task's directory and link larger artifacts from the plan. Record facts once. When evidence can expire, include its date and what should be checked again.

## Choosing how much to save

A single plan can hold a modest task's state. Separate findings and progress logs help when evidence or execution history becomes substantial. Save meaningful state at milestones, before handoffs, or before context loss. Difficult-to-recreate observations may warrant an earlier note.

Recovery starts with the plan and relevant current state. Files preserve recorded observations; they may need rechecking against the repository, service or user's latest direction.

## Provenance

The original skill was adapted from [Planning with Files](https://github.com/OthmanAdi/planning-with-files), inspired by [Manus context engineering](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus). The local [SKILL.md](SKILL.md) defines the maintained workflow for this project.
