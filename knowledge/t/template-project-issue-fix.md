# Fix Issue 模板

## 高密度摘要

- **一句话结论**：把问题现象、证据、根因、方案和回归结果连接起来。
- **核心机制**：调查形成根因判断，实际检查证明修复效果。
- **判断入口**：实际行为与预期不一致时使用。
- **常见误区**：未知根因须保留不确定性；关闭条件见统一完成门槛。
- **相关文档**：[模板说明](../../private/projects/templates/readme.md)、[统一完成门槛](../../agents/pilot/agent/skills/project-management/SKILL.md#completion-requirements)。

## 使用说明

按任务规模合并或省略不适用的正文栏目，保留四个 Frontmatter 字段和末尾三个固定章节。未知信息写为待确认，验证区只记录实际检查；补录完成事项可直接填写已有证据。关闭 Issue 前按 [Pilot 完成门槛](../../agents/pilot/agent/skills/project-management/SKILL.md#completion-requirements) 审查，真实记录的写入遵从 [项目流程](../../private/projects/readme.md)。

## 模板

```markdown
---
type: fix
status: backlog
urgent: false
endDate:
---

# 一句话描述需要修复的问题

## 问题与影响

【实际行为、预期行为、影响范围和必要的环境信息】

## 复现与证据

【触发条件、复现步骤或日志等现有证据；未知则写待收集】

## 完成标准

- [ ] 【明确原问题消失的场景及必要的回归范围】

## 根因

【状态：待确认；调查后记录因果关系及支持证据】

## 解决方案

【行为变化和选择原因；未确定则写待设计】

## 回归风险

【相邻流程与边界条件；存在数据、性能或兼容风险时补充监控和回滚要求】

## 验证

## pending 原因

## 改动Prompt
```
