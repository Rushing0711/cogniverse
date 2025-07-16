# 第40章 安装Python

### 10.1、安装Python2.7版本【废弃】

1. 检查是否安装

```bash
[emon@wenqiu ~]$ yum list python|tail -n 2
已安装的软件包
python.x86_64                       2.7.5-68.el7                       @anaconda
```

2. 下载

下载页地址： https://www.python.org/ftp/python/

```bash
[emon@wenqiu ~]$ wget -cP /usr/local/src/ https://www.python.org/ftp/python/2.7.15/Python-2.7.15.tar.xz
```

3. 创建解压目录

```bash
[emon@wenqiu ~]$ mkdir /usr/local/Python
```

4. 解压

```bash
[emon@wenqiu ~]$ tar -Jxvf /usr/local/src/Python-2.7.15.tar.xz -C /usr/local/Python/
```

5. 执行配置脚本，并编译安装

- 切换目录并执行配置脚本生成Makefile

```bash
[emon@wenqiu ~]$ cd /usr/local/Python/Python-2.7.15/
[emon@wenqiu Python-2.7.15]$ ./configure --enable-optimizations --prefix=/usr/local/Python/Python2.7.15
```

命令解释：`--enable-optimizations`：启用优化安装，建议使用。

- 编译

```bash
[emon@wenqiu Python-2.7.15]$ make
```

- 安装

```bash
[emon@wenqiu Python-2.7.15]$ make install
[emon@wenqiu Python-2.7.15]$ cd
[emon@wenqiu ~]$ ls /usr/local/Python/Python2.7.15/
bin  include  lib  share
```

6. 创建软连接

```bash
[emon@wenqiu ~]$ ln -s /usr/local/Python/Python2.7.15/ /usr/local/python
```

7. 配置环境变量

```bash
[emon@wenqiu ~]$ sudo vim /etc/profile.d/python.sh
```

```bash
export PYTHON_HOME=/usr/local/python
export PATH=$PYTHON_HOME/bin:$PATH
```

使之生效：

```bash
[emon@wenqiu ~]$ source /etc/profile
```

8. 校验

```bash
[emon@wenqiu ~]$ python -V
Python 2.7.15
```

### 10.2、安装Python3.9版本

Python3.7和Python2.7安装类似，同一时刻环境变量只会指向一个版本。

1. 依赖安装

```bash
# 3.7版本需要一个新的包 libffi-devel，否则make install报错： ModuleNotFoundError: No module named '_ctypes'
[emon@wenqiu ~]$ sudo yum install -y libffi-devel gcc-c++
```

如果是直接安装Python，还需要安装 `gcc-c++`，否则在configure时报错：

> configure: error: in `/usr/local/Python/Python-3.9.9':
> configure: error: no acceptable C compiler found in $PATH

2. 下载

下载页地址： `<https://www.python.org/ftp/python/> `

```bash
[emon@wenqiu ~]$ wget -cP /usr/local/src/ https://www.python.org/ftp/python/3.9.9/Python-3.9.9.tar.xz
```

3. 创建解压目录

```bash
[emon@wenqiu ~]$ mkdir /usr/local/Python
```

4. 解压

```bash
[emon@wenqiu ~]$ tar -Jxvf /usr/local/src/Python-3.9.9.tar.xz -C /usr/local/Python/
```

5. 执行配置脚本，并编译安装

- 切换目录并执行配置脚本生成Makefile

```bash
[emon@wenqiu ~]$ cd /usr/local/Python/Python-3.9.9/
[emon@wenqiu Python-3.9.9]$ ./configure --prefix=/usr/local/Python/Python3.9.9
```

命令解释：`--enable-optimizations`：启用优化安装。

- 编译

```bash
[emon@wenqiu Python-3.9.9]$ make
```

> 安装3.9.9版本时make报错：

SystemError: `<built-in function compile>` returned NULL without setting an error
generate-posix-vars failed
make[1]: *** [pybuilddir.txt] 错误 1
make[1]: 离开目录“/usr/local/Python/Python-3.9.9”
make: *** [profile-opt] 错误 2

> 导致原因：
>
> - 在低版本的gcc版本中带有 `--enable-optimizations `参数时会出现上面问题
> - gcc 8.1.0修复此问题

> 解决方法如下：
>
> - 1、升级gcc至8.1.0【不推荐】
> - 2、`./configure`参数中去掉 `--enable-optimizations`

- 安装

```bash
[emon@wenqiu Python-3.9.9]$ make install
[emon@wenqiu Python-3.9.9]$ cd
[emon@wenqiu ~]$ ls /usr/local/Python/Python3.9.9/
bin  include  lib  share
```

6. 修改软连接

```bash
[emon@wenqiu ~]$ ln -snf /usr/local/Python/Python3.9.9/ /usr/local/python3
```

7. 配置环境变量

```bash
[emon@wenqiu ~]$ sudo vim /etc/profile.d/python3.sh
```

```bash
export PYTHON_HOME=/usr/local/python3
export PATH=$PYTHON_HOME/bin:$PATH
```

使之生效：

```
[emon@wenqiu ~]$ source /etc/profile
```

8. 校验

```bash
[emon@wenqiu ~]$ python3 -V
Python 3.9.9
```

### 10.3、Python工具

`easy_install`和`pip`都是Python的安装工具，其中`pip`是`easy_install`的改进版，提供更好的提示信息，删除package等的功能。老版本python中只有`easy_install`，没有`pip`。

> 创建PyPI(Python Package Index)的安装目录：
>
> [emon@wenqiu ~]$ mkdir /usr/local/PythonPyPI

#### 10.3.1、安装setuptools模块【Python3.9.9无需安装】

在安装其他模块之前，首先要安装setuptools模块，否则会报错：`ImportError: No module named setuptools`

1. 下载并安装

下载页地址： https://pypi.org/project/setuptools/

```bash
[emon@wenqiu ~]$ wget -cP /usr/local/src/ https://files.pythonhosted.org/packages/b5/96/af1686ea8c1e503f4a81223d4a3410e7587fd52df03083de24161d0df7d4/setuptools-46.1.3.zip
[emon@wenqiu ~]$ unzip /usr/local/src/setuptools-46.1.3.zip -d /usr/local/PythonPyPI/
[emon@wenqiu ~]$ cd /usr/local/PythonPyPI/setuptools-46.1.3/
[emon@wenqiu setuptools-46.1.3]$ python3 setup.py install
[emon@wenqiu setuptools-46.1.3]$ cd
```

#### 10.3.2、安装easy_install【Python3.9.9无需安装】

1. 下载并安装

下载页地址： https://pypi.org/project/ez_setup

```bash
[emon@wenqiu ~]$ wget -cP /usr/local/src/ https://files.pythonhosted.org/packages/ba/2c/743df41bd6b3298706dfe91b0c7ecdc47f2dc1a3104abeb6e9aa4a45fa5d/ez_setup-0.9.tar.gz
[emon@wenqiu ~]$ tar -zxvf /usr/local/src/ez_setup-0.9.tar.gz -C /usr/local/PythonPyPI/
[emon@wenqiu ~]$ cd /usr/local/PythonPyPI/ez_setup-0.9/
[emon@wenqiu ez_setup-0.9]$ python3 setup.py install
[emon@wenqiu ez_setup-0.9]$ cd
```

2. easy_install命令

| 命令                           | 说明     |
| ------------------------------ | -------- |
| easy_install `<package name>`   | 安装套件 |
| easy_install -U `<package name>` | 更新套件 |
| easy_install -m `<package name>` | 卸载套件 |
| easy_install --help            | 显示说明 |

#### 10.3.3、安装pip【Python3.9.9无需安装】

1. 下载并安装

下载页地址：https://pypi.org/project/pip/

```bash
[emon@wenqiu ~]$ wget -cP /usr/local/src/ https://files.pythonhosted.org/packages/d1/05/059c78cd5d740d2299266ffa15514dad6692d4694df571bf168e2cdd98fb/pip-20.1.tar.gz
[emon@wenqiu ~]$ tar -zxvf /usr/local/src/pip-20.1.tar.gz -C /usr/local/PythonPyPI/
[emon@wenqiu ~]$ cd /usr/local/PythonPyPI/pip-20.1/
[emon@wenqiu pip-20.1]$ python3 setup.py install
[emon@wenqiu pip-20.1]$ cd
[emon@wenqiu ~]$ pip -V
pip 20.1 from /usr/local/Python/Python3.7.7/lib/python3.7/site-packages/pip-20.1-py3.7.egg/pip (python 3.7)
```

2. pip命令【不推荐】

| 命令                          | 说明           |
| ----------------------------- | -------------- |
| pip install `<package name>`    | 安装套件       |
| pip install -U `<package name>` | 更新套件       |
| pip uninstall `<package name>`  | 卸载套件       |
| pip search `<package name>`     | 搜索套件       |
| pip help                      | 显示说明       |
| pip list                      | 列出安装过的包 |

3. pip3命令【推荐】

| 命令                                  | 说明             |
| ------------------------------------- | ---------------- |
| pip3 install `<package name>`         | 安装套件         |
| pip3 install -U `<package name>`      | 更新套件         |
| pip3 install --upgrade `<package name>` | 更新套件         |
| pip3 uninstall `<package name>  `     | 卸载套件         |
| pip3 search `<package name>   `       | 搜索套件         |
| pip3 help                             | 显示说明         |
| pip3 show `<package name> `             | 显示套件详情     |
| pip freeze                            | 查看安装了哪些包 |
| pip install -r package.txt            |                  |

- 获取已安装的包

```bash
pip freeze
# 或者
pip list
```

- 保存已安装列表

```bash
pip freeze > packages.txt
```

- 批量卸载

```bash
pip uninstall -r packages.txt
```

- 批量安装

```bash
pip install -r packages.txt
```



#### 10.3.4、安装Supervisor

1. 安装

```bash
[emon@wenqiu ~]$ pip install supervisor
```

2. 创建配置文件

```bash
[emon@wenqiu ~]$ sudo mkdir /etc/supervisor
[emon@wenqiu ~]$ echo_supervisord_conf | sudo tee /etc/supervisor/supervisord.conf 
```

3. 调整配置文件

打开配置文件：

````bash
[emon@wenqiu ~]$ sudo vim /etc/supervisor/supervisord.conf 
````

- 增加Web管理界面

找到`;[inet_http_server]`

```bash
;[inet_http_server]         ; inet (TCP) server disabled by default
;port=127.0.0.1:9001        ; ip_address:port specifier, *:port for all iface
;username=user              ; default is no username (open server)
;password=123               ; default is no password (open server)
```

内容追加：

```bash
[inet_http_server]         	; inet (TCP) server disabled by default
port=0.0.0.0:9001        	; ip_address:port specifier, *:port for all iface
username=spvr              	; default is no username (open server)
password=spvr123            ; default is no password (open server)
```

- 修改`supervisord.pid`、`supervisor.sock`和`supervisord.log`位置

默认这几个文件是放在/tmp目录下，但是/tmp目录是存放临时文件的，里面的文件会被Linux系统删除的，一旦这些文件丢失，就无法再通过supervisorctl来执行restart和stop命令了。而是会得到 `unix:///tmp/supervisor.sock` 不存在的错误。

创建目录：

```bash
[emon@wenqiu ~]$ sudo mkdir /var/run/supervisor
[emon@wenqiu ~]$ sudo mkdir /var/log/supervisor
```

配置修改规划：

| 位置               | 原配置                                | 新配置                                               |
| ------------------ | ------------------------------------- | ---------------------------------------------------- |
| [unix_http_server] | file=/tmp/supervisor.sock             | file=/var/run/supervisor/supervisor.sock             |
| [supervisord]      | logfile=/tmp/supervisord.log          | logfile=/var/log/supervisor/supervisord.log          |
| [supervisord]      | pidfile=/tmp/supervisord.pid          | pidfile=/var/run/supervisor/supervisord.pid          |
| [supervisorctl]    | serverurl=unix:///tmp/supervisor.sock | serverurl=unix:///var/run/supervisor/supervisor.sock |

默认情况下，进程的日志文件达到50MB时，将进行分割，最多保留10个文件，当然这些配置也可以对每个进程单独配置。

- 使用include

在配置文件最后，有一个[include]的配置项，跟Nginx一样，可以include某个文件夹下的所有配置文件，这样我们就可以为每一个进程或者相关的几个进程的配置单独创建一个文件。

创建目录：

```bash
[emon@wenqiu ~]$ sudo mkdir /etc/supervisor/supervisor.d
[emon@wenqiu ~]$ mkdir /home/emon/supervisor.d
```

修改配置：

````bash
;[include]
;files = relative/directory/*.ini
````

追加：

```bash
[include]
files = /etc/supervisor/supervisor.d/*.ini /home/emon/supervisor.d/*.ini
```

注意： /etc/supervisor/supervisor.d/*.ini用来存放系统软件的启动配置，/home/emon/supervisor.d/*.ini用来存放用户项目的启动配置。

4. 实战配置

- 配置tomcat

```bash
[emon@wenqiu ~]$ sudo vim /etc/supervisor/supervisor.d/tomcat.ini
```

```ini
[program:tomcat]
command=/usr/local/tomcat/bin/catalina.sh run ; command=/usr/local/tomcat/bin/startup.sh 默认的startup.sh是后台运行，而supervisor要求前台运行
autostart=false                 ; 在supervisord启动的时候也自动启动
startsecs=10                    ; 启动10秒后没有异常退出，就表示进程正常启动了，默认为1秒
autorestart=true                ; 程序退出后自动重启,可选值：[unexpected,true,false]，默认为unexpected，表示进程意外杀死后才重启
startretries=3                  ; 启动失败自动重试次数，默认是3
user=root                       ; 用哪个用户启动进程，默认是root
priority=70                     ; 进程启动优先级，默认999，值小的优先启动
redirect_stderr=true            ; 把stderr重定向到stdout，默认false
stdout_logfile_maxbytes=20MB    ; stdout 日志文件大小，默认50MB
stdout_logfile_backups = 20     ; stdout 日志文件备份数，默认是10
environment=JAVA_HOME="/usr/local/java"
stdout_logfile=/etc/supervisor/supervisor.d/tomcat.log ; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以需要手动创建目录（supervisord 会自动创建日志文件）
stopasgroup=true                ;默认为false,进程被杀死时，是否向这个进程组发送stop信号，包括子进程
killasgroup=true                ;默认为false，向进程组发送kill信号，包括子进程
```

备注：需要开放8080端口

- 配置spring-boot-demo（一个SpringBoot的演示项目）

```bash
# 创建所需目录，并通过scp命令上传到/home/emon/spring-boot-demo目录
[emon@wenqiu ~]$ mkdir -p /home/emon/spring-boot-demo/logs
[emon@wenqiu ~]$ vim supervisor.d/sbd.ini
```

```ini
[program:sbd]
command=/usr/local/java/bin/java -jar -Xmx512m -Xms512m -Xmn256m -Xss228k -Dspring.profiles.active=test spring-boot-demo.jar
directory=/home/emon/spring-boot-demo
autostart=false                 ; 在supervisord启动的时候也自动启动
startsecs=10                    ; 启动10秒后没有异常退出，就表示进程正常启动了，默认为1秒
autorestart=true                ; 程序退出后自动重启,可选值：[unexpected,true,false]，默认为unexpected，表示进程意外杀死后才重启
startretries=3                  ; 启动失败自动重试次数，默认是3
user=emon                       ; 用哪个用户启动进程，默认是root
priority=70                     ; 进程启动优先级，默认999，值小的优先启动
redirect_stderr=true            ; 把stderr重定向到stdout，默认false
stdout_logfile_maxbytes=20MB    ; stdout 日志文件大小，默认50MB
stdout_logfile_backups = 20     ; stdout 日志文件备份数，默认是10
stdout_logfile=/home/emon/spring-boot-demo/logs/sbd.log     ; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以需要手动创建目录（supervisord 会自动创建日志文件）
stopasgroup=true                ;默认为false,进程被杀死时，是否向这个进程组发送stop信号，包括子进程
killasgroup=true                ;默认为false，向进程组发送kill信号，包括子进程
```

备注：需要开放8090端口

```bash
# 开放一个系列的端口（生产环境按需开放，安全第一）
# 开放8080-8090端口，供Web服务器使用。
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --add-port=8080-8090/tcp
success
[emon@wenqiu ~]$ sudo firewall-cmd --reload
success
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --list-ports
20-21/tcp 61001-62000/tcp 80/tcp 3306/tcp 8080-8090/tcp
```

5. 启动

执行supervisord命令，将会启动supervisord进程，同时我们在配置文件中设置的进程也会相应启动。

> ##### 使用默认的配置文件启动 /etc/supervisor/supervisord.conf
>
> supervisord
> ##### 明确指定配置文件
>
> supervisord -c /etc/supervisor/supervisord.conf
> ##### 使用user用户启动supervisord
>
> supervisord -u user

```bash
# 提升到root权限
[emon@wenqiu ~]$ sudo -s
# 明确指定配置文件
[root@wenqiu emon]# supervisord -c /etc/supervisor/supervisord.conf
[root@wenqiu emon]# supervisorctl status
tomcat                           STOPPED   Not started
sbd                              STOPPED   Not started
# 启动
[root@wenqiu emon]# supervisorctl start tomcat
# 降级到emon权限
[root@wenqiu emon]# exit
exit
```

**为了能直接使用sudo supervisord或者sudo supervisorctl而不报错`sudo: supervisord：找不到命令`或者`sudo: supervisorctl：找不到命令`，做如下操作：**

具体原因参见Nginx中关于`配置环境变量【特殊】`的描述。

```bash
[emon@wenqiu ~]$ sudo ln -s /usr/local/python3/bin/supervisord /usr/sbin/supervisord
[emon@wenqiu ~]$ sudo ln -s /usr/local/python3/bin/supervisorctl /usr/sbin/supervisorctl
```

接下来可以直接使用sudo+命令模式了：

```bash
[emon@wenqiu ~]$ sudo supervisorctl status
tomcat                           STOPPED   Not started
sbd                              STOPPED   Not started
```

6. 开放端口

```bash
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --add-port=9001/tcp
[emon@wenqiu ~]$ sudo firewall-cmd --reload
success
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --list-ports
20-21/tcp 61001-62000/tcp 80/tcp 3306/tcp 8080-8090/tcp 9001/tcp
```

此时，可以访问Web界面了： http://192.168.1.116:9001

7. supervisorctl常用命令

| 命令                                             | 说明                                                         |
| ------------------------------------------------ | ------------------------------------------------------------ |
| supervisord -c /etc/supervisor/supervisord.conf  | 启动supervisor服务                                           |
| supervisorctl start <program_name>               | 启动某个进程                                                 |
| supervisorctl stop <program_name>                | 停止某一个进程，program_name为[program:x]里的x               |
| supervisorctl restart <program_name>             | 重启某个进程                                                 |
| supervisorctl start <groupworker:>               | 启动一组进程                                                 |
| supervisorctl start <groupworker:program_name>   | 启动一组进程中的一个                                         |
| supervisorctl stop <groupworker:>                | 结束一组进程                                                 |
| supervisorctl stop <groupworker:program_name>    | 结束一组进程中的一个                                         |
| supervisorctl restart <groupworker:>             | 重启一组进程                                                 |
| supervisorctl restart <groupworker:program_name> | 重启一组进程中的一个                                         |
| supervisorctl start all                          | 启动全部进程                                                 |
| supervisorctl stop all                           | 停止全部进程，注：start,restart,stop都不会载入最新的配置文件 |
| supervisorctl reread                             | 重新read配置文件                                             |
| supervisorctl reload                             | 载入最新的配置文件，停止原来进程并按新的配置启动，管理所有进程【重点：如果没有配置*.ini的autostart=true，只会停止；否则，会启动所有配置了true的】 |
| supervisorctl update                             | 根据最新的配置文件，启动新配置或者有改动的配置，配置没有改动的进程不会受影响【重点：如果没有配置*.ini的autostart=true，只会停止；否则，会启动那些配置了true的且更新了配置文件的】 |
| supervisorctl shutdown                           | 关闭supervisor服务                                           |
| supervisorctl help                               | 命令帮助                                                     |

8. 添加自启动脚本

```bash
[emon@wenqiu ~]$ sudo vim /usr/lib/systemd/system/supervisord.service
```

```bash
[Unit]
Description=Supervisor daemon

[Service]
Type=forking
ExecStart=/usr/local/python3/bin/supervisord -c /etc/supervisor/supervisord.conf
ExecStop=/usr/local/python3/bin/supervisorctl shutdown
ExecReload=/usr/local/python3/bin/supervisorctl reload
KillMode=process
Restart=on-failure
RestartSec=50s

[Install]
WantedBy=multi-user.target
```

- 加载

```bash
[emon@wenqiu ~]$ sudo systemctl daemon-reload
```

- 启动

```bash
[emon@wenqiu ~]$ sudo systemctl start supervisord.service 
```

- 查看

```bash
[emon@wenqiu ~]$ sudo systemctl status supervisord.service
```

- 停止

```bash
[emon@wenqiu ~]$ sudo systemctl stop supervisord.service 
```