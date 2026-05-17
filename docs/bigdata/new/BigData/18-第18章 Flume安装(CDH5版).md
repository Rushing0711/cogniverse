# 第18章 Flume安装（CDH5版）

## 18.1、安装Flume

### 18.1.1、安装（CDH5版）

1. 下载

**注意**：无法避开收费墙下载，暂时无解

2. 创建安装目录

```bash
$ mkdir /usr/local/Flume
```

3. 解压安装

```bash
$ tar -zxvf /usr/local/src/flume-ng-1.6.0-cdh5.16.2.tar.gz -C /usr/local/Flume/
```

**特殊说明**：如下提示，对该包解压无需关注，不影响使用。

> gzip: stdin: decompression OK, trailing garbage ignored
> apache-flume-1.6.0-cdh5.16.2-bin/bin/
> apache-flume-1.6.0-cdh5.16.2-bin/bin/flume-ng.cmd
> apache-flume-1.6.0-cdh5.16.2-bin/bin/flume-ng
> apache-flume-1.6.0-cdh5.16.2-bin/bin/flume-ng.ps1
> tar: Child returned status 2
> tar: Error is not recoverable: exiting now

4. 创建软连接

```bash
$ ln -snf /usr/local/Flume/apache-flume-1.6.0-cdh5.16.2-bin/ /usr/local/flume
```

5. 配置环境变量

在`/etc/profile.d`目录创建`flume.sh`文件：

```
$ sudo vim /etc/profile.d/flume.sh
export FLUME_HOME=/usr/local/flume
export PATH=$FLUME_HOME/bin:$PATH
```

使之生效：

```
$ source /etc/profile
```

6. 目录规划

```bash
$ mkdir /usr/local/flume/config
```

7. 配置文件

- 复制`flume-env.sh.template `到`flume-env.sh`

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

