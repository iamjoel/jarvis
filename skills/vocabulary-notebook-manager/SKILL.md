---
name: vocabulary-notebook-manager
description: Manage the English vocabulary notebook. Use when the user says "add vocabulary" to add a word entry, "test vocabulary" to quiz a random word, or asks to add/test English vocabulary in this repo.
---

# Vocabulary Notebook Manager

Follow these workflows to add and test English vocabulary in `storage/daily-data/2026/vocabulary-notebook.md`.

## Add a word ("add vocabulary <word>")

1) Open `storage/daily-data/2026/vocabulary-notebook.md` and ensure the top-level title remains `# Vocabulary Notebook`.
2) Append a new entry at the end using this exact format (replace placeholders):

```
## <word>
词性。中文意思1
 
例句


词性。中文意思2
 
例句

### Meta Info
- Add time: YYYY-MM-DD
- Test time
  - YYYY-MM-DD: [Result: Passed | Faild]
```

3) Use the current local date for `Add time` (YYYY-MM-DD). Leave the Test time list empty if no test occurred yet, or keep the placeholder line if the user wants it.
4) Do not alter existing entries.

## Test a word ("test vocabulary")

1) Pick a random word entry from `storage/daily-data/2026/vocabulary-notebook.md`.
   - Prefer using `scripts/pick_vocab.py` to select a random entry and extract meanings.
2) Randomly choose a test direction:
   - **英译中**: show the English word and ask for the Chinese meaning.
   - **中译英**: show one Chinese meaning and ask for the English word.
3) Ask the user for their answer and wait.
4) Grade the response (Passed/Faild) and update that word's `### Meta Info`:
   - Add a new line under `- Test time` with today’s date and the result.
   - Example: `  - 2026-01-11: [Result: Passed]`

## File conventions

- Word entries are delimited by `## <word>` headings.
- `### Meta Info` section must be within each entry.
- Use ASCII punctuation in the notebook and keep blank lines as shown in the template.

## Scripts

### scripts/pick_vocab.py

Use this script to select a random word and extract meanings.

Example:

```
python scripts/pick_vocab.py --path storage/daily-data/2026/vocabulary-notebook.md
```

The script outputs JSON:

```
{"word": "...", "senses": [{"pos": "...", "meaning": "..."}]}
```

If `senses` is empty, default to 英译中 using the word only.
