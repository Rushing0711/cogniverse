# 第23章 Zeppelin安装

## 23.1、安装Zeppelin

### 23.1、依赖

依赖hiveserver2服务，需要先启动该服务。

### 23.2、安装Zeppelin

1. 下载

官网地址：https://zeppelin.apache.org/

下载地址：https://zeppelin.apache.org/download.html

```bash
$ wget -cP /usr/local/src/ https://dlcdn.apache.org/zeppelin/zeppelin-0.10.0/zeppelin-0.10.0-bin-all.tgz --no-check-certificate
```

2. 创建安装目录

```bash
$ mkdir /usr/local/Zeppelin
```

3. 解压安装

```bash
$ tar -zxvf /usr/local/src/zeppelin-0.10.0-bin-all.tgz -C /usr/local/Zeppelin/
```

4. 创建软连接

```bash
$ ln -snf /usr/local/Zeppelin/zeppelin-0.10.0-bin-all/ /usr/local/zep
```

5. 配置环境变量

```bash
$ sudo vim /etc/profile.d/zep.sh
export ZEP_HOME=/usr/local/zep
export PATH=$ZEP_HOME/bin:$PATH
```

使之生效：

```bash
$ source /etc/profile
```

### 23.3、配置

#### 23.3.1、配置`zeeppelin-env.sh`

- 复制`zeppelin-env.sh.template.sh`到`zeppelin-env.sh`

```bash
$ cp /usr/local/zep/conf/zeppelin-env.sh.template /usr/local/zep/conf/zeppelin-env.sh
```

#### 23.3.2、配置`zeppelin-site.xml`

- 复制`zeppelin-site.xml.template`到`zeppelin-site.xml`

```bash
$ cp /usr/local/zep/conf/zeppelin-site.xml.template /usr/local/zep/conf/zeppelin-site.xml
```

- 配置`zeppelin-site.xml`

```bash
$ vim /usr/local/zep/conf/zeppelin-site.xml
```

```xml
<!-- 修改一 -->
<property>
  <name>zeppelin.server.addr</name>
  <value>127.0.0.1</value>
  <description>Server binding address</description>
</property>
==>
<property>
  <name>zeppelin.server.addr</name>
  <value>0.0.0.0</value>
  <description>Server binding address</description>
</property>
```

#### 23.3.3、添加hive依赖包

- zeppelin会依赖hive，添加hive依赖包

```bash
$ cp /usr/local/hive/lib/*.jar /usr/local/zep/interpreter/jdbc/
```

- 还需要添加hadoop的jar包

若碰到错误：Caused by: java.lang.ClassNotFoundException: org.apache.hadoop.conf.Configuration

需要添加hadoop的jar包，如下：

```bash
$ cp /usr/local/hadoop/share/hadoop/common/hadoop-common-3.2.2.jar /usr/local/zep/interpreter/jdbc/
```

### 23.4、启动与停止

- 启动

```bash
$ zeppelin-daemon.sh start
```

访问：http://emon:8080/#/

- 配置hive

在访问页面后，点击右上角`anonymous`=>下拉菜单选择`Interpreter`=>搜索框检索`jdbc`=>点击`edit`配置hive的jdbc：

default.url：jdbc:hive2://emon:10000

default.user：emon

default.driver：org.apache.hive.jdbc.HiveDriver

修改后，保存！

- 执行sql

```sql
select * from app_warehousedb.app_user_platform_distrib
```

- 查看启动状态

```bash
$ zeppelin-daemon.sh status
```

- 停止

```bash
$ zeppelin-daemon.sh stop
```

