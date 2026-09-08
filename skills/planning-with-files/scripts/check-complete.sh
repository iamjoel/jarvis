#!/bin/bash
# Reports recorded phase status, not deliverable correctness.
# Exit 0: all complete; 1: incomplete; 2: missing or malformed plan.
set -eu

if [ "$#" -ne 1 ] || [ ! -f "$1" ]; then
    echo "Usage: $0 TASK_DIRECTORY/task_plan.md (existing file required)" >&2
    exit 2
fi

awk '
function finish_phase() {
    if (!phase) return
    total++
    if (status_count != 1 || !valid_status) malformed = 1
    if (status_count == 1 && phase_status == "complete") complete++
    phase = 0
}
/^```/ { fenced = !fenced; next }
fenced { next }
/^### Phase[[:space:]]/ {
    finish_phase()
    phase = 1
    status_count = 0
    valid_status = 0
    phase_status = ""
    next
}
/^#{1,3}[[:space:]]/ { finish_phase() }
phase && /^[[:space:]]*(-[[:space:]]+)?\*\*Status:\*\*[[:space:]]*/ {
    status_count++
    phase_status = $0
    sub(/^[[:space:]]*(-[[:space:]]+)?\*\*Status:\*\*[[:space:]]*/, "", phase_status)
    sub(/[[:space:]]+$/, "", phase_status)
    valid_status = (phase_status ~ /^(pending|in_progress|blocked|complete)$/)
}
END {
    finish_phase()
    if (fenced || total == 0 || malformed) {
        print "Malformed plan: each phase needs exactly one valid status."
        exit 2
    }
    printf "Recorded phases: %d; complete: %d; remaining: %d\n", total, complete, total - complete
    exit (complete == total ? 0 : 1)
}
' "$1"
