# 第6章 Kafka Connector


## 6.1、Kafka Connector基础

### 6.1.1、Kafka-Connector

- Kafka可以作为Flink的DataSource和DataSink
- Kafka中的Partition机制和Flink的并行度深度结合

### 6.1.2、Kafka Consumer消费策略设置

- setStartFromGroupOffsets()【默认消费策略】
- setStartFromEarliest()或者setStartFromLatest()
- setStartFromTimestamp(...)



### 6.1.3、Kafka Consumer的容错

如何开启Checkpoint？

```scala
env.enableCheckpointing(5000)
```

- 执行Checkpoint时，State数据保存在哪？
  - MemoryStateBackend【系统默认】
  - FsStateBackend
  - RocksDBStateBackend【推荐】

### 6.1.4、Kafka Consumer Offset自动提交

针对Job是否开启Checkpoint来区分：

如果Checkpoint关闭时：通过参数enable.auto.commit和auto.commit.interval.ms控制。

如果Checkpoint开启时：执行Checkpoint的时候才会提交offset。



### 6.1.5、Flink中Kafka Producer的使用

### 6.1.6、Flink中Kafka Producer的容错

- 如果Flink开启了Checkpoint，针对FlinkKafkaProducer可以提供EXACTLY_ONCE的语义保证；
- 可以通过semantic参数来指定三种不同的语义
  - Semantic.NONE
  - Semantic.AT_LEAST_ONCE【默认】
  - Semantic.EXACTLY_ONCE



