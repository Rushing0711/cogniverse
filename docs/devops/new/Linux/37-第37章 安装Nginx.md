# 第37章 安装Nginx

1. 下载

下载页：  http://nginx.org/en/download.html

```bash
[emon@wenqiu ~]$ wget -cP /usr/local/src/ http://nginx.org/download/nginx-1.22.0.tar.gz
```

2. 依赖检查与安装

```bash
[emon@wenqiu ~]$ yum list gcc gcc-c++ automake pcre pcre-devel zlib zlib-devel open openssl-devel
[emon@wenqiu ~]$ sudo yum -y install gcc gcc-c++ automake pcre pcre-devel zlib zlib-devel open openssl-devel
```

3. 创建解压目录

```bash
[emon@wenqiu ~]$ mkdir /usr/local/Nginx
```

4. 解压

```bash
[emon@wenqiu ~]$ tar -zxvf /usr/local/src/nginx-1.22.0.tar.gz -C /usr/local/Nginx/
```

5. 执行配置脚本，并编译安装

- 切换目录并执行配置脚本生成Makefile

```bash
[emon@wenqiu ~]$ cd /usr/local/Nginx/nginx-1.22.0/
[emon@wenqiu nginx-1.22.0]$ ./configure --prefix=/usr/local/Nginx/nginx1.22.0 --with-http_ssl_module --with-stream --with-stream_ssl_module --with-http_v2_module
```

命令解释： `--with-http_ssl_module`指定编译时支持ssl，为Nginx代理时https准备。

`--with-stream --with-stream_ssl_module`指定编译时支持stream代理tcp功能。

- 编译

```bash
[emon@wenqiu nginx-1.22.0]$ make
```

- 安装

```bash
[emon@wenqiu nginx-1.22.0]$ make install
[emon@wenqiu nginx-1.22.0]$ cd
[emon@wenqiu ~]$ ls /usr/local/Nginx/nginx1.22.0/
conf  html  logs  sbin
```

6. 备份主配置文件`nginx.conf`

```bash
[emon@wenqiu ~]$ cp -a /usr/local/Nginx/nginx1.22.0/conf/nginx.conf /usr/local/Nginx/nginx1.22.0/conf/nginx.conf.bak
```

7. 创建软连接

```bash
[emon@wenqiu ~]$ ln -s /usr/local/Nginx/nginx1.22.0/ /usr/local/nginx
```

8. 配置环境变量【特殊】

由于nginx启动的是1024以下的端口，需要root权限，而sudo又不能引用`/etc/profile`和`~/.bash_rc`配置

的环境变量，就会导致`sudo: nginx: command not found`。

所以，采用软连接的方式：

```bash
[emon@wenqiu ~]$ sudo ln -s /usr/local/nginx/sbin/nginx /usr/sbin/nginx
```

9. 校验

```bash
[emon@wenqiu ~]$ nginx -V
nginx version: nginx/1.22.0
built by gcc 4.8.5 20150623 (Red Hat 4.8.5-44) (GCC) 
built with OpenSSL 1.0.2k-fips  26 Jan 2017
TLS SNI support enabled
configure arguments: --prefix=/usr/local/Nginx/nginx1.22.0 --with-http_ssl_modul --with-http_v2_module
[emon@wenqiu ~]$ nginx -v
nginx version: nginx/1.22.0
```

10. 配置`nginx.conf`

```bash
[emon@wenqiu ~]$ vim /usr/local/nginx/conf/nginx.conf
```

打开文件，找到`HTTPS server`上一行，大约95行，添加如下内容：

```bash
    include vhost/*.conf;
```

创建文件夹`vhost` ：

```bash
[emon@wenqiu ~]$ mkdir /usr/local/nginx/conf/vhost
```

创建一个虚拟主机，映射到ftp服务器目录（与ftp提供的服务无关，是Nginx代理的访问方式）：

```bash
[emon@wenqiu ~]$ vim /usr/local/nginx/conf/vhost/file.emon.vip.conf
```

```nginx
server {
    listen 80;
    autoindex on;
    server_name file.emon.vip;
    access_log /usr/local/nginx/logs/access.log combined;
    index index.html index.htm index.jsp index.php;
    #error_page 404 /404.html;
    if ( $query_string ~* ".*[\;'\<\>].*" ){
        return 404;
    }

    location / {
        root /fileserver/ftproot;
        add_header Access-Control-Allow-Origin *;
    }
}
```

11. 测试、启动、重新加载、停止

- 测试

`-t` Nginx服务器配置文件是否有语法错误，可以与`-c`一起使用，使输出内容更详细，这对查找配置文件中错误语法很有帮助。

```bash
[emon@wenqiu ~]$ sudo nginx -t -c /usr/local/nginx/conf/nginx.conf
[sudo] emon 的密码：
nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
```

- 启动

```bash
[emon@wenqiu ~]$ sudo nginx
```

- 重新加载

```bash
[emon@wenqiu ~]$ sudo nginx -s reload
```

- 停止（等待正在执行的任务）

```bash
[emon@wenqiu ~]$ sudo nginx -s quit
```

- 停止（不等待正在执行的任务）

```bash
[emon@wenqiu ~]$ sudo nginx -s stop
```

12. 开放端口

```bash
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --add-port=80/tcp
success
[emon@wenqiu ~]$ sudo firewall-cmd --reload
success
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --list-ports
20-21/tcp 61001-62000/tcp 80/tcp
```

13. 访问

http://192.168.1.116/

14.如何切割nginx日志文件？

- 脚本编写

```bash
[emon@wenqiu ~]$ vim /usr/local/nginx/sbin/cut_my_log.sh
```

```bash
#!/bin/bash
LOG_PATH="/usr/local/nginx/logs"
RECORD_TIME=$(date -d "yesterday" +%Y-%m-%d+%H:%M)
PID=/usr/local/nginx/logs/nginx.pid
mv $LOG_PATH/access.log $LOG_PATH/access.${RECORD_TIME}.log
mv $LOG_PATH/error.log $LOG_PATH/error.${RECORD_TIME}.log
#向Nginx主进程发送信号，用于重新打开日志文件
kill -USR1 `cat $PID`
```

- 配置脚本可执行权限

```bash
[emon@wenqiu ~]$ chmod +x /usr/local/nginx/sbin/cut_my_log.sh 
```

- 使用root权限执行

```bash
[emon@wenqiu ~]$ sudo /usr/local/nginx/sbin/cut_my_log.sh 
```