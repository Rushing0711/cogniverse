# 第10章 MongoDB管理工具


## 10.1、安装Database Tools

安装文件下载地址：[Linux版Database Tools](https://docs.mongodb.com/database-tools/installation/installation/)

下载版本选择页面：https://www.mongodb.com/try/download/database-tools?tck=docs_databasetools

使用文档：https://docs.mongodb.com/database-tools/

- 下载

```bash
$ wget -cP /usr/local/src/ https://fastdl.mongodb.org/tools/db/mongodb-database-tools-rhel70-x86_64-100.3.0.tgz
```

- 安装目录创建

说明：使用之前的安装目录。

- 解压安装

```bash
$ tar -zxvf /usr/local/src/mongodb-database-tools-rhel70-x86_64-100.3.0.tgz -C /usr/local/MongoDB/
```

- 创建软连接

```bash
$ ln -s /usr/local/MongoDB/mongodb-database-tools-rhel70-x86_64-100.3.0/ /usr/local/mongodbtools
```

- 配置环境变量

修改mongodb的环境变量文件，如下：

```bash
$ sudo vim /etc/profile.d/mongodb.sh 
export PATH=/usr/local/mongodb/bin:/usr/local/mongodbtools/bin:$PATH
```

使之生效：

```bash
$ source /etc/profile
```



**说明**：数据库管理工具提供的命令，需要在系统命令行下执行，而不是`mongo` shell下执行。



## 10.2、明文格式导入导出

### 10.2.1、`mongoexport`导出

**导出所用的用户，必须拥有read权限**

语法格式：

```bash
mongoexport --collection=<coll> `<options>` <connection-string>
```

- 导出CSV格式

```bash
$ mongoexport --db test --collection accounts --type=csv --fields name,balance --out /usr/local/mongodb/bak/accounts.csv -u readUser -p passwd --authenticationDatabase admin
```

> `--authenticationDatabase admin`：表示用户readUser的验证需要在admin这个数据库，如果`-p`指定的用户和`--db`指定的数据库归属一致，可省略该选项。
>
> `--fields`必须被指定，导出结果仅包含--fields指定的字段

- 导出JSON格式，指定`--fields`

```bash
$ mongoexport --db test --collection accounts --type=json --fields name,balance --out /usr/local/mongodb/bak/accounts.json -u readUser -p passwd --authenticationDatabase admin
```

> `--fields`可用不指定；如果指定，哪怕--fields不指定`_id`，仍会包含`_id`字段

- 导出JSON格式，不指定`--fields`

```bash
$ mongoexport --db test --collection accounts --type=json --out /usr/local/mongodb/bak/accounts.json -u readUser -p passwd --authenticationDatabase admin
```

- 导出JSON格式，指定`--query`

```bash
$ mongoexport --db test --collection accounts --type=json --out /usr/local/mongodb/bak/accounts.json -u readUser -p passwd --authenticationDatabase admin --query '{"balance":{"$gte":100}}'
```

- 导出JSON格式，指定--host和--port

```bash
$ mongoexport --db test --collection accounts --type=json --out /usr/local/mongodb/bak/accounts.json -u readUser -p passwd --authenticationDatabase admin --query '{"balance":{"$gte":100}}' --host emon --port 27017
```

> 其他的参数：
> --limit
>
> --skip
>
> --sort

- 导出JSON格式，指定限制

```bash
$ mongoexport --db test --collection accounts --type=json --out /usr/local/mongodb/bak/accounts.json -u readUser -p passwd --authenticationDatabase admin --limit 2 --skip 1
```

### 10.2.2、`mongoimport`导入

**导出所用的用户，必须拥有readWrite权限，比如：readWriteAnyDatabase**

- 导入CSV文件

```bash
$ mongoimport --db test --collection importAccounts --type csv --headerline --file /usr/local/mongodb/bak/accounts.csv -u writeUser -p passwd --authenticationDatabase admin
```

> --headerline：指定第一行为标题行

- 查看导入文档

```bash
$ mongo -u readUser -p  passwd --authenticationDatabase admin  --quiet --eval 'db.importAccounts.find()'
```

- 导入CSV文件，导入之前drop集合

```bash
$ mongoimport --db test --collection importAccounts --type csv --headerline --file /usr/local/mongodb/bak/accounts.csv --drop -u writeUser -p passwd --authenticationDatabase admin
```

- 导入CSV文件，自定义header

```bash
$ mongoimport --db test --collection importAccounts --type csv --fields im_name,im_balance --file /usr/local/mongodb/bak/accounts.csv -u writeUser -p passwd --authenticationDatabase admin
```

> 注意：--fields和--headerline只能二选一，所以，如果使用--fields时，要去掉csv文件首行的标题头

- 导入CSV文件，多次导入时执行更新

```bash
$ mongoimport --db test --collection importAccounts --type csv --headerline --file /usr/local/mongodb/bak/accounts.csv --drop -u writeUser -p passwd --authenticationDatabase admin --upsetFields name,balance
```

> 导入时，默认按照主键对比重复数据，如果指定了--upsetFields会按照指定字段去对比。

- 导入JSON文件，指定去重字段

```bash
$ mongoimport --db test --collection importAccounts --type json --file /usr/local/mongodb/bak/accounts.json -u writeUser -p passwd --authenticationDatabase admin --authenticationDatabase admin --upsetFields name,balance
```

> 导入时，默认按照主键对比重复数据，如果指定了--upsetFields会按照指定字段去对比。

- 导入JSON文件，默认导入

```bash
$ mongoimport --db test --collection importAccounts --type json --file /usr/local/mongodb/bak/accounts.json -u writeUser -p passwd --authenticationDatabase admin
```

- 导入JSON文件，碰到错误就停止，指定导入顺序

```bash
$ mongoimport --db test --collection importAccounts --type json --file /usr/local/mongodb/bak/accounts.json -u writeUser -p passwd --authenticationDatabase admin --stopOnError --maintainInsertionOrder
```

## 10.3、二进制格式导入导出

## 10.4、显示数据库服务器进程状态：mongostat

**需要对操作的数据库具备`clusterMonitor`角色的权限**

- 默认监控

```bash
$ mongostat --host localhost --port 27017 -u monitorUser -p passwd --authenticationDatabase admin
# 命令行输出
insert query update delete getmore command dirty used flushes vsize  res qrw arw net_in net_out conn  set repl                time
    *0    *0     *0     *0       0     1|0  0.0% 1.8%       0 2.28G 492M 0|0 1|0   266b   43.6k   26 emon  PRI Feb 28 16:51:13.387
```

说明：

command： 每秒执行的命令数

dirty,used：数据库引擎缓存的使用量和百分比

vsize：虚拟内存使用量（MB）

res：常驻内存使用量（MB）

conn：连接数

- 指定监控刷新频率

```bash
# 指定3秒一次
$ mongostat --host localhost --port 27017 -u monitorUser -p passwd --authenticationDatabase admin 3
```

- 指定监控刷新次数和频率

```bash
$ mongostat --host localhost --port 27017 -u monitorUser -p passwd --authenticationDatabase admin --rowcount 5 3
```

- 指定关注的状态

```bash
$ mongostat --host localhost --port 27017 -u monitorUser -p passwd --authenticationDatabase admin --rowcount 5 3 -o "command,dirty,used,vsize,res,conn,time"
```

## 10.5、显示各个集合上的读写时间：mongotop

**需要对操作的数据库具备`clusterMonitor`角色的权限**

- 默认统计

```bash
$ mongotop --host localhost --port 27017 -u monitorUser -p passwd --authenticationDatabase admin
```

- 指定监控刷新频率

```bash
$ mongotop --host localhost --port 27017 -u monitorUser -p passwd --authenticationDatabase admin 3
```

- 指定监控刷新次数和频率

```bash
$ mongotop --host localhost --port 27017 -u monitorUser -p passwd --authenticationDatabase admin --rowcount 5 3
```



