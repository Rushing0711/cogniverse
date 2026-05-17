# 第20章 Flume配置示例

### 20.1、配置示例（配对CDH5）

- 示例1：netcat=>控制台

  - 配置

  ```bash
  $ vim /usr/local/flume/config/example.conf
  ```

  ```bash
  # example.conf: A single-node Flume configuration
  
  # Name the components on this agent
  a1.sources = r1
  a1.sinks = k1
  a1.channels = c1
  
  # Describe/configure the source
  a1.sources.r1.type = netcat
  a1.sources.r1.bind = 0.0.0.0
  a1.sources.r1.port = 44444
  
  # Use a channel which buffers events in memory
  a1.channels.c1.type = memory
  # a1.channels.c1.capacity = 1000
  # a1.channels.c1.transactionCapacity = 100
  
  # Describe the sink
  a1.sinks.k1.type = logger
  
  # Bind the source and sink to the channel，特别注意第一个是channles第二个是channel不一样
  a1.sources.r1.channels = c1
  a1.sinks.k1.channel = c1
  ```

  - 启动

  ```bash
  $ /usr/local/flume/bin/flume-ng agent --conf $FLUME_HOME/conf --conf-file $FLUME_HOME/config/example.conf --name a1 -Dflume.root.logger=INFO,console
  ```

  - 测试

  ```bash
  $ telnet localhost 44444
  Trying ::1...
  Connected to localhost.
  Escape character is '^]'.
  lm
  OK
  ```

  写入后，查看`flume-ng`的启动窗口输出情况。

- 示例2：文件=>hdfs

  - 配置

  ```bash
  $ vim /usr/local/flume/config/flume-exec-hdfs.conf 
  ```

  ```bash
  #define agent
  exec-hdfs-agent.sources = exec-source
  exec-hdfs-agent.channels = exec-memory-channel
  exec-hdfs-agent.sinks = hdfs-sink
  
  #define source
  exec-hdfs-agent.sources.exec-source.type = exec
  exec-hdfs-agent.sources.exec-source.command = tail -F /usr/local/flume/config/flumedata.log
  exec-hdfs-agent.sources.exec-source.shell = /bin/sh -c
  
  #define channel
  exec-hdfs-agent.channels.exec-memory-channel.type = memory
  
  #define sink
  exec-hdfs-agent.sinks.hdfs-sink.type = hdfs
  exec-hdfs-agent.sinks.hdfs-sink.hdfs.path = hdfs://emon:8020/data/flume/tail
  exec-hdfs-agent.sinks.hdfs-sink.hdfs.fileType = DataStream
  exec-hdfs-agent.sinks.hdfs-sink.hdfs.writeFormat = Text
  exec-hdfs-agent.sinks.hdfs-sink.hdfs.batchSize = 10
  
  #bind source and sink to channel
  exec-hdfs-agent.sources.exec-source.channels = exec-memory-channel
  exec-hdfs-agent.sinks.hdfs-sink.channel = exec-memory-channel
  ```

  - 准备文件`flumedata.log`

  ```bash
  $ touch /usr/local/flume/config/flumedata.log 
  ```

  - 启动

  ```bash
  $ /usr/local/flume/bin/flume-ng agent --conf $FLUME_HOME/conf --conf-file $FLUME_HOME/config/flume-exec-hdfs.conf --name exec-hdfs-agent -Dflume.root.logger=INFO,console
  ```

  - 测试

  ```bash
  $ echo aaa >> /usr/local/flume/config/flumedata.log 
  ```

  - 验证

  ```bash
  # 查看hdfs文件
  $ hadoop fs -ls -R /data/flume/
  ```

- 示例3：文件夹=>hdfs

  - 配置

  ```bash
  $ vim /usr/local/flume/config/flume-spooling.conf
  ```

  ```bash
  #define agent
  spooling-hdfs-agent.sources = spooling-source
  spooling-hdfs-agent.channels = spooling-memory-channel
  spooling-hdfs-agent.sinks = hdfs-sink
  
  #define source
  spooling-hdfs-agent.sources.spooling-source.type = spooldir
  spooling-hdfs-agent.sources.spooling-source.spoolDir = /usr/local/flume/config/spool_data
  #先不要添加这句话，后续添加
  #spooling-hdfs-agent.sources.spooling-source.ignorePattern = ^(.)*\\.txt$
  
  #defing channel
  spooling-hdfs-agent.channels.spooling-memory-channel.type = memory
  
  #define sink
  spooling-hdfs-agent.sinks.hdfs-sink.type = hdfs
  spooling-hdfs-agent.sinks.hdfs-sink.hdfs.path = hdfs://emon:8020/data/flume/spooling
  spooling-hdfs-agent.sinks.hdfs-sink.hdfs.fileType = CompressedStream
  spooling-hdfs-agent.sinks.hdfs-sink.hdfs.codeC = org.apache.hadoop.io.compress.GzipCodec
  spooling-hdfs-agent.sinks.hdfs-sink.hdfs.filePrefix = events-
  #表示不以大小为滚动标准
  spooling-hdfs-agent.sinks.hdfs-sink.hdfs.rollSize = 0
  spooling-hdfs-agent.sinks.hdfs-sink.rollCount = 1000000
  spooling-hdfs-agent.sinks.hdfs-sink.rollInterval = 30
  
  #bind source and sink to channel
  spooling-hdfs-agent.sources.spooling-source.channels = spooling-memory-channel
  spooling-hdfs-agent.sinks.hdfs-sink.channel = spooling-memory-channel
  ```

  - 准备文件夹

  ```bash
  # 文件被put到hdfs后，文件会被重命名带 .COMPLETED 后缀
  $ mkdir /usr/local/flume/config/spool_data
  ```

  - 启动

  ```bash
  $ /usr/local/flume/bin/flume-ng agent --conf $FLUME_HOME/conf --conf-file $FLUME_HOME/config/flume-spooling.conf --name spooling-hdfs-agent -Dflume.root.logger=INFO,console
  ```

  - 测试

  ```bash
  $ echo "this is a test for flume spool" >> /usr/local/flume/config/1.log 
  $ echo "this is a test for flume spool" >> /usr/local/flume/config/2.txt
  ```

  - 验证

  ```bash
  # 查看hdfs文件
  $ hadoop fs -ls -R /data/flume/
  ```

- 示例4：增量到hdfs【优秀】

  - 配置

  ```bash
  $ vim /usr/local/flume/config/taildir-memory-logger.conf
  ```

  ```bash
  a1.sources = r1
  a1.channels = c1
  a1.sinks = k1
  
  #define source
  a1.sources.r1.type = TAILDIR
  a1.sources.r1.channels = c1
  a1.sources.r1.positionFile = /usr/local/flume/config/taildir_data/taildir_position.json
  a1.sources.r1.filegroups = f1 f2
  
  a1.sources.r1.filegroups.f1 = /usr/local/flume/config/taildir_data/test1/example.log
  a1.sources.r1.headers.f1.headerKey1 = value1
  
  a1.sources.r1.filegroups.f2 = /usr/local/flume/config/taildir_data/test2/.*log.*
  a1.sources.r1.headers.f2.headerKey1 = value2
  a1.sources.r1.headers.f2.headerKey2 = value2-2
  
  a1.sources.r1.fileHeader = true
  
  #Use a channel which buffers events in memory
  a1.channels.c1.type = memory
  a1.channels.c1.capacity = 1000
  a1.channels.c1.transactionCapacity = 100
  
  #Describe the sink
  a1.sinks.k1.type = logger
  
  #Bind the source and sink to the channel
  a1.sources.r1.channels = c1
  a1.sinks.k1.channel = c1
  ```

  - 准备

  ```bash
  $ mkdir -p /usr/local/flume/config/taildir_data/{test1,test2}
  ```

  - 启动

  ```bash
  $ /usr/local/flume/bin/flume-ng agent --conf $FLUME_HOME/conf --conf-file $FLUME_HOME/config/taildir-memory-logger.conf --name a1 -Dflume.root.logger=INFO,console
  ```

  - 测试

  ```bash
  $ echo aaa >> /usr/local/flume/config/taildir_data/test1/example.log
  $ echo bbb >> /usr/local/flume/config/taildir_data/test1/example.log
  $ echo 111 >> /usr/local/flume/config/taildir_data/test2/1.log
  $ echo 222 >> /usr/local/flume/config/taildir_data/test2/2.log
  ```

  写入后，查看`flume-ng`的启动窗口输出情况。

- 示例5：一个具有自定义拦截器功能的测试

  - 配置1：flume01.conf

  ```bash
  $ vim /usr/local/flume/config/flume01.conf
  ```
  
  ```bash
  # Name the components on this agent
  a1.sources = r1
  a1.channels = c1 c2
  a1.sinks = k1 k2
  
  # Describe/configure the source
  a1.sources.r1.type = netcat
  a1.sources.r1.bind = emon
  a1.sources.r1.port = 44444
  
  a1.sources.r1.interceptors = i1
  a1.sources.r1.interceptors.i1.type = com.coding.bigdata.flume.DomainInterceptor$Builder
  
  a1.sources.r1.selector.type = multiplexing
  a1.sources.r1.selector.header = type
  a1.sources.r1.selector.mapping.imooc = c1
  a1.sources.r1.selector.mapping.other = c2
  
  # Use a channel which buffers events in memory
  a1.channels.c1.type = memory
  a1.channels.c2.type = memory
  
  # Describe the sink
  a1.sinks.k1.type = avro
  a1.sinks.k1.hostname = emon
  a1.sinks.k1.port = 44445
  
  a1.sinks.k2.type = avro
  a1.sinks.k2.hostname = emon
  a1.sinks.k2.port = 44446
  
  # Bind the source and sink to the channel
  a1.sources.r1.channels = c1 c2
  a1.sinks.k1.channel = c1
  a1.sinks.k2.channel = c2
  ```
  
  - 配置2：flume02.conf
  
  ```bash
  $ vim /usr/local/flume/config/flume02.conf
  ```
  
  ```bash
  a2.sources = r1
  a2.channels = c1
  a2.sinks = k1
  
  # Describe/configure the source
  a2.sources.r1.type = avro
  a2.sources.r1.bind = emon
  a2.sources.r1.port = 44445
  
  # Use a channel which buffers events in memory
  a2.channels.c1.type = memory
  
  # Describe the sink
  a2.sinks.k1.type = logger
  
  # Bind the source and sink to the channel
  a2.sources.r1.channels = c1
  a2.sinks.k1.channel = c1
  ```
  
  - 配置3：flume03.conf
  
  ```bash
  $ vim /usr/local/flume/config/flume03.conf
  ```
  
  ```bash
  a3.sources = r1
  a3.channels = c1
  a3.sinks = k1
  
  # Describe/configure the source
  a3.sources.r1.type = avro
  a3.sources.r1.bind = emon
  a3.sources.r1.port = 44446
  
  # Use a channel which buffers events in memory
  a3.channels.c1.type = memory
  
  # Describe the sink
  a3.sinks.k1.type = logger
  
  # Bind the source and sink to the channel
  a3.sources.r1.channels = c1
  a3.sinks.k1.channel = c1
  ```
  
  - 准备
  
  ```bash
  # 上传自定义拦截器的jar到 /usr/local/flume/lib 目录
  ```
  
  - 启动：先启动flume02.conf->flume03.conf->flume01.conf，必须flue01在后面，flume02和flume03的先后数据没关系
  
  ```bash
  $ /usr/local/flume/bin/flume-ng agent --conf $FLUME_HOME/conf --conf-file $FLUME_HOME/config/flume02.conf --name a2 -Dflume.root.logger=INFO,console
  $ /usr/local/flume/bin/flume-ng agent --conf $FLUME_HOME/conf --conf-file $FLUME_HOME/config/flume03.conf --name a3 -Dflume.root.logger=INFO,console
  
  $ /usr/local/flume/bin/flume-ng agent --conf $FLUME_HOME/conf --conf-file $FLUME_HOME/config/flume01.conf --name a1 -Dflume.root.logger=INFO,console
  ```
  
  - 测试
  
  ```bash
  $ telnet localhost 44444
  Trying ::1...
  Connected to localhost.
  Escape character is '^]'.
  OK
  imooc.com
  OK
  test.com
  ```
  
  写入后，查看`flume-ng`的启动窗口输出情况。


- 示例5：netcat=>kafka

  - 配置：flume-kafka.conf

  ```bash
  $ vim /usr/local/flume/config/flume-kafka.conf
  ```
  
  ```bash
  # example.conf: A single-node Flume configuration
  
  # Name the components on this agent
  a1.sources = r1
  a1.sinks = k1
  a1.channels = c1
  
  # Describe/configure the source
  a1.sources.r1.type = netcat
  a1.sources.r1.bind = 0.0.0.0
  a1.sources.r1.port = 44444
  
  # Use a channel which buffers events in memory
  a1.channels.c1.type = memory
  # a1.channels.c1.capacity = 1000
  # a1.channels.c1.transactionCapacity = 100
  
  # Describe the sink
  a1.sinks.k1.type = org.apache.flume.sink.kafka.KafkaSink
  a1.sinks.k1.kafka.topic = test
  a1.sinks.k1.kafka.bootstrap.servers = emon:9092
  a1.sinks.k1.kafka.flumeBatchSize = 20
  a1.sinks.k1.kafka.producer.acks = 1
  a1.sinks.k1.kafka.producer.linger.ms = 1
  #a1.sinks.k1.kafka.producer.compression.type = snappy
  
  # Bind the source and sink to the channel
  a1.sources.r1.channels = c1
  a1.sinks.k1.channel = c1
  ```
  
  - 准备

  ```bash
  # 打开kafka消费者
  $ kafka-console-consumer.sh --bootstrap-server emon:9092 --topic test --from-beginning
  ```
  
  - 启动
  
  ```bash
  $ /usr/local/flume/bin/flume-ng agent --conf $FLUME_HOME/conf --conf-file $FLUME_HOME/config/flume-kafka.conf --name a1 -Dflume.root.logger=INFO,console
  ```
  
    - 测试
  
  ```bash
  $ telnet localhost 44444
  Trying ::1...
  Connected to localhost.
  Escape character is '^]'.
  testflume01
  ```
  
   写入后，查看`flume-ng`的启动窗口输出情况和`kafka消费者`窗口情况。`flume-ng`不会变化，但会转发消息到`kafka消费者`窗口。



7. 测试生产者消费者

- 生产者

```bash
# 打开生产者命令行模式
$ kafka-console-producer.sh --bootstrap-server emon:9092 --topic tests
```

- 消费者

```bash
# 打开消费者命令模式
[emon@emon tests-0]$ kafka-console-consumer.sh --bootstrap-server emon:9092 --topic tests --from-beginning
```



