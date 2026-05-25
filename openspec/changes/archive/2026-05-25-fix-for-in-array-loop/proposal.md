## Why

`docs/.vitepress/auto-gen-sidebar.js` 第 45 行使用 `for...in` 遍历数组 `items`。`for...in` 会遍历对象的所有可枚举属性（包括原型链），用于数组时若 `Array.prototype` 被任何库扩展，会意外遍历到非数组元素。这是 JavaScript 中公认的反模式。

## What Changes

- 将 `for (let file in items)` 改为 `for (let i = 0; i < items.length; i++)`
- 同步将循环体内所有 `items[file]` 改为 `items[i]`（共 5 处：第 47/54/56/60/62 行）

## Capabilities

### New Capabilities

无。此为纯重构。

### Modified Capabilities

无。不改变任何对外行为。

## Impact

- `docs/.vitepress/auto-gen-sidebar.js`：第 45 行（循环声明）+ 第 47/54/56/60/62 行（`items[file]` → `items[i]`）
