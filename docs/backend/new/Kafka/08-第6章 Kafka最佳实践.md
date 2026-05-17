# 八十、Kafka最佳实践

## 8.1、配置推荐

### 8.1.1、服务端必要参数

| 参数              | 可选性 | 描述                                    |
| ----------------- | ------ | --------------------------------------- |
| zookeeper.connect | 必须   | 建议在kafka集群的每台机器都配置所有zk   |
| broker.id         | 必须   | 集群节点的标识符，不得重复，取值范围0~n |
| log.dirs          | 必须   | 不要使用默认的`/tmp/kafka-logs`         |

### 8.1.2、服务端推荐参数

| 参数                           | 描述                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| advertised.host.name           | 注册到zk供用户使用的主机名，内网环境通常需要配置             |
| advertised.port                | 注册到zk供用户使用的服务端口                                 |
| num.partitions                 | 创建topic时默认的partition数量。默认值：1                    |
| default.replication.factor     | 自动创建topic的默认副本数量，建议至少修改为2。默认值：1      |
| min.insync.replicas            | 也即是ISR，提交生产者请求的最小副本数，建议至少2~3个。默认值：1 |
| unclean.leader.election.enable | 是否允许不具备ISR资格的replicas被选举为leader，建议false。默认值：false |
| controlled.shutdown.enable     | 在kafka收到stop命令或者异常终止时，允许自动同步数据，建议开启。默认值：true |

### 8.1.3、动态调整参数

| 参数                           | 描述                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| unclean.leader.election.enable | 不严格的leader选举，有助于集群健壮，但是存在数据丢失风险。   |
| min.insync.replicas            | 如果同步状态的副本小于该值，服务器将不再接受 request.required.acks 为-1 或者 all的写入请求。 |
| max.message.bytes              | 单条消息的最大长度。如果修改了该值，那么 replica.fetch.max.bytes 和消费者的 max.partition.fetch.bytes 也要跟着修改。<br />另外，如果使用了 kafka-mirror-maker.sh 则生产者的 max.request.size 也要跟着同步修改 |
| cleanup.policy                 | 生命周期终结数据的处理。默认值：delete。                     |
| flush.messages                 | 强制刷新写入的最大缓存消息数。默认值：Long.MaxValue          |
| flush.ms                       | 强制刷新写入的最大等待时长。默认值：Long.MaxValue            |

### 8.1.4、客户端配置

Producer：ack、压缩、同步生产vs 异步生产、批处理大小（异步生产）

Consumer方面主要考虑：partition数量及获取消息的大小

### 80.1.5、记录同步/消费大尺寸消息的配置

- brokers端

```properties
message.max.bytes=15728640
replica.fetch.max.bytes=15728640
# 其他配置
log.flush.interval.messages=10000
log.flush.interval.ms=1000
log.retention.hours=24
log.retention.check.interval.ms=300000
```

- 消费者

```properties
fetch.max.bytes=2097152
fetch.max.wait.ms=1000
max.partition.fetch.bytes=15728640
```

- 生产者

```properties
max.request.size=15728640
partitioner.class=org.apache.kafka.clients.producer.RoundRobinPartitioner
```



## 80.2、服务器最佳实践

### 80.2.1、JVM参数建议

- 使用JVM的G1垃圾回收器

  ```bash
  # 查看Java垃圾回收器
  $ java -XX:+PrintCommandLineFlags -version
  # 命令输出
  -XX:InitialHeapSize=264990016 -XX:MaxHeapSize=4239840256 -XX:+PrintCommandLineFlags -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:-UseLargePagesIndividualAllocation -XX:+UseParallelGC
  java version "1.8.0_91"
  Java(TM) SE Runtime Environment (build 1.8.0_91-b15)
  Java HotSpot(TM) 64-Bit Server VM (build 25.91-b15, mixed mode)
  ```

- Java启动参数配置示例（24GB内存的四核英特尔至强处理器，8x7200转的SATA硬盘）

```bash
-Xmx6g -Xms6g -XX:MetaspaceSize=96m -XX:+UseG1GC-XX:MaxGCPauseMillis=20 -XX:InitiatingHeapOccupancyPercent=35 -XX:G1HeapRegionSize=16M -XX:MinMetaspaceFreeRatio=50 -XX:MaxMetaspaceFreeRatio=80
```

- 操作系统调优（以CentOS或Redhat为例）

1. 内存：建议使用64G内存的机器
2. CPU：尽量选择更多核，将会获得多核带来的更好的并发处理性能
3. 磁盘：RAID是优先推荐的，SSD也可以考虑
4. 网络：最好是万兆网络，千兆也可
5. 文件系统：ext4是最佳选择
6. 操作系统：任何Unix系统上运行良好，并且已经在Linux和Solaris上进行了测试



### 80.2.3、核心参数调整建议

- 文件描述符数量调整：(number_of_partitions) * (partition_size/segment_size)，建议100000以上

  > number_of_partitions ==> topic的分区数量
  >
  > partition_size ==> 
  >
  > segment_size ==> log.segment.bytes ==> 默认1G

- 最大套接字缓冲区大小

- pagecache：尽量分配与大多数日志的激活日志段大小一致

- 禁用swap

- 设计broker的数量：单broker上分区数<2000；分区大小，不要超过25G

- 设计partition数量

  - 至少和最大的消费者组中consumer的数量一致

  - 分区不要太大，小于25G

