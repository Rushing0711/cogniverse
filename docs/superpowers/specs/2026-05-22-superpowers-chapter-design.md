# Superpowers 深度实战章节 — 设计文档

## 背景

现有 `docs/aillm/Claude/02-第2章 Skills与生态.md` 中 Superpowers 部分（1.3 节）存在以下不足：

1. 没有体现官方 7 步流水线（头脑风暴 → Git Worktree → 编写计划 → 子代理执行 → TDD → 代码审查 → 分支完成）
2. 14 个技能以表格罗列，与流水线阶段脱节，读者难以理解技能之间的串联关系
3. 缺少完整的端到端实战演练
4. 安装方式使用 `npx skills add`，但官方文档和社区文章推荐 plugin 方式

## 目标

将 Superpowers 从第 2 章的一个小节**独立为完整一章**，内容覆盖：概述哲学、安装配置、技能全貌、核心流水线、实战演练、优点与不足。

## 章节定位

Superpowers 作为独立章节（暂定第 3 章），是"Skills 套装深度实战"系列的第一篇。后续各套装（OpenSpec、gstack、mattpocock、GSD）也将各自独立成章。

整体结构调整后：
- 第 1 章：claude-mem（从现有第 2 章独立）
- 第 2 章：Skills 全局视角（现有 1.1 套装对比 + 1.2 发现安装）
- 第 3 章：Superpowers 深度实战（**本次构建**）
- 后续章节：OpenSpec、gstack、mattpocock、GSD、组合方案

## 新章节结构

```
X.1 概述与哲学
X.2 安装与配置
X.3 14 个技能全貌（按 7 步流水线组织）
X.4 7 步核心流水线（逐阶段深入）
X.5 实战演练：从零开发待办事项功能
X.6 优点与不足
```

## 各节内容设计

### X.1 概述与哲学

**内容要点：**
- Superpowers 是什么：AI 编程代理的"工作规范框架"，不是让 AI 更聪明，而是让 AI 更守规矩
- 核心理念：把 AI 当作热情但没判断力的初级工程师，用强制流程约束行为
- 四大设计哲学：TDD 先行、系统化而非临时应对、降低复杂度、证据而非声称
- 作者与影响力：Jesse Vincent（RT 作者），51k+ Stars，16+ 贡献者，570k+ 安装
- 与传统 AI 编程对比：传统"你的想法 → AI → 代码"，Superpowers"你的想法 → 层层检查点 → 高质量产物"

### X.2 安装与配置

**内容要点：**
- 前置条件：Claude Code 已安装
- 安装命令（plugin 方式，与 GitHub 官方和社区文章一致）：
  ```bash
  /plugin marketplace add obra/superpowers-marketplace
  /plugin install superpowers@superpowers-marketplace
  ```
- 验证安装：发起一个需求，观察 AI 是否开始追问而非直接写代码
- 自动触发机制说明
- 如何禁用特定技能：`.superpowers/config.json`

### X.3 14 个技能全貌（按 7 步流水线组织）

**组织方式：** 以流水线阶段为横轴，每个阶段列出对应技能、星标、一句话职责、触发场景、实际效果。读者一眼看到"哪个阶段有哪些武器"。

```
阶段一：头脑风暴（设计）
  └─ brainstorming ★★★★ — 苏格拉底式追问，把模糊想法变成清晰 spec

阶段二：Git Worktree（环境隔离）
  └─ using-git-worktrees ★★ — 自动创建隔离分支，不污染主工作区

阶段三：编写计划（规划）
  └─ writing-plans ★★★★★ — 拆成 2-5 分钟可完成的原子任务

阶段四：子代理执行（编码）
  ├─ executing-plans ★★★★ — 逐个执行计划任务，每步 checkpoint
  ├─ subagent-driven-development ★★★ — 每任务独立子代理 + 两阶段审查
  └─ dispatching-parallel-agents ★★★ — 自动检测可并行任务，派发子代理

阶段五：TDD（质量门禁）
  └─ test-driven-development ★★★★★ — 强制 Red → Green → Refactor

阶段六：代码审查（质量门禁）
  ├─ requesting-code-review ★★★★ — 5 个子代理并行审查
  └─ receiving-code-review ★★★ — 结构化处理审查反馈

阶段七：分支完成（交付）
  └─ finishing-a-development-branch ★★★ — 4 种收尾选项

贯穿全局（横切）
  ├─ using-superpowers ★★★★★ — 核心调度器，确保流程约束生效
  ├─ systematic-debugging ★★★★★ — 四阶段调试：观察→假设→验证→修复
  ├─ verification-before-completion ★★★★ — 宣称完成前自动检查
  └─ writing-skills ★★ — 元技能，用 TDD 方式编写新 Skill
```

### X.4 7 步核心流水线

**逐阶段深入，每阶段讲清 4 个维度：**

| 维度 | 说明 |
|------|------|
| 触发时机 | CC 检测到什么关键词/场景自动触发 |
| 涉及技能 | 该阶段调用哪些技能、各自分工 |
| 输入 → 输出 | 上游产物是什么，本阶段产出什么 |
| 门禁条件 | 什么情况下算通过、什么情况被拦截 |

**配 Mermaid 流程图**展示完整链路：

```
你的想法
  → [阶段1] brainstorming → spec 文档
  → [阶段2] git-worktree  → 隔离分支
  → [阶段3] writing-plans → 原子任务清单
  → [阶段4] executing-plans / subagent / parallel → 逐任务产出代码
       ↓ (每个任务内部)
       [阶段5] TDD → 测试先行的编码循环
  → [阶段6] code-review → 审查报告 + 修复
  → [阶段7] finishing-branch → 合并/PR/保留/丢弃

  [横切] using-superpowers 全程调度
  [横切] systematic-debugging 随时接管异常
  [横切] verification-before-completion 宣称完成前拦截
```

**补充说明：** 简单任务自动跳过部分阶段（如 git-worktree），复杂任务走完整流程。这是 Superpowers 智能调度的一部分。

### X.5 实战演练：从零开发待办事项功能

**以微信文章"告别瞎指挥"中的实战案例为蓝本。**

场景：Node.js + Express 项目，添加"待办事项"功能，支持增删改查。

| 步骤 | 阶段 | 关键交互 |
|------|------|----------|
| 1 | 提出需求 | 用户："给项目加一个待办事项功能，用户可以添加、删除、标记完成" |
| 2 | 头脑风暴 | AI 探索项目 → 追问字段（标题/描述/截止日期？）、API 设计、认证需求、删除策略（物理/软删除）、标题长度限制 |
| 3 | 确认设计 | AI 生成设计文档（数据模型 + API 设计 + 文件结构），用户确认 |
| 4 | TDD 测试先行 | 先写测试用例（创建待办、空标题拒绝、超长标题拒绝），运行确认全部失败 |
| 5 | 实现代码 | model → controller → routes，逐层实现，边写边跑测试直到通过 |
| 6 | 代码审查 | 自动触发审查报告：规格合规检查 + 代码质量检查（参数化查询、命名规范、测试覆盖率 92%） |
| 7 | 完成提交 | `git commit -m "feat: add todo API with TDD"` |

展示具体代码片段（测试用例、模型实现、审查报告），让读者感受到 Superpowers 在每一步的实际效果。

### X.6 优点与不足

**优点：**
- 代码质量大幅提升（测试覆盖率高、bug 少）
- 设计文档沉淀，后期维护有据可查
- 流程标准化，团队成员产出质量一致
- 可扩展（自定义技能适应项目需求）
- 减少 AI "自作聪明"的风险

**不足：**
- 初期开发速度慢约 30%（但整体交付时间可能缩短，因返工减少）
- 不适合快速原型和简单一次性脚本
- Token 消耗较大（每个阶段都需上下文）
- 学习曲线：需要理解 7 步流程和自动触发机制

## 对现有文档的影响

1. **第 2 章 1.3 节**：原地替换为简要概述 + 指向新章节的链接
2. **第 2 章 1.8 节**：组合方案中引用 Superpowers 的部分保持不变，后续独立成章时再调整
3. **安装方式修正**：现有 1.3 节的 `npx skills add` → 新章节使用 plugin 方式
4. **侧边栏配置**：`config.mjs` 中注册新路径

## 数据来源

- GitHub 官方仓库：https://github.com/obra/superpowers
- 微信文章"告别瞎指挥"：https://mp.weixin.qq.com/s/3jB7GK2h_dbVrHQ-6JW8hw
- 实战场景以微信文章中的"待办事项功能"演练为蓝本
