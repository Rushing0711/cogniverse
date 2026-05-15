# Old → New 内容迁移 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 database/bigdata/backend 的 old/ 内容拆分为 new/ 分章节结构，将 devops Nginx 合并到已有 new 章节

**Architecture:** 每个 old topic 目录在 new/ 下生成对应 topic 目录，内部按 Markdown 标题（`#`、`##`）自然断点拆分为 `00-引言.md` + `{NN}-第{N}章 xxx.md`，侧边栏配置按 topic 粒度注册

**Tech Stack:** Markdown 文件操作、VitePress 侧边栏配置

---

### Task 1: database/new/ — 创建基础结构和 MySQL 章节

**Files:**
- Read: `docs/database/old/MySQL/MySQLInAction.md` (2270 行)
- Read: `docs/database/old/MySQL/UnderstantingMySQL.md` (74 行)
- Read: `docs/database/old/MySQL/README.md` (31 行)
- Create: `docs/database/new/MySQL/` 下所有章节文件
- Create: `docs/database/new/index.md`

- [ ] **Step 1: 读取 MySQL old 源文件，分析标题结构**

读取三个源文件，从 `#` 和 `##` 标题确认章节边界。MySQLInAction.md 标题结构：
- `# MySQL实战` → 作为引言基础
- `# 一、数据库设计规范` (含 6 个 `##` 子节)
- `# 二、MySQL5.7配置文件` (含 1 个 `##` 子节)
UNDERSTANDINGMySQL.md 和 README.md 作为补充内容融入

- [ ] **Step 2: 创建 MySQL 章节目录**

```bash
mkdir -p docs/database/new/MySQL
```

创建章节文件（预计 12-14 章）：
- `docs/database/new/MySQL/00-引言.md` — 从 `MySQLInAction.md` 第 1-6 行提取，概述 MySQL 实战内容
- `docs/database/new/MySQL/01-第1章 数据库命名规范.md` — `## 1、数据库命名规范`
- `docs/database/new/MySQL/02-第2章 数据库基本设计规范.md` — `## 2、数据库基本设计规范`
- `docs/database/new/MySQL/03-第3章 数据库索引设计规范.md` — `## 3、数据库索引设计规范`
- `docs/database/new/MySQL/04-第4章 数据库字段设计规范.md` — `## 4、数据库字段设计规范`
- `docs/database/new/MySQL/05-第5章 数据库SQL开发规范.md` — `## 5、数据库SQL开发规范`
- `docs/database/new/MySQL/06-第6章 数据库操作行为规范.md` — `## 6、数据库操作行为规范`
- `docs/database/new/MySQL/07-第7章 MySQL配置文件详解.md` — `# 二、MySQL5.7配置文件` + `## 1、my.cnf常规配置项`（内容较多，含大量配置注释）
- `docs/database/new/MySQL/08-第8章 MySQL事务与锁.md` — 从 `README.md` 的事务类型内容提取
- `docs/database/new/MySQL/09-第9章 MySQL架构原理.md` — 从 `UnderstantingMySQL.md` 提取

标题编号用 `# 第{N}章 {标题}` 格式。

- [ ] **Step 3: 创建 database/new/index.md**

```markdown
# Database 数据库

本章涵盖 MySQL、Redis、MongoDB、ElasticStack、Oracle 等数据库的实战知识。
```

- [ ] **Step 4: 验证文件创建**

```bash
find docs/database/new/MySQL -name "*.md" | sort
wc -l docs/database/new/MySQL/*.md
```

- [ ] **Step 5: Commit**

```bash
git add docs/database/new/
git commit -m "feat: 迁移 database/old/MySQL 到 new/ 分章节结构"
```

---

### Task 2: database/new/ — Redis 章节

**Files:**
- Read: `docs/database/old/Redis/RedisInAction.md` (1143 行)
- Create: `docs/database/new/Redis/` 下所有章节文件

- [ ] **Step 1: 读取 Redis old 源文件，分析标题结构**

RedisInAction.md 标题结构：
- `# Redis实战`
- `# 一、安装`
- `# 二、常用命令` → `## 1.1 Redis的命令行客户端` / `## 1.2 Redis的数据类型` (含 `###` 子节：string/hash/list/set/sorted_set)
- 数据类型子节很多，需要按类型拆章

- [ ] **Step 2: 创建 Redis 章节**

```bash
mkdir -p docs/database/new/Redis
```

- `docs/database/new/Redis/00-引言.md` — Redis 概述和学习目标
- `docs/database/new/Redis/01-第1章 Redis安装与客户端.md` — `# 一、安装` + `## 1.1 Redis的命令行客户端`
- `docs/database/new/Redis/02-第2章 String字符串类型.md` — `### 1.2.1 string 字符串`
- `docs/database/new/Redis/03-第3章 Hash哈希类型.md` — `### 1.2.2 hash`
- `docs/database/new/Redis/04-第4章 List列表类型.md` — `### 1.2.3 list`
- `docs/database/new/Redis/05-第5章 Set集合类型.md` — `### 1.2.4 set`
- `docs/database/new/Redis/06-第6章 SortedSet有序集合.md` — `### 1.2.5 sorted_set`

- [ ] **Step 3: Commit**

```bash
git add docs/database/new/Redis/
git commit -m "feat: 迁移 database/old/Redis 到 new/ 分章节结构"
```

---

### Task 3: database/new/ — MongoDB 章节

**Files:**
- Read: `docs/database/old/MongoDB/MongoDBInAction.md` (5141 行)
- Create: `docs/database/new/MongoDB/` 下所有章节文件

- [ ] **Step 1: 读取 MongoDBInAction.md，分析完整标题结构**

5141 行的大文件，需完整遍历 `#` / `##` 标题确定章节边界。预计 25-35 章。

- [ ] **Step 2: 创建 MongoDB 章节**

```bash
mkdir -p docs/database/new/MongoDB
```

按 `##` 标题拆分，每章 100-200 行。若相邻 `##` 子节较短则合并。需实际读文件后确定精确的章节边界和标题名。

- [ ] **Step 3: Commit**

```bash
git add docs/database/new/MongoDB/
git commit -m "feat: 迁移 database/old/MongoDB 到 new/ 分章节结构"
```

---

### Task 4: database/new/ — ElasticStack 章节

**Files:**
- Read: `docs/database/old/ElasticStack/README.md` (1488 行)
- Read: `docs/database/old/ElasticStack/Elasticsearch/ElasticsearchInAction.md` (1619 行)
- Read: `docs/database/old/ElasticStack/Elasticsearch/ElasticsearchLearning.md` (4 行)
- Read: `docs/database/old/ElasticStack/Logstash/LogstashInAction.md` (192 行)
- Read: `docs/database/old/ElasticStack/Kibana/KibanaInAction.md` (35 行)
- Read: `docs/database/old/ElasticStack/Beats/BeatsInAction.md` (269 行)
- Create: `docs/database/new/ElasticStack/` 下所有章节文件

- [ ] **Step 1: 读取所有 ElasticStack 源文件**

ElasticStack 包含 ES + Logstash + Kibana + Beats 四个子组件，README.md 是整体安装指南。按组件分为不同的"篇"。

- [ ] **Step 2: 创建 ElasticStack 章节**

```bash
mkdir -p docs/database/new/ElasticStack
```

- `docs/database/new/ElasticStack/00-引言.md` — ElasticStack 概述
- `docs/database/new/ElasticStack/01--第一篇 Elasticsearch.md` — 空分隔符
- `docs/database/new/ElasticStack/01-第1章 Elasticsearch安装.md` — 从 README.md ES 部分提取
- `docs/database/new/ElasticStack/02-第2章 Elasticsearch实战.md` — 从 ElasticsearchInAction.md 拆分
- `docs/database/new/ElasticStack/XX--第二篇 Logstash.md` — 空分隔符
- Logstash 章节...
- `docs/database/new/ElasticStack/XX--第三篇 Kibana.md` — 空分隔符
- Kibana 章节...
- `docs/database/new/ElasticStack/XX--第四篇 Beats.md` — 空分隔符
- Beats 章节...

精确章数需读文件后确定。

- [ ] **Step 3: Commit**

```bash
git add docs/database/new/ElasticStack/
git commit -m "feat: 迁移 database/old/ElasticStack 到 new/ 分章节结构"
```

---

### Task 5: database/new/ — Oracle 章节

**Files:**
- Read: `docs/database/old/Oracle/OracleInAction.md` (38 行)
- Create: `docs/database/new/Oracle/` 下章节文件

- [ ] **Step 1: 读取 Oracle old 文件**

仅 38 行，整体作为一章。

- [ ] **Step 2: 创建 Oracle 章节**

```bash
mkdir -p docs/database/new/Oracle
```

- `docs/database/new/Oracle/00-引言.md` — 从 OracleInAction.md 开头提取
- `docs/database/new/Oracle/01-第1章 Oracle实战.md` — 剩余内容

- [ ] **Step 3: Commit**

```bash
git add docs/database/new/Oracle/
git commit -m "feat: 迁移 database/old/Oracle 到 new/ 分章节结构"
```

---

### Task 6: bigdata/new/ — BigData 章节

**Files:**
- Read: `docs/bigdata/old/BigData/BigDataInAction.md` (6055 行)
- Create: `docs/bigdata/new/BigData/` 下所有章节文件
- Create: `docs/bigdata/new/index.md`

- [ ] **Step 1: 读取 BigDataInAction.md，分析标题结构**

6055 行，标题结构复杂（含 `### 1.2.1 Zookeeper集群规划` 等多级标题），预计 25-35 章。需要先通读再设计拆分方案。

- [ ] **Step 2: 创建 BigData 章节和 index.md**

```bash
mkdir -p docs/bigdata/new/BigData
```

按 `##` 标题拆分。大节（如 ZooKeeper 四种安装方式）可独立成篇，用空分隔符划分。

```markdown
# docs/bigdata/new/index.md
# BigData 大数据

本章涵盖 Hadoop 生态、Flink、Flume、HBase、Hive、Scala、Spark 等大数据技术栈的实战知识。
```

- [ ] **Step 3: Commit**

```bash
git add docs/bigdata/new/
git commit -m "feat: 迁移 bigdata/old/BigData 到 new/ 分章节结构"
```

---

### Task 7: bigdata/new/ — Flink 章节

**Files:**
- Read: `docs/bigdata/old/Flink/FlinkInAction.md` (1591 行)
- Create: `docs/bigdata/new/Flink/` 下所有章节文件

- [ ] **Step 1: 读取 FlinkInAction.md，按标题拆分**

按 `#` / `##` 标题确定章节（预计 8-12 章）。

- [ ] **Step 2: 创建 Flink 章节**

```bash
mkdir -p docs/bigdata/new/Flink
```

- [ ] **Step 3: Commit**

```bash
git add docs/bigdata/new/Flink/
git commit -m "feat: 迁移 bigdata/old/Flink 到 new/ 分章节结构"
```

---

### Task 8: bigdata/new/ — Flume 章节

**Files:**
- Read: `docs/bigdata/old/Flume/FlumeInAction.md` (1518 行)
- Create: `docs/bigdata/new/Flume/` 下所有章节文件

- [ ] **Step 1: 读取 FlumeInAction.md，按标题拆分**

- [ ] **Step 2: 创建 Flume 章节** → `mkdir -p docs/bigdata/new/Flume`

- [ ] **Step 3: Commit**

---

### Task 9: bigdata/new/ — Hive 章节

**Files:**
- Read: `docs/bigdata/old/Hive/HiveInAction.md` (1631 行)
- Create: `docs/bigdata/new/Hive/` 下所有章节文件

- [ ] **Step 1: 读取 HiveInAction.md，按标题拆分**

- [ ] **Step 2: 创建 Hive 章节** → `mkdir -p docs/bigdata/new/Hive`

- [ ] **Step 3: Commit**

---

### Task 10: bigdata/new/ — Hadoop 章节

**Files:**
- Read: `docs/bigdata/old/Hadoop/HadoopInAction.md` (827 行)
- Create: `docs/bigdata/new/Hadoop/` 下所有章节文件

- [ ] **Step 1: 读取 HadoopInAction.md，按标题拆分（预计 5-7 章）**

- [ ] **Step 2: 创建 Hadoop 章节** → `mkdir -p docs/bigdata/new/Hadoop`

- [ ] **Step 3: Commit**

---

### Task 11: bigdata/new/ — Spark 章节

**Files:**
- Read: `docs/bigdata/old/Spark/SparkInAction.md` (567 行)
- Create: `docs/bigdata/new/Spark/` 下所有章节文件

- [ ] **Step 1: 读取 SparkInAction.md，按标题拆分（预计 3-5 章）**

- [ ] **Step 2: 创建 Spark 章节** → `mkdir -p docs/bigdata/new/Spark`

- [ ] **Step 3: Commit**

---

### Task 12: bigdata/new/ — HBase 章节

**Files:**
- Read: `docs/bigdata/old/HBase/HBaseInAction.md` (360 行)
- Create: `docs/bigdata/new/HBase/` 下所有章节文件

- [ ] **Step 1: 读取 HBaseInAction.md，按标题拆分（预计 2-3 章）**

- [ ] **Step 2: 创建 HBase 章节** → `mkdir -p docs/bigdata/new/HBase`

- [ ] **Step 3: Commit**

---

### Task 13: bigdata/new/ — Scala 章节

**Files:**
- Read: `docs/bigdata/old/Scala/ScalaInAction.md` (10 行)
- Create: `docs/bigdata/new/Scala/` 下章节文件

- [ ] **Step 1: 读取 Scala old 文件**

仅 10 行，整体作为一章。

- [ ] **Step 2: 创建 Scala 章节**

```bash
mkdir -p docs/bigdata/new/Scala
```

- `docs/bigdata/new/Scala/00-引言.md` — 简要引言
- `docs/bigdata/new/Scala/01-第1章 Scala入门.md` — 全部 10 行内容

- [ ] **Step 3: Commit**

---

### Task 14: backend/new/ — Spring 章节（最大文件，8366 行）

**Files:**
- Read: `docs/backend/old/Spring/backend-springboot3-learning.md` (8366 行)
- Read: `docs/backend/old/Spring/backend-spring6-learning.md` (77 行)
- Read: `docs/backend/old/Spring/backend-springboot2-learning.md` (136 行)
- Create: `docs/backend/new/Spring/` 下所有章节文件

- [ ] **Step 1: 读取所有 Spring 源文件，分析标题结构**

8366 行是本次迁移最大的单个文件。需完整遍历标题结构确定拆分方案。预计 40-55 章。spring6 和 springboot2 文件较小，可作为 Spring topic 内的独立"篇"。

- [ ] **Step 2: 创建 Spring 章节**

```bash
mkdir -p docs/backend/new/Spring
```

- `00-引言.md` — Spring 全家桶概述
- 空分隔符划分三大块：Spring 6 / Spring Boot 2 / Spring Boot 3
- Spring Boot 3 内容按 `##` 标题拆为 30-50 章

- [ ] **Step 3: Commit**

```bash
git add docs/backend/new/Spring/
git commit -m "feat: 迁移 backend/old/Spring 到 new/ 分章节结构"
```

---

### Task 15: backend/new/ — Kafka 章节

**Files:**
- Read: `docs/backend/old/Kafka/KafkaInAction.md` (3870 行)
- Create: `docs/backend/new/Kafka/` 下所有章节文件

- [ ] **Step 1: 读取 KafkaInAction.md 标题结构**

已知标题：`# 一、安装` / `# 二、常用命令` / `# 三、初识Kafka` (含 4 个 `##`) / `# 四、Kafka基础与进阶` (含多个 `##` 和 `###`)。预计 10-18 章。

- [ ] **Step 2: 创建 Kafka 章节**

```bash
mkdir -p docs/backend/new/Kafka
```

- [ ] **Step 3: Commit**

---

### Task 16: backend/new/ — Java 章节

**Files:**
- Read: `docs/backend/old/Java/JavaInAction.md` (1685 行)
- Read: `docs/backend/old/Java/SpringBootInAction.md` (72 行)
- Create: `docs/backend/new/Java/` 下所有章节文件

- [ ] **Step 1: 读取 Java old 文件，合并两个文件为一个 topic**

- [ ] **Step 2: 创建 Java 章节** → `mkdir -p docs/backend/new/Java`

- [ ] **Step 3: Commit**

---

### Task 17: backend/new/ — RabbitMQ 章节

**Files:**
- Read: `docs/backend/old/RabbitMQ/RabbitMQInAction.md` (664 行)
- 注: RabbitMQLearning.md、UnderstandingRabbitMQ.md、RabbitMQCommonCMD.md 均为空或 0 行，不迁移
- Create: `docs/backend/new/RabbitMQ/` 下所有章节文件

- [ ] **Step 1: 读取 RabbitMQInAction.md，按标题拆分（预计 4-6 章）**

- [ ] **Step 2: 创建 RabbitMQ 章节** → `mkdir -p docs/backend/new/RabbitMQ`

- [ ] **Step 3: Commit**

---

### Task 18: backend/new/ — 剑指Java + ZooKeeper + Shiro + SkyWalking 章节

**Files:**
- Read: `docs/backend/old/剑指Java/剑指Java.md` (718 行)
- Read: `docs/backend/old/ZooKeeper/ZooKeeperInAction.md` (650 行)
- Read: `docs/backend/old/Shiro/backend-shiro-learning.md` (285 行)
- Read: `docs/backend/old/SkyWalking/SkyWalkingInAction.md` (268 行)
- Create: 各 topic 目录及章节文件

- [ ] **Step 1: 依次读取四个源文件，各自创建 topic** → 每个 `mkdir -p` + 拆分

- [ ] **Step 2: Commit each or batch**

```bash
git add docs/backend/new/剑指Java/ docs/backend/new/ZooKeeper/ docs/backend/new/Shiro/ docs/backend/new/SkyWalking/
git commit -m "feat: 迁移 backend/old 剑指Java/ZooKeeper/Shiro/SkyWalking 到 new/"
```

---

### Task 19: backend/new/ — Maven + Python + HTTP + Concurrency + Distributed + PCO（小文件批量处理）

**Files:**
- Read: `docs/backend/old/Maven/MavenInAction.md` (308 行)
- Read: `docs/backend/old/Python/PythonInAction.md` (300 行)
- Read: `docs/backend/old/HTTP/HTTPLearning.md` (92 行)
- Read: `docs/backend/old/Concurrency/ConcurrencyInAction.md` (43 行)
- Read: `docs/backend/old/Distributed/DistributedInAction.md` (47 行)
- Read: `docs/backend/old/Principles of Computer Organization/PCOInAction.md` (34 行)
- Create: 各 topic 目录及章节文件

- [ ] **Step 1: 按文件大小决定拆分策略**

| Topic | 行数 | 策略 |
|-------|------|------|
| Maven | 308 | 按 `##` 拆 2-4 章 |
| Python | 300 | 按 `##` 拆 2-4 章 |
| HTTP | 92 | 整文件 1 章 |
| Concurrency | 43 | 整文件 1 章 |
| Distributed | 47 | 整文件 1 章 |
| PCO | 34 | 整文件 1 章 |

- [ ] **Step 2: 依次创建各 topic** → 小文件直接 00-引言 + 01-第1章

- [ ] **Step 3: Commit**

```bash
git add docs/backend/new/Maven/ docs/backend/new/Python/ docs/backend/new/HTTP/ docs/backend/new/Concurrency/ docs/backend/new/Distributed/ docs/backend/new/PCO/
git commit -m "feat: 迁移 backend/old 小文件（Maven/Python/HTTP/Concurrency/Distributed/PCO）到 new/"
```

---

### Task 20: backend/new/ — 处理 backend/old/index.md 命名规范内容

**Files:**
- Read: `docs/backend/old/index.md` (81 行)
- Create: `docs/backend/new/index.md`

- [ ] **Step 1: 读取 backend/old/index.md**

81 行的命名规范文档，将其内容融入 backend/new/ 的 index.md，作为领域总览页。

- [ ] **Step 2: 创建 backend/new/index.md**

从 old/index.md 提取核心内容（命名约定）作为 index 的一部分。

- [ ] **Step 3: Commit**

---

### Task 21: devops/new/ — Nginx 合并

**Files:**
- Read: `docs/devops/new/Nginx/00-引言.md` (已有，当前可能为空)
- Read: `docs/devops/old/Nginx/NginxInAction.md` (1183 行)
- Create: `docs/devops/new/Nginx/` 下新增章节文件

- [ ] **Step 1: 读取 new/Nginx/00-引言.md 当前状态**

检查是否为空文件。如果空，用 old 内容的开头填补引言。

- [ ] **Step 2: 读取 old/NginxInAction.md 标题结构**

已知标题：
- `# 零、初识Nginx`
- `# 一、常规配置` (含 `## 1.1` WebSocket, `## 1.2` 参考实现, `## 1.3` stream)
- `# 二、基本规则` (含 `## 2.1` root/alias, `## 2.2` location, `## 2.3` 跨域, `## 2.4` 防盗链, `## 2.5` upstream)

- [ ] **Step 3: 对比 old 与 new 已有内容，确定追加章节**

New 当前仅有 `00-引言.md`（可能为空）。old 的 1183 行全部为 Nginx 配置实战，new 没有覆盖。将 old 内容全部拆成章节追加：

```bash
# new 已有 max chapter = 0（仅有引言），追加从 01 开始
```

- `docs/devops/new/Nginx/01--第一篇 基础篇.md` — 空分隔符
- `docs/devops/new/Nginx/01-第1章 初识Nginx.md` — `# 零、初识Nginx`
- `docs/devops/new/Nginx/02-第2章 Nginx配置WebSocket.md` — `## 1.1`
- `docs/devops/new/Nginx/03-第3章 Nginx参考实现.md` — `## 1.2`
- `docs/devops/new/Nginx/04-第4章 Stream代理TCP.md` — `## 1.3`
- `docs/devops/new/Nginx/05--第二篇 规则篇.md` — 空分隔符
- `docs/devops/new/Nginx/05-第5章 root与alias.md` — `## 2.1`
- `docs/devops/new/Nginx/06-第6章 location匹配规则.md` — `## 2.2`
- `docs/devops/new/Nginx/07-第7章 Nginx跨域配置.md` — `## 2.3`
- `docs/devops/new/Nginx/08-第8章 Nginx防盗链配置.md` — `## 2.4`
- `docs/devops/new/Nginx/09-第9章 upstream负载均衡.md` — `## 2.5`

- [ ] **Step 4: 更新引言文件**

如果 `00-引言.md` 为空，填充 Nginx 学习目标概述。

- [ ] **Step 5: Commit**

```bash
git add docs/devops/new/Nginx/
git commit -m "feat: 合并 devops/old/Nginx 内容到 new/ 分章节结构"
```

---

### Task 22: 更新 config.mjs 侧边栏配置

**Files:**
- Modify: `docs/.vitepress/config.mjs:101-133` (sidebar 部分)
- Modify: `docs/.vitepress/config.mjs:56-100` (nav 部分)

- [ ] **Step 1: 在 sidebar 中添加所有新增 topic**

在 sidebar 对象中按字母顺序插入以下新条目：

```js
// database/new topics
'/database/new/MySQL/': autoGenSidebar('/database/new/MySQL'),
'/database/new/Redis/': autoGenSidebar('/database/new/Redis'),
'/database/new/MongoDB/': autoGenSidebar('/database/new/MongoDB'),
'/database/new/ElasticStack/': autoGenSidebar('/database/new/ElasticStack'),
'/database/new/Oracle/': autoGenSidebar('/database/new/Oracle'),

// bigdata/new topics
'/bigdata/new/BigData/': autoGenSidebar('/bigdata/new/BigData'),
'/bigdata/new/Flink/': autoGenSidebar('/bigdata/new/Flink'),
'/bigdata/new/Flume/': autoGenSidebar('/bigdata/new/Flume'),
'/bigdata/new/Hadoop/': autoGenSidebar('/bigdata/new/Hadoop'),
'/bigdata/new/HBase/': autoGenSidebar('/bigdata/new/HBase'),
'/bigdata/new/Hive/': autoGenSidebar('/bigdata/new/Hive'),
'/bigdata/new/Scala/': autoGenSidebar('/bigdata/new/Scala'),
'/bigdata/new/Spark/': autoGenSidebar('/bigdata/new/Spark'),

// backend/new topics (新增，保留已有 JVM与GC调优、数据结构与算法分析)
'/backend/new/Spring/': autoGenSidebar('/backend/new/Spring'),
'/backend/new/Kafka/': autoGenSidebar('/backend/new/Kafka'),
'/backend/new/Java/': autoGenSidebar('/backend/new/Java'),
'/backend/new/RabbitMQ/': autoGenSidebar('/backend/new/RabbitMQ'),
'/backend/new/剑指Java/': autoGenSidebar('/backend/new/剑指Java'),
'/backend/new/ZooKeeper/': autoGenSidebar('/backend/new/ZooKeeper'),
'/backend/new/Shiro/': autoGenSidebar('/backend/new/Shiro'),
'/backend/new/SkyWalking/': autoGenSidebar('/backend/new/SkyWalking'),
'/backend/new/Maven/': autoGenSidebar('/backend/new/Maven'),
'/backend/new/Python/': autoGenSidebar('/backend/new/Python'),
'/backend/new/HTTP/': autoGenSidebar('/backend/new/HTTP'),
'/backend/new/Concurrency/': autoGenSidebar('/backend/new/Concurrency'),
'/backend/new/Distributed/': autoGenSidebar('/backend/new/Distributed'),
'/backend/new/PCO/': autoGenSidebar('/backend/new/PCO'),
```

- [ ] **Step 2: 更新 nav 导航栏**

将导航栏中指向 old/ 的链接更新为指向 new/ 对应内容。database、bigdata、backend 的 nav items 需要更新 link 目标。

- [ ] **Step 3: 删除不再需要的旧 sidebar 条目**

删除以下行（如果迁移覆盖了对应 old 目录的所有内容）：
- `/database/old` (迁移后)
- `/bigdata/old` (迁移后)
- `/backend/old` (迁移后)

注意：`/devops/old` 仍保留（Nginx 只是合并，DevOps/SystemMonitor 等其他 topic 的 sidebar 还在用）

- [ ] **Step 4: Commit**

```bash
git add docs/.vitepress/config.mjs
git commit -m "feat: 更新 config.mjs 侧边栏和导航以反映 old→new 迁移"
```

---

### Task 23: 处理图片迁移

**Files:**
- Find: `docs/**/old/**/images/` 下的所有图片文件
- Copy: 到对应 `new/` topic 目录下的 `images/`

- [ ] **Step 1: 查找 old 目录下的所有图片**

```bash
find docs/database/old docs/bigdata/old docs/backend/old docs/devops/old -type d -name "images" 2>/dev/null
find docs/database/old docs/bigdata/old docs/backend/old docs/devops/old -name "*.png" -o -name "*.jpg" -o -name "*.gif" -o -name "*.svg" 2>/dev/null
```

- [ ] **Step 2: 将图片复制到 new 对应位置**

对每个有图片的 old topic，复制 images 到 new 对应目录，保持相同相对路径结构。

- [ ] **Step 3: 更新章节文件中的图片引用路径**

将所有新生成章节中的图片路径从 old 相对路径更新为 new 相对路径。

- [ ] **Step 4: Commit**

---

### Task 24: 最终验证

- [ ] **Step 1: 启动开发服务器**

```bash
pnpm docs:dev
```

- [ ] **Step 2: 浏览器验证清单**

逐一访问以下 URL 确认：
- `/database/new/MySQL/00-引言` — 侧边栏正确显示 MySQL 章节
- `/database/new/Redis/00-引言`
- `/database/new/MongoDB/00-引言`
- `/database/new/ElasticStack/00-引言`
- `/database/new/Oracle/00-引言`
- `/bigdata/new/BigData/00-引言`
- `/bigdata/new/Flink/00-引言`
- ... 所有 28 个 topic 的首页

- [ ] **Step 3: 检查 Nginx 合并**

确认 `/devops/new/Nginx/` 原有 00-引言 内容未丢失，新章节已追加，侧边栏正常。

- [ ] **Step 4: 检查无 broken links**

在开发服务器中随机点几个章节链接，确认导航正常。

- [ ] **Step 5: 构建验证**

```bash
pnpm docs:build
```

确认 build 无错误。
