# 第2章 Java线上问题排查

Java官方工具文档：https://docs.oracle.com/javase/8/docs/technotes/tools/unix/index.html

## 2.1 jps命令

**jps**（Java Virtual Machine Process Status Tool)是java提供的一个显示当前所有java进程pid的命令。

```bash
$ jps -help
usage: jps [-help]
       jps [-q] [-mlvV] [<hostid>]

Definitions:
    <hostid>:      <hostname>[:<port>]
```

### 查看java进程和启动类

```bash
# 带参数 -l 可以查询时输出应用程序 main class 的完整 package 名称或者应用程序的 jar 文件完整路径名
$ jps -l
46592 sun.tools.jps.Jps
10913 com.install4j.runtime.launcher.UnixLauncher
111842 service-config-provider.jar
61572 org.elasticsearch.bootstrap.Elasticsearch
111228 service-eureka-provider.jar
```

## 2.2 jinfo命令

查看正在运行的java应用程序的扩展参数，也可以动态修改正在运行的JVM一些参数。

```bash
$ jinfo
Usage:
    jinfo [option] <pid>
        (to connect to running process)
    jinfo [option] <executable <core>
        (to connect to a core file)
    jinfo [option] [server_id@]<remote server IP or hostname>
        (to connect to remote debug server)

where <option> is one of:
    -flag <name>         to print the value of the named VM flag
    -flag [+|-]<name>    to enable or disable the named VM flag
    -flag <name>=<value> to set the named VM flag to the given value
    -flags               to print VM flags
    -sysprops            to print Java system properties
    <no option>          to print both of the above
    -h | -help           to print this help message
```

### JVM参数分类

**标准参数**：-help, -server, -client, -version, -showversion, -cp/-classpath, -javaagent

**X参数（非标准化）**：-Xint（解释执行）, -Xcomp（编译执行）, -Xmixed（混合模式）

**XX参数（非标准化）**：

- Boolean类型：`-XX:[+-]<name>`
  - `-XX:+UseConcMarkSweepGC` 启用CMS垃圾回收器
  - `-XX:+UseG1GC` 启用G1垃圾收集器
  - `-XX:+PrintFlagsInitial` 打印所有的默认参数设置
  - `-XX:+PrintFlagsFinal` 打印最终值
  - `-XX:+PrintGCDetails` 打印GC细节
  - `-XX:+HeapDumpOnOutOfMemoryError` OOM时自动生成DUMP文件

- 非Boolean类型：`-XX:<name>=<value>`
  - `-XX:MaxGCPauseMillis=500` GC最大的停留时间500ms
  - `-Xmx`等价于`-XX:MaxHeapSize`
  - `-Xms`等价于`-XX:InitialHeapSize`
  - `-Xss`等价于`-XX:ThreadStackSize`
  - `-XX:MetaspaceSize=256m` 元空间初始化大小

### 输出当前jvm进程的全部参数和系统属性

```bash
# 输出全部的参数+系统属性
$ jinfo 61572
# 输出全部的参数，仅包含被修改过值的参数
$ jinfo -flags 61572
# 输出系统属性
$ jinfo -sysprops 61572
# 查看指定参数
$ jinfo -flag MaxHeapSize 61572
# 开启/关闭参数
$ jinfo -flag +PrintGC 61572
$ jinfo -flag -PrintGC 61572
```
