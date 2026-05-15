# Old → New 迁移设计

## 目标

将 `docs/` 下 6 个领域的 `old/` 内容迁移到 `new/`，采用新模式的教科书式分章节呈现（`00-引言.md` + `{NN}-第{N}章 标题.md`）。

## 迁移范围

| 领域 | old topics（新建） | new 已有（合并） | 跳过 |
|------|-------------------|----------------|------|
| **database** | ElasticStack, MongoDB, MySQL, Oracle, Redis | — | — |
| **bigdata** | BigData, Flink, Flume, Hadoop, HBase, Hive, Scala, Spark | — | — |
| **backend** | Concurrency, Distributed, HTTP, Java, 剑指Java, Kafka, Maven, PCO, Python, RabbitMQ, Shiro, SkyWalking, Spring, ZooKeeper | — | JVM与GC调优, 数据结构与算法分析 |
| **devops** | — | Nginx | 其他 |
| **frontend** | — | — | 全部 |
| **design** | — | — | 全部 |

## 核心决策

1. **方案**：保持主题边界，内容内部拆分（方案三）。每个 old/ 主题目录在 new/ 下独立成 topic
2. **design 跳过**：old 内容不足（仅 3 行 index + 1 空文件）
3. **frontend 跳过**：用户确认不需要迁移
4. **devops 仅 Nginx**：其余 old/ 内容已有对应或在 new/ 中由其他 topic 覆盖
5. **合并策略**：new 已有章节不动，old 独有内容追加为新章节；重复内容以 new 为准
6. **old/ 目录**：迁移后保留，整体验证通过后再决定去留
7. **图片**：old 中的图片复制一份到 new 对应位置，引用路径同步更新

## 章节生成规则

每个 topic 目录结构：

```
{topic}/
  00-引言.md          ← 从原文件开头摘要生成，包含学习目标
  NN--第{N}篇 xxx.md  ← 空分隔符（仅在 topic 横跨多个大主题时创建）
  NN-第{N}章 xxx.md   ← 具体章节内容
```

### 拆分原则

- 以 Markdown 标题（`#`、`##`）作为自然断点
- 每章控制在 50-200 行
- 小文件（<50 行）整体作为一章
- 跨多个 `##` 子节且内容较短的，合并到同一章
- 不为了格式统一而硬加空分隔符

### 合并原则（devops Nginx）

- 读取 new 已有章节，提取已有内容要点
- 读取 old 对应文件，识别 new 中未覆盖的内容
- old 独有内容追加为新章节（编号接续 new 已有最大编号）
- 重复内容以 new 为准

## 特殊处理

- `old/` 的 `index.md` 中有实质内容（如 backend/old/index.md 82 行命名规范），需融入对应 topic 引言或单独成章
- `old/` 中的 `README.md`（如 `database/old/MySQL/README.md`）也是迁移源
- `devops/old` 有嵌套结构（`DevOps/Kubernetes/`），Nginx 是独立目录不受影响

## 侧边栏配置

对每个新增 topic，在 `docs/.vitepress/config.mjs` 的 `themeConfig.sidebar` 中添加：

```js
'/domain/new/Topic/': autoGenSidebar('/domain/new/Topic'),
```

nav 导航栏中对应领域的链接同步更新。

## 验证方式

1. `pnpm docs:dev` 启动开发服务器
2. 浏览器访问每个新增 topic 页面，确认内容可读、章节链接正常
3. 检查侧边栏导航，确认新增 topic 出现在正确位置
4. 检查图片是否正常显示
5. devops Nginx 确认原有章节未丢失，新内容已追加
