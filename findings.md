# Findings & Decisions

## Requirements
- I need to add missing major Chinese dynasties/periods to `knowledge/h/history-china.md`.
- I need to create matching content pages, not just nav links.
- I need to keep the existing style: standalone dynasty notes with a title, a short summary block, and chronological sections organized around people and geography.

## Research Findings
- `knowledge/h/history-china.md` currently contains a simple bullet list of dynasty pages.
- Existing pages follow a longform educational format with headings like `## 一、...`, people labels, and historically grounded chronological bullets.
- The current set already includes `商、周、春秋战国、秦、汉、三国、隋、唐、五代十国、宋、元、明、清`.
- The major missing periods are `夏、晋、南北朝、辽、西夏、金`.
- `knowledge/h/history-china-qing.md` is actually the `秦朝` page, so I should not infer meaning from that filename.
- I created six new history pages and added them to the index in chronological reading order.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Create six new markdown files under `knowledge/h/` | Matches the existing content layout |
| Name `金朝` as `history-china-jin-dynasty.md` | Avoid conflict with `晋朝` |
| Keep nav in chronological order by major period emergence | Makes the index easier to scan |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Existing `秦朝` filename uses `qing` | I preserved the current file and linked to it as-is |

## Resources
- `/Users/joel/joel/jarvis/knowledge/h/history-china.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-han.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-sui.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-xia.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-jin.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-nanbeichao.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-liao.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-xixia.md`
- `/Users/joel/joel/jarvis/knowledge/h/history-china-jin-dynasty.md`

## Visual/Browser Findings
- No browser work was needed.
