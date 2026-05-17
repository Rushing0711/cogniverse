# 第5章 ZooKeeper基础与进阶

## 5.1 ZooKeeper简介

- 中间件，提供协调服务
- 作用于分布式系统，发挥其优势，可以为大数据服务
- 支持Java，提供Java和C语言的客户端API

## 5.2 什么是分布式系统

- 很多台计算机组成一个整体，一个整体一致对外并且处理同一个请求
- 内部的每台计算机都可以互相通信（rest/rpc）
- 客户端到服务端的一次请求到响应结束会经历多台计算机

## 5.3 ZooKeeper的特性

- 一致性：数据一致性，数据按照顺序分批入库
- 原子性：事务要么成功要么失败，不会局部化
- 单一视图：客户端连接集群中的任一ZK节点，数据都是一致的
- 可靠性：每次对ZK的操作状态都会保存在服务端
- 实时性：客户端可以读取到ZK服务端的最新数据

## 5.4 ZooKeeper主要目录结构

```bash
# ZooKeeper 3.5.9
$ tree -L 1
```

> .
> ├── bin：主要的一些运行命令
> ├── conf：存放配置文件，其中我们需要修改zoo_sample.cfg（复制为zoo.cfg并修改配置内容）
> ├── data
> ├── docs：文档
> ├── lib：需要依赖的jar包
> ├── LICENSE.txt
> ├── logs
> ├── NOTICE.txt
> ├── README.md
> └── README_packaging.txt

## 5.5 zoo.cfg配置

- tickTime ：用于计算的时间单元。比如session超时：N*tickTime。默认值：2000，单位毫秒
- initLimit ： 用于集群，允许 从节点连接 并同步到 master节点 的初始化连接时间，以tickTime的倍数来表示。默认值：10
- syncLimit ： 用于集群，master主节点与从节点之间发送消息，请求和应答时间长度。（心跳机制）默认值：5
- dataDir ： 必须配置，默认值：/tmp/zookeeper
- dataLogDir ： 日志目录，如果不配置会和dataDir公用
- clientPort ： 连接服务器的端口，默认值：2181

## 5.6 ZooKeeper基本数据模型介绍

- 是一个树形结构，类似于前端开发中的tree.js组件
- 每一个节点都称之为znode，它可以有子节点，也可以有数据
- 每个节点分为临时节点和永久节点，临时节点在客户端断开后消失
- 每个zk节点都有各自的版本号，可以通过命令行来显示节点信息
- 每当节点数据发生变化，那么该节点的版本号会累加（乐观锁）
- 删除/修改过时节点，版本号不匹配则会报错
- 每个zk节点存储的数据不宜过大，几K即可
- 节点可以设置权限acl，可以通过权限来限制用户的访问

## 5.7 zk的作用体现

- master节点选举，主节点挂了以后，从节点就会接手工作，并且保证这个节点是唯一的，这也是所谓首脑模式，从而保证我们的集群是高可用的。
- 统一配置文件管理，即只需要部署一台服务器，则可以把相同的配置文件同步更新到其他所有服务器，此操作在云计算中用的特别多（假设修改了redis统一配置）。
- 发布与订阅，类似消息队列MQ（amq，rmq...），dubbo发布者把数据存储在znode上，订阅者会读取这个数据
- 提供分布式锁，分布式环境中不同进程之间争夺资源，类似于多线程中的锁。
- 集群管理，集群中保证数据的强一致性。

## 5.8 session的基本原理

- 客户端与服务端之间的连接存在会话
- 每个会话都可以设置一个超时时间
- 心跳结束，session则过期
- session过期，则临时节点znode会被抛弃
- 心跳机制：客户端向服务端的ping包请求

## 5.9 watcher机制详解

- 针对每个节点的操作，都会有一个监督者=>watcher
- 当监控的某个对象（znode）发生了变化，则触发watcher事件
- zk中的watcher是一次性的，触发后立即小慧
- 父节点，子节点 增删改都能够触发其watcher
- 针对不同类型的操作，触发的watcher事件也不同：
  - （子）节点创建事件
  - （子）节点删除事件
  - （子）节点数据变化事件

## 5.10 ACL权限控制详解

- 针对节点可以设置相关读写等权限，目的是为了保障数据安全性。
- 权限permissions可以指定不同的权限范围以及角色。
- ACL命令行
  - getAcl：获取某个节点的acl权限信息
  - setAcl：设置某个节点的acl权限信息
  - addauth：输入认证授权信息，注册时输入明文密码（登录），但是在zk的系统里，密码是以加密的形式存在的。

- ACL的构成
  - zk的acl通过`[schemaid:id:permissions]`来构成权限列表
    - schema：代表采用的某种权限机制
      - world：world下只有一个id，即只有一个用户，也就是anyone，那么组合的写法就是`world:anyone:[permissions]`
      - auth：代表认证登录，需要注册用户有权限就可以，形式为`auth:user:password:[permissions]`
      - digest：需要对密码加密才能访问，组合形式为`digest:username:BASE64(SHA1(password)):[permissions]`
      > 简而言之，auth与digest的区别就是，前者明文，后者密文。
      > setAcl /path auth:lee:lee:cdrwa
      > 与
      > setAcl /path digest:lee:BASE64(SHA1(password)):cdrwa
      > 是等价的，在通过 addauth digest lee:lee 后都能操作指定节点的权限
      - ip：当设置为ip指定的ip地址，此时限制ip进行访问，比如 `ip:192.168.1.1:[permissions]`
      - super：代表超级管理员，拥有所有的权限
    - id：代表允许访问的用户
    - permissions：权限组合字符串
      - 权限字符串缩写`crdwa`
        - CREATE：创建子节点
        - DELETE：删除子节点
        - READ：获取节点/子节点
        - WRITE：设置节点数据
        - ADMIN：设置权限

## 5.11 ACL的常用使用场景

- 开发/测试环境分离，开发者无权操作测试库的节点，只能看。
- 生产环境上控制指定ip的服务可以访问相关节点，防止混乱。
