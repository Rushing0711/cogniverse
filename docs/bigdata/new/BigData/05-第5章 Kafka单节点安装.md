# 第5章 Kafka单节点安装

## 5.1、安装kafka（外部ZK）

### 5.1.1、依赖环境

- 依赖JDK
- 依赖Zookeeper

### 5.1.2、Kafka单节点

1. 下载

官网地址：http://kafka.apache.org/

下载地址：http://kafka.apache.org/downloads

```bash
$ wget -cP /usr/local/src/ https://archive.apache.org/dist/kafka/2.8.2/kafka_2.12-2.8.2.tgz
```

2. 创建安装目录

```bash
$ mkdir /usr/local/Kafka
```

3. 解压安装

```bash
$ tar -zxvf /usr/local/src/kafka_2.12-2.8.2.tgz -C /usr/local/Kafka/
```

4. 创建软连接

```bash
$ ln -snf /usr/local/Kafka/kafka_2.12-2.8.2/ /usr/local/kafka
```

5. 配置环境变量

在`/etc/profile.d`目录创建`kafka.sh`文件：

```bash
$ sudo vim /etc/profile.d/kafka.sh
```

```bash
export KAFKA_HOME=/usr/local/kafka
export PATH=$KAFKA_HOME/bin:$PATH
```

使之生效：

```bash
$ source /etc/profile
```

6. 目录规划

```bash
# 非必须，配置日志目录后，会自动创建
$ mkdir -p /usr/local/kafka/logs
```

7. 配置文件

- 编辑`server.properties`配置文件

```bash
$ vim /usr/local/kafka/config/server.properties 
```

```bash
# [修改]
listeners=PLAINTEXT://emon:9092
# [修改]
advertised.listeners=PLAINTEXT://emon:9092
# [修改]
log.dirs=/tmp/kafka-logs => log.dirs=/usr/local/kafka/logs
# [修改]
zookeeper.connect=localhost:2181=>zookeeper.connect=emon:2181
```

>备注：外网访问kafka服务时，有两种开放ip的方式：
>
>其一：【推荐】
>
>```bash
># [修改]
>advertised.listeners=PLAINTEXT://192.168.200.116:9092
>```
>
>其二：
>
>```bash
># [新增]比如在listeners=PLAINTEXT://:9092下面一行添加
>advertised.host.name=192.168.200.116
>```
>
>advertised.host.name很重要，如果不设置时，外网访问kafka会按照hostname去解析，设置zookeeper和kafka不在同一台机器也会出现注册问题。
>
>通过zookeeper上命令行查看 `get /brokers/ids/0` 可以看到zookeeper上面kafka的地址。
>
>设置了该值，在其他机器访问kafka时，才能指定ip地址访问。

8. 编写启动停止脚本

- 启动脚本

```bash
$ vim /usr/local/kafka/kafkaStart.sh
```

```bash
# 启动kafka
/usr/local/kafka/bin/kafka-server-start.sh -daemon /usr/local/kafka/config/server.properties
```

- 停止脚本

```bash
$ vim /usr/local/kafka/kafkaStop.sh
```

```bash
# 关闭kafka
/usr/local/kafka/bin/kafka-server-stop.sh
```

- 修改可执行权限

```bash
$ chmod u+x /usr/local/kafka/kafkaStart.sh 
$ chmod u+x /usr/local/kafka/kafkaStop.sh 
```

9. 启动与停止

- 启动

```bash
$ /usr/local/kafka/kafkaStart.sh
```

- 验证

```bash
$ jps
66411 Kafka
```

- 停止

```bash
$ /usr/local/kafka/kafkaStop.sh
```

10. 创建`topic`

- 创建

```bash
$ kafka-topics.sh --bootstrap-server emon:9092  --create --partitions 2 --replication-factor 1 --topic test
# 命令执行结果
Created topic test.
```

- 查看topic列表

```bash
$ kafka-topics.sh --bootstrap-server emon:9092 --list
# 命令执行结果
test
```

- 查看单个topic详情

```bash
$ kafka-topics.sh --bootstrap-server emon:9092 --describe --topic test
# 命令执行结果
Topic: test	PartitionCount: 2	ReplicationFactor: 1	Configs: segment.bytes=1073741824
	Topic: test	Partition: 0	Leader: 0	Replicas: 0	Isr: 0
	Topic: test	Partition: 1	Leader: 0	Replicas: 0	Isr: 0
```

11. 测试生产者消费者

- 生产者

```bash
# 打开生产者命令行模式
$ kafka-console-producer.sh --bootstrap-server emon:9092 --topic test
```

- 消费者

```bash
# 打开消费者命令模式
$ kafka-console-consumer.sh --bootstrap-server emon:9092 --topic test --from-beginning
```

- 查看topic的偏移量

```bash
$ kafka-run-class.sh kafka.tools.GetOffsetShell --broker-list emon:9092 --topic test
# 命令执行结果
test:0:0
test:1:0
```

