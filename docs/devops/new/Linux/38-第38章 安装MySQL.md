# 第38章 安装MySQL

### 8.1、安装MySQL5.7版本

1. 检查是否安装

```bash
[emon@wenqiu ~]$ rpm -qa|grep mysql
```

2. 下载

下载页地址： https://dev.mysql.com/downloads/mysql/

```bash
[emon@wenqiu ~]$ wget -cP /usr/local/src/ https://cdn.mysql.com//Downloads/MySQL-5.7/mysql-5.7.30-linux-glibc2.12-x86_64.tar.gz
```

3. 创建安装目录

```bash
[emon@wenqiu ~]$ mkdir /usr/local/MySQL
```

4. 解压安装

```bash
[emon@wenqiu ~]$ tar -zxvf /usr/local/src/mysql-5.7.30-linux-glibc2.12-x86_64.tar.gz -C /usr/local/MySQL/
```

5. 创建软连接

```bash
[emon@wenqiu ~]$ ln -s /usr/local/MySQL/mysql-5.7.30-linux-glibc2.12-x86_64/ /usr/local/mysql
```

6. 配置环境变量

在`/etc/profile.d`目录创建`mysql.sh`文件：

```bash
[emon@wenqiu ~]$ sudo vim /etc/profile.d/mysql.sh
```

```bash
export PATH=/usr/local/mysql/bin:$PATH
```

使之生效：

```bash
[emon@wenqiu ~]$ source /etc/profile
```

7. 数据库目录规划

```bash
# 多版本安装
[emon@wenqiu ~]$ sudo mkdir -p /data/MySQL/mysql5.7.30
[emon@wenqiu ~]$ sudo ln -s /data/MySQL/mysql5.7.30/ /data/mysql
```

| 文件说明                      | 软连接位置                                | 实际存储位置                  |
| ----------------------------- | ----------------------------------------- | ----------------------------- |
| 数据datadir                   | /usr/local/mysql/data                     | /data/mysql/data              |
| 二进制日志log-bin             | /usr/local/mysql/binlogs/mysql-bin        | /data/mysql/binlogs/mysql-bin |
| 错误日志log-error             | /usr/local/mysql/log/mysql_error.log      | /data/mysql/log               |
| 慢查询日志slow_query_log_file | /usr/local/mysql/log/mysql_slow_query.log | /data/mysql/log               |
| 参考文件my.cnf                | /usr/local/mysql/etc/my.cnf               | /data/mysql/etc               |
| 套接字socket文件              | /usr/local/mysql/run/mysql.sock           | /data/mysql/run               |
| pid文件                       | /usr/local/mysql/run/mysql.pid            | /data/mysql/run               |

备注：考虑到数据和二进制日志比较大，需要软链接：

```bash
[emon@wenqiu ~]$ sudo mkdir -p /data/mysql/{data,binlogs,log,etc,run}
[emon@wenqiu ~]$ sudo ln -s /data/mysql/data /usr/local/mysql/data
[emon@wenqiu ~]$ sudo ln -s /data/mysql/binlogs /usr/local/mysql/binlogs
[emon@wenqiu ~]$ sudo ln -s /data/mysql/log /usr/local/mysql/log
[emon@wenqiu ~]$ sudo ln -s /data/mysql/etc /usr/local/mysql/etc
[emon@wenqiu ~]$ sudo ln -s /data/mysql/run /usr/local/mysql/run
```

创建mysql用户，为`/data/mysql`和`/usr/local/mysql/{data,binlogs,log,etc,run}`赋权：

```bash
[emon@wenqiu ~]$ sudo useradd -s /sbin/nologin -M -c "MySQL User" mysql
[emon@wenqiu ~]$ sudo chown -R mysql.mysql /data/mysql/
[emon@wenqiu ~]$ sudo chown -R mysql.mysql /usr/local/mysql/{data,binlogs,log,etc,run}
```

8. 配置`my.cnf`

备份移除系统自带的my.cnf文件：

```bash
# 在CentOS8不需要处理了，默认不存在
[emon@wenqiu ~]$ sudo mv /etc/my.cnf /etc/my.cnf.bak
```

在`/usr/local/mysql/etc/`下创建`my.cnf`文件并配置如下：

```bash
[emon@wenqiu ~]$ sudo vim /usr/local/mysql/etc/my.cnf
```

```bash
[client]
port = 3306
socket = /usr/local/mysql/run/mysql.sock

[mysqld]
port = 3306
socket = /usr/local/mysql/run/mysql.sock
pid_file = /usr/local/mysql/run/mysql.pid
basedir = /usr/local/mysql
datadir = /usr/local/mysql/data
default_storage_engine = InnoDB
max_allowed_packet = 512M
max_connections = 2048
open_files_limit = 65535

skip-name-resolve
lower_case_table_names=1

character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
init_connect='SET NAMES utf8mb4'

innodb_buffer_pool_size = 1024M
innodb_log_file_size = 2048M
innodb_file_per_table = 1
innodb_flush_log_at_trx_commit = 0

key_buffer_size = 64M

log-error = /usr/local/mysql/log/mysql_error.log
slow_query_log = 1
slow_query_log_file = /usr/local/mysql/log/mysql_slow_query.log
long_query_time = 5

tmp_table_size = 32M
max_heap_table_size = 32M
query_cache_type = 0
query_cache_size = 0

explicit_defaults_for_timestamp=true

log-bin = /usr/local/mysql/binlogs/mysql-bin
binlog_format = mixed
server-id=1
```

9. 初始化数据库

```bash
[emon@wenqiu ~]$ sudo /usr/local/mysql/bin/mysqld --defaults-file=/usr/local/mysql/etc/my.cnf --initialize --user=mysql
```

> 如果是单独安装Mysql，而不是从上到下按照我的安装流程而来，有可能碰到如下错误：
>
> /usr/local/mysql/bin/mysqld: error while loading shared libraries: libaio.so.1: cannot open shared object file: No such file or directory
>
> 解决：出现该问题首先检查该链接库文件有没有安装使用 命令进行核查
>
>  rpm -qa|grep libaio
>
> 运行该命令后发现系统中无该链接库文件
>
> 使用命令：
>
> sudo yum install -y libaio-devel.x86_64

在日志文件里会提示一个临时密码，记录这个密码：

```bash
[emon@wenqiu ~]$ sudo grep 'temporary password' /usr/local/mysql/log/mysql_error.log 
2020-05-02T09:28:34.098958Z 1 [Note] A temporary password is generated for root@localhost: gQpHosqS+1h(
```

10. 生成SSL

```bash
# mysql5.7.30执行命令时已经不再会输出生成日志了
[emon@wenqiu ~]$ sudo /usr/local/mysql/bin/mysql_ssl_rsa_setup --defaults-file=/usr/local/mysql/etc/my.cnf
Generating a 2048 bit RSA private key
..................+++
................................................................+++
writing new private key to 'ca-key.pem'
-----
Generating a 2048 bit RSA private key
.......................+++
..+++
writing new private key to 'server-key.pem'
-----
Generating a 2048 bit RSA private key
.....+++
........+++
writing new private key to 'client-key.pem'
-----
```

11. 设置启动项

```bash
[emon@wenqiu ~]$ sudo vim /usr/lib/systemd/system/mysqld.service
```

```bash
# Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; version 2 of the License.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301 USA
#
# systemd service file for MySQL forking server
#

[Unit]
Description=MySQL Server
Documentation=man:mysqld(8)
Documentation=http://dev.mysql.com/doc/refman/en/using-systemd.html
After=network.target
After=syslog.target

[Install]
WantedBy=multi-user.target

[Service]
User=mysql
Group=mysql

Type=forking

PIDFile=/usr/local/mysql/run/mysqld.pid

# Disable service start and stop timeout logic of systemd for mysqld service.
TimeoutSec=0

# Execute pre and post scripts as root
PermissionsStartOnly=true

# Needed to create system tables
#ExecStartPre=/usr/bin/mysqld_pre_systemd

# Start main service
# ExecStart=/usr/local/mysql/bin/mysqld --daemonize --pid-file=/usr/local/mysql/run/mysqld.pid $MYSQLD_OPTS
ExecStart=/usr/local/mysql/bin/mysqld --defaults-file=/usr/local/mysql/etc/my.cnf --daemonize --pid-file=/usr/local/mysql/run/mysqld.pid $MYSQLD_OPTS

# Use this to switch malloc implementation
EnvironmentFile=-/etc/sysconfig/mysql

# Sets open_files_limit
LimitNOFILE = 65535

Restart=on-failure

RestartPreventExitStatus=1

PrivateTmp=false
```

加载启动项：

```bash
[emon@wenqiu ~]$ sudo systemctl daemon-reload
```

12. 启动mysql

```bash
[emon@wenqiu ~]$ sudo systemctl start mysqld.service
```

启动时发现命令卡住了，查看如下：

```bash
[emon@wenqiu ~]$ sudo systemctl status mysqld
● mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; disabled; vendor preset: disabled)
   Active: activating (start) since Sat 2020-05-02 18:39:10 CST; 1min 1s ago
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
  Process: 58921 ExecStart=/usr/local/mysql/bin/mysqld --defaults-file=/usr/local/mysql/etc/my.cnf --daemonize --pid-file=/usr/local/mysql/run/mysqld.pid $MYSQLD_OPTS (cod>
    Tasks: 30 (limit: 30278)
   Memory: 265.4M
   CGroup: /system.slice/mysqld.service
           └─58923 /usr/local/mysql/bin/mysqld --defaults-file=/usr/local/mysql/etc/my.cnf --daemonize --pid-file=/usr/local/mysql/run/mysqld.pid

5月 02 18:39:10 emon systemd[1]: Starting MySQL Server...
5月 02 18:39:10 emon systemd[1]: mysqld.service: Can't open PID file /usr/local/mysql/run/mysqld.pid (yet?) after start: Permission denied
```

这是`selinux`安全策略导致的错误，有两种方式处理：

- 方式一：【不推荐】

```bash
[emon@wenqiu ~]$ sudo setenforece 0
```

- 方式二：【推荐】

```bash
# 查询
[emon@wenqiu ~]$ sudo semanage fcontext -l|grep mysqld_db
/var/lib/mysql(-files|-keyring)?(/.*)?             all files          system_u:object_r:mysqld_db_t:s0 
```

```bash
# 设置
[emon@wenqiu ~]$ sudo semanage fcontext -a -t mysqld_db_t "/usr/local/mysql(/.*)?"
# estorecon命令用来恢复SELinux文件属性即恢复文件的安全上下文
[emon@wenqiu ~]$ sudo restorecon -Rv /usr/local/mysql
Relabeled /usr/local/mysql from unconfined_u:object_r:usr_t:s0 to unconfined_u:object_r:mysqld_db_t:s0
```

```bash
# 查询
[emon@wenqiu ~]$ sudo semanage fcontext -l|grep mysqld_db
/usr/local/mysql(/.*)?                             all files          system_u:object_r:mysqld_db_t:s0 
/var/lib/mysql(-files|-keyring)?(/.*)?             all files          system_u:object_r:mysqld_db_t:s0
```



13. 初始化mysql服务程序

```bash
[emon@wenqiu ~]$ mysql_secure_installation --defaults-file=/usr/local/mysql/etc/my.cnf

Securing the MySQL server deployment.

Enter password for user root: `[输入mysqld --initialize时生成的临时密码]`

The existing password for the user account root has expired. Please set a new password.

New password: `[设置新密码]`

Re-enter new password: `[确认新密码]`

VALIDATE PASSWORD PLUGIN can be used to test passwords
and improve security. It checks the strength of password
and allows the users to set only those passwords which are
secure enough. Would you like to setup VALIDATE PASSWORD plugin?

Press y|Y for Yes, any other key for No: y`[设置密码强度校验]`

There are three levels of password validation policy:

LOW    Length >= 8
MEDIUM Length >= 8, numeric, mixed case, and special characters
STRONG Length >= 8, numeric, mixed case, special characters and dictionary                  file

Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG: 2`[使用最强密码校验]`
Using existing password for root.

Estimated strength of the password: 100 
Change the password for root ? ((Press y|Y for Yes, any other key for No) : n`[是否修改root用户密码]`

 ... skipping.
By default, a MySQL installation has an anonymous user,
allowing anyone to log into MySQL without having to have
a user account created for them. This is intended only for
testing, and to make the installation go a bit smoother.
You should remove them before moving into a production
environment.

Remove anonymous users? (Press y|Y for Yes, any other key for No) : y`[是否移除匿名账户]`
Success.


Normally, root should only be allowed to connect from
'localhost'. This ensures that someone cannot guess at
the root password from the network.

Disallow root login remotely? (Press y|Y for Yes, any other key for No) : y`[是否禁止root用户的远程登录]`
Success.

By default, MySQL comes with a database named 'test' that
anyone can access. This is also intended only for testing,
and should be removed before moving into a production
environment.


Remove test database and access to it? (Press y|Y for Yes, any other key for No) : y`[是否移除测试数据库]`
 - Dropping test database...
Success.

 - Removing privileges on test database...
Success.

Reloading the privilege tables will ensure that all changes
made so far will take effect immediately.

Reload privilege tables now? (Press y|Y for Yes, any other key for No) : y`[是否刷新权限表]`
Success.

All done! 
```

14. 测试

```bash
[emon@wenqiu ~]$ mysqladmin version -uroot -p [(-S|--socket=)/usr/local/mysql/run/mysql.sock]
```

查看变量：

```bash
[emon@wenqiu ~]$ mysqladmin variables -uroot -p [(-S|--socket=)/usr/local/mysql/run/mysql.sock]|wc -l
514
```

登录：

```bash
[emon@wenqiu ~]$ mysql -uroot -p [(-S|--socket=)/usr/local/mysql/run/mysql.sock]
mysql> select user,host from mysql.user;
+---------------+-----------+
| user          | host      |
+---------------+-----------+
| mysql.session | localhost |
| mysql.sys     | localhost |
| root          | localhost |
+---------------+-----------+
3 rows in set (0.00 sec)
```

**说明**

如果发现错误：

```bash
# CentOS8报错如下
[emon@wenqiu ~]$ mysql -uroot -p
mysql: error while loading shared libraries: libncurses.so.5: cannot open shared object file: No such file or directory
```

请安装：

```bash
# 特别说明：yum list libncurses* 匹配不到，但是可以安装成功
[emon@wenqiu ~]$ sudo yum install -y libncurses*
```

停止：

```bash
[emon@wenqiu ~]$ sudo systemctl stop mysqld
```

15. 开放端口

```bash
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --add-port=3306/tcp
success
[emon@wenqiu ~]$ sudo firewall-cmd --reload
success
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --list-ports
20-21/tcp 61001-62000/tcp 80/tcp 3306/tcp
```





### 8.2、安装MySQL8.0版本

	MySQL8.0版本基于MySQL5.7版本的安装，且与MySQL5.7不同时使用，所以：

- 目录`/usr/local/MySQL`已存在【共享】
- `mysql`用户已存在【共享】
- 软连接`/usr/local/mysql`调整【修改】
- 软连接`/data/mysql`调整【修改】
- 环境变量【共享】
- 数据目录规划【共享】
- 开机启动【共享】
- 端口`3306`以开放【共享】



1. 下载

下载页地址： <https://dev.mysql.com/downloads/mysql/>

```bash
[emon@wenqiu ~]$ wget -cP /usr/local/src/ https://cdn.mysql.com//Downloads/MySQL-8.0/mysql-8.0.20-linux-glibc2.12-x86_64.tar.xz
```

2. 解压安装

```bash
[emon@wenqiu ~]$ tar -Jxvf /usr/local/src/mysql-8.0.20-linux-glibc2.12-x86_64.tar.xz -C /usr/local/MySQL/
```

3. 修改软件连接

删除软连接：

```bash
# 注意，删除软连接时，软连接名称后面不要跟 / ，否则就是删除软连接对应的文件目录了
[emon@wenqiu ~]$ rm -rf /usr/local/mysql
```

创建软连接：

```bash
[emon@wenqiu ~]$ ln -s /usr/local/MySQL/mysql-8.0.20-linux-glibc2.12-x86_64/ /usr/local/mysql
```

4. 修改数据库目录规划所用的软连接

```bash
[emon@wenqiu ~]$ sudo rm -rf /data/mysql
[emon@wenqiu ~]$ sudo mkdir -p /data/MySQL/mysql8.0.20
[emon@wenqiu ~]$ sudo ln -s /data/MySQL/mysql8.0.20/ /data/mysql
```

备注：考虑到数据和二进制日志比较大，需要软链接：

```bash
[emon@wenqiu ~]$ sudo mkdir -p /data/mysql/{data,binlogs,log,etc,run}
[emon@wenqiu ~]$ sudo ln -s /data/mysql/data /usr/local/mysql/data
[emon@wenqiu ~]$ sudo ln -s /data/mysql/binlogs /usr/local/mysql/binlogs
[emon@wenqiu ~]$ sudo ln -s /data/mysql/log /usr/local/mysql/log
[emon@wenqiu ~]$ sudo ln -s /data/mysql/etc /usr/local/mysql/etc
[emon@wenqiu ~]$ sudo ln -s /data/mysql/run /usr/local/mysql/run
```

为`/data/mysql`和`/usr/local/mysql/{data,binlogs,log,etc,run}`赋权：

```bash
[emon@wenqiu ~]$ sudo chown -R mysql.mysql /data/mysql/
[emon@wenqiu ~]$ sudo chown -R mysql.mysql /usr/local/mysql/{data,binlogs,log,etc,run}
```

5. 配置

在`/usr/local/mysql/etc/`下创建`my.cnf`文件并配置如下：

```bash
[emon@wenqiu ~]$ sudo vim /usr/local/mysql/etc/my.cnf
```

```bash
[client]
port = 3306
socket = /usr/local/mysql/run/mysql.sock

[mysqld]
port = 3306
socket = /usr/local/mysql/run/mysql.sock
pid_file = /usr/local/mysql/run/mysql.pid
basedir = /usr/local/mysql
datadir = /usr/local/mysql/data
default_storage_engine = InnoDB
max_allowed_packet = 512M
max_connections = 2048
open_files_limit = 65535

skip-name-resolve
lower_case_table_names=1

character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
init_connect='SET NAMES utf8mb4'

innodb_buffer_pool_size = 1024M
innodb_log_file_size = 2048M
innodb_file_per_table = 1
innodb_flush_log_at_trx_commit = 0

key_buffer_size = 64M

log-error = /usr/local/mysql/log/mysql_error.log
slow_query_log = 1
slow_query_log_file = /usr/local/mysql/log/mysql_slow_query.log
long_query_time = 5

tmp_table_size = 32M
max_heap_table_size = 32M
# 考虑到MySQL8移除了Query cache “Query cache was deprecated in MySQL 5.7 and removed in MySQL 8.0 (and later).”，这里注释掉关于Query cache的配置
# query_cache_type = 0
# query_cache_size = 0

explicit_defaults_for_timestamp=true

log-bin = /usr/local/mysql/binlogs/mysql-bin
binlog_format = mixed
server-id=1
```

6. 初始化数据库

```bash
[emon@wenqiu ~]$ sudo /usr/local/mysql/bin/mysqld --defaults-file=/usr/local/mysql/etc/my.cnf --initialize --user=mysql
```

在日志文件里会提示一个临时密码，记录这个密码：

```bash
[emon@wenqiu ~]$ sudo grep 'temporary password' /usr/local/mysql/log/mysql_error.log 
2020-05-02T13:12:48.974545Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: =3w5d=karZtj
```

7. 生成SSL【未提示输出信息，记录】

```bash
[emon@wenqiu ~]$ sudo /usr/local/mysql/bin/mysql_ssl_rsa_setup --defaults-file=/usr/local/mysql/etc/my.cnf
```

8. 启动mysql

```bash
[emon@wenqiu ~]$ sudo systemctl start mysqld.service
```

9. 初始化mysql服务程序

```bash
[emon@wenqiu ~]$ mysql_secure_installation --defaults-file=/usr/local/mysql/etc/my.cnf

Securing the MySQL server deployment.

Enter password for user root: 

The existing password for the user account root has expired. Please set a new password.

New password: 

Re-enter new password: 

VALIDATE PASSWORD PLUGIN can be used to test passwords
and improve security. It checks the strength of password
and allows the users to set only those passwords which are
secure enough. Would you like to setup VALIDATE PASSWORD plugin?

Press y|Y for Yes, any other key for No: y

There are three levels of password validation policy:

LOW    Length >= 8
MEDIUM Length >= 8, numeric, mixed case, and special characters
STRONG Length >= 8, numeric, mixed case, special characters and dictionary                  file

Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG: 2
Using existing password for root.

Estimated strength of the password: 100 
Change the password for root ? ((Press y|Y for Yes, any other key for No) : n

 ... skipping.
By default, a MySQL installation has an anonymous user,
allowing anyone to log into MySQL without having to have
a user account created for them. This is intended only for
testing, and to make the installation go a bit smoother.
You should remove them before moving into a production
environment.

Remove anonymous users? (Press y|Y for Yes, any other key for No) : y
Success.


Normally, root should only be allowed to connect from
'localhost'. This ensures that someone cannot guess at
the root password from the network.

Disallow root login remotely? (Press y|Y for Yes, any other key for No) : y
Success.

By default, MySQL comes with a database named 'test' that
anyone can access. This is also intended only for testing,
and should be removed before moving into a production
environment.


Remove test database and access to it? (Press y|Y for Yes, any other key for No) : y
 - Dropping test database...
Success.

 - Removing privileges on test database...
Success.

Reloading the privilege tables will ensure that all changes
made so far will take effect immediately.

Reload privilege tables now? (Press y|Y for Yes, any other key for No) : y
Success.

All done! 
```

10. 测试

```bash
[emon@wenqiu ~]$ mysqladmin version -uroot -p [(-S|--socket=)/usr/local/mysql/run/mysql.sock]
mysqladmin  Ver 8.0.11 for linux-glibc2.12 on x86_64 (MySQL Community Server - GPL)
Copyright (c) 2000, 2018, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Server version		8.0.11
Protocol version	10
Connection		Localhost via UNIX socket
UNIX socket		/usr/local/mysql/run/mysql.sock
Uptime:			4 min 18 sec

Threads: 2  Questions: 14  Slow queries: 0  Opens: 139  Flush tables: 2  Open tables: 115  Queries per second avg: 0.054
```

查看变量：

```bash
[emon@wenqiu ~]$ mysqladmin variables -uroot -p [(-S|--socket=)/usr/local/mysql/run/mysql.sock]|wc -l
578
```

登录：

```bash
[emon@wenqiu ~]$ mysql -uroot -p [(-S|--socket=)/usr/local/mysql/run/mysql.sock]
mysql> select user,host from mysql.user;
+------------------+-----------+
| user             | host      |
+------------------+-----------+
| mysql.infoschema | localhost |
| mysql.session    | localhost |
| mysql.sys        | localhost |
| root             | localhost |
+------------------+-----------+
4 rows in set (0.00 sec)
```

停止：

```bash
[emon@wenqiu ~]$ sudo systemctl stop mysqld
```

**目前还是使用MySQL5.7，如下切换**

```bash
# 如果服务器启动中，先停止
[emon@wenqiu ~]$ sudo systemctl stop mysqld
# 再执行如下
[emon@wenqiu ~]$ rm -rf /usr/local/mysql
[emon@wenqiu ~]$ ln -s /usr/local/MySQL/mysql-5.7.30-linux-glibc2.12-x86_64/ /usr/local/mysql
[emon@wenqiu ~]$ sudo rm -rf /data/mysql
[emon@wenqiu ~]$ sudo ln -s /data/MySQL/mysql5.7.30/ /data/mysql
[emon@wenqiu ~]$ sudo systemctl start mysqld
```

**若需要切换到MySQL8.0，如下切换**

```bash
# 如果服务器启动中，先停止
[emon@wenqiu ~]$ sudo systemctl stop mysqld
# 再执行如下
[emon@wenqiu ~]$ rm -rf /usr/local/mysql
[emon@wenqiu ~]$ ln -s /usr/local/MySQL/mysql-8.0.20-linux-glibc2.12-x86_64/ /usr/local/mysql
[emon@wenqiu ~]$ sudo rm -rf /data/mysql
[emon@wenqiu ~]$ sudo ln -s /data/MySQL/mysql8.0.20/ /data/mysql
[emon@wenqiu ~]$ sudo systemctl start mysqld
```