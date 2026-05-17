# 第26章 HBase安装（Apache版）

## 26.1、安装HBase（外部ZK）

1. 下载

官网地址：https://hbase.apache.org/

下载地址：https://hbase.apache.org/downloads.html

```bash
$ wget -cP /usr/local/src/ https://mirrors.tuna.tsinghua.edu.cn/apache/hbase/2.2.1/hbase-2.2.1-bin.tar.gz
```

2. 创建安装目录

```bash
$ mkdir /usr/local/HBase
```

3. 解压安装

```bash
$ tar -zxvf /usr/local/src/hbase-2.2.1-bin.tar.gz -C /usr/local/HBase/
```

4. 创建软连接

```bash
$ ln -snf /usr/local/HBase/hbase-2.2.1/ /usr/local/hbase
```

5. 配置环境变量

在`/etc/profile.d`目录创建`hbase.sh`文件：

```
$ sudo vim /etc/profile.d/hbase.sh
export PATH=/usr/local/hbase/bin:$PATH
```

使之生效：

```
$ source /etc/profile
```

6. 目录规划

```bash
$ mkdir -p /usr/local/hbase/data
```

7. 配置文件

- 配置使用外部的`zookeeper`

```bash
$ vim /usr/local/hbase/conf/hbase-env.sh 
```

```bash
# [修改]
export HBASE_MANAGES_ZK=true => export HBASE_MANAGES_ZK=false
```

- 配置`hbase-site.xml`

```bash
$ vim /usr/local/hbase/conf/hbase-site.xml
```

```xml
<configuration>
    <!-- hbase数据存放的目录，若用本地目录，必须带上file://,否则hbase启动不起来 -->
    <property>
        <name>hbase.rootdir</name>
        <value>file:///usr/local/hbase/data</value>
    </property>

    <!-- zk的位置 -->
    <property>
        <name>hbase.zookeeper.quorum</name>
        <value>localhost</value>
        <description>the pos of zk</description>
    </property>

    <!-- 此处必须为true，不然hbase仍用自带的zk，若启动了外部的zookeeper，会导致冲突，hbase启动不起来 -->
    <property>
        <name>hbase.cluster.distributed</name>
        <value>true</value>
    </property>
</configuration>
```

8. 启动与停止

- 启动（端口号16000）

```bash
$ start-hbase.sh 
```

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





