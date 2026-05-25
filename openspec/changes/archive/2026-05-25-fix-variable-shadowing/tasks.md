## 1. 变量重命名

- [x] 1.1 将 `const files = fs.readdirSync(dir)` 改为 `const subFiles = fs.readdirSync(dir)`（第 52 行）
- [x] 1.2 更新递归调用引用 `getList(files, dir, ...)` 为 `getList(subFiles, dir, ...)`（第 56 行）

## 2. 验证

- [x] 2.1 运行 `pnpm docs:build`，确认侧边栏生成正常，构建无报错
