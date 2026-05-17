# 第7章 MySQL配置文件详解

## 7.1、`my.cnf`常规配置项

```
[client]
port = 3306
socket = /usr/local/mysql/run/mysql.sock

[mysqld]
# MySQL服务的唯一编号 每个MySQL服务ID需唯一
server-id = 1
# 服务端口号 默认3306
port = 3306
# MySQL安装根目录
basedir = /usr/local/mysql
# MySQL数据文件所在位置
datadir = /usr/local/mysql/data
# 临时目录 比如load data infile会用到
tmpdir = /tmp
# 设置socket文件所在目录
socket = /usr/local/mysql/run/mysql.sock
# 主要用于MyISAM存储引擎，如果多台服务器连接一个数据库则建议注释下面内容
skip-external-locking
# 只能用IP地址查看客户端的登录，不用主机名
skip_name_resolve = 1
# 事务隔离级别，默认为可重复读，MySQL默认可重复读级别
transaction_isolation = READ-COMMITTED

# 数据库默认字符集，主流字符集支持一些特殊表情符号（特殊表情符号占用4个字节）
character-set-server = utf8mb4
# 数据库字符集对应一些排序等规则，注意要和character-set-server对应
collation-server = utf8mb4_unicode_ci
# 设置client链接MySQL时的字符集，防止乱码
init_connect='SET NAMES utf8mb4'

# 是否对sql语句大小写敏感，1表示不敏感
lower_case_table_names=1

# SQL数据包发送的大小，如果有BLOB对象建议修改成1G
max_allowed_packet = 512M
# 最大连接数
max_connections = 2048
# 最大错误连接数
max_connect_errors = 100
# 增加每个进程的可打开文件数量
open_files_limit = 65535

# TIMESTAMP如果没有显示声明NOT NULL，是否允许NULL值
explicit_defaults_for_timestamp = OFF

# MySQL连接闲置超过一定时间后（单位：秒）将会被强制关闭
# MySQL默认的wait_timeout值为8个小时，interactive_timeout参数需要同时配置才能生效
interactive_timeout = 28800
wait_timeout = 1800

# 内部内存临时表的最大值，比如大数据量的group by,order by时可能用到临时表，超过了这个值将写入磁盘，系统IO压力增大
tmp_table_size = 32M
max_heap_table_size = 32M

# 禁用MySQL的缓存查询结果集功能，后期根据业务情况测试决定是否开启，大部分情况下关闭下面两项
query_cache_type = 0
query_cache_size = 0
#========日志设置========
# 数据库错误日志文件
log-error = /usr/local/mysql/log/mysql_error.log

# 慢查询sql日志设置
slow_query_log = 1
slow_query_log_file = /usr/local/mysql/log/mysql_slow_query.log
# 慢查询执行的秒数，必须达到此值可悲记录
long_query_time = 5
# 检索的行数北徐达到此值才可被记为慢查询
min_examined_row_limit = 100

# 检查未使用到索引的sql
log_queries_not_using_indexes = 1
# 针对log_queries_not_using_indexes开启后，记录慢sql的频次、每分钟记录的条数
log_throttle_queries_not_using_indexes = 5

# 作为从库时生效，从库复制中如果有慢sql也将被记录
log_slow_slave_statements = 1

#========主从复制设置========
# 开启MySQL binlog功能
log-bin = /usr/local/mysql/binlogs/mysql-bin
# binlog记录内容的方式，记录被操作的每一行
binlog_format = ROW
# 对于binlog_format = ROW模式时，减少记录日志的内容，只记录受影响的列
binlog_row_image = minimal
# 主从之间server_id不能相同
server_id=1
# binlog过期清理时间
expire_logs_days = 7
# 每个日志文件大小
max_binlog_size = 100m
# binlog缓存大小
binlog_cache_size = 4m
# 最大binlog缓存大小
max_binlog_cache_size = 512m

# 作为从库时生效，想进行级联复制，则需要此参数
log_slave_updates
# 作为从库时生效，中继日志relay-log可以自我修复
relay_log_recovery = 1
# 作为从库时生效，主从复制时忽略的错误，避免slave端复制中断。如：1062错误是指一些主键重复，1032错误是因为主从数据库数据不一致
slave_skip_errors = ddl_exist_errors
# 值为null，表示限制mysqld不允许导入导出；值为/tmp/，限制mysqld的导入导出只能发生在/tmp/目录下；值为'',不对mysqld的导入导出限制；且注意该参数无法通过set global命令修改。
secure_file_priv = ''
```

**说明：**

- `binlog_format`的三种方式：

  - `statement`：基于SQL语句的复制（statement-based replication,SBR)

  ```
  每一条会修改数据的sql语句都会记录到binlog中。优点是并不需要记录每一条sql语句和每一行的数据变化，减少了binlog日志量，节约IO，提高性能；缺点是在某些情况下会导致master-slave中的数据不一致（如sleep()函数、last_insert_id()以及user-defined functions(udf)等会出现问题）。
  ```

  - `row`：基于行的复制（row-based replication,RBR）【5.7后的默认值，也是推荐值】

  ```
  不记录每条sql语句的上下文信息，仅需记录哪一条数据被修改了，修改成什么样了。而且不会出现某些特定情况下的存储过程、function或trigger的调用和触发无法被正确复制的问题。缺点是会产生大量的日志，尤其是alter table的时候回让日志暴涨。
  ```

  - `mixed`：混合模式的复制（mixed-based replication,MBR）

  ```
  以上两种模式的混合使用，一般的复制使用statement模式保存binlong，对于statement模式无法复制的操作使用row模式保存binlog，MySQL会根据执行的SQL语句选择日志保存方式。
  ```

- `binlog_row_image`的两种方式

  - `FULL`记录每一行变更【默认】
  - `minimal`只记录影像后的行【推荐】

- 如何校验binlog是否开启

```bash
mysql> show variables like 'log_bin';
mysql> show variables like 'binlog_format';
```

## 7.2、设置变量

### 7.2.1、设置全局变量

- 修改配置文件并重启MySQL【不推荐】

```shell
$ vim /data/mysql/etc/my.cnf 
$ sudo systemctl restart mysqld
```

- 在命令行里通过SET来设置，然后再修改参数文件

1. 命令行里设置

```sql
mysql> set global long_query_time = 5;
或者
mysql> set @@global.long_query_time = 5;
```

2. 查看是否生效

```sql
mysql> show global variables like 'long_query_time';
```

**如果查询时使用的是show variables的话, 会发现设置并没有生效, 除非重新登录再查看. 这是因为使用show variables的话就等同于使用show session variables, 查询的是会话变量, 只有使用show global variables查询的才是全局变量. 如果仅仅想修改会话变量的话, 可以使用类似set long_query_time=5;或者set session long_query_time=5;这样的语法.**

3. 修改配置文件

当前只是修改正在运行的MySQL实例配置，下次重启MySQL又会回到默认值，所以记得修改配置文件

```shell
$ vim /data/mysql/etc/my.cnf 
```

### 7.2.2、设置会话变量

如果要修改会话变量值，可以指定`session`或者`@@session`或者`@@`或者`local`或者`@@local`，或者什么都不使用。

1. 设置

```sql
mysql> set long_query_time = 1;
```

2. 查看

```sql
mysql> show variables like 'long_query_time';
```
