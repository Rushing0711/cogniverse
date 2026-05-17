# 第4章 Sqoop参数与导入导出


## 4.1、参数说明：

### 4.1.1、Sqoop通用参数

| 选项                                 | 含义说明                               |
| ------------------------------------ | -------------------------------------- |
| --connect `< jdbc-uri >`               | 指定JDBC连接字符串                     |
| --connection-manager `< class-name >`  | 指定要使用的连接管理器类               |
| --driver `< class-name >`              | 指定要使用的JDBC驱动类                 |
| --hadoop-mapred-home `< dir >`         | 指定$HADOOP_MAPRED_HOME路径            |
| --help                               | 万能帮助                               |
| --password-file                      | 设置用于存放认证的密码信息文件的路径   |
| -P 大写字母                          | 从控制台读取输入的密码                 |
| --password `< password >`              | 设置认证密码                           |
| --username `< username >`              | 设置认证用户名                         |
| --verbose                            | 打印详细的运行信息                     |
| --connection-param-file `< filename >` | 可选，指定存储数据库连接参数的属性文件 |

### 4.1.2、导入功能相关参数

| 选项                              | 含义说明                                               |
| --------------------------------- | ------------------------------------------------------ |
| --append                          | 将数据追加到HDFS上一个已存在的数据集上                 |
| --as-avrodatafile                 | 将数据导入到Avro数据文件                               |
| --as-sequencefile                 | 将数据导入到SequenceFile                               |
| --as-textfile                     | 将数据导入到普通文本文件（默认）                       |
| --boundary-query `< statement >`    | 边界查询，用于创建分片（InputSplit）                   |
| --columns `<col,col,col...>`        | 从表中导出指定的一组列的数据                           |
| --delete-target-dir               | 如果指定目录存在，则先删除掉                           |
| --direct                          | 使用直接导入模式（优化导入速度）                       |
| --direct-split-size `< n >`         | 分隔输入stream的字节大小（在直接导入模式下）           |
| --fetch-size `< n >`                | 从数据库中批量读取记录数                               |
| --inline-lob-limit `< n >`          | 设置内联的LOB对象的大小                                |
| -m,--num-mappers `< n >`            | 使用n个map任务并行导入数据                             |
| -e,--query `< statement >`          | 导入的查询语句                                         |
| --split-by `< column-name >`        | 指定按照哪个列去分隔数据                               |
| --table `< table-name >`            | 导入的源表表名                                         |
| --target-dir `< dir>`               | 导入HDFS的目标路径                                     |
| --warehouse-dir `< dir >`           | HDFS存放表的根路径                                     |
| --where `< where clause > `         | 指定导出时所使用的查询条件                             |
| -z,--compress                     | 启用压缩                                               |
| --compression-codec `< c >`         | 指定Hadoop的codec方式（默认gzip）                      |
| --null-string `< null-string >`     | 如果指定列为字符串类型，使用指定字符串替换值为NULL的值 |
| --null-non-string `< null-string >` | 如果指定列为非字符串类型，使用指定值替换值为NULL的值   |

### 4.1.3、导出功能相关参数

| 选项                                      | 含义说明                                               |
|-----------------------------------------| ------------------------------------------------------ |
| --validate `<class-name>`               | 启用数据副本验证功能，仅支持单表拷贝，可以指定使用的类 |
| --validation-threshold `<class-name>`   | 指定验证阈所使用的类                                   |
| --driect                                | 使用直接导出模式（优化速度）                           |
| --export-dir `<dir>`                    | 导出过程中HDFS源路径                                   |
| -m,--num-mappers `<n>`                  | 使用n个map任务并行导出                                 |
| --table `<table-name>`                  | 导出的目的表名称                                       |
| --call `<stored-proc-name> `            | 导出数据调用的指定存储过程名                           |
| --update-key `<col-name>`               | 更新参考的列名称，多个列名使用逗号分隔                 |
| --input-null-string `<null-string`>     | 如果指定列为字符串类型，使用指定字符串替换值为NULL的值 |
| --input-null-non-string `<null-string>` | 如果指定列为非字符串类型，使用指定值替换值为NULL的值   |
| --staging-table `<staging-table-name>`  | 数据插入目标表之前暂存到指定表                         |
| --clear-staging-table                   | 清除工作区中临时存放的数据                             |
| --batch                                 | 使用批量模式导出                                       |

## 4.2、导入（MySQL=>HDFS)

### 4.2.1、全表导入

- 创建数据库和表

```bash
# 进入MySQL命令行
$ mysql -uflyin -pFlyin@123
```

```sql
# 创建数据库
mysql> CREATE DATABASE IF NOT EXISTS sqoopdb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# 切换数据库
mysql> use sqoopdb;
# 创建表
mysql> create table user(id int(10),name varchar(64));
# 插入数据
mysql> insert into user(id,name) values(1,'jack');
mysql> insert into user(id,name) values(2,'tom');
mysql> insert into user(id,name) values(3,'mike');
mysql> insert into user(id, name)VALUES(NULL, 'abc');
mysql> insert into user(id, name)VALUES(5, NULL);
```

```sql
create table user(id id(10),name varchar(64));
```

- sqoop脚本：脚本执行后会生成`user.java`

```bash
sqoop import \
--connect jdbc:mysql://emon:3306/sqoopdb?serverTimezone=UTC\&useSSL=false \
--username flyin \
--password Flyin@123 \
--table user \
--target-dir /sqoop/out1 \
--delete-target-dir \
--num-mappers 1 \
--fields-terminated-by '\t' \
--null-string '\\N' \
--null-non-string '\\N'
```

特别注意：

1. 如果userSSl=false前的&不加转义符\，会导致报错：-bash: --username: 未找到命令
2. --num-mappers默认会分配4个任务，由于user表未指定主键，map-reduce不知道依赖哪一个字段分配任务。
   1. 通过指定主键解决该问题
   2. 通过指定列 --split-by
   3. 通过指定 --num-mappers 1
3. --null-string中的`\\N`包含一个转义符`\`

### 4.2.2、查询导入

- 数据库和表依赖上面
- sqoop脚本：脚本执行后会生成`QueryResult.java`

```bash
sqoop import \
--connect jdbc:mysql://emon:3306/sqoopdb?serverTimezone=UTC\&useSSL=false \
--username flyin \
--password Flyin@123 \
--target-dir /sqoop/out2 \
--delete-target-dir \
--num-mappers 1 \
--fields-terminated-by '\t' \
--query 'select id,name from user where id>1 and $CONDITIONS'
```

说明：使用查询导入时，要指定$CONDITIONS

## 4.3、导出（HDFS=>MySQL）

### 4.3.1、普通导出

- 创建数据库和表

```bash
# 创建数据库
mysql> CREATE DATABASE IF NOT EXISTS sqoopdb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# 切换数据库
mysql> use sqoopdb;
# 创建表
mysql> create table user2(id int(10),name varchar(64));
# 添加主键
mysql> ALTER TABLE sqoopdb.user2 ADD CONSTRAINT user2_pk PRIMARY KEY (id);
```

- sqoop脚本：脚本执行后会生成`user2.java`

```bash
sqoop export \
--connect jdbc:mysql://emon:3306/sqoopdb?serverTimezone=UTC\&useSSL=false \
--username flyin \
--password Flyin@123 \
--table user2 \
--export-dir /sqoop/out2 \
--input-fields-terminated-by '\t' 
```

### 4.3.2、存在则更新，不存在则插入

- sqoop脚本：脚本执行后会生成`user.java`

```bash
sqoop export \
--connect jdbc:mysql://emon:3306/sqoopdb?serverTimezone=UTC\&useSSL=false \
--username flyin \
--password Flyin@123 \
--table user2 \
--export-dir /sqoop/out2 \
--input-fields-terminated-by '\t' \
--update-key id \
--update-mode allowinsert
```

# 五、实战：Flume集成Kafka
