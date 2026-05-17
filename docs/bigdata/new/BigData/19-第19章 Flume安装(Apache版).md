# 第19章 Flume安装（Apache版）

### 19.1、安装Flume（Apache版）

1. 下载

最新发行版下载页面：https://flume.apache.org/download.html

历史发行版下载页面：http://archive.apache.org/dist/flume/

```bash
$ wget -cP /usr/local/src/ https://dlcdn.apache.org/flume/1.9.0/apache-flume-1.9.0-bin.tar.gz --no-check-certificate
```

2. 创建安装目录

```bash
$ mkdir /usr/local/Flume
```

3. 解压安装

```bash
$ tar -zxvf /usr/local/src/apache-flume-1.9.0-bin.tar.gz -C /usr/local/Flume/
```

4. 创建软连接

```bash
$ ln -snf /usr/local/Flume/apache-flume-1.9.0-bin/ /usr/local/flume
```

5. 配置环境变量

在`/etc/profile.d`目录创建`flume.sh`文件：

```bash
$ sudo vim /etc/profile.d/flume.sh
export FLUME_HOME=/usr/local/flume
export PATH=$FLUME_HOME/bin:$PATH
```

使之生效：

```bash
$ source /etc/profile
```

6. 目录规划

```bash
$ mkdir /usr/local/flume/config
```

7. 配置文件

- 复制`flume-env.sh.template`到`flume-env.sh`

```bash
$ cp /usr/local/flume/conf/flume-env.sh.template /usr/local/flume/conf/flume-env.sh
```

- 编辑`flume-env.sh`

```bash
$ vim /usr/local/flume/conf/flume-env.sh
```

```bash
# [新增]
export JAVA_HOME=${JAVA_HOME}
```



