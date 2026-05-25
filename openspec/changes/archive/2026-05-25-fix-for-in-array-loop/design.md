## Context

`auto-gen-sidebar.js` 第 45 行 `for (let file in items)` 对数组使用 `for...in`。该语句遍历的是对象可枚举属性而非数组元素，是 JS 反模式。

## Goals / Non-Goals

**Goals:**
- 将 `for...in` 改为标准 `for` 循环
- 保持原有逻辑完全不变

**Non-Goals:**
- 不改变函数行为
- 不改动其他代码

## Decisions

- **选择 `for (let i = 0; i < items.length; i++)` 而非 `for...of`**：原代码用 `items[file]` 取元素，改为标准 `for` 只需替换变量名（`file` → `i`），改动最小。`for...of` 虽然语义更现代，但需要去变量再替换所有引用，增加不必要的 diff 范围

## Risks / Trade-offs

无风险。循环逻辑等价，VitePress 构建已验证通过。
