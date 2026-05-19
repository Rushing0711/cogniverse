# DeepSeek V4 Flash (ds4) 本地安装使用

https://github.com/antirez/ds4

ds4 是专为 DeepSeek V4 Flash 打造的本地推理引擎，自包含、不依赖其他运行时，支持 Metal（macOS）/ CUDA（Linux）。

## 0 前置条件

- Mac M4，macOS 15+
- 内存 >= 96GB（q2-imatrix 模型 ~81GB）
- Git、Make、Xcode CLI tools（需要 Metal 编译支持）

## 1 安装

### 1.1 克隆仓库

```bash
$ git clone https://github.com/antirez/ds4.git
$ cd ds4
```

### 1.2 编译

macOS 下直接 `make`，编译出 4 个二进制文件：

```bash
$ make
```

编译产物：

| 二进制 | 用途 |
|--------|------|
| `ds4` | CLI 交互式对话 |
| `ds4-server` | HTTP API 服务（对接 Claude Code 等 agent） |
| `ds4-bench` | 性能基准测试 |
| `ds4-eval` | 能力评测 |

### 1.3 下载模型

<span style="color:red;font-weight:bold;">模型文件约 81GB，确保磁盘空间充足</span>

```bash
# Mac M4 + 96/128GB 内存推荐 q2-imatrix（2-bit 量化，仅量化 routed MoE experts）
$ ./download_model.sh q2-imatrix

# 256GB+ 内存可选 q4-imatrix
$ ./download_model.sh q4-imatrix
```

脚本从 HuggingFace 下载到 `./gguf/` 目录，并自动创建软链接 `./ds4flash.gguf`。

> **不需要 HuggingFace Token**，公开下载即可。如需认证：`./download_model.sh q2-imatrix --token YOUR_HF_TOKEN`

## 2 CLI 命令行使用

### 2.1 一次性问答

```bash
$ ./ds4 -p "Explain Redis streams in one paragraph."
```

### 2.2 交互模式

```bash
$ ./ds4
ds4>
```

交互命令：

| 命令 | 作用 |
|------|------|
| `/help` | 显示帮助 |
| `/think` | 开启思考模式（默认） |
| `/nothink` | 关闭思考模式，直接回答 |
| `/think-max` | Think Max 模式（需 `--ctx >= 393216`） |
| `/ctx N` | 重新分配上下文窗口为 N |
| `/read FILE` | 读取文件作为 prompt 发送 |
| `/quit` 或 `/exit` | 退出 |
| `Ctrl+C` | 停止当前生成，回到 `ds4>` |

### 2.3 常用参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `-m, --model FILE` | `ds4flash.gguf` | 模型文件路径 |
| `-c, --ctx N` | `32768` | 上下文窗口大小 |
| `-n, --tokens N` | `50000` | 最大生成 token 数 |
| `--temp F` | `1` | 采样温度，0 = 贪婪解码 |
| `--top-p F` | `1` | 核采样概率 |
| `--min-p F` | `0.05` | 最小概率阈值 |
| `--seed N` | 随机 | 采样种子，用于可复现生成 |
| `-p, --prompt TEXT` | - | 一次性 prompt |
| `--prompt-file FILE` | - | 从文件读取 prompt |
| `-sys, --system TEXT` | `You are a helpful assistant` | 系统提示词 |
| `--nothink` | off | 禁用思考模式 |
| `--think-max` | off | Think Max 模式 |
| `--metal` | macOS 默认 | 使用 Metal 后端 |
| `--cpu` | off | CPU 后端（仅调试用） |
| `--quality` | off | 使用精确 kernel（速度略慢） |

### 2.4 调试参数

```bash
# 查看 token 化结果
$ ./ds4 --dump-tokens -p "你的 prompt"

# 导出 top-k logprobs（贪婪解码）
$ ./ds4 --dump-logprobs /tmp/out.json --logprobs-top-k 20 --temp 0 -p "..."

# 查看模型结构摘要
$ ./ds4 --inspect
```

> **注意**：macOS 上不要用 `--cpu` 跑大模型，当前 macOS 内核 VM 存在 bug 会导致系统崩溃。

## 3 对接 Claude Code

### 3.1 启动 ds4-server

```bash
$ ./ds4-server \
    --ctx 100000 \
    --kv-disk-dir /tmp/ds4-kv \
    --kv-disk-space-mb 8192
```

关键参数：

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `--ctx N` | `32768` | 上下文窗口，建议 100000+ |
| `--host HOST` | `127.0.0.1` | 绑定地址 |
| `--port N` | `8000` | 绑定端口 |
| `--kv-disk-dir DIR` | 无 | 启用磁盘 KV 缓存 |
| `--kv-disk-space-mb N` | `4096` | 磁盘缓存上限（MB） |
| `--cors` | off | 添加 CORS 头（浏览器客户端用） |
| `--trace FILE` | 无 | 输出完整 session 日志 |
| `--chdir DIR` | 当前目录 | 切换工作目录（从其他目录启动时用） |

<span style="color:red;font-weight:bold;">磁盘 KV 缓存强烈建议开启</span>，Claude Code 首轮 prompt 通常 ~25k tokens，缓存后可避免每次 prefill。

### 3.2 Claude Code wrapper 脚本

创建 `~/bin/claude-ds4`：

```bash
#!/bin/sh
unset ANTHROPIC_API_KEY

export ANTHROPIC_BASE_URL="http://127.0.0.1:8000"
export ANTHROPIC_AUTH_TOKEN="dsv4-local"
export ANTHROPIC_MODEL="deepseek-v4-flash"
export ANTHROPIC_CUSTOM_MODEL_OPTION="deepseek-v4-flash"
export ANTHROPIC_CUSTOM_MODEL_OPTION_NAME="DeepSeek V4 Flash local ds4"
export ANTHROPIC_CUSTOM_MODEL_OPTION_DESCRIPTION="ds4.c local GGUF"
export ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-flash"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
export ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-flash"
export CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
export CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK=1
export CLAUDE_STREAM_IDLE_TIMEOUT_MS=600000

exec "$HOME/.local/bin/claude" "$@"
```

```bash
$ chmod +x ~/bin/claude-ds4
```

### 3.3 使用

```bash
# 先启动 ds4-server（另一个终端）
$ ./ds4-server --ctx 100000 --kv-disk-dir /tmp/ds4-kv --kv-disk-space-mb 8192

# 再启动 Claude Code
$ claude-ds4
```

<span style="color:red;font-weight:bold;">首次 Claude Code 会发送 ~25k tokens 的系统 prompt，需要耐心等待首次 prefill</span>。之后 KV 缓存生效，后续请求会快很多。

### 3.4 内存参考

| 配置 | 模型大小 | 推荐上下文 | 内存占用参考 |
|------|----------|-----------|-------------|
| q2-imatrix | ~81GB | 100K | ~90GB |
| q2-imatrix | ~81GB | 250K | ~100GB（96GB 机器需关闭其他进程） |
| q4-imatrix | ~153GB | 100K+ | 需 256GB+ 机器 |

完整 1M 上下文需要约 26GB 额外内存（压缩 indexer 约 22GB），128GB 机器建议上下文 <= 300K。

## 4 ds4-bench 性能基准测试

测量不同上下文长度下的 prefill 和生成吞吐量。按固定步长递增上下文，每个前沿点生成固定 token 数，输出 CSV。

### 4.1 基本用法

```bash
$ ./ds4-bench \
    -m ds4flash.gguf \
    --prompt-file speed-bench/promessi_sposi.txt \
    --ctx-start 2048 \
    --ctx-max 65536 \
    --step-incr 2048 \
    --gen-tokens 128
```

`speed-bench/promessi_sposi.txt` 是项目自带的长文本（意大利小说《约婚夫妇》），用于填充上下文。

### 4.2 参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `--prompt-file FILE` | 必填 | 基准测试文本 |
| `--chat-prompt-file FILE` | - | 将 FILE 渲染为 chat user message 后切片 |
| `-m, --model FILE` | `ds4flash.gguf` | 模型文件 |
| `--ctx-start N` | `2048` | 起始测量前沿 |
| `--ctx-max N` | `32768` | 结束测量前沿 |
| `--ctx-alloc N` | ctx-max + gen-tokens + 1 | 分配的上下文大小 |
| `--step-incr N` | `2048` | 线性步长 |
| `--step-mul F` | `1` | 乘法步长（设为 2 则为指数扫描） |
| `--gen-tokens N` | `128` | 每个前沿点生成的 token 数 |
| `--csv FILE` | stdout | CSV 输出路径 |

### 4.3 输出

CSV 每行一个前沿点：prefill 间隔 token/s、该前沿生成 token/s、`kvcache_bytes`。

```bash
# 输出到文件
$ ./ds4-bench --prompt-file speed-bench/promessi_sposi.txt --csv /tmp/bench.csv

# 指数扫描
$ ./ds4-bench --prompt-file speed-bench/promessi_sposi.txt --step-mul 2 --ctx-start 2048 --ctx-max 65536
```

## 5 ds4-eval 能力评测

内置 92 道高质量题目（GPQA Diamond 25 + SuperGPQA 25 + AIME 2025 25 + COMPSEC 17），用于回归测试——检测 kernel/量化/prompt 渲染变化后模型能力是否下降。**不是跑分工具**。

### 5.1 基本用法

```bash
$ ./ds4-eval -m ds4flash.gguf --trace /tmp/ds4-eval.txt
```

### 5.2 TUI 操作

启动后进入分屏界面：左侧题目列表，右侧实时生成。

| 操作 | 作用 |
|------|------|
| `Up/Down` | 选择题目 |
| `Enter` | 运行选中题目 |
| `p` | 暂停 / 继续 |
| `q` | 退出并打印报告 |

### 5.3 参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `-m, --model FILE` | `ds4flash.gguf` | 模型文件 |
| `-n, --tokens N` | `16000` | 每题最大生成 token 数 |
| `--questions N` | 全部 | 只跑前 N 道题 |
| `--temp F` | `0` | 采样温度，默认贪婪解码 |
| `--think` | 默认 | 启用思考模式 |
| `--nothink` | off | 禁用思考模式 |
| `--trace FILE` | 无 | 输出题目、回答和评分详情 |
| `--plain` | off | 禁用分屏 UI，纯文本输出 |
| `--soft-limit-reply-budget N` | `1024` | 最后 N tokens 内若 `</think>` 进入 top 则关闭思考 |
| `--hard-limit-reply-budget N` | `512` | 留 N tokens 给回答，强制输出 `</think>` |

### 5.4 题目组成

| 数据集 | 数量 | 说明 |
|--------|------|------|
| GPQA Diamond | 25 | 研究生级科学多选题 |
| SuperGPQA | 25 | 跨领域专业知识（经筛选去重） |
| AIME 2025 | 25 | 数学竞赛精确答案题 |
| COMPSEC | 17 | C/C++ 单函数安全漏洞定位 |

不是每道题都能做对，目标是跑完一套题确认能力无回归（regression，即改动代码后模型能力下降）。例如改了 kernel 或量化参数，改前跑一遍、改后跑一遍，分数没掉说明改动未引入退化。
