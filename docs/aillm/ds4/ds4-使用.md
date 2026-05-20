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

### 4.4 测试

```bash
% ./ds4-bench \
    -m ds4flash.gguf \
    --prompt-file speed-bench/promessi_sposi.txt \
    --ctx-start 2048 \
    --ctx-max 65536 \
    --step-incr 2048 \
    --gen-tokens 128
ds4-bench: context buffers 1311.89 MiB (ctx=65665, backend=metal, prefill_chunk=2048, raw_kv_rows=2304, compressed_kv_rows=16418)
ds4: Metal device Apple M4 Max, 128.00 GiB RAM
ds4: requesting Metal residency (may take tens of seconds)... done
ds4: warming Metal model views... done
ds4: Metal model views created in 2.078 ms, residency requested in 28146.643 ms, warmup 3.410 ms (mapped 82697.67 MiB from offset 5.08 MiB)
ds4: Metal mapped mmaped model as 2 overlapping shared buffers
ds4: metal backend initialized for graph diagnostics
ctx_tokens,prefill_tokens,prefill_tps,gen_tokens,gen_tps,kvcache_bytes
2048,2048,312.46,128,25.24,52184460
4096,2048,285.54,128,25.55,80373132
6144,2048,284.46,128,25.01,108561804
8192,2048,271.50,128,25.23,136750476
10240,2048,264.92,128,24.99,164939148
12288,2048,264.76,128,24.90,193127820
14336,2048,264.34,128,24.62,221316492
16384,2048,269.83,128,24.62,249505164
18432,2048,266.68,128,24.27,277693836
20480,2048,263.62,128,24.40,305882508
22528,2048,260.03,128,24.22,334071180
24576,2048,257.64,128,24.17,362259852
26624,2048,252.39,128,23.84,390448524
28672,2048,248.99,128,23.90,418637196
30720,2048,244.02,128,23.61,446825868
32768,2048,236.58,128,23.58,475014540
34816,2048,225.99,128,23.16,503203212
36864,2048,219.62,128,22.99,531391884
38912,2048,214.70,128,22.73,559580556
40960,2048,209.36,128,22.55,587769228
43008,2048,203.81,128,22.15,615957900
45056,2048,198.78,128,21.96,644146572
47104,2048,196.72,128,21.56,672335244
49152,2048,193.40,128,21.57,700523916
51200,2048,190.75,128,21.45,728712588
53248,2048,190.03,128,21.52,756901260
55296,2048,187.16,128,21.34,785089932
57344,2048,186.59,128,21.35,813278604
59392,2048,183.71,128,21.17,841467276
61440,2048,183.78,128,21.16,869655948
63488,2048,180.66,128,21.01,897844620
65536,2048,180.68,128,20.94,926033292
```

```bash
⏺ M4 Max (128GB) + q2-imatrix 性能分析：        

  Prefill（上下文处理速度）                                                                                                                                                                                          
   
  从 312 t/s（2K 上下文）逐步降到 181 t/s（65K），降幅约 42%。下降是线性的，每增加 10K 上下文大约降 20 t/s。预估值：                                                                                                 
                                                            
  ┌──────────────────┬──────────┐                                                                                                                                                                                    
  │      上下文      │ Prefill  │                           
  ├──────────────────┼──────────┤                                                                                                                                                                                    
  │ 2K               │ 312 t/s  │                           
  ├──────────────────┼──────────┤                                                                                                                                                                                    
  │ 32K              │ 237 t/s  │                                                                                                                                                                                    
  ├──────────────────┼──────────┤                                                                                                                                                                                    
  │ 65K              │ 181 t/s  │                                                                                                                                                                                    
  ├──────────────────┼──────────┤                                                                                                                                                                                    
  │ 100K（你的配置） │ ~153 t/s │                           
  └──────────────────┴──────────┘                                                                                                                                                                                    
                                                            
  这意味着 Claude Code 首次发送 ~25K 系统 prompt 时，prefill 大约需要 25000 / 237 ≈ 105 秒（不到 2 分钟）。                                                                                                          
                                                            
  Generation（生成速度）                                                                                                                                                                                             
                                                            
  几乎不受上下文影响，从 25.24 t/s 到 20.94 t/s，仅降 17%。始终稳定在 21-25 t/s 区间。                                                                                                                               
                                                            
  总结                                                                                                                                                                                                               
                                                            
  M4 Max + q2-imatrix:                                                                                                                                                                                               
    Prefill:  312→181 t/s（上下文越大越慢，访问更多 KV cache 页）                                                                                                                                                    
    Generate: ~24 t/s（稳定，计算瓶颈而非内存瓶颈）                                                                                                                                                                  
                                                                                                                                                                                                                     
  M4 Max 带这个模型很轻松，生成速度几乎不衰减。主要等待时间在首次 prefill，之后对话体验顺畅。
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

### 5.5 测试

```bash
% ./ds4-eval -m ds4flash.gguf --trace /tmp/ds4-eval.txt
ds4: Metal device Apple M4 Max, 128.00 GiB RAM
ds4: requesting Metal residency (may take tens of seconds)... done
ds4: warming Metal model views... done
ds4: Metal model views created in 2.380 ms, residency requested in 2097.895 ms, warmup 3.985 ms (mapped 82697.67 MiB from offset 5.08 MiB)
ds4: Metal mapped mmaped model as 2 overlapping shared buffers
ds4: metal backend initialized for graph diagnostics
ds4-eval: context auto-sized to 16777 tokens (largest prompt=777 tokens, case=70, generation budget=16000)
ds4-eval: context buffers 479.38 MiB (ctx=16777, backend=metal, prefill_chunk=2048, raw_kv_rows=2304, compressed_kv_rows=4196)
ds4-eval: 76/92 passed, 16 failed, runtime 07h:51m
#   state      prompt      gen    total given    correct  test
  1 PASSED        201     5886     6087 B        B        GPQA Diamond/recNu3MXkvWUzHZr9
  2 PASSED        149      792      941 C        C        SuperGPQA/001b51d76b4d422988f2c11f104a2c6c
  3 PASSED         81     1010     1091 70       70       AIME2025/aime2025-01
  4 PASSED        313    15777    16090 C        C        GPQA Diamond/recoiTJPGUmzAkief
  5 PASSED        272     2542     2814 J        J        SuperGPQA/b7e20eac98764fb0bf30e8366d951daa
  6 PASSED        146     1317     1463 468      468      AIME2025/aime2025-16
  7 PASSED        156     1333     1489 B        B        GPQA Diamond/rec4UqStf9WUVif1f
  8 PASSED        127      805      932 E        E        SuperGPQA/4a1d1780a93f4093b6fb7d3c314cbea8
  9 PASSED        633    12980    13613 588      588      AIME2025/aime2025-02
 10 PASSED        182     1436     1618 B        B        GPQA Diamond/recgI6tUQ7RLJRWGx
 11 PASSED        137      580      717 A        A        SuperGPQA/6082513c8dba4ec68aa68f1bf5854d09
 12 PASSED        165     2053     2218 16       16       AIME2025/aime2025-03
 13 PASSED        149    15861    16010 A        A        GPQA Diamond/recDytVnNYZe2HuUU
 14 PASSED        167      225      392 J        J        SuperGPQA/bebf1ed45ae14ad7b4f205f3909cb58a
 15 PASSED        305     7946     8251 82       82       AIME2025/aime2025-18
 16 PASSED        131     1509     1640 D        D        GPQA Diamond/recNFJjE5PPTqVJGv
 17 PASSED        175      564      739 I        I        SuperGPQA/7ca71b86327744b78e93185a45bc5cef
 18 PASSED        102     2318     2420 117      117      AIME2025/aime2025-04
 19 PASSED        187     2272     2459 B        B        GPQA Diamond/rec2UlKqC6RFHdcro
 20 PASSED        173     1795     1968 E        E        SuperGPQA/d44b94f7749345a39a65f6312bda8764
 21 PASSED        229     3011     3240 106      106      AIME2025/aime2025-19
 22 PASSED        250      766     1016 B        B        GPQA Diamond/recv7GsQg3f0fvB1f
 23 PASSED        232      860     1092 B        B        SuperGPQA/febe406f44d74a40b50bb5b7c69d5dc1
 24 PASSED        126    11644    11770 279      279      AIME2025/aime2025-05
 25 PASSED        229     7524     7753 C        C        GPQA Diamond/recrHBEJJoDTV05JR
 26 PASSED        160      624      784 C        C        SuperGPQA/31950dc80ded400a9181f50626d1f75c
 27 PASSED        124     2009     2133 504      504      AIME2025/aime2025-06
 28 FAILED        198    15718    15916 A        D        GPQA Diamond/recb80OwMgNnceA9t
 29 PASSED        602     4863     5465 C        C        SuperGPQA/0f14cd17be174618af6d60227e7dca9f
 30 PASSED        753     5275     6028 293      293      AIME2025/aime2025-21
 31 PASSED        254    15623    15877 C        C        GPQA Diamond/recA1i5ZAh0Uzclxp
 32 PASSED        394     2516     2910 J        J        SuperGPQA/cef9bcc087434cc2b4e354a9baef55eb
 33 FAILED        196    16000    16196 7        821      AIME2025/aime2025-07
 34 PASSED        216     5076     5292 B        B        GPQA Diamond/recqGD3fxPCI59vPQ
 35 PASSED        159      317      476 I        I        SuperGPQA/9f93aa2cfdb547b5b3a4623f80f7fff6
 36 PASSED        137     3992     4129 237      237      AIME2025/aime2025-22
 37 PASSED        306    10946    11252 A        A        GPQA Diamond/rechKl68Uc6H7vU0N
 38 PASSED        157      582      739 E        E        SuperGPQA/97ad69dda7b2462c98638b79e78aea0b
 39 PASSED        156     2841     2997 77       77       AIME2025/aime2025-08
 40 PASSED        369     1254     1623 B        B        GPQA Diamond/rec1zl5LvaatzGhFt
 41 FAILED        128      406      534 E        H        SuperGPQA/e78e4e539d6f4e379ac140d923d7b1be
 42 FAILED        147    16000    16147 0        62       AIME2025/aime2025-09
 43 PASSED        585     4774     5359 A        A        GPQA Diamond/recTs7qzfJs6kfLUK
 44 PASSED        182     8991     9173 A        A        SuperGPQA/8483667a25e74fdfa3188de4ea734f03
 45 FAILED        140    16000    16140 4        149      AIME2025/aime2025-24
 46 PASSED        238    12771    13009 C        C        GPQA Diamond/rec32C1ZEapBnCC0E
 47 PASSED        153     1033     1186 A        A        SuperGPQA/e5ed76ef98144f06843125daf1bccd35
 48 FAILED        335    16000    16335 2        81       AIME2025/aime2025-10
 49 PASSED        225    15902    16127 B        B        GPQA Diamond/recZWeueB7lSPR6wN
 50 PASSED        127      826      953 H        H        SuperGPQA/fd7924876c4845cd83d95d61dfa0b236
 51 PASSED        117    13599    13716 907      907      AIME2025/aime2025-25
 52 FAILED        115    16000    16115 A        C        GPQA Diamond/recVvpD8miVjmmyfe
 53 PASSED        336     3473     3809 I        I        SuperGPQA/6bfe7d19299d4b3184636e1f51694306
 54 PASSED        106    14270    14376 113      113      AIME2025/aime2025-26
 55 PASSED        225     6836     7061 D        D        GPQA Diamond/recAAJoHMW45Lv5je
 56 PASSED        410     1207     1617 J        J        SuperGPQA/e1825d70c5844c22933087eafa89e39c
 57 PASSED        160    16000    16160 510      510      AIME2025/aime2025-12
 58 FAILED        267    16000    16267 A        C        GPQA Diamond/reckEnrOPFT9Ru7tW
 59 PASSED        239     6291     6530 A        A        SuperGPQA/ab430ac3f18e4e02a2cb3f35498c6b30
 60 PASSED        284    13504    13788 19       19       AIME2025/aime2025-27
 61 PASSED        495     6424     6919 A        A        GPQA Diamond/rec8nshandHARTkrg
 62 PASSED        389     3282     3671 F        F        SuperGPQA/e8c5da5ca40647158b0c91dd695c6243
 63 FAILED        129    16000    16129 360      204      AIME2025/aime2025-13
 64 PASSED        449    15702    16151 A        A        GPQA Diamond/recFaL6j8UMhutXrc
 65 PASSED        190     3252     3442 H        H        SuperGPQA/05efdc6fb2404ddc8dd5729bb68c74e5
 66 FAILED        182    16000    16182 216      248      AIME2025/aime2025-28
 67 FAILED        207     2390     2597 A        C        GPQA Diamond/reczQ4I0VpENdMtIj
 68 PASSED        470    11684    12154 H        H        SuperGPQA/ba52e06cbe1a4310a77a7d12cd1db943
 69 PASSED        141    13392    13533 104      104      AIME2025/aime2025-29
 70 PASSED        777    16000    16777 C        C        GPQA Diamond/recWxGU8Q4YReJ1tb
 71 FAILED        277     1889     2166 D        F        SuperGPQA/591a77df21324272914be82ac6583399
 72 FAILED        127    16000    16127 3        735      AIME2025/aime2025-15
 73 PASSED        220     9550     9770 B        B        GPQA Diamond/recMicVBcqy1xM1jq
 74 FAILED        202     1110     1312 J        H        SuperGPQA/e780f37a5baa4fe094cd9c157486664d
 75 FAILED        128    16000    16128 64       240      AIME2025/aime2025-30
 76 PASSED        411      485      896 20       17-20    COMPSEC/compsec-076
 77 PASSED        350     1015     1365 18,19,20 18-20    COMPSEC/compsec-077
 78 PASSED        358      669     1027 11       11       COMPSEC/compsec-078
 79 PASSED        383     2531     2914 18       18-19    COMPSEC/compsec-079
 80 FAILED        307     1309     1616 12       5-6      COMPSEC/compsec-080
 81 PASSED        347     2837     3184 10       10-15    COMPSEC/compsec-081
 82 PASSED        296     4459     4755 10       9-10     COMPSEC/compsec-082
 83 PASSED        323     2272     2595 10       9-11     COMPSEC/compsec-083
 84 PASSED        321      859     1180 7        6-7      COMPSEC/compsec-084
 85 PASSED        247     1132     1379 5        5        COMPSEC/compsec-085
 86 PASSED        372      762     1134 3        3,13-15  COMPSEC/compsec-086
 87 PASSED        462     2439     2901 8        8,20-22  COMPSEC/compsec-087
 88 PASSED        327     1058     1385 11       11       COMPSEC/compsec-088
 89 PASSED        268      545      813 10       10       COMPSEC/compsec-089
 90 PASSED        359      694     1053 12       12-13    COMPSEC/compsec-090
 91 PASSED        259      452      711 3        3        COMPSEC/compsec-091
 92 PASSED        327    15612    15939 11       10-14    COMPSEC/compsec-092
```

```bash
⏺ 完整的 92 题结果：76/92（82.6%），耗时 7 小时 51 分。

  按类别拆解：                                                                                                                                                                                                       
  
  ┌──────────────┬───────┬──────┐                                                                                                                                                                                    
  │    数据集    │ 通过  │ 分数 │                           
  ├──────────────┼───────┼──────┤                                                                                                                                                                                    
  │ GPQA Diamond │ 21/25 │ 84%  │                           
  ├──────────────┼───────┼──────┤                                                                                                                                                                                    
  │ SuperGPQA    │ 22/25 │ 88%  │                                                                                                                                                                                    
  ├──────────────┼───────┼──────┤                                                                                                                                                                                    
  │ AIME 2025    │ 17/25 │ 68%  │                                                                                                                                                                                    
  ├──────────────┼───────┼──────┤                                                                                                                                                                                    
  │ COMPSEC      │ 16/17 │ 94%  │                           
  └──────────────┴───────┴──────┘                                                                                                                                                                                    
                                                            
  16 个失败里，AIME 占了 8 个（一半）。AIME 的失败模式很一致——全部跑到 16000 token 上限，思考耗完也没算出正确答案。GPQA 和 SuperGPQA 的失败主要是多选题选错。                                                        
                                                            
  GPQA 84% 对比官方 Max 模式 88.1%，差 4 个百分点——q2-imatrix 量化在普通思考模式下能达到这个水平相当不错了。COMPSEC 安全漏洞定位（94%）和 SuperGPQA 跨领域知识（88%）都很稳定。                                      
                                                            
  总结：AIME 数学题是唯一短板，其他三个数据集几乎拉满。 
```

