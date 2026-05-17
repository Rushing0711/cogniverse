# 第11章 Hadoop集群（CDH5版）

### 11.1、Hadoop集群（CDH5版）

#### 11.1.1、依赖环境

已配置IP：[配置网络](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/Linux/LinuxInAction.md#21%E9%85%8D%E7%BD%AE%E7%BD%91%E7%BB%9C)

已设置hostname：[修改主机名](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/Linux/LinuxInAction.md#13%E4%BF%AE%E6%94%B9%E4%B8%BB%E6%9C%BA%E5%90%8D)

已配置SSH免密登录（emon到emon、emon1和emon2的免密登录）：[配置SSH免密登录](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/BigData/BigDataInAction.md#1%E9%85%8D%E7%BD%AEssh%E5%85%8D%E5%AF%86%E7%99%BB%E5%BD%95)

已安装JDK：[安装JDK](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/Linux/LinuxInAction.md#1%E5%AE%89%E8%A3%85jdk)

已配置集群内时间同步服务：[集群内时间同步服务](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/BigData/BigDataInAction.md#2%E9%9B%86%E7%BE%A4%E5%86%85%E6%97%B6%E9%97%B4%E5%90%8C%E6%AD%A5%E6%9C%8D%E5%8A%A1)

#### 11.1.2、集群规划

- 节点情况
  - HDFS
    - NN：NameNode
    - DN：DataNode
  - YARN
    - RM：ResourceManager
    - NM：NodeManager

| 机器名 | IP1-家庭      | IP2-公司   | 部署内容       |
| ------ | ------------- | ---------- | -------------- |
| emon   | 192.168.1.116 | 10.0.0.116 | NN、DN、RM、NM |
| emon2  | 192.168.1.117 | 10.0.0.117 | DN、NM         |
| emon3  | 192.168.1.118 | 10.0.0.118 | DN、NM         |

- hostname配置情况

```bash
$ sudo vim /etc/hosts
192.168.1.116 emon
192.168.1.117 emon2
192.168.1.118 emon3
```

```bash
[emon@emon2 ~]$ sudo vim /etc/hosts
192.168.1.116 emon
192.168.1.117 emon2
192.168.1.118 emon3
```

```bash
[emon@emon3 ~]$ sudo vim /etc/hosts
192.168.1.116 emon
192.168.1.117 emon2
192.168.1.118 emon3
```

#### 11.1.3、前置安装

##### 1.配置SSH免密登录

<font color="red">每一台服务器都需要配置免密登录。</font>

- 检查SSH keys是否存在：（每一台服务器都需要做）

```bash
$ ls -a ~/.ssh
```

- 如果不存在，生成SSH keys：（每一台服务器都需要做）

```bash
$ ssh-keygen -t rsa -b 4096 -C "[邮箱]"
Generating public/private rsa key pair.
Enter file in which to save the key (/home/emon/.ssh/id_rsa):`[默认]` 
Created directory '/home/emon/.ssh'.
Enter passphrase (empty for no passphrase): `[输入口令，其他用户切换到emon会提示输入]`
Enter same passphrase again: `[确认口令]`
Your identification has been saved in /home/emon/.ssh/id_rsa.
Your public key has been saved in /home/emon/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:IRg9u6Ha0s6oUfHDqGjS2Tn4UWS+kRO2mDYyWP9wjHQ liming20110711@163.com
The key's randomart image is:
+---[RSA 4096]----+
|    ..           |
|     oo          |
|  o o Eo.        |
| o B @o= .       |
|. = %.XoS        |
|.+ B.O.+         |
|=.++= o          |
|o.o+oo           |
|...o+            |
+----[SHA256]-----+
```

- 拷贝emon服务器公钥到其他服务器：（仅emon服务器需要做）

```bash
$ ssh-copy-id -i ~/.ssh/id_rsa.pub emon
$ ssh-copy-id -i ~/.ssh/id_rsa.pub emon2
$ ssh-copy-id -i ~/.ssh/id_rsa.pub emon3
```

- 验证从emon服务器登录到emon、emon2、emon3免密登录

```bash
$ ssh emon
$ ssh emon2
$ ssh emon3
```

##### 2.集群内时间同步服务

1. 安装

<font color="red">每一台服务器都需要安装ntp。</font>

- 检查是否已安装

```bash
$ yum list ntp
```

- 如果未安装，则安装

```bash
$ sudo yum install -y ntp
```

2. 配置服务端

<font color="red">仅emon服务器配置。</font>

- 配置`ntp.conf`

```bash
$ sudo vim /etc/ntp.conf 
```

```bash
# [新增]
logfile /var/log/ntpd.log
# [备注]如下两行配置完全未变动，只是想记录下这个是事件同步服务归属集群网段的配置
restrict 127.0.0.1
restrict ::1
# [修改]去掉默认的server的4个配置，增加阿里云时间同步服务同步
#server 0.centos.pool.ntp.org iburst
#server 1.centos.pool.ntp.org iburst
#server 2.centos.pool.ntp.org iburst
#server 3.centos.pool.ntp.org iburst
server ntp1.aliyun.com
server ntp2.aliyun.com
server ntp3.aliyun.com
# 当所有授时服务都不可用时，采用本机作为授时服务
server 127.0.0.1
fudge 127.0.0.1 stratum 10
```

**授时服务**：可以在 https://www.ntppool.org/zone/asia 查看更多授时服务

- 同步时间

```bash
$ sudo ntpdate -u ntp1.aliyun.com
# 命令行输出信息
20 Jan 13:56:45 ntpdate[119191]: adjust time server 120.25.115.20 offset 0.003865 sec
```

- 开启ntp服务

```bash
$ sudo systemctl start ntpd
```

- 查看服务状态

```bash
$ sudo systemctl status ntpd
```

- 关闭服务命令

```bash
$ sudo systemctl stop ntpd
```

- 设置为开机自动启动

```bash
$ sudo systemctl enable ntpd
# 校验设置结果
$ sudo systemctl is-enabled ntpd
# 命令行输出信息，enabled表示已经设置开机自启成功
enabled
```

- 查看状态

```bash
$ ntpstat
# 命令行输出信息
synchronised to NTP server (120.25.115.20) at stratum 3
   time correct to within 27 ms
   polling server every 64 s
# 注意，以上成功的信息，是在服务启动5-10分钟后才有同步成功的信息，否则是   
unsynchronised
  time server re-starting
   polling server every 8 s  
```

3. 配置客户端

<font color="red">仅emon服务器之外的服务器配置（比如这里的emon2和emon3）。</font>

- 配置`ntp.conf`

```bash
$ sudo vim /etc/ntp.conf 
```

```bash
# [新增]
logfile /var/log/ntpd.log
# [修改]去掉默认的server的4个配置，指定到emon服务器
#server 0.centos.pool.ntp.org iburst
#server 1.centos.pool.ntp.org iburst
#server 2.centos.pool.ntp.org iburst
#server 3.centos.pool.ntp.org iburst
server emon
```

- 开启ntp服务

```bash
$ sudo systemctl start ntpd
```

- 设置为开机自动启动

```bash
$ sudo systemctl enable ntpd
```

- 查看状态

```bash
[emon@emon2 ~]$ ntpstat
```

##### 3.安装Hadoop

<font color="red">每一台服务器都需要安装Hadoop。</font>

[安装Hadoop](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/BigData/BigDataInAction.md#5%E5%AE%89%E8%A3%85hadoop)

#### 5.2.3、配置

<font color="red">每一台服务器都需要配置，且配置内容一样。</font>

##### 1.HDFS配置

- 配置`hadoop-env.sh`

确保JAVA_HOME指定到JDK8，查看配置

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
# 修改副本数量，由于默认副本系统是3，也可以不用修改了
$ vim /usr/local/hadoop/etc/hadoop/hdfs-site.xml 
```

```xml
<configuration>
    <property>
        <name>dfs.namenode.name.dir</name>
        <value>/usr/local/hadoop/tmp/dfs/name</value>
    </property>
    <property>
        <name>dfs.datanode.data.dir</name>
        <value>/usr/local/hadoop/tmp/dfs/data</value>
    </property>
</configuration>
```

##### 2.YARN配置

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
    <property>
        <name>yarn.resourcemanager.hostname</name>
        <value>emon</value>
    </property>
</configuration>
```

##### 2.节点配置

- `slaves`

```bash
$ vim /usr/local/hadoop/etc/hadoop/slaves 
```

```bash
#localhost
emon
emon2
emon3
```



#### 5.2.4、格式化与启动

<font color="red">仅emon这个主服务器执行如下命令。</font>

##### 1.格式化HDFS

- 格式化HDFS文件系统：第一次执行的时候一定要格式化文件系统，不要重复执行。

```bash
$ hdfs namenode -format
# 或者
$ hadoop namenode -format
```

```bash
DEPRECATED: Use of this script to execute hdfs command is deprecated.
Instead use the hdfs command for it.

21/12/26 17:38:12 INFO namenode.NameNode: STARTUP_MSG: 
/************************************************************
STARTUP_MSG: Starting NameNode
STARTUP_MSG:   user = emon
STARTUP_MSG:   host = emon/192.168.1.116
STARTUP_MSG:   args = [-format]
STARTUP_MSG:   version = 2.6.0-cdh5.16.2
STARTUP_MSG:   classpath =......
......省略......
21/12/26 17:38:12 INFO namenode.NameNode: Caching file names occuring more than 10 times
21/12/26 17:38:12 INFO snapshot.SnapshotManager: Loaded config captureOpenFiles: false, skipCaptureAccessTimeOnlyChange: false, snapshotDiffAllowSnapRootDescendant: true
21/12/26 17:38:12 INFO util.GSet: Computing capacity for map cachedBlocks
21/12/26 17:38:12 INFO util.GSet: VM type       = 64-bit
21/12/26 17:38:12 INFO util.GSet: 0.25% max memory 889 MB = 2.2 MB
21/12/26 17:38:12 INFO util.GSet: capacity      = 2^18 = 262144 entries
21/12/26 17:38:12 INFO namenode.FSNamesystem: dfs.namenode.safemode.threshold-pct = 0.9990000128746033
21/12/26 17:38:12 INFO namenode.FSNamesystem: dfs.namenode.safemode.min.datanodes = 0
21/12/26 17:38:12 INFO namenode.FSNamesystem: dfs.namenode.safemode.extension     = 30000
21/12/26 17:38:12 INFO metrics.TopMetrics: NNTop conf: dfs.namenode.top.window.num.buckets = 10
21/12/26 17:38:12 INFO metrics.TopMetrics: NNTop conf: dfs.namenode.top.num.users = 10
21/12/26 17:38:12 INFO metrics.TopMetrics: NNTop conf: dfs.namenode.top.windows.minutes = 1,5,25
21/12/26 17:38:12 INFO namenode.FSNamesystem: Retry cache on namenode is enabled
21/12/26 17:38:12 INFO namenode.FSNamesystem: Retry cache will use 0.03 of total heap and retry cache entry expiry time is 600000 millis
21/12/26 17:38:12 INFO util.GSet: Computing capacity for map NameNodeRetryCache
21/12/26 17:38:12 INFO util.GSet: VM type       = 64-bit
21/12/26 17:38:12 INFO util.GSet: 0.029999999329447746% max memory 889 MB = 273.1 KB
21/12/26 17:38:12 INFO util.GSet: capacity      = 2^15 = 32768 entries
21/12/26 17:38:12 INFO namenode.FSNamesystem: ACLs enabled? false
21/12/26 17:38:12 INFO namenode.FSNamesystem: XAttrs enabled? true
21/12/26 17:38:12 INFO namenode.FSNamesystem: Maximum size of an xattr: 16384
21/12/26 17:38:12 INFO namenode.FSImage: Allocated new BlockPoolId: BP-2013064118-192.168.1.116-1640511492651
21/12/26 17:38:12 INFO common.Storage: Storage directory /usr/local/Hadoop/hadoop-2.6.0-cdh5.16.2/tmp/dfs/name has been successfully formatted.
21/12/26 17:38:12 INFO namenode.FSImageFormatProtobuf: Saving image file /usr/local/Hadoop/hadoop-2.6.0-cdh5.16.2/tmp/dfs/name/current/fsimage.ckpt_0000000000000000000 using no compression
21/12/26 17:38:12 INFO namenode.FSImageFormatProtobuf: Image file /usr/local/Hadoop/hadoop-2.6.0-cdh5.16.2/tmp/dfs/name/current/fsimage.ckpt_0000000000000000000 of size 320 bytes saved in 0 seconds .
21/12/26 17:38:12 INFO namenode.NNStorageRetentionManager: Going to retain 1 images with txid >= 0
21/12/26 17:38:12 INFO util.ExitUtil: Exiting with status 0
21/12/26 17:38:12 INFO namenode.NameNode: SHUTDOWN_MSG: 
/************************************************************
SHUTDOWN_MSG: Shutting down NameNode at emon/192.168.1.116
************************************************************/
```

##### 2.启动HDFS与停止

- 启动

```bash
$ /usr/local/hadoop/sbin/start-dfs.sh 
```

- 验证1

```bash
# jps查看进程
$ jps
14707 Jps
13909 NameNode
14232 DataNode
14589 SecondaryNameNode
# 查看hdfs路径
$ hadoop fs -ls  /
# 上传文件
$ hadoop fs -put /usr/local/hadoop/README.txt /
```

**说明：**执行上传文件时如果报错：

>21/12/26 17:42:50 INFO hdfs.DFSClient: Exception in createBlockOutputStream
>java.io.IOException: Bad connect ack with firstBadLink as 192.168.1.118:50010

请检查emon2和emon3是否防火墙已关闭！`[emon@emon2 ~]$]$ sudo systemctl status firewalld`

- 验证2

http://repo.emon.vip:50070

- 停止

```bash
$ /usr/local/hadoop/sbin/stop-dfs.sh 
```



##### 3.启动YARN与停止

```bash
$ /usr/local/hadoop/sbin/start-yarn.sh
```

- 验证1

```bash
[emon@emon Hadoop]$ jps
19472 SecondaryNameNode
20480 NodeManager
18792 NameNode
19115 DataNode
19998 ResourceManager
20846 Jps
```

- 验证2

http://repo.emon.vip:8088

- 验证3

```bash
# 执行一个PI求解的任务
$ hadoop jar /usr/local/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.6.0-cdh5.16.2.jar pi 2 3
```

- 停止

```bash
$ /usr/local/hadoop/sbin/stop-yarn.sh
```

##### 4.启动停止顺序

遵循：先启动的后停止，后启动的先停止！

启动HDFS->启动YARN

停止YARN->停止HDFS



