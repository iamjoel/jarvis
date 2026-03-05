## Personal Assistant
Personal assistant is the center. It 指派任务，协调资源，提供服务。

好的服务: 信息 + 能力。

用好 claw: 有场景。

分发任务。有的 claw 自己做，有的给其他做。


## 对用户的了解
- 用户的身份信息（USER.md），如他们的喜好，工作背景等。
- 记忆。和用户的交互历史，环境信息等。部分会被记录到长期记忆。
- 用户对 Agent 的期望（IDENTITY.md 和 SOUL.md），如 Agent 的个性，行为边界等。

## 能力
- 工具。 读，查，写文件的工具。浏览器。以及其他与软件交互工具。
- Skills。从市场安装或者自己开发。
- 自动化
  - 定时任务。Corn 和 Heartbeat。 [对比](https://docs.openclaw.ai/zh-CN/automation/cron-vs-heartbeat)。
  - 主动通知 Agent。 Hook。例如，某个耗时比较长的任务完成了。

## 流程
启动 -> 初始化( 遵循 Bootstrap.md 来读取身份，记忆)  -> 通过 Gateway 提供服务 -> 通过 Channel 接入服务的用户交互 -> 根据用户输入和环境信息，判断是否需要使用工具 -> 使用工具解决问题 -> 记录记忆 -> 继续提供服务

Gateway: 进程网关，用来提供服务。
- `openclaw gateway` 启动
- `openclaw gateway start` 在后台启动
- `openclaw gateway stop` 停止
- `openclaw gateway restart` 重启

Channel: 接入 Gateway 服务的叫 Channel，如 Cli， Web Control UI, Telegram, WhatsApp 等。

## Agent 的定义
OpenClaw/ZeroClaw:  
- `IDENTITY.md` — your name, vibe, emoji
- `SOUL.md` — boundaries and behavior

支持多个 Agent。 openclaw: `openclaw agents add <name>`， 会有个独立的工作空间。

## 启动时加载的信息
Agent 的身份(`IDENTITY.md`, `SOUL.md`) 和 用户的身份(`USER.md`)


## 用户信息
- `USER.md` — their preferences, work context

## Tools
定义能用什么工具，什么时候用/什么时候不用。
```md
- **shell** — Execute terminal commands
- Use when: running local checks, build/test commands, or diagnostics.
- Don't use when: a safer dedicated tool exists, or command is destructive without approval.
```

## 模式
- 马上解决一个问题。
- 定时任务。
  - heartbeat: 在 `HEARTBEAT.md` 里定义。定时检查是否有新信息需要处理，或者需要执行的任务。`OpenClaw` 和 `ZeroClaw` 默认是 30 分钟一次。需要开启。
  - cron: 

## 记忆
- 每天的记忆(`memory/YYYY-MM-DD.md`) 以时间为主线，记录每天发生的事情，学到的东西，遇到的问题，解决方案等。
- 长期记忆

支持关键字匹配和 embedding 搜索来召回记忆。

## 安全
- action 的授权。黑白名单
- 文件夹的授权。

openclaw 默认是可以读取所有文件的。 如果期望它只读取 `workspace` 下的文件，可以启用沙盒模式。

## 那些 claws
* zero claw
* nano claw
* pico claw
* [openfang](https://www.openfang.sh)


