# AGENTS
## Store Research Results
For any research task requested by the user:
1. Write the final research output to `data/`.
2. Review `data/readme.md`.
3. Update `data/readme.md` if the new or changed output should be indexed, linked, or described there.

## Fetch Information from the Web
If the user needs information from Twitter/X, Reddit, WeRead (微信读书), or any specific website:
1. Use `Bash` to inspect available tools with `opencli list`.
2. Choose the most relevant tool available.
3. Use that tool to retrieve the information.
4. Only use fallback methods if no suitable tool is available.
