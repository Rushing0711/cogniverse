## Context

`docs/.vitepress/auto-gen-sidebar.js` 第 13 行函数 `intersections` 命名不正确。该函数计算的是差集（从 arr1 中排除 arr2 包含的元素），而非交集。唯一调用点在第 41 行。

## Goals / Non-Goals

**Goals:**
- 将函数名从 `intersections` 改为 `difference`，使之与行为一致

**Non-Goals:**
- 不改变函数逻辑
- 不改变 VitePress 侧边栏生成行为

## Decisions

- **命名选择 `difference` 而非 `without` 或 `exclude`**：`difference` 是集合论标准术语，与 `intersection`（交集）、`union`（并集）属同一体系，后续若有其他集合操作更易理解

## Risks / Trade-offs

无风险。纯重命名，函数签名和行为完全不变。
