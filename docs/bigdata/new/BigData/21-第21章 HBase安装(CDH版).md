# 第21章 HBase安装（CDH版）

## 21.1、安装HBase（外部ZK+外部HDFS+CDH）

1. 下载

**注意**：无法避开收费墙下载，暂时无解

2. 创建安装目录

```bash
$ mkdir /usr/local/HBase
```

3. 解压安装

```bash
$ tar -zxvf /usr/local/src/hbase-1.2.0-cdh5.16.2.tar.gz -C /usr/local/HBase/
```

4. 创建软连接

```bash
$ ln -snf /usr/local/HBase/hbase-1.2.0-cdh5.16.2/ /usr/local/hbase
```

5. 配置环境变量

在`/etc/profile.d`目录创建`hbase.sh`文件：

```bash
$ sudo vim /etc/profile.d/hbase.sh
export HBASE_HOME=/usr/local/hbase
export PATH=$HBASE_HOME/bin:$PATH
```

使之生效：

```bash
$ source /etc/profile
```

6. 目录规划

```bash
$ mkdir -p /usr/local/hbase/tmp
```

7. 配置文件

- 配置`hbase-env.sh`

```bash
$ vim /usr/local/hbase/conf/hbase-env.sh 
```

```bash
# [新增]
export JAVA_HOME=/usr/local/java
# [新增]
export HBASE_MANAGES_ZK=false
```

- 配置`hbase-site.xml`

```bash
$ vim /usr/local/hbase/conf/hbase-site.xml 
```

```xml
<configuration>
    <!--Temporary directory on the local filesystem-->
    <property>
    	<name>hbase.tmp.dir</name>
        <value>/usr/local/hbase/tmp</value>
    </property>
    <!-- hbase数据存放的目录，若用本地目录，必须带上file://,否则hbase启动不起来 -->
    <property>
        <name>hbase.rootdir</name>
        <value>hdfs://emon:8020/hbase</value>
        <!--<value>file:///usr/local/hbase/data</value>-->
    </property>
    <!-- 此处必须为true，不然hbase仍用自带的zk，若启动了外部的zookeeper，会导致冲突，hbase启动不起来 -->
    <property>
        <name>hbase.cluster.distributed</name>
        <value>true</value>
    </property>
    <!-- zk的位置，如果是zk集群采用 emon,emon2,emon3 形式配置 -->
    <property>
        <name>hbase.zookeeper.quorum</name>
        <value>emon</value>
    </property>
</configuration>
```

8. 启动与停止

- 启动（端口号60010）

```bash
$ start-hbase.sh
```

验证1：

```bash
$ jps
10849 HRegionServer
10703 HMaster
```

验证2：

http://emon:60010/

- 停止

```bash
$ stop-hbase.sh 
```

- 进入hbase命令行

```bash
$ hbase shell
```

- 退出hbase命令行

```bash
hbase(main):014:0> exit
```



