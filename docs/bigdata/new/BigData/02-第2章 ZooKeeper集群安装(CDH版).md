# 第2章 ZooKeeper集群安装（CDH版）

### 2.1、ZooKeeper集群（CDH版）

- Zookeeper角色
  - leader：领导者
    - 集群中只有一个leader
    - 参与leader选举，有投票权
  - follower：跟随者
    - 参与leader选举，有投票权
  - observer：观察者
    - 不参与leader选举，没有投票权

#### 2.1.1、集群规划

| 机器名 | IP1-家庭      | IP2-公司   | 部署内容 |
| ------ | ------------- | ---------- | -------- |
| emon   | 192.168.1.116 | 10.0.0.116 |          |
| emon2  | 192.168.1.117 | 10.0.0.117 |          |
| emon3  | 192.168.1.118 | 10.0.0.118 |          |

#### 2.1.2、前置安装

1. 配置SSH免密登录

<font color="red">每一台服务器都需要配置免密登录。</font>

[配置SSH免密登录](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/BigData/BigDataInAction.md#532%E5%89%8D%E7%BD%AE%E5%AE%89%E8%A3%85)

2. JDK安装

<font color="red">每一台服务器都需要安装JDK。</font>

[安装JDK](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/Linux/LinuxInAction.md#1安装jdk)

3. 安装Zookeeper

<font color="red">每一台服务器都需要安装Zookeeper。</font>

[安装ZooKeeper](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/BigData/BigDataInAction.md#1%E5%AE%89%E8%A3%85zookeepercdh%E7%89%88)

#### 2.1.3、配置

<font color="red">每一台服务器都需要配置，且配置内容一样。</font>

<font color="red">仅emon这个主服务器执行如下命令。</font>

- 复制`zoo_sample.cfg`到`zoo.cfg`

```
$ cp /usr/local/zoo/conf/zoo_sample.cfg /usr/local/zoo/conf/zoo.cfg
```

- 配置`zoo.cfg`文件

```bash
$ vim /usr/local/zoo/conf/zoo.cfg 
# [修改]
dataDir=/tmp/zookeeper => dataDir=/usr/local/zoo/data
# [新增]
dataLogDir=/usr/local/zoo/logs
# [新增]修改默认的8080端口，该选项在3.5.5之后才需要配置
admin.serverPort=8090
# [新增]
server.1=emon:2888:3888
server.2=emon2:2888:3888
server.3=emon3:2888:3888
```

- 配置`myid`

配置ASCII编码格式的服务编号，服务启动时，会通过数据目录`dataDir`下的`myid`文件识别出服务编号。

```bash
# 注意，这里主机名对应的myid编号，是要和zoo.cfg中配置的server.x对应上，否则集群启动报错！
$ echo 1 > /usr/local/zoo/data/myid
[emon@emon2 ~]$ echo 2 > /usr/local/zoo/data/myid
[emon@emon3 ~]$ echo 3 > /usr/local/zoo/data/myid
```

#### 2.1.4、启动与停止

- 启动（端口号2181）

```bash
$ zkServer.sh start
[emon@emon2 ~]$ zkServer.sh start
[emon@emon3 ~]$ zkServer.sh start
```

- 校验

```bash
$ jps
44611 QuorumPeerMain
```

- 停止

```bash
$ zkServer.sh stop
[emon@emon2 ~]$ zkServer.sh stop
[emon@emon3 ~]$ zkServer.sh stop
```

- 状态

```bash
$ zkServer.sh status
[emon@emon2 ~]$ zkServer.sh status
[emon@emon3 ~]$ zkServer.sh status
```

