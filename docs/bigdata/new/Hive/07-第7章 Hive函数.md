# 第7章 Hive函数


和MySQL一样，hive也是一个主要做统计的工具，所以为了满足各种各样的统计需要，他也内置了相当多的函数。

## 7.1、函数的基本操作

- 查看所有内置函数

```sql
hive (default)> show functions;
```

- 查看指定函数信息

```sql
hive (default)> desc function get_json_object;
```

- 查看指定函数扩展信息

```sql
hive (default)> desc function extended get_json_object;
```

## 7.2、Hive高级函数应用

MySQL中支持的函数这里面大部分都支持，并且hive支持的函数比MySQL还要多，在这里我们主要挑几个典型的说一下。

### 7.2.1、分组排序取TopN

一个典型的应用场景，分组排序取TopN操作。

主要需要使用到`ROW_NUMBER()`和`OVER()`函数。

`row_number`和`over`函数通常搭配在一起使用，`row_number`会对数据编号，编号从1开始，`over`可以理解为把数据划分到一个窗口内，里面可以加上`partition by`，表示按照字段对数据进行分组，还可以加上`order by`表示对每个分组内的数据按照某个字段进行排序。

需求：有一份学生的考试分数信息，语文、数学、英语这三门，需要计算出班级中单科排名前三名的学生的姓名。

基础数据是这样的：

```bash
$ more /home/emon/bigdata/hive/data/hivedata/student_score.data 
1	zs1	chinese	80
2	zs1	math	90
3	zs1	english	89
4	zs2	chinese	60
5	zs2	math	75
6	zs2	english	80
7	zs3	chinese	79
8	zs3	math	83
9	zs3	english	72
10	zs4	chinese	90
11	zs4	math	76
12	zs4	english	80
13	zs5	chinese	98
14	zs5	math	80
15	zs5	english	70
```

- 创建表

```sql
create external table student_score(
id int,
name string,
sub string,
score int
)row format delimited 
fields terminated by '\t'
location '/user/hive/data/student_score';
```

- 上传数据

```bash
$ hdfs dfs -put /home/emon/bigdata/hive/data/hivedata/student_score.data /user/hive/data/student_score
```

- 查询数据

```sql
hive (default)> select * from student_score;
```

- 查询数据基于row_number和over函数：正常排序

```sql
hive (default)> select *,row_number() over() from student_score;
```

- 按照科目分组后排序显示：正常排序

```sql
hive (default)> select *,row_number() over(partition by sub order by score desc) as num from student_score;
```

- 按照科目分组后排序显示前3名：score相同时也会有明显的排序序号

```sql
select * from (
select *,row_number() over(partition by sub order by score desc) as num from student_score
) s where s.num<=3;
```

- 利用rank函数：score相同时具有相同的排序序号，会出现 1-2-2-4这种排名

```sql
select *,rank() over(partition by sub order by score desc) as num from student_score;
```

- 利用dense_rank函数：score相同时具有相同的排序序号，会出现 1-2-2-3这种排名

```sql
select *,dense_rank() over(partition by sub order by score desc) as num from student_score;
```

### 4.2.2、行转列

行转列就是把多行数据转为一列数据。

针对行转列这种需求，主要需要使用到`CONCAT_WS()`、`COLLECT_SET()`、`COLLECT_LIST()`函数。

- CONCAT_WS()

该函数可以实现根据指定的分隔符拼接多个字段的值，最终转化为一个带有分隔符的字符串，它可以接收多个参数，第一个参数是分隔符，后面的参数可以是字符串或者字符串数组，最终就是使用分隔符把后面的所有字符串拼接到一块。

- COLLECT_LIST()

该函数可以返回一个list集合，集合中的元素会重复，一般和group by结合在一起使用。

- COLLECT_SET()

该函数可以返回一个set集合，集合中的元素不重复，一般和group by结合在一起使用。

需求：行转列

- 原始数据

```bash
$ more /home/emon/bigdata/hive/data/hivedata/student_favors.data 
zs	swing
zs	footbal
zs	sing
zs	codeing
zs	swing
```

- 期望结果

```bash
zs	swing,footbal,sing,codeing,swing
```

- 创建表

```sql
create external table student_favors(
name string,
favor string
)row format delimited
fields terminated by '\t'
location '/user/hive/data/student_favors';
```

- 上传数据

```bash
$ hdfs dfs -put /home/emon/bigdata/hive/data/hivedata/student_favors.data /user/hive/data/student_favors
```

- 查询数据

```sql
hive (default)> select * from student_favors;
```

- 按用户分组对兴趣聚合，得到兴趣数组

```sql
hive (default)> select name, collect_list(favor) as favor_list from student_favors group by name;
```

- 按用户分组对兴趣聚合，得到兴趣字符串

```sql
hive (default)> select name, concat_ws(',',collect_list(favor)) as favor_list from student_favors group by name;
```

- 按用户分组对兴趣聚合，得到去重的兴趣字符串

```sql
hive (default)> select name, concat_ws(',',collect_set(favor)) as favor_list from student_favors group by name;
```



### 4.2.3、列转行

列转行是和刚才的行转列反着来的，列转行可以把一列数据转成多行。

主要使用到`SPLIT()`、`EXPLODE()`和`LATERAL VIEW`

- SPLIT()

split函数，接受一个字符串和切割规则，就类似于java中的split函数，使用切割规则对字符串中的数据进行切割，最终返回一个array数组。

- EXPLODE()

explode函数可以接受array或者map

explode(ARRAY)：表示把数组中的每个元素转成一行

explode(MAP)：表示把map中的每个key-value对，转成一行，key为一列，value为一列

- LATERAL VIEW

Lateral view通常和split，explode等函数一起使用。

split可以对表中的某一列进行切割，返回一个数组类型的字段，explode可以对这个数组中的每一个元素转为一行，lateral view可以对这份数据产生一个支持别名的虚拟表。

- 原始数据

```bash
$ more /home/emon/bigdata/hive/data/hivedata/student_favors_2.data 
zs	swing,footbal,sing
ls	codeing,swing
```

- 期望结果

```bash
zs	swing
zs	footbal
zs	sing
ls	codeing
ls	swing
```

- 创建表

```sql
create external table student_favors_2(
name string,
favorlist string
)row format delimited
fields terminated by '\t'
location '/user/hive/data/student_favors_2';
```

- 上传数据

```bash
$ hdfs dfs -put /home/emon/bigdata/hive/data/hivedata/student_favors_2.data /user/hive/data/student_favors_2
```

- 查询数据

```sql
hive (default)> select * from student_favors_2;
```

- split切割兴趣列表，生成数组

```sql
hive (default)> select split(favorlist, ',') from student_favors_2;
```

- split切割兴趣列表，生成数组，再转成多行

```sql
hive (default)> select explode(split(favorlist, ',')) from student_favors_2;
```

- split切割兴趣列表，生成数组，再转成多行，生成表

```sql
hive (default)> select name, favor_new from student_favors_2 lateral view explode(split(favorlist, ',')) table1 as favor_new;
```

### 4.2.4、Hive排序相关函数

- ORDER BY

Hive中的order by跟传统的sql语言中的order by作用是一样的，会对查询的结果做一次全局排序，使用这个语句的时候生成的reduce任务只有一个。

- SORT BY

Hive中指定了sort by，如果有多个reduce，那么在每个reducer端都会做排序，也就是说保证了局部有序（每个reducer出来的数据是有序的，但是不能保证所有的数据是全局有序的，除非只有一个reducer）。

```sql
hive (default)> set mapreduce.job.reduces=2;
hive (default)> select id from t2_bak sort by id;
# 命令行输出结果
......
id
1
3
4
5
2
```

- DISTRIBUTE BY

distribute by：只会根据指定的key对数据进行分区，但是不会排序。

一般情况下可以和sort by结合使用，先对数据分区，再进行排序。

两者结合使用的时候distribute by必须要写在sort by之前。

```sql
hive (default)> select id from t2_bak distribute by id;
hive (default)> select id from t2_bak distribute by id sort by id;
hive (default)> select id from t2_bak distribute by id sort by id desc;
```

- CLUSTER BY

cluster by的功能就是distribute by和sort by的简写形式

也就是`cluster by id`等于`distribute by id sort by id`。

**注意**：被cluster by指定的列只能是升序，不能指定asc和desc

```sql
hive (default)> set mapreduce.job.reduces=2;
hive (default)> select id from t2_bak cluster by id;
```



### 4.2.5、Hive的分组和去重函数

- GROUP BY：对数据按照指定字段进行分组
- DISTINCT：对数据中指定字段的重复值进行去重

统计order表中name去重之后的数据量。

```sql
# 第一种：使用distinct会将所有的name都shuffle到一个reducer里面，性能较低
select count(distinct name) from order;
# 第二种：先对name分组，因为分组的同时其实就是去重，此时是可以并行计算的，然后再计算count(name)
select count(tmp.name) from (select name from order group by name) tmp;
```

### 4.2.6、一个SQL语句分析：解决数据倾斜

```sql
select a.key, sum(a.cnt) as cnt
from (
    select key, count(*) as cnt from tablename group by key,
    case when key='key001' then hash(random()) %50 else 0 end
) a
group by a.key;
```



