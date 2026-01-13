# Transform tool into POSIX commands
Tools are in different types: such as API, gRPC, SQL KV stores, and more.

If AI Agents want to use these tools, it must understand so many different interfaces.

## Solution
Turn all tools into POSIX commands, so that AI Agents can use them in a unified way. Such as 

Traditional approach: `redis.set("key", "value")` can transform into `echo "value" > /kvfs/keys/mykey`.

[AGFS](https://github.com/c4pt0r/agfs) unifies all services(tools) as file system operations.

[ "Bash is all you need": Why bash is the most powerful and composable agent tool](https://www.youtube.com/watch?v=TqC1qOfiVcQ&t=1532s) from Claude Code([Thariq Shihipar](https://x.com/trq212)). Translate: [Here](https://www.xiaoyuzhoufm.com/episode/695ce0d2c1e012a7aba64bc8?s=eyJ1IjoiNjJlNjg2ZjNlZGNlNjcxMDRhOGU0OTg1In0%3D).

## Benefits
1. AI understands file operations natively - Any LLM knows how to use `cat`, `echo`, and `ls`. No API documentation needed.
2. Unified interface - Operate all backends the same way, reducing cognitive overhead.
3. Composability - Combine services using pipes, redirections, and other shell features.
4. Easy debugging - Use `ls` and `cat` to inspect system state.

