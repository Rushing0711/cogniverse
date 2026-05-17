# 第1章 ZooKeeper单节点安装（CDH版）

## 1.1、安装ZooKeeper

### 1.0、依赖环境

- 依赖JDK

### 1.1、ZooKeeper单节点（CDH版）

1. 下载

官网地址： https://zookeeper.apache.org/index.html

下载地址： https://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper/

版本3.5.5带来的坑：https://blog.csdn.net/jiangxiulilinux/article/details/96433560

> wget -cP /usr/local/src/ https://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper/zookeeper-3.7.0/apache-zookeeper-3.7.0-bin.tar.gz --no-check-certificate

这里以cdh版学习：

**注意**：无法避开收费墙下载，暂时无解

2. 创建安装目录

```bash
$ mkdir /usr/local/ZooKeeper
```

3. 解压安装

```bash
$ tar -zxvf /usr/local/src/zookeeper-3.4.5-cdh5.16.2.tar.gz -C /usr/local/ZooKeeper/
```

**说明**：如果发生错误：

> gzip: stdin: decompression OK, trailing garbage ignored
>
> tar: Child returned status 2
> tar: Error is not recoverable: exiting now

**解决方案：**
先`gunzip *.tar.gz`
再`tar xvf *.tar`
也可以使用`tar xvf *.tar -C 自定义目录`指定解压位置。
若文件为`.tgz`格式，用`mv`命令转成`.tar.gz`。

4. 创建软连接

```bash
$ ln -snf /usr/local/ZooKeeper/zookeeper-3.4.5-cdh5.16.2/ /usr/local/zoo
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

6. 目录规划

```bash
$ mkdir -p /usr/local/zoo/{data,logs}
```

7. 配置文件

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
dataLogDir=/usr/local/zoo/logs
# [新增]修改默认的8080端口，该选项在3.5.5之后才需要配置
admin.serverPort=8090
```

8. 启动与停止

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

9. 连接

- 访问8090端口的服务【版本3.5.5开始支持】

```bash
# 比如
http://192.168.1.116:8090/commands/stat
```

- 远程连接

```bash
$ zkCli.sh -server 192.168.1.116:2181
```

- 本地连接

```bash
$ zkCli.sh
```

- 退出（连接成功后，使用命令quit退出）

```bash
[zk: localhost:2181(CONNECTED) 0] quit
```



