# Jarvis 的 Agent 指令：GPT 6 审计与整改

## 高密度摘要

- **一句话结论**：已按审计建议调整根规则、研究与文案技能、规划脚本和输出模板，并让 Pilot 支持有证据的单次计划完成事项。
- **核心机制**：用任务范围、实际授权、可用工具和完成证据决定下一步，消除重复确认、固定操作次数和模板配额。
- **判断入口**：需要检查某项建议的落实情况时，查看整改表及其对应文件；需要判断可靠性时，查看验证记录和适用边界。
- **常见误区**：技能文件存在不代表正文每轮加载；审批可以由代码强制；静态检查和少量行为样例不能证明普遍性能提升。
- **相关文档**：[项目规则](/Users/joel/joel/jarvis/AGENTS.md)、[技术索引](/Users/joel/joel/jarvis/data/technology.md)、[Pilot 入口](/Users/joel/joel/jarvis/agents/pilot/README.md)、[上下文管理](/Users/joel/joel/jarvis/data/c/context-manage.md)。

审计与整改日期：2026-09-08。整改依据为本次审计和用户“完全都按推荐来改”的授权。

## 审计依据与范围

OpenAI 的 GPT 6 Astra 指南提醒，技能与 `AGENTS.md` 中含糊或冲突的要求可能导致模型提前停顿。用户采用的写作规范、子代理及消息可读性要求均有官方对应建议，因此保留。[官方模型指南](https://developers.openai.com/api/docs/guides/latest-model)

检查了全局与项目 `AGENTS.md`、项目 `skills/` 下 11 份原始技能、`.agents/skills/` 下三份入口、相关引用与模板、Pilot 开发和运行时指令、项目管理工具及流程。`.claude/skills` 与 `.codex/skills` 都链接到同一个 `skills/`，不属于两套内容副本。

Codex 按路径发现项目指令，普通资料不会因存放在仓库就全部成为默认指令；Pilot 还有自己的运行环境。[官方 AGENTS.md 文档](https://learn.chatgpt.com/docs/agent-configuration/agents-md)

## 已落实的整改

| 对象 | 原规则的影响 | 实际修改 |
|---|---|---|
| [根 AGENTS.md](/Users/joel/joel/jarvis/AGENTS.md) | 网站访问强制先运行当前不存在的 OpenCLI；路由例举重复，短文也可能扩成完整模板 | 按可用能力选择工具并允许失败降级；模板改为路径映射；短文允许合并摘要字段和章节；明确既有授权与任务范围 |
| 写作风格 | 对正式术语、代码标识符和模板字段的适用范围不够明确 | 保留用户原文，补充准确引用、正式术语、标识符及必需字段的处理范围 |
| [工具画像](/Users/joel/joel/jarvis/skills/tool-profile-report/SKILL.md) | 报告完成后还要等确认才能保存；要求用户观点配额和固定日期校验基准 | 按请求直接保存；使用当前研究日期；观点和计划以真实来源为依据，缺失时注明 |
| [公司研究](/Users/joel/joel/jarvis/skills/company-success-deep-dive/SKILL.md) | 可选输入变成必答表单；要求所有框架并逐条贴证据标签；保存前再确认 | 补默认研究范围；按解释力选框架；只显式标注关键推断和缺口；同步简化研究与报告模板，直接保存成果 |
| [Prompt 技能](/Users/joel/joel/jarvis/skills/prompt-engineering/SKILL.md) | 560 行混合教材、Claude 容量假设、无来源提升比例和强制话术 | 重写为 48 行，围绕目标、上下文、工具边界、交付与实际失败进行优化 |
| [文件规划](/Users/joel/joel/jarvis/skills/planning-with-files/SKILL.md) | 超过五次调用就创建三份文件；每两次操作记录；固定三次失败求助 | 需要恢复或交接时启用；任务专属目录，默认只建计划，日志按需；按阶段保存，按错误性质重试或求助；脚本及附属文档同步修改 |
| [聊天摘要](/Users/joel/joel/jarvis/skills/extract-chat-summary/SKILL.md) | 关联字段缺失时规则矛盾；摘要扩展到失效路径归档与自动推送 | 默认直接交付摘要；明确归档时写入指定位置或 `data/c/`；未知关系省略；提交和推送各自服从授权 |
| [目标访谈](/Users/joel/joel/jarvis/skills/interview-questioner/SKILL.md) | 每次回答后必须继续问，退出条件过重，声称切换运行模式 | 只在明确要求访谈时启用；重要信息已足够或用户要求产出时结束并交付；删除伪模式指令 |
| [Twitter 读取](/Users/joel/joel/jarvis/skills/twitter-viewer/SKILL.md) | 固定第三方站点与 CLI，与根工具规则冲突 | 明确信息获取目标、原始来源与上下文要求；根据可用工具读取并允许降级，第三方站点仅作可选路线 |
| [文案](/Users/joel/joel/jarvis/.agents/skills/copywriting/SKILL.md)与[社交内容](/Users/joel/joel/jarvis/.agents/skills/social-content/SKILL.md) | 小任务也收集完整营销背景、输出备选并启动后续技能 | 小任务直接产出；完整策略按需收集信息；解释和备选服从请求；同步清理套话、算法断言、固定发布频率和分析配额 |
| [Tenzing 示例](/Users/joel/joel/jarvis/knowledge/examples/tenzing-moltbook.md) | 启用技能中混入其他助手和用户身份，缺少操作知识 | 移出技能目录，保存为普通参考，删除外来私人联系信息和启用元数据 |
| [健康模板](/Users/joel/joel/jarvis/knowledge/t/template-body-indicator-output.md)及其他三类健康输出模板 | 固定章节、摘要与定义重复、训练等级和费用信息可能扩大请求 | 按完整专题、短文和局部修改调整；保留有关判断依据和适用边界；训练版本、错误清单和价格按需提供 |
| [Issue 模板](/Users/joel/joel/jarvis/private/projects/templates/readme.md)与[项目流程](/Users/joel/joel/jarvis/private/projects/readme.md) | 小事项填大量无关栏目；多个模块合理就停下询问；完成门槛重复维护 | 正文按规模合并；主要归属清楚时在计划说明后继续；保留解析器字段和固定章节；完成政策统一引用运行时技能 |
| [Pilot 运行时技能](/Users/joel/joel/jarvis/agents/pilot/agent/skills/project-management/SKILL.md) | 列表回顾可能逐项读全文；Codex 缺少专用工具入口；补录完成事项要求多轮状态写入 | 元数据讨论直接使用查询结果；提供完整草稿与 Pilot 启动交接方式；支持 backlog/pending 直接完成并要求本次新验证结果 |

推理提示改写遵从官方建议：先使用直接指令，示例按需添加；用可核验依据和检查结果支持答案，不靠逐步思考口令激活能力。[官方推理建议](https://developers.openai.com/api/docs/guides/reasoning-best-practices)

## Pilot 的实际行为与边界

[启动和 Codex 交接说明](/Users/joel/joel/jarvis/agents/pilot/README.md)提供项目运行入口与草稿交接。当前 Codex 缺少专用工具时，可以准备完整草稿交给 Pilot。真实 Issue 和 diary 仍由 Pilot 生成预览并请求 apply 审批；用户授权修改流程、模板和代码时，按普通仓库编辑处理。

[状态校验](/Users/joel/joel/jarvis/agents/pilot/agent/lib/projects/issue-codec.ts)允许 `backlog -> done` 和 `pending -> done`，每次进入 done 都要求本次 patch 提供非空验证结果。完成证据、方案与根因等语义要求统一维护在 [Completion requirements](/Users/joel/joel/jarvis/agents/pilot/agent/skills/project-management/SKILL.md#completion-requirements)。文本非空只是程序校验，内容是否充分仍需 Pilot 根据实际证据判断。

[apply 工具](/Users/joel/joel/jarvis/agents/pilot/agent/tools/apply_issue_change.ts)继续使用人工审批；计划预览一致性、过期检查、幂等处理、显式重新打开与成功结果判定继续有效。

## 保留的项目约定

- 用户写作偏好、全局 `pnpm`、新增生产依赖确认及子代理使用条件。
- 请求研究成果保存到 `data/`，通过相关二级索引复用；短暂问答可以直接回答。
- 高密度摘要、问题价值说明和主导设计系统，按实际文档规模执行。
- 不编造事实或验证结果、真实数据写入审批、隐私、解析器支持的字段、Issue 标识与显式重新打开。

这些规则表达了项目意图、技术接口或授权边界，模型能力增强无法代替它们。

## 验证记录

- 修改后的技能通过 frontmatter 校验；本地引用和补丁空白检查已执行。
- 规划脚本通过语法与临时目录行为检查，覆盖显式目录、空格路径、任务隔离、可选日志、已有文件保护及完成状态与格式错误。
- Pilot 的 `pnpm test` 通过类型检查和 35 个测试。新增用例覆盖直接完成、新验证结果、最终预览、过期计划与幂等行为。
- `pnpm exec eve info` 返回 compile ready、0 errors、0 warnings、1 skill；三类模板可由真实解析器读取，两套模板正文一致。
- 独立技能样例：单个按钮请求返回“下载所选报表（CSV）”；80 字以内的 LinkedIn 请求直接返回一条短帖；售后 Prompt 保留只读查询与退款审批的不同要求。
- 另外三个独立样例：聊天摘要直接返回文本；仅给定材料的虚构公司研究在临时工作区保存报告和索引，未追问可选输入；访谈用户要求产出时直接交付一周计划。
- Pilot 独立审查发现启动文档的登录入口不准确，已按安装包文档改为本地 `codex login` 凭据；其他受审查的状态、审批和模板行为未发现阻塞问题。

这些结果验证了具体行为和接口约束。尚未进行多轮、统计意义上的模型效果对照，因此不声称固定比例的速度或准确率提升。后续可用真实任务继续观察额外确认、无效调用和交付质量，仅在出现可复现问题时补规则。
