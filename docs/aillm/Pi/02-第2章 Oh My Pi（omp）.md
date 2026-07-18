# Oh My Pi（omp）

## 1 omp 是什么

### 1.1 项目背景

Oh My Pi（命令名 `omp`）是 Pi 的 fork，由 Can Bölük（[can1357](https://github.com/can1357)）在 Mario Zechner 的 [Pi](https://github.com/badlogic/pi-mono) 基础上扩展而来。官方站点 [omp.sh](https://omp.sh)，源码托管在 [github.com/can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)，MIT 许可证。

一句话定位：**A coding agent with the IDE wired in**——把 IDE 的能力（LSP、调试器、结构化编辑）直接接进终端编码代理。

### 1.2 与 Pi 的关系

| 维度 | Pi | omp |
|------|----|----|
| 理念 | Primitives, not features（提供原语，功能推给扩展）| Batteries included（开箱即用）|
| 核心工具 | 精简内置 + extensions/skills | 32 个内置工具 + extensions/skills |
| LSP | 无内置 | 14 个 LSP 操作内置 |
| 调试器 | 无 | 28 个 DAP 操作（lldb/dlv/debugpy）|
| Subagents | 无 | 一等公民 `task` 工具 |
| 运行时实现 | 依赖外部 rg/grep/find/bash | ripgrep/glob/find/brush 进程内嵌入 |
| Windows | 需 bash（Git Bash）| 原生支持，无需 WSL |
| 语言/运行时 | TypeScript（Node）| TypeScript + ~55k 行 Rust（Bun 运行时）|
| 包名 | `@earendil-works/pi-coding-agent` | `@oh-my-pi/pi-coding-agent` |

> **注意**：omp 是 Pi 的超集增强，而非替代。Pi 走极简路线，把工作流特定行为推到 extensions；omp 把实战中最常被「缺」的能力（subagents、LSP、debugger、browser、记忆）直接做进核心。两者配置目录不同（`~/.pi/` vs `~/.omp/`），可共存安装。

### 1.3 核心数据

- **40+** providers
- **32** 个内置工具
- **14** 个 LSP 操作
- **28** 个 DAP 操作
- **~55,000** 行 Rust 核心
- **25** 个 web_search 后端

## 2 安装 omp

### 2.1 官方安装脚本（推荐）

**macOS · Linux**：

```bash
$ curl -fsSL https://omp.sh/install | sh
```

**Windows（PowerShell）**：

```powershell
$ irm https://omp.sh/install.ps1 | iex
```

### 2.2 Homebrew

```bash
$ brew install can1357/tap/omp
```

### 2.3 Bun（推荐 npm 系）

```bash
$ bun install -g @oh-my-pi/pi-coding-agent
```

> **注意**：omp 依赖 Bun ≥ 1.3.14 运行时。使用 Bun 安装可保证运行时与包匹配。

### 2.4 mise（版本锁定）

```bash
$ mise use -g github:can1357/oh-my-pi
```

适合需要在多环境间锁定 omp 版本的场景。

### 2.5 Shell 补全

omp 从实时命令/flag 元数据生成补全脚本，永远与实际 CLI 同步。模型名（`--model`、`--smol`、`--slow`、`--plan`）解析内置模型目录，`--resume` 解析磁盘会话。

```bash
# zsh - 加到 ~/.zshrc
$ eval "$(omp completions zsh)"

# bash - 加到 ~/.bashrc
$ eval "$(omp completions bash)"

# fish
$ omp completions fish > ~/.config/fish/completions/omp.fish
```

### 2.6 验证

```bash
$ omp --version
```

## 3 核心增强特性

下面 18 项是 omp 相对 Pi 的主要增强，按官方 README 编号呈现。

### 3.1 代码执行与 tool-calling

大多数 harness 只给 agent 一个 Python 沙箱就完事。omp 运行**持久 Python** 和 **Bun worker**，任一内核都能通过回环桥回调 agent 自己的工具（`read`、`search`、`task`）。agent 可以在 Python 里用 `tool.read` 读 CSV，再从 JavaScript 出图，全程不离开单元格。

### 3.2 LSP 接入每次写入

请求 rename 就得到真正的 rename。调用走 `workspace/willRenameFiles`，re-export、barrel file、aliased import 在文件移动前就更新。**IDE 知道的，agent 也知道**。

### 3.3 驱动真实调试器

- C 二进制段错误：attach `lldb`，单步到坏指针，读栈帧
- Go 服务挂住：attach `dlv`，遍历 goroutine
- Python 进程卡死：`debugpy`，暂停、检查、求值

其他 agent 还在撒 `print` 语句时，omp 已经在走 DAP 协议。

### 3.4 Time-traveling stream rules（流式规则回溯）

你的规则平时休眠，直到模型偏离脚本。正则命中后**在 mid-token 阶段中止流**，把规则作为 system reminder 注入，从同一位置重试。课程纠偏不用为每轮付上下文税。注入在 compaction 后仍然存活，修复能持久。

### 3.5 一等公民 subagents

`task` 把工作分发到隔离 worktree，每个 worker 跑自己的工具面，最终 yield 一个 **schema 验证的对象**，父 agent 直接读取。无需解析散文，无兄弟间合并冲突，无孤儿编辑。

### 3.6 Advisor：第二个模型审查每轮

把一个 reviewer 模型配到 `advisor` 角色，它读主 agent 每一轮，内联注入笔记——轻声提醒、关切、或硬阻断。它跑在自己的上下文和自己的模型上，能抓到 doer 匆忙略过的东西。主 agent 看到笔记后纠偏，或告诉你为什么不改。

### 3.7 Collab：实时协作

`/collab` 把活会话放到 relay 上，返回一个链接和一个 QR。队友从另一个终端 `omp join` 加入，或直接在浏览器打开。可共享读写以结对同一 agent，或 `/collab view` 出只读链接让人围观但无法操纵。帧在客户端密封，relay 看不到你的密钥。

### 3.8 web_search：25 个后端链式

`web_search` 链接 18+ 排序 provider，把找到的 URL 直接交给 `read`。arXiv PDF、GitHub 页面、Stack Overflow 线程都回来为带锚点的结构化 markdown——和你本地文件用的是同一工具面。`auto` 走 25 provider 链，也可按名 pin 一个。

### 3.9 原生实现，连 Windows 也是

其他 agent shell out 到 rg、grep、find、bash。很多机器上这些二进制不存在；即使存在，每次调用都付一次 fork-exec 往返。omp 把真实实现链接进进程：ripgrep、glob、find 进程内；brush 是 bash，会话跨调用存活。同一个 omp 二进制跑在 macOS、Linux、Windows——**无需 WSL 桥**。

### 3.10 带优先级与裁决的 code review

`/review` 派生专门的 reviewer subagent，并行扫分支、单提交或未提交工作。给出明确裁决：这改动能不能 ship，每个问题按 P0–P3 排序并打置信度分。先解决阻塞发布的，重要的东西不会淹没在散文墙里。

### 3.11 Hashline：按内容哈希编辑

完美编辑，更少 token。模型指向锚点而非重打要改的行，空白战和 string-not-found 循环不再发生。编辑过期文件时锚点会偏离，patch 在损坏前就被拒绝。Grok 4 Fast 在同样工作下少花 **61% 输出 token**。

### 3.12 GitHub 只是另一个文件系统

其他 harness 拧上 `gh_issue_view`、`gh_pr_view`、`gh_search`——每个都有自己的参数，agent 要学、你要调。omp 跳过这些。`read` 已处理路径；PR 就是路径。教模型一个接口，保持一个面正确。

### 3.13 Hindsight：agent 自己策展的记忆

agent 在会话间记住你的代码库。它用 `retain` 中途写事实，用 `recall` 拉回，把每个会话压缩成一个心智模型，在下一次的首轮加载。默认按项目隔离，学到的东西跟着仓库走。

### 3.14 ACP：编辑器可驱动

在 Zed 里跑 omp，得到和终端同样的 agent——读你正看的 buffer，通过编辑器保存路径写，在编辑器终端起 shell。破坏性工具暂停等权限提示，你答一次就忘掉。无桥、无插件、无第二个要同步的脑子。

### 3.15 继承其他工具已写的配置

其他 agent 都 ship 一个 importer 要你转换。omp 直接读磁盘上已有的 8 种格式原样：Cursor MDC、Cline `.clinerules`、Codex `AGENTS.md`、Copilot `applyTo` 等。无迁移脚本，无 YAML-to-TOML 端口，无「支持子集」脚注。团队上季度写的配置今晚照样能用。

### 3.16 omp commit：原子分割 + 验证消息

omp 通过 `git_overview`、`git_file_diff`、`git_hunk` 读工作树，把不相关改动按依赖顺序拆成原子提交。循环依赖在写入前被拒。源文件得分高于测试、文档、配置，所以头条提交就是重要的那个。lock 文件完全排除在分析外。

### 3.17 12 种内部 scheme

`pr://`、`issue://`、`agent://`、`skill://`、`rule://` 等共 12 种内部 scheme，在每个 FS 形态的工具里透明解析。`read pr://1428` 返回和 `read src/foo.ts` 同样的形状。`search` 把 diff 当目录遍历。`agent://<id>/findings.0.path` 按路径从 subagent 输出里抽字段。

### 3.18 冲突解决 / AST 预览 / 浏览器

- **冲突解决**：每个合并冲突变成一个 URL。agent 写 `@theirs`/`@ours`/`@base` 到 `conflict://N`，文件干净解决。批量形式 `conflict://*`。
- **AST 编辑预览**：`ast_edit` 返回带替换数的 _proposed_ 卡片。变更暂存。agent 调 `resolve` 给理由；TUI 把它变成 **Accept** 卡，磁盘移动发生——原子，全有或全无。
- **真实浏览器**：默认开 stealth，页面看到正常用户而非 headless bot。同一 API 可驱动任何 Electron 应用——指向 Slack，agent 读你 DM 就像读 web。

## 4 32 个内置工具

32 个工具和 `read`、`bash` 同命名空间。用 `--tools read,edit,bash,…` pin 活动集；罕见可发现工具藏在 `xd://` 设备后。`read xd://` 列出，`write xd://<tool>` 在 `tools.xdev` 开启时运行一个。

### 4.1 Files & search

| 工具 | 说明 |
|------|------|
| `read` | 文件、目录、归档、SQLite、PDF、notebook、URL 及内部 `://` scheme，一个路径搞定 |
| `write` | 创建或覆盖文件、归档条目、SQLite 行 |
| `edit` | hashline patch，内容哈希锚点 + 过期锚点恢复 |
| `ast_edit` | 结构化重写，apply 前预览，基于 ast-grep |
| `ast_grep` | 50+ tree-sitter 语法的结构化代码查询 |
| `search` | 跨文件、glob、内部 URL 的正则 |
| `find` | glob 路径查找；要内容匹配用 `search` |

### 4.2 Runtime

| 工具 | 说明 |
|------|------|
| `bash` | 工作区 shell，可选 PTY 或后台作业分发 |
| `eval` | 持久 Python 和 JavaScript 单元格，共享 prelude + 工具重入 |
| `ssh` | 对配置主机跑一条远程命令 |

### 4.3 Code intelligence

| 工具 | 说明 |
|------|------|
| `lsp` | 诊断、导航、符号、rename、code action、原始请求（14 操作）|
| `debug` | 驱动 DAP 会话——断点、单步、线程、栈、变量（28 操作）|

### 4.4 Coordination

| 工具 | 说明 |
|------|------|
| `task` | 并行分发 subagent，可选工作区隔离 |
| `hub` | 给活 agent 发消息、等/取消后台作业、监督长跑进程 |
| `todo` | 会话 todo 列表的有序变更 + 阶段追踪 |
| `ask` | 交互运行的结构化追问 |

### 4.5 Outside the box

| 工具 | 说明 |
|------|------|
| `browser` | headless Chromium 或 CDP attach 应用的 Puppeteer 标签页 |
| `web_search` | 跨配置 provider 一次查询，返回答案 + 引用 |
| `github` | GitHub CLI 操作——repo、PR、issue、code search、Actions run-watch |
| `generate_image` | 通过 Gemini/GPT/xAI Grok 图像模型生成或编辑位图 |
| `inspect_image` | 视觉模型分析本地图像文件 |
| `tts` | xAI Grok Voice 文本转语音——5 内置语音，WAV 或 MP3 |

### 4.6 Memory & state

| 工具 | 说明 |
|------|------|
| `checkpoint` | 标记会话状态供后续 collapse-and-report |
| `rewind` | 修剪探索性上下文，保留简洁报告 |
| `retain` | 把持久事实入队到活动 Hindsight bank |
| `recall` | 搜索 Hindsight bank 取原始记忆 |
| `reflect` | 让 Hindsight 跨 bank 合成答案 |

### 4.7 Misc

| 工具 | 说明 |
|------|------|
| `resolve` | 应用或丢弃排队的预览动作 |

> **注意**：`github`、`inspect_image`、`tts`、`checkpoint`、`rewind`、`retain`、`recall`、`reflect` 默认关闭，需在设置里开启，按项目 scope。

## 5 Provider 与模型路由

### 5.1 四种角色路由

角色按意图路由工作：

| 角色 | 用途 |
|------|------|
| `default` | 正常轮 |
| `smol` | 便宜的 subagent 分发 |
| `slow` | 深度推理 |
| `plan` | plan 模式 |
| `commit` | changelog |

启动时用 `--smol`、`--slow`、`--plan` 覆盖；`Ctrl+P` 循环当前角色的配置模型；`/model` 会话中切换。

### 5.2 40+ Provider 分类

| 类别 | Provider |
|------|----------|
| Frontier API | Anthropic `oauth` · OpenAI · OpenAI Codex `oauth` · Google Gemini · Google Antigravity `oauth` · xAI · Mistral · Groq · Cerebras · Fireworks · Together · Hugging Face · NVIDIA · OpenRouter · Synthetic · Vercel AI Gateway · Cloudflare AI Gateway · Wafer Serverless · Perplexity `oauth` |
| Coding 订阅 | Cursor `oauth` · GitHub Copilot `oauth` · GitLab Duo · Kimi Code `plan` · Moonshot · MiniMax Coding Plan `plan` · Alibaba Coding Plan `plan` · Qwen Portal · Z.AI/GLM Coding Plan `plan` · Xiaomi MiMo · Qianfan · NanoGPT · Novita · Venice · Kilo · ZenMux · OpenCode Go · OpenCode Zen |
| 自托管 | Ollama `local` · Ollama Cloud · LM Studio `local` · llama.cpp `local` · vLLM `local` · LiteLLM |

### 5.3 路由四旋钮

- **Custom providers**：在 `~/.omp/agent/models.yml` 声明任何说 `openai-completions`/`openai-responses`/`openai-codex-responses`/`azure-openai-responses`/`anthropic-messages`/`google-generative-ai`/`google-vertex` 的端点
- **Fallback chains**：`retry.fallbackChains` 下按角色或按模型的链。主端 429 或撞配额墙时，下一个接手本轮，冷却后恢复
- **Path-scoped models**：把 `enabledModels`/`disabledProviders` 条目 scope 到 `path:` 前缀，在一个 repo 上 pin 不同模型集而不动全局配置
- **Round-robin credentials**：每 provider 堆多个 API key，运行时按会话亲和 + 每凭证退避轮转。一个 key 午饭前就烧配额时有用

## 6 Prompt 控制关键词

三个独立小写词让一轮进入专门 agent 行为：

| 关键词 | 行为 |
|--------|------|
| `ultrathink` | 请求仔细多步推理 + 最高支持自动 thinking 强度 |
| `orchestrate` | 通过并行 subagent 跑大量独立工作并验证每阶段 |
| `workflowz` | 用活动 `task` 工具构建确定性多 subagent 工作流 |

> **注意**：只在散文中触发，不在 code span、fenced 代码块、XML/HTML 段、标识符、路径里触发。

## 7 四种入口

同一引擎，四个包装。

### 7.1 Interactive（TUI）

默认面。工具调用渲染为卡片，编辑落地前预览，歧义走 `ask` 工具——一个结构化选项选择器，agent 可在轮中调用。同样的 prompt 卡片在 ACP 上也出现，编辑器无需自己写选择器。

### 7.2 One-shot

```bash
$ omp -p "Summarize this codebase"
```

答一个 prompt 就退出。

### 7.3 RPC

```bash
$ omp --mode rpc --no-session
> {"id":"r1","type":"prompt","message":"list .ts files"}
< {"id":"r1","type":"response", ...}
> {"id":"r2","type":"set_model","provider":"anthropic","modelId":"sonnet-4.5"}
> {"id":"r3","type":"abort"}
```

非 Node 嵌入器或要进程隔离时用。NDJSON 命令进，响应和事件帧出。`--mode rpc-ui` 加工具卡、选择器、对话框为 `extension_ui_request` 帧，宿主必须应答。

### 7.4 ACP（编辑器协议）

```bash
$ omp acp
```

[Agent Client Protocol](https://github.com/zed-industries/agent-client-protocol) over JSON-RPC。编辑器广告能力时，工具 I/O 走它，写入由 `session/request_permission` 门控。

| omp 工具 | ACP 路由 |
|----------|----------|
| `bash` | `terminal/create + terminal/output` |
| `read` | `fs/read_text_file` |
| `write` | `fs/write_text_file` |
| `edit, bash` | `session/request_permission` |

### 7.5 SDK（嵌入 Node）

```ts
import {
  ModelRegistry,
  SessionManager,
  createAgentSession,
  discoverAuthStorage,
} from "@oh-my-pi/pi-coding-agent";

const auth = await discoverAuthStorage();
const models = new ModelRegistry(auth);
await models.refresh();

const { session } = await createAgentSession({
  sessionManager: SessionManager.inMemory(),
  authStorage: auth,
  modelRegistry: models,
});
await session.prompt("list .ts files");
```

包暴露 `ModelRegistry`、`SessionManager`、`createAgentSession`、`discoverAuthStorage`；session 发类型化事件供订阅。

## 8 Rust 核心

~55,000 行 Rust，做其他 harness shell out 的工作。四 crate + 一个平台 tag 的 N-API addon。search、shell、AST、highlight、PTY、图像解码、BPE 计数——全在 libuv 池进程内。热路径无 fork/exec。

| 模块 | 作用 | 驱动 | ~LoC |
|------|------|------|----:|
| shell | 嵌入 bash · 持久会话 · 超时/中止 · 自定义 builtin | brush-shell（vendored）| 3,700 |
| grep | 正则搜索 · 并行/串行 · glob & 类型过滤 · 模糊查找 | grep-regex · grep-searcher | 1,900 |
| keys | Kitty 键盘协议 + xterm 回退 · PHF 完美哈希查找 | phf | 1,490 |
| text | ANSI 感知宽度 · 截断 · 列切片 · SGR 保留换行 | unicode-width · segmentation | 1,450 |
| summary | tree-sitter 结构化源码摘要 + 省略控制 | tree-sitter · ast-grep-core | 1,040 |
| ast | ast-grep 模式匹配 + 结构化重写 | ast-grep-core | 1,000 |
| fs_cache | mtime 键文件缓存，read/grep/lsp 共享 | in-tree | 840 |
| highlight | 语法高亮 · 11 语义类 · 30+ 别名 | syntect | 470 |
| pty | 原生 PTY 分配，用于 sudo/ssh 交互提示 | portable-pty | 455 |
| glob | 发现 · glob · 类型过滤 · mtime 排序 · gitignore | ignore · globset | 410 |
| workspace | 工作区遍历 + gitignore + AGENTS.md 一次过 | ignore | 385 |
| iso | 工作区隔离 shim · apfs/btrfs/zfs/reflink/overlayfs/projfs/rcopy | pi-iso (PAL) | 245 |
| tokens | O200k/Cl100k BPE token 计数 · 两表内嵌 | tiktoken-rs | 65 |
| sixel | 终端图像渲染 · 解码 PNG/JPEG/WebP/GIF · SIXEL 编码 | icy_sixel · image | 55 |

支持平台：`linux-x64`、`linux-arm64`、`darwin-x64`、`darwin-arm64`、`win32-x64`。

## 9 omp vs Pi：选型建议

### 9.1 理念差异

- **Pi**：Primitives, not features。核心只提供原语，工作流特定行为推到 extensions/skills/packages。故意不内置 MCP、sub-agents、权限弹窗、plan mode、to-dos、后台 bash。
- **omp**：Batteries included。把实战中 Pi 用户最常自己补的能力（subagents、LSP、debugger、browser、记忆、code review）直接做进核心，追求「开箱即用，不轻易被超越」。

### 9.2 何时选 Pi

- 你喜欢极简核心，愿意自己组装工作流
- 你重度依赖 skills 跨 harness 兼容（Claude Code/Codex skills 直接复用）
- 你不想装 Bun/Rust addon，只想要轻量 Node 包
- 你的环境资源受限，或不需要 LSP/debugger/browser 等重能力

### 9.3 何时选 omp

- 你做大型代码库重构，需要 LSP rename/references 精准落地
- 你调试 native/Go/Python 程序，需要真实 DAP 而非 print
- 你要并行 subagent 隔离 worktree 跑独立任务
- 你在 Windows 上工作，不想配 WSL
- 你要 advisor 双模型审查、Hindsight 跨会话记忆、`omp commit` 原子提交
- 你愿意为这些能力接受更重的安装（Bun + Rust addon）

### 9.4 共存与迁移

两者配置目录分离（`~/.pi/` vs `~/.omp/`），可同机共存。omp 首次运行会继承磁盘上已有的 Pi/Cursor/Cline/Codex/Copilot 配置，无需迁移脚本。从 Pi 切到 omp 基本零成本；从 omp 回 Pi 则需手动补齐 omp 内置能力的 extension 替代。

> **注意**：omp 的包名是 `@oh-my-pi/pi-coding-agent`，命令是 `omp`；Pi 的包名是 `@earendil-works/pi-coding-agent`，命令是 `pi`。两者不冲突。