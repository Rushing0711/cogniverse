## Why

`docs/.vitepress/auto-gen-sidebar.js` 中 `getList()` 函数内，第 52 行 `const files = fs.readdirSync(dir)` 声明了与函数参数 `files`（第 39 行）同名的局部变量，造成变量遮蔽（variable shadowing）。虽然当前代码不会出错（该局部变量在函数末尾且只用于递归调用），但降低了可读性，容易让后续维护者混淆"这个 `files` 是参数还是子目录列表"。

## What Changes

- 将第 52 行局部变量 `files` 重命名为 `subFiles`
- 同步更新第 56 行对该变量的引用

## Capabilities

### New Capabilities

无。此为纯重构。

### Modified Capabilities

无。不改变任何对外行为。

## Impact

- `docs/.vitepress/auto-gen-sidebar.js`：第 52 行（变量声明）、第 56 行（递归调用引用）
