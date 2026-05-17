# 第15章 Hive安装（CDH5版）

## 15.1、安装Hive

目录规划：

| 目录                          | 作用                             |
| ----------------------------- | -------------------------------- |
| /usr/local/hive/tmp           | hive执行任务和查询的本地临时目录 |
| /usr/local/hive/custom/data   | 测试数据                         |
| /usr/local/hive/custom/lib    | jar库文件                        |
| /usr/local/hive/custom/shell  | 脚本文件                         |
| /usr/local/hive/custom/source | 存放spark等等源码的目录          |
| /usr/local/hive/logs          | hive日志目录                     |

### 15.1.1、依赖环境

- JDK8
- Hadoop3
- MySQL5.7（本安装配置了5版本，也可以调整为8版本）

### 15.1.2、安装Hive（CDH5版）

#### 15.1.2.1、基本安装

1. 下载

Hadoop生态圈的软件下载地址：

https://archive.cloudera.com/cdh5/cdh/5/ （已无法下载）

**注意**：无法避开收费墙下载，暂时无解

2. 创建安装目录

```bash
$ mkdir /usr/local/Hive
```

3. 解压安装

```bash
$ tar -zxvf /usr/local/src/hive-1.1.0-cdh5.16.2.tar.gz -C /usr/local/Hive/
```

4. 创建软连接

```bash
$ ln -snf /usr/local/Hive/hive-1.1.0-cdh5.16.2/ /usr/local/hive
```

5. 配置环境变量

```
$ sudo vim /etc/profile.d/hive.sh
export HIVE_HOME=/usr/local/hive
export PATH=$HIVE_HOME/bin:$PATH
```

使之生效：

```bash
$ source /etc/profile
```

#### 15.1.2.2、配置

##### 1.配置

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
</configuration>
```

- 拷贝mysql驱动包到`$HIVE_HOME/lib`目录

```bash
$ cp /usr/local/src/mysql-connector-java-5.1.27-bin.jar /usr/local/hive/lib/
```

##### 2.启动hive命令行

```sql
# 进入CLI
$ hive
......
Logging initialized using configuration in jar:file:/usr/local/Hive/hive-1.1.0-cdh5.16.2/lib/hive-common-1.1.0-cdh5.16.2.jar!/hive-log4j.properties
WARNING: Hive CLI is deprecated and migration to Beeline is recommended.
hive> show databases;
OK
default
hive> create database test_db;
OK
Time taken: 0.12 seconds
hive> show databases;
OK
default
test_db
```

##### 3.MySQL库情况

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
| mysql              |
| performance_schema |
| sys                |
+--------------------+
7 rows in set (0.01 sec)

mysql> use hivedb;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;
+--------------------+
| Tables_in_hivedb   |
+--------------------+
| cds                |
| database_params    |
| dbs                |
| func_ru            |
| funcs              |
| global_privs       |
| part_col_stats     |
| partitions         |
| roles              |
| sds                |
| sequence_table     |
| serdes             |
| skewed_string_list |
| tab_col_stats      |
| tbls               |
| version            |
+--------------------+
16 rows in set (0.00 sec)

mysql> select * from dbs where name='default' \G;
*************************** 1. row ***************************
          DB_ID: 1
           DESC: Default Hive database
DB_LOCATION_URI: hdfs://0.0.0.0:8020/user/hive/warehouse
           NAME: default
     OWNER_NAME: public
     OWNER_TYPE: ROLE
1 row in set (0.00 sec)
```

