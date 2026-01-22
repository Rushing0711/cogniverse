# 第90章 Docker上安装常用软件

[Docker 镜像源加速列表与使用指南](https://github.com/SeanChang/xuanyuan_docker_proxy?tab=readme-ov-file)

## 90.0 先决条件

- 关闭防火墙

```bash
$ systemctl stop firewalld
$ systemctl restart docker
```

::: tip

注意：关闭防火墙后，要重启docker才生效

:::

## 90.1 总体步骤

1. 搜索镜像 `docker search`
2. 拉取镜像 `docker pull`
3. 查看镜像 `docker images`
4. 启动镜像 `docker run image`
5. 停止容器 `docker stop <container id>`
6. 移除容器 `docker rm -v <container id>`

## 90.2 Tomcat

- 启动

```bash
$ docker run --name tomcat \
-p 8080:8080 -d tomcat:10.1.40-jre21
```

- 调整配置

```bash
$ docker exec -it tomcat cp -r webapps.dist/. webapps
```

- 访问

http://emon:8080/

## 90.3 MySQL

### 90.3.1 单机版

- 启动

```bash
$ docker run --name=mysql \
-e MYSQL_ROOT_HOST=%.%.%.% -e MYSQL_ROOT_PASSWORD=root123 \
-v /usr/local/dockerv/mysql/log:/var/log/mysql \
-v /usr/local/dockerv/mysql/data:/var/lib/mysql \
-v /usr/local/dockerv/mysql/conf:/etc/mysql \
-v /usr/local/dockerv/mysql/conf/conf.d:/etc/mysql/conf.d \
-p 3306:3306 -d mysql:8.4.5
```

::: info

查看所有可用选项的列表：

```bash
$ docker run -it --rm mysql:8.4.5 --verbose --help
```

:::

- 访问

```bash
$ docker exec -it mysql mysql -uroot -proot123
```

- 测试

```bash
mysql> show variables like 'character%';
mysql> create database docker;
mysql> CREATE TABLE docker.t_user \
( \
    `id`          bigint(20)    NOT NULL AUTO_INCREMENT, \
    `username`    varchar(255)  NOT NULL COMMENT '用户名', \
    PRIMARY KEY (`id`) USING BTREE \
) ENGINE = InnoDB \
  CHARACTER SET = utf8mb4 \
  COLLATE = utf8mb4_0900_ai_ci \
  ROW_FORMAT = Dynamic;
mysql> INSERT INTO docker.t_user (username) \
VALUES ('zhangsan'), \
       ('张三') \
;
```

### 90.3.2 主从版

::: tip

MySQL各个版本中配置主从复制的命令用法。

https://www.cnblogs.com/architectforest/p/18429705

:::

#### 90.3.2.1主

1：启动

```bash
# /usr/local/dockerv/mysql-master 目录会自动创建
$ docker run --name=mysql-master \
-e MYSQL_ROOT_HOST=%.%.%.% -e MYSQL_ROOT_PASSWORD=root123 \
-v /usr/local/dockerv/mysql-master/log:/var/log/mysql \
-v /usr/local/dockerv/mysql-master/data:/var/lib/mysql \
-v /usr/local/dockerv/mysql-master/conf:/etc/mysql \
-v /usr/local/dockerv/mysql-master/conf/conf.d:/etc/mysql/conf.d \
-p 3307:3306 -d mysql:8.4.5
```

2：配置

```bash
$ vim /usr/local/dockerv/mysql-master/conf/my.cnf
```

```bash
[client]
default-character-set='utf8'

[mysql]
default-character-set='utf8'

[mysqld]
init_connect='SET collation_connectioin=utf8_unicode_ci'
init_connect='SET NAMES utf8'
# 跳过DNS反向解析
skip-name-resolve

#========主从复制设置========
# 设置server_id，同一局域网中需要唯一
server_id=1
# 开启二进制日志功能
log-bin=mysql-bin
# 在主服务器上允许写入数据，仅对普通用户生效，若限制root请使用super_read_only
read_only=0
#设置使用的二进制日志格式（mixed,statement,row）
binlog_format=row
# 对于binlog_format = ROW模式时，减少记录日志的内容，只记录受影响的列
binlog_row_image=minimal
# 启用GTID（简化复制管理）
gtid_mode=ON
enforce_gtid_consistency=ON

#二进制日志过期清理时间。默认值为0，表示不自动清理。
binlog_expire_logs_seconds = 604800  # 7天 = 7*24*3600秒
# 每个日志文件大小
max_binlog_size=100m
# binlog缓存大小
binlog_cache_size=4m
# 最大binlog缓存大小
max_binlog_cache_size=512m

#指定不需要同步的数据库名称
binlog_ignore_db=information_schema
binlog_ignore_db=mysql
binlog_ignore_db=performance_schema
binlog_ignore_db=sys
```

3：重启

```bash
$ docker restart mysql-master
```

4：进入mysql-master容器

```bash
$ docker exec -it mysql-master /bin/bash
```

在mysql-master容器内创建数据同步用户。

```bash
bash-4.2# mysql -uroot -proot123
mysql> create user 'repl'@'%' identified by 'repl123';
mysql> grant replication slave, replication client on *.* to 'repl'@'%';
mysql> flush privileges;
# 查看主库用户信息
mysql> select host, user, plugin from mysql.user where user='repl';
+------+------+-----------------------+
| host | user | plugin                |
+------+------+-----------------------+
| %    | repl | caching_sha2_password |
+------+------+-----------------------+
1 row in set (0.01 sec)
mysql> show binary log status;
+------------------+----------+--------------+-------------------------------------------------+------------------------------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB                                | Executed_Gtid_Set                        |
+------------------+----------+--------------+-------------------------------------------------+------------------------------------------+
| mysql-bin.000001 |      879 |              | information_schema,mysql,performance_schema,sys | cd731a1a-2c16-11f0-83ad-0242ac110002:1-3 |
+------------------+----------+--------------+-------------------------------------------------+------------------------------------------+
1 row in set (0.00 sec)
```

#### 90.3.2.2从

1：启动

```bash
# /usr/local/dockerv/mysql-slave 目录会自动创建
$ docker run --name=mysql-slave \
-e MYSQL_ROOT_HOST=%.%.%.% -e MYSQL_ROOT_PASSWORD=root123 \
-v /usr/local/dockerv/mysql-slave/log:/var/log/mysql \
-v /usr/local/dockerv/mysql-slave/data:/var/lib/mysql \
-v /usr/local/dockerv/mysql-slave/conf:/etc/mysql \
-v /usr/local/dockerv/mysql-slave/conf/conf.d:/etc/mysql/conf.d \
-p 3317:3306 -d mysql:8.4.5
```

2：配置

```bash
$ vim /usr/local/dockerv/mysql-slave/conf/my.cnf
```

```bash
[client]
default-character-set='utf8'

[mysql]
default-character-set='utf8'

[mysqld]
init_connect='SET collation_connectioin=utf8_unicode_ci'
init_connect='SET NAMES utf8'
# 跳过DNS反向解析
skip-name-resolve

#========主从复制设置========
# 设置server_id，同一局域网中需要唯一
server_id=2
# 开启二进制日志功能
log-bin=mysql-bin
# 在从服务器上禁止任何用户写入任何数据，仅对普通用户生效，若限制root请使用super_read_only
read_only = 1
#设置使用的二进制日志格式（mixed,statement,row）
binlog_format=row
# 对于binlog_format = ROW模式时，减少记录日志的内容，只记录受影响的列
binlog_row_image=minimal
# 启用GTID（简化复制管理）
gtid_mode=ON
enforce_gtid_consistency=ON

#二进制日志过期清理时间。默认值为0，表示不自动清理。
binlog_expire_logs_seconds = 604800  # 7天 = 7*24*3600秒
# 每个日志文件大小
max_binlog_size=100m
# binlog缓存大小
binlog_cache_size=4m
# 最大binlog缓存大小
max_binlog_cache_size=512m

#指定不需要同步的数据库名称
replicate_ignore_db=information_schema
replicate_ignore_db=mysql
replicate_ignore_db=performance_schema
replicate_ignore_db=sys
relay_log=mysql-relay-bin
# 作为从库时生效，想进行级联复制，则需要此参数
log_slave_updates=on
```

3：重启

```bash
$ docker restart mysql-slave
```

4：进入mysql-slave容器

```bash
$ docker exec -it mysql-slave /bin/bash
```

5：在mysql-slave中配置主从复制

```bash
bash-4.2# mysql -uroot -proot123
# 注意：MASTER_LOG_FILE和MASTER_LOG_POS是在主库通过 show master status 得到的
mysql> change replication source to \
source_host='192.168.200.116', \
source_port=3307, \
source_user='repl', \
source_password='repl123', \
source_log_file='mysql-bin.000001', \
source_log_pos=879, \
source_ssl=1;
mysql> start replica;
mysql> show replica status \G
```

#### 90.3.2.3 验证

- 登录主容器

```bash
$ docker exec -it mysql-master /bin/bash
bash-4.2# mysql -uroot -proot123
mysql> create database db0;
mysql> use db0;
mysql> create table user(id int,name varchar(20),age tinyint);
mysql> insert into user values(1,'emon',28);
mysql> select * from user;
+------+------+------+
| id   | name | age  |
+------+------+------+
|    1 | emon |   28 |
+------+------+------+
1 row in set (0.00 sec)
```

- 登录从库

```bash
$ docker exec -it mysql-slave /bin/bash
bash-4.2# mysql -uroot -proot123
mysql> select * from db0.user;
+------+------+------+
| id   | name | age  |
+------+------+------+
|    1 | emon |   28 |
+------+------+------+
1 row in set (0.00 sec)
```



## 90.4 Redis

docker pull redis:7

### 90.4.1 单机版

- Redis配置文件下载地址：https://redis.io/docs/manual/config/

```bash
# 下载redis.conf
$ wget -cP /usr/local/dockerv/redis/ https://raw.githubusercontent.com/redis/redis/7.0/redis.conf
# 备份redis.conf
$ cp /usr/local/dockerv/redis/redis.conf /usr/local/dockerv/redis/redis.conf.bak
```

- 调整配置文件

```bash
$ vim /usr/local/dockerv/redis/redis.conf
```

```bash
# [修改]
bind 127.0.0.1 -::1
==>
bind 0.0.0.0 -::1
# [修改] 默认yes，开启保护模式，限制为本地访问
protected-mode yes
==>
protected-mode no
# [修改] 默认no，改为yes意为开启aof持久化
appendonly no
==>
appendonly yes
# [增加] 开启访问密码
requirepass redis123
```

- 启动

```bash
$ docker run --name=redis \
-v /usr/local/dockerv/redis/data:/data \
-v /usr/local/dockerv/redis/redis.conf:/etc/redis/redis.conf \
-p 6379:6379 -d redis:7.0 \
redis-server /etc/redis/redis.conf
```

- docker命令行访问

```bash
$ docker exec -it redis redis-cli
```

### 90.4.2 集群

#### 90.4.2.1 3主3从

3主3从方式，从为了同步备份，主进行slot数据分片。

![image-20240706090715349](images/image-20240706090715349.png)

- 循环部署6台独立节点

```bash
for port in $(seq 7001 7006); \
do \
mkdir -p /usr/local/dockerv/redis-cluster/node-${port}/conf
touch /usr/local/dockerv/redis-cluster/node-${port}/conf/redis.conf
cat << EOF > /usr/local/dockerv/redis-cluster/node-${port}/conf/redis.conf
port ${port}
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
cluster-announce-ip 192.168.200.116
cluster-announce-port ${port}
cluster-announce-bus-port 1${port}
appendonly yes
EOF
docker run --name redis-${port} \
	-v /usr/local/dockerv/redis-cluster/node-${port}/data:/data \
	-v /usr/local/dockerv/redis-cluster/node-${port}/conf/redis.conf:/etc/redis/redis.conf \
	-p ${port}:${port} -p 1${port}:1${port} \
	-d redis:7.0 redis-server /etc/redis/redis.conf; \
done
```

说明：

> cluster-config-file
>
> 每个集群节点都有一个集群配置文件。该文件不应手动编辑。它由 Redis 节点创建和更新。每个 Redis 集群节点都需要一个不同的集群配置文件。确保在同一系统中运行的实例不会具有重叠的集群配置文件名。集群配置文件 nodes-6379.conf
>
> cluster-node-timeout
>
> 集群节点超时是节点必须不可达多少毫秒才会被考虑为故障状态。大多数其他内部时间限制都是节点超时的倍数。集群节点超时 15000
>
> cluster-port
>
> 集群端口是集群总线监听传入连接的端口。设置为默认值 0 时，它将绑定到命令端口 + 10000。设置此值需要在执行 cluster meet 时指定集群总线端口。集群端口 0。
>
> 所以，在默认值 0 的情况下，总线监听端口就是 10000 + port
>
> cluster-announce-ip
>
> 指定节点在集群中**对外宣告的 IP 地址**，主要解决 Redis 集群在复杂网络环境（如容器化、云服务器、NAT 网络）中节点间通信和客户端连接的地址问题

- 建立集群

```bash
$ docker exec -it redis-7001 bash
> redis-cli --cluster create 192.168.200.116:7001 192.168.200.116:7002 192.168.200.116:7003 192.168.200.116:7004 192.168.200.116:7005 192.168.200.116:7006 --cluster-replicas 1
```

```bash
>>> Performing hash slots allocation on 6 nodes...
Master[0] -> Slots 0 - 5460
Master[1] -> Slots 5461 - 10922
Master[2] -> Slots 10923 - 16383
Adding replica 192.168.200.116:7005 to 192.168.200.116:7001
Adding replica 192.168.200.116:7006 to 192.168.200.116:7002
Adding replica 192.168.200.116:7004 to 192.168.200.116:7003
>>> Trying to optimize slaves allocation for anti-affinity
[WARNING] Some slaves are in the same host as their master
M: 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c 192.168.200.116:7001
   slots:[0-5460] (5461 slots) master
M: b205f6cd79e7d69105a99e870f1a61997790cdde 192.168.200.116:7002
   slots:[5461-10922] (5462 slots) master
M: 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6 192.168.200.116:7003
   slots:[10923-16383] (5461 slots) master
S: e29f25b1ad65f45278dde2eb2ceb2a4191184d06 192.168.200.116:7004
   replicates 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c
S: f9d3cf0e8f9fc1685644db5728fda74967db7708 192.168.200.116:7005
   replicates b205f6cd79e7d69105a99e870f1a61997790cdde
S: 30a813bb94a938e5b7745fffcc596e416793ca7a 192.168.200.116:7006
   replicates 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6
Can I set the above configuration? (type 'yes' to accept): yes
>>> Nodes configuration updated
>>> Assign a different config epoch to each node
>>> Sending CLUSTER MEET messages to join the cluster
Waiting for the cluster to join
.
>>> Performing Cluster Check (using node 192.168.200.116:7001)
M: 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c 192.168.200.116:7001
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
M: b205f6cd79e7d69105a99e870f1a61997790cdde 192.168.200.116:7002
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
S: 30a813bb94a938e5b7745fffcc596e416793ca7a 192.168.200.116:7006
   slots: (0 slots) slave
   replicates 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6
S: e29f25b1ad65f45278dde2eb2ceb2a4191184d06 192.168.200.116:7004
   slots: (0 slots) slave
   replicates 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c
S: f9d3cf0e8f9fc1685644db5728fda74967db7708 192.168.200.116:7005
   slots: (0 slots) slave
   replicates b205f6cd79e7d69105a99e870f1a61997790cdde
M: 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6 192.168.200.116:7003
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
```

- 访问集群

```bash
# 注意：参数 -c 表示集群访问
> redis-cli -c -h 192.168.200.116 -p 7001
192.168.200.116:7001> cluster info
cluster_state:ok
cluster_slots_assigned:16384
cluster_slots_ok:16384
cluster_slots_pfail:0
cluster_slots_fail:0
cluster_known_nodes:6
cluster_size:3
cluster_current_epoch:6
cluster_my_epoch:1
cluster_stats_messages_ping_sent:445
cluster_stats_messages_pong_sent:467
cluster_stats_messages_sent:912
cluster_stats_messages_ping_received:462
cluster_stats_messages_pong_received:445
cluster_stats_messages_meet_received:5
cluster_stats_messages_received:912
total_cluster_links_buffer_limit_exceeded:0

192.168.200.116:7001> cluster nodes
b205f6cd79e7d69105a99e870f1a61997790cdde 192.168.200.116:7002@17002 master - 0 1746745067253 2 connected 5461-10922
30a813bb94a938e5b7745fffcc596e416793ca7a 192.168.200.116:7006@17006 slave 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6 0 1746745068267 3 connected
e29f25b1ad65f45278dde2eb2ceb2a4191184d06 192.168.200.116:7004@17004 slave 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c 0 1746745068572 1 connected
2bb4b59da4339b5d8cce7a70646fe9d89e217b4c 192.168.200.116:7001@17001 myself,master - 0 1746745068000 1 connected 0-5460
f9d3cf0e8f9fc1685644db5728fda74967db7708 192.168.200.116:7005@17005 slave b205f6cd79e7d69105a99e870f1a61997790cdde 0 1746745067759 2 connected
1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6 192.168.200.116:7003@17003 master - 0 1746745066240 3 connected 10923-16383
```

- 检查集群

```bash
> redis-cli --cluster check 192.168.200.116:7001
```

```bash
192.168.200.116:7001 (2bb4b59d...) -> 0 keys | 5461 slots | 1 slaves.
192.168.200.116:7002 (b205f6cd...) -> 0 keys | 5462 slots | 1 slaves.
192.168.200.116:7003 (1f2eac0c...) -> 1 keys | 5461 slots | 1 slaves.
[OK] 1 keys in 3 masters.
0.00 keys per slot on average.
>>> Performing Cluster Check (using node 192.168.200.116:7001)
M: 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c 192.168.200.116:7001
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
M: b205f6cd79e7d69105a99e870f1a61997790cdde 192.168.200.116:7002
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
S: 30a813bb94a938e5b7745fffcc596e416793ca7a 192.168.200.116:7006
   slots: (0 slots) slave
   replicates 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6
S: e29f25b1ad65f45278dde2eb2ceb2a4191184d06 192.168.200.116:7004
   slots: (0 slots) slave
   replicates 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c
S: f9d3cf0e8f9fc1685644db5728fda74967db7708 192.168.200.116:7005
   slots: (0 slots) slave
   replicates b205f6cd79e7d69105a99e870f1a61997790cdde
M: 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6 192.168.200.116:7003
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
```

- 查看集群信息

```bash
> redis-cli --cluster info 192.168.200.116:7001
```

```bash
192.168.200.116:7001 (2bb4b59d...) -> 0 keys | 5461 slots | 1 slaves.
192.168.200.116:7002 (b205f6cd...) -> 0 keys | 5462 slots | 1 slaves.
192.168.200.116:7003 (1f2eac0c...) -> 1 keys | 5461 slots | 1 slaves.
[OK] 1 keys in 3 masters.
0.00 keys per slot on average.
```

- 停止删除

```bash
$ docker stop $(docker ps -a|grep redis-700|awk '{print $1}')
$ docker rm -v $(docker ps -a|grep redis-700|awk '{print $1}')
```

#### 90.4.2.2 扩容到4主4从

- 循环扩展2台节点

```bash
for port in $(seq 7007 7008); \
do \
mkdir -p /usr/local/dockerv/redis-cluster/node-${port}/conf
touch /usr/local/dockerv/redis-cluster/node-${port}/conf/redis.conf
cat << EOF > /usr/local/dockerv/redis-cluster/node-${port}/conf/redis.conf
port ${port}
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
cluster-announce-ip 192.168.200.116
cluster-announce-port ${port}
cluster-announce-bus-port 1${port}
appendonly yes
EOF
docker run --name redis-${port} \
	-v /usr/local/dockerv/redis-cluster/node-${port}/data:/data \
	-v /usr/local/dockerv/redis-cluster/node-${port}/conf/redis.conf:/etc/redis/redis.conf \
	-p ${port}:${port} -p 1${port}:1${port} \
	-d redis:7.0 redis-server /etc/redis/redis.conf; \
done
```

##### 添加主节点

- 将新增的其中一台节点添加到集群

```bash
> redis-cli --cluster add-node 192.168.200.116:7007 192.168.200.116:7001
```

```bash
>>> Adding node 192.168.200.116:7007 to cluster 192.168.200.116:7001
>>> Performing Cluster Check (using node 192.168.200.116:7001)
M: 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c 192.168.200.116:7001
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
S: 30a813bb94a938e5b7745fffcc596e416793ca7a 192.168.200.116:7006
   slots: (0 slots) slave
   replicates 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6
M: 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6 192.168.200.116:7003
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
M: b205f6cd79e7d69105a99e870f1a61997790cdde 192.168.200.116:7002
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
S: f9d3cf0e8f9fc1685644db5728fda74967db7708 192.168.200.116:7005
   slots: (0 slots) slave
   replicates b205f6cd79e7d69105a99e870f1a61997790cdde
S: e29f25b1ad65f45278dde2eb2ceb2a4191184d06 192.168.200.116:7004
   slots: (0 slots) slave
   replicates 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
>>> Getting functions from cluster
>>> Send FUNCTION LIST to 192.168.200.116:7007 to verify there is no functions in it
>>> Send FUNCTION RESTORE to 192.168.200.116:7007
>>> Send CLUSTER MEET to node 192.168.200.116:7007 to make it join the cluster.
[OK] New node added correctly.
```

:::info

说明：

```bash
  add-node       new_host:new_port existing_host:existing_port
                 --cluster-slave
                 --cluster-master-id <arg>
```

- **参数说明**：
  - `新节点IP:端口`：待加入的节点地址。
  - `集群已知节点IP:端口`：现有集群中的任意节点（如 7001）。

:::

- 分配主节点角色

新节点默认以**主节点**身份加入，但未分配哈希槽（不存储数据）。

```bash
> redis-cli --cluster reshard 192.168.200.116:7001
```

```bash
>>> Performing Cluster Check (using node 192.168.200.116:7001)
M: 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c 192.168.200.116:7001
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
S: 30a813bb94a938e5b7745fffcc596e416793ca7a 192.168.200.116:7006
   slots: (0 slots) slave
   replicates 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6
M: 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6 192.168.200.116:7003
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
M: b205f6cd79e7d69105a99e870f1a61997790cdde 192.168.200.116:7002
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
M: 4358f81dfc2fda759f01ff5dc32eb0c868c328ec 192.168.200.116:7007
   slots: (0 slots) master
S: f9d3cf0e8f9fc1685644db5728fda74967db7708 192.168.200.116:7005
   slots: (0 slots) slave
   replicates b205f6cd79e7d69105a99e870f1a61997790cdde
S: e29f25b1ad65f45278dde2eb2ceb2a4191184d06 192.168.200.116:7004
   slots: (0 slots) slave
   replicates 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
How many slots do you want to move (from 1 to 16384)? 4096 # 输入要移动的槽数量
What is the receiving node ID? 4358f81dfc2fda759f01ff5dc32eb0c868c328ec # 输入目标节点 ID（新主节点 7007 ID）
Please enter all the source node IDs.
  Type 'all' to use all the nodes as source nodes for the hash slots.
  Type 'done' once you entered all the source nodes IDs.
Source node #1: all # 输入源节点 ID（输入 all 从所有现有主节点平均迁移，或指定源节点 ID）
```

##### 添加从节点

- 将新增的另外一台节点添加到集群

```bash
# cluster-master-id 指定为 <7007节点的ID> 表示 7008 从属于 7007
> redis-cli --cluster add-node 192.168.200.116:7008 192.168.200.116:7007 --cluster-slave --cluster-master-id 4358f81dfc2fda759f01ff5dc32eb0c868c328ec
```

```bash
>>> Adding node 192.168.200.116:7008 to cluster 192.168.200.116:7007
>>> Performing Cluster Check (using node 192.168.200.116:7007)
M: 4358f81dfc2fda759f01ff5dc32eb0c868c328ec 192.168.200.116:7007
   slots:[0-1364],[5461-6826],[10923-12287] (4096 slots) master
S: e29f25b1ad65f45278dde2eb2ceb2a4191184d06 192.168.200.116:7004
   slots: (0 slots) slave
   replicates 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c
S: 30a813bb94a938e5b7745fffcc596e416793ca7a 192.168.200.116:7006
   slots: (0 slots) slave
   replicates 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6
M: 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6 192.168.200.116:7003
   slots:[12288-16383] (4096 slots) master
   1 additional replica(s)
M: 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c 192.168.200.116:7001
   slots:[1365-5460] (4096 slots) master
   1 additional replica(s)
M: b205f6cd79e7d69105a99e870f1a61997790cdde 192.168.200.116:7002
   slots:[6827-10922] (4096 slots) master
   1 additional replica(s)
S: f9d3cf0e8f9fc1685644db5728fda74967db7708 192.168.200.116:7005
   slots: (0 slots) slave
   replicates b205f6cd79e7d69105a99e870f1a61997790cdde
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
>>> Send CLUSTER MEET to node 192.168.200.116:7008 to make it join the cluster.
Waiting for the cluster to join

>>> Configure node as replica of 192.168.200.116:7007.
```

- 查看分配结果

```bash
> redis-cli --cluster check 192.168.200.116:7001
```

```bash
192.168.200.116:7001 (2bb4b59d...) -> 0 keys | 4096 slots | 1 slaves.
192.168.200.116:7003 (1f2eac0c...) -> 1 keys | 4096 slots | 1 slaves.
192.168.200.116:7002 (b205f6cd...) -> 0 keys | 4096 slots | 1 slaves.
192.168.200.116:7007 (4358f81d...) -> 0 keys | 4096 slots | 1 slaves.
[OK] 1 keys in 4 masters.
0.00 keys per slot on average.
>>> Performing Cluster Check (using node 192.168.200.116:7001)
M: 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c 192.168.200.116:7001
   slots:[1365-5460] (4096 slots) master
   1 additional replica(s)
S: 30a813bb94a938e5b7745fffcc596e416793ca7a 192.168.200.116:7006
   slots: (0 slots) slave
   replicates 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6
M: 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6 192.168.200.116:7003
   slots:[12288-16383] (4096 slots) master
   1 additional replica(s)
M: b205f6cd79e7d69105a99e870f1a61997790cdde 192.168.200.116:7002
   slots:[6827-10922] (4096 slots) master
   1 additional replica(s)
S: bd8f32b8883f9c3f8bf2b2720e2aea947bab5d67 192.168.200.116:7008
   slots: (0 slots) slave
   replicates 4358f81dfc2fda759f01ff5dc32eb0c868c328ec
M: 4358f81dfc2fda759f01ff5dc32eb0c868c328ec 192.168.200.116:7007
   slots:[0-1364],[5461-6826],[10923-12287] (4096 slots) master
   1 additional replica(s)
S: f9d3cf0e8f9fc1685644db5728fda74967db7708 192.168.200.116:7005
   slots: (0 slots) slave
   replicates b205f6cd79e7d69105a99e870f1a61997790cdde
S: e29f25b1ad65f45278dde2eb2ceb2a4191184d06 192.168.200.116:7004
   slots: (0 slots) slave
   replicates 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
```

#### 90.4.2.2 缩容到3主3从从

1. 删除从节点7008

```bash
> redis-cli --cluster del-node 192.168.200.116:7008 bd8f32b8883f9c3f8bf2b2720e2aea947bab5d67
```

2. 清空7007的哈希槽

```bash
> redis-cli --cluster reshard 192.168.200.116:7001
```

```bash
>>> Performing Cluster Check (using node 192.168.200.116:7001)
M: 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c 192.168.200.116:7001
   slots:[1365-5460] (4096 slots) master
   1 additional replica(s)
S: 30a813bb94a938e5b7745fffcc596e416793ca7a 192.168.200.116:7006
   slots: (0 slots) slave
   replicates 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6
M: 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6 192.168.200.116:7003
   slots:[12288-16383] (4096 slots) master
   1 additional replica(s)
M: b205f6cd79e7d69105a99e870f1a61997790cdde 192.168.200.116:7002
   slots:[6827-10922] (4096 slots) master
   1 additional replica(s)
M: 4358f81dfc2fda759f01ff5dc32eb0c868c328ec 192.168.200.116:7007
   slots:[0-1364],[5461-6826],[10923-12287] (4096 slots) master
S: f9d3cf0e8f9fc1685644db5728fda74967db7708 192.168.200.116:7005
   slots: (0 slots) slave
   replicates b205f6cd79e7d69105a99e870f1a61997790cdde
S: e29f25b1ad65f45278dde2eb2ceb2a4191184d06 192.168.200.116:7004
   slots: (0 slots) slave
   replicates 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
How many slots do you want to move (from 1 to 16384)? 4096 # 输入要移动的槽数量
What is the receiving node ID? 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c # 输入目标节点 ID（7001节点槽位增加）
Please enter all the source node IDs.
  Type 'all' to use all the nodes as source nodes for the hash slots.
  Type 'done' once you entered all the source nodes IDs.
Source node #1: 4358f81dfc2fda759f01ff5dc32eb0c868c328ec # 输入源节点 ID（7007拿出槽位）
Source node #2: done
```

3. 删除节点7007

```bash
> redis-cli --cluster del-node 192.168.200.116:7007 4358f81dfc2fda759f01ff5dc32eb0c868c328ec
```

4. 查看集群

```bash
> redis-cli --cluster del-node 192.168.200.116:7007 4358f81dfc2fda759f01ff5dc32eb0c868c328ec
```

```bash
>>> Removing node 4358f81dfc2fda759f01ff5dc32eb0c868c328ec from cluster 192.168.200.116:7007
>>> Sending CLUSTER FORGET messages to the cluster...
>>> Sending CLUSTER RESET SOFT to the deleted node.
root@1468fe6ab402:/data# redis-cli --cluster check 192.168.200.116:7001
192.168.200.116:7001 (2bb4b59d...) -> 0 keys | 8192 slots | 1 slaves.
192.168.200.116:7003 (1f2eac0c...) -> 1 keys | 4096 slots | 1 slaves.
192.168.200.116:7002 (b205f6cd...) -> 0 keys | 4096 slots | 1 slaves.
[OK] 1 keys in 3 masters.
0.00 keys per slot on average.
>>> Performing Cluster Check (using node 192.168.200.116:7001)
M: 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c 192.168.200.116:7001
   slots:[0-6826],[10923-12287] (8192 slots) master
   1 additional replica(s)
S: 30a813bb94a938e5b7745fffcc596e416793ca7a 192.168.200.116:7006
   slots: (0 slots) slave
   replicates 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6
M: 1f2eac0ca453580a7d9a406d1f82a42ff3d1ced6 192.168.200.116:7003
   slots:[12288-16383] (4096 slots) master
   1 additional replica(s)
M: b205f6cd79e7d69105a99e870f1a61997790cdde 192.168.200.116:7002
   slots:[6827-10922] (4096 slots) master
   1 additional replica(s)
S: f9d3cf0e8f9fc1685644db5728fda74967db7708 192.168.200.116:7005
   slots: (0 slots) slave
   replicates b205f6cd79e7d69105a99e870f1a61997790cdde
S: e29f25b1ad65f45278dde2eb2ceb2a4191184d06 192.168.200.116:7004
   slots: (0 slots) slave
   replicates 2bb4b59da4339b5d8cce7a70646fe9d89e217b4c
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
```









## 90.5 Zookeeper

### 90.5.1 单机版

- 启动

```bash
$ docker run --name zoo --restart always -p 2181:2181 -d zookeeper:3.6.3
```

- 连接

```bash
$ docker exec -it zoo zkCli.sh
# 退出
[zk: localhost:2181(CONNECTED) 0] quit
```

### zkui

- 制作镜像并启动

```bash
# 制作zkui镜像
$ mkdir /usr/local/zkui
$ cd /usr/local/zkui/
$ git clone https://github.com/DeemOpen/zkui.git
$ cd zkui
# 确保本地登录了docker hub
# 修改 vim Makefile 中 publish 一段
# ==================================
publish:
    docker tag $(NAME):$(VERSION) $(NAME):$(VERSION)
    docker tag $(NAME):$(VERSION) $(NAME):latest
    docker push $(NAME)
==>
HUB_NAME = rushing/zkui
publish:
    docker tag $(NAME):$(VERSION) $(HUB_NAME):$(VERSION)
    docker tag $(NAME):$(VERSION) $(HUB_NAME):latest
    docker push $(HUB_NAME):$(VERSION)
    docker push $(HUB_NAME)
# ==================================
$ make build
$ make publish


# admin/manager 读写账号；appconfig/appconfig 普通用户
$ docker run -d --name zkui -p 9090:9090 -e ZK_SERVER=192.168.200.116:2181 rushing/zkui-arm64
# 可查看实际配置
$ docker exec -it zkui /bin/bash
```

- 登录访问

http://emon:9090

## 90.6 xxl-job-admin【无arm版】

文档地址：https://www.xuxueli.com/xxl-job/

- 创建依赖数据库

脚本地址：https://github.com/xuxueli/xxl-job/blob/master/doc/db/tables_xxl_job.sql

指定版本脚本地址：https://github.com/xuxueli/xxl-job/blob/2.3.0/doc/db/tables_xxl_job.sql

- 启动

```bash
# 请确保先执行数据库脚本，创建了xxl_job库和表
# 如需自定义 mysql 等配置，可通过 "-e PARAMS" 指定，参数格式 PARAMS="--key=value  --key2=value2" ；
# 配置项参考文件：https://github.com/xuxueli/xxl-job/blob/master/xxl-job-admin/src/main/resources/application.properties
# 如需自定义 JVM内存参数 等配置，可通过 "-e JAVA_OPTS" 指定，参数格式 JAVA_OPTS="-Xmx512m" ；
$ docker run --name xxl-job-admin \
-e PARAMS="--spring.datasource.url=jdbc:mysql://192.168.200.116:3306/xxl_job?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai --spring.datasource.username=root --spring.datasource.password=root123" \
-v /usr/local/dockerv/xxl-job-admin:/data/applogs \
-p 8790:8080 -d xuxueli/xxl-job-admin:2.3.0
```

- 登录访问

http://emon:8790/xxl-job-admin

账号密码：

admin/123456



## 90.7 sentinel-dashboard【无arm版】

[Sentinel官网](https://sentinelguard.io/zh-cn/docs/introduction.html)

- 下载

```bash
$ mkdir /usr/local/sentinel-dashboard && cd /usr/local/sentinel-dashboard
# 备注：如下使用的不是官方版，因为官方默认不支持限流规则持久化！！！
# $ https://github.com/EmonCodingBackEnd/Sentinel-customized/tree/1.8.6.1
$ vim Dockerfile
```

```dockerfile
FROM openjdk:8-jre
MAINTAINER 问秋 liming2011071@163.com

COPY sentinel-dashboard.jar sentinel-dashboard.jar

ENTRYPOINT ["java", "-jar", "/sentinel-dashboard.jar"]
```

- 制作镜像

```bash
$ docker build -t rushing/sentinel-dashboard:1.8.6.1 .
$ docker push rushing/sentinel-dashboard:1.8.6.1
```

- 运行

启动时加入 JVM 参数 `-Dcsp.sentinel.dashboard.server=consoleIp:port` 指定nacos控制台地址和端口

```bash
$ docker run --name sentinel \
-e JAVA_TOOL_OPTIONS="-Dserver.port=8791 -Dcsp.sentinel.dashboard.server=localhost:8791 -Dproject.name=sentinel-dashboard -Dsentinel.datasource.provider=nacos -Dsentinel.datasource.nacos.server-addr=192.168.32.116:8848" \
-p 8791:8791 -d rushing/sentinel-dashboard:1.8.6.1
```

- 登录访问

http://repo.emon.vip:8791

账号密码：

sentinel/sentinel

也支持zookeeper：

```shell
$ docker run --name sentinel \
-e JAVA_TOOL_OPTIONS="-Dserver.port=8791 -Dcsp.sentinel.dashboard.server=localhost:8791 -Dproject.name=sentinel-dashboard -Dsentinel.datasource.provider=zk -Dsentinel.datasource.zk.server-addr=192.168.32.116:2181" \
-p 8791:8791 -d rushing/sentinel-dashboard:1.8.6.1
```



## 90.7 ElasticStack

### 90.7.1 Elasticsearch

- 创建目录

```bash
$ mkdir -pv /usr/local/dockerv/es/{config,data,plugins,software}
$ chmod -R 777 /usr/local/dockerv/es
```

- 配置

```bash
# 表示es可以被任何外部机器访问到
$ echo "http.host: 0.0.0.0">>/usr/local/dockerv/es/config/elasticsearch.yml
$ echo "network.host: 0.0.0.0">>/usr/local/dockerv/es/config/elasticsearch.yml
# ES启动时会去更新地图的一些数据库，这里直接禁掉即可
$ echo "ingest.geoip.downloader.enabled: false">>/usr/local/dockerv/es/config/elasticsearch.yml
```

- 创建网络（同一网络的services互相连接）

```bash
# 若挂起虚拟机再恢复后docker无法访问，方法1-可以使用bridge网络；方法2-让docker网络脱离NetworkManager的管控
$ docker network create esnet
```

- 启动

```bash
$ docker run --name es \
--privileged=true \
--network esnet \
-e "discovery.type=single-node" \
-e "ES_JAVA_OPTS=-Xms64m -Xmx256m" \
-v /usr/local/dockerv/es/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
-v /usr/local/dockerv/es/data:/usr/share/elasticsearch/data \
-v /usr/local/dockerv/es/plugins:/usr/share/elasticsearch/plugins \
-v /usr/local/dockerv/es/software:/usr/share/elasticsearch/software \
-p 9200:9200 -p 9300:9300 \
-d elasticsearch:7.17.18
```

- 浏览器打开

http://192.168.32.116:9200/

- 辅助命令

  - 如何进入容器内部？

  ```bash
  $ docker exec -it es /bin/bash
  ```

  - 查看日志

  ```bash
  # 追加查看日志
  $ docker logs -f es
  # 查看最近n条日志
  $ docker logs --tail n es
  ```

#### 90.7.1.1 安装ik分词器

- 安装

  - 方式一：直接安装（适用于网络好的情况）

  <span style="color:red;font-weight:bold;">缺点是ik的安装目录下config目录不存在，很致命！</span>

  ```bash
  # 进入容器
  $ docker exec -it es /bin/bash
  $ ./bin/elasticsearch-plugin install https://github.com/infinilabs/analysis-ik/releases/download/v7.17.18/elasticsearch-analysis-ik-7.17.18.zip
  ```

  - 方式二：先下载到本地再安装（适用于网络慢，直接安装容易断开的情况）

  <span style="color:red;font-weight:bold;">缺点是ik的安装目录下config目录不存在，很致命！</span>

  ```bash
  # 在挂载点目录下载【切记】不要下载到plugins文件夹下，因为从plugins安装会失败！！！
  $ wget -cP /usr/local/dockerv/es/software/ https://github.com/infinilabs/analysis-ik/releases/download/v7.17.18/elasticsearch-analysis-ik-7.17.18.zip
  
  # 进入容器
  $ docker exec -it es /bin/bash
  # 基于本地文件安装
  $ ./bin/elasticsearch-plugin install file:///usr/share/elasticsearch/software/elasticsearch-analysis-ik-7.17.18.zip
  ```

  - 方式三：解压安装（适用于网络慢，先下载安装包的情况）【推荐】

  ```bash
  # 在挂载点目录下载
  $ wget -cP /usr/local/dockerv/es/software/ https://github.com/infinilabs/analysis-ik/releases/download/v7.17.18/elasticsearch-analysis-ik-7.17.18.zip
  # 解压安装
  $ unzip /usr/local/dockerv/es/software/elasticsearch-analysis-ik-7.17.18.zip -d /usr/local/dockerv/es/plugins/analysis-ik
  ```

- 重启es

```bash
# 重启es
$ docker restart es
# 进入容器
$ docker exec -it es /bin/bash
# 查看已经安装过的插件
$ ./bin/elasticsearch-plugin list 
```

#### 90.7.1.2 配置自定义分词

- 启动一个nginx，访问路径： http://192.168.32.116/es/fenci.txt 能得到如下应答

```bash
# 请确保文件是utf-8编码
$ curl http://192.168.32.116/es/fenci.txt 
尚硅谷
乔碧萝
```

- 配置Ik自定义分词

```bash
# 打开并修改remote_ext_dict
$ vim /usr/local/dockerv/es/plugins/analysis-ik/config/IKAnalyzer.cfg.xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
    <comment>IK Analyzer 扩展配置</comment>
    <!--用户可以在这里配置自己的扩展字典 -->
    <entry key="ext_dict"></entry>
     <!--用户可以在这里配置自己的扩展停止词字典-->
    <entry key="ext_stopwords"></entry>
    <!--用户可以在这里配置远程扩展字典 -->
    <!-- <entry key="remote_ext_dict">words_location</entry> -->
    <entry key="remote_ext_dict">http://nginx/es/fenci.txt</entry>
    <!--用户可以在这里配置远程扩展停止词字典-->
    <!-- <entry key="remote_ext_stopwords">words_location</entry> -->
</properties>
```

- 重启es

```bash
# 重启es
$ docker restart es
```

说明：若自定义分词不生效，可以进入es容器，确认 `curl http://192.168.32.116/es/fenci.txt`和`curl http://nginx/es/fenci.txt`都可以被访问到。否则可能是网络问题导致es加载不到自定义的分词的原因。比如：一种可能的原因是`firewalld`是不是开启了。

### 90.7.2 Kibana

```bash
$ docker run --name kibana \
--network esnet \
-e "ELASTICSEARCH_HOSTS=http://es:9200" \
-p 5601:5601 \
-d kibana:7.17.18
```

- 浏览器打开

http://192.168.32.116:5601/

### 90.7.3 当虚拟机或者物理机异常关闭后导致kibana异常

问题描述：访问kibana得到“Kibana server is not ready yet”。

查看es日志：Search rejected due to missing shards

查看kibana日志：Waiting until all Elasticsearch nodes are compatible with Kibana before starting saved objects migrations..

- 查看索引得到：注意有一个red

```bash
$ curl http://localhost:9200/_cat/indices
```

```bash
yellow open bank                             vgdy5q9FRLWAo1QUTI-oUg 1 1 1000 0 374.6kb 374.6kb
green  open product                          GDPBVXuETleygS9koHMcmw 1 0  120 0  15.5kb  15.5kb
green  open .apm-custom-link                 TJgrFTfyRIGE9Y7JTIrpDA 1 0    0 0    227b    227b
red    open .kibana_task_manager_7.17.18_001 pJPl4akIQAerlSjxRbz6qg 1 0                       
green  open .apm-agent-configuration         VJuYHpDgQqmoW961-NGzDg 1 0    0 0    227b    227b
green  open newbank                          XCh5tktFQF6z8qjyOQLMDw 1 0 1000 0 250.8kb 250.8kb
green  open .kibana_7.17.18
_001              K-rZl6tSRUqlRsOUxjJVkA 1 0   53 0   2.3mb   2.3mb
green  open .tasks                           f4qBXYniQj-fjuRswFTviQ 1 0    8 0  48.7kb  48.7kb
```

解决方案：

1. 先停止kibana
2. 删除.kibana相关索引

```bash
$ curl -X DELETE http://localhost:9200/.kibana*
```

3. 启动kibana

### 90.7.4 Elasticsearch集群

![image-20240706142850608](images/image-20240706142850608.png)

- 配置

避免：

```bash
$ vim /etc/sysctl.conf
```

```bash
vm.max_map_count = 262144
```

- 创建网络

```bash
$ docker network create --driver bridge --subnet=172.19.12.0/16 --gateway=172.19.1.1 escluster
```

- 创建master节点

```bash
for port in $(seq 1 3); \
do \
mkdir -p /usr/local/dockerv/es-cluster/master-${port}/{config,data}
chmod -R 777 /usr/local/dockerv/es-cluster/master-${port}
cat << EOF > /usr/local/dockerv/es-cluster/master-${port}/config/elasticsearch.yml
cluster.name: es-cluster # 集群的名称，同一个集群该值必须设置成相同的
node.name: es-master-${port} # 该节点的名称
node.master: true # 该节点有机会成为master节点
node.data: false # 该节点是否可以存储数据
network.host: 0.0.0.0
http.host: 0.0.0.0 # 所有http均可访问
http.port: 920${port}
transport.tcp.port: 930${port}
# ES启动时会去更新地图的一些数据库，这里直接禁掉即可
ingest.geoip.downloader.enabled: false
# discovery.zen.minimum_master_nodes: 2 # 设置这个参数来保证集群中的节点可以知道其它N个有master资格的节点。官方推荐(N/2)+1，其中N是候选节点数量。
discovery.zen.ping_timeout: 10s # 设置集群中自动发现其他节点时ping连接的超时时间
discovery.seed_hosts: ["172.19.12.21:9301","172.19.12.22:9302","172.19.12.23:9303"] # 设置集群中的Master节点的初始列表，可以通过这些节点来自动发现其他新加入集群的节点，ES7的新增配置
cluster.initial_master_nodes: ["172.19.12.21"] # 新集群初始时的候选主节点的name或者ip，ES7的新增配置
EOF
docker run --name es-node-${port} \
--network=escluster --ip 172.19.12.2${port} \
-e "ES_JAVA_OPTS=-Xms300m -Xmx300m" \
-v /usr/local/dockerv/es-cluster/master-${port}/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
-v /usr/local/dockerv/es-cluster/master-${port}/data:/usr/share/elasticsearch/data \
-v /usr/local/dockerv/es-cluster/master-${port}/plugins:/usr/share/elasticsearch/plugins \
-v /usr/local/dockerv/es-cluster/master-${port}/software:/usr/share/elasticsearch/software \
-p 920${port}:920${port} -p 930${port}:930${port} \
-d elasticsearch:7.17.18
done
```

- 创建Node节点

```bash
for port in $(seq 4 6); \
do \
mkdir -p /usr/local/dockerv/es-cluster/node-${port}/{config,data}
chmod -R 777 /usr/local/dockerv/es-cluster/node-${port}
cat << EOF > /usr/local/dockerv/es-cluster/node-${port}/config/elasticsearch.yml
cluster.name: es-cluster # 集群的名称，同一个集群该值必须设置成相同的
node.name: es-node-${port} # 该节点的名称
node.master: false # 该节点有机会成为master节点
node.data: true # 该节点是否可以存储数据
network.host: 0.0.0.0
# network.publish_host: 192.168.32.116 # 互相通信ip，要设置为本机可被外界访问的ip，否则无法通信
http.host: 0.0.0.0 # 所有http均可访问
http.port: 920${port}
transport.tcp.port: 930${port}
# ES启动时会去更新地图的一些数据库，这里直接禁掉即可
ingest.geoip.downloader.enabled: false
# discovery.zen.minimum_master_nodes: 2 # 设置这个参数来保证集群中的节点可以知道其它N个有master资格的节点。官方推荐(N/2)+1，其中N是候选节点数量。
discovery.zen.ping_timeout: 10s # 设置集群中自动发现其他节点时ping连接的超时时间
discovery.seed_hosts: ["172.19.12.21:9301","172.19.12.22:9302","172.19.12.23:9303"] # 设置集群中的Master节点的初始列表，可以通过这些节点来自动发现其他新加入集群的节点，ES7的新增配置
cluster.initial_master_nodes: ["172.19.12.21"] # 新集群初始时的候选主节点的name或者ip，ES7的新增配置
EOF
docker run --name es-node-${port} \
--network=escluster --ip 172.19.12.2${port} \
-e "ES_JAVA_OPTS=-Xms300m -Xmx300m" \
-v /usr/local/dockerv/es-cluster/node-${port}/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
-v /usr/local/dockerv/es-cluster/node-${port}/data:/usr/share/elasticsearch/data \
-v /usr/local/dockerv/es-cluster/node-${port}/plugins:/usr/share/elasticsearch/plugins \
-v /usr/local/dockerv/es-cluster/node-${port}/software:/usr/share/elasticsearch/software \
-p 920${port}:920${port} -p 930${port}:930${port} \
-d elasticsearch:7.17.18
done
```

- 查看集群节点

```bash
$ curl http://192.168.32.116:9201/_cat/nodes
172.19.12.23 49 97 5 1.65 2.29 1.55 ilmr       - es-master-3
172.19.12.21 65 97 5 1.65 2.29 1.55 ilmr       * es-master-1
172.19.12.24 68 97 5 1.65 2.29 1.55 cdfhilrstw - es-node-4
172.19.12.25 49 97 5 1.65 2.29 1.55 cdfhilrstw - es-node-5
172.19.12.22 27 97 5 1.65 2.29 1.55 ilmr       - es-master-2
172.19.12.26 47 97 5 1.65 2.29 1.55 cdfhilrstw - es-node-6
$ curl http://192.168.32.116:9201/_cluster/health
{
"cluster_name": "es-cluster",
"status": "green",
"timed_out": false,
"number_of_nodes": 6,
"number_of_data_nodes": 3,
"active_primary_shards": 2,
"active_shards": 4,
"relocating_shards": 0,
"initializing_shards": 0,
"unassigned_shards": 0,
"delayed_unassigned_shards": 0,
"number_of_pending_tasks": 0,
"number_of_in_flight_fetch": 0,
"task_max_waiting_in_queue_millis": 0,
"active_shards_percent_as_number": 100
}
```

- 停止删除

```bash
$ docker stop $(docker ps -a|grep es-node-|awk '{print $1}')
$ docker rm -v $(docker ps -a|grep es-node-|awk '{print $1}')
```

## 90.8 MongoDB

### 90.8.1 普通启动

- 启动mongo

```bash
# /usr/local/dockerv/mongo 目录会自动创建
$ docker run --name mongo \
--ulimit nofile=64000:64000 \
-e MONGO_INITDB_ROOT_USERNAME=root \
-e MONGO_INITDB_ROOT_PASSWORD=root123 \
-v /usr/local/dockerv/mongo/data/:/data/db \
-p 27017:27017 \
-d mongo:8.2.3

# 验证服务是否启动成功
$ docker exec -it mongo mongosh mongodb://root:root123@localhost:27017/admin?authSource=admin
```

- 启动 mongo-express

```bash
$ docker run --name mongo-express \
-e ME_CONFIG_MONGODB_URL="mongodb://root:root123@mongo:27017/admin?authSource=admin" \
-e ME_CONFIG_BASICAUTH_ENABLED=true \
-e ME_CONFIG_BASICAUTH_USERNAME=admin \
-e ME_CONFIG_BASICAUTH_PASSWORD=express123 \
-p 8081:8081 \
--link mongo:mongo \
-d mongo-express:1.0.2
```

访问： http://192.168.200.119:8081

用户名/密码：admin/express123

- 问题

  - 问题1

  ```bash
  To help improve our products, anonymous usage data is collected and sent to MongoDB periodically (https://www.mongodb.com/legal/privacy-policy).
  You can opt-out by running the disableTelemetry() command.
  
  ------
     The server generated these startup warnings when booting
     2026-01-18T13:43:53.943+00:00: Soft rlimits for open file descriptors too low
     2026-01-18T13:43:53.943+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
     2026-01-18T13:43:53.943+00:00: We suggest setting the contents of sysfsFile to 0.
     2026-01-18T13:43:53.943+00:00: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
  ------
  ```

  - 解决

  ```bash
  # MongoDB 建议提高 打开文件描述符限制（open file descriptors）。
  $ sudo tee -a /etc/security/limits.conf <<EOF
  # MongoDB recommended limits
  * soft nofile 64000
  * hard nofile 64000
  EOF
  ```

  ```bash
  # 创建 systemd 服务文件，永久禁用 THP（特殊说明：目前 For customers ... 无法消除）
  $ sudo tee /etc/systemd/system/disable-thp.service <<'EOF'
  [Unit]
  Description=Disable Transparent Huge Pages (THP)
  DefaultDependencies=no
  After=sysinit.target local-fs.target
  
  [Service]
  Type=oneshot
  ExecStart=/bin/sh -c 'echo never > /sys/kernel/mm/transparent_hugepage/enabled && echo never > /sys/kernel/mm/transparent_hugepage/defrag'
  RemainAfterExit=yes
  
  [Install]
  WantedBy=multi-user.target
  EOF
  
  # 启用服务
  sudo systemctl daemon-reload
  sudo systemctl enable --now disable-thp.service
  ```

  ```bash
  # vm.swappiness 控制 Linux 内核将内存页换出到 swap 的倾向。
  $ echo "vm.swappiness=1" | sudo tee -a /etc/sysctl.conf
  sudo sysctl -p  # 重载配置
  ```

## 90.9 JFrog Artifactory

### 90.9.1 6版本

- 创建volume

```bash
$ docker volume create artifactory
```

- 启动

```bash
$ docker run --name artifactory \
-v artifactory:/var/opt/jfrog/artifactory \
-p 8082:8081 \
-d releases-docker.jfrog.io/jfrog/artifactory-oss:6.23.42
```

- 登录

http://emon:8082/

用户名密码：admin/password ==> 登录后被强制修改，修改结果：admin/admin123



### 90.9.2 7版本

- 创建目录并赋权

```bash
$ mkdir -pv /usr/local/dockerv/jfrog/artifactory/var/etc
$ touch /usr/local/dockerv/jfrog/artifactory/var/etc/system.yaml
$ chown -R 1030:1030 /usr/local/dockerv/jfrog/artifactory/var
```

- 启动

```bash
$ docker run --name artifactory \
-v /usr/local/dockerv/jfrog/artifactory/var:/var/opt/jfrog/artifactory \
-p 8081:8081 -p 8082:8082 \
-d releases-docker.jfrog.io/jfrog/artifactory-oss:7.41.12
```

- 登录

http://emon:8082/

用户名密码：admin/password ==> 登录后被强制修改，修改结果：admin/Admin5%123

Base URL：http://repo.emon.vip



## 90.10 RabbitMQ

### 90.10.1 单机

- 启动

  - 5671/5672 - AMQP端口
  - 15671/15672 - Web管理后台端口
  - 4369,25672 - Erlang发现&集群端口
  - 61613,61614 - STOMP协议端口
  - 1883,8883 - MQTT协议端口
  - 默认的用户名密码：guest/guest

  官方端口说明：https://www.rabbitmq.com/docs/networking

```bash
$ docker run --privileged=true --name rabbitmq \
-e RABBITMQ_DEFAULT_USER=rabbit -e RABBITMQ_DEFAULT_PASS=rabbit123 \
-p 5671:5671 -p 5672:5672 \
-p 15671:15671 -p 15672:15672 \
-p 4369:4369 -p 25672:25672 \
-d rabbitmq:3.13.1-management
```

- docker命令访问

```bash
$ docker exec -it rabbitmq /bin/bash
```

- 访问管理台

http://192.168.32.116:15672/

### 90.10.2 集群

- 创建目录

```bash
$ mkdir -pv /usr/local/dockerv/rabbitmq/{rabbitmq01,rabbitmq02,rabbitmq03}
```

- 启动

  - 节点1

  ```bash
  $ docker run --name rabbitmq01 \
  --hostname rabbitmq01 \
  -e RABBITMQ_ERLANG_COOKIE='fsmall' \
  -v /usr/local/dockerv/rabbitmq/rabbitmq01:/var/lib/rabbitmq \
  -p 5673:5672 -p 15673:15672 \
  -d rabbitmq:3.13.1-management
  ```

  - 节点2

  ```bash
  $ docker run --name rabbitmq02 \
  --hostname rabbitmq02 \
  -e RABBITMQ_ERLANG_COOKIE='fsmall' \
  --link rabbitmq01:rabbitmq01 \
  -v /usr/local/dockerv/rabbitmq/rabbitmq01:/var/lib/rabbitmq \
  -p 5674:5672 -p 15674:15672 \
  -d rabbitmq:3.13.1-management
  ```

  - 节点3

  ```bash
  $ docker run --name rabbitmq03 \
  --hostname rabbitmq03 \
  -e RABBITMQ_ERLANG_COOKIE='fsmall' \
  --link rabbitmq01:rabbitmq01 \
  --link rabbitmq02:rabbitmq02 \
  -v /usr/local/dockerv/rabbitmq/rabbitmq01:/var/lib/rabbitmq \
  -p 5675:5672 -p 15675:15672 \
  -d rabbitmq:3.13.1-management
  ```

- 登录

http://192.168.31.116:15673

guest/guest

- 节点加入集群

  - 节点1

  ```bash
  $ docker exec -it rabbitmq01 /bin/bash
  root@rabbitmq01:/# rabbitmqctl stop_app
  root@rabbitmq01:/# rabbitmqctl reset
  root@rabbitmq01:/# rabbitmqctl start_app
  ```

  - 节点2

  ```bash
  $ docker exec -it rabbitmq02 /bin/bash
  root@rabbitmq02:/# rabbitmqctl stop_app
  root@rabbitmq02:/# rabbitmqctl reset
  root@rabbitmq02:/# rabbitmqctl join_cluster --ram rabbit@rabbitmq01
  root@rabbitmq02:/# rabbitmqctl start_app
  ```

  - 节点3

  ```bash
  $ docker exec -it rabbitmq03 /bin/bash
  root@rabbitmq03:/# rabbitmqctl stop_app
  root@rabbitmq03:/# rabbitmqctl reset
  root@rabbitmq03:/# rabbitmqctl join_cluster --ram rabbit@rabbitmq01
  root@rabbitmq03:/# rabbitmqctl start_app
  ```

- 实现镜像集群

```bash
$ docker exec -it rabbitmq01 /bin/bash
root@rabbitmq01:/# rabbitmqctl set_policy -p / ha "^" '{"ha-mode":"all","ha-sync-mode":"automatic"}'
# 控制台输出如下提示：
Setting policy "ha" for pattern "^" to "{"ha-mode":"all","ha-sync-mode":"automatic"}" with priority "0" for vhost "/" ...
```

> 在 cluster中任意节点启用策略，策略会自动同步到集群节点，包括新增节点。
>
> 可以使用  `rabbitmqctl list_policies -p /;`  查看 vhost / 下面的所有policy
>
> -p / ha "^"  解释：为虚拟主机 / 增加一个策略，名称为 ha， "^"表示匹配所有队列"，"^hello"表示匹配以hello开头的队列

## 90.11 minio【未完成】

https://github.com/minio/minio

https://min.io/

https://github.com/minio/minio-java

minio镜像：https://hub.docker.com/r/minio/minio/tags

参考：https://blog.csdn.net/qq_54673740/article/details/134731886

Minio 是一个基于Apache License v2.0开源协议的对象存储服务，虽然轻量，却拥有着不错的性能。它兼容亚马逊S3云存储服务接口，非常适合于存储大容量非结构化的数据。

例如图片、视频、日志文件、备份数据和容器/虚拟机镜像等，而一个对象文件可以是任意大小，从几 kb 到最大 5T 不等。

最重要的是免费

- 创建目录

```bash
$ mkdir -p /usr/local/dockerv/minio/{config,data}
```

- 启动

```bash
$ docker run --name minio --restart always \
-e MINIO_ACCESS_KEY=minio -e MINIO_SECRET_KEY=minio123 \
-v /usr/local/dockerv/minio/config:/root/.minio \
-v /usr/local/dockerv/minio/data:/data \
-p 9000:9000 -p 9090:9090 \
-d minio/minio:RELEASE.2024-03-07T00-43-48Z.fips server /data --console-address ":9090" -address ":9000"
```

说明：

-p 9000:9000：这个参数将容器内的9000端口映射到宿主机的9000端口。MinIO服务默认使用9000端口提供API服务。

-p 9090:9090：这个参数将容器内的9090端口映射到宿主机的9090端口。这是MinIO的控制台（Console）端口，用于访问MinIO的图形用户界面。

容器内要运行的命令，启动一个名为 “minio” 的服务器，数据存储在 /data 目录下，服务器的控制台地址为 “:9090”，服务地址为 “:9000”

- 登录

http://emon:/9090/login

用户名密码：minio/minio123



## 90.12 Nginx

- 创建目录

```bash
$ mkdir -pv /usr/local/dockerv/nginx/{html,logs,conf}
```

- 启动一个临时nginx实例，并从中复制出nginx配置文件

```bash
$ docker run --name nginx -p 80:80 -d nginx:1.25.4
# 从容器中复制出来
$ docker cp nginx:/etc/nginx .
# 复制到目标目录
$ mv nginx/* /usr/local/dockerv/nginx/conf/
# 删除临时容器实例
$ docker stop nginx;docker rm -v nginx
```

- 启动

```bash
$ docker run --name nginx \
--network esnet \
-v /usr/local/dockerv/nginx/conf:/etc/nginx \
-v /usr/local/dockerv/nginx/logs:/var/log/nginx \
-v /usr/local/dockerv/nginx/html:/usr/share/nginx/html \
-p 80:80 \
-d nginx:1.25.4
```

- 创建index.html页面

```bash
$ vim /usr/local/dockerv/nginx/html/index.html
```

```bash
<h1>fullstack</h1>
```

- 浏览器访问

http://192.168.32.116

- 把配置后的nginx打包镜像

```bash
$ mkdir fsmall-nginx && cd fsmall-nginx
$ tar -zcvf conf.tar.gz -C /usr/local/dockerv/nginx/conf .
$ tar -zcvf html.tar.gz -C /usr/local/dockerv/nginx/html/ .
$ cat << EOF > Dockerfile
FROM nginx:1.25.4
MAINTAINER 问秋 liming2011071@163.com
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
EXPOSE 80

ADD html.tar.gz /usr/share/nginx/html
ADD conf.tar.gz /etc/nginx
CMD ["nginx","-g","daemon off;"]
EOF
$ docker build -t rushing/fsmall-nginx:v1.0.0 -f Dockerfile .
$ docker push rushing/fsmall-nginx:v1.0.0
```





## 90.13 Nacos

[nacos官网](https://nacos.io/zh-cn/docs/v2/quickstart/quick-start-docker.html)

- 创建目录

```bash
$ mkdir -pv /usr/local/dockerv/nacos/{logs,conf}
```

- 启动一个临时nacos实例，并从中复制出配置文件

```bash
$ docker run --name nacos -p 8848:8848 -d nacos/nacos-server:v2.2.3
# 从容器中复制出来
$ docker cp nacos:/home/nacos/logs /usr/local/dockerv/nacos
$ docker cp nacos:/home/nacos/conf /usr/local/dockerv/nacos
# 删除临时容器实例
$ docker stop nacos;docker rm -v nacos
```

- 准备数据库

```bash
# 创建库
CREATE database if NOT EXISTS `nacos_config` default character set utf8mb4 collate utf8mb4_unicode_ci;
use `nacos_config`;
```

然后执行：https://github.com/alibaba/nacos/blob/2.2.3/distribution/conf/mysql-schema.sql

说明：mysql-schema.sql也可以使用`/usr/local/dockerv/nacos/conf/mysql-schema.sql`

- 启动

```bash
$ docker run --name nacos \
-e MODE=standalone \
-e SPRING_DATASOURCE_PLATFORM=mysql \
-e MYSQL_SERVICE_HOST=192.168.32.116 -e MYSQL_SERVICE_PORT=3306 -e MYSQL_SERVICE_DB_NAME=nacos_config \
-e MYSQL_SERVICE_USER=root -e MYSQL_SERVICE_PASSWORD=root123 \
-e JVM_XMS=256m -e JVM_XMX=512m \
-v /usr/local/dockerv/nacos/logs:/home/nacos/logs \
-v /usr/local/dockerv/nacos/conf:/home/nacos/conf \
-p 8848:8848 -p 9848:9848 \
-d nacos/nacos-server:v2.2.3
```

- 访问

http://192.168.32.116:8848/nacos

## 90.14 Seata

[Seata官网](https://seata.apache.org/zh-cn/docs/v1.6/user/quickstart)

- 创建目录

```bash
$ mkdir -pv /usr/local/dockerv/seata
```

- 启动一个临时seata实例，并从中复制出配置文件

```bash
$ docker run --name seata -p 8091:8091 -d seataio/seata-server:1.6.1
# 从容器中复制出来
$ docker cp seata:/seata-server /usr/local/dockerv/seata
# 删除临时容器实例
$ docker stop seata;docker rm -v seata
```

- 调整配置

```bash
# 调整注册方式为nacos
$ vim /usr/local/dockerv/seata/seata-server/resources/application.yml 
```

```bash
seata:
  config:
    # support: nacos, consul, apollo, zk, etcd3
    type: file
  registry:
    # support: nacos, eureka, redis, zk, consul, etcd3, sofa
    type: nacos
    nacos:
      application: seata-server
      server-addr: 192.168.32.116:8848
      group: SEATA_GROUP
      namespace:
      cluster: default
      username:
      password:
      context-path:
      ##if use MSE Nacos with auth, mutex with username/password attribute
      #access-key:
      #secret-key:
```

- 准备数据库（每一个使用seata的at事务的微服务对应的数据库，都需要创建该表）【<span style="color:red;font-weight:bold;">并非seata-server所需</span>】

https://github.com/apache/incubator-seata/blob/v1.6.1/script/client/at/db/mysql.sql

- 启动

```bash
$ docker run --name seata \
-v /usr/local/dockerv/seata/seata-server:/seata-server \
-p 8091:8091 -p 7091:7091 \
-d seataio/seata-server:1.6.1
```

- 访问

http://192.168.32.116:7091

用户名/密码：seata/seata

## 90.15 zipkin

- 启动

```bash
$ docker run --name zipkin \
-p 9411:9411 \
-d openzipkin/zipkin:3.1.0
```

> 指定存储到ES：
>
> --env STORAGE_TYPE=elasticsearch --env ES_HOSTS=192.168.32.116:9200

- 访问

http://192.168.32.116:9411/zipkin

## 90.16 Apache ShardingSphere-Proxy

<span style="color:red;font-weight:bold;">官方5.5.0镜像依赖docker20版</span>

获取 master 分支最新镜像：https://github.com/apache/shardingsphere/pkgs/container/shardingsphere-proxy

[ShardingSphere-Proxy官网](https://shardingsphere.apache.org/document/current/cn/user-manual/shardingsphere-proxy/startup/docker/)

[下载地址](https://archive.apache.org/dist/shardingsphere/)

- 创建目录

```bash
$ mkdir -pv /usr/local/dockerv/ssproxy
```

- 启动一个临时shardingsphere-proxy实例，并从中复制出配置文件

```bash
$ docker run --name ssproxy --entrypoint=bash -d apache/shardingsphere-proxy:5.5.0
# 从容器中复制出来
$ docker cp ssproxy:/opt/shardingsphere-proxy/conf /usr/local/dockerv/ssproxy/conf
# 删除临时容器实例
$ docker stop ssproxy;docker rm -v ssproxy
```

- 调整配置

```bash
$ vim global.yaml
authority:
  users:
    - user: root@%
      password: root
    - user: sharding
      password: sharding
  privilege:
    type: ALL_PERMITTED
```

- 下载数据库驱动

```bash
$ wget -cP /usr/local/dockerv/ssproxy/ext-lib/ https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.11/mysql-connector-java-8.0.11.jar
```

- 启动

ShardingSphere-Proxy 默认端口 `3307`，可以通过环境变量 `-e PORT` 指定

```bash
$ docker run --name ssproxy \
    -v /usr/local/dockerv/ssproxy/conf:/opt/shardingsphere-proxy/conf \
    -v /usr/local/dockerv/ssproxy/ext-lib:/opt/shardingsphere-proxy/ext-lib \
    -e PORT=3308 -p13308:3308 \
    -d apache/shardingsphere-proxy:5.5.0 && docker logs -f ssproxy
```

# 九十一、通过docker compose批量安装

- prometheus.yml

```bash
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

  - job_name: 'kafka'
    static_configs:
      - targets: ['kafka:9092']
```

- docker-compose.yml

```yml
services:
  redis:
    image: redis:latest
    hostname: redis
    container_name: redis
    restart: always
    ports:
      - "6379:6379"
    networks:
      - backend

  zookeeper:
    image: bitnami/zookeeper:latest
    hostname: zookeeper
    container_name: zookeeper
    restart: always
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
      ALLOW_ANONYMOUS_LOGIN: yes
    networks:
      - backend

  zookeeper-ui:
    image: rushing/zkui-arm64:latest
    container_name: zookeeper-ui
    restart: always
    depends_on:
      - zookeeper
    ports:
     - "9190:9090"
    environment:
      ZK_SERVER: zookeeper:2181
    networks:
      - backend
      
  kafka:
    image: bitnami/kafka:3.4.0
    hostname: kafka
    container_name: kafka
    restart: always
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      ALLOW_PLAINTEXT_LISTENER: yes
      KAFKA_CFG_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    networks:
      - backend
  
  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name:  kafka-ui
    restart: always
    depends_on:
      - kafka
    ports:
      - "8080:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: dev
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092
    networks:
      - backend

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: always
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
    networks:
      - backend

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: always
    depends_on:
      - prometheus
    ports:
      - "3000:3000"
    networks:
      - backend

networks:
  backend:
    name: backend
```

- 启动

```bash
$ docker compose -f docker-compose.yml up -d
```

- 停止

```bash
$ docker compose -f docker-compose.yml down -v
```

- 验证

  - redis：你的ip:6379

    - 填写表单，下载官方可视化工具：

    - https://redis.com/redis-enterprise/redis-insight/#insight-form

  - zookeeper:你的ip:2181

  - zookeeper-ui:

    - 直接浏览器访问：http://192.168.200.116:9190

      > admin/manager 读写账号；appconfig/appconfig 普通用户

  - Kafka:你的ip:9092

    - idea安装大数据插件

  - kafka-ui：

    - 直接浏览器访问：http://192.168.200.116:8080/

  - Prometheus:

    - 直接浏览器访问：http://192.168.200.116:9090

  - Grafana:

    - 直接浏览器访问：http://192.168.200.116:3000
    - admin/admin -> 修改密码为 admin/admin







