# 第8章 Spark编译安装（CDH5版）

## 8.1、安装Spark

### 8.1.1、Spark编译安装（外部HDFS和Yarn）：基于CDH5版Hadoop

目录规划：

| 目录                           | 作用               |
| ------------------------------ | ------------------ |
| /usr/local/spark/custom/lib    | jar库文件          |
| /usr/local/spark/custom/shell  | 脚本文件           |
| /usr/local/spark/custom/source | 存放源码资源的目录 |

#### 8.1.1.1、编译

1. 下载源码

官网地址：http://spark.apache.org/

下载地址：http://spark.apache.org/downloads.html

各个版本：https://archive.apache.org/dist/spark/

```bash
$ wget -cP /usr/local/src/ https://dlcdn.apache.org/spark/spark-3.0.3/spark-3.0.3.tgz --no-check-certificate
```

2. 解压

```bash
$ tar -zxvf /usr/local/src/spark-3.0.3.tgz -C /usr/local/src/
```

3. 编译

参考文档：https://spark.apache.org/docs/3.0.3/building-spark.html

> Spark源码编译的3大方式：
>
> 1、Maven编译
>
> 2、SBT编译
>
> 3、打包编译make-distribution.sh
>
> 切记：不同版本的Spark对环境的依赖不同，比如Spark3.0.3的版本依赖Maven3.6.3，JDK8和Scala2.12；具体参考官网！

- 切换目录

```bash
$ cd /usr/local/src/spark-3.0.3/
```

- 编辑`pom.xml`内容

```bash
# 在<repositories>元素最后一行
[emon@emon spark-3.0.3]$ vim pom.xml 
```

```xml
    <!--引入cdh的仓库，确保maven的镜像是放开cloudera的-->
    <repository>
        <id>cloudera</id>
        <url>https://repository.cloudera.com/artifactory/cloudera-repos</url>
    </repository>
```

- 编译之前查看

```bash
[emon@emon spark-3.0.3]$ ./dev/make-distribution.sh --help
+++ dirname ./dev/make-distribution.sh
++ cd ./dev/..
++ pwd
+ SPARK_HOME=/usr/local/Spark/spark-3.0.3
+ DISTDIR=/usr/local/Spark/spark-3.0.3/dist
+ MAKE_TGZ=false
+ MAKE_PIP=false
+ MAKE_R=false
+ NAME=none
+ MVN=/usr/local/Spark/spark-3.0.3/build/mvn
+ ((  1  ))
+ case $1 in
+ exit_with_usage
+ set +x
make-distribution.sh - tool for making binary distributions of Spark

usage:
make-distribution.sh [--name] [--tgz] [--pip] [--r] [--mvn <mvn-command>] <maven build options>
See Spark's "Building Spark" doc for correct Maven options.
```

- 启动编译

命令要求：基于`Maven 3.6.3`、`Java 8`、`Scala 2.12`

```bash
[emon@emon spark-3.0.3]$ ./dev/make-distribution.sh --name 2.6.0-cdh5.16.2 --tgz -Phive -Phive-thriftserver -Pyarn -Phadoop-2.7 -Dhadoop.version=2.6.0-cdh5.16.2
```

命令解释：

`--name`：指定编译后打包的名字，名称组成规则是 spark版本+bin+name，比如 `spark-3.0.3-bin-2.6.0-cdh5.16.2`

`--tgz`：编译后是一个tgz包

`-Phadoop-2.7`：表示使用hadoop-2.7这个profile

`-Dhadoop.version`：指定hadoop的具体版本是`2.6.0-cdh5.16.2`

`-Pyarn`：可运行在yarn上

`-Phive`：指定hive

编译问题：

问题1：

> Client.scala:298: value setRolledLogsIncludePattern is not a member of org.apache.hadoop.yarn.api.records.LogAggregationContext

原因：Spark3.x对hadoop2.x支持有问题，需要手动修改源码：

https://github.com/apache/spark/pull/16884/files

问题2：如果有jar依赖找不到，请检查maven的资源库中，清理掉XXX.pom.lastUpdated重试。

- 编译成功

编译成功后，可以看到打包后的文件：spark-3.0.3-bin-2.6.0-cdh5.16.2.tgz

转存该文件并退出编译目录：

```bash
[emon@emon spark-3.0.3]$ mv spark-3.0.3-bin-2.6.0-cdh5.16.2.tgz /usr/local/src/
[emon@emon spark-3.0.3]$ cd
# 清理编译环境
$ rm -rf /usr/local/src/spark-3.0.3
```

#### 8.1.1.2、安装

1. 创建解压目录

```bash
$ mkdir /usr/local/Spark
```

2. 解压安装

```bash
$ tar -zxvf /usr/local/src/spark-3.0.3-bin-2.6.0-cdh5.16.2.tgz -C /usr/local/Spark/
```

3. 创建软连接

```bash
$ ln -snf /usr/local/Spark/spark-3.0.3-bin-2.6.0-cdh5.16.2/ /usr/local/spark
```

4. 配置环境变量

在`/etc/profile.d`目录创建`spark.sh`文件：

```bash
$ sudo vim /etc/profile.d/spark.sh
export SPARK_HOME=/usr/local/spark
export PATH=$SPARK_HOME/bin:$PATH
```

使之生效：

```
$ source /etc/profile
```

#### 8.1.1.3、YARN模式

1. 配置

- `spark-env.sh`

```bash
$ cp /usr/local/spark/conf/spark-env.sh.template /usr/local/spark/conf/spark-env.sh
$ vim /usr/local/spark/conf/spark-env.sh
# [新增]
export JAVA_HOME=${JAVA_HOME}
# [新增]
# 避免spark on yarn时When running with master 'yarn' either HADOOP_CONF_DIR or YARN_CONF_DIR must be set in the environment.
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
```

2. 测试

前提条件：Hadoop启动，YARN服务启动，`HADOOP_CONF_DIR`或`YARN_CONF_DIR`环境变量已成功配置。

- 样例测试：基于yarn执行样例测试

```bash
$ spark-submit --class org.apache.spark.examples.SparkPi --master yarn --deploy-mode cluster /usr/local/spark/examples/jars/spark-examples*.jar 2
```

自定义测试

- [依赖项目](https://github.com/EmonCodingBackEnd/backend-spark-learning)
- 上传自定义jar

`git clone git@github.com:EmonCodingBackEnd/backend-spark-learning.git`并打包`spark-ss`模块，上传jar到spark：

```bash
scp spark-ss-1.0-SNAPSHOT.jar emon@emon:/usr/local/spark/custom/lib
```

- 模拟9527端口发送数据

```bash
# 命令回车后会进入输入状态，输入内容回车即可
nc -lk 9527
```

- 执行

```bash
$ spark-submit --class com.coding.bigdata.ss.NetworkWordCountApp --master yarn /usr/local/spark/custom/lib/spark-ss-1.0-SNAPSHOT.jar 2
```

- 在nc窗口输入内容，比如： a,a,a,b,b,c 之后回车，可以在执行窗口看到输出的统计结果。

