# Feat Issue 模板

## 高密度摘要

- **一句话结论**：先明确使用场景、交付范围和可观察结果，再记录方案与实际验证。
- **核心机制**：通过完成标准约束范围，关键方案随证据补齐。
- **判断入口**：新增能力或有意改变行为时使用。
- **常见误区**：创建时不必编造实施方案；实施步骤不等同于完成标准。
- **相关文档**：[模板说明](../../private/projects/templates/readme.md)、[统一完成门槛](../../agents/pilot/agent/skills/project-management/SKILL.md#completion-requirements)。

## 使用说明

按任务规模合并或省略不适用的正文栏目，保留四个 Frontmatter 字段和末尾三个固定章节。未知信息写为待确认，验证区只记录实际检查；补录完成事项可直接填写已有证据。关闭 Issue 前按 [Pilot 完成门槛](../../agents/pilot/agent/skills/project-management/SKILL.md#completion-requirements) 审查，真实记录的写入遵从 [项目流程](../../private/projects/readme.md)。

## 模板

```markdown
---
type: feat
status: backlog
urgent: false
endDate:
---

# 一句话描述要交付的新能力

## 背景与目标

【使用场景、现有问题和期望结果】

## 范围

【本次交付内容；仅在影响判断时说明边界】

## 完成标准

- [ ] 【可观察、可验证的结果】

## 方案与决策

【已知方案和关键决策；未确定则写待设计】

## 风险与发布

【仅在相关时填写兼容性、数据、发布或回滚要求；小任务可省略本节】

## 验证

## pending 原因

## 改动Prompt
```
