# 第42章 安装Redis

1. 依赖检查与安装

```bash
[emon@wenqiu ~]$ yum list gcc gcc-c++ tcl
[emon@wenqiu ~]$ sudo yum install -y gcc gcc-c++ tcl
```

2. 下载

下载页地址： https://redis.io/download

```bash
[emon@wenqiu ~]$ wget -cP /usr/local/src/ http://download.redis.io/releases/redis-5.0.8.tar.gz
```

3. 创建解压目录

```bash
[emon@wenqiu ~]$ mkdir /usr/local/Redis
```

4. 解压

```bash
[emon@wenqiu ~]$ tar -zxvf /usr/local/src/redis-5.0.8.tar.gz -C /usr/local/Redis/
```

5. 切换目录并执行编译

```bash
[emon@wenqiu ~]$ cd /usr/local/Redis/redis-5.0.8/
# 默认的是jemalloc分配器，如果不存在，需要设置malloc分配器才可以
[emon@wenqiu redis-5.0.8]$ make MALLOC=libc
cd src && make all
make[1]: 进入目录“/usr/local/Redis/redis-4.0.9/src”
    CC Makefile.dep
......`[省略输出]`
Hint: It's a good idea to run 'make test' ;)

make[1]: 离开目录“/usr/local/Redis/redis-5.0.8/src”
```

注意：make命令执行完成编译后，会在src目录下生成7个可执行文件，分别是：

- redis-server
- redis-sentinel
- redis-cli
- redis-benchmark
- redis-check-rdb
- redis-check-aof
- redis-trib.rb

6. 编译测试

```bash
[emon@wenqiu redis-5.0.8]$ make test
cd src && make test
make[1]: 进入目录“/usr/local/Redis/redis-5.0.8/src”
    CC Makefile.dep
Cleanup: may take some time... OK
Starting test server at port 11111
......`[省略输出]`
\o/ All tests passed without errors!

Cleanup: may take some time... OK
make[1]: 离开目录“/usr/local/Redis/redis-5.0.8/src”
[emon@wenqiu redis-5.0.8]$ cd
```

### 12.1、【一主二从三哨兵】

#### 12.1.1、配置化安装

严格意义上，只是把一些文件归集到一个目录，作为安装内容，所以叫做`配置化安装`。

- 创建安装目录

```bash
[emon@wenqiu ~]$ mkdir /usr/local/Redis/redis5.0.8
```

- 复制`/usr/local/Redis/redis-5.0.8/src`目录下的可执行文件，到安装目录

```bash
[emon@wenqiu ~]$ cp /usr/local/Redis/redis-5.0.8/src/{redis-server,redis-sentinel,redis-cli,redis-benchmark,redis-check-rdb,redis-check-aof,redis-trib.rb} /usr/local/Redis/redis5.0.8/
```

- 复制`redis.config`与`sentinel.conf`到安装目录

```bash
[emon@wenqiu ~]$ cp /usr/local/Redis/redis-5.0.8/{redis.conf,sentinel.conf} /usr/local/Redis/redis5.0.8/
```

- 在内置目录创建RDB文件目录与log日志文件

```bash
[emon@wenqiu ~]$ mkdir /usr/local/Redis/redis5.0.8/redis_rdb
[emon@wenqiu ~]$ touch /usr/local/Redis/redis5.0.8/redis_rdb/{redis.log,redis-slave.log,redis-slave2.log,sentinel.log,sentinel-slave.log,sentinel-slave2.log}
```

- 创建软连接

```bash
[emon@wenqiu ~]$ ln -s /usr/local/Redis/redis5.0.8/ /usr/local/redis
```

- 配置环境变量

在`/etc/profile.d`目录创建`.sh`文件：

```bash
[emon@wenqiu ~]$ sudo vim /etc/profile.d/redis.sh
export REDIS_HOME=/usr/local/redis
export PATH=$REDIS_HOME:$PATH
```

使之生效：

```bash
[emon@wenqiu ~]$ source /etc/profile
```

#### 12.1.2、配置【一主】

配置`redis.conf`和`sentinel.conf`文件，**并衍生出从数据库与哨兵的配置**

1. 配置【一主】的配置文件

```bash
[emon@wenqiu ~]$ vim /usr/local/redis/redis.conf 
```

```bash
# 守护进程方式运行
daemonize no
# 这个文件不需要创建，在启动后自动生成
pidfile /var/run/redis_6379.pid
# 数据库监听的IP地址，如果是生产库，请使用具体IP地址；考虑到虚拟机IP地址变动，这里使用本机所有【修改】
bind 0.0.0.0
# 端口
port 6379
# 这个文件需要手动提前创建好，表示日志文件【修改】
logfile "/usr/local/redis/redis_rdb/redis.log"
# 数据文件
dbfilename dump.rdb
# RDB文件目录【修改】
dir /usr/local/redis/redis_rdb/
# 最大内存200M【新增】
maxmemory 200M
# 设置Redis连接密码，客户端在链接Redis时需要通过auth <password>命令提供密码，默认关闭。【新增】
requirepass `[密码]`
```

2. 如何配置启动？有三种启动方式，如下：

- 直接命令`/usr/local/redis/redis-server /usr/local/redis/redis.conf `
- 增加开机服务systemctl

```bash
[emon@wenqiu ~]$ sudo vim /usr/lib/systemd/system/redisd.service
```

```bash
[Unit]
Description=The redis-server Process Manager
After=syslog.target network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=/var/run/redis_6379.pid
ExecStart=/usr/local/redis/redis-server /usr/local/redis/redis.conf
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

```bash
[emon@wenqiu ~]$ sudo systemctl daemon-reload
[emon@wenqiu ~]$ sudo systemctl start redisd
```

- 使用supervisor（或者类似的工具）【推荐】

```bash
[emon@wenqiu ~]$ sudo vim /etc/supervisor/supervisor.d/redis.ini
```

```ini
[program:redis]
command=/usr/local/redis/redis-server /usr/local/redis/redis.conf
autostart=false                 ; 在supervisord启动的时候也自动启动
startsecs=10                    ; 启动10秒后没有异常退出，就表示进程正常启动了，默认为1秒
autorestart=true                ; 程序退出后自动重启,可选值：[unexpected,true,false]，默认为unexpected，表示进程意外杀死后才重启
startretries=3                  ; 启动失败自动重试次数，默认是3
user=root                       ; 用哪个用户启动进程，默认是root
priority=70                     ; 进程启动优先级，默认999，值小的优先启动
redirect_stderr=true            ; 把stderr重定向到stdout，默认false
stdout_logfile_maxbytes=20MB    ; stdout 日志文件大小，默认50MB
stdout_logfile_backups = 20     ; stdout 日志文件备份数，默认是10
stdout_logfile=/etc/supervisor/supervisor.d/redis.log ; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以需要手动创建目录（supervisord 会自动创建日志文件）
stopasgroup=true                ;默认为false,进程被杀死时，是否向这个进程组发送stop信号，包括子进程
killasgroup=true                ;默认为false，向进程组发送kill信号，包括子进程
```

```bash
[emon@wenqiu ~]$ sudo supervisorctl update
[emon@wenqiu ~]$ sudo supervisorctl start redis
```

**关于警告：**(启动后有三个警告)

- 第一个警告

`WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128`

```bash
# 打开文件追加
[emon@wenqiu ~]$ sudo vim /etc/sysctl.conf 
net.core.somaxconn=1024
# 使配置生效
[emon@wenqiu ~]$ sudo sysctl -p
```

- 第二个警告

`WARNING overcommit_memory is set to 0! Background save may fail under low memory condition`

```bash
# 打开文件追加
[emon@wenqiu ~]$ sudo vim /etc/sysctl.conf 
vm.overcommit_memory=1
# 使配置生效
[emon@wenqiu ~]$ sudo sysctl -p
```

- 第三个警告

`WARNING you have Transparent Huge Pages (THP) support enabled in your kernel`，意思是你使用的是透明大页，可能导致redis延迟和内层使用问题。

解决方法：将其写入`/etc/rc.local`文件中。

```bash
[emon@wenqiu ~]$ sudo vim /etc/rc.local
if test -f /sys/kernel/mm/transparent_hugepage/enabled; then
echo never > /sys/kernel/mm/transparent_hugepage/enabled
fi
# 使配置生效
[emon@wenqiu ~]$ sudo bash -c "source /etc/rc.local"
```



3. 校验

在Redis启动情况下：

```bash
[emon@wenqiu ~]$ redis-cli -h 192.168.1.116 -p 6379
192.168.1.116:6379> auth `[密码]`
OK
192.168.1.116:6379> set name emon
OK
192.168.1.116:6379> get name
"emon"
192.168.1.116:6379> exit
```

#### 12.1.3、配置【二从】

拷贝`redis.conf`，复制出2份，文件名分别为`redis-slave.conf`和`redis-slave2.conf`，并配置如下：

##### 12.1.3.1、【二从】之一

1. 配置【二从】的配置文件

```bash
[emon@wenqiu ~]$ cp /usr/local/redis/redis.conf /usr/local/redis/redis-slave.conf
[emon@wenqiu ~]$ vim /usr/local/redis/redis-slave.conf
```

```bash
# 守护进程方式运行
daemonize no
# 这个文件不需要创建，在启动后自动生成【修改】
pidfile /var/run/redis_6389.pid
# 数据库监听的IP地址，如果是生产库，请使用具体IP地址；考虑到虚拟机IP地址变动，这里使用本机所有【修改】
bind 0.0.0.0
# 端口【修改】
port 6389
# 这个文件需要手动提前创建好，表示日志文件【修改】
logfile "/usr/local/redis/redis_rdb/redis-slave.log"
# 数据文件【修改】
dbfilename dump-slave.rdb
# RDB文件目录【修改】
dir /usr/local/redis/redis_rdb/
# 最大内存200M【新增】
maxmemory 200M
# 设置Redis连接密码，客户端在链接Redis时需要通过auth <password>命令提供密码，默认关闭。【新增】
requirepass `[密码]`
# 【新增】
slaveof 0.0.0.0 6379
# 【新增】
masterauth `[密码]`
```

2. 配置启动

```bash
[emon@wenqiu ~]$ sudo vim /etc/supervisor/supervisor.d/redis-slave.ini
```

```ini
[program:redis-slave]
command=/usr/local/redis/redis-server /usr/local/redis/redis-slave.conf
autostart=false                 ; 在supervisord启动的时候也自动启动
startsecs=10                    ; 启动10秒后没有异常退出，就表示进程正常启动了，默认为1秒
autorestart=true                ; 程序退出后自动重启,可选值：[unexpected,true,false]，默认为unexpected，表示进程意外杀死后才重启
startretries=3                  ; 启动失败自动重试次数，默认是3
user=root                       ; 用哪个用户启动进程，默认是root
priority=70                     ; 进程启动优先级，默认999，值小的优先启动
redirect_stderr=true            ; 把stderr重定向到stdout，默认false
stdout_logfile_maxbytes=20MB    ; stdout 日志文件大小，默认50MB
stdout_logfile_backups = 20     ; stdout 日志文件备份数，默认是10
stdout_logfile=/etc/supervisor/supervisor.d/redis-slave.log ; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以需要手动创建目录（supervisord 会自动创建日志文件）
stopasgroup=true                ;默认为false,进程被杀死时，是否向这个进程组发送stop信号，包括子进程
killasgroup=true                ;默认为false，向进程组发送kill信号，包括子进程
```

```bash
[emon@wenqiu ~]$ sudo supervisorctl update
[emon@wenqiu ~]$ sudo supervisorctl start redis-slave
```

3. 校验

```bash
[emon@wenqiu ~]$ redis-cli -h 192.168.1.116 -p 6389
192.168.1.116:6389> auth `[密码]`
OK
192.168.1.116:6389> get name
"emon"
192.168.1.116:6389> exit
```

##### 12.1.3.2、【二从】之二

1. 配置【二从】的配置文件

```bash
[emon@wenqiu ~]$ cp /usr/local/redis/redis.conf /usr/local/redis/redis-slave2.conf
[emon@wenqiu ~]$ vim /usr/local/redis/redis-slave2.conf
```

```bash
# 守护进程方式运行
daemonize no
# 这个文件不需要创建，在启动后自动生成【修改】
pidfile /var/run/redis_6399.pid
# 数据库监听的IP地址，如果是生产库，请使用具体IP地址；考虑到虚拟机IP地址变动，这里使用本机所有【修改】
bind 0.0.0.0
# 端口【修改】
port 6399
# 这个文件需要手动提前创建好，表示日志文件【修改】
logfile "/usr/local/redis/redis_rdb/redis-slave2.log"
# 数据文件【修改】
dbfilename dump-slave2.rdb
# RDB文件目录【修改】
dir /usr/local/redis/redis_rdb/
# 最大内存200M【新增】
maxmemory 200M
# 设置Redis连接密码，客户端在链接Redis时需要通过auth <password>命令提供密码，默认关闭。【新增】
requirepass `[密码]`
# 【新增】
slaveof 0.0.0.0 6379
# 【新增】
masterauth `[密码]`
```

2. 配置启动

```bash
[emon@wenqiu ~]$ sudo vim /etc/supervisor/supervisor.d/redis-slave2.ini
```

```ini
[program:redis-slave2]
command=/usr/local/redis/redis-server /usr/local/redis/redis-slave2.conf
autostart=false                 ; 在supervisord启动的时候也自动启动
startsecs=10                    ; 启动10秒后没有异常退出，就表示进程正常启动了，默认为1秒
autorestart=true                ; 程序退出后自动重启,可选值：[unexpected,true,false]，默认为unexpected，表示进程意外杀死后才重启
startretries=3                  ; 启动失败自动重试次数，默认是3
user=root                       ; 用哪个用户启动进程，默认是root
priority=70                     ; 进程启动优先级，默认999，值小的优先启动
redirect_stderr=true            ; 把stderr重定向到stdout，默认false
stdout_logfile_maxbytes=20MB    ; stdout 日志文件大小，默认50MB
stdout_logfile_backups = 20     ; stdout 日志文件备份数，默认是10
stdout_logfile=/etc/supervisor/supervisor.d/redis-slave2.log ; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以需要手动创建目录（supervisord 会自动创建日志文件）
stopasgroup=true                ;默认为false,进程被杀死时，是否向这个进程组发送stop信号，包括子进程
killasgroup=true                ;默认为false，向进程组发送kill信号，包括子进程
```

```bash
[emon@wenqiu ~]$ sudo supervisorctl update
[emon@wenqiu ~]$ sudo supervisorctl start redis-slave2
```

3. 校验

```bash
[emon@wenqiu ~]$ redis-cli -h 192.168.1.116 -p 6399
192.168.1.116:6399> auth `[密码]`
OK
192.168.1.116:6399> get name
"emon"
192.168.1.116:6399> exit
```

##### 12.1.3.3、【一主二从】校验

```bash
[emon@wenqiu ~]$ redis-cli -h 192.168.1.116 -p 6379
192.168.1.116:6379> auth `[密码]`
OK
192.168.1.116:6379> info replication
# Replication
role:master
connected_slaves:2
slave0:ip=127.0.0.1,port=6389,state=online,offset=33521,lag=0
slave1:ip=127.0.0.1,port=6399,state=online,offset=33521,lag=0
master_replid:ab040df4810461223932f58e30b06382ace009a9
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:33521
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:33521
192.168.1.116:6379> exit
```

#### 12.1.4、配置【三哨兵】

##### 12.1.4.1、【三哨兵】之一

1. 配置【三哨兵】的配置文件

```bash
[emon@wenqiu ~]$ vim /usr/local/redis/sentinel.conf 
```

```bash
# 【新增】
bind 0.0.0.0
# 端口
port 26379
# 工作目录【修改】
dir /usr/local/redis/redis_rdb
# 哨兵监控的主数据库，名称可以自定义，地址与端口注意【修改】
sentinel monitor mymaster 192.168.3.116 6379 2
# 【新增】
sentinel auth-pass mymaster `[密码]`
# 【新增】
logfile "/usr/local/redis/redis_rdb/sentinel.log"
```

> # sentinel.conf
> sentinel monitor mymaster 127.0.0.1 6379 2
> sentinel down-after-milliseconds mymaster 30000
> sentinel parallel-syncs mymaster 1
> sentinel failover-timeout mymaster 180000
>
> - `sentinel monitor mymaster`: 监控的主服务器，其中 `mymaster` 是主服务器的名字，后面跟主服务器的IP和端口以及最少需要的投票数（在这个例子中是2，即至少需要3个哨兵同意才能进行故障转移）
>
> - `sentinel down-after-milliseconds`: 如果一个服务器在指定的毫秒数内没有响应，则认为它是主观下线。
> - `sentinel parallel-syncs`: 在故障转移期间，可以有几个从服务器同时进行同步。
> - `sentinel failover-timeout`: 故障转移超时时间。

2. 配置启动

```bash
[emon@wenqiu ~]$ sudo vim /etc/supervisor/supervisor.d/redis-sentinel.ini
```

```ini
[program:redis-sentinel]
command=/usr/local/redis/redis-sentinel /usr/local/redis/sentinel.conf
autostart=false                 ; 在supervisord启动的时候也自动启动
startsecs=10                    ; 启动10秒后没有异常退出，就表示进程正常启动了，默认为1秒
autorestart=true                ; 程序退出后自动重启,可选值：[unexpected,true,false]，默认为unexpected，表示进程意外杀死后才重启
startretries=3                  ; 启动失败自动重试次数，默认是3
user=root                       ; 用哪个用户启动进程，默认是root
priority=70                     ; 进程启动优先级，默认999，值小的优先启动
redirect_stderr=true            ; 把stderr重定向到stdout，默认false
stdout_logfile_maxbytes=20MB    ; stdout 日志文件大小，默认50MB
stdout_logfile_backups = 20     ; stdout 日志文件备份数，默认是10
stdout_logfile=/etc/supervisor/supervisor.d/redis-sentinel.log ; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以需要手动创建目录（supervisord 会自动创建日志文件）
stopasgroup=true                ;默认为false,进程被杀死时，是否向这个进程组发送stop信号，包括子进程
killasgroup=true                ;默认为false，向进程组发送kill信号，包括子进程
```

```bash
[emon@wenqiu ~]$ sudo supervisorctl update
[emon@wenqiu ~]$ sudo supervisorctl start redis-sentinel
```

【警告】

```
# 启动日志碰到警告
WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.
```

【解决】

```shell
# 第一步：打开`/etc/sysctl.conf`文件
[emon@wenqiu ~]$ sudo vim /etc/sysctl.conf 
# 第二步：追加如下内容
net.core.somaxconn=1024
# 第三步：使之生效
[emon@wenqiu ~]$ sudo sysctl -p
```



【拷贝`sentinel.conf`，复制出2份，文件名分别为`sentinel-slave.conf`和`sentinel-slave2.conf`，并配置如下：】

##### 12.1.4.2、【三哨兵】之二

1. 配置【三哨兵】的配置文件

```bash
[emon@wenqiu ~]$ cp /usr/local/redis/sentinel.conf /usr/local/redis/sentinel-slave.conf 
[emon@wenqiu ~]$ vim /usr/local/redis/sentinel-slave.conf
```

```bash
# 【新增】
bind 0.0.0.0
# 端口【修改】
port 26389
# 工作目录【修改】
dir /usr/local/redis/redis_rdb
# 哨兵监控的主数据库，名称可以自定义，地址与端口注意【修改】
sentinel monitor mymaster 192.168.3.116 6379 2
# 【新增】
sentinel auth-pass mymaster `[密码]`
# 【新增】
logfile "/usr/local/redis/redis_rdb/sentinel-slave.log"
```

2. 配置启动

```bash
[emon@wenqiu ~]$ sudo vim /etc/supervisor/supervisor.d/redis-sentinel-slave.ini
```

```ini
[program:redis-sentinel-slave]
command=/usr/local/redis/redis-sentinel /usr/local/redis/sentinel-slave.conf
autostart=false                 ; 在supervisord启动的时候也自动启动
startsecs=10                    ; 启动10秒后没有异常退出，就表示进程正常启动了，默认为1秒
autorestart=true                ; 程序退出后自动重启,可选值：[unexpected,true,false]，默认为unexpected，表示进程意外杀死后才重启
startretries=3                  ; 启动失败自动重试次数，默认是3
user=root                       ; 用哪个用户启动进程，默认是root
priority=70                     ; 进程启动优先级，默认999，值小的优先启动
redirect_stderr=true            ; 把stderr重定向到stdout，默认false
stdout_logfile_maxbytes=20MB    ; stdout 日志文件大小，默认50MB
stdout_logfile_backups = 20     ; stdout 日志文件备份数，默认是10
stdout_logfile=/etc/supervisor/supervisor.d/redis-sentinel-slave.log ; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以需要手动创建目录（supervisord 会自动创建日志文件）
stopasgroup=true                ;默认为false,进程被杀死时，是否向这个进程组发送stop信号，包括子进程
killasgroup=true                ;默认为false，向进程组发送kill信号，包括子进程
```

```bash
[emon@wenqiu ~]$ sudo supervisorctl update
[emon@wenqiu ~]$ sudo supervisorctl start redis-sentinel-slave
```

##### 112.1.4.3、【三哨兵】之三

1. 配置【三哨兵】的配置文件

```bash
[emon@wenqiu ~]$ cp /usr/local/redis/sentinel.conf /usr/local/redis/sentinel-slave2.conf 
[emon@wenqiu ~]$ vim /usr/local/redis/sentinel-slave2.conf
```

```bash
# 【新增】
bind 0.0.0.0
# 端口【修改】
port 26399
# 工作目录【修改】
dir /usr/local/redis/redis_rdb
# 哨兵监控的主数据库，名称可以自定义，地址与端口注意【修改】
sentinel monitor mymaster 192.168.3.116 6379 2
# 【新增】
sentinel auth-pass mymaster `[密码]`
# 【新增】
logfile "/usr/local/redis/redis_rdb/sentinel-slave2.log"
```

2. 配置启动

```bash
[emon@wenqiu ~]$ sudo vim /etc/supervisor/supervisor.d/redis-sentinel-slave2.ini
```

```ini
[program:redis-sentinel-slave2]
command=/usr/local/redis/redis-sentinel /usr/local/redis/sentinel-slave2.conf
autostart=false                 ; 在supervisord启动的时候也自动启动
startsecs=10                    ; 启动10秒后没有异常退出，就表示进程正常启动了，默认为1秒
autorestart=true                ; 程序退出后自动重启,可选值：[unexpected,true,false]，默认为unexpected，表示进程意外杀死后才重启
startretries=3                  ; 启动失败自动重试次数，默认是3
user=root                       ; 用哪个用户启动进程，默认是root
priority=70                     ; 进程启动优先级，默认999，值小的优先启动
redirect_stderr=true            ; 把stderr重定向到stdout，默认false
stdout_logfile_maxbytes=20MB    ; stdout 日志文件大小，默认50MB
stdout_logfile_backups = 20     ; stdout 日志文件备份数，默认是10
stdout_logfile=/etc/supervisor/supervisor.d/redis-sentinel-slave2.log ; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以>需要手动创建目录（supervisord 会自动创建日志文件）
stopasgroup=true                ;默认为false,进程被杀死时，是否向这个进程组发送stop信号，包括子进程
killasgroup=true                ;默认为false，向进程组发送kill信号，包括子进程
```

```bash
[emon@wenqiu ~]$ sudo supervisorctl update
[emon@wenqiu ~]$ sudo supervisorctl start redis-sentinel-slave2
```

#### 12.1.5、配置redis启动组

```bash
[emon@wenqiu ~]$ sudo vim /etc/supervisor/supervisor.d/redis-group.ini
```

```bash
[group:redis-group]
programs=redis,redis-slave,redis-slave2,redis-sentinel,redis-sentinel-slave,redis-sentinel-slave2
priority=999
```

```bash
[emon@wenqiu ~]$ sudo supervisorctl update
[emon@wenqiu ~]$ sudo supervisorctl restart redis-group:
```

#### 12.1.6、开放端口

```bash
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --add-port=6379/tcp
success
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --add-port=26379/tcp
success
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --add-port=6389/tcp
success
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --add-port=26389/tcp
success
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --add-port=6399/tcp
success
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --add-port=26399/tcp
success
[emon@wenqiu ~]$ sudo firewall-cmd --reload
success
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --list-ports
20-21/tcp 61001-62000/tcp 80/tcp 3306/tcp 9001/tcp 8080-8090/tcp 8360-8370/tcp 6379/tcp 26379/tcp 6389/tcp 26389/tcp 6399/tcp 26399/tcp
```