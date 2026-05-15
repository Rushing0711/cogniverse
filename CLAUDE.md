# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 核心规则
- 本项目是个人知识库
- docs目录下 .vitepress 之外就是知识库内容
- 一定不要删除文档 *.md 中的图片，除非经过我允许
- 文档使用中文

# 项目概述
基于 VitePress 构建的个人知识库网站，涵盖前端、后端、设计、运维、大数据、AI/LLM 等领域。用 Typora 编写 Markdown 源文件，VitePress 生成静态站点。默认本地端口 8750，Nginx 部署监听 8751。

# 常用命令
- `pnpm docs:dev` — 启动开发服务器 (端口 8750)
- `pnpm docs:build` — 构建生产版本到 `docs/.vitepress/dist`
- `pnpm docs:preview` — 预览构建产物 (端口 8750)
- 包管理器必须用 pnpm（见 package.json 的 packageManager 字段），不要用 npm/yarn

# 架构要点

## 侧边栏自动生成
`docs/.vitepress/auto-gen-sidebar.js` 递归读取目录下的 `.md` 文件，自动生成侧边栏结构。新路径需要同时在 `config.mjs` 的 `themeConfig.sidebar` 中注册，格式为 `'/路径': autoGenSidebar('/路径')`。

## 主题定制
`docs/.vitepress/theme/` 扩展了 VitePress 默认主题：
- `index.js` — 主题入口，可通过 `enhanceApp` 注册全局 Vue 组件
- `style.css` — 自定义样式覆盖

## Mermaid 支持
`config.mjs` 中配置了 `vitepress-plugin-mermaid` 插件，Markdown 中可直接使用 mermaid 代码块绘制图表。

## 知识库目录结构
`docs/` 下按领域分目录：`frontend`、`backend`、`devops`、`design`、`database`、`bigdata`、`aillm`、`misc`、`guide`。每个领域下 `old/` 为旧版内容，`new/` 为新版内容。

## 构建产物
构建后会生成 `stats.html`（rollup-plugin-visualizer 的包体积分析报告），该文件已加入 `.gitignore`。

# 文件约定
- `README.md` 是 `docs/guide/01-第1章 网站构建指南.md` 的软链接，不要破坏这个链接
- `docs/.vitepress/dist` 和 `docs/.vitepress/cache` 是构建产物，不要提交到 git
