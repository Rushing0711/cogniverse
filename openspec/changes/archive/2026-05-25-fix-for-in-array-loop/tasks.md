## 1. 循环重构

- [x] 1.1 将 `for (let file in items)` 改为 `for (let i = 0; i < items.length; i++)`（第 45 行）
- [x] 1.2 将所有 `items[file]` 改为 `items[i]`（共 6 处）

## 2. 验证

- [x] 2.1 运行 `pnpm docs:build`，确认侧边栏生成正常，构建无报错
