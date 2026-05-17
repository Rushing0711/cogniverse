# 第4章 jmap与堆分析

## 4.1 jmap命令介绍

```bash
$ jmap -h
Usage:
    jmap [option] <pid>
        (to connect to running process)
    jmap [option] <executable <core>
        (to connect to a core file)
    jmap [option] [server_id@]<remote server IP or hostname>
        (to connect to remote debug server)

where <option> is one of:
    <none>               to print same info as Solaris pmap
    -heap                to print java heap summary
    -histo[:live]        to print histogram of java object heap
    -clstats             to print class loader statistics
    -finalizerinfo       to print information on objects awaiting finalization
    -dump:<dump-options> to dump java heap in hprof binary format
    -F                   force
    -h | -help           to print this help message
    -J<flag>             to pass <flag> directly to the runtime system
```

## 4.2 查看进程的内存映像信息

```bash
$ jmap 61572
```

## 4.3 显示Java堆详细信息

```bash
$ jmap -heap 61572
```

扩展知识：
- `-XX:NewRatio`：新生代和老年代的比值，2表示新生代:老年代=1:2
- `-XX:SurvivorRatio`：两个Survivor区和eden的比，8表示from:to:eden=1:1:8
- JVM每次只会使用Eden和其中的一块Survivor区域来为对象服务

## 4.4 显示堆中对象的统计信息

```bash
$ jmap -histo:live 61572 > 61572.log
```

拓展：

```bash
# 统计实例最多的类，前10位
jmap -histo 61572 | sort -n -r -k 2 | head -10
# 统计合计容量前10的类
jmap -histo 61572 | sort -n -r -k 3 | head -10
```

## 4.5 生成堆转存快照

```bash
$ jmap -dump:live,format=b,file=61572.hprof 61572
# 解析并查看转存快照的内容
$ jhat 61572.hprof
```

**说明：**以hprof二进制格式转储Java堆到指定的filename文件中。live子选项是可选的。

**强调：**该命令执行，JVM会将整个heap的信息dump写入到一个文件，heap如果比较大，会耗时久；并且执行的过程中为了保证dump的信息是可靠的，所以会暂停应用。**线上系统慎用**。

## 4.6 打印类加载器信息

```bash
$ jmap -clstats 61572
```

## 4.7 打印等待终结的对象信息

```bash
$ jmap -finalizerinfo 61572
```

`Number of objects pending for finalization: 0`说明当前F-QUEUE队列中并没有等待Finalize线程执行finalizer方法的对象。
