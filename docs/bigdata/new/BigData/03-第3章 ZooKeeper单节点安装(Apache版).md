# 第3章 ZooKeeper单节点安装（Apache版）

### 3.1、单节点（Apache版）

1. 下载

官网地址： https://zookeeper.apache.org/index.html

下载地址：https://archive.apache.org/dist/zookeeper/

下载地址： https://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper/

```bash
$ wget -cP /usr/local/src/ https://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper/zookeeper-3.6.4/apache-zookeeper-3.6.4-bin.tar.gz --no-check-certificate
```

2. 创建安装目录

```bash
$ mkdir /usr/local/ZooKeeper
```

3. 解压安装

```bash
$ tar -zxvf /usr/local/src/apache-zookeeper-3.6.4-bin.tar.gz -C /usr/local/ZooKeeper/
```

4. 创建软连接

```bash
$ ln -snf /usr/local/ZooKeeper/apache-zookeeper-3.6.4-bin/ /usr/local/zoo
```

5. 配置环境变量

在`/etc/profile.d`目录创建`zoo.sh`文件：

```bash
$ sudo vim /etc/profile.d/zoo.sh
```

```bash
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
```

7. 启动与停止

- 启动（端口号2181）

```bash
$ zkServer.sh start
```

- 校验

```bash
$ jps
44611 QuorumPeerMain
```

- 停止

```bash
$ zkServer.sh stop
```

- 状态

```bash
$ zkServer.sh status
```

8. 连接

- 远程链接

```bash
$ zkCli.sh -server emon:2181
```

- 本地连接

```bash
$ zkCli.sh
```

- 退出（连接成功后，使用命令quit退出）

```bash
[zk: localhost:2181(CONNECTED) 0] quit
```


