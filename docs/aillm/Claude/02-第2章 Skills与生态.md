# Skills与生态
## 1 Skills 生态概览

社区生态中有多套流行的 Skills 套装，它们不是单个 Skill，而是一组配合使用的技能包，各有不同的设计哲学和适用场景。

### 1.1 主流套装对比

| 套装 | Stars | 核心理念 | 技能数 | 适用场景 | 安装命令 |
|------|-------|----------|--------|----------|----------|
| **[Superpowers](https://github.com/obra/superpowers)** | 202k+ | 工程纪律 + TDD 强制 | 14 个 | 日常开发的完整闭环 | `/plugin install superpowers@superpowers-marketplace` |
| **[gstack](https://github.com/garrytan/gstack)** | 99k+ | 虚拟 23 人工程团队 + Power Tools | 47 个 | Solo 冲刺产品 MVP | `git clone` 到 `~/.claude/skills/gstack` |
| **[mattpocock](https://github.com/mattpocock/skills)** | 89k+ | 慢下来，先想清楚再动手 | 12 个 | TypeScript 开发 | 见第5章（支持单技能安装，路径含分类名） |
| **[GSD](https://github.com/gsd-build/get-shit-done)** | 63k+ | Spec 驱动 + 上下文工程 | 多个 | 0→1 完整功能开发 | `npx get-shit-done-cc@latest` |
| **[OpenSpec](https://github.com/Fission-AI/OpenSpec)** | 49k+ | Spec 驱动开发（SDD） | 1 套 CLI + 多命令 | 需求到交付的完整闭环 | `npm install -g @fission-ai/openspec@latest` |
| **[find-skills](https://github.com/vercel-labs/skills)** | 579k+ 安装 | Skills 搜索引擎 | 1 个 | 发现和搜索其他 Skills | `npx skills add vercel-labs/skills -g -a claude-code --skill find-skills` |

**设计哲学差异**：

- **Superpowers**："把 AI 当作热情但没判断力的初级工程师"，用强制流程约束行为
- **gstack**："一个人编程，但 AI 扮演整个团队"，角色扮演式协作
- **mattpocock**："让 AI 慢下来先想清楚再动手"，用追问逼你理清思路
- **GSD**："不要让上下文腐化"，每个阶段用独立上下文窗口
- **OpenSpec**："先对齐 spec 再写代码"，人类与 AI 在写代码前就目标达成一致（[官网](https://openspec.dev/)）

### 1.2 Skills 发现、安装与资源导航

Skills 生态已超过 20 万个。找对 Skill、正确安装、知道去哪找资源，是用好 Skills 的基础。本节涵盖搜索工具、安装机制和资源入口。

**find-skills 搜索工具**（579K+ 安装，建议第一个装）：

```bash
npx skills add vercel-labs/skills -g -a claude-code --skill find-skills
```

安装后在 CC 中用自然语言搜索：

```text
"用 find-skills 帮我找适合 React 前端开发的 skills"
"用 find-skills 搜索代码审查相关的 skills，按安装量排序"
```

它会从 20 万+ Skills 中按关键词匹配，返回名称、安装量和简短描述。比如搜索 "Next.js TypeScript"，能发现 `vercel-react-best-practices`、`frontend-design`、`mattpocock/skills` 等。

**资源导航**：

| 资源 | 地址 | 说明 |
|------|------|------|
| Skills 在线搜索 | https://skills.sh | 20 万+ Skills 搜索，按安装量和排名筛选 |
| 官方 Skills 仓库 | https://github.com/anthropics/skills | 官方维护的技能集合 |
| Awesome 精选列表 | https://github.com/ComposioHQ/awesome-claude-skills | 按领域分类推荐 |
| 500+ Skills 聚合 | https://github.com/VoltAgent/awesome-agent-skills | Anthropic/Google/Vercel/Stripe 等官方合集 |
| curated 合集 | https://github.com/EricGrill/agents-skills-plugins | Skills + Plugins 精选 |

**关于 npx 安装与 Node 环境**：

`npx skills add <package>` 只是投递机制——从 npm 临时下载，把 SKILL.md 等文件复制到 `~/.claude/skills/`（用户级，所有项目可用）或 `.claude/skills/`（项目级，可检入 git），然后 npx 退出。

Skills 最终是纯 Markdown 文本文件，与 Node/npm/nvm **完全解耦**。即使切换 Node 版本甚至卸载 Node，已安装的 Skills 不受影响。唯一依赖 Node 的是安装新 Skill 时 `npx` 命令本身。

**Plugin 还是 npx？** Superpowers 推荐通过 Plugin 市场安装（`/plugin install superpowers@superpowers-marketplace`），它能利用 CC 的插件管理系统进行版本更新、scope 管理和启用/禁用。gstack、mattpocock、GSD 目前主要通过 `npx skills add` 或 `git clone` 安装，效果完全相同——Skills 最终都是 `~/.claude/skills/` 下的 Markdown 文件。选择哪种方式取决于套装作者提供什么分发渠道。

**安装建议**：一次装 2-3 个核心的，用一周感受后再决定加不加。多套全装（80+ 个 Skill）token 开销大，而且不同套装理念可能冲突，反而降低效率。

## 2 Superpowers 实战

### 2.1 核心理念与背景

Superpowers 由 Jesse Vincent 和 Prime Radiant 创建，MIT 许可，203k+ Stars。它不是一个普通的 Skill 集合，而是一套**完整的软件开发方法论**——用 14 个相互配合的技能，强制 AI 编码代理遵守标准开发流程，而不是拿到需求就急于写代码。

**核心定位**："把 AI 当作热情但没判断力的初级工程师"。AI 会急于写代码、跳过测试、忽略边界情况、声称"完成了"但实际没验证。Superpowers 用流程约束行为——先设计再编码、先测试再实现、先验证再声明完成。

**四条核心哲学**：

- **TDD 优先**：永远先写测试。没有看到失败测试，不准写生产代码
- **系统化优于临时应对**：流程压倒猜测，每个开发阶段有明确的检查清单和退出标准
- **简化复杂度**：简单是首要目标，能用简单方案绝不用复杂方案（YAGNI）
- **证据优于声明**：宣称"完成"前必须拿出测试通过、审查通过的实际证据

**调度器 `using-superpowers`**：这是整个系统的核心。它在每次对话启动时加载，持续监控 Claude 的行为——有 1% 可能性匹配到某个 Skill 就触发它。这不是建议，不是可选，**不可协商，不可跳过**。你说"帮我做 X"时，它不会直接写代码，而是先触发 `brainstorming` 追问需求；你说"修这个 bug"时，它不会直接改代码，而是先走 `systematic-debugging` 四阶段流程。

所有 14 个技能均未设置 `disable-model-invocation`——全部自动触发，Claude 在匹配到对应场景时自动加载。整套一次性安装，不支持单独挑选：流程的价值在于环环相扣，去掉任何一环都会削弱闭环的纪律性。

### 2.2 安装

Superpowers 通过 Plugin 市场分发：

```bash
# 1. 添加 Superpowers 市场
/plugin marketplace add obra/superpowers-marketplace

# 2. 安装（--scope 默认 user，所有项目可用）
/plugin install superpowers@superpowers-marketplace

# 3. 重新加载使插件生效
/reload-plugins
```

安装后 14 个技能自动可用。无需额外配置——当你的任务匹配到某个技能时，它自动触发对应流程。

由于 Superpowers 需要执行测试、git 操作等 Bash 命令，确保 `~/.claude/settings.json` 中合理配置了权限：

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test *)",
      "Bash(npx vitest *)",
      "Bash(git *)",
      "Bash(ls *)"
    ]
  }
}
```

### 2.3 14 个技能全览

以下描述均来自各技能 `SKILL.md` 的官方 `description` 字段——这是 Claude 判断何时触发该技能的依据。技能按 2.4 节工作流顺序排列。

| 阶段 | 技能 | 官方描述（SKILL.md description） |
|------|------|------|
| **全局** | `using-superpowers` | 每次对话启动时使用——建立如何发现和使用技能的方式，要求在**任何**回复（包括澄清性问题）之前先调用 Skill 工具 |
| **设计** | `brainstorming` | **必须在任何创造性工作之前使用**——创建功能、构建组件、添加功能或修改行为。在实现之前探索用户意图、需求和设计 |
| **环境** | `using-git-worktrees` | 开始需要与当前工作区隔离的功能工作之前、或执行实施计划之前使用——通过原生工具或 git worktree 回退确保隔离工作区存在 |
| **规划** | `writing-plans` | 在有 spec 或需求的多步骤任务时使用，**在写代码之前** |
| **执行** | `subagent-driven-development` | 在当前会话中执行包含独立任务的实施计划时使用 |
| **执行** | `executing-plans` | 有书面的实施计划要在独立会话中执行并附带审查检查点时使用 |
| **执行** | `dispatching-parallel-agents` | 面对 2 个以上独立任务、可以无共享状态或顺序依赖地并行处理时使用 |
| **质量** | `test-driven-development` | **在实现任何功能或 bug 修复时使用，在编写实现代码之前** |
| **质量** | `requesting-code-review` | 完成任务、实现主要功能、或合并之前使用，以验证工作是否满足要求 |
| **质量** | `receiving-code-review` | 收到代码审查反馈时、在实施建议之前使用——特别是反馈看起来不清晰或技术上存疑时。要求技术严谨性和验证，而非表演式同意或盲目实施 |
| **调试** | `systematic-debugging` | 遇到任何 bug、测试失败或意外行为时，在提出修复之前使用 |
| **调试** | `verification-before-completion` | 即将宣称工作完成、已修复或已通过时，在提交或创建 PR 之前使用——要求运行验证命令并确认输出，然后才能做出任何成功声明；证据先于断言 |
| **交付** | `finishing-a-development-branch` | 实现完成、所有测试通过、需要决定如何整合工作时使用——通过呈现合并、PR 或清理的结构化选项来引导开发工作完成 |
| **元技能** | `writing-skills` | 创建新技能、编辑现有技能、或在部署前验证技能是否正常工作时使用 |

### 2.4 核心工作流

Superpowers 将开发过程拆成 7 个步骤。Claude 在每个步骤触发前检查是否有相关的 Skill——这些不是建议，是强制流程。

<div class="workflow-rows">
  <div class="wf-row wf-design">
    <div class="wf-marker">1</div>
    <div class="wf-body">
      <div class="wf-skill">brainstorming</div>
      <div class="wf-desc">通过苏格拉底式逐个追问，把模糊想法变成清晰设计。探索 2-3 种替代方案后，分节呈现设计等你确认。<strong>硬门槛：设计批准前，禁止写任何代码。</strong></div>
      <div class="wf-output">📄 产出：<code>docs/superpowers/specs/YYYY-MM-DD-&lt;主题&gt;-design.md</code></div>
    </div>
  </div>
  <div class="wf-row wf-env">
    <div class="wf-marker">2</div>
    <div class="wf-body">
      <div class="wf-skill">using-git-worktrees</div>
      <div class="wf-desc">创建隔离 git worktree 和新分支，运行项目初始化，验证基线测试通过。已在 worktree 中则智能跳过，优先使用原生 harness 控制。</div>
      <div class="wf-output">📄 产出：新的 worktree + 分支（无文档文件）</div>
    </div>
  </div>
  <div class="wf-row wf-plan">
    <div class="wf-marker">3</div>
    <div class="wf-body">
      <div class="wf-skill">writing-plans</div>
      <div class="wf-desc">将设计拆成原子任务，每个 2-5 分钟。每任务包含：具体文件路径、完整代码骨架、验证命令。开始前先列出文件地图——哪些文件新建、哪些修改、各自的职责。</div>
      <div class="wf-output">📄 产出：<code>docs/superpowers/plans/YYYY-MM-DD-&lt;功能名&gt;.md</code></div>
    </div>
  </div>
  <div class="wf-row wf-exec">
    <div class="wf-marker">4</div>
    <div class="wf-body">
      <div class="wf-skill">subagent-driven-development / executing-plans</div>
      <div class="wf-desc">二选一执行引擎：<code>subagent-driven-development</code>（每任务派独立子代理，两阶段强制审查——先验证规格合规，再审查代码质量）或 <code>executing-plans</code>（主会话逐项执行，每步检查点验证后继续）。</div>
      <div class="wf-output">📄 产出：实现代码（含 git commit）</div>
    </div>
  </div>
  <div class="wf-row wf-tdd">
    <div class="wf-marker">5</div>
    <div class="wf-body">
      <div class="wf-skill">test-driven-development</div>
      <div class="wf-desc">步骤 4 执行期间自动触发。强制 RED-GREEN-REFACTOR 循环：先写失败测试 → 确认因功能缺失而失败 → 写最小实现 → 确认通过 → 重构 → 提交。<strong>代码写在了测试之前？删除，重来。</strong>禁止任何例外。</div>
      <div class="wf-output">📄 产出：测试文件 + 最小实现代码（每任务一个 commit）</div>
    </div>
  </div>
  <div class="wf-row wf-review">
    <div class="wf-marker">6</div>
    <div class="wf-body">
      <div class="wf-skill">requesting-code-review</div>
      <div class="wf-desc">对照计划审查全部变更，按严重程度分级报告问题。Critical 问题阻塞进度、必须修复后重新审查。审查维度包括安全性、LLM 信任边界、条件性副作用。</div>
      <div class="wf-output">📄 产出：严重程度分级的审查报告</div>
    </div>
  </div>
  <div class="wf-row wf-finish">
    <div class="wf-marker">7</div>
    <div class="wf-body">
      <div class="wf-skill">finishing-a-development-branch</div>
      <div class="wf-desc">确认所有测试通过后，提供 4 种收尾选项：合并到主分支 / 推送并创建 PR / 保留分支待后续 / 丢弃并清理 worktree。选择 PR 时保留 worktree 以供后续迭代。</div>
      <div class="wf-output">📄 产出：PR（选项2）或合并提交（选项1）</div>
    </div>
  </div>
</div>

<style>
.workflow-rows { margin: 24px 0; display: flex; flex-direction: column; gap: 0; }
.wf-row { display: flex; gap: 16px; padding: 16px 20px; border-left: 3px solid; position: relative; }
.wf-row + .wf-row { border-top: 1px solid #e8e8e8; }
.wf-marker { flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; margin-top: 2px; }
.wf-body { flex: 1; }
.wf-skill { font-size: 14px; font-weight: 700; font-family: monospace; margin-bottom: 4px; }
.wf-desc { font-size: 14px; color: #555; line-height: 1.7; }
.wf-output { font-size: 12px; color: #888; margin-top: 6px; word-break: break-all; }
.wf-design  { border-color: #c8d6ff; } .wf-design  .wf-marker { background: #5b7fff; }
.wf-env     { border-color: #d0d0d0; } .wf-env     .wf-marker { background: #999; }
.wf-plan    { border-color: #c8d6ff; } .wf-plan    .wf-marker { background: #5b7fff; }
.wf-exec    { border-color: #e8d8a0; } .wf-exec    .wf-marker { background: #d4a017; }
.wf-tdd     { border-color: #e8c8a0; } .wf-tdd     .wf-marker { background: #c07820; }
.wf-review  { border-color: #b8d8b8; } .wf-review  .wf-marker { background: #3a8f3a; }
.wf-finish  { border-color: #d8c8ff; } .wf-finish  .wf-marker { background: #7b5ea7; }
</style>

除上述 7 步流水线外，以下技能作为**始终在线的质量守卫**，在特定场景自动介入：

| 守卫 | 触发时机 | 作用 |
|------|----------|------|
| `verification-before-completion` | 任何宣称"完成"之前 | 强制五步验证：确定验证命令 → 完整运行 → 阅读输出和退出码 → 确认证据是否支撑声明 → 确认后才允许声明 |
| `systematic-debugging` | "修这个 bug"、异常行为 | 四阶段：观察症状 → 形成假设 → 验证假设 → 精准修复。禁止猜测性修改 |
| `receiving-code-review` | 收到审查反馈时 | 结构化处理每条意见，逐条修复并验证，不敷衍不跳过 |

**你只需要做三件事**：设计阶段回答追问 → 审查阶段确认修复 → 交付阶段选择收尾方式。其余环节 Superpowers 自动流转。

### 2.5 实战演练：用 Superpowers 开发 TodoList

以下是一次真实的 Superpowers 会话记录。项目从空目录 `/Users/wenqiu/AIAgent/superpowers_in_action/` 启动，用户只说了一句话，Superpowers 自动接管全部流程。

**当前进度总览**：

| 阶段 | 技能 | 状态 | 产出物 | Git |
|------|------|------|--------|-----|
| 调度器 | `using-superpowers` | ✅ 完成 | — | — |
| 1-设计 | `brainstorming` | ✅ 完成 | `docs/superpowers/specs/2026-05-24-todolist-design.md` | ❌ |
| 2-环境 | `using-git-worktrees` | ⏭️ 跳过 | — | — |
| 3-规划 | `writing-plans` | ✅ 完成 | `docs/superpowers/plans/2026-05-24-todolist.md`（19 任务） | ❌ |
| 4-执行 | `subagent-driven-development` | ✅ 完成 | 19/19 任务全部完成 | ✅ 15 次 commit |
| 5-TDD | `test-driven-development` | ✅ 完成 | Rust 24 + 前端 7 = 31 测试通过 | ✅ 每任务先测后写 |
| 6-审查 | `requesting-code-review` | ⏭️ 被覆盖 | 子代理内置 spec+code 双审查替代 | 任务内完成 |
| 7-交付 | `finishing-a-development-branch` | ✅ 完成 | README `.dmg` 构建、分支→master | ✅ 收尾 commit |
| Bug修复 | `systematic-debugging` | ✅ 6 轮触发 | 14 项迭代优化 + 优化文档 | ✅ 每轮提交 |
| 验证 | `verification-before-completion` | ✅ 多次触发 | 每次宣称完成前检查 | ✅ |
| **Git 汇总** | — | — | — | **✅ 22+ 次 commit，中文描述** |

> **状态说明**：✅ 已完成 | ⏭️ 被覆盖/跳过 | ⏳ 未触发
> 
> **Git 说明**：任务 1 初始化 git，19 个任务 + 6 轮 bug 修复 + 收尾 = 22+ 次 commit。从阶段 1-3 的缺席者变成贯穿始终的安全网。


#### 阶段 0：调度器 using-superpowers

会话开始时，`SessionStart` Hook 注入 `using-superpowers` 技能内容到系统提示词。这不是一个可选项——它持续监控 Claude 的行为，只要检测到 1% 的可能性匹配某个技能，就强制触发。用户看不到这个过程，但它已经就位。


#### 阶段 1：brainstorming — 设计阶段

**触发**：用户说"我想开发一个 TodoList 应用" → `using-superpowers` 检测到创造性工作 → 自动调用 `brainstorming`

**brainstorming 的 9 步 Checklist**（Skill 内置，创建为 TodoWrite 任务逐项推进）：

```
☑ Explore project context      → 空目录，全新项目
☑ Offer visual companion       → 用户接受，启动浏览器可视化
☑ Ask clarifying questions     → 5 个问题逐一确认
☑ Propose 2-3 approaches       → 方案 A（薄后端）vs 方案 B（分层架构）
☑ Present design sections      → 4 节：数据模型 → 组件架构 → UI 布局 → 错误/测试/结构
☑ Write design doc             → 写入 specs/ 目录
☑ Spec self-review             → 发现 1 处歧义，当场修正
☑ User reviews written spec    → 用户确认
☑ Transition to implementation → 终端状态：调用 writing-plans
```

**`<HARD-GATE>`**：brainstorming 加载时就声明了硬门槛——设计批准前，禁止写任何代码、禁止调用任何实现 Skill。即使是"简单的 TodoList"也必须走完流程。

**逐项追问（一问一答，每次只问一个问题）**：

| # | Claude 问 | 用户答 |
|---|-----------|--------|
| 1 | 平台？Web / 移动端 / CLI / 桌面 | 桌面应用 |
| 2 | 技术栈？Electron / Tauri / Python+GUI / 你推荐 | Tauri |
| 3 | 功能范围？基础版 / 进阶版 / 完整版 | 完整版 |
| 4 | 数据持久化？SQLite / JSON / 你推荐 | SQLite |
| 5 | 前端框架？React / Vue / Svelte / 你推荐 | 你推荐 → React+TS |

**Visual Companion 实战**：用户接受了浏览器可视化伴侣。Claude 启动本地服务器，在 `http://localhost:58613` 展示交互式设计选项。期间服务器挂掉了一次——用户反馈"无法访问"，Claude 检查状态、重启服务器、恢复内容到新端口 `http://localhost:50776`。后续的方案对比卡片、数据模型 ER 图、组件树结构图、布局线框图都在浏览器中展示。

**方案对比**：浏览器中展示了两种架构方案的交互式对比卡片——方案 A（薄后端，Rust 只做数据直通）vs 方案 B（分层架构，Rust Service → Repository → SQLite）。用户点击选择方案 B。

**逐节呈现设计，每节等待确认**：

1. **数据模型**（浏览器 ER 图）→ 4 张表：`projects`、`tasks`、`tags`、`task_tags` → 用户确认
2. **组件架构**（浏览器组件树 + Rust 三层结构）→ 前端 `App → Sidebar/TaskView/Toolbar`，后端 `commands → services → repositories` → 用户确认
3. **UI 布局**（浏览器线框图）→ 方案 A（右侧详情面板，三栏一览无余）vs 方案 B（弹窗编辑，两栏更简洁）→ 用户选 A，适合 macOS 桌面宽屏
4. **错误处理 + 测试策略 + 文件结构**（终端文本）→ 用户确认

**用户的三次纠正**：

| 纠正 | 用户反馈 | 结果 |
|------|----------|------|
| 目录命名 | "`src` 应该调整为 `src-ui` 更清晰" | `src/` → `src-ui/`（React 前端），`src-tauri/`（Rust 后端） |
| 多余子目录 | "为何要创建 `superpowers_todo/`？当前目录就是项目目录" | 取消子目录，一切资源在 `superpowers_in_action/` 下 |
| Git 位置 | "后面还会初始化 git 吧，在哪个目录？" | 确认在项目根目录初始化，`.superpowers/` 加入 `.gitignore` |

**产出物**：`docs/superpowers/specs/2026-05-24-todolist-design.md`

**自审修正**：Claude 对设计文档做自审，发现一处歧义——数据库驱动写法 "rusqlite/sqlx" 模糊，修正为明确的 "rusqlite"。

**Git 提交**：❌ 尚未初始化 git（brainstorming 阶段不强制 git，用户也未要求立即初始化）

**终端状态**：brainstorming 的唯一合法出口是调用 `writing-plans`。不允许调用任何其他实现 Skill。


#### 阶段 2：using-git-worktrees — 环境隔离

⏭️ **跳过**。该技能在检测到需要隔离环境时触发，但当前项目是空目录，没有需要隔离的既有代码，且实现尚未开始。brainstorming 和 writing-plans 不需要 worktree 隔离——worktree 是为执行阶段准备的。


#### 阶段 3：writing-plans — 规划阶段

**触发**：brainstorming 终端状态自动调用，加载 writing-plans 技能

**流程**：
1. 再次读取设计文档 `2026-05-24-todolist-design.md`
2. 列出文件地图——哪些文件新建、各自职责
3. 按 2-5 分钟粒度的原子任务拆解，每个任务包含：文件路径 + 完整代码骨架 + TDD 步骤 + 验证命令
4. 计划自审——检查是否覆盖所有 spec 需求、无占位符、类型前后一致
5. 保存到 `docs/superpowers/plans/2026-05-24-todolist.md`

**19 个原子任务**：

| # | 任务 | 产出 |
|---|------|------|
| 1 | 项目初始化（Tauri + React + TypeScript） | 项目骨架 + 依赖安装 |
| 2 | Rust 数据模型 + 错误类型 + 数据库初始化 | `models.rs`, `error.rs`, `db.rs` |
| 3 | SQLite 迁移脚本（4 张表） | `migrations/` |
| 4-6 | 三层 Repository（task / project / tag） | 含 TDD 测试 |
| 7-9 | 三层 Service（task / project / tag） | 业务逻辑 + 测试 |
| 10 | 导出/导入 Service | CSV/JSON 格式，含测试 |
| 11-14 | Tauri Commands（task / project / tag / export） | 前端 invoke 接口 |
| 15 | React 类型定义 + Zustand stores | `src-ui/types/`, `src-ui/stores/` |
| 16 | 基础 UI 组件（Sidebar / SearchBar / Toolbar） | `src-ui/components/` |
| 17 | 核心组件（TaskList / TaskItem / TaskEditor） | 含拖拽排序 |
| 18 | App 根组件 + 深色模式 + 样式 | `App.tsx`, 主题切换 |
| 19 | 最终验证 | 全量测试 + 手动验收清单 |

**产出物**：`docs/superpowers/plans/2026-05-24-todolist.md`

**Git 提交**：❌ 尚未初始化 git

**完成后的交互**：Claude 给出两种执行方式选择——Subagent-Driven（推荐，每任务独立子代理）或 Inline Execution（当前会话逐步执行）。

用户在执行前提出了两个要求——文档中文化 + 中文优先偏好写入用户级 memory——然后选择了 Subagent-Driven。


#### 阶段 4：subagent-driven-development — 执行阶段

**触发**：用户选择 "Subagent-Driven" → Claude 加载 `subagent-driven-development` 技能

**子代理执行流程**（每个任务重复）：
```
派发实现子代理 → 实现+测试+提交+自审
→ 派发 spec 审查子代理 → 发现偏差立即修复
→ 派发代码质量审查子代理 → 发现优化点立即修复
→ 标记任务完成 → 自动推进下一个任务
```

**核心纪律**：子代理驱动的 skill 明确要求"不在任务间暂停询问用户"，只有遇到无法解决的 BLOCKED 或所有任务完成时才停止。实际执行严格遵守了这一纪律——任务 2 遇到障碍时暂停了一次，其余 18 个任务全自动流转。

---

**19 个任务执行实录**：

**后端阶段（任务 1-9）**：

| # | 任务 | 状态 | 测试 | 备注 |
|---|------|------|------|------|
| 1 | Vite + React + TS 项目骨架 | ✅ | — | `git init`，spec 审查发现 2 处遗漏 |
| 2 | Tauri 2.x | ✅ | — | 用户暂停确认依赖 → 安装 Rust → 编译 3 次修复（配置/权限/图标） |
| 3 | Tailwind CSS + 依赖 | ✅ | — | 顺利 |
| 4 | Rust 数据模型 + 错误类型 | ✅ | 4 | TDD 正式触发 |
| 5 | SQLite 数据库 + 迁移 | ✅ | 5 | — |
| 6 | 项目/标签仓库层 | ✅ | 11 | — |
| 7 | 任务仓库层（CRUD+排序+搜索） | ✅ | 17 | — |
| 8 | Rust 服务层（验证+导出/导入） | ✅ | 24 | — |
| 9 | Tauri Commands + 后端对接 | ✅ | — | Rust 后端全部完成，编译通过 |

**前端阶段（任务 10-18）**：

| # | 任务 | 状态 | 测试 | 备注 |
|---|------|------|------|------|
| 10 | TypeScript 类型定义 | ✅ | — | 主会话直接执行（非子代理） |
| 11 | Zustand 状态管理 | ✅ | — | 三个 store（task/project/ui） |
| 12 | App 三栏布局 + 错误提示 | ✅ | — | — |
| 13 | 侧边栏（项目列表+标签） | ✅ | — | — |
| 14 | 任务列表 + 任务卡片 + 搜索栏 | ✅ | — | — |
| 15 | 任务详情编辑器 + 工具栏 | ✅ | — | — |
| 16 | dnd-kit 拖拽排序 | ✅ | — | — |
| 17 | 深色模式 + App 接线 | ✅ | — | — |
| 18 | 前端组件测试 | ✅ | 7 | — |

**前端阶段速度明显快于后端**：没有 spec/code-quality 审查的额外步骤，子代理完成实现即推进。

---

**最终验证（任务 19）**：

| 验证项 | 结果 |
|---|---|
| Rust 测试 (`cargo test`) | ✅ 24 通过 |
| 前端测试 (`vitest`) | ✅ 7 通过 |
| TypeScript (`tsc`) | ✅ 无错误 |
| Tauri (`cargo check`) | ✅ 编译通过 |

**15 次 commit 记录**（全部中文描述）：

```
7466490 test: 添加 TaskItem 和 TaskList 前端组件测试
2295f5a feat: 添加深色模式、Toolbar 集成及最终接线
0430a69 feat: 添加 dnd-kit 拖拽排序功能
8bc79f3 feat: 添加任务详情编辑器和导入导出工具栏
8d9cadd feat: 添加任务列表、任务卡片、搜索栏及主视图组件
67a6682 feat: 添加侧边栏及项目列表和标签管理组件
3b81e44 feat: 添加 App 三栏布局框架和错误提示组件
b363a20 feat: 添加 Zustand 状态管理（任务、项目、UI）
bca50e6 feat: 添加前端 TypeScript 类型定义
4043410 feat: 添加 Tauri 命令并完成 Rust 后端对接
c128816 feat: 添加 Rust 服务层（验证、导出/导入逻辑）
4ed7656 feat: 添加任务仓库层（CRUD、排序、搜索）
da5dea7 feat: 添加项目和标签仓库层（含测试）
9d64fb5 feat: 添加 SQLite 数据库初始化和迁移
49c6c4a feat: 添加 Rust 数据模型和错误类型（含测试）
```

**产出物**：完整的 Tauri 桌面 TodoList 应用，可运行 `npx tauri dev` 启动。


#### 阶段 5：test-driven-development — 已完成

从任务 4 开始，子代理在每个任务内自动走 TDD 流程——先写失败测试，再写最小实现，确认通过后提交。最终产出 **31 个测试**（Rust 24 + 前端 7）。从阶段 1 的"零代码"到阶段 5 的"31 个测试全部通过"，Superpowers 的 7 阶段闭环完成了从模糊想法到可运行软件的完整转换。

---


#### 阶段 6：requesting-code-review — 被覆盖

在 `subagent-driven-development` 模式下，每个任务内部已包含 spec 审查 + 代码质量审查两个子代理。这和 `requesting-code-review` 的功能重叠——子代理的逐任务双审查实际上是更细粒度的代码审查。因此独立的 `requesting-code-review` 未单独触发。


#### 阶段 7：finishing-a-development-branch — 已完成

用户说"可以完成"后，`finishing-a-development-branch` 自动触发。流程：

1. **验证测试**：Rust 24 + 前端 7 全部通过
2. **检测环境**：确认在 `main` 分支，工作树干净
3. **用户追加 4 项收尾任务**：
   - 编写 README.md（项目介绍、技术栈、启动方式、发布方式）
   - 构建 macOS 应用（`npx tauri build` → `超级待办_0.1.0_aarch64.dmg`，3.9MB）
   - 分支改名 `main` → `master`
   - 确认后续开发使用 git worktree 隔离

**收尾产出物**：
- `README.md`：项目介绍 + 环境依赖 + 启动/构建/发布说明
- `超级待办_0.1.0_aarch64.dmg`：macOS 可安装应用包
- 分支：`master`（主分支）
- 优化记录文档：`2026-05-24-todolist-optimizations.md`


#### Bug 修复轮次：systematic-debugging

19 个任务完成后，用户启动应用测试，发现了多轮问题。每轮都走了 `systematic-debugging` 的四阶段流程。详见 [2.6 节](#_2-6-bug修复流程-systematic-debugging-实战)。

| 轮次 | 用户发现 | 修复数量 | system-debug 阶段 |
|------|----------|----------|-------------------|
| 1 | 标签颜色、图标、标签分配、面板拖拽 | 4 项 | 观察→分析→修复→验证 |
| 2 | 拖拽仍不工作 | 1 项（useRef→useState） | 观察→定位→修复→验证 |
| 3 | 多项目/日期/提醒 | 1 项 + Plan 模式设计提醒 | 观察→规划→实现→验证 |
| 4 | 任务移动/复制、项目删除警告 | 2 项（Plan→实现） | Plan→观察→实现→验证 |
| 5 | 提醒反复通知、列表样式 | 2 项（antd 重写） | 观察→分析→实现→验证 |
| 6 | 自然排序 vs 拖拽冲突、缺创建排序 | 2 项 | 观察→定位→修复→验证 |

6 轮共 14 项优化（详见 2.6 节），每轮独立 commit。


#### verification-before-completion — 已完成

每次宣称"完成"前自动检查：运行测试 → 读取输出 → 确认全部通过 → 才声明完成。19 个任务结束时触发一次，6 轮 bug 修复每轮结束时触发一次，收尾阶段触发最后一次。这是 Superpowers "证据先于断言"哲学的最终防线。


#### receiving-code-review — 未触发

本次会话未收到外部代码审查反馈，该守卫未触发。


#### 这个真实案例的几个看点

1. **7 阶段完整闭环**。从"我想开发一个 TodoList"到 `.dmg` 安装包产出的完整链路：brainstorming → writing-plans → subagent-driven → TDD → systematic-debugging → finishing-a-development-branch。只有 `using-git-worktrees`（空项目跳过）和 `requesting-code-review`（子代理内置审查替代）未独立触发。

2. **慢设计，快执行**。前 1.5 小时只有设计讨论和文档（零代码），之后子代理连续执行 19 个任务 + 6 轮修复，一气呵成。Superpowers 的节奏不是"慢"，而是把思考集中在执行前。

3. **git 贯穿始终**。阶段 1-3 无 git（纯文档不需要），任务 1 初始化后，22+ 次 commit 形成可追溯的版本历史。每个原子变更独立提交——这就是 `subagent-driven-development` 能放心让子代理自主执行的安全基础。

4. **bug 修复不经过 brainstorming**。用户直接描述症状，Claude 直接进入"观察→分析→修复→验证"循环。这与功能开发走不同路径——[2.6 节](#_2-6-bug修复流程-systematic-debugging-实战)有详细对比。

5. **用户只做了最小决策**。整个 4 小时会话中，用户真正做的事：回答 5 个追问 → 确认 4 节设计 → 纠正 3 个命名细节 → 安装 Rust → 测试应用并反馈 6 轮 → 选择收尾方案。其余全部由 Superpowers 自动流转。

---

### 2.6 Bug 修复流程：`systematic-debugging` 实战

Superpowers 的 Bug 修复走**完全不同于功能开发**的路径。功能开发从 `brainstorming` 开始走 7 步流水线，Bug 修复则直接进入 `systematic-debugging` 的四阶段流程。

**对照官方文档**（[github.com/obra/superpowers](https://github.com/obra/superpowers)）：

- `systematic-debugging` 是 Superpowers 调试类技能，定义"4 阶段根因分析流程"，包含三个核心技术：`root-cause-tracing`（根因追踪）、`defense-in-depth`（纵深防御）、`condition-based-waiting`（条件等待）
- `verification-before-completion` 是调试类辅助技能，确保"问题确实已修复"，要求运行验证命令并确认输出后才能声明完成
- 两个技能配合形成调试闭环：systematic-debugging 负责找到并修复根因，verification-before-completion 负责确认修复有效

#### Bug 修复 vs 功能开发路径对比

| | 功能开发 | Bug 修复 |
|---|---|---|
| 入口 | 自然语言 "帮我做 X" | 用户报告症状 "X 不工作/有问题" |
| 触发技能 | `brainstorming` → `writing-plans` → ... | `systematic-debugging` 直接接管 |
| 设计阶段 | ✅ 必须，brainstorming 强制 | ❌ 跳过，直接进入分析 |
| 规划阶段 | ✅ writing-plans 生成任务清单 | ❌ 跳过，即时修复 |
| 执行方式 | 子代理逐任务 + 双审查 | 主会话直接修改 |
| git 提交 | 每任务独立 commit | 每轮修复独立 commit |
| 验证 | verification-before-completion | verification-before-completion |


#### 2.6.1 四阶段调试流程

`systematic-debugging` 定义了严格的四阶段流程（对照官方文档的 `root-cause-tracing`）：

| 阶段 | 名称 | 含义 | 禁止行为 |
|------|------|------|----------|
| 1 | **观察症状** | 精确描述问题现象，复现问题 | 禁止猜测原因 |
| 2 | **形成假设** | 提出可验证的根因假设 | 禁止跳过验证直接改代码 |
| 3 | **验证假设** | 用证据确认或推翻假设 | 禁止"改了试试看" |
| 4 | **精准修复** | 最小改动修复根因 + 回归测试 | 禁止夹带无关改动 |


#### 2.6.2 真实案例：6 轮修复实录

以下来自 2.5 节 TodoList 项目 19 个任务完成后的 6 轮真实 bug 修复，展示了 `systematic-debugging` 四阶段在实践中的完整运作。

**第 1 轮：4 项问题同时发现**

```
USER: 看到了，也测试了，发现几个小问题
      1- 标签颜色默认随机，想自由选择
      2- 应用没有图标
      3- 标签分配不是一直好用
      4- 面板屏占比应该可以手动拖动
```

Claude **没有**走 brainstorming。`systematic-debugging` 直接接管：

| 阶段 | 行动 |
|------|------|
| **观察** | 读取 TagManager.tsx、TaskEditor.tsx、App.tsx 三个文件，确认当前实现 |
| **分析** | 问题 3 定位为 `onBlur={handleSave}` 在 `onClick` 之后触发时读到旧 state 的竞态问题 |
| **修复** | 4 项逐一修复：① 15 色 Tailwind 色板选择器 ② 紫色 "T" 字图标 ③ 移除 onBlur 竞态 ④ 可拖拽分隔条 |
| **验证** | TypeScript 编译通过 → commit → 用户测试 |

---

**第 2 轮：面板拖拽仍不可用**

```
USER: 鼠标悬浮时确实看到能拖动，但实际上无法拖动
```

| 阶段 | 行动 |
|------|------|
| **观察** | 重新读取 App.tsx，发现拖拽用 `useRef` 追踪状态，事件处理器闭包不同步 |
| **分析** | `useRef` 的 `.current` 在事件绑定时已固化，后续 render 不会更新处理器内的闭包值 |
| **修复** | 改用 `useState` 驱动拖拽状态，`useEffect` 依赖 `[dragging]` |
| **验证** | TypeScript 编译通过 → commit → 用户确认拖拽正常 |

**关键点**：第 1 轮修复的代码质量不够——用错了 React 状态管理模式。这就是 `systematic-debugging` 强调的：修复必须是"最小改动修复根因"，不能只是"看起来能用"。第一次用了 `useRef`（看起来能用），第二次才追溯到闭包不同步的根因。

---

**第 3 轮：多项目 + 日期 + 提醒规划**

```
USER: 多个"默认项目"是不是有问题？
      截止日期风格不好看，应该可以设时间
      能否增加截止日期提醒？
```

这轮特殊——前两个是 bug，第三个是**新功能需求**。Claude 的处理方式：前两个直接修，第三个触发 `EnterPlanMode` 做方案设计：

| 阶段 | 行动 |
|------|------|
| **观察** | 项目名改为"超级待办"；日期从 date→datetime；提醒需设计 |
| **分析** | 提醒功能三个方案：A 应用内 Badge / B Web Notification / C Tauri 原生通知 |
| **修复** | ① 项目改名 + 测试更新 ② antd DatePicker 改为 showTime ③ 用户选择 A+C 组合方案后实现 |
| **验证** | Rust 24 测试通过 + TypeScript 编译 → commit |

---

**第 4 轮：Plan 模式下的任务管理增强**

```
USER: 任务能否跨项目移动？删除项目时能否警告？
```

| 阶段 | 行动 |
|------|------|
| **分析** | 两项功能——移动/复制涉及 Rust 命令 + 前端 UI；删除警告需要展示任务数 |
| **修复** | 新增 `move_task`、`copy_task` 命令 + TaskEditor 移动区域 + ProjectList 删除确认弹窗 |
| **验证** | Rust 24 + 前端 7 测试通过 → commit |

---

**第 5 轮：提醒打磨 + 列表重写**

```
USER: 提醒会反复弹，且无法标记已知晓
      第 2 面板用 antd 重写，增加排序
```

| 阶段 | 行动 |
|------|------|
| **观察** | ReminderBadge 组件 `return null` 时完全隐藏（用户看不到功能）；`notifiedIds` ref 追踪不足导致反复弹 |
| **分析** | 提醒问题——无"已知晓"机制；列表问题——原生控件不如 antd 统一 |
| **修复** | ① `notifiedIds` ref 记忆已通知任务 + "忽略"按钮关闭提醒 ② antd Checkbox/Tag/Input/Segmented 重写 TaskList ③ 增加排序切换 |
| **验证** | 前端 7 测试全部更新适配 antd → commit |

---

**第 6 轮：排序逻辑冲突**

```
USER: 自然排序和拖拽是不是冲突？无法拖动了
      缺创建时间排序
```

| 阶段 | 行动 |
|------|------|
| **观察+分析** | "自然"排序下 `useMemo` 按 `sort_order` 重新排序，与拖拽冲突——拖拽后前端的 `sort_order` 还没更新，导致拖不动 |
| **修复** | ① 自然排序下取消额外排序，直接保持 store 顺序 ② 增加"创建时间"排序选项 |
| **验证** | TypeScript 编译 → commit → 用户确认拖拽正常 |


#### 2.6.3 bug 修复中的 TDD

`test-driven-development` 在 bug 修复中也保持活跃。每次修改 Rust 代码后自动运行 `cargo test`，修改前端后运行 `vitest`。例如第 3 轮中将项目名从"默认项目"改为"超级待办"时，Rust 测试失败——测试还在查旧名字——立即更新测试后 24 全部通过。这是 TDD 的"修改后必须重跑全部测试"原则在 bug 修复中的体现。


#### 2.6.4 关键观察

1. **Bug 修复不经过 brainstorming**。用户直接描述症状，Claude 直接进入四阶段调试。这与功能开发的 7 步流水线完全不同。

2. **"修复→验证→提交"是每个 bug 的标准循环**。6 轮修复，每轮都独立 commit，没有一个 commit 夹带多个不相关改动。这就是 git 原子提交原则在调试中的实际应用。

3. **新功能需求混入 bug 修复时，EnterPlanMode 介入**。第 3 轮的提醒功能是需求不是 bug——Claude 识别到后从 `systematic-debugging` 切换到 Plan 模式做方案设计，选型确认后再实现。这就是 `systematic-debugging` 和 `brainstorming` 的衔接点。

4. **verification-before-completion 是最后防线**。每次修完，Claude 都先跑测试再声明完成。没有一次是"应该可以了"就结束的——输出必须看到 `24 passed` 或 `tsc 无错误` 才说完成。

5. **与官方文档的 `defense-in-depth`（纵深防御）对应**：每轮修复不只是修当前问题，还会检查是否引入新问题（运行全部测试而非只运行相关测试）。第 5 轮更新 antd 后所有 7 个前端测试都重新验证，不只是在改动的组件上跑测试。

## 3 OpenSpec 实战 — Spec 驱动开发

OpenSpec 是 Fission AI 出品的 Spec-Driven Development（SDD）框架，49k+ Stars。核心理念：**先对齐 spec，再写代码**——人类和 AI 在写任何代码之前，就通过结构化 spec 文件达成共识。

**两种模式：Core vs Custom**：

OpenSpec 有两级配置——全局配置（`~/.config/openspec/config.json`）和项目配置（`openspec/config.yaml`）。全局配置中的 `profile` 字段决定你能用哪些命令：

| 模式 | 命令数 | 包含的命令 | 适用场景 |
|------|--------|-----------|----------|
| **Core**（默认） | 5 个 | `propose`、`explore`、`apply`、`sync`、`archive` | 日常快速迭代，90% 场景够用 |
| **Custom** | 11 个 | Core 的 5 个 + `new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard` | 复杂功能、需要逐步控制每个阶段 |

**模式管理命令**：

```bash
# 查看当前配置（全局 + 项目）
openspec config list

# 交互式选择 profile 和 workflows（推荐）
openspec config profile
# → 选择 core（5 个核心命令）或 custom（自选 11 个中的任意组合）

# 将配置同步到项目（每次改完 profile 都要执行）
openspec update

# 也可以直接 set
openspec config set profile core
openspec config set profile custom
```

**安装**（需要 Node.js ≥ 20.19.0）：

```bash
npm install -g @fission-ai/openspec@latest
cd your-project && openspec init --tools claude
```

`openspec init` 做了三件事：创建 `openspec/` 目录结构、生成 AI 工具的 slash command 文件、初始化项目配置。支持 25+ AI 工具（Claude Code、Cursor、Windsurf、Copilot 等），不同工具的 command 语法略有差异（如 CC 用 `/opsx:propose`，Cursor 用 `/opsx-propose`）。

**完整命令清单**：

| 命令 | 所属 | 核心度 | 用途 |
|------|------|--------|------|
| `/opsx:explore [topic]` | Core | ★★★★ | 思考探索阶段：调查代码库、对比方案、评估风险，**纯只读**，不写代码 |
| `/opsx:propose <idea>` | Core | ★★★★★ | 一键创建 change + 所有规划产物（proposal + specs + design + tasks） |
| `/opsx:apply` | Core | ★★★★★ | 按 tasks.md 逐项实现，写代码、跑测试、勾选 checkbox |
| `/opsx:sync` | Core | ★★★ | 将 delta spec 合并到主 spec（长期变更的中途检查点） |
| `/opsx:archive` | Core | ★★★★ | 归档变更：合并 spec → 移动到 `archive/YYYY-MM-DD-<name>/` |
| `/opsx:new` | Custom | ★★★ | 创建空 change 目录 + `.openspec.yaml` 元数据（不生成产物） |
| `/opsx:continue` | Custom | ★★ | 按依赖图逐个创建产物（propose 一键已覆盖此流程） |
| `/opsx:ff` | Custom | ★★★ | 快速推进：一键创建所有剩余产物 |
| `/opsx:verify` | Custom | ★★★ | 三维度验证：完整性（Completeness）、正确性（Correctness）、一致性（Coherence） |
| `/opsx:bulk-archive` | Custom | ★★ | 批量归档多个 change，自动检测和解决 spec 冲突 |
| `/opsx:onboard` | Custom | ★ | 交互式新手引导，用你的实际代码库走完整流程（一次性使用） |

**评星维度：命令核心度**——缺了该命令，spec→代码→归档闭环是否还能跑通。同时综合考量命令的打磨成熟度。

**💡 按星筛选使用**：★★★★★ 是闭环支柱（`propose` 起点 + `apply` 执行），日常必用。★★★★ 是高频补充（`explore` 需求模糊时、`archive` 收尾时）。★★★ 以下按需启用。OpenSpec 通过 `npm install -g @fission-ai/openspec@latest && openspec init` 整套安装，不支持单命令安装。

**核心工作流**：

```text
# Core 默认快速路径（5 步）
/opsx:explore                   → 可选：需求不明确时先探索
/opsx:propose add-dark-mode     → 生成 proposal + specs + design + tasks
/opsx:apply                     → 按 tasks.md 逐项实现
/opsx:sync                      → 可选：长期变更中途合并 spec
/opsx:archive                   → 归档到 archive/，更新主 specs

# Custom 展开路径（逐阶段控制）
/opsx:new                       → 创建空 change 目录
/opsx:continue × N              → 逐个创建产物，步步审查
/opsx:apply                     → 逐项实现
/opsx:verify                    → 验证实现与 spec 的一致性
/opsx:archive                   → 归档

# Custom 快速路径（等同于 propose 但分开两步）
/opsx:new → /opsx:ff → /opsx:apply → /opsx:archive
```

**产生的文件结构**：

```
openspec/
├── specs/                    ← 主 spec 库（系统的"真相源"）
│   └── <domain>/
│       └── spec.md           ← 当前系统的行为规格
├── changes/                  ← 变更区（每个 change 一个文件夹）
│   └── <change-name>/
│       ├── .openspec.yaml    ← 变更元数据（schema、创建日期）
│       ├── proposal.md       ← 为什么做、做什么变更
│       ├── specs/            ← Delta spec（相对于主 spec 的增量）
│       │   └── <domain>/
│       │       └── spec.md
│       ├── design.md         ← 技术方案
│       └── tasks.md          ← 实现清单（checkbox 驱动）
├── changes/archive/          ← 归档区（按日期组织，保留审计历史）
│   └── YYYY-MM-DD-<name>/
└── config.yaml               ← 项目配置（可选）
```

**Delta Spec 机制**——OpenSpec 的核心概念。每次功能变更不直接修改主 spec，而是写一份"变更单"（Delta Spec），用三个区段标记改动内容：

```markdown
# Delta for Auth  ← 这次改的是认证模块

## ADDED Requirements     ← 新增了什么
### Requirement: Two-Factor Authentication
系统 MUST 在登录时要求第二因素验证。
#### Scenario: OTP 验证
- GIVEN 用户已开启 2FA
- WHEN 用户提交正确的凭据
- THEN 弹出 OTP 验证页面

## MODIFIED Requirements   ← 改了什么（原来的值附在后面）
### Requirement: Session Timeout
系统 SHALL 在 30 分钟无操作后过期会话。（原值：60 分钟）

## REMOVED Requirements    ← 删了什么（附带删除原因）
### Requirement: Remember Me
（因引入 2FA 而废弃）
```

一言蔽之：**Delta Spec = 规格的 git diff**。只写变化量，不重写全文。

归档时自动合并：ADDED 追加入主 spec → MODIFIED 替换对应条目 → REMOVED 从主 spec 删除。非破坏性合并，每次改动都有迹可循。

**实战演示：用 explore 探索 + propose 实施**：

```text
# 场景：做一个用户权限系统，但需求还不明确
You: /opsx:explore 用户权限系统

AI:  让我先看看你现有的代码库...
     [分析 src/ 目录结构、现有认证模块]

     目前你用的是简单的 role 字段（admin/user），扩展性有限。
     三种主流方案：

     1. RBAC（角色-权限-用户三层）— 最通用，生态成熟
     2. ABAC（属性基）— 更灵活但复杂度高，适合细粒度控制
     3. ReBAC（关系基）— 适合有层级关系的资源（如 Google Drive）

     你的场景是 B2B SaaS，多租户 + 角色分明 → 推荐 RBAC。

     需要我基于 RBAC 方案创建 change 吗？

You: 好，用 RBAC

You: /opsx:propose add-rbac-permission-system
AI:  Created openspec/changes/add-rbac-permission-system/
     ✓ proposal.md — 引入 RBAC 模型，支持角色-权限-用户三层
     ✓ specs/      — 6 个场景：管理员赋权、角色继承、权限检查、越权拒绝...
     ✓ design.md   — 中间件拦截 → PermissionService → RoleResolver 链
     ✓ tasks.md    — 12 个任务，从数据模型到集成测试

You: 审阅 proposal.md 和 design.md，发现角色继承层级太深，
     改为最多 2 层继承。更新后：

You: /opsx:apply
AI:  1.1 Role 和 Permission 数据模型 ✓
     1.2 RoleResolver 服务 ✓
     1.3 PermissionMiddleware ✓
     ...逐一完成 12 个任务...
     所有任务完成！

You: /opsx:archive
AI:  Archived. Specs updated. 下一个功能。
```

## 4 gstack 实战 — 一人成军

gstack 是 Y Combinator CEO Garry Tan 的开源作品，99k+ Stars，MIT 许可。它把 Claude Code 变成一个虚拟的 23 人工程团队——从 CEO 到 QA，每个人都能独立履职。

**Garry Tan 的真实数据**：用 gstack 在 2026 年前 4 个月产出了 **240 倍于 2013 年全年** 的逻辑代码量，同时管理 YC 全职工作。Andrej Karpathy 在 No Priors 播客中说："I don't think I've typed a line of code since December."

**安装**（30 秒）：

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git \
  ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

**团队共享模式（推荐）**：

```bash
(cd ~/.claude/skills/gstack && ./setup --team) && \
  ~/.claude/skills/gstack/bin/gstack-team-init required && \
  git add .claude/ CLAUDE.md && git commit -m "require gstack for AI-assisted work"
```

**23 个角色全览**：

| 阶段 | 命令 | 独立价值 | 角色 | 核心能力 |
|------|------|--------|------|----------|
| **思考** | `/office-hours` | ★★★★★ | YC Office Hours | 6 个强迫问题重构产品方向，追问痛点而非功能需求 |
| **思考** | `/plan-ceo-review` | ★★★★ | CEO / Founder | 4 种模式（扩展/选择性扩展/保持范围/缩减），挑战前提假设 |
| **规划** | `/plan-eng-review` | ★★★★ | Eng Manager | 架构设计、数据流、边缘案例、测试矩阵、安全顾虑 |
| **规划** | `/plan-design-review` | ★★★ | Senior Designer | 0-10 评分每个设计维度，AI Slop 检测，交互式逐项确认 |
| **规划** | `/plan-devex-review` | ★★★ | DX Lead | 开发者体验审查，20-45 个强迫问题，竞品基准对比 |
| **规划** | `/design-consultation` | ★★★ | Design Partner | 从零构建设计系统：字体/颜色/间距/动效，生成预览页 |
| **设计** | `/design-shotgun` | ★★★ | Design Explorer | 生成 4-6 套设计方案，浏览器对比板收集反馈，记住偏好 |
| **设计** | `/design-html` | ★★★ | Design Engineer | 将 mockup 转为生产级 HTML/CSS，30KB 零依赖 |
| **构建** | `/autoplan` | ★★★★ | Auto Reviewer | 一键运行 CEO + Design + Eng + DX 审查，自动决策 |
| **审查** | `/review` | ★★★★★ | Staff Engineer | 预落地 PR 审查：SQL 安全、LLM 信任边界、条件性副作用 |
| **审查** | `/codex` | ★★★★ | Codex CLI | 独立 diff 审查 + 对抗性挑战模式，200 IQ 的第二意见 |
| **调试** | `/investigate` | ★★★★★ | Debugger | 结构化根因分析：观察→分析→假设→修复，Iron Law：无限修复 |
| **设计 QA** | `/design-review` | ★★★ | Designer Who Codes | 视觉审计 + 迭代修复，原子提交 + before/after 截图 |
| **DX QA** | `/devex-review` | ★★★ | DX Tester | 实际测试开发者体验：计时 TTHW、截屏错误、对比计划 vs 现实 |
| **测试** | `/qa` | ★★★★★ | QA Lead | 系统化 QA → 发现 bug → 原子化修复 → 重验证 |
| **测试** | `/qa-only` | ★★ | QA Reporter | 纯报告模式，不改代码，`/qa` 已覆盖其核心价值 |
| **安全** | `/cso` | ★★★★ | CSO | OWASP Top 10 + STRIDE 威胁建模，17 个误报排除，8/10+ 置信度 |
| **交付** | `/ship` | ★★★★★ | Release Engineer | 同步 main → 跑测试 → 审查 diff → bump VERSION → push → 开 PR |
| **交付** | `/land-and-deploy` | ★★★ | Release Engineer | 合并 PR → 等待 CI → 部署 → 生产金丝雀验证 |
| **运维** | `/canary` | ★★ | SRE | 部署后监控：控制台错误、性能退化、页面故障 |
| **性能** | `/benchmark` | ★★ | Performance Engineer | 页面加载时间基线，Core Web Vitals，PR 前后对比 |
| **协作** | `/pair-agent` | ★★ | Multi-Agent Coordinator | 一键分享浏览器给任何 AI agent，独立 tab，ngrok 隧道 |
| **回顾** | `/retro` | ★★★★ | Retrospective Lead | 周回顾：提交历史、工作模式、代码质量趋势 |

**评星维度：角色独立价值**——该角色/命令独立调用一次能产出多少可交付价值。同时综合考量通用性（是否依赖特定技术栈）。

**💡 按星筛选安装**：★★★★★ 是独立价值最高的 5 个 — `/office-hours`（方向）、`/review`（审查）、`/investigate`（调试）、`/qa`（测试）、`/ship`（交付），覆盖从思考到发布的核心链路。★★★★ 是高价值补充（`/plan-ceo-review`、`/plan-eng-review`、`/codex`、`/cso`、`/autoplan`、`/retro`）。★★★ 以下按项目阶段按需调用。gstack 通过 `git clone` + `./setup` 整套安装，不支持单命令安装。

**24 个 Power Tools（辅助能力）**：

| 类别 | 命令 | 独立价值 | 用途 |
|------|------|--------|------|
| 安全 | `/careful`, `/freeze`, `/guard`, `/unfreeze` | ★★★★ | 三级安全防护：警告 → 目录锁定 → 全防护 |
| 知识 | `/learn`, `/context-save`, `/context-restore` | ★★★★ | 跨会话学习 + 上下文保存/恢复，直接解决上下文丢失 |
| 浏览器 | `/browse`, `/open-gstack-browser`, `/connect-chrome` | ★★★ | gstack 自有浏览器引擎 + 连接 Chrome，替代 MCP Playwright |
| 文档 | `/document-release`, `/document-generate`, `/make-pdf` | ★★★ | 发版文档更新 + 按需生成 + Markdown 转 PDF |
| 部署 | `/setup-deploy`, `/setup-browser-cookies` | ★★ | 部署配置 + 浏览器 Cookie 导入，低频操作 |
| 检测 | `/health`, `/landing-report`, `/benchmark-models` | ★★ | 代码质量仪表盘 + 版本队列 + 跨模型基准测试 |
| 同步 | `/setup-gbrain`, `/sync-gbrain`, `/gstack-upgrade` | ★★ | GBrain 部署/同步 + gstack 自更新，低频维护 |
| 抓取 | `/scrape`, `/skillify`, `/plan-tune` | ★★ | 网页抓取 + 流程固化为 Skill + 问题灵敏度调优 |

**实战演示：用 gstack 从零开发日常简报 App**：

```text
You: 我想做一个日历日常简报 App
You: /office-hours
Claude: [追问具体痛点而不是功能需求]
        你有多个 Google Calendar 吗？事件信息过时？准备时间太长？
You: 多个日历，事件信息陈旧，地点经常不对，准备时间太长效果还不好...
Claude: 我要挑战你的表述。你说"日历简报 App"，但实际描述的
        是一个"个人幕僚长 AI"。提取了 5 个能力需求，挑战了 4 个前提，
        给出了 3 个实现方案和估算。建议：明天就出最小可用版本，从
        真正好用的日报开始。完整版是 3 个月的项目。
        [生成设计文档 → 自动流入后续 skill]

You: /plan-ceo-review  [读取设计文档，挑战范围]

You: /plan-eng-review  [ASCII 架构图、数据流、状态机、错误路径]

You: 批准方案
Claude: [写 2,400 行代码，跨 11 个文件，约 8 分钟]

You: /review  [2 个问题自动修复，1 个竞态条件确认后修复]

You: /qa https://staging.myapp.com
Claude: [打开真实浏览器，点击流程，发现并修复 1 个 bug]

You: /ship
Claude: 测试 42→51（+9 新增），PR: github.com/you/app/pull/42
```

**gstack 的 sprint 流程**：Think → Plan → Build → Review → Test → Ship → Reflect，7 个阶段 23 个角色，每一步都知道上一步做了什么。不是单个工具，是一个完整的研发流水线。

**Token 消耗警告**：23 个角色全开 Token 消耗大，适合 0→1 快速出 MVP。日常维护推荐只用 `/review` + `/ship` + `/qa` 三个命令。

## 5 mattpocock 实战 — 让 AI 慢下来先想清楚

Matt Pocock（Total TypeScript 作者）开源的 Skills 套装，89k+ Stars。核心理念：**让 AI 慢下来，先想清楚再动手**。按 GitHub 实际分类，活跃技能分 3 大类共 19 个。

**安装**：

Matt 的技能按分类存放在仓库子目录中（`skills/productivity/`、`skills/engineering/`、`skills/misc/`），但 `--skill` 参数只需指定技能名即可，工具会自动递归搜索匹配的 `SKILL.md`。

```bash
# 一键安装全部活跃技能（--skill 需指定子目录）
npx skills@latest add mattpocock/skills -g -a claude-code --skill '*' -y

# 按需安装单个 Skill（mattpocock 是五套中唯一支持单独安装的）
npx skills@latest add mattpocock/skills -g -a claude-code --skill grill-me       # 方案追问
npx skills@latest add mattpocock/skills -g -a claude-code --skill tdd            # TDD 红绿重构
npx skills@latest add mattpocock/skills -g -a claude-code --skill diagnose       # 结构化调试
npx skills@latest add mattpocock/skills -g -a claude-code --skill git-guardrails-claude-code  # Git 危险命令拦截
```

> **注意**：不能用 `npx skills@latest add mattpocock/skills/grill-me`（会报 "No skills found"）。因为 `grill-me` 不在仓库根目录。正确做法是 `npx skills@latest add mattpocock/skills --skill grill-me`，工具会自动递归搜索所有子目录中匹配的 `SKILL.md`。

安装后在 CC 中运行 `/setup-matt-pocock-skills` 初始化项目配置（Issue 跟踪器、文档布局等）。

**评星维度：思维杠杆度**——一次调用能撬动多大的决策质量提升。同时综合考量使用门槛（是否需要复杂前置配置）。

**Engineering（11 个，日常编码）**：

| Skill | 思维杠杆度 | 触发场景 | 实际效果 |
|-------|--------|----------|----------|
| `grill-with-docs` | ★★★★ | grill-me 的同时需要记录 | 追问 + 自动更新 `CONTEXT.md` 和 ADR 决策文档 |
| `tdd` | ★★★★★ | "实现 X 功能" | 严格 Red→Green→Refactor 循环，强制先写失败测试再写实现 |
| `diagnose` | ★★★★★ | "修这个 bug" | 6 阶段诊断：复现→最小化→假设→插桩→修复→回归测试 |
| `zoom-out` | ★★★★ | "这个模块我不熟悉" | 给出代码区域的高层地图，而非逐行解释 |
| `prototype` | ★★★ | "这个方案可行吗？" | 构建可丢弃原型来暴露设计问题：终端版（逻辑验证）或 UI 多变体 |
| `to-prd` | ★★★ | 方案讨论完毕 | 将当前对话内容合成 PRD，提交为 GitHub Issue |
| `to-issues` | ★★★ | PRD/方案已就绪 | 将方案拆成独立垂直切片的 GitHub Issues |
| `triage` | ★★★ | Issue 列表混乱 | 按状态机分诊：`needs-triage`→`needs-info`/`ready-for-agent`/`ready-for-human`/`wontfix` |
| `improve-codebase-architecture` | ★★★ | 代码腐化需要清理 | 基于 `CONTEXT.md` 领域语言和 ADR 决策发现深层改进机会 |
| `setup-matt-pocock-skills` | ★ | 首次安装后 | 搭建项目级配置（Issue 跟踪器、分诊标签、文档结构），每个仓库运行一次 |

**Productivity（4 个，提升效率）**：

| Skill | 思维杠杆度 | 触发场景 | 实际效果 |
|-------|--------|----------|----------|
| `grill-me` | ★★★★★ | "我打算做 X 功能" | 像技术面试官连续追问 16-50 个问题，直到每个决策分支都想清楚 |
| `caveman` | ★★★★ | Token 消耗太高 | 超压缩通信模式，砍掉 ~75% token 同时保持技术准确性 |
| `handoff` | ★★★ | 将当前会话压缩成交接文档 | 交接文档供另一位 Agent 无缝继续 |
| `write-a-skill` | ★★ | "创建一个新 skill" | 元技能，用 TDD 方式创建新的 Skill |

**`/grill-me` 的核心价值**：这是整个套装最出名的 Skill，属于 Productivity 类而非 Engineering 类（GitHub 实际分类）。Matt 本人曾被自己的 `grill-me` 连续追问近 50 个问题才通过。问的问题包括："这个组件需要什么 props？""状态从哪里来？服务端还是客户端？""loading 态长什么样？""如果 API 超时怎么办？""可访问性怎么处理？"

**Misc（4 个，辅助工具）**：

| Skill | 思维杠杆度 | 用途 |
|-------|--------|------|
| `git-guardrails-claude-code` | ★★★★ | 在 git hook 层拦截危险命令（force push、hard reset 等） |
| `setup-pre-commit` | ★★★ | 搭建 Husky pre-commit hooks |
| `migrate-to-shoehorn` | ★★ | 将 `as` 断言迁移到 `@total-typescript/shoehorn` |
| `scaffold-exercises` | ★ | 生成练习目录结构（教学场景） |

**💡 按星筛选安装**：★★★★★ 三件套 — `grill-me`（思考）+ `tdd`（编码）+ `diagnose`（调试），覆盖核心链路。★★★★ 补充 `grill-with-docs`、`zoom-out`、`caveman`、`git-guardrails-claude-code`。

**单技能安装命令（4★/5★）**：

```bash
# ★★★★★
npx skills@latest add mattpocock/skills -g -a claude-code --skill grill-me    # 方案追问
npx skills@latest add mattpocock/skills -g -a claude-code --skill tdd        # TDD 红绿重构
npx skills@latest add mattpocock/skills -g -a claude-code --skill diagnose   # 结构化调试

# ★★★★
npx skills@latest add mattpocock/skills -g -a claude-code --skill grill-with-docs  # 追问 + 文档
npx skills@latest add mattpocock/skills -g -a claude-code --skill zoom-out         # 代码高层地图
npx skills@latest add mattpocock/skills -g -a claude-code --skill caveman          # 超压缩通信
npx skills@latest add mattpocock/skills -g -a claude-code --skill git-guardrails-claude-code  # Git 危险命令拦截
```

**实战演示：用 mattpocock 套装开发 TypeScript 泛型工具库**：

```text
# 场景：开发一个 DeepReadonly 泛型工具 + 配套测试

You: 我想写一个 DeepReadonly 泛型，递归地将对象所有属性设为 readonly

# 第1步：先 grill，不写代码
You: /grill-me
Claude: 连续追问——
        Q1: 数组怎么处理？递归 readonly 还是只 readonly 顶层？
        Q2: 函数属性呢？保留还是剥掉？
        Q3: Date、RegExp 等内置对象怎么处理？
        Q4: Map/Set 呢？
        Q5: 你要支持多深的嵌套？
        Q6: 这个工具是给什么场景用的？
        Q7: 有没有现成的库可以参考（type-fest）？
        Q8: 你准备写多少测试用例？边界情况列出来...
        ... 共 16 个问题 ...

You: [一一回答，思路完全清晰]

# 第2步：用 TDD 方式实现
You: 用 tdd 实现 DeepReadonly
Claude: 第一步先写测试——
        test('should make shallow object readonly')
        test('should handle nested objects')
        test('should handle arrays recursively')
        test('should preserve primitive types')
        test('should handle Date, RegExp')
        test('should handle Map and Set')
        ... 8 个测试全部失败（预期中的红阶段）...

Claude: 现在写实现——
        type DeepReadonly<T> = {
          readonly [K in keyof T]: T[K] extends object
            ? T[K] extends Function ? T[K] : DeepReadonly<T[K]>
            : T[K]
        }

Claude: 运行测试——6 个通过，2 个失败（数组和 Map/Set 处理）
Claude: 修正实现——8 个全部通过 ✓

# 第3步：出了问题用 diagnose
You: DeepReadonly 在处理联合类型时行为不对，帮我看看
You: /diagnose
Claude: 阶段1-复现：确认联合类型 `A | B` 的 readonly 行为异常
        阶段2-最小化：精简到 3 行的最小复现用例
        阶段3-假设：可能是 distributive conditional type 导致
        阶段4-插桩：添加类型测试验证假设
        阶段5-修复：改用非分布式写法
        阶段6-回归：所有 8 个原有用例 + 3 个新增联合类型用例全部通过 ✓

# 第4步：生成文档和 PR
You: /to-issues
Claude: 生成 3 个垂直切片 Issue：
        #1 - DeepReadonly 核心实现 + 单元测试
        #2 - 补充文档和 JSDoc 示例
        #3 - 发布到 npm 的 CI/CD 配置
```

**使用建议**：
- `/grill-me` + `tdd` + `diagnose` 是日常编码最常用的三个
- `caveman` 在 token 紧张时非常实用，能省约 75% 的 token
- 整个套装天然适合 TypeScript/JavaScript 项目，其他语言项目也能用但最佳体验在 TS 生态

---

## 6 GSD 实战 — Spec 驱动 + 上下文工程

GSD（Get Shit Done）由 TÂCHES 团队出品，63k+ Stars。核心理念：**不要让上下文腐化**——每个开发阶段使用独立上下文窗口，解决长会话"AI 忘记前面约定"的通病。

**安装**（30 秒）：

```bash
npx get-shit-done-cc@latest
```

安装后重启 CC，GSD 的 `/gsd:*` 命令即可用。支持 Claude Code、Copilot、Gemini CLI 等 15 种运行时。不支持单命令安装。

**评星维度：防腐化必须度**——缺了该阶段/命令，上下文腐化风险多大、多快。同时综合考量执行可靠性（阶段隔离的实际效果）。

**GSD 的设计哲学："阶段隔离"**：

```
传统 CC 会话：一个上下文扛到底
  讨论 → 研究 → 计划 → 编码 → 测试 → 修bug → 讨论新功能 → 上下文爆炸...

GSD 方式：每个阶段独立上下文
  /gsd-discuss-phase → 讨论完毕，上下文重置
  /gsd-plan-phase    → 规划完毕，上下文重置
  /gsd-execute-phase → 每个 wave 用全新 200k token 上下文
  /gsd-verify-work   → 验收完毕，上下文重置
```

**项目初始化**：

| 命令 | 防腐化度 | 用途 |
|------|--------|------|
| `/gsd-new-project` | ★★★★ | 访谈→研究→需求→路线图→批准，从零初始化项目 |
| `/gsd-map-codebase` | ★★★★ | 分析现有代码库结构（已有代码的项目先跑这个） |
| `/gsd-new-milestone` | ★★★ | 开始下一个版本周期 |

**核心 6 阶段工作流**：

| 阶段 | 命令 | 防腐化度 | 职责 | 产物 |
|------|------|--------|------|------|
| **1. 讨论** | `/gsd-discuss-phase <N>` | ★★★★ | 捕获实现偏好（架构风格、API 形态、错误处理策略） | `CONTEXT.md` |
| **2. 规划** | `/gsd-plan-phase <N>` | ★★★★★ | 并行启动研究 Agent → 制定原子任务计划 → 验证计划与需求对齐 | `PLAN.md` |
| **3. 执行** | `/gsd-execute-phase <N>` | ★★★★★ | 按 wave 并行执行计划，每个 executor 200k 干净上下文，每个任务原子 commit | 代码 + 提交 |
| **4. 验证** | `/gsd-verify-work <N>` | ★★★ | 人工 UAT（用户验收测试），提取可测试交付物、逐项引导验证 | 验证报告 |
| **5. 发布** | `/gsd-ship <N>` | ★★★★ | 从已验证的阶段创建 PR，自动生成 PR 描述 | PR |
| **6. 完成** | `/gsd-complete-milestone` | ★★★ | 归档里程碑、打 release tag | tag + 归档 |

**探索与设计**：

| 命令 | 防腐化度 | 用途 |
|------|--------|------|
| `/gsd-explore` | ★★★ | 苏格拉底式探索，理清思路和方案空间 |
| `/gsd-sketch` | ★★★ | 快速草稿出方案结构 |
| `/gsd-spike` | ★★★ | 技术 spike，验证关键假设 |
| `/gsd-spec-phase <N>` | ★★★ | 独立的 spec 设计阶段 |
| `/gsd-ui-phase <N>` | ★★★ | 生成 `UI-SPEC.md` 设计契约（布局、组件、交互模式） |

**质量与审查**：

| 命令 | 防腐化度 | 用途 |
|------|--------|------|
| `/gsd-review` | ★★★★ | 跨 AI 同行评审（对当前阶段或分支） |
| `/gsd-code-review` | ★★★ | 结构化代码审查 |
| `/gsd-ui-review <N>` | ★★★ | 前端代码 6 维视觉审计（布局/颜色/间距/响应式/可访问性/动效） |
| `/gsd-audit-milestone` | ★★★ | 验证里程碑是否达到完成标准 |
| `/gsd-secure-phase` | ★★ | 安全审计（威胁模型锚定验证） |
| `/gsd-forensics` | ★★ | 对失败或卡住的工作流进行事后调查 |
| `/gsd-audit-uat` | ★★ | 审计验证债务——找出缺少 UAT 的阶段 |

**快速/轻量模式**：

| 命令 | 防腐化度 | 用途 |
|------|--------|------|
| `/gsd-quick [--discuss] [--research] [--full]` | ★★★★ | 临时任务快速通道，仍保留原子 commit + 状态跟踪 |
| `/gsd-fast <text>` | ★★★ | 完全跳过规划，直接执行（最轻量） |

**💡 按星筛选使用**：★★★★★ 是防腐化核心 — `plan-phase`（规划质量决定上限）+ `execute-phase`（执行防线），缺一则上下文腐化加速。★★★★ 是高频必备 — `new-project`、`map-codebase`、`discuss-phase`、`ship`、`review`、`quick`。★★★ 以下按项目复杂度按需使用。

**命名空间路由**（高级用户，按命名空间直接调用）：

| 命名空间 | Router 命令 | 防腐化度 | 管辖范围 |
|----------|------------|--------|----------|
| 阶段流水线 | `/gsd-ns-workflow` | ★★★ | discuss → plan → execute → verify → phase → progress |
| 项目生命周期 | `/gsd-ns-project` | ★★ | milestones, audits, summary |
| 质量门禁 | `/gsd-ns-review` | ★★★ | code review, debug, audit, security, eval, ui |
| 代码库智能 | `/gsd-ns-context` | ★★★ | map, graphify, docs, learnings |
| 管理 | `/gsd-ns-manage` | ★★ | config, workspace, workstreams, thread, update, ship, inbox |
| 探索与捕获 | `/gsd-ns-ideate` | ★★ | explore, sketch, spike, spec, capture |

**实战演示：用 GSD 从零开发一个 Markdown 笔记 App**：

```text
# 场景：做一个本地 Markdown 笔记应用，支持实时预览和标签分类

# 第0步：初始化项目
You: /gsd-new-project
Claude: [访谈模式] 用什么技术栈？要数据库吗？需要云端同步吗？
        ... 逐一确认偏好 ...
Claude: ✓ 生成需求文档和路线图

# 第1步：讨论阶段（独立上下文）
You: /gsd-discuss-phase 1
Claude: 捕获实现偏好——
        架构：前端全在浏览器，localStorage 持久化
        编辑器：基于 CodeMirror 6
        预览：marked + highlight.js
        标签系统：扁平标签，支持多标签过滤
        搜索：前端全文搜索（fuse.js）
        产出: CONTEXT.md ✓

# 第2步：规划阶段（全新上下文，读到 CONTEXT.md）
You: /gsd-plan-phase 1
Claude: 并行启动 3 个研究 Agent——
        Agent A: CodeMirror 6 React 集成方案
        Agent B: localStorage 容量限制和迁移策略
        Agent C: fuse.js 中文分词配置
        综合研究结果 → 制定原子任务计划 →
        Wave 1: 项目脚手架 + 编辑器组件
        Wave 2: 预览面板 + 标签系统
        Wave 3: 搜索 + 列表视图
        产出: PLAN.md ✓

# 第3步：执行阶段（全新 200k 上下文，读 PLAN.md）
You: /gsd-execute-phase 1
Claude: Wave 1 开始——
        任务 1.1: create Vite + React + TS 项目 ✓ (commit abc123)
        任务 1.2: CodeMirror 编辑器组件 ✓ (commit def456)
        任务 1.3: 笔记 CRUD + localStorage ✓ (commit ghi789)
        Wave 2 开始——
        任务 2.1: Markdown 预览面板 ✓ (commit jkl012)
        任务 2.2: 标签输入 + 管理组件 ✓ (commit mno345)
        Wave 3 开始——
        任务 3.1: fuse.js 搜索集成 ✓ (commit pqr678)
        任务 3.2: 笔记列表 + 过滤视图 ✓ (commit stu901)
        全部完成！9 个原子 commit

# 第4步：验证阶段
You: /gsd-verify-work 1
Claude: 提取可测试交付物清单——
        □ 创建新笔记并保存
        □ Markdown 实时预览
        □ 添加标签、按标签过滤
        □ 全文搜索
        □ 刷新后数据不丢失
        逐一引导验证...

# 第5步：发布
You: /gsd-ship 1
Claude: 创建 PR：github.com/you/notes-app/pull/1
        PR 描述自动生成，包含所有 commit 摘要

# 第6步：完成
You: /gsd-complete-milestone
Claude: 归档 → tag v0.1.0 → 准备下一个里程碑
```

**使用建议**：
- GSD 适合 0→1 新项目或大功能开发，日常小修小补用 `/gsd-quick` 或 `/gsd-fast`
- 6 阶段全流程适合正式功能；快速迭代用 `--discuss --research` 选项
- 已支持 15+ 种运行时，切换工具（CC→Copilot→Gemini）不用换工作流

---

## 7 组合方案：两套管线 + 一套工具箱

五套套装全装（70+ 个技能）token 开销大且功能重叠。本节给出一套经过剔重的组合方案——**只保留 20 个技能，覆盖从思考到交付的完整链路**。

核心发现：装在一起的技能不是"互补协作"，而是**入口决定管线**。你用哪种方式进入，就走哪条路。

### 7.1 真实关系：入口分流

四套技能并不是"互补协作"——它们的交互方式由触发机制决定。gstack 和 matt 是纯手动工具，不参与管线竞争。真正的管线选择发生在 Superpowers 和 OpenSpec 之间，由**你说第一句话的方式**决定。

<div style="margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:15px;line-height:1.7">

<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:6px">
  <div style="background:#f0f4ff;border:1px solid #c8d6ff;border-radius:6px;padding:12px 16px">
    <span style="font-size:12px;color:#6b7db3">🚪 入口</span>&nbsp;&nbsp;
    <strong>自然语言：</strong>"帮我做一个 XX"
  </div>
  <div style="background:#f0f4ff;border:1px solid #c8d6ff;border-radius:6px;padding:12px 16px">
    <span style="font-size:12px;color:#6b7db3">🚪 入口</span>&nbsp;&nbsp;
    <code>/opsx:explore</code> 或 <code>/opsx:propose</code>
  </div>
</div>

<div style="text-align:center;color:#888;margin:4px 0 6px;font-size:13px">
  brainstorming 拦截 ↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; slash command 优先 ↓
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:6px">
  <div style="background:#f5f0ff;border:1px solid #d8c8ff;border-radius:6px;padding:12px 16px">
    <span style="font-size:12px;color:#7b6db3">📋 规划层 · Superpowers 管线</span>&nbsp;&nbsp;
    <span style="white-space:nowrap">brainstorming → writing-plans → executing-plans</span>
    <div style="font-size:12px;color:#999;margin-top:2px">产出：docs/superpowers/</div>
  </div>
  <div style="background:#f5f0ff;border:1px solid #d8c8ff;border-radius:6px;padding:12px 16px">
    <span style="font-size:12px;color:#7b6db3">📋 规划层 · OpenSpec 管线</span>&nbsp;&nbsp;
    <span style="white-space:nowrap">explore → propose → apply → archive</span>
    <div style="font-size:12px;color:#999;margin-top:2px">产出：openspec/changes/</div>
  </div>
</div>

<div style="text-align:center;color:#888;margin:4px 0 6px;font-size:13px">↓↓</div>

<div style="background:#fff8e8;border:1px solid #e8d8a0;border-radius:6px;padding:12px 16px;margin-bottom:6px;text-align:center">
  <span style="font-size:12px;color:#b3974d">⚙️ 执行层 · 永远在线，自动触发</span>&nbsp;&nbsp;&nbsp;
  <span style="white-space:nowrap">TDD · 四阶段调试 · 完成前验证 · using-superpowers 调度器</span>
</div>

<div style="text-align:center;color:#888;margin:4px 0 6px;font-size:13px">↑↓ 随时可插入 ↑↓</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
  <div style="background:#f0faf0;border:1px solid #b8d8b8;border-radius:6px;padding:12px 16px">
    <span style="font-size:12px;color:#6b8d6b">🧰 工具箱 · gstack</span>&nbsp;&nbsp;
    <span style="white-space:nowrap">/office-hours &nbsp; /qa &nbsp; /review &nbsp; /ship</span>
  </div>
  <div style="background:#f0faf0;border:1px solid #b8d8b8;border-radius:6px;padding:12px 16px">
    <span style="font-size:12px;color:#6b8d6b">🧰 工具箱 · matt</span>&nbsp;&nbsp;
    <span style="white-space:nowrap">/grill-me &nbsp; /caveman</span>
  </div>
</div>

</div>

**四层性质：**

| 层 | 包含 | 触发方式 | 说明 |
|----|------|----------|------|
| 执行层 | Superpowers: TDD、调试、验证、调度器 | **自动，无法关闭** | 所有场景都会增强代码质量，不参与管线竞争 |
| 规划层 A | Superpowers: brainstorming、writing-plans、executing-plans | **自然语言自动触发** | 入口"帮我做X"。产出到 `docs/superpowers/`。一次会话搞定 |
| 规划层 B | OpenSpec: explore、propose、apply、archive | **slash command 触发，中途自然语言可续** | 入口 `/opsx:explore` 或 `/opsx:propose`。产出到 `openspec/changes/`。支持归档审计 |
| 工具箱 | gstack 4 个 + matt 2 个 | **纯手动，需自行添加 disable** | 任何时候都可以插入，不参与管线竞争，不和任何人冲突 |

**关键规则：**

1. **入口即分流。** 自然语言"帮我做X" → brainstorming 接管 → Superpowers 管线。`/opsx:propose` → OpenSpec 管线。不要在同一个功能上混用两种入口。
2. **会话纯度决定后续便利度。** 纯 Superpowers 会话或纯 OpenSpec 会话，后续交互用自然语言就能自动续上。混用过的会话，需要 slash command 显式消歧。
3. **执行层永远在线。** 不论走哪条规划管线，TDD、调试、验证都会在实现时自动增强质量。
4. **工具箱随时可用。** `/grill-me`、`/review`、`/qa`、`/ship`、`/caveman` 不参与管线竞争，需要时手动插入。

**剔重原则：**

1. 同类功能只留一个。TDD 留 Superpowers 的（自动触发），不留 matt 的（手动）；调试留 Superpowers 的 `systematic-debugging`（自动触发），不留 gstack 的 `/investigate`（重叠）；审查留 gstack 的 `/review`（Staff Engineer 级，比 Superpowers 的 `requesting-code-review` 更深入）。
2. 不可替代性是唯一标准。`/grill-me` 的 16-50 个追问、`/office-hours` 的 YC 式方向重构、`/qa` 的真实浏览器测试，其他套装做不到。
3. 低使用频率的砍掉。`using-git-worktrees`（CC 自带）、`writing-skills`（几个月一次）。

**GSD 为什么没有入选？**

GSD 和 OpenSpec 在 spec/plan 层严重重叠——`CONTEXT.md`/`PLAN.md` 和 `proposal.md`/`specs/`/`design.md` 互相竞争。如果不需要 spec 文件沉淀，可以把 OpenSpec 换成 GSD。

### 7.2 最终技能清单（20 个）

**Superpowers（10 个保留 + 4 个归档）**：

| 技能 | 决策 | 理由 |
|------|------|------|
| `using-superpowers` | ✅ 保留 | 核心调度器，自动检测任务类型并触发对应流程 |
| `test-driven-development` | ✅ 保留 | 强制 Red→Green→Refactor，执行层自动触发 |
| `systematic-debugging` | ✅ 保留 | 四阶段调试，执行层自动触发 |
| `writing-plans` | ✅ 保留 | 规划层——自然语言入口时自动生成原子实施计划 |
| `brainstorming` | ✅ 保留 | 规划层——自然语言入口时苏格拉底式追问，理清需求边界 |
| `executing-plans` | ✅ 保留 | 规划层——逐项执行 Superpowers plan，每步 checkpoint |
| `verification-before-completion` | ✅ 保留 | 执行层——宣称"完成"前自动检查 |
| `finishing-a-development-branch` | ✅ 保留 | 手动调用——功能完成后 4 种收尾选项 |
| `subagent-driven-development` | ✅ 保留 | 手动调用——复杂改动时每任务独立子代理 |
| `dispatching-parallel-agents` | ✅ 保留 | 手动调用——自动检测可并行任务 |
| `requesting-code-review` | ❌ 归档 | 被 gstack `/review` 覆盖 |
| `receiving-code-review` | ❌ 归档 | 依赖上一个，一并归档 |
| `using-git-worktrees` | ❌ 归档 | CC 自带 `--worktree` 参数 |
| `writing-skills` | ❌ 归档 | 元技能，使用频率极低 |

`finishing-a-development-branch`、`subagent-driven-development`、`dispatching-parallel-agents` 三个为手动调用，详见 7.5 节的 disable 配置。

**OpenSpec（4 个全保留）**：

| 命令 | 决策 | 理由 |
|------|------|------|
| `/opsx:explore` | ✅ 保留 | 需求模糊时自由探索，纯只读，不强制产出 |
| `/opsx:propose` | ✅ 保留 | 一键生成 proposal + design + specs + tasks |
| `/opsx:apply` | ✅ 保留 | 按 tasks.md 逐项实现，勾 checkbox |
| `/opsx:archive` | ✅ 保留 | 归档 delta spec 到主 spec，保留审计历史 |

> **注意**：`openspec init` 同时生成了 4 个 SKILL.md（位于 `.claude/skills/openspec-*/`），它们有 description 字段、无 `disable-model-invocation`，会被加载到系统提示词。这是有意设计——让你在 OpenSpec 会话中不用每次敲 slash command，自然语言即可续上。如果一个会话里同时存在 Superpowers 和 OpenSpec 的未完成产物，自动匹配可能不确定，此时用 slash command 显式消歧。

**mattpocock（2 个保留 + 其余不装）**：

| 技能 | 决策 | 理由 |
|------|------|------|
| `grill-me` | ✅ 保留 | 技术面试官式 16-50 个追问，拷打方案细节。纯手动 |
| `caveman` | ✅ 保留 | 砍掉 ~75% token 同时保持技术准确性。纯手动 |
| `tdd` | ❌ 不装 | 和 Superpowers TDD 重叠 |
| `diagnose` | ❌ 不装 | 和 Superpowers debugging 重叠 |
| 其余 15 个 | ❌ 不装 | 被主干覆盖或使用频率低 |

**gstack（4 个保留 + 其余归档）**：

| 命令 | 决策 | 理由 |
|------|------|------|
| `/office-hours` | ✅ 保留 | YC 式方向重构，把"做X功能"重新定义为"解决Y问题"。纯手动 |
| `/qa` | ✅ 保留 | 真实 Chromium 浏览器测试，发现静态审查发现不了的 bug。**仅适用 Web 应用**（需要 URL），CLI/库项目用不上。纯手动 |
| `/review` | ✅ 保留 | Staff Engineer 级预落地审查：SQL 安全、LLM 信任边界、条件性副作用。纯手动 |
| `/ship` | ✅ 保留 | 一键：同步 main → 测试 → 审查 diff → bump → push → PR。纯手动 |
| `/investigate` | ❌ 归档 | 和 Superpowers `systematic-debugging` 重叠 |
| 其余 43 个 | ❌ 归档 | 使用频率低或被覆盖 |

**以上 10 个手动技能在原始安装后均不带 `disable-model-invocation`，需要按 7.5 节的步骤手动添加，否则会参与自动匹配、浪费 token。**

### 7.3 安装命令

```bash
# 1. Superpowers（14 个全装，后面归档 4 个）
npx skills add obra/superpowers -g -a claude-code --skill '*' -y

# 2. OpenSpec
npm install -g @fission-ai/openspec@latest
cd <your-project> && openspec init

# 3. mattpocock（只装 2 个）
npx skills add mattpocock/skills -g -a claude-code --skill grill-me
npx skills add mattpocock/skills -g -a claude-code --skill caveman

# 4. gstack
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git \
  ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

### 7.4 归档与清理

Superpowers 和 gstack 是整套安装，需要手动归档不需要的技能。matt 和 OpenSpec 按需安装，无需清理。

**Superpowers 归档**（删掉 4 个目录）：

```bash
ARCHIVE_DIR=~/.claude/skills-archived/superpowers
mkdir -p "$ARCHIVE_DIR"

cd ~/.claude/skills
for skill in requesting-code-review receiving-code-review using-git-worktrees writing-skills; do
  if [ -d "$skill" ]; then
    mv "$skill" "$ARCHIVE_DIR/"
    echo "archived: $skill"
  fi
done
```

**gstack 归档**（只删 symlink，不动 `gstack/` 仓库本体）：

```bash
ARCHIVE_DIR=~/.claude/skills-archived/gstack
mkdir -p "$ARCHIVE_DIR"
KEEP="office-hours qa review ship browse"

cd ~/.claude/skills
for dir in */; do
  dir_name="${dir%/}"
  if [ -L "$dir_name/SKILL.md" ]; then
    case " $KEEP " in
      *" $dir_name "*) echo "keeping: $dir_name" ;;
      *) mv "$dir_name" "$ARCHIVE_DIR/" && echo "archived: $dir_name" ;;
    esac
  fi
done
```

`[ -L "$dir_name/SKILL.md" ]` 只匹配 symlink（gstack 命令），Superpowers 和 matt 的真实文件自动跳过。

**恢复**：

```bash
mv ~/.claude/skills-archived/superpowers/<name> ~/.claude/skills/     # Superpowers
mv ~/.claude/skills-archived/gstack/<name> ~/.claude/skills/          # gstack
npx skills add mattpocock/skills -g -a claude-code --skill <name>     # matt
```

### 7.5 禁用自动激活

所有手动调用的技能（`/` 触发，不需要自动匹配）都必须手动添加 `disable-model-invocation: true`，防止 Claude 在不必要时加载它们的 SKILL.md。**这些技能的上游源文件均不包含此字段，必须自行添加。**

**需要添加的 10 个技能**：

```bash
# mattpocock 的 2 个（真实文件位于 ~/.claude/skills/）
#  编辑 ~/.claude/skills/grill-me/SKILL.md → frontmatter 添加 disable-model-invocation: true
#  编辑 ~/.claude/skills/caveman/SKILL.md → frontmatter 添加 disable-model-invocation: true

# gstack 的 5 个（真实文件位于 ~/.claude/skills/gstack/）
#  编辑 ~/.claude/skills/gstack/office-hours/SKILL.md → 同上
#  编辑 ~/.claude/skills/gstack/qa/SKILL.md
#  编辑 ~/.claude/skills/gstack/review/SKILL.md
#  编辑 ~/.claude/skills/gstack/ship/SKILL.md
#  编辑 ~/.claude/skills/gstack/browse/SKILL.md

# Superpowers 的 3 个（真实文件位于 ~/.claude/skills/）
#  编辑 ~/.claude/skills/dispatching-parallel-agents/SKILL.md → 同上
#  编辑 ~/.claude/skills/subagent-driven-development/SKILL.md
#  编辑 ~/.claude/skills/finishing-a-development-branch/SKILL.md
```

> **注意**：gstack 的 SKILL.md 在 `~/.claude/skills/gstack/` 目录中，`~/.claude/skills/office-hours/SKILL.md` 只是指向它的 symlink。修改目标文件后，symlink 端的 CC 看到的就是修改后的内容。但如果后续 `git pull` 更新 gstack，修改可能被覆盖——可以在 `gstack/` 目录中 `git stash` 保存修改，或升级后重新添加。

**不能禁用的 7 个**（Superpowers 核心，依赖自动触发）：

```
test-driven-development    ← 检测到"写代码"自动触发 TDD 流程
systematic-debugging        ← 检测到"修 bug"自动触发四阶段调试
using-superpowers           ← 核心调度器，禁用则 Superpowers 全部失效
brainstorming               ← 检测到"设计/讨论"自动追问
writing-plans               ← 检测到"规划"自动拆解任务
executing-plans             ← 检测到批量任务自动逐项执行
verification-before-completion ← 宣称"完成"前自动检查
```

**OpenSpec 的 4 个不处理**：OpenSpec 的 SKILL.md 也没有 `disable-model-invocation`，但这是有意设计——让自然语言能自动续上 OpenSpec 会话（"继续实现"自动匹配 `openspec-apply-change`）。如果希望纯手动控制，同样方式添加 disable 即可。

**最终 Token 消耗对比**：

| | 全装（不筛选） | 本方案 |
|------|------|------|
| Superpowers | 14 个 SKILL.md 全部加载 | 7 个自动触发 + 3 个手动（disable） |
| mattpocock | 19 个 | 2 个（手动，disable） |
| gstack | 47 个 | 5 个（手动，disable） |
| OpenSpec | — | 4 个 SKILL.md + 4 个 slash command |
| **实际参与自动匹配的** | ~80 个 description | **~11 个**（Superpowers 7 + OpenSpec 4） |

核心收益：系统提示词不再被 80 个 description 淹没。实际参与自动匹配的只有 ~11 个。

### 7.6 使用场景

**场景一：复杂功能开发，需要 spec 版本控制（OpenSpec 路径）**

给已有 B2B SaaS 添加 RBAC 权限系统：

```text
# ——— 1. 定方向（gstack，可选）—————————————————
You: /office-hours
AI:  [YC 式追问]
     Q1: 现在的权限模型是什么？只有 admin/user 二值？
You: 对，单 role 字段，已经不够用了
AI:  Q2: 需要细到什么粒度？"某用户对某资源的某操作"？
You: 对，不同部门的管理员只能看自己部门的数据，不能交叉
AI:  Q3: 用户现在怎么解决权限不够的问题？
You: 手动找我改数据库，一周至少三次
AI:  Q4: 最小可用版本是什么？能不能先做一个能卖钱的？
You: 只要能按角色控制页面和 API 访问就行，先不做数据行级过滤
AI:  Q5: 有没有看过用户实际操作？有什么意外发现？
You: 有些团队管理员把密码共享给同事，绕过了权限限制
AI:  Q6: 三年后这个产品会变成什么样？
You: 多租户 SaaS，每个租户内部有独立 RBAC
AI:  [生成设计文档 → ~/.gstack/projects/cogniverse/...-design-...md]
     方向确认：RBAC 三层模型（用户→角色→权限），
     先做页面级 + API 级控制，数据行级过滤放到下一期。
     这份设计文档让 brainstorming 的"先设计再写代码"HARD GATE 自然满足。

# ——— 2. 拷打方向（matt）—————————————————————
You: /grill-me
AI:  [翻阅 office-hours 的设计文档，技术面试官式追问]
     Q1: 角色继承支持几层？无限嵌套还是最多 2 层？
     Q2: 权限检查失败返回 403 还是 404？（安全考量：404 不暴露资源存在）
     Q3: 角色缓存策略？每次查 DB 还是 Redis？
     Q4: 缓存失效怎么处理？用户角色变更后立即生效还是等 TTL？
     Q5: 超级管理员是硬编码还是数据库记录？
     Q6: 权限定义存在哪里？代码常量、数据库、配置文件？
     Q7: 多租户场景：租户 A 和租户 B 的角色定义独立还是共享模板？
     Q8: 迁移脚本怎么处理现有用户？默认给什么角色？
     ... 共 18 个问题 ...
You: 继承最多 2 层，返回 403，Redis 缓存（TTL 5 分钟），
     角色变更立即失效缓存，超管通过数据库标记，权限定义在代码常量中，
     租户独立角色，现有用户默认给 viewer 角色

# ——— 3. 写 spec（OpenSpec，第 1 次 slash command）———
#      所有 grill 结论直接喂入 spec。显式指定 kebab-case 名称；
#      省略名称时默认用项目目录名（如 cc-cleaner-tool）
You: /opsx:propose add-rbac-permission-system
AI:  创建 openspec/changes/add-rbac-permission-system/
     ├── proposal.md  — 为什么做：单 role 字段收到 3 次/周手动改库请求，
     │                  团队管理员共享密码绕过权限，合规风险已出现
     ├── design.md    — 怎么做：User ↔ UserRole ↔ Role ↔ RolePermission ↔ Permission
     │                  继承上限 2 层，403 拒绝，Redis 缓存，超管数据库标记
     │                  AuthMiddleware → PermissionService → RoleResolver
     ├── specs/       — 6 个场景：赋权、撤销、继承（最多 2 层）、权限检查、
     │                  越权拒绝（403）、审计日志
     └── tasks.md     — 12 个原子任务，从数据模型→服务层→中间件→API→迁移

# ——— 4. 实现（第 2 次 slash command，之后全是自然语言）———
#      propose 里 design.md 已经包含了 grill 的所有结论。
#      /opsx:apply 可省略名称——自动从上下文推断，只有一个活跃 change 时无需指定
You: /opsx:apply
AI:  使用 change: add-rbac-permission-system

     [TDD 自动触发] 任务 1.1: 先写 Permission 模型测试
     ✓ 6 个测试用例，覆盖 name/slug/description/scope
     → 测试失败（表不存在）→ 创建 migration → 实现模型 → 测试通过 ✓
     → git commit: "feat: add Permission model with migration"

     [TDD] 任务 1.2: UserRole 关联模型
     ✓ 测试通过 ✓
     → git commit: "feat: add UserRole join model"

     [TDD] 任务 1.3: RoleResolver 服务
     ✓ 单层角色解析 ✓
     ✓ 继承角色解析 ✓
     ✓ 多角色合并去重 ✓
     → git commit: "feat: add RoleResolver with inheritance support"

     ...

     任务 2.3: 集成测试 — 完整赋权→访问→拒绝流程
     → 测试失败：中间件注册顺序导致 AuthMiddleware 在 PermissionMiddleware 之后
     [systematic-debugging 自动接管]
       阶段1-观察：中间件注册顺序：Logger → Permission → Auth
       阶段2-假设：Auth 在 Permission 之后，req.user 未设置时 Permission 检查报错
       阶段3-验证：调整顺序为 Logger → Auth → Permission → 复测试通过
       阶段4-修复：更新中间件注册配置文件
     → git commit: "fix: correct middleware order, Auth before Permission"

     12/12 任务完成 ✓

# ——— 5. 预落地审查（gstack）—————————————————————
You: /review
AI:  [Staff Engineer 审查]
     ✓ 代码风格和一致性
     ✓ 测试覆盖率：89%（新增代码行覆盖）
     ⚠ PermissionService.check(): SQL 查询未使用参数绑定，存在注入风险
       → 修复：改用预编译语句
     ⚠ RoleResolver.clearCache() 和 RoleService.updateRole() 之间的竞态条件
       → 修复：clearCache 移到 updateRole 事务提交之后
     ✓ 无 LLM 信任边界问题
     ✓ 条件性副作用审查通过
     2 个问题已自动修复 → git commit

# ——— 6. 浏览器验证（gstack）—————————————————————
You: /qa https://staging.myapp.com
AI:  [Chromium 浏览器]
     1. 登录 admin → 用户管理 → 创建角色"部门管理员" → 赋权 ✓
     2. 登录 user → 访问部门管理页面 → 403 ✓
     3. admin 修改 user 角色 → user 刷新页面 → 权限即时生效（Redis TTL 内）✓
     4. user 尝试越权访问 API /api/admin/users → 403 ✓
     5. ⚠ 越权访问时页面白屏，未渲染 403 错误页面
        → 修复：添加 403 页面组件 → git commit
     6. 回归：1-4 步骤重新验证 ✓
     3 个 bug 发现，全部原子化修复

# ——— 7. 交付（gstack）——————————————————————————
#      /ship 需要在 feature branch 上运行，不在 main 上
You: /ship
AI:  同步 main → 跑 47 个测试（全部通过）→ 审查 diff →
     bump version 1.4.0 → 1.4.1 → push → 创建 PR #328
     PR: github.com/you/saas-app/pull/328

# ——— 8. 收尾（第 3 次 slash command）————————————
You: /opsx:archive
AI:  Delta spec 合并到主 specs/ → 归档到 archive/2026-05-20-add-rbac/
     下一个功能。
```

**为什么这个流程能跑通**：`/office-hours` 产出设计文档 → brainstorming HARD GATE 满足 → `/grill-me` 追问细节 → `/opsx:propose` 把 grill 结论直接写入 spec（不需要回头改文件）。执行时 TDD/调试自动增强。全程 3 次 slash command（propose / apply / archive），其余全是自然语言或工具箱命令。

---

**场景二：功能开发，不需要 spec 归档（Superpowers 路径）**

给项目加一个 Markdown 预览组件：

```text
# ——— 1. 自然语言入口，brainstorming 自动接管 ———————————
You: 帮我在这个项目里加一个 Markdown 预览组件，支持实时渲染和代码高亮

AI:  [brainstorming 自动触发]
     Q1: 这个组件用在哪里？博客编辑页、文档站、还是评论区？
You: 博客编辑页，左侧编辑右侧实时预览
AI:  Q2: 代码高亮偏好？Prism.js（轻量、多语言）还是 Shiki（VS Code 同款、
     更精确但体积大）？
You: Prism 吧，博客场景不需要 Shiki 的精确度
AI:  Q3: 预览滚动同步怎么处理？自动跟随光标还是独立滚动？
You: 独立滚动就行，编辑器太长了同步反而眼花
AI:  Q4: 支持哪些 Markdown 扩展？表格、任务列表、脚注？
You: GFM 全套，加上 LaTeX 数学公式
AI:  Q5: 性能敏感吗？文章最长大概多长？
You: 最长 5000 行，不能卡
AI:  Q6: 现有项目用的是什么 Markdown 库？有没有可复用的？
You: 后端用 marked 生成静态页面，前端可以复用 marked + Prism
AI:  [生成设计文档 → docs/superpowers/specs/2026-05-20-markdown-preview-design.md]
     方案：marked + Prism.js + DOMPurify（防 XSS），
     虚拟滚动处理 5000 行场景，Web Worker 做语法高亮避免卡主线程。
     分为 3 层：ParseWorker（后台解析）→ PreviewRenderer（渲染）
     → MarkdownPreview（React 组件）。

     这个设计你觉得 OK 吗？
You: OK

# ——— 2. writing-plans 自动拆任务 ————————————————————
AI:  [writing-plans 自动触发]
     拆成 8 个原子任务 → docs/superpowers/plans/2026-05-20-markdown-preview.md

     任务 1: ParseWorker — 在 Web Worker 中调用 marked 解析 Markdown
     任务 2: PrismLoader — 动态加载 Prism 语言包，按需不冗余
     任务 3: PreviewRenderer — 将 AST 渲染为 React 元素，注入代码高亮
     任务 4: MarkdownPreview 组件 — 组合 ParseWorker + PreviewRenderer
     任务 5: DOMPurify 集成 — 渲染前 XSS 清理
     任务 6: 虚拟滚动 — 超过 1000 行时启用 react-window
     任务 7: 错误边界 — 解析失败时的降级 UI
     任务 8: 集成测试 — 端到端：输入 Markdown → 预览正确渲染

     执行方式？
You: 子代理逐个执行

# ——— 3. subagent-driven 逐任务执行 ——————————————————
AI:  [subagent-driven-development]
     任务 1/8: 派发子代理 → ParseWorker 实现 + 测试
     [TDD 自动触发] 先写 Worker 消息协议测试 → 失败 → 实现 → 通过 ✓
     → git commit ✓

     任务 2/8: 派发子代理 → PrismLoader 实现
     [TDD] 测试：加载已知语言 → 通过 ✓，加载不存在的语言 → 降级 ✓
     → git commit ✓

     任务 3/8: 派发子代理 → PreviewRenderer
     [TDD] 测试：代码块渲染含高亮 class → 通过 ✓
     → git commit ✓

     ...

     任务 8/8: 集成测试
     输入: "# Hello\n```js\nconst x = 1;\n```" → 预期: h1 + 代码块含 Prism token
     → 通过 ✓
     [verification-before-completion] 跑全部 14 个测试 → 14/14 通过 ✓
     8/8 任务完成 ✓

# ——— 4. 收尾 —————————————————————————————————————
You: /review
AI:  [Staff Engineer 审查]
     ⚠ PreviewRenderer 中 dangerouslySetInnerHTML 使用前未通过 DOMPurify
       虽然任务 5 说要做，但集成顺序有误——Renderer 先于 Purifier 完成。
       → 修正：在 Renderer 中直接调用 purify()
     ✓ 其余通过
     → git commit

#      /ship 需要在 feature branch 上，不在 main
You: /ship
AI:  同步 main → 跑全部测试（42→56，+14 新增）→
     bump version → push → 创建 PR #330

# 没开 spec 归档，直接收工。
```

**什么时候用这个路径**：需求相对清晰，不需要 spec 版本控制和归档审计。Superpowers 从头到尾自动化——brainstorming 理清边界，writing-plans 生成计划，subagent 逐个实现，TDD + debugging + verification 三道质量防线。适合个人项目、原型、内部工具。除交付阶段的工具箱命令外全程零 slash command。

---

**场景三：Bug 修复（纯执行层）**

用户反馈登录后偶尔被踢回首页：

```text
You: 用户反馈登录后偶尔被踢回首页，会话丢失，帮我看看

# ——— 1. systematic-debugging 自动接管 —————————————
AI:  [systematic-debugging 自动触发]
     阶段1-观察：
       - 检查 session.ts:47 — sessionStore.get() 返回 undefined
       - token 刷新逻辑在 refreshToken.ts:32，每次发 POST /api/auth/refresh
       - 日志显示同一用户同时有 3 个刷新请求，时间戳差值 < 50ms
       - 竞态窗口：3 个旧 refresh token 同时到达，第一个成功，
         后两个用已失效的 refresh token → 全部失败 → session 被清空
     
     阶段2-假设：
       并发刷新请求互相覆盖。如果前端有 3 个 API 调用同时触发刷新，
       3 个请求都带同一个旧 refresh token，服务端只接受第一个，
       后两个失败后误删了有效 session。
     
     阶段3-验证：
       用并发模拟脚本：同时发 3 个 API 请求，都触发 401 → 刷新
       复现结果：5 次并发中有 2 次触发 session 丢失
     
     阶段4-修复：
       - 前端：加互斥锁保护 refreshToken 调用，并发请求共享同一个刷新 promise
       - 后端：refresh token 旋转时，宽限期 30s 内旧的仍可用一次
     
     [TDD 自动触发]
       先写测试：模拟 3 并发刷新 → 预期 session 保持有效
       → 测试失败（当前代码）→ 实现修复 → 测试通过 ✓
     
     [verification-before-completion]
       跑全部 47 个测试 → 47/47 通过 ✓
       复现脚本跑 20 次并发 → 0 次 session 丢失 ✓
     → git commit: "fix: prevent race condition in token refresh"
```

规划层完全不参与。执行层的 debugging + TDD + verification 自动覆盖全流程——观察、假设、验证、修复、回归，不需要任何 slash command。

---

**场景四：对领域一无所知（OpenSpec 探索路径）**

想开发一个跑酷游戏，但对这方面零基础：

```text
# ——— 1. 探索模式（slash command 带自然语言描述）——————
You: /opsx:explore 我想开发一个跑酷游戏，但对这方面完全不了解

AI:  [探索模式，纯只读，不强制产出]

You: 核心机制是怎样的？需要哪些系统？

AI:  典型跑酷游戏的核心系统：
     1. 无限生成系统 — 地形/障碍物/道具的程序化生成，保证永不重复
     2. 角色控制系统 — 三车道切换（左/中/右）+ 跳跃 + 滑铲
     3. 物理系统 — 重力、碰撞检测、惯性
     4. 难度递增系统 — 速度逐步加快、障碍密度增大
     5. 视觉反馈 — 粒子特效、屏幕震动、速度线、金币收集动画
     
     Temple Run（2011）定义了模板：三车道 + 转向 + 障碍。
     Subway Surfers 加了垂直躲避（火车顶部）。
     Vector 加入了跑酷+忍者动作的混合。
     
     你的游戏想偏 Temple Run 类型还是偏 Vector 类型？

You: Temple Run 类型，但我想加一些平台跳跃元素，类似超级马里奥的关卡碎片

AI:  有意思——跑酷+平台跳跃混合，还没人做过这个组合。
     
     技术方案对比：
     方案 A: Unity + C# — 最成熟的 3D 游戏引擎，物理系统完善，
             Asset Store 有现成跑酷模板，但学习曲线陡峭，
             WebGL 导出包体大（通常 20MB+）
     方案 B: Three.js + Cannon.js — 纯 Web 技术栈，零安装，
             包体小（5MB 以内），但物理系统需要自己整合，
             跑酷模板需要从头写，你对 JS 生态熟
     方案 C: Phaser 3 — 2D 游戏框架最成熟选择，物理内置，
             跑酷天然适合 2D，平台跳跃元素更自然，但 3D 效果受限
     
     考虑到你提到的平台跳跃元素，2D 侧滚跑酷可能是更好的起点——
     先用 Phaser 验证跑酷+跳跃的核心循环，好玩再扩展。

You: 就用 Phaser 吧，2D 我也更喜欢。先从最简原型开始

AI:  最小原型定义：
     1 个场景：无限向右滚动的地面 + 3 条车道
     1 个角色：自动奔跑，tap 跳跃，左右切换车道
     3 种障碍：地面障碍（跳跃躲）、头顶障碍（滑铲躲）、
              间隙（跳跃过，平台跳跃感）
     1 个计分：按距离计分
     
     预期 2-3 天之内出一个可玩的 Web 原型。

# ——— 2. 拷打设计方向（matt）————————————————————————
You: /grill-me
AI:  [翻阅前面的探索结论，技术面试官式追问]
     Q1: 跳跃和滑铲的按键怎么区分？上滑跳、下滑铲？
     Q2: 障碍物之间最小间距多少？保证玩家能反应过来
     Q3: 难度曲线走线性、指数还是阶梯？
     Q4: 角色碰撞体积：紧贴 sprite 还是留一点宽容？
     Q5: 死亡动画时长？复活后几秒无敌时间？
     Q6: 移动端 touch 事件怎么映射——左半屏切道、右半屏跳跃？
     Q7: 帧率掉到 30fps 以下怎么处理？
     Q8: 背景视差滚动几层？性能预算多少？
     ... 共 21 个问题 ...
You: 上滑跳跃、下滑滑铲；障碍最小间距 = 角色速度 × 1.2s；
     线性难度；碰撞体积缩小 20% 宽容判定；1s 死亡动画 + 2s 无敌；
     左半屏左右切道、右半屏上划跳跃；低于 30fps 降低粒子特效；
     3 层视差背景，目标 60fps on mid-tier mobile

# ——— 3. 定型（第 1 次 slash command）————————————————
#      所有 grill 结论直接喂入 spec。显式指定名称；
#      省略时默认用项目目录名（如 cc-cleaner-tool）
You: /opsx:propose parkour-game
AI:  生成 openspec/changes/parkour-game/
     proposal.md  — 跑酷+平台跳跃混合，Phaser 3 实现
     design.md    — 模块：SceneManager / PlayerController /
                    ObstacleSpawner / ParallaxBackground /
                    ScoreManager / DifficultyCurve
                    上滑跳跃下滑滑铲，间距 1.2s，线性难度，
                    碰撞宽容 20%，3 层视差背景
     specs/       — 8 个场景：奔跑→跳跃→滑铲→切换车道→
                    障碍生成→难度递增→死亡复活→分数持久化
     tasks.md     — 15 个原子任务

# ——— 4. 实现（第 2 次 slash command）—————————————————
#      可省略名称，只有一个活跃 change 时自动推断
You: /opsx:apply
AI:  使用 change: parkour-game

     [TDD] 任务 1: Phaser 场景脚手架
     → 测试：场景初始化 → canvas 存在 → game loop 运行 → 通过 ✓

     [TDD] 任务 2: PlayerController
     → 测试：tap 跳跃 → 角色 y 先升后降（抛物线）→ 通过 ✓
     → 测试：左右划 → 角色 x 切换到目标车道 → 通过 ✓
     → 测试：滑铲 → hitbox 高度减半持续 400ms → 通过 ✓

     [TDD] 任务 3: ObstacleSpawner
     → 测试：障碍物以配置间隔生成 → 通过 ✓
     → 测试：连续 100 个障碍无重叠 → 通过 ✓

     ...

     任务 8: 集成测试 — 完整游戏循环
     → 启动 → 自动奔跑 → 跳跃过障碍 → 撞到障碍 → 死亡动画 →
        复活 → 分数正确累加 → 通过 ✓

     15/15 任务完成 ✓

# ——— 5. 预落地审查 ———————————————————————————
You: /review
AI:  [Staff Engineer 审查]
     ✓ 代码风格和一致性
     ⚠ ObstacleSpawner: 障碍物间距计算使用 Math.random()，可重复性差
       → 修复：改用 seedable PRNG，便于回放和调试
     ✓ 其余通过
     → git commit

# ——— 6. 浏览器验证 ———————————————————————————
You: /qa http://localhost:8750/games/parkour
AI:  [Chromium 浏览器]
     1. 加载游戏 → canvas 在 1.2s 内渲染 ✓
     2. tap 跳跃 → 角色跳跃动画流畅 ✓
     3. 滑铲 → 通过头顶障碍 ✓
     4. 左右切换车道 → 精确 ✓
     5. 撞上障碍 → 死亡动画播放 → 2s 后复活 ✓
     6. 连续 3 分钟游玩 → 帧率稳定 58-60fps ✓
     7. ⚠ iPhone SE 模拟器：第一次加载 3.2s，超过 2s 目标
        → 修复：Phaser 场景改为懒加载，首屏 1.4s
     8. ⚠ 连续切道 10 次后角色有概率卡在两个车道之间
        → 修复：tween 动画加 onComplete 回调锁
     2 个 bug 发现并修复 → git commit × 2

# ——— 7. 交付 ———————————————————————————————
#      /ship 需要在 feature branch 上，不在 main
You: /ship
AI:  同步 main → 跑 23 个测试（全部通过）→
     bump version → push → 创建 PR #331

# ——— 8. 收尾（第 3 次 slash command）————————————
You: /opsx:archive
AI:  Delta spec 合并到主 specs/ → 归档
     下一个功能：加上金币系统和道具商店。
```

> 注意：`/opsx:explore <描述>` ——slash command 后直接带自然语言，slash command 优先解析，brainstorming 不会拦截。不要先自然语言再补 slash command。

**什么时候用哪个入口**：

| 你的状态 | 入口 | 路径 |
|----------|------|------|
| 需求清晰，知道做什么，不需要 spec 归档 | 自然语言"帮我做X" | Superpowers |
| 需求较复杂，需要 spec 版本控制和审计 | `/opsx:propose` | OpenSpec |
| 方向像"症状"而非"方案" | `/office-hours` 先定方向，再选路径 | 先 gstack，后选 |
| 涉及多个设计决策，需要权衡 | 选路径后插入 `/grill-me` | 工具箱 |
| 对领域一无所知，需要先学习 | `/opsx:explore` | OpenSpec 探索 |

### 7.7 常见问题

**Q: 为什么不直接全装？**

全装后 Claude 的系统提示词塞进 80+ 条 skill description，每次对话消耗 token。更关键的，不同套装对同类任务有不同处理方式——Superpowers 说"先写测试"，matt 也开 `tdd`——Claude 不知道该听谁的。

**Q: 两条管线能混用吗？**

不能。同一功能如果先在 Superpowers 路径下产出了 `docs/superpowers/specs/` 和 `plans/`，再跑 `/opsx:propose` 生成 `openspec/changes/`，两份产物同时存在，Claude 后续"继续"时无法确定走哪条路。**一个功能选一条路，走到底。**

**Q: Superpowers 的 brainstorming 会和 OpenSpec 冲突吗？**

不会——只要入口选对了。`/opsx:propose` 是 slash command，优先级高于 brainstorming 的 auto-match。同时 OpenSpec 的 propose 自己产出了 design.md，满足了 brainstorming 的"设计先行"约束。反过来，如果走 Superpowers 入口（自然语言），brainstorming 接管后终端状态硬编码为 writing-plans，不会自动跳转 OpenSpec。

**Q: gstack `/review` 和 Superpowers `requesting-code-review` 怎么选？**

选 gstack `/review`。Staff Engineer 级审查，覆盖 SQL 安全、LLM 信任边界、条件性副作用；Superpowers 的版本是 5 个子代理并行审查，虽然仪式感更强但深度不如前者。PR 之前跑一次 `/review` 就够了。

**Q: OpenSpec 的 SKILL.md 会浪费 token 吗？**

4 个 SKILL.md 的 description 只在特定上下文匹配（"propose a change"、"continue implementation"、"explore mode"），在 Superpowers 路径的自然语言交互中通常不会误触发。相比全装 80+ 个 description 的情况，这 4 个额外开销可以忽略。


---

## 8 claude-mem 持久化记忆系统

claude-mem 是社区最流行的 CC 记忆增强插件，77k+ Stars，v13.3.0，Apache 2.0 许可。它弥补了 CC 内置 Auto Memory 在搜索、跨项目、全自动捕获方面的不足。

> 仓库地址：https://github.com/thedotmack/claude-mem

### 8.1 与内置 Auto Memory 对比

| | 内置 Auto Memory | claude-mem |
|------|------|------|
| **触发方式** | Claude 自己决定何时记录 | 6 个生命周期 Hook **全自动**捕获所有操作 |
| **存储** | 纯 Markdown 文件 | SQLite + FTS5 全文搜索 |
| **检索** | 无搜索，Claude 手工 Read | MCP 3 层渐进式搜索（语义 + 关键词） |
| **LLM 参与** | Claude 自由决定 | LLM 压缩摘要，额外 token 消耗 |
| **跨平台** | 仅 CC | CC、Gemini CLI、Codex、Copilot、OpenCode 等 |
| **Web UI** | 无 | `http://localhost:37777`（实际端口以 `~/.claude-mem/settings.json` 中的 `CLAUDE_MEM_WORKER_PORT` 为准） |
| **语言模式** | 无 | 30+ 语言模式（含 `code--zh` 中文） |
| **安装方式** | 内置，无需操作 | Plugin 市场安装 |
| **适用场景** | 轻度使用、个人知识库 | 日常大量编码、跨项目经验沉淀 |

### 8.2 安装

```bash
# 方式一：Plugin 市场（在 CC 会话中）
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem@thedotmack
/reload-plugins

# 方式二：npx 一键安装（终端）
npx claude-mem install
```

安装后**全自动运行**，无需手动操作。Hook 会在 `SessionStart`、`UserPromptSubmit`、`PostToolUse`、`Stop`、`SessionEnd` 等生命周期节点自动捕获操作。

### 8.3 核心架构

```
claude-mem
├── plugin/
│   ├── skills/ (15 个)         # mem-search、knowledge-agent、timeline-report 等
│   ├── hooks/hooks.json        # 6 个生命周期钩子
│   ├── .mcp.json               # MCP 搜索服务器（stdio 模式，3 层查询）
│   └── modes/ (30+ 种)         # code--zh、code--chill、email-investigation 等
├── src/                        # TypeScript 源码
│   ├── core/                   # session、memory-item、context-pack
│   ├── storage/                # SQLite + PostgreSQL 后端
│   ├── server/                 # Worker 服务（默认 37777）+ MCP 工具
│   └── services/               # 压缩、摘要、搜索
└── install                     # 一键安装脚本
```

**MCP 3 层渐进式搜索**（核心）：

| 层级 | 工具 | 返回 | Token 消耗 |
|------|------|------|-----------|
| 第 1 层 | `search` | 紧凑索引，~50-100 tokens/条 | 极低 |
| 第 2 层 | `timeline` | 指定观察周围的时序上下文 | 中等 |
| 第 3 层 | `get_observations` | 筛选后 ID 的完整详情，~500-1000 tokens/条 | 仅在需要时 |

典型流程：`search` 获取索引 → 识别相关 ID → `get_observations` 拉取详情，约 **10 倍 token 节省**。

### 8.4 15 个内置 Skills

| Skill | 用途 |
|------|------|
| `mem-search` | 自然语言搜索记忆 |
| `knowledge-agent` | 知识图谱构建和查询 |
| `timeline-report` | 生成时间线报告 |
| `smart-explore` | 智能代码库探索 |
| `pathfinder` | 路径和分析链路追踪 |
| `learn-codebase` | 学习代码库结构 |
| `make-plan` | 制定实施计划 |
| `weekly-digests` | 周报摘要 |
| `babysit` | 长时间任务监控 |
| `oh-my-issues` | Issue 分类和管理 |
| `design-is` | 设计文档辅助 |
| `wowerpoint` | PPT 生成 |

### 8.5 语言模式

修改 `~/.claude-mem/settings.json`（claude-mem 独立配置文件，**不是** `~/.claude/settings.json`）：

```json
{
  "CLAUDE_MEM_MODE": "code--zh"
}
```

支持 30+ 语言：`code--zh`（中文）、`code--ja`（日语）、`code--chill`（休闲模式）等。修改后重启 CC 生效。

### 8.6 副作用与注意事项

| 副作用 | 说明 |
|------|------|
| **额外 Token 消耗** | Hook 在 `PostToolUse` 后调用 LLM 压缩摘要，MCP 搜索也消耗 token。量不大但非零 |
| **Worker 常驻** | Bun 管理的 HTTP 服务（默认 37777），占少量内存和 CPU。实际端口查看 `~/.claude-mem/settings.json` |
| **隐私** | CC 中每次操作都被记录到 `~/.claude-mem/` 的 SQLite 数据库。可用 `<private>` 标签在提示中排除敏感内容 |
| **15 个 Skill 描述** | 每次会话启动注入上下文（累积几十行） |
| **依赖链** | 需要 Bun + Python/uv（安装脚本自动处理） |
| **端口冲突** | 如果 37777 被占用，修改 `~/.claude-mem/settings.json` → `CLAUDE_MEM_WORKER_PORT` | |

### 8.7 管理与禁用

```bash
# Web UI（浏览器打开）
http://localhost:37777

# 查看状态
claude plugin list

# 暂时停用（保留安装）
claude plugin disable claude-mem@thedotmack

# 重新启用
claude plugin enable claude-mem@thedotmack

# 彻底卸载（不会自动清理 ~/.claude-mem/ 数据目录）
claude plugin uninstall claude-mem@thedotmack
```

**注意事项**：

- **禁用不会自动停 Worker**：`disable` 只是不再加载 Hook 和 Skill，但已启动的 Worker 进程不会被杀掉。需要用 `kill` 手动关闭端口
- **启用不会立即启动 Worker**：`enable` + `/reload-plugins` 后 Worker 不会马上起来，需要开始一次对话（触发 `SessionStart` Hook）才会启动
- **卸载不删数据**：`uninstall` 不会清理 `~/.claude-mem/` 下的 SQLite 数据库和配置。想彻底清干净需要手动 `rm -rf ~/.claude-mem/`

### 8.8 选型建议

| 场景 | 推荐 |
|------|------|
| 轻度使用、个人知识库 | 内置 Auto Memory 足够 |
| 日常大量编码、多个项目 | claude-mem，全自动经验沉淀 |
| 不确定 | 先装，不喜欢随时 `disable` 或 `uninstall` |

安装 claude-mem **不会影响内置 Auto Memory**，两者可以共存。
