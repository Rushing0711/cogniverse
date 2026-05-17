# 第6章 Kafka集群安装

### 6.1、Kafka集群

#### 6.1.1、前置安装

1. 配置SSH免密登录

每一台服务器都需要配置免密登录。

[配置SSH免密登录](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/BigData/BigDataInAction.md#532前置安装)

2. JDK安装

每一台服务器都需要安装JDK。

[安装JDK](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/Linux/LinuxInAction.md#1安装jdk)

3. Zookeeper安装

#### 6.1.2、安装节点1

1. 下载

官网地址：http://kafka.apache.org/

下载地址：http://kafka.apache.org/downloads

```bash
$ wget -cP /usr/local/src/ https://archive.apache.org/dist/kafka/2.5.1/kafka_2.12-2.5.1.tgz
```

2. 创建安装目录

```bash
$ mkdir /usr/local/Kafka
```

3. 解压安装

```bash
$ tar -zxvf /usr/local/src/kafka_2.12-2.5.1.tgz -C /usr/local/Kafka/
```

4. 创建软连接

```bash
$ ln -snf /usr/local/Kafka/kafka_2.12-2.5.1/ /usr/local/kafka
```

5. 配置环境变量

在`/etc/profile.d`目录创建`kafka.sh`文件：

```bash
$ sudo vim /etc/profile.d/kafka.sh
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
# [不变]
broker.id=0
# [修改]
log.dirs=/tmp/kafka-logs => log.dirs=/usr/local/kafka/logs
# [修改]如果zookeeper是集群，建议配置全部集群节点，比如： emon:2181,emon2:2181,emon3:2181
zookeeper.connect=localhost:2181=>zookeeper.connect=emon:2181
```

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

#### 6.1.3、安装其他节点

1. 复制到其他节点

```bash
# 拷贝到emon2
$ scp -rq /usr/local/Kafka/ emon@emon2:/usr/local/
# 拷贝到emon3
$ scp -rq /usr/local/Kafka/ emon@emon3:/usr/local/
```

2. 生成`broker.id`

```bash
# 在emon2
$ ln -snf /usr/local/Kafka/kafka_2.12-2.5.1/ /usr/local/kafka
# 查看替换效果
[emon@emon2 ~]$ sed -n 's/broker.id=0/broker.id=1/p' /usr/local/kafka/config/server.properties 
# 替换
[emon@emon2 ~]$ sed -i 's/broker.id=0/broker.id=1/' /usr/local/kafka/config/server.properties 

# 在emon3
$ ln -snf /usr/local/Kafka/kafka_2.12-2.5.1/ /usr/local/kafka
# 查看替换效果
[emon@emon2 ~]$ sed -n 's/broker.id=0/broker.id=2/p' /usr/local/kafka/config/server.properties 
# 替换
[emon@emon2 ~]$ sed -i 's/broker.id=0/broker.id=2/' /usr/local/kafka/config/server.properties 
```

#### 6.1.4、启动与停止

- 启动

```bash
$ /usr/local/kafka/kafkaStart.sh 
[emon@emon2 ~]$ /usr/local/kafka/kafkaStart.sh 
[emon@emon3 ~]$ /usr/local/kafka/kafkaStart.sh 
```

- 校验

```bash
$ jps
66411 Kafka
```

- 停止

```bash
$ /usr/local/kafka/kafkaStop.sh
[emon@emon2 ~]$ /usr/local/kafka/kafkaStop.sh
[emon@emon3 ~]$ /usr/local/kafka/kafkaStop.sh
```



