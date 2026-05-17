# 第5章 jstat与GC监控

概念：用于监控虚拟机各种运行状态信息的命令行工具，可以显示在虚拟机进程中的类装载、内存、垃圾收集、JIT编译等运行数据。

## 5.1 命令介绍

```bash
$ jstat -h
Usage: jstat -help|-options
       jstat -<option> [-t] [-h<lines>] <vmid> [<interval> [<count>]]
```

option参数选项：

```bash
$ jstat -options
-class                显示ClassLoad的相关信息；
-compiler             显示JIT编译的相关信息；
-gc                   显示和gc相关的堆信息；
-gccapacity           显示各个代的容量以及使用情况；
-gccause              显示垃圾回收的相关信息；
-gcmetacapacity       显示metaspace的大小
-gcnew                显示新生代信息；
-gcnewcapacity        显示新生代大小和使用情况；
-gcold                显示老年代和永久代信息；
-gcoldcapacity        显示老年代的大小和使用情况；
-gcutil               显示垃圾收集信息；
-printcompilation     输出JIT编译的方法信息；
```

## 5.2 常用命令示例

- 显示加载class的数量：`jstat -class 61572`
- 显示VM实时编译信息：`jstat -compiler 61572`
- 显示gc相关的堆信息：`jstat -gc 61572`

gc输出说明：
- `S0C/S1C` 年轻代中survivor的容量（KB）
- `EC/EU` 年轻代中Eden的容量/已使用空间（KB）
- `OC/OU` Old代的容量/已使用空间（KB）
- `MC/MU` metaspace的容量/已使用空间（KB）
- `YGC/YGCT` 新生代中gc次数/时间（秒）
- `FGC/FGCT` 堆全GC次数/时间（秒）
- `GCT` 垃圾回收总消耗时间（秒）

- 显示VM内存中三代对象的使用和占用大小：`jstat -gccapacity 61572`
- 统计gc信息：`jstat -gcutil 61572`

```bash
$ jstat -gcutil 61572
  S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT     GCT
  0.00   3.35  71.82  64.55  90.49  80.94   8441   51.578 57645 1527.104 1578.681
```

- 显示垃圾回收的诱因：`jstat -gccause 61572`
- 当前VM执行的信息：`jstat -printcompilation 61572`

## 5.3 Arthas（阿尔萨斯）

Alibaba开源的Java诊断工具。

### 快速安装（推荐）

```bash
$ curl -O https://arthas.aliyun.com/arthas-boot.jar
# 打印帮助信息
$ java -jar arthas-boot.jar -h
# 启动
$ java -jar arthas-boot.jar
```

### 常用命令

- 基础命令：`help`, `cls`, `session`, `version`, `history`, `quit`, `stop`, `keymap`
- jvm相关：`dashboard`, `thread`, `jvm`, `sysprop`, `sysenv`, `vmoption`, `perfcounter`

### dashboard示例

```bash
[arthas@10913]$ dashboard -i 2000 -n 5
```

### thread示例

```bash
thread -n 3          # 查询最忙的N个线程
thread               # 查询所有线程信息
thread 1             # 显示指定线程的运行堆栈
thread -b            # 找出当前阻塞其他线程的线程
thread -n 3 -i 1000  # 指定采样时间间隔
thread --state WAITING # 查看指定状态的线程
```

## 5.4 top命令

top命令是动态查看进程变化，监控linux的系统状况。

```bash
top - 17:09:27 up 9 days,  8:04,  1 user,  load average: 0.00, 0.02, 0.05
Tasks: 171 total,   2 running, 169 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.0 us,  0.1 sy,  0.0 ni, 99.9 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  4893456 total,  1122660 free,  1790328 used,  1980468 buff/cache
```

### 常用交互命令

- `1` 显示CPU平均状态/分开显示各个逻辑CPU状态
- `m` 切换显示内存统计的数据
- `c` 切换显示命令/程序名和参数
- `H` 开启/关闭线程模式
- `q` 退出

```bash
# 显示某个进程所有活跃的线程消耗情况
$ top -H -p pid
```

## 5.5 jvisualvm

如何为Java VisualVM安装插件？

插件地址：https://visualvm.github.io/pluginscenters.html

配置之后，点击【可用插件】面板，选择Visual GC 和 BTrace Workbench插件。
