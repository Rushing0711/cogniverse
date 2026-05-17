# 第22章 Sqoop安装

## 22.1、安装Sqoop

### 22.1、依赖环境

- Hadoop客户端环境

### 22.2、安装Sqoop（1版本）

#### 22.2.1、安装

1. 下载

下载地址：http://archive.apache.org/dist/sqoop/

```bash
$ wget -cP /usr/local/src/ http://archive.apache.org/dist/sqoop/1.4.7/sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz
```

2. 创建安装目录

```bash
$ mkdir /usr/local/Sqoop
```

3. 解压安装

```bash
$ tar -zxvf /usr/local/src/sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz -C /usr/local/Sqoop/
```

4. 创建软连接

```bash
$ ln -snf /usr/local/Sqoop/sqoop-1.4.7.bin__hadoop-2.6.0/ /usr/local/sqoop
```

5. 配置环境变量

```bash
$ sudo vim /etc/profile.d/sqoop.sh
export SQOOP_HOME=/usr/local/sqoop
export PATH=$SQOOP_HOME/bin:$PATH
```

使之生效：

```bash
$ source /etc/profile
```

6. 配置文件

- 复制`sqoop-env-template.sh`到`flume-env.sh`

```bash
$ cp /usr/local/sqoop/conf/sqoop-env-template.sh /usr/local/sqoop/conf/sqoop-env.sh
```

7. 为sqoop库

- 加入mysql的jar包

```bash
$ cp /usr/local/src/mysql-connector-java-5.1.27-bin.jar /usr/local/sqoop/lib/
```

