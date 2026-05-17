# 第16章 Hive安装（Apache版）

### 16.1、安装Hive（Apache版）

#### 16.1.1、基本安装

1. 下载

最新发行版下载页面：https://hive.apache.org/downloads.html

历史发行版下载页面：https://archive.apache.org/dist/hive/ 或者 https://dlcdn.apache.org/hive/

```bash
$ wget -cP /usr/local/src/ https://dlcdn.apache.org/hive/hive-3.1.2/apache-hive-3.1.2-bin.tar.gz --no-check-certificate
```

2. 创建安装目录

```bash
$ mkdir /usr/local/Hive
```

3. 解压安装

```bash
$ tar -zxvf /usr/local/src/apache-hive-3.1.2-bin.tar.gz -C /usr/local/Hive/
```

4. 创建软连接

```bash
$ ln -snf /usr/local/Hive/apache-hive-3.1.2-bin/ /usr/local/hive
```

5. 配置环境变量

```bash
$ sudo vim /etc/profile.d/hive.sh
export HIVE_HOME=/usr/local/hive
export PATH=$HIVE_HOME/bin:$PATH
```

使之生效：

```bash
$ source /etc/profile
```

#### 16.1.2、配置

##### 1.配置与初始化

- `hive-env.sh`

```bash
$ cp /usr/local/hive/conf/hive-env.sh.template /usr/local/hive/conf/hive-env.sh
$ vim /usr/local/hive/conf/hive-env.sh
```

```bash
# [修改]
HADOOP_HOME=/usr/local/hadoop
```

- `hive-site.xml`

```bash
# 可以复制模板生成hive-site.xml后修改以下属性的值，也可以直接跳过该步骤，手动编写hive-site.xml文件。推荐：跳过复制，直接手写。
$ cp /usr/local/hive/conf/hive-default.xml.template /usr/local/hive/conf/hive-site.xml
$ vim /usr/local/hive/conf/hive-site.xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
  <property>
    <name>javax.jdo.option.ConnectionURL</name>
	<value>jdbc:mysql://emon:3306/hivedb?createDatabaseIfNotExist=true</value>
  </property>
  <property>
    <name>javax.jdo.option.ConnectionDriverName</name>
    <value>com.mysql.jdbc.Driver</value>
  </property>
  <property>
    <name>javax.jdo.option.ConnectionUserName</name>
    <value>flyin</value>
  </property>
  <property>
    <name>javax.jdo.option.ConnectionPassword</name>
    <value>Flyin@123</value>
  </property>
  <property>
    <name>hive.querylog.location</name>
    <value>/usr/local/hive/tmp/querylog</value>
  </property>
  <property>
    <name>hive.exec.local.scratchdir</name>
    <value>/usr/local/hive/tmp/scratchdir</value>
  </property>
  <property>
    <name>hive.downloaded.resources.dir</name>
    <value>/usr/local/hive/tmp/resources</value>
  </property>
</configuration>
```

- 拷贝mysql驱动包到`$HIVE_HOME/lib`目录

```bash
$ cp /usr/local/src/mysql-connector-java-5.1.27-bin.jar /usr/local/hive/lib/
```

- 修改Hadoop集群的`core-site.xml`文件，集群每个节点都需要，纯客户端节点不需要修改

```bash
$ vim /usr/local/hadoop/etc/hadoop/core-site.xml 
```

```xml
<!--增加，避免使用beeline连接hive的时候报错；注意emon是hadoop的用户，也是beeline使用时指定的用户-->
    <property>
        <name>hadoop.proxyuser.emon.hosts</name>
        <value>*</value>
    </property>
    <property>
        <name>hadoop.proxyuser.emon.groups</name>
        <value>*</value>
    </property>
```

**说明**：复制该配置到Hadoop集群的其他节点。**注意**：要重启集群。

- 初始化Metastore

```bash
$ schematool -dbType mysql -initSchema
# 命令行输出信息
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/usr/local/Hive/apache-hive-3.1.2-bin/lib/log4j-slf4j-impl-2.10.0.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/usr/local/Hadoop/hadoop-3.3.1/share/hadoop/common/lib/slf4j-log4j12-1.7.30.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
Metastore connection URL:	 jdbc:mysql://emon:3306/hivedb?createDatabaseIfNotExist=true
Metastore Connection Driver :	 com.mysql.jdbc.Driver
Metastore connection User:	 flyin
Starting metastore schema initialization to 3.1.0
Initialization script hive-schema-3.1.0.mysql.sql
......一大段空白......
Initialization script completed
schemaTool completed
```

##### 2.启动hive命令行【旧，hive1.x开始支持】

- 进入hive命令行

```bash
# 进入CLI
$ hive
......
Logging initialized using configuration in jar:file:/usr/local/Hive/apache-hive-3.1.2-bin/lib/hive-common-3.1.2.jar!/hive-log4j2.properties Async: true
Hive Session ID = c8c20879-6c99-48d2-9130-532798bed484
Hive-on-MR is deprecated in Hive 2 and may not be available in the future versions. Consider using a different execution engine (i.e. spark, tez) or using Hive 1.X releases.
hive> show databases;
OK
default
Time taken: 0.751 seconds, Fetched: 1 row(s)
hive> exit;
```

- 不进入hive命令行，直接在bash执行

```bash
[emon@emon ~]hive -e "select * from t1"
```

##### 3.MySQL库情况

在初始化Metastore之后，MySQL库产生了`hivedb`库和74张表。

```sql
$ mysql -uflyin -pFlyin@123 -hemon
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| architectdb        |
| flyindb            |
| hivedb             |
| metastoredb        |
| mysql              |
| performance_schema |
| sparkdb            |
| sys                |
+--------------------+
9 rows in set (0.00 sec)
mysql> use hivedb;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> select * from dbs \G;
*************************** 1. row ***************************
          DB_ID: 1
           DESC: Default Hive database
DB_LOCATION_URI: hdfs://emon:8020/user/hive/warehouse
           NAME: default
     OWNER_NAME: public
     OWNER_TYPE: ROLE
      CTLG_NAME: hive
1 row in set (0.00 sec)

ERROR: 
No query specified
```

##### 4.启动beeline命令行

- 启动hiveserver2

```bash
$ hiveserver2 
# 命令行输出信息
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/usr/local/HBase/hbase-1.2.0-cdh5.16.2/lib/slf4j-log4j12-1.7.5.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/usr/local/Hadoop/hadoop-3.3.1/share/hadoop/common/lib/slf4j-log4j12-1.7.30.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.slf4j.impl.Log4jLoggerFactory]
2022-01-29 18:50:24: Starting HiveServer2
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/usr/local/Hive/apache-hive-3.1.2-bin/lib/log4j-slf4j-impl-2.10.0.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/usr/local/Hadoop/hadoop-3.3.1/share/hadoop/common/lib/slf4j-log4j12-1.7.30.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
Hive Session ID = d6e8c178-5e30-4317-b86b-8d3176b345c4
Hive Session ID = 9ff5771c-0f55-4436-88a6-76d955d4bb3c
Hive Session ID = a82e3870-bf7d-46a6-a778-5a197fbcf39a
Hive Session ID = 857e29d3-2f66-444c-8093-f721f4a9e626
# 说明，看到4个Session ID才算启动成功，才可以去连接；而且，从输出2个到4个Session ID要等待几十秒。
```

- 连接

```bash
$ beeline -u jdbc:hive2://localhost:10000
# 连接失败，注意：User: emon is not allowed to impersonate anonymous 是由于Hadoop的core-site.xml配置问题。
Connecting to jdbc:hive2://localhost:10000
2022-01-29 18:53:33,871 INFO jdbc.Utils: Supplied authorities: localhost:10000
2022-01-29 18:53:33,872 INFO jdbc.Utils: Resolved authority: localhost:10000
2022-01-29 18:53:33,991 WARN jdbc.HiveConnection: Failed to connect to localhost:10000
Error: Could not open client transport with JDBC Uri: jdbc:hive2://localhost:10000: Failed to open new session: java.lang.RuntimeException: org.apache.hadoop.ipc.RemoteException(org.apache.hadoop.security.authorize.AuthorizationException): User: emon is not allowed to impersonate anonymous (state=08S01,code=0)
Beeline version 2.3.7 by Apache Hive
# 确保Hadoop的core-site.xml配置过并重启后，再试！
$ beeline -u jdbc:hive2://localhost:10000 -n emon
Connecting to jdbc:hive2://localhost:10000
2022-01-29 19:11:05,769 INFO jdbc.Utils: Supplied authorities: localhost:10000
2022-01-29 19:11:05,770 INFO jdbc.Utils: Resolved authority: localhost:10000
Connected to: Apache Hive (version 3.1.2)
Driver: Hive JDBC (version 2.3.7)
Transaction isolation: TRANSACTION_REPEATABLE_READ
Beeline version 2.3.7 by Apache Hive
0: jdbc:hive2://localhost:10000> 
# 使用主机名访问
$ beeline -u jdbc:hive2://emon:10000 -n emon
```

