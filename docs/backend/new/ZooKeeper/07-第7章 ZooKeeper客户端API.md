# 第7章 ZooKeeper客户端API

## 7.1 常用的ZooKeeper Java客户端

- ZooKeeper原生API

  - 配置

  ```xml
  <dependency>
      <groupId>org.apache.zookeeper</groupId>
      <artifactId>zookeeper</artifactId>
  </dependency>
  ```

  - 不足：Zookeeper的官方客户端提供了基本的操作，比如，创建会话、创建节点、读取节点、更新数据、删除节点和检查节点是否存在等。但对于开发人员来说，Zookeeper提供的基本操纵还是有一些不足之处。典型的缺点为：
    - Zookeeper的Watcher是一次性的，每次触发之后都需要重新进行注册；
    - Session超时之后没有实现重连机制；需要手动才可以。
    - 异常处理繁琐，Zookeeper提供了很多异常，对于开发人员来说可能根本不知道该如何处理这些异常信息；
    - 只提供了简单的byte[]数组的接口，没有提供针对对象级别的序列化；
    - 不支持递归创建节点；
    - 创建节点时如果节点存在抛出异常，需要自行检查节点是否存在；
    - 删除节点无法实现级联删除；

- ZkClient

  - 由Datameer的工程师开发，对Zookeeper的原生API进行了包装，实现了超时重连、Watcher反复注册等功能。像dubbo（2.3.0之前）等框架对其也进行了集成使用。从 2.3.0 版本开始支持可选 curator 实现。在2.7.x的版本中已经移除了zkclient的实现。
  - 不足：
    - 几乎没有参考文档；
    - 异常处理简化（抛出RuntimeException）；
    - 重试机制比较难用；
    - 没有提供各种使用场景的实现；

- Apache Curator

  - Apache Curator与ZooKeeper版本对应关系

  | Apache Curator                                               | ZooKeeper            |
  | ------------------------------------------------------------ | -------------------- |
  | Curator2.X、Curator4.2.X（需要排除ZooKeeper）                | ZooKeeper3.4.X       |
  | Curator3.0.0、Curator3.1.0、Curator3.2.0、Curator3.2.1、Curator3.3.0 | ZooKeeper3.5.1-alpha |
  | Curator4.0.0、Curator4.0.1                                   | ZooKeeper3.5.3-beta  |
  | Curator4.1.0、Curator4.2.0                                   | ZooKeeper3.5.4-beta  |
  | Curator4.3.0                                                 | ZooKeeper3.5.7       |
  | Curator5.0.0、Curator5.1.0                                   | ZooKeeper3.6.0       |
  | Curator5.2.0、Curator5.2.1、Curator5.3.0                     | ZooKeeper3.6.3       |
  | Curator5.4.0                                                 | ZooKeeper3.7.0       |

  - Curator组件与ZooKeeper版本对应关系

  | 组件名称  | 用途                                                         |
  | --------- | ------------------------------------------------------------ |
  | Client    | ZooKeeper客户端的封装，用于取代原生的ZooKeeper客户端，提供了一些底层处理和相关的工具方法。 |
  | Framework | 简化ZooKeeper高级功能的使用，并增加了一些新的功能，比如ZooKeeper集群连接、重试等。 |
  | Recipes   | ZooKeeper所有的典型应用场景的实现（除了两阶段提交外），该主机依赖Client和Framework。包括监听、各种分布式锁（可重入锁、排他锁、共享锁、信号锁等）、缓存、队列、选举、分布式atomic（分布式计数器）、分布式Barrier等等。 |
  | Utilities | 为ZooKeeper提供的各种工具类。                                |
  | Errors    | Curator异常处理、连接、恢复等。                              |

  - Maven依赖

  | GroupID/Org        | ArtifactID/Name           | 描述                                                         |
  | ------------------ | ------------------------- | ------------------------------------------------------------ |
  | org.apache.curator | curator-recipes           | 所有典型应用场景。需要依赖client和framework，需设置自动获取依赖。 |
  | org.apache.curator | curator-framework         | 同组件中framework介绍                                        |
  | org.apache.curator | curator-client            | 同组件中client介绍                                           |
  | org.apache.curator | curator-test              | 包含TestingServer、TestingCluster和一些测试工具。            |
  | org.apache.curator | curator-examples          | 各种使用Curator特性的案例                                    |
  | org.apache.curator | curator-x-discovery       | 在framework上构建的服务发现实现。                            |
  | org.apache.curator | curator-x-discoveryserver | 可以和Curator Discovery一起使用的RESTful服务器。             |
  | org.apache.curator | curator-x-rpc             | Curator Framework和Recipes非Java环境的桥接。                 |

  - Apache的开源项目
  - 解决Watcher的注册一次就失效问题
  - API更加简单易用
  - 提供更多解决方案并且实现简单，比如：分布式锁
  - 提供常用的ZooKeeper工具类
  - 编程风格更爽
