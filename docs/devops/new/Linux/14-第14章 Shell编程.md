# 第14章 Shell编程

## 14.1 基本介绍

- 为什么要学习Shell编程

1. Linux运维工程师在进行服务器集群管理时，需要编写Shell程序来进行服务器管理。
2. 对于JavaEE和Python程序员来说，工作的需要，你的老大会要求你编写一些Shell脚本进行程序或者是服务器的维护，比如编写一个定时备份数据库的脚本。
3. 对于大数据程序员来说，需要编写Shell程序来管理集群。

- Shell是什么

Shell是一个命令行解释器，它为用户提供了一个向Linux内核发送请求以便运行程序的界面系统级程序，用户可以用Shell来启动、挂起、停止甚至是编写一些程序。

## 14.2 Shell脚本的执行方式

- 脚本格式要求

1. 脚本以`#!/bin/bash`开头
2. 脚本需要有可执行权限

- 编写第一个Shell脚本

需求说明：创建一个Shell脚本，输出hello world！

```bash
% vim hello.sh
```

```bash
#!/bin/bash
echo "hello world!"
```

- 脚本的常用执行方式

1. 方式1（输入脚本的绝对路径或相对路径）

说明：首先要赋予helloworld.sh脚本的+x权限，再执行脚本。

```bash
% chmod u+x hello.sh
% ./hello.sh
```

2. 方式2（sh+脚本）

说明：不用赋予脚本+x权限，直接执行即可。

```bash
% sh hello.sh
```

## 14.3 Shell的变量

- Shell变量介绍

1. Linux Shell中的变量分为，系统变量和用户自定义变量。
2. 系统变量：$HOME、$PWD、$SHELL、$USER等等，比如： echo $HOME 等等。
3. 显示当前shell中所有变量：set

```bash
% set | more
```

- Shell变量的定义

1. 定义变量：`变量名=值`
2. 撤销变量：`unset 变量`
3. 声明静态变量（readonly变量），注意：不能 unset
4. 变量名的规则
    1. 变量名可以由字母、数字和下划线组成，但是不能以数字开头。
    2. 等号两侧不能有空格。
    3. 变量名称一般习惯为大写，这时一个规范，我们遵守即可。
5. 将指令的返回值赋值给变量
    1. A=\`date\` 反引号，运行里面的命令，并把结果返回给变量A
    2. A=$(date) 等价于反引号
6. 读取变量值
    1. ${变量}
    2. $变量


- 应用实例

```bash
% vim var.sh
```

```bash
#!/bin/bash
# 案例1:定义变量A
A=100
# 输出变量A
echo A=$A
echo "A=$A"
# 案例2:撤销变量A
unset A
echo "A=$A"
# 案例3:声明静态的变量B=2,不能unset
readonly B=2
echo "B=$B"
# 对B执行unset会报错:"unset: B: 无法反设定: 只读 variable"
# unset B
# 将指令返回的结果赋值给变量
C=`date`
D=$(date)
echo "C=$C"
echo "D=$D"
```

## 14.3 设置环境变量

- 基本语法

1. `export 变量名=变量值` （功能描述：将shell变量输出为环境变量/全局变量）
2. `source 配置文件` （功能描述：让修改后的配置信息立即生效）
3. `echo $变量名` （功能描述：查询环境变量的值）

- 快速入门

1. 在 /etc/profile 文件中定义 TOMCAT_HOME 环境变量

```bash
% vim /etc/profile
```

```bash
# 定义一个环境变量
export TOMCAT_HOME=/usr/local/tomcat
```

```bash
% source /etc/profile
```

2. 查看环境变量 TOMCAT_HOME 的值

```bash
% echo $TOMCAT_HOME
```

- Shell脚本的多行注释

`:<<! `

`内容 `

`!`

示例：

```bash
:<<!
C=`date`
D=$(date)
echo "C=$C"
echo "D=$D"
!
```

## 14.4 位置参数变量

- 介绍

当我们执行一个shell脚本时，如果希望获取到命令行的参赛信息，就可以使用到位置参数变量。

比如：`./myshell.sh 100 200`，这个就是一个执行shell的命令行，可以在myshell.sh脚本中获取到参数信息。

```bash
% vim myshell.sh
```

```bash
#!/bin/bash
echo "0=$0 1=$1 2=$2"
echo "所有的参数 $*"
echo "所有的参数 $@"
echo "参数的个数 $#"
```

```bash
% sh myshell.sh 100 200
0=myshell.sh 1=100 2=200
所有的参数 100 200
所有的参数 100 200
参数的个数 2
```

- 基本语法

`$n` （功能描述：n为数字，$0代表命令本身，$1-$9代表第一到第九个参数，十以上的参数，需要用大括号包含，${10}）

`$*` （功能描述：这个变量代表命令行中所有的参数，$*把所有的参数看成一个整体）

`$@` （功能描述：这个变量也代表命令行中的所有参数，不过$@把每个参数区分对待）

`$#` （功能描述：这个变量代表命令行中所有参数的个数）

- 扩展：**`exec "$@"` 的作用**

将脚本接收到的所有参数作为一个新命令来执行，并**完全替换当前脚本进程**。

示例：

```bash
$ vim add-hosts.sh
```

```bash
#!/bin/bash
# 若系统需要通过域名访问外部系统，才需要该配置。示例如下：
grep -q "x.y.z" /etc/hosts || echo "1.1.1.1 x.y.z" >> /etc/hosts
exec "$@"
```

这样一来，`add-hosts.sh`脚本被其他脚本引入人执行时，就会加入当前脚本进程。

典型场景：

1. **容器启动脚本**（如 Docker 的 `ENTRYPOINT` 脚本）：
   在脚本中完成初始化后，通过 `exec "$@"` 启动主进程（如 Java、Nginx），使主进程成为 PID 1，从而正确处理信号（如 `SIGTERM`）。
2. **包装器脚本**：
   在运行实际命令前执行一些预处理（如环境检查、配置生成），最后通过 `exec "$@"` 透明地传递控制权。

## 14.5 预定义变量

- 基本介绍

就是shell设计者事先已经定义好的变量，可以直接在shell脚本中使用。

- 基本语法

`$$` （功能描述：当前进程的进程号（PID））

`$!` （功能描述：后台运行的最后一个进程的进程号（PID））

`$?` （功能描述：最后一次执行的命令的返回状态。如果这个变量的值为0，证明上一个命令正确执行；如果这个变量的值为非0（具体是哪个数，由命令自己来决定）。则证明上一个命令执行不正确了。）

- 应用实例

在一个shell脚本中简单使用一下预定义变量。

```bash
% vim preVar.sh
```

```bash
#!/bin/bash
echo "当前执行的进程id=$$"
# 以后台的方式运行一个脚本,并获取他的进程号
sh /root/shcode/myshell.sh &
echo "最后一个后台方式运行的进程id=$!"
echo "执行的结果是result=$?"
```

## 14.6 运算符

- 基本介绍

学习如何在shell中进行各种运算操作。

- 基本语法

1. `"$((运算式))"` 或 `"$[运算式]"` 或者 `expr m + n`
2. 注意 `expr` 运算符间要有空格，如果希望将expr表达式的结果赋值给变量，那么需要对expr表达式，使用反引号\`expr\`包裹在内。
3. `expr m - n`
4. `expr \*,/,%` 乘，除，取舍

- 应用实例

案例1：计算（2+3）✖️ 4 的值

案例2：请求出命令行的两个参数[整数]的和

```bash
% vim oper.sh
```

```bash
#!/bin/bash
# 案例1：计算（2+3）✖️ 4 的值
# 使用第一种方式
RES1=$(((2+3)*4))
echo "res1=$RES1"
# 使用第二种方式,推荐使用
RES2=$[(2+3)*4]
echo "res2=$RES2"
# 使用第三种方式
TEMP=`expr 2 + 3`
RES3=`expr $TEMP \* 4`
echo "res3=$RES3"
# 案例2：请求出命令行的两个参数[整数]的和
SUM=$[$1+$2]
echo "SUM=$SUM"
```

## 14.7 条件判断

- 基本语法

`[ condition ]` （注意condition前后要有空格）

非空返回true，可使用`$?`验证（0为true，>1为false）

- 应用实例

`[ wenqiu ]` 结果为：true

`[ ]` 结果为：false

`[ condition ] && echo OK || echo notok`

- 常用判断条件

| 操作符        | 含义                                    |
|------------|---------------------------------------|
| 字符串比较      |                                       |
| =          | 比较字符串内容是否相同。                          |
| !=         | 比较字符串内容是否不同。                          |
| -n         | 判断字符串是否为空，非空时为真。                      |
| -z         | 判断字符串内容是否为空，空时为真。                     |
| =~         | 判断字符串内容是否包含。用法，[[ $VAR =~ "string" ]] |
| 两个整数的比较    |                                       |
| -lt        | 小于                                    |
| -le        | 小于等于                                  |
| -eq        | 等于                                    |
| -gt        | 大于                                    |
| -ge        | 大于等于                                  |
| -ne        | 不等于                                   |
| 按照文件权限进行判断 |                                       |
| -r         | 有读的权限                                 |
| -w         | 有写的权限                                 |
| -x         | 有执行的权限                                |
| 按照文件类型进行判断 |                                       |
| -f         | 文件存在并且是一个常规的文件                        |
| -e         | 文件存在                                  |
| -d         | 文件存在并是一个目录                            |

- 应用案例

案例1 ："ok"是否等于"ok"

案例2 ：23是否大于等于22

案例3 ：/root/shcode/aaa.txt 目录中的文件是否存在

```bash
% vim ifdemo.sh
```

```bash
#!/bin/bash
# 案例1 ："ok"是否等于"ok"
if [ "ok" = "ok" ]
then
        echo "相等"
else
        echo "不等"
fi
# 案例2 ：23是否大于等于22
if [ 23 -ge 22 ]
then
        echo "大于"
fi
# 案例3 ：/root/shcode/aaa.txt 目录中的文件是否存在
if [ -f /root/shcode/aaa.txt ]
then
        echo "文件存在,是普通文件"
else
        echo "文件根本不存在"
fi
# 其他案例
if [ ]
then
        echo "为真"
else
        echo "为假"
fi

if [ wenqiu ]
then
        echo "为真的"
fi
```

## 14.8 流程控制

### 14.8.1 if判断

- 基本语法

```bash
if [条件判断式]
then
代码
fi
```

或者多分支

```bash
if [条件判断式]
then
代码
elif [条件判断式]
then
代码
fi
```

注意事项：`[ 条件判断式 ]`，中括号和条件判断式之间必须有空格。

- 案例：

案例1：请编写一个shell程序，如果输入的参数，大于等于60，则输出”及格了“，如果小于60，则输出”不及格“。

```bash
% vim ifcase.sh
```

```bash
#!/bin/bash
# 案例1：请编写一个shell程序，如果输入的参数，大于等于60，则输出”及格了“，如果小于60，则输出”不及格“。
if [ $1 -ge 60 ]
then
        echo "及格了"
elif [ $1 -lt 60 ]
then
        echo "不及格"
fi
```

### 14.8.2 case语句

- 基本语法

```bash
case $变量名 in
"值1")
如果变量的值等于值1，则执行程序1
;;
"值2")
如果变量的值等于值2，则执行程序2
;;
...省略其他分支...
*)
如果变量的值都不是以上的值，则执行此程序
;;
esac
```

- 应用实例

案例1：当命令行参数是 1 时，输出 ”周一“，是 2 时，就输出”周二“，其他情况输出”other“

```bash
% vim testcase.sh
```

```bash
#!/bin/bash
# 案例1：当命令行参数是 1 时，输出 ”周一“，是 2 时，就输出”周二“，其他情况输出”other“
case $1 in
"1")
        echo "周一"
;;
"2")
        echo "周二"
;;
* )
        echo "other"
esac
```

### 14.8.3 for循环

- 基本语法

```bash
for 变量 in 值1 值2 值3...
do
程序
done
```

或者

```bash
# 注意，括号(后和)前的空格
for (( 初始值;循环控制条件;变量变化 ))
do
程序
done
```

- 应用实例

案例1：打印命令行输入的参数（这里可以看出 $* 和 $@ 的区别）

```bash
% vim testfor1.sh
```

```bash
#!/bin/bash
# 案例1：打印命令行输入的参数（这里可以看出 $* 和 $@ 的区别）
# $*把所有的参数看成一个整体
# $@把每个参数区分对待
for i in "$*"
do
        echo "num is $i"
done

for i in "$@"
do
        echo "num is $i"
done
```

```bash
sh fortest1.sh 1 2 3
num is 1 2 3
num is 1
num is 2
num is 3
```

案例2：从1加到100的值输出显示

```bash
% vim testfor2.sh
```

```bash
#!/bin/bash
# 案例2：从1加到100的值输出显示
SUM=0
for (( i=0;i<=100;i++ ))
do
        SUM=$[$SUM+$i]
done
echo "SUM=$SUM"
```

### 14.8.4 while循环

- 基本语法

```bash
# 注意，括号[后和]前的空格
while [ 条件判断式 ]
do
程序
done
```

- 应用实例

案例1：从命令行输入一个数n，统计从 1+...+n 的值是多少？

```bash
% vim testwhile.sh
```

```bash
#!/bin/bash
# 案例1：从命令行输入一个数n，统计从 1+...+n 的值是多少？
SUM=0
i=0
while [ $i -le $1 ]
do
        SUM=$[$SUM+$i]
        i=$[$i+1]
done
echo "SUM=$SUM"
```

### 14.8.5 read读取控制台输入

- 基本语法

`read (选项) (参数)`

选项：

-p ：指定读取值时的提示符；

-t ：指定读取值时等待的时间（秒），如果没有在指定的时间内输入，就不再等待了。

参数：

变量 ：指定读取值的变量名

- 应用实例

案例1：读取控制台输入一个num值

案例2：读取控制台输入一个num值，在10秒内输入。

```bash
% vim testread.sh
```

```bash
#!/bin/bash
# 案例1：读取控制台输入一个num值
read -p "请输入一个数NUM1=" NUM1
echo "你输入的NUM1=$NUM1"
# 案例2：读取控制台输入一个num值，在10秒内输入。
read -p "请输入一个数NUM2=" -t 10  NUM2
echo "你输入的NUM2=$NUM2"
```

## 14.9 函数

### 14.9.1 系统函数basename

- 函数介绍

shell编程和其他编程语言一样，有系统函数，也可以自定义函数。系统函数中，我们这里就介绍两个。

- 功能：返回完整路径最后 / 的后面的部分，常用于获取文件名

- 基本语法：（功能描述：basename命令会删掉所有的前缀，包括最后一个 '/' 字符，然后将字符串显示出来。）

`basename [pathname] [suffix]`

`basename [string] [suffix]`

选项：

suffix为后缀，如果suffix被指定了，basename会将pathname或string中的suffix去掉。

- 应用实例

案例1：请返回 /home/aaa/test.txt 的”test.txt“部分。

```bash
% basename /home/aaa/test.txt
```

### 14.9.2 dirname函数

- 功能：返回完整路径最后 / 的前面的部分，常用于返回路径部分

- 基本语法

`dirname 文件绝对路径` （功能描述：从给定的包含绝对路径的文件名中去除文件名（非目录的部分），然后返回剩下的路径（目录的部分））

- 应用实例

案例1：请返回 /home/aaa/test.txt 的 /home/aaa

```bash
% dirname /home/aaa/test.txt
```

### 14.9.3 自定义函数

- 基本语法

```bash
[function] funname[()]
{
	Action;
	[return int;]
}
```

调用直接写函数名：`funname [值]`

- 应用实例

案例1：计算输入两个参数的和（动态的获取）

```bash
% vim testfun.sh
```

```bash
#!/bin/bash
# 案例1：计算输入两个参数的和（动态的获取）
# 自定义函数
function getSum() {
        SUM=$[$n1+$n2]
        echo "求和结果是SUM=$SUM"
        return  $SUM
}

# 调用自定义函数
read -p "请输入一个数n1=" n1
read -p "请输入一个数n2=" n2
getSum $n1 $n2
```

## 14.10 shell编程综合案例

- 需求分析

1. 每天凌晨 2:30 备份数据库 testdb 到 /data/backup/db
2. 备份开始和备份结束能够给出相应的提示信息
3. 备份后的文件要求以备份时间为文件名，并打包成 .tar.gz 的形式，比如：2021-03-12_230201.tar.gz
4. 在备份的同时，检查是否有10天前备份的数据库文件，如果有就将其删除。

第一步：创建脚本

```bash
% vim /usr/local/sbin/mysql_db_backup.sh
```

```bash
#!/bin/bash
# 备份目录
BACKUP=/data/backup/db
# 当前时间
DATETIME=`date +%Y-%m-%d-%M%H%S`
echo $DATETIME
# 数据库的地址
HOST=localhost
# 数据库用户名
DB_USER=root
# 数据库密码
DB_PWD=root123
# 备份的数据库名
DATABASE=testdb

# 创建备份目录,如果不存在则创建
[ ! -d "${BACKUP}/$DATETIME" ] && mkdir -p "$BACKUP/$DATETIME"

# 备份数据库
mysqldump -u$DB_USER -p$DB_PWD --host=$HOST -q -R --databases $DATABASE | gzip > "$BACKUP/$DATETIME/$DATETIME.sql.gz"

# 将文件处理成tar.gz格式
cd $BACKUP
tar -zcvf $DATETIME.tar.gz $DATETIME

# 删除对应的备份目录
rm -rf $BACKUP/$DATETIME

# 删除10天之前备份的文件
find $BACKUP -atime +10 -name "*.tar.gz" -exec rm -rf {} \;
echo "备份数据库 $DATABASE 成功"
```

第二步：配置定时任务

```bash
% crontab -l
30 2 * * * sh /usr/local/sbin/mysql_db_backup.sh
```
