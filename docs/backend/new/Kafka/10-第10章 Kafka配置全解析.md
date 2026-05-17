# 九十九、Kafka配置全解析

Kafka中提供了`listeners`和`advertised.listeners`两个配置项，两个配置项的具体含义和作用是什么？有什么区别，以及应该如何进行配置呢？

【概念理解】

要搞清楚这些问题，首先得搞清楚两个逻辑概念：一个是Kafka的侦听ip，一个是Kafka的`broker ip`。

所谓Kafka的侦听ip，顾名思义，就是tcp的侦听ip。可以在某个固定的ip上侦听，也可以是全网段进行侦听（0.0.0.0）。如果是在某个固定ip上侦听，例如`127.0.0.1`，那么只有与该ip正确连接的客户端能够成功连接到Kafka；而如果是全网段侦听，那么可以与Kafka所在机器的任意ip进行连接并访问Kafka。

但是，与Kafka连接成功后，并不意味着就能成功进行生产和消费。

成功连接Kafka的侦听ip，意味着tcp的三次握手已经成功了，在这之后会进行Kafka层面的协议交互，例如用户登录认证，元数据信息获取，向topic生产和消费等等。其中最重要的就是元数据信息的获取。

Kafka的元数据信息包括topic名称，topic的分区（partition），每个分区的Leader所在的broker的id，以及每个broker的ip地址等。

由于向topic的分区进行生产消费，最终都需要与分区的Leader进行交互。因此，获取到元数据信息后，客户端（生产者或者消费者）会和topic分区的Leader所在的broker建立新的tcp连接以进行后续的生产消费。这就是Kafka的broker ip的作用，也即真正用于生产消费的ip地址。

## 10.1、[Broker Configs](https://kafka.apache.org/25/documentation.html#brokerconfigs)

必须的配置项：

- `broker.id`
- `log.dirs`
- `zookeeper.connect`

主题级的配置和默认值如下：

| 属性                                                        | 默认值                        | 描述                                                         |
| ----------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------ |
| zookeeper.connect                                           |                               | ZooKeeper连接字符串的格式为：`hostname:port`，此处hostname和port分别是ZooKeeper集群中某个节点的host和port；为了当某个host当掉之后你能通过其他ZooKeeper节点进行连接，你可以按照以下方式指定多个主机：`hostname1:port1,hostname2:port2,hostname2:port3`。<br />ZooKeeper允许你增加一个“chroot”路径，将集群中所有Kafka数据存放在特定的路径下。当多个Kafka集群或者其他应用使用相同ZooKeeper集群时，可以使用这个方式设置数据存放路径。这种方式的实现可以通过这样设置连接字符串格式，如下所示：`hostname1:port1,hostname2:port2,hostname3:port3/chroot/path` 这样设置就将所有Kafka集群数据存放在`/chroot/path`路径下。注意，在你启动broker之前，你必须创建这个路径，并且consumers必须使用相同的连接格式。 |
| advertised.host.name                                        | null                          | 【已废弃】，仅当`advertised.listeners`或`listeners`未设置时启用；目前已使用`advertised.listeners`替代。发布到ZooKeeper以供客户端使用的Hostname。在IaaS环境下，该值可能需要与broker绑定的接口不同。该值未设置情况下，如果`host.name`配置了，则使用`host.name`；否则，将使用`java.net.InetAddress.getCanonicalHostName()`返回的值。 |
| advertised.listeners                                        | null                          | 给客户端用的发布至ZooKeeper的监听，broker会上送此地址到ZooKeeper，ZooKeeper会将此地址提供给消费者，消费者根据此地址获取消息。如果和`listeners`不同，则以此为准，在IaaS环境，此配置项可能和broker绑定的接口主机名不同，如果此配置项没有配置则以`listeners`为准。 |
| advertised.port                                             | null                          | 【已废弃】，仅当`advertised.listeners`或`listeners`未设置时启用；目前已使用`advertised.listeners`替代。发布到ZooKeeper以供客户端使用的端口号。在IaaS环境下，该值可能需要与broker绑定的接口不同。如果该值未设置，则发布的端口与broker绑定的端口相同。 |
| auto.create.topics.enable                                   | true                          | 启用服务端自动创建topic。                                    |
| auto.leader.rebalance.enable                                | true                          | 是否允许定期进行leader选举。                                 |
| background.threads                                          | 10                            | 用于各种后台处理任务的线程数。                               |
| broker.id                                                   | -1                            | 服务端的broker id。如果未设置，一个唯一的broker id将生成。为了避免ZooKeeper生成的broker id和用户配置的broker id之间产生冲突，生成的broker id从`reserved.broker.max.id`+1开始。 |
| compression.type                                            | producer                      | 对给定的topic指定压缩类型。可接受的值有('gzip','snappy','lz4','zstd')。另外，还可以接收`uncompressed`表示不压缩，以及`producer`表示保留生产者的原始压缩编解码器。 |
| control.plane.listener.name                                 | null                          | 用于Controller和Broker之间通信的监听器名称，Broker将会使用该配置来定位监听列表中的EndPoint。如果未设置，则默认使用`inter.broker.listener.name`来通信，没有专门的链接。 |
| delete.topic.enable                                         | true                          | 启用删除topic。如果关闭此配置项，通过管理工具删除主题将无效。 |
| host.name                                                   | ""                            | 【已弃用】仅在listeners未设置时使用。使用listeners替代了。broker的hostname，如果设置了，将绑定到该地址上。如果未设置，绑定到所有网卡上。 |
| leader.imbalance.check.interval.seconds                     | 300                           | 默认300s，也即5分钟扫描一次，控制器触发分区再平衡检查的频率。 |
| leader.imbalance.per.broker.percentage                      | 10                            | 每个broker所能允许的leader失衡比率。如果超过该百分比，控制器将触发leader重新平衡。 |
| listeners                                                   | null                          | 监听列表，broker对外提供服务时绑定的ip和端口。多个之间逗号分隔，如果监听器名称不是一个安全的协议，`listener.security.protocol.map`必须设置。主机名设置为0.0.0.0表示绑定所有接口，主机名为空这绑定默认的接口。例如：`PLAINTEXT://myhost:9092,SSL://:9091`<br />`CLIENT://0.0.0.0:9092,REPLICATION://localhost:9093` |
| log.dir                                                     | /tmp/kafka-logs               | 日志数据的存储目录，对`log.dirs`的补充。                     |
| log.dirs                                                    | null                          | 日志数据的存放目录，如果未设置，将使用`log.dir`。            |
| log.flush.interval.messages                                 | Long.MaxValue                 | 消息刷新到磁盘之前，日志分区上积累的消息数量。               |
| log.flush.interval.ms                                       | null                          | 消息刷新到磁盘之前，日志在内存中停留的最大毫秒数。如果未设置，将使用`log.flush.scheduler.interval.ms`。 |
| log.flush.offset.checkpoint.interval.ms                     | 60000                         | 用于更新日志恢复点持久记录的频率。                           |
| log.flush.scheduler.interval.ms                             | Long.MaxValue                 | 检测日志是否需要刷新到磁盘的频率，单位毫秒                   |
| log.flush.start.offset.checkpoint.interval.ms               | 60000                         | 更新日志持久化日志记录的开始偏移量的频率                     |
| log.retention.bytes                                         | -1                            | 日志被删除之前的最大尺寸，即日志保留的最大大小               |
| log.retention.hours                                         | 168                           | 日志文件删除之前保留的时间，单位小时                         |
| log.retention.minutes                                       | null                          | 日志文件删除之前保留的时间，单位分钟；未设置默认使用`log.retention.hours` |
| log.retention.ms                                            | null                          | 日志文件删除之前保留的时间，单位毫秒；未设置默认使用`log.retention.minutes`，-1表示永久 |
| log.roll.hours                                              | 168                           | 在新日志segment展开之前的最大时间，单位：小时                |
| log.roll.ms                                                 | null                          | 新日志segment展开之前的最大时间，单位：毫秒；如果未设置，`log.roll.hours`将被使用。 |
| log.roll.jitter.hours                                       | 0                             | 指定日志切分段的小时数，避免日志切分时造成惊群               |
| log.roll.jitter.ms                                          | null                          | 指定日志切分段的毫秒数，如果不设置，默认使用log.roll.jitter.hours |
| log.segment.bytes                                           | 1073741824（1G）              | 单个日志文件的最大尺寸                                       |
| log.segment.delete.delay.ms                                 | 60000                         | 日志文件被真正删除之前保留的时间                             |
| message.max.bytes                                           | 1048588（约1M）               | 最大记录批大小                                               |
| min.insync.replicas                                         | 1                             | 当生产者acks为-1(all)时，该值指定了最小副本数量，这些副本必须确认写操作，才能认为写操作成功。如果不能满足这个最小值，那么生产者将抛出异常。 |
| num.io.threads                                              | 8                             | 服务器用于处理请求的线程数，其中可能包括磁盘I/O。            |
| num.network.threads                                         | 3                             |                                                              |
| num.recovery.threads.per.data.dir                           | 1                             |                                                              |
| num.replica.alter.log.dirs.threads                          | null                          |                                                              |
| num.replica.fetchers                                        | 1                             |                                                              |
| offset.metadata.max.bytes                                   | 4096                          |                                                              |
| offsets.commit.required.acks                                | -1                            |                                                              |
| offsets.commit.timeout.ms                                   | 5000                          |                                                              |
| offsets.load.buffer.size                                    | 5242880（5M）                 |                                                              |
| offsets.retention.check.interval.ms                         | 600000                        |                                                              |
| offsets.retention.minutes                                   | 10080                         |                                                              |
| offsets.topic.compression.codec                             | 0                             |                                                              |
| offsets.topic.num.partitions                                | 50                            |                                                              |
| offsets.topic.replication.factor                            | 3                             |                                                              |
| offsets.topic.segment.bytes                                 | 104857600（100M）             |                                                              |
| port                                                        | 9092                          |                                                              |
| queued.max.requests                                         | 500                           |                                                              |
| quota.consumer.default                                      | Long.MaxValue                 |                                                              |
| quota.producer.default                                      | Long.MaxValue                 |                                                              |
| replica.fetch.min.bytes                                     | 1                             |                                                              |
| replica.fetch.max.bytes                                     | 1048576                       |                                                              |
| replica.high.watermark.checkpoint.interval.ms               | 5000                          |                                                              |
| replica.lag.time.max.ms                                     | 30000                         |                                                              |
| replica.socket.receive.buffer.bytes                         | 65536                         |                                                              |
| replica.socket.timeout.ms                                   | 30000                         |                                                              |
| rerquest.timeout.ms                                         | 30000                         |                                                              |
| socket.receive.buffer.bytes                                 | 102400                        |                                                              |
| socket.request.max.bytes                                    | 104857600                     |                                                              |
| socket.send.buffer.bytes                                    | 102400                        |                                                              |
| transaction.max.timeout.ms                                  | 900000                        |                                                              |
| transaction.state.log.load.buffer.size                      | 5242880                       |                                                              |
| transaction.state.log.min.isr                               | 2                             |                                                              |
| transaction.state.log.num.partitions                        | 50                            |                                                              |
| transaction.state.log.replication.factor                    | 3                             |                                                              |
| transaction.state.log.segment.bytes                         | 104857600                     |                                                              |
| transaction.id.expiration.ms                                | 604800000                     |                                                              |
| unclean.leader.election.enable                              | false                         | 指示是否在万不得已的情况下启用不在ISR集中的副本作为领导者，即使这样做可能会导致数据丢失。 |
| zookeeper.connection.timeout.ms                             | null                          |                                                              |
| zookeeper.max.in.flight.requests                            | 10                            |                                                              |
| zookeeper.session.timeout.ms                                | 18000                         |                                                              |
| zookeeper.set.acl                                           | false                         |                                                              |
| broker.id.generation.enable                                 | true                          |                                                              |
| broker.rack                                                 | null                          |                                                              |
| connections.max.idle.ms                                     | 600000                        |                                                              |
| connections.max.reauth.ms                                   | 0                             |                                                              |
| controlled.shutdown.enable                                  | true                          |                                                              |
| controlled.shutdown.max.retries                             | 3                             |                                                              |
| controlled.shutdown.retry.backoff.ms                        | 5000                          |                                                              |
| controller.socket.timeout.ms                                | 30000                         |                                                              |
| default.replication.factor                                  | 1                             |                                                              |
| delegation.token.expiry.time.ms                             | 86400000                      |                                                              |
| delegation.token.master.key                                 | null                          |                                                              |
| delegation.token.max.lifetime.ms                            | 604800000                     |                                                              |
| delete.records.purgatory.purge.interval.requests            | medium                        |                                                              |
| fetch.max.bytes                                             | 57671680                      |                                                              |
| fetch.purgatory.purge.interval.requests                     | 1000                          |                                                              |
| group.initial.rebalance.delay.ms                            | 3000                          |                                                              |
| group.max.session.timeout.ms                                | 1800000                       | 注册消费者允许的`session.timeout.ms`的最大值。更长的超时时间让消费者有更多的时间在心跳之间处理消息，但代价是检测失败的时间更长。 |
| group.max.size                                              | Long.MaxValue                 |                                                              |
| group.min.session.timeout.ms                                | 6000                          | 注册消费者允许的`session.timeout.ms`的最小值。更短的超时时间会导致更快的故障检测，代价是更频繁的消费者心跳，这可能会压垮代理资源。 |
| inter.broker.listener.name                                  | null                          |                                                              |
| inter.broker.protocol.version                               | 2.5-IV0                       |                                                              |
| log.cleaner.backoff.ms                                      | 15000                         |                                                              |
| log.cleaner.dedupe.buffer.size                              | 134217728                     |                                                              |
| log.cleaner.delete.retention.ms                             | 86400000                      |                                                              |
| log.cleaner.enable                                          | true                          |                                                              |
| log.cleaner.io.buffer.load.factor                           | 0.9                           |                                                              |
| log.cleaner.io.buffer.size                                  | 524288                        |                                                              |
| log.cleaner.io.max.bytes.per.second                         | Double.MaxValue               |                                                              |
| log.cleaner.max.compaction.lag.ms                           | Long.MaxValue                 |                                                              |
| log.cleaner.min.cleanable.ratio                             | 0.5                           |                                                              |
| log.cleaner.min.compaction.log.ms                           | 0                             |                                                              |
| log.cleaner.threads                                         | 1                             |                                                              |
| log.cleanup.policy                                          | delete                        |                                                              |
| log.index.interval.bytes                                    | 4096                          |                                                              |
| log.index.size.max.bytes                                    | 10485760                      |                                                              |
| log.message.format.version                                  | 2.5-IV0                       |                                                              |
| log.message.timestamp.difference.max.ms                     | Long.MaxValue                 |                                                              |
| log.message.timestamp.type                                  | CreateTime                    |                                                              |
| log.preallocate                                             | false                         |                                                              |
| log.retention.check.interval.ms                             | 300000                        |                                                              |
| max.connections                                             | Log.MaxValue                  |                                                              |
| max.connections.per.ip                                      | Log.MaxValue                  |                                                              |
| max.connections.per.ip.overrides                            | ""                            |                                                              |
| max.incremental.fetch.session.cache.slots                   | 1000                          |                                                              |
| num.partitions                                              | 1                             |                                                              |
| password.encoder.old.secret                                 | null                          |                                                              |
| password.encoder.secret                                     | null                          |                                                              |
| principal.builder.class                                     | null                          |                                                              |
| producer.purgatory.purge.interval.requests                  | 1000                          |                                                              |
| queued.max.request.bytes                                    | -1                            |                                                              |
| replica.fetch.backoff.ms                                    | 1000                          |                                                              |
| replica.fetch.max.bytes                                     | 1048576                       |                                                              |
| replica.fetch.response.max.bytes                            | 10485760                      |                                                              |
| replica.selector.class                                      | null                          |                                                              |
| reserved.broker.max.id                                      | 1000                          |                                                              |
| sasl.client.callback.handler.class                          | null                          |                                                              |
| sasl.enabled.mechanisms                                     | GSSAPI                        |                                                              |
| sasl.jaas.config                                            | null                          |                                                              |
| sasl.kerberos.kinit.cmd                                     | /usr/bin/kinit                |                                                              |
| sasl.kerberos.min.time.before.relogin                       | 60000                         |                                                              |
| sasl.kerberos.principal.to.local.rules                      | DEFAULT                       |                                                              |
| sasl.kerberos.service.name                                  | null                          |                                                              |
| sasl.kerberos.ticket.renew.jitter                           | 0.05                          |                                                              |
| sasl.kerberos.ticket.renew.window.factor                    | 0.8                           |                                                              |
| sasl.login.callback.handler.class                           | null                          |                                                              |
| sasl.login.class                                            | null                          |                                                              |
| sasl.login.refresh.buffer.seconds                           | 300                           |                                                              |
| sasl.login.refresh.min.period.seconds                       | 60                            |                                                              |
| sasl.login.refresh.window.factor                            | 0.8                           |                                                              |
| sasl.login.refresh.window.jitter                            | 0.05                          |                                                              |
| sasl.mechanism.inter.broker.protocol                        | GSSAPI                        |                                                              |
| sasl.server.callback.handler.class                          | null                          |                                                              |
| security.inter.broker.protocol                              | PLAINTEXT                     |                                                              |
| ssl.cipher.suites                                           | ""                            |                                                              |
| ssl.client.auth                                             | none                          |                                                              |
| ssl.enabled.protocols                                       | TLSv1.2                       |                                                              |
| ssl.key.password                                            | null                          |                                                              |
| ssl.keymanager.algorithm                                    | SunX509                       |                                                              |
| ssl.keystore.location                                       | null                          |                                                              |
| ssl.keystore.password                                       | null                          |                                                              |
| ssl.keystore.type                                           | JKS                           |                                                              |
| ssl.protocol                                                | TLSv1.2                       |                                                              |
| ssl.provider                                                | null                          |                                                              |
| ssl.trustmanager.algorithm                                  | PKIX                          |                                                              |
| ssl.truststore.location                                     | null                          |                                                              |
| ssl.truststore.password                                     | null                          |                                                              |
| ssl.truststore.type                                         | JKS                           |                                                              |
| zookeeper.clientCnxnSocket                                  | null                          |                                                              |
| zookeeper.ssl.client.enable                                 | false                         |                                                              |
| zookeeper.ssl.keystore.location                             | null                          |                                                              |
| zookeeper.ssl.keystore.password                             | null                          |                                                              |
| zookeeper.ssl.keystore.type                                 | null                          |                                                              |
| zookeeper.ssl.truststore.location                           | null                          |                                                              |
| zookeeper.ssl.truststore.password                           | null                          |                                                              |
| zookeeper.ssl.truststore.type                               | null                          |                                                              |
| alter.config.policy.class.name                              | null                          |                                                              |
| alter.log.dirs.replication.quota.window.num                 | 11                            |                                                              |
| alter.log.dirs.replication.quota.window.size.seconds        | 1                             |                                                              |
| authorizer.class.name                                       | ""                            |                                                              |
| client.quota.callback.class                                 | null                          |                                                              |
| connection.failed.authentication.delay.ms                   | 100                           |                                                              |
| create.topic.policy.class.name                              | null                          |                                                              |
| delegation.token.expiry.check.interval.ms                   | 3600000                       |                                                              |
| kafka.metrics.polling.interval.secs                         | 10                            |                                                              |
| kafka.metrics.reporters                                     | ""                            |                                                              |
| listener.security.protocol.map                              | SSL:SSL,SASL_SSL:SASL_SSL,... |                                                              |
| log.message.downconversion.enable                           | true                          |                                                              |
| metric.reporters                                            | ""                            |                                                              |
| metrics.num.samples                                         | 2                             |                                                              |
| metrics.recording.level                                     | INFO                          |                                                              |
| metrics.sample.window.ms                                    | 30000                         |                                                              |
| password.encoder.cipher.algorithm                           | AES/CBC/PKCS5Padding          |                                                              |
| password.encoder.iterations                                 | 4096                          |                                                              |
| password.encoder.key.length                                 | 128                           |                                                              |
| password.encoder.keyfactory.algorithm                       | null                          |                                                              |
| quota.window.num                                            | 11                            |                                                              |
| quota.window.size.seconds                                   | 1                             |                                                              |
| replication.quota.window.num                                | 11                            |                                                              |
| replication.quota.window.size.seconds                       | 1                             |                                                              |
| security.providers                                          | null                          |                                                              |
| ssl.endpoint.identification.algorithm                       | https                         |                                                              |
| ssl.principal.mapping.rules                                 | DEFAULT                       |                                                              |
| ssl.secure.random.implementation                            | null                          |                                                              |
| transaction.abort.timed.out.transaction.cleanup.interval.ms | 10000                         |                                                              |
| transaction.remove.expired.transaction.cleanup.interval.ms  | 3600000                       |                                                              |
| zookeeper.ssl.cipher.suites                                 | null                          |                                                              |
| zookeeper.ssl.crl.enable                                    | false                         |                                                              |
| zookeeper.ssl.enabled.protocols                             | null                          |                                                              |
| zookeeper.ssl.endpoint.identification.algorithm             | HTTPS                         |                                                              |
| zookeeper.ssl.ocsp.enable                                   | false                         |                                                              |
| zookeeper.ssl.protocol                                      | TLSv1.2                       |                                                              |
| zookeeper.sync.time.ms                                      | 2000                          |                                                              |

### 10.1.1、[Updating Broker Configs](https://kafka.apache.org/25/documentation.html#dynamicbrokerconfigs)

## 10.2、[Topic Configs](https://kafka.apache.org/25/documentation.html#topicconfigs)

| 属性                                    | 默认值          | 描述                                                         |
| --------------------------------------- | --------------- | ------------------------------------------------------------ |
| cleanup.policy                          | delete          | 可选值[compact,delete]；要么是 delete 要么是 compact ；这个字符串指明了针对旧日志部分的利用方式；默认方式（ delete ）将会丢失旧的部分当他们的回收时间或者尺寸限制到达时。 compact 将会进行日志压缩。 |
| compression.type                        | producer        |                                                              |
| delete.retention.ms                     | 86400000（1天） | 对于压缩日志保留的最长时间，也是客户端消费消息的最长时间，与log.retention.minutes（未压缩数据）的区别在于一个控制未压缩数据，一个控制压缩后的数据。此选项可以在topic创建覆盖。【可覆盖】 |
| file.delete.delay.ms                    | 60000           |                                                              |
| flush.messages                          | Long.MaxValue   | 此项配置指定时间间隔：强制进行 fsync日志。例如，如果这个选项设置为1，那么每条消息之后都需要进行 fsync ，如果设置为5，则每5条消息就需要进行一次fsync 。一般来说，建议你不要设置这个值。此参数的设置，需要在“数据可靠性”与“性能”之间做好必要的权衡。如果此值过大，会导致每次 fsync 的时间较长（IO阻塞），如果此值过小，将会导致 fsync的次数较多，这也意味着整体的client请求有一定的延迟。物理server故障，将会导致没有 fsync 的消息丢失。 |
| flush.ms                                | Long.MaxValue   |                                                              |
| follower.replication.throttled.replicas | ""              |                                                              |
| index.interval.bytes                    | 4096            |                                                              |
| leader.replication.throttled.replicas   | ""              |                                                              |
| max.compaction.lag.ms                   | Long.MaxValue   |                                                              |
| max.message.bytes                       | 1048588         |                                                              |
| message.format.version                  | 2.5-IV0         |                                                              |
| message.timestamp.difference.max.ms     | Long.MaxValue   |                                                              |
| message.timestamp.type                  | CreateTime      |                                                              |
| min.cleanable.dirty.ratio               | 0.5             |                                                              |
| min.compaction.lag.ms                   | 0               |                                                              |
| min.insync.replicas                     | 1               | 当生产者acks为-1(all)时，该值指定了最小副本数量，这些副本必须确认写操作，才能认为写操作成功。如果不能满足这个最小值，那么生产者将抛出异常。 |
| preallocate                             | false           |                                                              |
| retention.bytes                         | -1              |                                                              |
| retention.ms                            | 604800000       |                                                              |
| segment.bytes                           | 1073741824      |                                                              |
| segment.index.bytes                     | 10485760        |                                                              |
| segment.jitter.ms                       | 0               |                                                              |
| segment.ms                              | 604800000       |                                                              |
| unclean.leader.election.enable          | false           | 指示是否将不在ISR集合中的副本选为领导者作为最后的手段，即使这样做可能会导致数据丢失。 |
| message.downconversion.enable           | true            |                                                              |

## 10.3、[Producer Configs](https://kafka.apache.org/25/documentation.html#producerconfigs)

- 关键参数

  - batch.size
  - acks
  - linger.ms
  - compression.type
  - max.in.flight.requests.per.connection
  - retries

  

- 全量参数

| 属性                                     | 默认值                                                       | 描述                |
| ---------------------------------------- | ------------------------------------------------------------ | ------------------- |
| key.serializer                           |                                                              |                     |
| value.serializer                         |                                                              |                     |
| acks                                     | 默认值1；可选值[all,-1,0,1]                                  |                     |
| bootstrap.servers                        | ""                                                           |                     |
| buffer.memory                            | 33554432                                                     |                     |
| compression.type                         | none                                                         |                     |
| retries                                  | Integer.MaxValue                                             |                     |
| ssl.key.password                         | null                                                         |                     |
| ssl.keystore.location                    | null                                                         |                     |
| ssl.keystore.password                    | null                                                         |                     |
| ssl.truststore.location                  | null                                                         |                     |
| ssl.truststore.password                  | null                                                         |                     |
| batch.size                               | 16384（16K）                                                 | 控制一个batch的大小 |
| client.dns.lookup                        | default                                                      |                     |
| client.id                                | ""                                                           |                     |
| connections.max.idle.ms                  | 540000                                                       |                     |
| delivery.timeout.ms                      | 120000                                                       |                     |
| linger.ms                                | 0                                                            |                     |
| max.block.ms                             | 60000                                                        |                     |
| max.request.size                         | 1048576                                                      |                     |
| partitioner.class                        | org.apache.kafka.clients.producer.internals.DefaultPartitione |                     |
| receive.buffer.bytes                     | 32768                                                        |                     |
| request.timeout.ms                       | 30000                                                        |                     |
| sasl.client.callback.handler.class       | null                                                         |                     |
| sasl.jaas.config                         | null                                                         |                     |
| sasl.kerberos.service.name               | null                                                         |                     |
| sasl.login.callback.handler.class        | null                                                         |                     |
| sasl.login.class                         | null                                                         |                     |
| sasl.mechanism                           | GSSAPI                                                       |                     |
| security.protocol                        | PLAINTEXT                                                    |                     |
| send.buffer.bytes                        | 131072                                                       |                     |
| ssl.enabled.protocols                    | TLSv1.2                                                      |                     |
| ssl.keystore.type                        | JKS                                                          |                     |
| ssl.protocol                             | TLSv1.2                                                      |                     |
| ssl.provider                             | null                                                         |                     |
| ssl.truststore.type                      | JKS                                                          |                     |
| enable.idempotence                       | false                                                        |                     |
| interceptor.classes                      | ""                                                           |                     |
| max.in.flight.requests.per.connection    | 5                                                            |                     |
| metadata.max.age.ms                      | 300000                                                       |                     |
| metadata.max.idle.ms                     | 300000                                                       |                     |
| metric.reporters                         | ""                                                           |                     |
| metrics.num.samples                      | 2                                                            |                     |
| metrics.recording.level                  | INFO                                                         |                     |
| metrics.sample.window.ms                 | 30000                                                        |                     |
| reconnect.backoff.max.ms                 | 1000                                                         |                     |
| retry.backoff.ms                         | 100                                                          |                     |
| sasl.kerberos.kinit.cmd                  | /usr/bin/kinit                                               |                     |
| sasl.kerberos.min.time.before.relogin    | 60000                                                        |                     |
| sasl.kerberos.ticket.renew.jitter        | 0.05                                                         |                     |
| sasl.kerberos.ticket.renew.window.factor | 0.8                                                          |                     |
| sasl.login.refresh.buffer.seconds        | 300                                                          |                     |
| sasl.login.refresh.min.period.seconds    | 60                                                           |                     |
| sasl.login.refresh.window.factor         | 0.8                                                          |                     |
| sasl.login.refresh.window.jitter         | 0.05                                                         |                     |
| security.providers                       | null                                                         |                     |
| ssl.cipher.suites                        | null                                                         |                     |
| ssl.endpoint.identification.algorithm    | https                                                        |                     |
| ssl.keymanager.algorithm                 | SunX509                                                      |                     |
| ssl.secure.random.implementation         | null                                                         |                     |
| ssl.trustmanager.algorithm               | PKIX                                                         |                     |
| transaction.timeout.ms                   | 60000                                                        |                     |
| transactional.id                         | null                                                         |                     |
|                                          |                                                              |                     |
|                                          |                                                              |                     |
| worker.sync.timeout.ms                   | 3000                                                         |                     |
| worker.unsync.backoff.ms                 | 300000                                                       |                     |
| access.control.allow.methods             | ""                                                           |                     |
| access.control.allow.origin              | ""                                                           |                     |
| admin.listeners                          | null                                                         |                     |
| client.id                                | ""                                                           |                     |
| config.providers                         | ""                                                           |                     |
| config.storage.replication.factor        | 3                                                            |                     |
| connect.protocol                         | sessioned                                                    |                     |
| header.converter                         | org.apache.kafka.connect.storage.SimpleHeaderConverter       |                     |
| inter.worker.key.generation.algorithm    | HmacSHA256                                                   |                     |
| inter.worker.key.size                    | null                                                         |                     |
| inter.worker.key.ttl.ms                  | 3600000                                                      |                     |
| inter.worker.signature.algorithm         | HmacSHA256                                                   |                     |
| inter.worker.verification.algorithms     | HmacSHA256                                                   |                     |
| internal.key.converter                   | org.apache.kafka.connect.json.JsonConverter                  |                     |
| internal.value.converter                 | org.apache.kafka.connect.json.JsonConverter                  |                     |
| listeners                                | null                                                         |                     |
| metadata.max.age.ms                      | 300000                                                       |                     |
| metric.reporters                         | ""                                                           |                     |

## 10.4、[Consumer Configs](https://kafka.apache.org/25/documentation.html#consumerconfigs)

| 属性                                     | 默认值                                                | 描述                                                         |
| ---------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| key.deserializer                         |                                                       | 实现了`org.apache.kafka.common.serialization.Deserializer`接口的反序列化类，用于key的反序列化。 |
| value.deserializer                       |                                                       | 实现了`org.apache.kafka.common.serialization.Deserializer`接口的反序列化类，用于value的反序列化。 |
| bootstrap.servers                        | ""                                                    | 用于建立到Kafka集群的初始连接的主机/端口对列表。客户机将使用所有服务器，此列表只影响用于发现完整服务器集的初始主机。该列表应该以host1:port1,host2:port2，由于这些服务器仅用于初始连接，以发现完整的集群成员关系(可能会动态更改)，因此此列表不需要包含完整的服务器集，为了避免连接的服务器宕机，因此需要指定多个服务器。 |
| fetch.min.bytes                          | 1                                                     |                                                              |
| group.id                                 | null                                                  |                                                              |
| heartbeat.interval.ms                    | 3000                                                  |                                                              |
| max.partition.fetch.bytes                | 1048576（1M）                                         |                                                              |
| session.timeout.ms                       | 10000                                                 | 使用Kafka的组管理工具时用于检测客户端故障的超时时间，默认10000毫秒。客户端定期向broker发送心跳来表示其活动。如果在此会话超时过期之前broker没有收到心跳，则broker将从组中删除此客户端并启动重新平衡。注意，该值必须在broker配置中配置的`group.min.session.timeout.ms`和`group.max.session.timeout.ms`允许范围内。 |
| ssl.key.password                         | null                                                  |                                                              |
| ssl.keystore.location                    | null                                                  |                                                              |
| ssl.keystore.password                    | null                                                  |                                                              |
| ssl.truststore.location                  | null                                                  |                                                              |
| ssl.truststore.password                  | null                                                  |                                                              |
| allow.auto.create.topics                 | true                                                  |                                                              |
| auto.offset.reset                        | latest                                                |                                                              |
| client.dns.lookup                        | default                                               |                                                              |
| connections.max.idle.ms                  | 540000                                                |                                                              |
| default.api.timeout.ms                   | 60000                                                 |                                                              |
| enable.auto.commit                       | true                                                  |                                                              |
| exclude.internal.topics                  | true                                                  |                                                              |
| fetch.max.bytes                          | 52428800（50M）                                       |                                                              |
| group.instance.id                        | null                                                  |                                                              |
| isolation.level                          | read_uncommitted                                      | 可选值[read_committed,read_uncommitted]                      |
| max.poll.interval.ms                     | 300000                                                |                                                              |
| max.poll.records                         | 500                                                   |                                                              |
| partition.assignment.strategy            | class org.apache.kafka.clients.consumer.RangeAssignor |                                                              |
| receive.buffer.bytes                     | 65536                                                 |                                                              |
| request.timeout.ms                       | 30000                                                 |                                                              |
| sasl.client.callback.handler.class       | null                                                  |                                                              |
| sasl.jaas.config                         | null                                                  |                                                              |
| sasl.kerberos.service.name               | null                                                  |                                                              |
| sasl.login.callback.handler.class        | null                                                  |                                                              |
| sasl.login.class                         | null                                                  |                                                              |
| sasl.mechanism                           | GSSAPI                                                |                                                              |
| security.protocol                        | PLAINTEXT                                             |                                                              |
| send.buffer.bytes                        | 131072（128K）                                        |                                                              |
| ssl.enabled.protocols                    | TLSv1.2                                               |                                                              |
| ssl.keystore.type                        | JKS                                                   |                                                              |
| ssl.protocol                             | TLSv1.2                                               |                                                              |
| ssl.provider                             | null                                                  |                                                              |
| ssl.truststore.type                      | JKS                                                   |                                                              |
| auto.commit.interval.ms                  | 5000                                                  |                                                              |
| check.crcs                               | true                                                  |                                                              |
| client.id                                | ""                                                    |                                                              |
| client.rack                              | ""                                                    |                                                              |
| fetch.max.wait.ms                        | 500                                                   |                                                              |
| interceptor.classes                      | ""                                                    |                                                              |
| metadata.max.age.ms                      | 300000                                                |                                                              |
| metric.reporters                         | ""                                                    |                                                              |
| metrics.num.samples                      | 2                                                     |                                                              |
| metrics.recording.level                  | INFO                                                  |                                                              |
| metrics.sample.window.ms                 | 30000                                                 |                                                              |
| reconnect.backoff.max.ms                 | 1000                                                  |                                                              |
| reconnect.backoff.ms                     | 50                                                    |                                                              |
| retry.backoff.ms                         | 100                                                   |                                                              |
| sasl.kerberos.kinit.cmd                  | /usr/bin/kinit                                        |                                                              |
| sasl.kerberos.min.time.before.relogin    | 60000                                                 |                                                              |
| sasl.kerberos.ticket.renew.jitter        | 0.05                                                  |                                                              |
| sasl.kerberos.ticket.renew.window.factor | 0.8                                                   |                                                              |
| sasl.login.refresh.buffer.seconds        | 300                                                   |                                                              |
| sasl.login.refresh.min.period.seconds    | 60                                                    |                                                              |
| sasl.login.refresh.window.factor         | 0.8                                                   |                                                              |
| sasl.login.refresh.window.jitter         | 0.05                                                  |                                                              |
| security.providers                       | null                                                  |                                                              |
| ssl.cipher.suites                        | null                                                  |                                                              |
| ssl.endpoint.identification.algorithm    | https                                                 |                                                              |
| ssl.keymanager.algorithm                 | SunX509                                               |                                                              |
| ssl.secure.random.implementatiion        | null                                                  |                                                              |
| ssl.trustmanager.algorithm               | PKIX                                                  |                                                              |



## 10.5、[Kafka Connect Configs](https://kafka.apache.org/25/documentation.html#connectconfigs)

| 属性                  | 默认           | 描述 |
| --------------------- | -------------- | ---- |
| config.storage.topic  |                |      |
| group.id              |                |      |
| key.converter         |                |      |
| offset.storage.topic  |                |      |
| status.storage.topic  |                |      |
| value.converter       |                |      |
| bootstrap.servers     | localhost:9092 |      |
| heartbeat.interval.ms | 3000           |      |
|                       |                |      |



## 10.6、[Kafka Streams Configs](https://kafka.apache.org/25/documentation.html#streamsconfigs)

## 10.7、[AdminClient Configs](https://kafka.apache.org/25/documentation.html#adminclientconfigs)

| 属性                                          | 默认值                                                       | 描述                                                         |
| --------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| broker.id                                     |                                                              | 每个broker都可以用一个唯一的非负整数id进行标识；这个id可以作为broker的“名字”，并且它的存在使得broker无序混淆consumers就可以迁移到不用的host/port上。你可以选择任意你喜欢的数字作为id，只要id是唯一的即可。 |
| log.dirs                                      | /tmp/kafka-logs                                              | Kafka存放数据的路径。这个路径并不是唯一的，可以是多个，路径之间只需要使用逗号分隔即可；每当创建新partition时，都会选择在包含最少partitions的路径下进行。 |
| port                                          | 9092                                                         | server接受客户端连接的端口。                                 |
| zookeeper.connect                             | localhost:2181                                               | ZooKeeper连接字符串的格式为：hostname:port，此处hostname和port分别是ZooKeeper集群中某个节点的host和port；为了当某个host当掉之后你能通过其他ZooKeeper节点进行连接，你可以按照以下方式制定多个hosts：<br />`hostname1:port1,hostname2:port2,hostname2:port3`<br />ZooKeeper允许你增加一个“chroot”路径，将集群中所有Kafka数据存放在特定的路径下。当多个Kafka集群或者其他应用使用相同ZooKeeper集群时，可以使用这个方式设置数据存放路径。这种方式的实现可以通过这样设置连接字符串格式，如下所示：<br />`hostname1:port1,hostname2:port2,hostname3:port3/chroot/path` 这样设置就将所有Kafka集群数据存放在`/chroot/path`路径下。注意，在你启动broker之前，你必须创建这个路径，并且consumers必须使用相同的连接格式。 |
| message.max.bytes                             | 1000000                                                      | server可以接收的消息最大尺寸。重要的是，consumer和producer有关这个属性的设置必须同步，否则producer发布的消息对consumer来说太大。 |
| num.network.threads                           | 3                                                            | server用来处理网络请求的网络线程数目；一般你不需要更改这个属性。 |
| num.io.threads                                | 8                                                            | server用来处理请求的I/O线程的数目；这个线程数目至少要等于硬盘的个数。 |
| background.threads                            | 4                                                            | 用于后台处理的线程数目，例如文件删除；你不需要更改这个属性。 |
| queued.max.requests                           | 500                                                          | 在网络线程停止读取新请求之前，可以排队等待I/O线程处理的最大请求个数。 |
| host.name                                     | null                                                         | broker的hostname；如果hostname已经设置的话，borker将只会绑定到这个地址上；如果没有设置，它将绑定到所有接口，并发布一份到ZooKeeper。 |
| advertised.host.name                          | null                                                         | 如果设置，则就作为broker的hostname发往producer、consumer以及其他brokers |
| advertised.port                               | null                                                         | 此端口将给与producers、consumers以及其他brokers，它会在建立连接时用到；它仅在实际端口和server需要绑定的端口不一样时才需要设置。 |
| socket.send.buffer.bytes                      | 100*1024（100KB）                                            | SO_SNDBUFF缓存大小，server进行socket连接时所用。             |
| socket.receive.buffer.bytes                   | 100*1024（100KB）                                            | SO_RCVBUFF缓存大小啊，server进行socket连接时所用。           |
| socket.request.max.bytes                      | 100\*1024\*1024（100M）                                      | server允许的最大请求尺寸；这将避免server溢出，它应该小于java heap size。 |
| num.partitions                                | 1                                                            | 如果创建topic时没有给出划分partitions个数，这个数字将是topic下partitions数目的默认数值。 |
| log.segment.bytes                             | 1024\*1024\*1024（1GB）                                      | topic partition的日志存放在某个目录下诸多文件中，这些文件将partition的日志切分成一段一段的；这个属性就是每个文件的最大尺寸；当尺寸达到这个数值时，就会创建新文件。此设置可以由每个topic基础设置时进行覆盖。【可覆盖】 |
| log.roll.hours                                | 24*7（7天）                                                  | 即使文件没有达到`log.segment.bytes`，只要文件创建时间到达此属性，就会创建新文件。这个设置也可以有topic层面的设置进行覆盖。【可覆盖】 |
| log.cleanup.policy                            | delete                                                       |                                                              |
| log.retention.hours                           | 24*7（7天）                                                  | 每个日志文件删除之前保存的时间。默认数据保存时间对所有topic都一样。log.retention.minutes和log.retention.bytes都是用来设置删除日志文件的，无论哪个属性已经溢出。这个属性设置可以在topic基本设置时进行覆盖。【可覆盖】 |
| log.retention.ms                              | null                                                         | 仅单位不同，作用同上。                                       |
| log.retention.minutes                         | null                                                         | 仅单位不同，作用同上。                                       |
| log.retention.bytes                           | -1                                                           | 注意，这是每个partitions的上限，因此这个数值乘以partitions的个数就是每个topic保存的数据总量。同时注意：如果`log.retention.hours`和`log.retention.bytes`都设置了，则超过了任何一个限制都会造成删除一个段文件。注意，这项设置可以由每个topic设置时进行覆盖。【可覆盖】 |
| log.retention.check.interval.ms               | 300000（5分钟）                                              | 检查日志分段文件的间隔时间，以确定是否文件属性是否到达删除要求。 |
| log.cleaner.enable                            | false                                                        | 当这个属性设置为false时，一旦日志的保存时间或者大小达到上限时，就会进行`log compaction`。 |
| log.cleaner.threads                           | 1                                                            | 进行日志压缩的线程数。                                       |
| log.cleaner.io.max.bytes.per.second           | None                                                         | 进行`log compaction`时，log cleaner可以拥有的最大I/O数目。这项设置限制了cleaner，以避免干扰活动的请求服务。 |
| log.cleaner.io.buffer.size                    | 512\*1024（512K）                                            | log cleaner清除过程中针对日志进行索引化以及精简化所用到的缓存大小。最好设置大点，以提供充足的内存。 |
| log.cleaner.io.buffer.load.factor             | 0.9                                                          | log cleaning中所使用的hash表的负载因子；你不需要更改这个选项。 |
| log.cleaner.backoff.ms                        | 15000                                                        | 进行日志是否清理检查的时间间隔                               |
| log.cleaner.min.cleanable.ratio               | 0.5                                                          | 这项配置控制log compactor试图清理日志的频率（假定log compaction是打开的）。默认避免清理压缩超过50%的日志。这个比率绑定了备份日志所消耗的最大空间（50%的日志备份时压缩率为50%）。更高的比率则意味着浪费消耗更少，也就可以更有效的清理更多的空间。这项设置在每个topic设置中可以覆盖。【可覆盖】 |
| log.cleaner.delete.retention.ms               | 86400000（1day）                                             | 保存时间；保存压缩日志的最长时间；也是客户端消费消息的最长时间，与`log.retention.minutes`的区别在于一个控制未压缩数据，一个控制压缩后的数据；会被topic创建时的指定时间覆盖。【可覆盖】 |
| log.index.size.max.bytes                      | 10\*1024\*1024（个数）                                       | 每个log segment中offset的最大索引值。注意，如果log的offset达到这个数值，即时尺寸没有超过`log.segment.bytes`限制，也需要产生新的log segment。 |
| log.index.interval.bytes                      | 4096（4KB）                                                  | 当执行一次fetch后，需要一定的空间扫描最近的offset，设置的越大越好，一般使用默认值就可以。 |
| log.flush.interval.messages                   | Long.MaxValue                                                | log文件`fsync`到磁盘之前积累的消息条数。因为磁盘IO操作是一个慢操作，但又是一个“数据可靠性”的必要手段，所以触发同步之前积累的消息条数，需要在“数据可靠性”与“性能”之间做必要的权衡，如果此值过大，将会导致每次`fsync`的时间过长（IO阻塞），如果此值过小，将会导致`fsync`的次数较多，这也就意味着整体的client请求有一定的延迟，物理server故障，将会导致没有`fsync`的消息丢失。 |
| log.flush.scheduler.interval.ms               | Long.MaxValue                                                | 检查是否需要`fsync`的时间间隔。                              |
| log.flush.interval.ms                         | Long.MaxValue（如果未设置默认使用`log.flush.scheduler.interval.ms`的值） | 仅仅通过interval来控制消息的磁盘写入时机，是不足的，这个数用来控制`fsync`的时间间隔，如果消息量始终没有达到固化到磁盘的消息数，但是离上次磁盘同步的时间间隔达到阈值，也将触发磁盘同步。 |
| log.delete.delay.ms                           | 60000                                                        | 文件在索引中清除后的保留时间，一般不需要修改。               |
| auto.create.topics.enable                     | true                                                         | 是否允许自动创建topic。如果是真的，则produce或者fetch不存在的topic时，会自动创建这个topic。否则需要使用命令行创建topic。 |
| controller.socket.timeout.ms                  | 30000                                                        | partition管理控制器进行备份时，socket的超时时间。            |
| controller.message.queue.size                 | Inte.MaxValue                                                | `controller-to-broker-channels` 的buffer尺寸                 |
| default.replication.factor                    | 1                                                            | 默认备份份数，仅指自动创建的topics。                         |
| replica.lag.time.max.ms                       | 10000                                                        | 如果一个follower在这个时间内没有发送fetch请求，leader将从ISR中移除这个follower，并认为这个follower已经挂了。 |
| replica.lag.max.messages                      | 4000                                                         | 如果一个replica没有备份的条数超过这个数值，则leader将移除这个follower，并认为这个follower已经挂了。 |
| replica.socket.timeout.ms                     | 30*1000                                                      | leader备份数据时的socket网络请求的超时时间                   |
| replica.socket.receive.buffer.bytes           | 64*1024                                                      | 备份时向leader发送网络请求时的socket receive buffer          |
| replica.fetch.max.bytes                       | 1024*1024（1MB）                                             | 备份时每次fetch的最大值                                      |
| replica.fetch.min.bytes                       | 1                                                            | 备份时每次fetch的最小值                                      |
| replica.fetch.wait.max.ms                     | 500（毫秒）                                                  | leader发出备份请求时，数据到达leader的最长等待时间           |
| num.replica.fetchers                          | 1                                                            | 从leader备份数据的线程数                                     |
| replica.high.watermark.checkpoint.interval.ms | 5000                                                         | 每个replica检查是否将最高水位进行固化的频率                  |
| fetch.purgatory.purge.interval.requests       | 1000（请求数）                                               | fetch请求清除时的清除间隔                                    |
| producer.purgatory.purge.interval.requests    | 1000（请求数）                                               | producer请求清除时的清除间隔                                 |
| zookeeper.session.timeout.ms                  | 6000                                                         | ZooKeeper 会话超时时间                                       |
| zookeeper.connection.timeout.ms               | 6000                                                         | 客户端等待和zookeeper建立连接的最大时间                      |
| zookeeper.sync.time.ms                        | 2000                                                         | ZooKeeper follower落后于ZooKeeper Leader的最长时间           |
| controlled.shutdown.enable                    | true                                                         | 是否能够控制broker的关闭。如果能够，broker将可以移动所有leaders到其他的broker上，在关闭之前。这减少了不可用性在关机过程中。 |
| controlled.shutdown.max.retries               | 3                                                            | 在执行不彻底的关机之前，可以成功执行关机的命令数。           |
| controlled.shutdown.retry.backoff.ms          | 5000                                                         | 在关机之间的backoff时间                                      |
| auto.leader.rebalance.enable                  | true                                                         | 如果是true，控制者将会自动平衡brokers对于partitions的leadership。 |
| leader.imbalance.per.broker.percentage        | 10                                                           | 每个broker所允许的leader最大不平衡比率                       |
| leader.imbalance.check.interval.seconds       | 300                                                          | 检查leader不平衡的频率                                       |
| offset.metadata.max.bytes                     | 4096                                                         | 允许客户端保存他们offsets的最大个数                          |
| max.connections.per.ip                        | Int.MaxValue                                                 | 每个ip地址上每个broker可以被连接的最大数目                   |
| max.connections.per.ip.overrides              | ""                                                           | 每个ip或者hostname默认的连接的最大覆盖，多个之间英文逗号分隔，比如：`hostname:100,127.0.0.1:200` |
| connections.max.idle.ms                       | 600000                                                       | 空连接的超时限制                                             |
| log.roll.jitter.hours                         | 0                                                            | 从logRollTimeMillis抽离的jitter最大数目                      |
| log.roll.jitter.ms                            | null                                                         | 同上，如果未设置会采用`log.roll.jitter.hours`                |
| num.recovery.threads.per.data.dir             | 1                                                            | 每个数据目录用来日志恢复的线程数目                           |
| delete.topic.enable                           | true                                                         | 启用删除主题。如果关闭此配置，通过管理工具删除主题将无效     |
| offsets.topic.num.partitions                  | 50                                                           | 存储主题消费偏移量的主题(`__consumer_offsets`)的分区数（部署后不应更改） |
| offsets.topic.retention.minutes               | 1440（1天）                                                  | 存在时间超过这个时间限制的offsets都将被标记为待删除。        |
| offsets.retention.check.interval.ms           | 600000                                                       | offset管理器检查陈旧offsets的频率                            |
| offsets.topic.replication.factor              | 3                                                            | topic的offset的备份份数。建议设置更高的数字保证更高的可用性。 |
| offsets.topic.segment.bytes                   | 104857600（100GB）                                           | 偏移主题段字节应保持相对较小，以便于更快的日志压缩和缓存加载 |
| offsets.load.buffer.size                      | 5242880（5MB）                                               | 用于在读取offset信息到内存cache时，用于读取缓冲区的大小      |
| offsets.commit.required.acks                  | -1                                                           | 可以接受提交之前所需的确认。通常，不应重写默认值（-1）       |
|                                               |                                                              |                                                              |



## 10.8、Topic级别的配置

| 属性                                    | 默认值             | 服务器默认属性                          | 描述                                                         |
| --------------------------------------- | ------------------ | --------------------------------------- | ------------------------------------------------------------ |
| cleanup.policy                          | delete             | log.cleanup.policy                      | 要么是`delete`要么是`compact`；这个字符串指明了针对旧日志部分的利用方式；默认方式（`delete`）将会丢失旧的部分当他们的回收时间或者尺寸限制到达时。`compact`将会进行日志压缩。 |
| compression.type                        | producer           | compression.type                        |                                                              |
| delete.retention.ms                     | 86400000（24小时） | log.cleaner.delete.retention.ms         | 对于压缩日志保留的最长时间，也是客户端消费消息的最长时间，与`log.retention.minutes`（未压缩数据）的区别在于一个控制未压缩数据，一个控制压缩后的数据。此选项可以在topic创建覆盖。【可覆盖】 |
| file.delete.delay.ms                    | 60000              | log.segment.delete.delay.ms             |                                                              |
| flush.messages                          | Long.MaxValue      | log.flush.interval.messages             | 此项配置指定时间间隔：强制进行`fsync`日志。例如，如果这个选项设置为1，那么每条消息之后都需要进行`fsync`，如果设置为5，则每5条消息就需要进行一次`fsync`。一般来说，建议你不要设置这个值。此参数的设置，需要在“数据可靠性”与“性能”之间做好必要的权衡。如果此值过大，会导致每次`fsync`的时间较长（IO阻塞），如果此值过小，将会导致`fsync`的次数较多，这也意味着整体的client请求有一定的延迟。物理server故障，将会导致没有`fsync`的消息丢失。 |
| flush.ms                                | Long.MaxValue      | log.flush.interval.ms                   | 此选项配置用来设置强制进行`fsync`日志到磁盘的时间间隔；例如，如果设置1000，那么每1000ms就需要进行一次`fsync`。一般不建议使用这个选项。 |
| follower.replication.throttled.replicas | ""                 | follower.replication.throttled.replicas |                                                              |
| index.interval.bytes                    | 4096               | log.index.interval.bytes                | 默认设置保证了我们每4096个字节就对消息添加一个索引，更多的索引使得阅读的消息更加靠近，但索引规模却会由此增大；一般不需要改变这个选项。 |
| leader.replication.throttled.replicas   | ""                 | leader.replication.throttled.replicas   |                                                              |
| max.compaction.lag.ms                   | Long.MaxValue      | log.cleaner.max.compaction.lag.ms       |                                                              |
| max.message.bytes                       | 1000000            | message.max.bytes                       | Kafka追加消息的最大尺寸。注意如果你增大这个尺寸，你也必须增大你consumer的fetch尺寸，这样consumer才能fetch到这些最大尺寸的消息。 |
| message.format.version                  | 2.5-IV0            | log.message.format.version              |                                                              |
| message.timestamp.difference.max.ms     | Long.MaxValue      | log.message.timestamp.difference.max.ms |                                                              |
| message.timestamp.type                  | CreateTime         | log.message.timestamp.type              |                                                              |
| min.cleanable.dirty.ratio               | 0.5                | log.clean.min.cleanable.ratio           | 此项配置控制log压缩器试图进行清除日志的频率。默认情况下，将避免清除压缩率超过50%的日志。这个比率避免了最大的空间的浪费。 |
| min.compaction.lag.ms                   | 0                  | log.cleaner.min.compaction.lag.ms       |                                                              |
| preallocate                             | false              | log.preallocate                         |                                                              |
| retention.bytes                         | -1                 | log.retention.bytes                     | 如果使用`delete`的策略，这项配置就是指删除日志前日志所能达到的最大尺寸。默认情况下，没有尺寸限制而只有时间限制。 |
| retention.ms                            | 604800000（7天）   | log.retention.ms                        | 如果使用`delete`的策略，这项配置就是指删除日志前日志保存的时间。 |
| segment.bytes                           | 1073741824（1GB）  | log.segment.bytes                       | Kafka中log日志是分成一块块存储的，此配置是指log日志划分成块的大小。 |
| segment.index.bytes                     | 10485760(10MB)     | log.index.size.max.bytes                | 决定了index文件大小达到多大之后进行切分，默认大小是10M。通常不需要更改此设置。 |
| segment.jitter.ms                       | 0                  | log.roll.jitter.ms                      | 从计划的分段滚动时间中减去最大随机抖动，以避免分段滚动的集中爆发 |
| segment.ms                              | 604800000（7天）   | log.roll.ms                             | 即时log的分块文件没有达到需要删除、压缩的大小，一旦log的时间达到这个上限，就会强制新建一个log分块文件 |
| message.downconversion.enable           | true               | log.message.downconversion.enable       |                                                              |
|                                         |                    |                                         |                                                              |



## 10.9、Producer配置补充

| 属性                  | 默认值 | 描述                                                         |
| --------------------- | ------ | ------------------------------------------------------------ |
| metadata.broker.list  |        | 服务于bootstrapping。producer仅用来获取metadata（topics，partitions，replicas）。发送实际数据的socket连接将基于返回的metadata数据信息而建立。格式是：<br />`host1:port1,host2:port2`<br />这个列表可以是brokers的子列表或者是一个指向brokers的VIP。 |
| request.required.acks | 0      | 此配置是表明当一次produce请求被认为完成时的确认值。特别是，多少个其他brokers必须已经提交了数据到他们的log并且向他们的leader确认了这些信息。典型的值包括：<br />0：表示producer从来不等待来自broker的确认信息。这个选择提供了最小的时延但同时风险最大（因为server宕机时，数据将会丢失）。<br />1：表示获得leader replica已经接收了数据的确认信息。这个选择时延较小同时确保了server确认接收成功。<br />-1：producer会获得所有同步replicas都收到数据的确认。同时时延最大，然而，这种方式并没有完全消除丢失消息的风险，因为同步replicas的数量可能是1。如果你想确保某些replicas接收到数据，那么你应该在topic-level设置中选项min.insync.replicas设置一下。 |
| request.timeout.ms    | 10000  | broker尽力实现request.required.acks需求时的等待时间，否则会发送错误到客户端。 |
|                       |        |                                                              |

