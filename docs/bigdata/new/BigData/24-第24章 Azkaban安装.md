# 第24章 Azkaban安装

## 24.1、安装Azkaban

### 24.1、依赖

依赖hadoop和hive环境。

### 24.2、安装Azkaban

Azkaban是一个轻量级任务调度器；Ooize是重量级任务调度器；Crontab是简陋的任务调度器。

1. 下载

官网地址：https://azkaban.github.io/

下载地址：https://azkaban.github.io/downloads.html

说明：这里下载的是源码，需要编译，会比较耗时。

这里直接提供了单机版安装包：azkaban-solo-server-0.1.0-SNAPSHOT.tar.gz

2. 创建安装目录

```bash
$ mkdir /usr/local/Azkaban
```

3. 解压安装

```bash
$ tar -zxvf /usr/local/src/azkaban-solo-server-0.1.0-SNAPSHOT.tar.gz -C /usr/local/Azkaban/
```

4. 创建软连接

```bash
$ ln -snf /usr/local/Azkaban/azkaban-solo-server-0.1.0-SNAPSHOT/ /usr/local/azk
```

5. 配置环境变量

```bash
$ sudo vim /etc/profile.d/azk.sh
export AZK_HOME=/usr/local/azk
export PATH=$AZK_HOME/bin:$PATH
```

使之生效：

```bash
$ source /etc/profile
```

### 24.3、配置

- 配置时区

```bash
$ vim /usr/local/azk/conf/azkaban.properties
```

```properties
# [修改]
# default.timezone.id=America/Los_Angeles
default.timezone.id=Asia/Shanghai
```

### 24.4、启动与停止

- 启动

```bash
# 特殊：必须在Azkaban安装根目录下使用该命令
[emon@emon azk]$ ./bin/azkaban-solo-start.sh 
```

访问：http://emon:8081/

用户名密码默认都是： azkaban

- 停止

```bash
# 特殊：必须在Azkaban安装根目录下使用该命令
[emon@emon azk]$ ./bin/azkaban-solo-shutdown.sh
```



