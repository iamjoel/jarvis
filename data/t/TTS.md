---
status: draft
category: tool
tags:
  - tts
  - audio
  - podcast
create_date: 2026-10-24
---

# TTS：效果榜单、试听与 AI 播客制作方案

## 高密度摘要

- **结论**：截至 2026-10-24 抓取的 Artificial Analysis Provider Voice 榜，ElevenLabs Eleven v4 Turbo / v4 居前两名，Qwen-Audio-3.1-TTS-Plus 第三；榜单提供 US / UK 口音筛选，不能据此确定中文整集播客的优胜者。中文选型建议同时试听豆包语音播客、MiniMax Speech 2.8、Qwen-Audio-TTS 和 CosyVoice。
- **机制**：播客体验同时受脚本、音色、重音、接话、停顿和后期处理影响。短段 TTS 盲测、官方精选样音与整集节目分别提供不同的判断依据。
- **判断入口**：希望直接把材料变成双人节目，先看 NotebookLM 或豆包语音播客；希望固定主播、精确修改台词，先试脚本加 TTS 的制作流程；预算敏感时，把 CosyVoice Flash 加入同稿比较。
- **误区**：同厂商的不同模型不能共用质量排名、价格或免费额度；官方样音展示能力，不等同于随机文本的平均表现。公开案例也不足以推算播客行业的供应商份额。
- **相关入口**：[公开榜单与同稿试听](https://artificialanalysis.ai/text-to-speech/speech-explorer)、[阿里云音色试听](https://help.aliyun.com/zh/model-studio/qwen-audio-tts-voice-list)、[技术索引](../technology.md)。

研究日期：2026-10-24。本文依据公开榜单、产品文档和创作者公开说明整理；没有调用付费接口，也没有对全部服务重新生成同稿盲测。播放器加载、时长等检查不代表进行了人工听感评审。

## 公开效果排行应该怎样看

Artificial Analysis 通过同一文本的语音成对盲选计算 Elo。Provider Voice 榜使用厂商各自音色，包含音色偏好这一变量；页面的口音筛选为 US / UK。当前快照的部分结果如下，名次会继续变化。

| 名次 | 具体型号 | Elo |
|---|---|---|
| 1 | Eleven v4 Turbo | 1336 |
| 2 | Eleven v4 | 1332 |
| 3 | Qwen-Audio-3.1-TTS-Plus | 1307 |
| 4 | Cartesia Sonic 3.6 | 1292 |
| 5 | Gemini 3.8 Flash TTS | 1280 |
| 24 | MiniMax Speech 2.8 HD | 1176 |
| 27 | MiniMax Speech 2.8 Turbo | 1156 |
| 30 | Azure HD 2.5 | 1143 |
| 74 | Azure Neural | 1034 |
| 89 | Google WaveNet | 919 |
| 93 | Google Neural2 | 895 |
| 95 | Google Standard | 888 |

来源：[Artificial Analysis Provider Voice 榜](https://artificialanalysis.ai/text-to-speech/leaderboard/provider-voice)，2026-10-24 抓取。前两名的置信区间重叠，不能把几分差距解释为确定的优劣。

本次没有在该榜找到豆包语音播客、CosyVoice、腾讯云 TTS 或 Sambert 的对应条目，也没有找到覆盖前述全部服务的独立中文整集播客盲测。它们在此处属于证据不足，不能排到榜尾。Qwen-Audio-TTS、Qwen3-TTS、CosyVoice、Sambert 是不同型号或系列；Gemini-TTS 与 Google Standard / WaveNet 也应分别判断。

## 中文用途的比较与试听顺序

下面是基于功能、公开案例和成本的选型建议，不是中文盲测排名。

| 目的 | 优先试听 | 依据及需要验证的部分 |
|---|---|---|
| 材料直接生成双人讨论 | 豆包语音播客、NotebookLM Audio Overviews | 有面向双人讨论的完整产品；应核查内容保留、改写范围、衔接和整集节奏 |
| 固定主播、可逐句修改 | MiniMax Speech 2.8、Qwen-Audio-TTS | 支持音色与表达控制；长段是否稳定、专有名词读法与局部重做成本需要同稿试验 |
| 国内低价、批量生成 | CosyVoice Flash | 官方提供音色及情感指令支持；试听样音的型号应与最终调用型号一致 |
| 微软方案 | Azure HD 与 Azure Neural 分别试听 | 新旧型号榜单差距明显；免费 Neural 额度不能直接套用于 HD 或特定 Dragon 音色 |
| 海外声音库和制作工具 | ElevenLabs | 有公开播客合作和声音库；中文音色与英语效果需要分别检验 |

功能依据：[豆包播客接入文档](https://docs.volcengine.com/docs/DoubaoVoice/podcast_mustread?lang=zh)、[NotebookLM 多语言更新](https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-audio-overviews-50-languages/)、[MiniMax 2.8 演示](https://www.minimax.io/news/minimax-speech-28)、[阿里云合成效果控制](https://help.aliyun.com/zh/model-studio/non-realtime-tts-user-guide)。

补充候选：阿里云的 `qwen-audio-3.1-tts-plus` 北京地域官方原价为 **1.4 元 / 万计费字符**，是本轮新发现的比较对象。[型号与价格](https://help.aliyun.com/zh/model-studio/qwen-audio-3-1-tts-plus)。按阿里云字符规则，一个汉字计两个字符，因此一万纯汉字约 2.8 元，未计标点、免费额度和重复生成。[字符规则](https://help.aliyun.com/zh/model-studio/model-pricing)。

## 可直接进入的试听入口

| 对象 | 试听入口 | 建议听什么、访问情况 |
|---|---|---|
| 多家模型同稿比较 | [Artificial Analysis Speech Explorer](https://artificialanalysis.ai/text-to-speech/speech-explorer) | 使用同一 prompt 对比，减少文案不同造成的偏差；以美英口音样本为主 |
| MiniMax Speech 2.8 | [官方发布页，含播放器](https://www.minimax.io/news/minimax-speech-28) | Sound Tags 样例约 36 秒，另有原声 / 克隆对照、纯净音质和跨语言样例；已确认媒体加载与时长，主要是英文演示 |
| MiniMax 中文及多音色 | [MiniMax Audio](https://www.minimax.io/audio) | 选择中文音色；自定义生成可能需要登录与额度 |
| Qwen-Audio-TTS | [官方音色列表与试听](https://help.aliyun.com/zh/model-studio/qwen-audio-tts-voice-list) | 按 3.1 Plus / Flash 等型号选样音；关注普通话和不同表达方式 |
| CosyVoice | [官方音色列表与试听](https://help.aliyun.com/zh/model-studio/cosyvoice-voice-list) | 先比较龙安洋、龙安欢等音色；已确认页面前几条样音可加载。该页标注 v3 Flash 等型号，不能把这些样音直接当作 v3.5 Flash 的实测 |
| Sambert | [官方文档“模型列表”中的样音](https://help.aliyun.com/zh/model-studio/sambert-java-sdk) | 包含知楠、知琪、知厨等声音及对应模型参数；适合作为基础朗读对照 |
| 豆包 | [官方产品概述](https://docs.volcengine.com/docs/DoubaoVoice/ProductOverview-9?lang=zh)、[播客体验中心](https://console.volcengine.com/speech/new/experience/podcast?projectName=default) | 产品概述含 TTS 与播客能力预览；查找“语音播客”。体验中心需登录 |
| ElevenLabs 中文 | [Chinese TTS 演示页](https://elevenlabs.io/text-to-speech/chinese) | 听不同中文音色，比较声调、句末语气和富语言标签；页面有 Play 入口 |
| Google Cloud | [产品页 Demo](https://cloud.google.com/text-to-speech) | 在 Demo 中选择中文及具体模型；Gemini-TTS 的高级体验入口在 Media Studio |
| 微软 | [Speech Studio Voice Gallery](https://speech.microsoft.com/portal/voicegallery) | 按简体中文与具体型号选择。此次浏览器未完整加载该交互页，访问和播放需用户端复核 |
| 腾讯云 | [产品试听页](https://cloud.tencent.com/product/tts)、[官方音色表](https://cloud.tencent.com/document/product/1073/92668) | 从基础、精品、大模型、超自然大模型中选择对应音色；不能把基础音色免费包等同于所有型号 |
| NotebookLM 成品对话 | [Google 官方 Audio Overview 样例](https://blog.google/innovation-and-ai/products/notebooklm-audio-overviews/) | 官方文章内有完整讨论播放器；这是 2024 年英文历史样例，用于理解对话形态 |

还提取了几个官方媒体直达地址，方便定位样音。媒体仍由原站提供：

- [CosyVoice v3 Flash：龙安洋，约 18 秒](https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20251117/khzqvb/%E9%BE%99%E5%AE%89%E6%B4%8B.mp3)。
- [CosyVoice v3 Flash：龙安欢，约 14 秒](https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20251117/lolnxw/%E9%BE%99%E5%AE%89%E6%AC%A2.mp3)。
- [MiniMax Speech 2.8：英文 Sound Tags，约 36 秒](https://file.cdn.minimax.io/public/ebf1f7ff-155b-452f-a9fe-428859139bf2.wav)。
- [MiniMax Speech 2.8：跨语言样例，约 16 秒](https://file.cdn.minimax.io/public/1f1c7cf5-f58f-4ad4-8ed4-a5cdbe8fb495.wav)。

## 哪些播客采用了什么方案

### 有明确公开证据的案例

| 节目或产品 | 公开披露的方案 | 证据与限制 |
|---|---|---|
| **Discover Daily by Perplexity** | Perplexity 选取 Discover 内容，使用 **ElevenLabs** 声音 | [节目官网含播放器及供应商说明](https://www.perplexity.ai/podcast)、[2024-02-23 官方合作公告](https://elevenlabs.io/blog/elevenlabs-and-perplexity-announce-partnership-2)。未披露每集具体模型版本 |
| **Wondercraft 制作平台**，其节目目录含 **Hacker News Recap、PG Essays** | ElevenLabs 官方披露其声音库为 Wondercraft 提供语音，平台完成编辑及个性化 | [2024-11-13 官方合作案例](https://elevenlabs.io/blog/wondercraft)、[Wondercraft 节目目录](https://www.wondercraft.ai/our-podcasts)。平台合作有证据，不能据此认定目录中每集始终采用同一模型 |
| **Spotify 2024 Wrapped AI Podcast** | 使用 **Google NotebookLM** 为用户生成双主持人年度回顾 | [Spotify 2024-12-04 官方公告](https://newsroom.spotify.com/2024-12-04/your-spotify-wrapped-ai-podcast-is-here-to-help-you-reconnect-with-the-music-that-defined-your-year/)。属于历史限时产品，不是持续更新的独立栏目 |
| **HN 瞎聊**，中文独立项目 | LongCat 筛选、Mistral 生成脚本、**Azure TTS** 双音色，添加背景音乐与对话间隔 | [创作者技术说明](https://hn.craigary.net/ai/)。公开音色为 `zh-CN-Xiaochen:DragonHDFlashLatestNeural` 与 `zh-CN-Yunxiao:DragonHDFlashLatestNeural`。已在浏览器核对说明；未核实受众规模及其所有归档音频的播放情况 |

### 中文社区补充例子

[《对坐回声》试播集](https://www.xiaoyuzhoufm.com/episode/6967a6f0109824f9e17b5e24) 在 10:01 起讨论了从 edge-tts 转向 FireRed-TTS、在 MacBook Air 上运行的实践，15:10 起讨论参考音频和语气控制。页面抓取时只有 24 次播放，适合作为自部署实践线索，不能作为主流采用证据；节目讨论技术也不足以独立证明其每段音频均由该模型生成。

本次没有找到可用于计算“多数主流 TTS 播客使用哪家”的可靠市场份额统计。可以确认 ElevenLabs 有多个公开商业合作，NotebookLM 有 Spotify 大规模历史案例，中文独立项目存在 Azure 等制作路线；对未披露技术栈的节目，不能仅凭听感认定供应商。此前媒体关于小宇宙翻译功能接入 MiniMax 的报道，也不能推导为平台内多数中文原创节目都由 MiniMax 配音。

## 可以复用的制作流程

### 材料直接生成双人节目

使用 NotebookLM Audio Overviews 或豆包语音播客，将来源资料转成讨论。Google 官方说明前者会围绕资料生成双主持人对话；豆包接口则区分材料生成、已有对话合成、话题联网生成。若要保留已经审核过的脚本，可优先检查豆包的 `action=3` 对话合成方式。[NotebookLM 功能说明](https://blog.google/innovation-and-ai/products/notebooklm-audio-overviews/)、[豆包接口](https://docs.volcengine.com/docs/DoubaoVoice/podcast_mustread?lang=zh)。

### 审核脚本后生成固定主播

建议流程：资料核查 → 双人脚本 → 固定各主播音色 → 按段合成 → 检查错读与遗漏 → 调整对话间隔和音量 → 音乐及导出。适合长期维护栏目和局部重做。HN 瞎聊公开说明提供了类似自动化链路；Wondercraft 案例也展示了语音生成后的编辑环节。[HN 瞎聊](https://hn.craigary.net/ai/)、[Wondercraft 合作案例](https://elevenlabs.io/blog/wondercraft)。这是基于案例提出的制作建议，不代表行业占比。

### 开源对话生成

[MOSS-TTSD](https://github.com/OpenMOSS/MOSS-TTSD) 是专门面向长篇多人对话的开源路线，仓库提供在线 Demo 入口。当前 v1.0 文档声称支持 1–5 位说话人和最长 60 分钟上下文；这些是项目声明，实际资源占用、长篇稳定性与中文效果仍需在目标设备上验证。它可作为对话生成的比较对象，本文没有找到足以将其列为主流节目供应商的证据。

## 怎样进行一轮有效试听

1. 选一段约 2–3 分钟、包含完整问答的中文稿，另加专业词、数字、缩写和中英混读。
2. 每家固定一个男声、一个女声，保持同稿、近似语速与播放音量。
3. 先听连续表达，再听接话；记录错字、漏句、长停顿、音色变化和重复生成次数。
4. 用十分钟试播集核实长篇表现，再决定持续使用的模型。

建议记录以下项目，不预填主观分数：

| 项目 | 为什么重要 |
|---|---|
| 发音与忠实度 | 专有名词和数据错读会改变节目含义 |
| 韵律与口语感 | 重音、语速和句末语气影响长时间收听体验 |
| 接话与节奏 | 双人节目需要听清双方的回应关系 |
| 音色一致性 | 跨段、重做和跨集应保持主持人身份 |
| 局部修改成本 | 单句改动不应迫使整集反复生成 |
| 每分钟成品费用 | 预算应计入试音、重做、音色和后期成本 |

## 后续信息与局限

本文没有找到覆盖所有候选的公开统一路线图，未来版本不作为当前能力。研究项目样音与商用 API 也不保证使用完全相同的权重或配置。当前最值得补充的证据，是在同一篇中文双人稿上比较 MiniMax、Qwen-Audio-TTS、CosyVoice、Azure HD 与豆包对话合成，并保存原始输出及重做记录。

## 参考资料

除明确写出的公告时间外，下列链接均在 2026-10-24 检索或核对；动态榜单和体验入口可能更新。

- [Artificial Analysis：Provider Voice 榜](https://artificialanalysis.ai/text-to-speech/leaderboard/provider-voice)、[Speech Explorer](https://artificialanalysis.ai/text-to-speech/speech-explorer)。
- [MiniMax：Speech 2.8 发布及样音，2026-01-23](https://www.minimax.io/news/minimax-speech-28)。
- [阿里云：Qwen-Audio-TTS 音色](https://help.aliyun.com/zh/model-studio/qwen-audio-tts-voice-list)、[CosyVoice 音色](https://help.aliyun.com/zh/model-studio/cosyvoice-voice-list)、[Qwen 3.1 Plus 型号信息](https://help.aliyun.com/zh/model-studio/qwen-audio-3-1-tts-plus)。
- [火山引擎：产品与能力预览](https://docs.volcengine.com/docs/DoubaoVoice/ProductOverview-9?lang=zh)、[播客接口](https://docs.volcengine.com/docs/DoubaoVoice/podcast_mustread?lang=zh)。
- [Google：Audio Overviews 发布与成品样例，2024-09-11](https://blog.google/innovation-and-ai/products/notebooklm-audio-overviews/)、[多语言支持，2025-04-29](https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-audio-overviews-50-languages/)。
- [Perplexity：Discover Daily 节目官网](https://www.perplexity.ai/podcast)。
- [ElevenLabs：Perplexity 合作，2024-02-23](https://elevenlabs.io/blog/elevenlabs-and-perplexity-announce-partnership-2)、[Wondercraft 合作，2024-11-13](https://elevenlabs.io/blog/wondercraft)。
- [Spotify：2024 Wrapped AI Podcast，2024-12-04](https://newsroom.spotify.com/2024-12-04/your-spotify-wrapped-ai-podcast-is-here-to-help-you-reconnect-with-the-music-that-defined-your-year/)。
- [HN 瞎聊：创作者技术说明](https://hn.craigary.net/ai/)。
- [MOSS-TTSD：项目及 Demo 入口](https://github.com/OpenMOSS/MOSS-TTSD)。
