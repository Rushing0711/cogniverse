## Context

`auto-gen-sidebar.js` 中 `getList()` 函数参数为 `files`（第 39 行），但在第 52 行 `const files = fs.readdirSync(dir)` 又声明了同名变量，遮蔽了外层参数。该变量仅在第 56 行递归调用时使用。

## Goals / Non-Goals

**Goals:**
- 消除变量遮蔽，提升代码可读性
- 保持行为完全不变

**Non-Goals:**
- 不改变函数签名
- 不改动其他函数

## Decisions

- **命名选择 `subFiles` 而非 `entries` 或 `items`**：`subFiles` 直观表达"子目录下的文件列表"，且与上层 `files` 参数的语义关系一目了然（`files` 是当前层的文件列表，`subFiles` 是子目录的文件列表）

## Risks / Trade-offs

无风险。纯变量重命名，不影响逻辑。
