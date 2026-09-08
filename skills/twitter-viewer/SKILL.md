---
name: twitter-viewer
description: Retrieve and summarize posts or threads from X/Twitter URLs, preserving the original source and relevant context.
---

# Twitter Viewer

For each supplied X/Twitter URL, retrieve the post text, author, publication time and relevant thread or quoted-post context. Inspect linked media when needed to understand the claim. Preserve the original URL in the response and distinguish the author's statements from verified facts or your interpretation.

Choose an available tool suitable for the task under the project's web-access rules: a platform connector, supported CLI, browser or public web retrieval. When OpenCLI is available and relevant, discover its supported commands. A third-party viewer such as `twitter-viewer.com` can be a fallback if it currently works; its availability is not assumed.

If a route fails or exposes only a partial post, try another suitable available route. State what was actually retrieved and any material gaps. Identify third-party or cached copies when their freshness or completeness matters. Do not reconstruct missing post content from a URL or search snippet alone. Ask for the post text only when access remains insufficient to answer.
