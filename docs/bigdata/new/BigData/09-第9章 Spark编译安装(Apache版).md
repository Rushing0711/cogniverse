# 第9章 Spark编译安装（Apache版）

### 9.1.1、Spark编译安装（外部HDFS和YARN）：基于Apache版Hadoop

#### 9.1.1.1、编译

1. 下载源码

官网地址：http://spark.apache.org/

下载地址：http://spark.apache.org/downloads.html

各个版本：https://archive.apache.org/dist/spark/

```bash
$ wget -cP /usr/local/src/ https://archive.apache.org/dist/spark/spark-2.4.8/spark-2.4.8.tgz --no-check-certificate
```

2. 解压

```bash
$ tar -zxvf /usr/local/src/spark-2.4.8.tgz -C /usr/local/src/
```

3. 编译

参考文档：https://spark.apache.org/docs/2.4.8/building-spark.html

>Spark源码编译的3大方式：
>
>1、Maven编译
>
>2、SBT编译
>
>3、打包编译make-distribution.sh
>
>切记：不同版本的Spark对环境的依赖不同，比如Spark2.4.8的版本依赖Maven 3.5.4，JDK8和Scala2.12；具体参考官网！

- 切换目录

```bash
$ cd /usr/local/src/spark-2.4.8
```

- 编译之前查看

```bash
[emon@emon spark-2.4.8]$ ./dev/make-distribution.sh --help
+++ dirname ./dev/make-distribution.sh
++ cd ./dev/..
++ pwd
+ SPARK_HOME=/usr/local/Spark/spark-2.4.8
+ DISTDIR=/usr/local/Spark/spark-2.4.8/dist
+ MAKE_TGZ=false
+ MAKE_PIP=false
+ MAKE_R=false
+ NAME=none
+ MVN=/usr/local/Spark/spark-2.4.8/build/mvn
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

命令要求：基于`Maven3.5.4及以上`、`JAVA 8`、`Scala 2.12`

```bash
# 这种自己编译的方式，对local模式的spark-shell支持不够，会遇到 问题2
[emon@emon spark-2.4.8]$ ./dev/make-distribution.sh --name hadoop3.3.1 --tgz -Phive -Phive-thriftserver -Pyarn -Phadoop-3.1 -Dhadoop.version=3.3.1 -Pscala-2.12
```

命令解释：

`--name`：指定编译后打包的名字，名称组成规则是 spark版本+bin+name，比如 `spark-3.0.3-bin-hadoop3.3.1`

`--tgz`：编译后是一个tgz包

`-Phadoop-3.1`：表示使用hadoop-3.1这个profile

`-Dhadoop.version`：指定hadoop的具体版本是`3.3.1`

`-Pyarn`：可运行在yarn上

`-Phive`：指定hive

编译问题：

问题1：编译时执行了`make-distribution.sh`命令后看到如下信息卡主了

```bash
......省略......
++ grep -v INFO
++ tail -n 1
```

原因：这一步需要检查环境变量信息，慢是正常的，一般等待2-5分钟就开始执行了。当然，由于机器和网络环境，碰到多等一会的情况，也请淡定！开始执行后，整个过程预计10-15分钟！

问题2：

```bash
java.lang.IllegalArgumentException: Unrecognized Hadoop major version number: 3.3.1
  at org.apache.hadoop.hive.shims.ShimLoader.getMajorVersion(ShimLoader.java:174)
  at org.apache.hadoop.hive.shims.ShimLoader.loadShims(ShimLoader.java:139)
  at org.apache.hadoop.hive.shims.ShimLoader.getHadoopShims(ShimLoader.java:100)
  at org.apache.hadoop.hive.conf.HiveConf$ConfVars.<clinit>(HiveConf.java:368)
  at org.apache.hadoop.hive.conf.HiveConf.<clinit>(HiveConf.java:105)
  at java.lang.Class.forName0(Native Method)
  at java.lang.Class.forName(Class.java:348)
  at org.apache.spark.util.Utils$.classForName(Utils.scala:238)
  at org.apache.spark.sql.SparkSession$.hiveClassesArePresent(SparkSession.scala:1128)
  at org.apache.spark.repl.Main$.createSparkSession(Main.scala:102)
  ... 57 elided
<console>:14: error: not found: value spark
       import spark.implicits._
              ^
<console>:14: error: not found: value spark
       import spark.sql
              ^
```

原因：不影响使用，这种自己编译的方式，对local模式的spark-shell支持不够

- 编译成功

编译成功后，可以看到打包后的文件：spark-3.0.3-bin-2.6.0-cdh5.16.2.tgz

转存该文件并退出编译目录：

```bash
[emon@emon spark-2.4.8]$ mv spark-2.4.8-bin-hadoop3.3.1.tgz /usr/local/src/
[emon@emon spark-2.4.8]$ cd
# 清理编译环境
$ rm -rf /usr/local/src/spark-2.4.8
```

#### 9.1.1.2、安装

1. 创建解压目录

```bash
$ mkdir /usr/local/Spark
```

2. 解压安装

```bash
$ tar -zxvf /usr/local/src/spark-2.4.8-bin-hadoop3.3.1.tgz -C /usr/local/Spark/
```

3. 创建软连接

```bash
$ ln -snf /usr/local/Spark/spark-2.4.8-bin-hadoop3.3.1/ /usr/local/spark
```

4. 配置环境变量

在`/etc/profile.d`目录创建`spark.sh`文件：

```bash
$ sudo vim /etc/profile.d/spark.sh
export SPARK_HOME=/usr/local/spark
export PATH=$SPARK_HOME/bin:$PATH
```

使之生效：

```bash
$ source /etc/profile
```

#### 9.1.1.3、Yarn模式

1. 配置

- `spark-env.sh`

```bash
$ cp /usr/local/spark/conf/spark-env.sh.template /usr/local/spark/conf/spark-env.sh
$ vim /usr/local/spark/conf/spark-env.sh
```

```properties
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

#### 9.1.1.4、Standalone独立集群模式

**配置一主两从集群**：

1. 配置

- `spark-env.sh`

```bash
$ cp /usr/local/spark/conf/spark-env.sh.template /usr/local/spark/conf/spark-env.sh
$ vim /usr/local/spark/conf/spark-env.sh
```

```properties
# [新增]
export JAVA_HOME=${JAVA_HOME}
# [新增]
export SPARK_MASTER_HOST=emon
```

2. `slaves`

```bash
$ cp /usr/local/spark/conf/slaves.template /usr/local/spark/conf/slaves
$ vim /usr/local/spark/conf/slaves
```

```bash
# localhost
emon2
emon3
```

3. 拷贝到emon2和emon3

- 确保emon2和emon3创建安装目录

```bash
[emon@emon2 ~]$ mkdir /usr/local/Spark
[emon@emon3 ~]$ mkdir /usr/local/Spark
```

- 拷贝到emon2和emon3安装目录

```bash
$ scp -rq /usr/local/Spark/spark-2.4.8-bin-hadoop3.3.1/ emon@emon2:/usr/local/Spark/
$ scp -rq /usr/local/Spark/spark-2.4.8-bin-hadoop3.3.1/ emon@emon3:/usr/local/Spark/
```

- 配置emon2和emon3上软连接

```bash
[emon@emon2 ~]$ ln -snf /usr/local/Spark/spark-2.4.8-bin-hadoop3.3.1/ /usr/local/spark
[emon@emon3 ~]$ ln -snf /usr/local/Spark/spark-2.4.8-bin-hadoop3.3.1/ /usr/local/spark
```

4. 在主节点启动Spark集群

```bash
$ /usr/local/spark/sbin/start-all.sh 
```

- 验证1

```bash
$ jps
124560 Master
[emon@emon2 ~]$ jps
12824 Worker
[emon@emon3 ~]$ jps
12227 Worker
```

- 验证2

访问： http://emon:8080

可以看到2个Workers节点。

- 验证3：基于spark执行样例测试

```bash
$ spark-submit --class org.apache.spark.examples.SparkPi --master spark://emon:7077 /usr/local/spark/examples/jars/spark-examples*.jar 2
```


