# 第1章 Elasticsearch安装与配置


## 1.1、Elasticsearch

一主二从的安装方式

### 1.1.1、配置【一主】

1. 下载

```shell
$ wget -cP /usr/local/src/ https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.6.2-linux-x86_64.tar.gz
```

2. 解压安装

```shell
$ tar -zxvf /usr/local/src/elasticsearch-7.6.2-linux-x86_64.tar.gz -C /usr/local/ElasticStack/Elasticsearch/
```

3. 创建软连接

```shell
$ ln -s /usr/local/ElasticStack/Elasticsearch/elasticsearch-7.6.2/ /usr/local/es
```

4. 配置

- 配置`elasticsearch.yml`文件

```shell
# 打开文件并追加
$ vim /usr/local/es/config/elasticsearch.yml 
```

```yaml
cluster.name: es-cluster
node.name: master
# 表示该节点具有成为master的权利，但不一定就是master
node.master: true
# 表示该节点不存储数据
node.data: false
path.data: /usr/local/es/data
path.logs: /usr/local/es/logs
network.host: 0.0.0.0
# 指定所有想加入集群的地址
discovery.seed_hosts: ["127.0.0.1:9300", "127.0.0.1:9301"]
# 指定可以成为master的所有节点的name或者ip
cluster.initial_master_nodes: ["master"]


http.cors.enabled: true
http.cors.allow-origin: "*"
```

- 配置`jvm.options`

```shell
# 打开文件并追加
$ vim /usr/local/es/config/jvm.options 
```

```
#-Xms1g
#-Xmx1g
-Xms256m
-Xmx256m
```

5. 解决启动问题

- 问题一

  - 问题描述

  ```
  [1]: max file descriptors [4096] for elasticsearch process is too low, increase to at least [65536]
  ```

  - 修改前查看

  ```shell
  $ ulimit -Sn
  1024
  $ ulimit -Hn
  4096
  ```

  - 解决办法

  ```shell
  # 打开文件并追加
  $ sudo vim /etc/security/limits.conf
  ```

  ```
  # 配置内容，其中emon是启动elasticsearch的用户，如果不确定是什么用户，也可以替换为*表示所有
  emon             soft    nofile          1024
  emon             hard    nofile          65536
  ```

  > 补充说明：
  >
  > hard:严格的设定，必定不能超过这个设定的数值
  >
  > soft:警告的设定，可以超过这个设定值，但是若超过则有警告信息 限制资源:
  >
  > core – 限制内核文件的大小
  >
  > date – 最大数据大小
  >
  > fsize – 最大文件大小
  >
  > memlock – 最大锁定内存地址空间
  >
  > nofile – 打开文件的最大数目
  >
  > rss – 最大持久设置大小
  >
  > stack – 最大栈大小
  >
  > cpu – 以分钟为单位的最多 CPU 时间
  >
  > noproc – 进程的最大数目（系统的最大进程数）
  >
  > as – 地址空间限制 maxlogins – 此用户允许登录的最大数目
  >

  **需要重新登录emon用户，才能生效**

  - 修改后查看

  ```
  $ ulimit -Sn
  1024
  $ ulimit -Hn
  65536
  ```

- 问题二

  - 问题描述

  ```
  [2]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
  ```

  - 解决办法

  ```shell
  # 查看
  $ sudo sysctl -a|grep vm.max_map_count
  vm.max_map_count = 65530
  # 打开文件并追加
  $ sudo vim /etc/sysctl.conf 
  ```
```
  vm.max_map_count=655360
```
```bash
# 使配置生效
$ sudo sysctl -p
vm.max_map_count = 655360
```

6. 配置启动

```shell
$ sudo vim /etc/supervisor/supervisor.d/es.ini
```

```ini
[program:es]
command=/usr/local/es/bin/elasticsearch
autostart=false                 ; 在supervisord启动的时候也自动启动
startsecs=10                    ; 启动10秒后没有异常退出，就表示进程正常启动了，默认为1秒
autorestart=true                ; 程序退出后自动重启,可选值：[unexpected,true,false]，默认为unexpected，表示进程意外杀死后才重启
startretries=3                  ; 启动失败自动重试次数，默认是3
user=emon                       ; 用哪个用户启动进程，默认是root
priority=70                     ; 进程启动优先级，默认999，值小的优先启动
redirect_stderr=true            ; 把stderr重定向到stdout，默认false
stdout_logfile_maxbytes=20MB    ; stdout 日志文件大小，默认50MB
stdout_logfile_backups = 20     ; stdout 日志文件备份数，默认是10
environment=JAVA_HOME="/usr/local/java"
stdout_logfile=/etc/supervisor/supervisor.d/es.log ; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以需要手动>创建目录（supervisord 会自动创建日志文件）
stopasgroup=true                ;默认为false,进程被杀死时，是否向这个进程组发送stop信号，包括子进程
killasgroup=true                ;默认为false，向进程组发送kill信号，包括子进程
```

```shell
$ sudo supervisorctl update
$ sudo supervisorctl start es
```

- **supervisor启动时的问题**

在shell中执行命令可以启动了，但supervisor还是无法启动，报错：

```
020-04-30T15:53:15,294][ERROR][o.e.b.Bootstrap          ] [master] node validation exception
[1] bootstrap checks failed
[1]: max file descriptors [4096] for elasticsearch process is too low, increase to at least [65535]
```

因为supervisor中默认的打开的文件句柄的数量太少，看错误应该是能打开4096，但是一些资料上说是1024。

打开supervisor配置文件：

```shell
$ sudo vim /etc/supervisor/supervisord.conf 
```

找到`[supervisord]`下面的`minfds=1024`修改。

```bash
minfds=1024                  ; min. avail startup file descriptors; default 1024
```

=>

```bash
;minfds=1024                  ; min. avail startup file descriptors; default 1024
minfds=65535                  ; min. avail startup file descriptors; default 1024
```

重启`supervisord`服务：

```
$ sudo systemctl restart supervisord.service
```

再次启动`supervisor es`服务：

```bash
$ sudo supervisorctl start es
```

7. 访问

http://192.168.3.116:9200

```json
{
    name: "master",
    cluster_name: "emon",
    cluster_uuid: "ZhvgqVsVRHCGSyzlg-HoXA",
    version: {
    number: "6.4.1",
    build_flavor: "default",
    build_type: "tar",
    build_hash: "e36acdb",
    build_date: "2018-09-13T22:18:07.696808Z",
    build_snapshot: false,
    lucene_version: "7.4.0",
    minimum_wire_compatibility_version: "5.6.0",
    minimum_index_compatibility_version: "5.0.0"
    },
    tagline: "You Know, for Search"
}
```

8. 相关命令

- 查看当前进程的最大可打开文件数和进程数等

```bash
cat /proc/<进程ID>/limits
比如：
$ cat /proc/55756/limits
```

- 查看当前进程实时打开的文件数

```bash
lsof -p <PID> | wc -l
比如：
$ lsof -p 55756 | wc -l
478
```

- 查看系统总限制打开文件的最大数量

```bash
$ cat /proc/sys/fs/file-max
488387
```





### 1.1.2、配置【一从】

1. 复制主节点

```shell
$ cp -ra /usr/local/es/ /usr/local/ElasticStack/Elasticsearch/elasticsearch-7.4.2-slave1/
$ ln -s /usr/local/ElasticStack/Elasticsearch/elasticsearch-7.6.2-slave1/ /usr/local/es-slave1
# 清除主节点中运行产生的数据
$ rm -rf /usr/local/es-slave1/data/
```

2. 配置

- 配置`elasticsearch.yml`文件

```shell
# 打开文件并追加
$ vim /usr/local/es-slave1/config/elasticsearch.yml
```

```yaml
cluster.name: es-cluster
node.name: slave
# 表示该节点具有成为master的权利，但不一定就是master
node.master: false
# 表示该节点不存储数据
node.data: true
path.data: /usr/local/es-slave/data
path.logs: /usr/local/es-slave/logs
network.host: 0.0.0.0
# es服务端口
http.port: 9201
# 内部节点之间沟通端口
transport.tcp.port: 9301
# 指定所有想加入集群的地址
discovery.seed_hosts: ["127.0.0.1:9301", "127.0.0.1:9300"]
# 指定可以成为master的所有节点的name或者ip
cluster.initial_master_nodes: ["master"]


http.cors.enabled: true
http.cors.allow-origin: "*"
```

- 配置`jvm.options`

```shell
# 打开文件并追加
$ vim /usr/local/es-slave1/config/jvm.options 
```

```
#-Xms1g
#-Xmx1g
-Xms256m
-Xmx256m
```

3. 配置启动

```
$ sudo vim /etc/supervisor/supervisor.d/elasticsearch-slave1.ini 
```

```ini
[program:es-slave1]
command=/usr/local/es-slave1/bin/elasticsearch
autostart=false                 ; 在supervisord启动的时候也自动启动
startsecs=10                    ; 启动10秒后没有异常退出，就表示进程正常启动了，默认为1秒
autorestart=true                ; 程序退出后自动重启,可选值：[unexpected,true,false]，默认为unexpected，表示进程意外杀死后才重启
startretries=3                  ; 启动失败自动重试次数，默认是3
user=emon                       ; 用哪个用户启动进程，默认是root
priority=71                     ; 进程启动优先级，默认999，值小的优先启动
redirect_stderr=true            ; 把stderr重定向到stdout，默认false
stdout_logfile_maxbytes=20MB    ; stdout 日志文件大小，默认50MB
stdout_logfile_backups = 20     ; stdout 日志文件备份数，默认是10
environment=JAVA_HOME="/usr/local/java"
stdout_logfile=/etc/supervisor/supervisor.d/elasticsearch-slave1.log ; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以需要手动>创建目录（supervisord 会自动创建日志文件）
stopasgroup=true                ;默认为false,进程被杀死时，是否向这个进程组发送stop信号，包括子进程
killasgroup=true                ;默认为false，向进程组发送kill信号，包括子进程
```

```shell
$ sudo supervisorctl update
$ sudo supervisorctl start es-slave1
```

4. 访问

http://192.168.3.116:9201

### 1.1.3、配置es启动组

```shell
$ sudo vim /etc/supervisor/supervisor.d/es-group.ini
```

```ini
[group:es-group]
programs=es,es-slave1,es-slave2
priority=999
```

```shell
$ sudo supervisorctl update
$ sudo supervisorctl restart es-group:
```

### 1.1.4、es配套插件

#### 1.5.1、elasticsearch-head

[elasticsearch-head](https://github.com/mobz/elasticsearch-head)

1. 依赖安装

安装bzip2的解压工具：

```shell
$ sudo yum install -y bzip2
```

该插件连接es，需要配置es的`elasticsearch.yml`追加如下：

```
# 追加
http.cors.enabled: true
http.cors.allow-origin: "*"
```

2. 下载安装与运行

```shell
$ cd /usr/local/ElasticStack/ThirdPlugins/
[emon@emon ThirdPlugins]$ git clone git://github.com/mobz/elasticsearch-head.git
[emon@emon ThirdPlugins]$ cd elasticsearch-head/
[emon@emon elasticsearch-head]$ npm install
[emon@emon elasticsearch-head]$ npm start
[emon@emon elasticsearch-head]$ pwd
/usr/local/ElasticStack/ThirdPlugins/elasticsearch-head
```

3. 访问测试

http://192.168.3.116:9100

4. 更好的启动

使用`npm start`会阻塞运行，如果想要长期运行，需要如下方式：

- 安装`grunt`

```bash
# 在目录 /usr/local/ElasticStack/ThirdPlugins/elasticsearch-head 下
[emon@emon elasticsearch-head]$ npm install -g grunt-cli
[emon@emon elasticsearch-head]$ npm ls -g --depth=0|grep grunt
├── grunt-cli@1.3.2
```

- 编写脚本

```bash
[emon@emon elasticsearch-head]$ vim startup.sh
nohup grunt server &
[emon@emon elasticsearch-head]$ chmod u+x startup.sh
```

- 启动

```bash
[emon@emon elasticsearch-head]$ ./startup.sh
```



#### 1.5.2、cerebro插件

[插件cerebro](https://github.com/lmenezes/cerebro/tags)

1. 下载安装与运行

```shell
$ wget -cP /usr/local/src/ https://github.com/lmenezes/cerebro/releases/download/v0.9.2/cerebro-0.9.2.tgz
$ tar -zxvf /usr/local/src/cerebro-0.9.2.tgz -C /usr/local/ElasticStack/ThirdPlugins/
$ ln -s /usr/local/ElasticStack/ThirdPlugins/cerebro-0.9.2/ /usr/local/cerebro
$ /usr/local/cerebro/bin/cerebro
```

2. 访问测试

http://192.168.3.116:9000

3. 配置启动

```shell
$ sudo vim /etc/supervisor/supervisor.d/cerebro.ini
```

```ini
[program:cerebro]
command=/usr/local/cerebro/bin/cerebro
autostart=false                 ; 在supervisord启动的时候也自动启动
startsecs=10                    ; 启动10秒后没有异常退出，就表示进程正常启动了，默认为1秒
autorestart=true                ; 程序退出后自动重启,可选值：[unexpected,true,false]，默认为unexpected，表示进程意外杀死后才重启
startretries=3                  ; 启动失败自动重试次数，默认是3
user=emon                       ; 用哪个用户启动进程，默认是root
priority=70                     ; 进程启动优先级，默认999，值小的优先启动
redirect_stderr=true            ; 把stderr重定向到stdout，默认false
stdout_logfile_maxbytes=20MB    ; stdout 日志文件大小，默认50MB
stdout_logfile_backups = 20     ; stdout 日志文件备份数，默认是10
environment=JAVA_HOME="/usr/local/java"
stdout_logfile=/etc/supervisor/supervisor.d/cerebro.log ; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以需要手动>创建目录（supervisord 会自动创建日志文件）
stopasgroup=true                ;默认为false,进程被杀死时，是否向这个进程组发送stop信号，包括子进程
killasgroup=true                ;默认为false，向进程组发送kill信号，包括子进程
```

```shell
$ sudo supervisorctl update
$ sudo supervisorctl start cerebro
```

### 1.6、ES插件安装

查看安装了哪些es插件：

```bash
[emon@emon bin]$ /usr/local/es/bin/elasticsearch-plugin list --verbose
```

#### 1.6.1、ik分词插件

1. 插件地址： [ik分词插件github地址](https://github.com/medcl/elasticsearch-analysis-ik)
2. 安装

```bash
$ sudo /usr/local/es/bin/elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.6.2/elasticsearch-analysis-ik-7.6.2.zip
```

**说明：**如果您正在使用 Elasticsearch 的DEB / RPM分发，请以超级用户权限运行安装；否则可能会碰到错误：

```bash
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@     WARNING: plugin requires additional permissions     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
```

导致安装失败，加上sudo适用root安装即可。另外，安装后需要**重启**。

#### 1.6.2、pinyin分词插件

1. 插件地址：[拼音分词插件](https://github.com/medcl/elasticsearch-analysis-pinyin)
2. 安装

```bash
$ sudo /usr/local/es/bin/elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-pinyin/releases/download/v7.6.2/elasticsearch-analysis-pinyin-7.6.2.zip
```

说明：如果无法下载报错：

> -> Installing https://github.com/medcl/elasticsearch-analysis-pinyin/releases/download/v7.6.2/elasticsearch-analysis-pinyin-7.6.2.zip
> -> Downloading https://github.com/medcl/elasticsearch-analysis-pinyin/releases/download/v7.6.2/elasticsearch-analysis-pinyin-7.6.2.zip
> -> Failed installing https://github.com/medcl/elasticsearch-analysis-pinyin/releases/download/v7.6.2/elasticsearch-analysis-pinyin-7.6.2.zip
> -> Rolling back https://github.com/medcl/elasticsearch-analysis-pinyin/releases/download/v7.6.2/elasticsearch-analysis-pinyin-7.6.2.zip
> -> Rolled back https://github.com/medcl/elasticsearch-analysis-pinyin/releases/download/v7.6.2/elasticsearch-analysis-pinyin-7.6.2.zip
> Exception in thread "main" java.net.UnknownHostException: github-production-release-asset-2e65be.s3.amazonaws.com
> 	at java.base/sun.nio.ch.NioSocketImpl.connect(NioSocketImpl.java:567)
> 	at java.base/java.net.SocksSocketImpl.connect(SocksSocketImpl.java:339)

可以找一个可以下载的服务器，或者通过：[GitHub代下载服务-永久免费](http://gitd.cc/) 下载后拷贝过来，再安装！

[也可以通过GitClone下载](https://www.gitclone.com/)

```bash
$ sudo /usr/local/es/bin/elasticsearch-plugin install file:///usr/local/src/elasticsearch-analysis-pinyin-7.6.2.zip
```



### 1.7、X-Pack

X-Pack是`Elastic Stack`的一个扩展，提供了安全性、警报、监视、报告、机器学习和许多其他功能。默认情况下，当你安装Elasticsearch后，X-Pack也安装了。

## 2、Logstash
