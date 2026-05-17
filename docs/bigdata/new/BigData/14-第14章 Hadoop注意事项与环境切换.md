# 第14章 Hadoop注意事项与环境切换

### 14.1、Hadoop注意事项

#### 14.1.1、Hadoop的客户端节点

1.在实际工作中不建议直接连接集群中的节点来操作集群，直接把集群中的节点暴露给普通开发人员是不安全的。

2.建议在业务及其上安装Hadoop，这样就可以在业务机器上操作Hadoop集群了，此机器就称为是Hadoop的客户端节点。

3.Hadoop的客户端节点是没有数量限制的。

4.拷贝一份主节点的hadoop安装目录，即可作为客户端；不要启动，仅作为命令依赖。

#### 14.1.2、HDFS特性

hdfs不适合小文件存储。

### 14.2、Hadoop环境切换

**备注**：如果`/usr/local/hadoop/etc/hadoop/slaves`配置了主机名，但主机名在`/etc/hosts`定义为`127.0.0.1  emon`会有本地可以查看文件内容，但JavaAPI无法执行open出hdfs文件内容的问题；但如果主机名要配置为`192.168.1.116    emon`这样时，在公司和家里切换麻烦，写了如下切换的脚本。

```bash
$ vim bin/switchHadoopIP.sh 
```

```bash
#!/bin/bash

source /home/emon/bin/switchHosts.sh

if [ $? -ne 0 ]; then
    echo -e "\e[1;31m 失败！\e[0m"
    exit 0
else
    echo -e "\e[1;34m 成功！\e[0m"
fi

# 启动或停止hadoop函数
function mgr() {
    cmd=$1
    startOrStop=$2
    nodeName=$3
    echo -e "\e[1;34m 开始执行命令 $cmd $startOrStop $nodeName \e[0m"
    if [ -n $nodeName ]; then
        $cmd $startOrStop $nodeName
    elif [ -n $startOrStop ]; then
        $cmd $startOrStop
    else
        $cmd
    fi
    result=$?
    if [ $result -ne 0 ]; then
        echo -e "\e[1;31m 执行命令 $cmd $startOrStop $nodeName 失败！\e[0m"
        exit 0;
    else
        echo -e "\e[1;34m 执行命令 $cmd $startOrStop $nodeName 成功！\e[0m"
    fi
}

mgr /usr/local/hadoop/sbin/hadoop-daemon.sh stop namenode

mgr /usr/local/hadoop/sbin/hadoop-daemon.sh stop datanode

sleep 3

mgr /usr/local/hadoop/sbin/hadoop-daemon.sh start namenode

mgr /usr/local/hadoop/sbin/hadoop-daemon.sh start datanode

sleep 5

mgr /usr/local/hadoop/sbin/stop-yarn.sh

mgr /usr/local/hadoop/sbin/start-yarn.sh

echo -e "\e[1;32m 成功启动Hadoop HDFS，对应环境 " $ENV_NAME"("$ENV_VALUE")\e[0m"
```

- 切换到house环境

```bash
$ ~/bin/switchHadoopIP.sh house
```

- 切换到company环境

```bash
$ ~/bin/switchHadoopIP.sh company
```

### 14.3、Hadoop学习碰到的问题

- 问题1

  - 问题描述

  ```tex
  [ERROR] method:org.apache.hadoop.util.Shell.getWinUtilsPath(Shell.java:425)
  Failed to locate the winutils binary in the hadoop binary path
  java.io.IOException: Could not locate executable null\bin\winutils.exe in the Hadoop binaries.
  ```

  - 问题原因

  原因：window本地无法获取hadoop的配置

  - 解决办法

  下载： https://archive.apache.org/dist/hadoop/core/hadoop-2.6.0/ 并解压到本地 【废弃】

  下载： https://github.com/srccodes/hadoop-common-2.2.0-bin/tree/master/bin 并解压到本地

  ```bash
  # dirPathOfBinParent 是指 hadoop-common-2.2.0-bin 解压后的包含bin的那个目录路径
  System.setProperty("hadoop.home.dir", "dirPathOfBinParent");
  ```

- 问题2

  - 问题描述

  ```bash
  Exception in thread "main" java.lang.UnsatisfiedLinkError: org.apache.hadoop.io.nativeio.NativeIO$Windows.access0(Ljava/lang/String;I)Z
  ```

  - 问题原因

  ```tex
  出现原因：在新版本的windows系统中，会取消部分文件，某些功能无法支持。本地的NativeIO无法写入，我们需要再写一个NativeIO的类，放入代码片段的包中；
  ```

  - 解决办法

  **留白留白留白留白留白**



