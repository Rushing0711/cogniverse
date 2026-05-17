# 第4章 Hive数据类型


- 基本数据类型：常用的有INT，STRING，BOOLEAN，DOUBLE等
- 复合数据类型：常用的有ARRAY，MAP，STRUCT等

### 4.1、基本数据类型

| 数据类型    | 开始支持版本 | 数据类型  | 开始支持版本 |
| ----------- | ------------ | --------- | ------------ |
| TINYINT     | ~            | TIMESTAMP | 0.8.0        |
| SMALLINT    | ~            | DATE      | 0.12.0       |
| INT/INTEGER | ~            | STRING    | ~            |
| BIGINT      | ~            | VARCHAR   | 0.12.0       |
| FLOAT       | ~            | CHAR      | 0.13.0       |
| DOUBLE      | ~            | BOOLEAN   | ~            |
| DECIMAL     | 0.11.0       |           |              |
|             |              |           |              |

### 4.2、复合数据类型

| 数据类型 | 开始支持版本 | 格式                             |
| -------- | ------------ | -------------------------------- |
| ARRAY    | 0.14.0       | ARRAY<data_type>                 |
| MAP      | 0.14.0       | MAP<primitive_type,data_type>    |
| STRUCT   | ~            | STRUCT<col_name : data_type,...> |
|          |              |                                  |

### 4.3、案例：复合数据类型的使用

#### 4.3.1、使用ARRAY字段存储用户的兴趣爱好

- 创建数据表

```sql
create table stu(
id int,
name string,
favors array<string>
) row format delimited 
fields terminated by '\t'
collection items terminated by ','
lines terminated by '\n';
```

- 加载数据

```sql
hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/stu.data' into table stu;
```

- 查询数据

```sql
hive (default)> select id,name,favors[0] from stu;
```

#### 4.3.2、使用MAP字段存储学生考试成绩

- 创建数据表

```sql
create table stu2(
id int,
name string,
scores map<string,int>
) row format delimited 
fields terminated by '\t'
collection items terminated by ','
map keys terminated by ':'
lines terminated by '\n';
```

- 加载数据

```sql
hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/stu2.data' into table stu2;
```

- 查询数据

```sql
hive (default)> select id,name,scores['chinese'] as ch_score,scores['math'] math_score from stu2;
```

#### 4.3.3、使用STRUCT字段存储学生地址信息

- 创建数据表

```sql
create table stu3(
id int,
name string,
address struct<home_addr:string,office_addr:string>
) row format delimited 
fields terminated by '\t'
collection items terminated by ','
lines terminated by '\n';
```

- 加载数据

```sql
hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/stu3.data' into table stu3;
```

- 查询数据

```sql
hive (default)> select id,name,address.home_addr,address.office_addr from stu3;
```

#### 4.3.4、三种复合类型结合使用

- 创建数据表

```sql
create table student(
id int comment 'id',
name string comment 'name',
favors array<string>,
scores map<string, int>,
address struct<home_addr:string,office_addr:string>
) row format delimited 
fields terminated by '\t'
collection items terminated by ','
map keys terminated by ':'
lines terminated by '\n';
```

- 加载数据

```sql
hive (default)> load data local inpath '/home/emon/bigdata/hive/data/hivedata/student.data' into table student;
```

- 查询数据

```sql
hive (default)> select id,name,favors[0],scores['chinese'],address.home_addr,address.office_addr from student;
```

## 4.4、Hive中的表类型
