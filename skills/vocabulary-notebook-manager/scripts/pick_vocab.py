#!/usr/bin/env python3
"""Pick a random vocabulary entry and extract simple senses.

Outputs JSON to stdout:
{"word": "...", "senses": [{"pos": "...", "meaning": "..."}]}
"""

import argparse
import json
import random
import re
from typing import List, Dict


ENTRY_HEADER_RE = re.compile(r"^##\s+(?!#)(.+?)\s*$")
META_HEADER_RE = re.compile(r"^###\s+Meta\s+Info\s*$")


def parse_entries(lines: List[str]) -> List[Dict[str, List[str]]]:
    entries = []
    current = None

    for line in lines:
        header_match = ENTRY_HEADER_RE.match(line)
        if header_match:
            if current:
                entries.append(current)
            current = {"word": header_match.group(1), "lines": []}
            continue
        if current is not None:
            current["lines"].append(line)

    if current:
        entries.append(current)

    return entries


def extract_senses(entry_lines: List[str]) -> List[Dict[str, str]]:
    senses = []
    for raw in entry_lines:
        line = raw.strip()
        if not line:
            continue
        if line.startswith("#"):
            continue
        if META_HEADER_RE.match(line):
            break
        # Sense lines are expected to look like: 词性。中文意思
        if "。" in line:
            pos, meaning = line.split("。", 1)
            pos = pos.strip()
            meaning = meaning.strip()
            if meaning:
                senses.append({"pos": pos, "meaning": meaning})
    return senses


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--path", default="storage/daily-data/2026/vocabulary-notebook.md")
    args = parser.parse_args()

    with open(args.path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    entries = parse_entries(lines)
    if not entries:
        print(json.dumps({"error": "no-entries"}))
        return 1

    entry = random.choice(entries)
    senses = extract_senses(entry["lines"])
    output = {"word": entry["word"], "senses": senses}
    print(json.dumps(output, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
