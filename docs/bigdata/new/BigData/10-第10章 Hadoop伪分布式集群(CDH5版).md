# 第10章 Hadoop伪分布式集群（CDH5版）

## 10.1、安装Hadoop

目录规划：

| 目录                            | 作用                       |
| ------------------------------- | -------------------------- |
| /usr/local/hadoop/tmp           | 存放hadoop的hdfs数据的目录 |
| /usr/local/hadoop/custom/data   | 测试数据                   |
| /usr/local/hadoop/custom/lib    | jar库文件                  |
| /usr/local/hadoop/custom/shell  | 脚本文件                   |
| /usr/local/hadoop/custom/source | 存放spark等等源码的目录    |
|                                 |                            |

### 10.1.1、Hadoop伪分布式集群（CDH5版）

#### 10.1.1、依赖环境

已配置IP：[配置网络](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/Linux/LinuxInAction.md#21%E9%85%8D%E7%BD%AE%E7%BD%91%E7%BB%9C)

已设置hostname：[修改主机名](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/Linux/LinuxInAction.md#13%E4%BF%AE%E6%94%B9%E4%B8%BB%E6%9C%BA%E5%90%8D)

已配置SSH免密登录（emon到emon、emon1和emon2的免密登录）：[配置SSH免密登录](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/BigData/BigDataInAction.md#1%E9%85%8D%E7%BD%AEssh%E5%85%8D%E5%AF%86%E7%99%BB%E5%BD%95)

已安装JDK：[安装JDK](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/Linux/LinuxInAction.md#1%E5%AE%89%E8%A3%85jdk)

#### 10.1.2、安装

1. 下载

Hadoop生态圈的软件下载地址：

https://archive.cloudera.com/cdh5/cdh/5/  （已无法下载）

**注意**：无法避开收费墙下载，暂时无解

2. 创建安装目录

```bash
$ mkdir /usr/local/Hadoop
```

3. 解压安装

```bash
$ tar -xzvf /usr/local/src/hadoop-2.6.0-cdh5.16.2.tar.gz -C /usr/local/Hadoop/
```

- hadoop软件包常见目录说明

  - `bin`： hadoop客户端命令

  - `etc/hadoop`： hadoop相关的配置文件存放目录

  - `sbin`： 启动hadoop相关进程的脚本

  - `share`： 常用例子

4. 创建软连接

```bash
$ ln -snf /usr/local/Hadoop/hadoop-2.6.0-cdh5.16.2/ /usr/local/hadoop
```

5. 配置环境变量

```bash
$ sudo vim /etc/profile.d/hadoop.sh
export HADOOP_HOME=/usr/local/hadoop
export PATH=$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$PATH
```

使之生效：

```
$ source /etc/profile
```

#### 10.1.3、配置

##### 1.HDFS配置

- 确保JAVA_HOME指定到JDK8，查看配置

```bash
$ vim /usr/local/hadoop/etc/hadoop/hadoop-env.sh 
```

可以看到`export JAVA_HOME=${JAVA_HOME}`，所以，如果JAVA_HOME环境变量是正确的即可。

- 配置`core-site.xml`

```bash
# 在打开的文件中<configuration>节点内添加属性
$ vim /usr/local/hadoop/etc/hadoop/core-site.xml 
```

```xml
<configuration>
    <property>
        <name>fs.defaultFS</name>
		<value>hdfs://emon:8020</value>
    </property>
</configuration>
```

- 配置`hdfs-site.xml`

```bash
# 修改副本数量
$ vim /usr/local/hadoop/etc/hadoop/hdfs-site.xml 
```

```xml
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
    <property>
        <name>hadoop.tmp.dir</name>
        <value>/usr/local/hadoop/tmp</value>
    </property>
</configuration>
```

- 修改从节点

```bash
$ vim /usr/local/hadoop/etc/hadoop/slaves 
```

```bash
#localhost
emon
```

**注意**：emon是主机名，可以在`/etc/hosts`配置，比如：`192.168.1.116   emon`

2. 启动HDFS

- 格式化HDFS文件系统：第一次执行的时候一定要格式化文件系统，不要重复执行。

```bash
$ hdfs namenode -format
```

```bash
STARTUP_MSG: Starting NameNode
STARTUP_MSG:   user = emon
STARTUP_MSG:   host = emon/192.168.1.116
STARTUP_MSG:   args = [-format]
STARTUP_MSG:   version = 2.6.0-cdh5.16.2
STARTUP_MSG:   classpath =......
......省略......
21/12/26 19:24:01 INFO namenode.NameNode: Caching file names occuring more than 10 times
21/12/26 19:24:01 INFO snapshot.SnapshotManager: Loaded config captureOpenFiles: false, skipCaptureAccessTimeOnlyChange: false, snapshotDiffAllowSnapRootDescendant: true
21/12/26 19:24:01 INFO util.GSet: Computing capacity for map cachedBlocks
21/12/26 19:24:01 INFO util.GSet: VM type       = 64-bit
21/12/26 19:24:01 INFO util.GSet: 0.25% max memory 889 MB = 2.2 MB
21/12/26 19:24:01 INFO util.GSet: capacity      = 2^18 = 262144 entries
21/12/26 19:24:01 INFO namenode.FSNamesystem: dfs.namenode.safemode.threshold-pct = 0.9990000128746033
21/12/26 19:24:01 INFO namenode.FSNamesystem: dfs.namenode.safemode.min.datanodes = 0
21/12/26 19:24:01 INFO namenode.FSNamesystem: dfs.namenode.safemode.extension     = 30000
21/12/26 19:24:01 INFO metrics.TopMetrics: NNTop conf: dfs.namenode.top.window.num.buckets = 10
21/12/26 19:24:01 INFO metrics.TopMetrics: NNTop conf: dfs.namenode.top.num.users = 10
21/12/26 19:24:01 INFO metrics.TopMetrics: NNTop conf: dfs.namenode.top.windows.minutes = 1,5,25
21/12/26 19:24:01 INFO namenode.FSNamesystem: Retry cache on namenode is enabled
21/12/26 19:24:01 INFO namenode.FSNamesystem: Retry cache will use 0.03 of total heap and retry cache entry expiry time is 600000 millis
21/12/26 19:24:01 INFO util.GSet: Computing capacity for map NameNodeRetryCache
21/12/26 19:24:01 INFO util.GSet: VM type       = 64-bit
21/12/26 19:24:01 INFO util.GSet: 0.029999999329447746% max memory 889 MB = 273.1 KB
21/12/26 19:24:01 INFO util.GSet: capacity      = 2^15 = 32768 entries
21/12/26 19:24:01 INFO namenode.FSNamesystem: ACLs enabled? false
21/12/26 19:24:01 INFO namenode.FSNamesystem: XAttrs enabled? true
21/12/26 19:24:01 INFO namenode.FSNamesystem: Maximum size of an xattr: 16384
21/12/26 19:24:01 INFO namenode.FSImage: Allocated new BlockPoolId: BP-1296725921-192.168.1.116-1640517841222
21/12/26 19:24:01 INFO common.Storage: Storage directory /usr/local/hadoop/tmp/dfs/name has been successfully formatted.
21/12/26 19:24:01 INFO namenode.FSImageFormatProtobuf: Saving image file /usr/local/hadoop/tmp/dfs/name/current/fsimage.ckpt_0000000000000000000 using no compression
21/12/26 19:24:01 INFO namenode.FSImageFormatProtobuf: Image file /usr/local/hadoop/tmp/dfs/name/current/fsimage.ckpt_0000000000000000000 of size 321 bytes saved in 0 seconds .
21/12/26 19:24:01 INFO namenode.NNStorageRetentionManager: Going to retain 1 images with txid >= 0
21/12/26 19:24:01 INFO util.ExitUtil: Exiting with status 0
21/12/26 19:24:01 INFO namenode.NameNode: SHUTDOWN_MSG: 
/************************************************************
SHUTDOWN_MSG: Shutting down NameNode at emon/192.168.1.116
************************************************************/
```

- 启动HDFS

```bash
$ /usr/local/hadoop/sbin/start-dfs.sh 
```

```bash
21/12/26 19:25:51 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Starting namenodes on [emon]
emon: starting namenode, logging to /usr/local/Hadoop/hadoop-2.6.0-cdh5.16.2/logs/hadoop-emon-namenode-emon.out
emon: starting datanode, logging to /usr/local/Hadoop/hadoop-2.6.0-cdh5.16.2/logs/hadoop-emon-datanode-emon.out
Starting secondary namenodes [0.0.0.0]
0.0.0.0: starting secondarynamenode, logging to /usr/local/Hadoop/hadoop-2.6.0-cdh5.16.2/logs/hadoop-emon-secondarynamenode-emon.out
21/12/26 19:26:06 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
```

**说明**：启动日志参见`/usr/local/hadoop/logs`

- 验证1

```bash
[emon@emon hadoop]$ jps
28930 Jps
28456 DataNode
28137 NameNode
28812 SecondaryNameNode
```

- 验证2

**注意**：确保防火墙停止，或者50070端口是放开的！

```bash
$ sudo firewall-cmd --state
not running
```

访问地址：http://repo.emon.vip:50070

- 验证3

```bash
# 执行一个PI求解的任务
$ hadoop jar /usr/local/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.6.0-cdh5.16.2.jar pi 2 3
```

3. 停止HDFS

```bash
$ /usr/local/hadoop/sbin/stop-dfs.sh
```

4. 另外一种启动方式

> start-dfs.sh = 
>
> ​					hadoop-daemons.sh start namenode
>
> ​					hadoop-daemons.sh start datanode
>
> ​					hadoop-daemons.sh start secondarynamenode

> stop-dfs.sh = 
>
> ​					hadoop-daemons.sh stop namenode
>
> ​					hadoop-daemons.sh stop datanode
>
> ​					hadoop-daemons.sh stop secondarynamenode

```bash
$ /usr/local/hadoop/sbin/hadoop-daemon.sh start namenode
$ /usr/local/hadoop/sbin/hadoop-daemon.sh start datanode

$ /usr/local/hadoop/sbin/hadoop-daemon.sh stop datanode
$ /usr/local/hadoop/sbin/hadoop-daemon.sh stop namenode
```

##### 2.YARN配置

1. 配置

- 配置`mapred-site.xml`

```bash
$ cp /usr/local/hadoop/etc/hadoop/mapred-site.xml.template /usr/local/hadoop/etc/hadoop/mapred-site.xml
$ vim /usr/local/hadoop/etc/hadoop/mapred-site.xml
```

```xml
<configuration>
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
</configuration>
```

- 配置`yarn-site.xml`

```bash
$ vim /usr/local/hadoop/etc/hadoop/yarn-site.xml 
```

```xml
<configuration>

<!-- Site specific YARN configuration properties -->
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
    <!-- 配置该属性为了解决错误 Caused by: java.io.IOException: Exceeded MAX_FAILED_UNIQUE_FETCHES; bailing-out. -->
    <property>
        <name>yarn.nodemanager.local-dirs</name>
        <value>/usr/local/hadoop/tmp/nm-local-dir</value>        
    </property>
</configuration>
```

2. 启动

- 启动YARN

```bash
$ /usr/local/hadoop/sbin/start-yarn.sh 
```

```bash
starting yarn daemons
starting resourcemanager, logging to /usr/local/Hadoop/hadoop-2.6.0-cdh5.16.2/logs/yarn-emon-resourcemanager-emon.out
emon: starting nodemanager, logging to /usr/local/Hadoop/hadoop-2.6.0-cdh5.16.2/logs/yarn-emon-nodemanager-emon.out
```

**说明：**启动日志参见`/usr/local/hadoop/logs`

- 验证1

```bash
[emon@emon hadoop]$ jps
29632 Jps
28456 DataNode
28137 NameNode
29001 ResourceManager
29483 NodeManager
28812 SecondaryNameNode
```

- 验证2

访问地址：http://repo.emon.vip:8088

3. 停止YARN

```bash
$ /usr/local/hadoop/sbin/stop-yarn.sh 
```

4. 另外一种方式

> start-yarn.sh=
>
> ​					yarn-daemon.sh start resourcemanager
>
> ​					yarn-daemon.sh start nodemanager

> stop-yarn.sh=
>
> ​					yarn-daemon.sh stop resourcemanager
>
> ​					yarn-daemon.sh stop nodemanager

