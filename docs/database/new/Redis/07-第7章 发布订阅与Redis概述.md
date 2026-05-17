# 第7章 发布订阅与Redis概述

## 7.1、Redis的发布（pub）与订阅（sub）

- 订阅

```bash
emon:6379> subscribe channel [channel ...]
```

- 发布

```bash
emon:6379> publish channel message
```

- 批量订阅

```bash
emon:6379> psubscribe pattern [pattern ...]
```

## 7.2、Redis概述

### 7.2.1、什么是Redis

Redis是一种面向"Key-Value"数据类型的内存数据库，可以满足我们对海量数据的快速读写需求。

注意：首先Redis是一种内存数据库，它的数据都是放在内存里面的；

然后Redis中存储的数据都是Key-Value类型的；

其中Redis中的Key只能是字符串，Value支持多种数据类型。

常见的有`string`、`hash`、`list`、`set`、`sortedset`等。

1. 字符串string
2. 哈希hash，类似于java中的hashmap
3. 字符串列表list
4. 字符串集合set不重复，无序
5. 有序集合sorted set，不重复，有序

### 7.2.2、Redis的特点

接下来看一下Redis的一些特点：

- 高性能：Redis读的速度是11W次/s，写的速度是8.1W次/s
- 原子性：保证数据的准确性
- 持久存储：支持两种方式的持久化，RDB和AOF，可以把内存中的数据持久化到磁盘中
- 支持主从：master-slave架构，可以实现负载均衡、高可用
- 支持集群：从3.0版本开始支持

> 注意：Redis是一个单线程的服务，作者之所以这么设计，主要是为了保证redis的快速，高效，如果涉及了多线程，就需要使用锁机制来解决并发问题，这样执行效率反而会打折扣。

> 注意：Redis是一个NoSQL数据库，NoSQL的全称是not only sql，不仅仅是SQL，泛指菲关系数据库，这种类型的数据库不支持SQL语法。

### 7.2.3、Redis的应用场景

主要应用在高并发和实时请求的场景，例如：新浪微博。

hash：关注列表、粉丝列表

string：微博数，粉丝数（避免使用select count(*) from xxx)
