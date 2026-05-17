# 第5章 Hive表类型


### 5.1、内部表（受控表）

- Hive中的默认表类型，表数据默认存储在`warehouse`目录中。
- 在加载数据的过程中，实际数据会被移动到`warehouse`目录中。
- 删除表时，表中的数据和元数据将会被同时删除。

### 5.2、外部表

- 建表语句中包含`External`的表叫外部表。
- 外部表在加载数据的时候，实际数据并不会移动到`warehouse`目录中，只是与外部数据建立一个链接（映射关系）。
- 当删除一个外部表时，只删除元数据，不删除表中的数据，仅删除表和数据之间的链接。

#### 5.2.1、外部表示例

- 创建外部表：

```sql
# 如果不指定location，默认会在`warehouse`目录中
create external table external_table(
key string
)location '/user/hive/data/external';
```

- 加载数据：

```bash
hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/external_table.data' into table external_table;
```

- 查询数据：

```sql
hive (default)> select * from external_table;
```

- 删除表，验证外部表特性：元数据会被清理，但表数据不会被删除。

```sql
hive (default)> drop table external_table;
```

- 验证HDFS中数据存在：

```bash
$ hdfs dfs -ls -R /user/hive/data/external
```

- 验证MySQL中元数据被删除了：

```sql
mysql> select * from tbls where tbl_name='external_table' \G;
Empty set (0.00 sec)
```

#### 2.内部表与外部表转换

- 内部表转外部表

```sql
alter table tblName set tblproperties('external'='true')
```

- 外部表转内部表

```sql
alter table tblName set tblproperties('external'='false')
```

### 5.3、分区表

- 分区可以理解为分类，通过分区把不同类型数据放到不同目录。
- 分区的标准就是指定分区字段，分区字段可以有一个或多个。
- 分区表的意义在于优化查询，查询时尽量利用分区字段，如果不使用欧冠分区字段，就会全表扫描，最典型的一个场景就是把天作为分区字段，查询的时候指定天。

#### 1.内部分区表示例

- 创建表

```sql
create table partition_1(
id int,
name string
)partitioned by (dt string)
row format delimited 
fields terminated by '\t';
```

- 查看表基本信息

```sql
hive (default)> desc partition_1;
OK
col_name	data_type	comment
id                  	int                 	                    
name                	string              	                    
dt                  	string              	                    
	 	 
# Partition Information	 	 
# col_name            	data_type           	comment             
dt                  	string              	                    
Time taken: 0.058 seconds, Fetched: 7 row(s)
```

- 查看待加载数据

```bash
$ more /home/emon/bigdata/hive/data/hivedata/partition_1.data 
1	zhangsan
2	lisi
```

- 创建分区并加载数据

```sql
hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/partition_1.data' into table partition_1 partition(dt='20200101');
```

- 添加分区不加载数据

```sql
hive (default)> alter table partition_1 add partition(dt='20200102');
```

- 添加分区如果分区不存在

```sql
hive (default)> alter table partition_1 add if not exists partition(dt='20200102');
```

- 添加分区并指定数据

```bash
# location指定HDFS文件的相对路径或者绝对路径都可以
hive (default)> alter table partition_1 add if not exists partition(dt='20200102') location 'dt=20200102';
# 或者
hive (default)> alter table partition_1 add if not exists partition(dt='20200102') location '/user/hive/warehouse/partition_1/dt=20200102';
```

- 对已存在的分区加载数据

  - 方法1

  ```sql
  hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/partition_1.data' into table partition_1 partition(dt='20200102');
  ```

  - 方法2：通过HDFS命令直接put到`/user/hive/warehouse/partition_1/dt=20200102`目录下

- 查看当前分区表的分区详情

```sql
hive (default)> show partitions partition_1;
```

- 删除表的分区

```sql
hive (default)> alter table partition_1 drop partition(dt='20200102');
```

- 查看数据

```bash
hive (default)> select * from partition_1 where dt='20200101';
```

#### 2.多分区字段表

- 创建表

```sql
create table partition_2(
id int,
name string
)partitioned by (year int,school string)
row format delimited 
fields terminated by '\t';
```

- 查看表基本信息

```sql
hive (default)> desc partition_2;
OK
col_name	data_type	comment
id                  	int                 	                    
name                	string              	                    
year                	int                 	                    
school              	string              	                    
	 	 
# Partition Information	 	 
# col_name            	data_type           	comment             
year                	int                 	                    
school              	string              	                    
Time taken: 0.044 seconds, Fetched: 9 row(s)
```

- 查看待加载数据

```bash
$ more /home/emon/bigdata/hive/data/hivedata/partition_2.data 
1	zhangsan
2	lisi
3	wangwu
```

- 创建分区并加载数据

```sql
# 导入4份数据
hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/partition_2.data' into table partition_2 partition(year=2020,school='xk');
hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/partition_2.data' into table partition_2 partition(year=2020,school='english');
hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/partition_2.data' into table partition_2 partition(year=2019,school='xk');
hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/partition_2.data' into table partition_2 partition(year=2019,school='english');
```

- 查看当前分区表的分区详情

```sql
hive (default)> show partitions partition_2;
OK
partition
year=2019/school=english
year=2019/school=xk
year=2020/school=english
year=2020/school=xk
Time taken: 0.078 seconds, Fetched: 4 row(s)
```

- 查询

```sql
# 全表扫描
hive (default)> select * from partition_2;
# 指定1个分区字段
hive (default)> select * from partition_2 where year=2019;
# 指定2个分区字段
hive (default)> select * from partition_2 where year=2019 and school='xk';
```

#### 3.外部分区表

- 创建表

```sql
create external table ex_par(
id int,
name string
)partitioned by (dt string)
row format delimited 
fields terminated by '\t'
location '/user/hive/data/ex_par';
```

- 创建分区并加载数据

```sql
hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/ex_par.data' into table ex_par partition(dt='20200101');
```

- 删除分区

```sql
hive (default)> alter table ex_par drop partition(dt='20200101');
```

- 添加分区并指定HDFS文件路径

```sql
hive (default)> alter table ex_par add partition(dt='20200101') location '/user/hive/data/ex_par/dt=20200101';
```

- 基于现有hive表插入分区数据【特例，与上下文无关】

```sql
hive> insert overwrite table trackinfo_province_stat partition(day='2013-07-21')
select province,count(*) as cnt from trackinfo where day='2013-07-21' group by province;
```

### 3.4.4、桶表

桶表是对数据进行哈希取值，然后放到不同文件中存储。

物理上，每个桶就是表（或分区）里的一个文件。

什么时候会用到桶表呢？

举个例子，针对中国的人口，主要集中河南、江苏、山东、广东、四川，其他省份就少了多了，你像西藏就三四百万，海南也挺少的，如果使用分区表，我们把省份作为分区字段，数据会集中在某几个分区，其他分区数据就不会很多，那这样对数据存储以及查询不太友好，在计算的时候会出现数据倾斜的问题，计算效率也不高，我们应该相对均匀的存放数据，从源头上解决，这个时候我们就可以采用分桶的概念了，也就是使用桶表。

- 桶表的作用
  - 数据抽样
  - 提高某些查询效率，例如join

#### 1.桶表示例

- 创建表

```sql
create table bucket_tb(
id int
)clustered by (id) into 4 buckets;
```

- 加载数据

  - 创建普通表

  ```sql
  create table b_source(id int);
  ```

  - 先加载到普通表

  ```sql
  hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/b_source.data' into table b_source;
  ```

  - 开启桶操作

  ```bash
  hive (default)> set hive.enforce.bucketing=true;
  ```

  - 加载数据到桶表

  ```sql
  hive (default)> insert into table bucket_tb select id from b_source where id is not null;
  ```

- 查询

```sql
hive (default)> select * from bucket_tb;
```

- 抽样查询

语法`select * from bucket_tb tablesample(bucket x out of y on id);`，注意y>=x，y表示把通表中的数据随机分为多少桶，x表示取出第几桶的数据。y可以大于实际的桶数量，表示基于桶再分桶。

```sql
hive (default)> select * from bucket_tb tablesample(bucket 1 out of 4 on id);
```

### 3.4.5、视图

使用视图可以降低查询的复杂度。

- 创建视图

```sql
create view v1 as select id,stu_name from t3_new;
```

- 查看视图信息

```sql
hive (default)> desc v1;
```

- 查询数据

```sql
hive (default)> select * from v1;
```

- 删除视图

```sql
hive (default)> drop view v1;
```

## 3.5、综合案例：结合Flume与Hive
