# Chore Issue 模板

## 高密度摘要

- **一句话结论**：维护任务用可检查的产物和实际结果界定完成。
- **核心机制**：按操作影响选择执行、风险和回滚信息。
- **判断入口**：依赖升级、迁移、清理、配置或文档维护时使用。
- **常见误区**：简单文档改动可裁剪步骤与回滚栏目；不得预填成功结果。
- **相关文档**：[模板说明](../../private/projects/templates/readme.md)、[统一完成门槛](../../agents/pilot/agent/skills/project-management/SKILL.md#completion-requirements)。

## 使用说明

按任务规模合并或省略不适用的正文栏目，保留四个 Frontmatter 字段和末尾三个固定章节。未知信息写为待确认，验证区只记录实际检查；补录完成事项可直接填写已有证据。关闭 Issue 前按 [Pilot 完成门槛](../../agents/pilot/agent/skills/project-management/SKILL.md#completion-requirements) 审查，真实记录的写入遵从 [项目流程](../../private/projects/readme.md)。

## 模板

```markdown
---
type: chore
status: backlog
urgent: false
endDate:
---

# 一句话描述维护工作

## 背景与触发

【维护原因和目标】

## 范围与产物

【需要更新的代码、配置、文档或迁移产物】

## 完成标准

- [ ] 【可以直接检查的产物或行为】

## 执行步骤

【需要协调或分阶段执行时填写；简单任务可省略本节】

## 风险与回滚

【按实际影响填写中断、兼容性、备份或回滚要求；不适用时可省略本节】

## 执行结果

【实际结果与重要偏差；尚未执行则写待执行】

## 验证

## pending 原因

## 改动Prompt
```
