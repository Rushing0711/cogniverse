# 第2章 Hive数据库操作


## 2.1、数据准备

hive演练数据： 链接：https://pan.baidu.com/s/11dCFUjQOlAKLyZoSh8wpxg 
提取码：1111 

数据上传：下载数据解压后，上传到 `/usr/local/hive/custom/data`目录。

```bash
$ ll -h /home/emon/bigdata/hive/data/hivedata/
总用量 56K
-rw-r--r--. 1 emon emon  27 1月  30 13:52 b_source.data
-rw-r--r--. 1 emon emon  27 1月  30 13:52 ex_par.data
-rw-r--r--. 1 emon emon  10 1月  30 13:52 external_table.data
-rw-r--r--. 1 emon emon  18 1月  30 13:52 partition_1.data
-rw-r--r--. 1 emon emon  27 1月  30 13:52 partition_2.data
-rw-r--r--. 1 emon emon  79 1月  30 13:52 stu2.data
-rw-r--r--. 1 emon emon  30 1月  30 13:52 stu3.data
-rw-r--r--. 1 emon emon  51 1月  30 13:52 stu.data
-rw-r--r--. 1 emon emon 123 1月  30 13:52 student.data
-rw-r--r--. 1 emon emon  39 1月  30 13:52 student_favors_2.data
-rw-r--r--. 1 emon emon  48 1月  30 13:52 student_favors.data
-rw-r--r--. 1 emon emon 246 1月  30 13:52 student_score.data
-rw-r--r--. 1 emon emon  10 1月  30 13:52 t2.data
-rw-r--r--. 1 emon emon  73 1月  30 13:52 t3.data
```

## 2.2、Hive中数据库的操作

### 2.2.1、查看数据库

- 查看数据库列表

```sql
hive (default)> show databases;
```

### 3.1.2、选择数据库

- 选择数据库

```sql
hive (default)> use default;
```

default是默认数据库，默认就在这个库里面。

咱们前面说过hive的数据都是存储在HDFS上的，那这里的default数据库在HDFS上是如何体现的？

在`hive-site.xml`中有一个参数`hive.metastore.warehouse.dir`：

```bash
# hive-site.xml的模板是hive-default.xml.template
$ vim /usr/local/hive/conf/hive-default.xml.template 
```

```xml
  <property>
    <name>hive.metastore.warehouse.dir</name>
    <value>/user/hive/warehouse</value>
    <description>location of default database for the warehouse</description>
  </property>
```

在HDFS中的体现：

```bash
$ hdfs dfs -ls -R /user/hive
drwxr-xr-x   - emon supergroup          0 2022-01-29 19:14 /user/hive/warehouse
drwxr-xr-x   - emon supergroup          0 2022-01-29 19:15 /user/hive/warehouse/t1
-rw-r--r--   1 emon supergroup          5 2022-01-29 19:15 /user/hive/warehouse/t1/000000_0
```

在MySQL中的体现：

```sql
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

### 3.1.3、创建数据库

- 创建数据库

```sql
hive (default)> create database mydb1;
```

- 创建数据库并指定HDFS位置

```sql
hive (default)> create database mydb2 location '/user/hive/mydb2';
```

### 2.2.4、删除数据库

- 删除数据库

```sql
hive (default)> drop database mydb1;
```

**注意**：无法删除`default`数据库：

```sql
hive (default)> drop database default;
FAILED: Execution Error, return code 1 from org.apache.hadoop.hive.ql.exec.DDLTask. MetaException(message:Can not drop default database in catalog hive)
```

## 3.2、Hive中表的操作
