# 第4章 ZooKeeper集群安装（Apache版）

### 4.1、集群（Apache版）

- Zookeeper角色
  - leader：领导者
    - 集群中只有一个leader
    - 参与leader选举，有投票权
  - follower：跟随者
    - 参与leader选举，有投票权
  - observer：观察者
    - 不参与leader选举，没有投票权

#### 4.1.1、集群规划

| 机器名 | IP1-家庭      | IP2-公司   | 部署内容 |
| ------ | ------------- | ---------- | -------- |
| emon   | 192.168.1.116 | 10.0.0.116 |          |
| emon2  | 192.168.1.117 | 10.0.0.117 |          |
| emon3  | 192.168.1.118 | 10.0.0.118 |          |

#### 4.1.2、前置安装

1. 配置SSH免密登录

每一台服务器都需要配置免密登录。

[配置SSH免密登录](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/BigData/BigDataInAction.md#532前置安装)

2. JDK安装

每一台服务器都需要安装JDK。

[安装JDK](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/Linux/LinuxInAction.md#1安装jdk)

#### 4.1.3、安装节点1

1. 下载

官网地址： https://zookeeper.apache.org/index.html

下载地址： https://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper/

```bash
$ wget -cP /usr/local/src/ https://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper/zookeeper-3.5.9/apache-zookeeper-3.5.9-bin.tar.gz --no-check-certificate
```

2. 创建安装目录

```bash
$ mkdir /usr/local/ZooKeeper
```

3. 解压安装

```bash
$ tar -zxvf /usr/local/src/apache-zookeeper-3.5.9-bin.tar.gz -C /usr/local/ZooKeeper/
```

4. 创建软连接

```bash
$ ln -snf /usr/local/ZooKeeper/apache-zookeeper-3.5.9-bin/ /usr/local/zoo
```

5. 配置环境变量

在`/etc/profile.d`目录创建`zoo.sh`文件：

```bash
$ sudo vim /etc/profile.d/zoo.sh
export ZK_HOME=/usr/local/zoo
export PATH=$ZK_HOME/bin:$PATH
```

使之生效：

```bash
$ source /etc/profile
```

6. 配置文件

- 复制`zoo_sample.cfg`到`zoo.cfg`

```bash
$ cp /usr/local/zoo/conf/zoo_sample.cfg /usr/local/zoo/conf/zoo.cfg
```

- 编辑`zoo.cfg`文件

```bash
$ vim /usr/local/zoo/conf/zoo.cfg
```

```bash
# [修改]
dataDir=/tmp/zookeeper => dataDir=/usr/local/zoo/data
# [新增]
server.1=emon:2888:3888
server.2=emon2:2888:3888
server.3=emon3:2888:3888
```

7. 配置`myid`

配置ASCII编码格式的服务编号，服务启动时，会通过数据目录`dataDir`下的`myid`文件识别出服务编号。

```bash
# 注意，这里主机名对应的myid编号，是要和zoo.cfg中配置的server.x对应上，否则集群启动报错！
$ mkdir /usr/local/zoo/data
$ echo 1 > /usr/local/zoo/data/myid
```

#### 4.1.4、安装其他节点

1. 复制到其他节点

```bash
# 拷贝到emon2
$ scp -rq /usr/local/ZooKeeper/ emon@emon2:/usr/local
# 拷贝到emon3
$ scp -rq /usr/local/ZooKeeper/ emon@emon3:/usr/local
```

2. 生成myid

```bash
# 在emon2
$ ln -snf /usr/local/ZooKeeper/apache-zookeeper-3.5.9-bin/ /usr/local/zoo
$ echo 2 > /usr/local/zoo/data/myid
# 在emon3
$ ln -snf /usr/local/ZooKeeper/apache-zookeeper-3.5.9-bin/ /usr/local/zoo
$ echo 3 > /usr/local/zoo/data/myid
```

#### 4.1.5、启动与停止

- 启动（端口号2181）

```bash
$ /usr/local/zoo/bin/zkServer.sh start
[emon@emon2 ~]$ /usr/local/zoo/bin/zkServer.sh start
[emon@emon3 ~]$ /usr/local/zoo/bin/zkServer.sh start
```

- 校验

```bash
$ jps
44611 QuorumPeerMain
```

- 停止

```bash
$ /usr/local/zoo/bin/zkServer.sh stop
[emon@emon2 ~]$ /usr/local/zoo/bin/zkServer.sh stop
[emon@emon3 ~]$ /usr/local/zoo/bin/zkServer.sh stop
```

- 状态

```bash
# 可以查询到节点类型：follower、leader
$ /usr/local/zoo/bin/zkServer.sh status
[emon@emon2 ~]$ /usr/local/zoo/bin/zkServer.sh status
[emon@emon3 ~]$ /usr/local/zoo/bin/zkServer.sh status
```

