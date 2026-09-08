#!/bin/bash
# Usage: init-session.sh TASK_DIRECTORY [--with-notes]
set -eu

if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
    echo "Usage: $0 TASK_DIRECTORY [--with-notes]" >&2
    exit 2
fi
planning_dir="$1"
case "$planning_dir" in
    ""|.|./|/) echo "Choose a directory dedicated to this task." >&2; exit 2 ;;
esac
if [ "$#" -eq 2 ] && [ "$2" != "--with-notes" ]; then
    echo "Unknown option: $2" >&2
    exit 2
fi
skill_scripts_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
mkdir -p -- "$planning_dir"

copy_template() {
    template_name="$1"
    target_path="$planning_dir/$template_name"
    if [ -e "$target_path" ] || [ -L "$target_path" ]; then
        echo "Preserved $target_path"
        return
    fi
    # noclobber also protects an existing regular file created concurrently.
    (set -C; cat "$skill_scripts_dir/../templates/$template_name" > "$target_path")
    echo "Created $target_path"
}

copy_template task_plan.md
if [ "$#" -eq 2 ]; then
    copy_template findings.md
    copy_template progress.md
fi
