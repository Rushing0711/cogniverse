## Why

`docs/.vitepress/auto-gen-sidebar.js` 中的函数 `intersections` 命名有误导性——"intersection"含义是"交集"（两集合共有元素），但实际实现的是"差集"（从 arr1 中排除 arr2 包含的元素）。代码注释写的是"去差值"，与函数名矛盾，阅读代码时造成困惑。

## What Changes

- 将函数 `intersections` 重命名为 `difference`，准确反映其行为
- 同步更新注释（"去差值" → "差集"）
- 更新函数被调用的位置（第 41 行）

## Capabilities

### New Capabilities

无。此为纯重命名重构，不引入新功能。

### Modified Capabilities

无。不改变任何对外行为。

## Impact

- `docs/.vitepress/auto-gen-sidebar.js`：第 13 行（函数定义）、第 41 行（调用点）
