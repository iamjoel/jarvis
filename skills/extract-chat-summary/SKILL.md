---
name: extract-chat-summary
description: Extract a structured recap of the current conversation, including its topic, category, keywords, background and agreed solution. Archive it when the user asks to save the recap.
---

# Extract Chat Summary

## Summary

Deliver the summary directly in the user's language. Use the available conversation; acknowledge missing context when it affects accuracy. Separate materially distinct topics and express each topic as a simple question.

For each topic, choose the closest category: Problem Solving, Creative Generation, Decision Support, Emotional Support, or Other with a brief label. Include up to three keywords and preserve URLs from the user's question in Background. Describe the solution actually discussed or agreed; distinguish unresolved work from completed results.

```markdown
## <Topic question>
- Category: <category>
- Keywords: <up to three keywords>

### Background
<Context in one to three sentences, including relevant supplied URLs>

### Solution
<Agreed answer or current resolution in one to three sentences>

### Detail
<Reusable decisions, reasoning, constraints and unresolved items>

### Notes
<User notes, when present>
```

Omit Notes when absent. For an existing archive entry, preserve its `Id`. Include `RelateId` only when a related entry and its ID are known; an absent relationship needs no clarification.

## Archiving when requested

An explicit request to save or archive the summary authorizes writing it. If the user requested review before saving, deliver the draft for that review first.

- Use a user-specified location when provided. Otherwise save to `data/c/chat-summary-YYYY-MM-DD-<topic-slug>.md` relative to this repository; choose a unique suffix for a different conversation with the same date and topic. Update an existing entry only when it is the intended archive.
- Use a document title followed by the project's high-density summary, then the topic entries. Add `Id: YYYYMMDD-Index` for archived entries, choosing the next unused index among same-day chat summary entries. Preserve existing IDs on updates.
- Find related archived entries only when it helps connect the topic. Omit unknown `RelateId` values.
- Review `data/readme.md` and add a reusable summary to the appropriate secondary index. Follow its question and importance format, avoiding duplicate links.
- Handle Git commits and pushes according to the user's actual authorization. Saving does not imply a commit; committing does not imply pushing. If requested, operate in the archive's actual repository and include only the intended changes.
