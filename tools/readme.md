# Tools Reference
Available CLI tools. Use these for agentic tasks.

## Deploy HTML, CSS, JS
Use [Surge](https://surge.sh/) to deploy HTML, CSS, JS.

First `cd` into your project directory and set domain: `echo your-domain.surge.sh > CNAME`

Frequent Commands:
- Deploy: `surge`
- Teardown: `surge teardown`
- List all projects: `surge list`

Run `surge --help` for all commands.

## Browser Automation
Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:
1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes
