# 第3章 Hive表操作


### 3.2.1、创建表

- 创建表

```sql
hive (default)> create table t2(id int);
```

### 3.2.2、查看表

- 查看表

```sql
hive (default)> show tables;
```

表的元数据信息在MySQL中的体现：

```sql
mysql> select * from tbls \G;
*************************** 1. row ***************************
            TBL_ID: 11
       CREATE_TIME: 1643520292
             DB_ID: 1
  LAST_ACCESS_TIME: 0
             OWNER: emon
        OWNER_TYPE: USER
         RETENTION: 0
             SD_ID: 11
          TBL_NAME: t2
          TBL_TYPE: MANAGED_TABLE
VIEW_EXPANDED_TEXT: NULL
VIEW_ORIGINAL_TEXT: NULL
IS_REWRITE_ENABLED:  
1 row in set (0.00 sec)

ERROR: 
No query specified
```

表字段的元数据信息在MySQL中的体现：

```sql
mysql> select * from columns_v2 \G;
*************************** 1. row ***************************
      CD_ID: 11
    COMMENT: NULL
COLUMN_NAME: id
  TYPE_NAME: int
INTEGER_IDX: 0
1 row in set (0.00 sec)

ERROR: 
No query specified
```

### 3.2.3、查看表信息

- 查看表基本信息

```sql
hive (default)> desc t2;
```

- 查看表扩展信息

```sql
hive (default)> desc extended t2;
```

- 查看表创建详细信息

```sql
hive (default)> show create table t2;
```

### 3.2.4、修改表名

- 修改表名

```sql
hive (default)> alter table t2 rename to t2_bak;
```

### 3.2.5、加载数据

- 加载数据

```sql
hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/t2.data' into table t2_bak;
```

- 加载数据并覆盖表旧数据

```sql
hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/t2.data' overwrite into table t2_bak;
```

- 加载数据之使用HDFS直接put数据

```bash
$ hdfs dfs -put /home/emon/bigdata/hive/data/hivedata/t2.data /user/hive/warehouse/t2_bak/t2_bak.data
```

- 加载数据之`insert override`示例【特例，与上下文无关】

```sql
hive> insert overwrite table trackinfo_province_stat partition(day='2013-07-21')
select province,count(*) as cnt from trackinfo where day='2013-07-21' group by province;
```

### 3.2.6、表增加字段及注释

- 添加字段

```sql
hive (default)> alter table t2_bak add columns(name string);
```

- 添加注释

```sql
# 注意，缩进使用的是空格，而不是tab
create table t2(
    age int comment '年龄'
) comment '测试';
```

```sql
# 执行效果
hive (default)> create table t2(
              >     age int comment '年龄'
              > ) comment '测试';
# 查看注释的编码
hive (default)> show create table t2;
OK
createtab_stmt
CREATE TABLE `t2`(
  `age` int COMMENT '??')
COMMENT '??'
......省略......
```

默认情况下，由于hive的注释在MySQL的元数据表`columns_v2`和`table_params`都是`DEFAULT CHARSET=latin1`编码，所以会显示乱码。

注释在MySQL情况：

```sql
mysql> show create table columns_v2 \G;
*************************** 1. row ***************************
       Table: columns_v2
Create Table: CREATE TABLE `columns_v2` (
  `CD_ID` bigint(20) NOT NULL,
  `COMMENT` varchar(256) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `COLUMN_NAME` varchar(767) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `TYPE_NAME` mediumtext,
  `INTEGER_IDX` int(11) NOT NULL,
  PRIMARY KEY (`CD_ID`,`COLUMN_NAME`),
  KEY `COLUMNS_V2_N49` (`CD_ID`),
  CONSTRAINT `COLUMNS_V2_FK1` FOREIGN KEY (`CD_ID`) REFERENCES `cds` (`CD_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1
1 row in set (0.00 sec)

ERROR: 
No query specified
mysql> show create table table_params \G;
*************************** 1. row ***************************
       Table: table_params
Create Table: CREATE TABLE `table_params` (
  `TBL_ID` bigint(20) NOT NULL,
  `PARAM_KEY` varchar(256) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `PARAM_VALUE` mediumtext CHARACTER SET latin1 COLLATE latin1_bin,
  PRIMARY KEY (`TBL_ID`,`PARAM_KEY`),
  KEY `TABLE_PARAMS_N49` (`TBL_ID`),
  CONSTRAINT `TABLE_PARAMS_FK1` FOREIGN KEY (`TBL_ID`) REFERENCES `tbls` (`TBL_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1
1 row in set (0.00 sec)

ERROR: 
No query specified
```

- 解决注释乱码

修改注释在MySQL的元数据表编码：

```sql
# 修改注释元数据表字段编码
alter table columns_v2 modify column comment varchar(256) character set utf8mb4 collate utf8mb4_unicode_ci;
alter table table_params modify column param_value mediumtext character set utf8mb4 collate utf8mb4_unicode_ci;

# 如果你的表创建了分区，还需要再执行两条命令：
alter table partition_params modify column param_value varchar(4000) character set utf8mb4 collate utf8mb4_unicode_ci;
alter table partition_keys modify column pkey_comment varchar(4000) character set utf8mb4 collate utf8mb4_unicode_ci;
```

重建表即可！

### 3.2.7、删除表

- 删除表

```sql
hive (default)> drop table t2;
```

### 3.2.8、指定列和行的分隔符

**hive数据的默认行分隔符是换行符`\n`，默认的列分隔符是`\001`，在linux输入是Ctrl+V和Ctrl+A等效于`\001`**

- 创建一张表

```sql
create table t3(
id int comment 'ID',
stu_name string comment 'name',
stu_birthday date comment 'birthday',
online boolean comment 'is online'
);
```

- 加载数据

```sql
hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/t3.data' into table t3;
hive (default)> select * from t3;
# 命令行输出
OK
t3.id	t3.stu_name	t3.stu_birthday	t3.online
NULL	NULL	NULL	NULL
NULL	NULL	NULL	NULL
NULL	NULL	NULL	NULL
Time taken: 0.139 seconds, Fetched: 3 row(s)
```

发现都是空数据，查看t3.data数据：

```bash
$ cat -A /home/emon/bigdata/hive/data/hivedata/t3.data 
1^IM-eM-<M- M-dM-8M-^I^I2020-01-01^Itrue$
2^IM-fM-^]M-^NM-eM-^[M-^[^I2020-02-01^Ifalse$
3^IM-gM-^NM-^KM-dM-:M-^T^I2020-03-01^I0$
```

并不是列的默认分隔符`\001`。

- 方法一：调整数据使用`\001`分隔数据，再次加载数据即可！
- 方法二：调整建表语句，指定表的列分隔符

```sql
create table t3_new(
id int comment 'ID',
stu_name string comment 'name',
stu_birthday date comment 'birthday',
online boolean comment 'is online'
) row format delimited 
fields terminated by '\t' 
lines terminated by '\n';
```

导入数据并验证：

```sql
hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/t3.data' into table t3_new;
hive (default)> select * from t3_new;
# 命令行输出
OK
t3_new.id	t3_new.stu_name	t3_new.stu_birthday	t3_new.online
1	张三	2020-01-01	true
2	李四	2020-02-01	false
3	王五	2020-03-01	NULL
Time taken: 0.111 seconds, Fetched: 3 row(s)
```

## 3.3、Hive中的数据类型
