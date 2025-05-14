# 第6章 Dockerfile语法梳理及最佳实践

[Docker reference](https://docs.docker.com/engine/reference/builder/)

## 1、关键字讲解

### 1.1、关键字：FROM

```dockerfile
# 制作base image
FROM scratch
```

```dockerfile
# 使用base image
FROM centos:7
```

```dockerfile
# 使用base image的latest
FROM ubuntu
```

### 1.2、关键字：LABEL

- 添加镜像的元数据（如维护者、版本）。
- 示例

```dockerfile
LABEL maintainer="rushing@163.com"
LABEL version="1.0"
LABEL description="This is description"
```

说明：

- Metadata不可少！

### 1.3、关键字：RUN

```dockerfile
# 反斜线换行
RUN yum update && yum install -y vim \
    python-dev
RUN /bin/bash -c 'source $HOME/.bashrc;echo $HOME'
```

说明：

每一次RUN命令，都会生成新的一层！

为了美观，复杂的RUN请用反斜线换行！

避免无用分层，合并多条命令成一行！

### 1.4、关键字：WORKDIR

在 Dockerfile 中，`WORKDIR` 指令用于**设置容器内的工作目录**（用户登录容器后自动切换到该目录），后续的指令（如 `RUN`、`CMD`、`COPY`、`ADD`）默认在此目录下执行。以下是它的核心作用、用法及注意事项：

**核心作用**

1. **定义操作路径**
   所有后续指令的**相对路径**均基于 `WORKDIR` 指定的目录。
2. **简化路径管理**
   避免在指令中频繁使用绝对路径，提高 Dockerfile 的可读性和可维护性。
3. **自动创建目录**
   如果目录不存在，Docker 会自动创建。

```dockerfile
# 创建根目录下test文件夹
WORKDIR /root
WORKDIR <目录路径>
```

```dockerfile
# 如果没有会自动创建test目录
WORKDIR /test
WORKDIR demo
# 输出结果应该是 /test/demo
RUN pwd
```

说明：

- 用WORKDIR，不要用RUN cd！
- 尽量使用绝对目录！

### 1.5、关键字：ADD and COPY

```dockerfile
# 把hello文件添加到/目录
ADD hello /
```

```dockerfile
# 添加到根目录并解压
ADD test.tar.gz /
```

```dockerfile
WORKDIR /root
# 会创建不存在的文件夹，结果：/root/test/hello
ADD hello test/
```

```dockerfile
WORKDIR /root
# 会创建不存在的文件夹，结果：/root/test/hello
COPY hello test/
```

说明：

- 大部分情况，COPY优于ADD！

- ADD除了COPY还有额外功能（解压）！
- 添加远程文件/目录请使用curl或者wget！

### 1.6、关键字：ENV

- 设置环境变量（可被后续指令或容器运行时使用）。
- 示例

```dockerfile
# 设置常量
ENV MYSQL_VERSION 5.6
ENV JAVA_HOME /usr/lib/jvm/java-11
# 引用常量
RUN apt-get install -y mysql-server="${MYSQL_VERSION}" \
	&& rm -rf /var/lib/apt/lists/*
```

说明：

- 尽量使用ENV增加可维护性！

### 1.7、关键字：VOLUME and EXPOSE

存储和网络。

### 1.8、RUN vs CMD vs ENTRYPOINT

- RUN：执行命令并创建新的 IMAGE Layer

- CMD：设置容器启动后**默认执行的命令和参数**
    - 容器启动时默认执行的命令
    - 如果docker run指定了其他命令，CMD命令被忽略
    - 如果定义了多个CMD，只有最后一个会执行

- ENTRYPOINT：设置容器启动时运行的命令

    - `ENTRYPOINT` 定义固定命令，`CMD` 定义默认参数。

    - 定义容器启动时的入口命令（`CMD` 的内容会作为其参数）。

      ```dockerfile
      ENTRYPOINT ["java", "-jar"]
      CMD ["app.jar"]
      ```

    - 让容器以应用程序或者服务的形式运行

    - 不会被忽略，一定被执行

    - 最佳实践：写一个shell脚本作为entrypoint

  ```dockerfile
  COPY docker-entrypoint.sh /usr/local/bin/
  ENTRYPOINT [ "docker-entrypoint.sh" ]
  
  EXPOSE 27017
  CMD [ "mongod" ]
  ```

#### 1.8.1、ENTRYPOINT之Shell格式

```bash
$ mkdir -pv ~/dockerdata/entrypoint_shell
$ cd ~/dockerdata/entrypoint_shell/
[emon@emon entrypoint_shell]$ vim Dockerfile
```

```dockerfile
FROM centos:7
ENV name Docker
ENTRYPOINT echo "hello $name"
```

```bash
[emon@emon entrypoint_shell]$ docker build -t rushing/centos-entrypoint-shell .
[emon@emon entrypoint_shell]$ docker run rushing/centos-entrypoint-shell
hello Docker
```

#### 1.8.2、ENTRYPOINT之Exec格式

```bash
$ mkdir -pv ~/dockerdata/entrypoint_exec
$ cd ~/dockerdata/entrypoint_exec/
[emon@emon entrypoint_exec]$ vim Dockerfile
```

```dockerfile
FROM centos:7
ENV name Docker
ENTRYPOINT [ "bin/bash", "-c", "echo hello $name" ]
```

```bash
[emon@emon entrypoint_exec]$ docker build -t rushing/centos-entrypoint-exec .
[emon@emon entrypoint_exec]$ docker run rushing/centos-entrypoint-exec
hello Docker
```

#### 1.8.3、CMD之Shell

```bash
$ mkdir -pv ~/dockerdata/cmd_shell
$ cd ~/dockerdata/cmd_shell/
[emon@emon cmd_shell]$ vim Dockerfile
```

```dockerfile
FROM centos:7
ENV name Docker
CMD echo "hello $name"
```

```bash
[emon@emon cmd_shell]$ docker build -t rushing/centos-cmd-shell .
[emon@emon cmd_shell]$ docker run rushing/centos-cmd-shell
hello Docker
# 如果指定 /bin/bash 时，会覆盖CMD语句执行
[emon@emon cmd_shell]$ docker run rushing/centos-cmd-shell /bin/bash
```

#### 1.8.4、CMD之Exec

```bash
$ mkdir -pv ~/dockerdata/cmd_exec
$ cd ~/dockerdata/cmd_exec/
[emon@emon cmd_exec]$ vim Dockerfile
```

```dockerfile
FROM centos:7
ENV name Docker
CMD [ "bin/bash", "-c", "echo hello $name" ]
```

```bash
[emon@emon cmd_exec]$ docker build -t rushing/centos-cmd-exec .
[emon@emon cmd_exec]$ docker run rushing/centos-cmd-exec
hello Docker
```



### 1.9、Shell和Exec格式

- Shell格式

```dockerfile
RUN apt-get install -y vim
CMD echo "hello docker"
ENTRYPOINT echo "hello docker"
```

- Exec格式

```dockerfile
RUN [ "apt-get", "install", "-y", "vim" ]
CMD [ "/bin/echo", "hello docker" ]
ENTRYPOINT [ "/bin/echo", "hello docker" ]
```

### 1.10 USER

- 作用：切换运行命令的用户（提升安全性）。
- 示例

```dockerfile
USER nobody
```

### 1.11 EXPOSE

- 声明容器监听的端口（需通过 `docker run -p` 实际映射到宿主机）。
- 示例

```dockerfile
EXPOSE 80/tcp
```

### 1.12 VOLUME

- 定义容器数据卷挂载点（用于持久化数据）。会自动创建目录。
- 示例

```dockerfile
VOLUME /var/lib/mysql
```

### 1.13 ARG

​	允许在 Dockerfile 中声明变量，为后续步骤（如 `RUN`、`COPY`）提供动态值。

​	可以为变量设置默认值，当未通过 `--build-arg` 覆盖时生效。

```dockerfile
ARG <变量名>[=<默认值>]
```

## 2、案例

参考示例：https://github.com/docker-library/mysql

### 2.1、案例：flask-demo服务镜像

1：创建目录

```bash
$ mkdir dockerdata/flask-demo
$ cd dockerdata/flask-demo/
```

2：编写内容

- 创建app.py

```bash
[emon@emon flask-demo]$ vim app.py
```

```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return "hello docker"

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
```

- 安装flask

```bash
[emon@emon flask-demo]$ pip3 install flask
```

- 运行

```bash
[emon@emon flask-demo]$ python3 app.py
```

3：创建Dockerfile

```bash
[emon@emon flask-demo]$ vim Dockerfile
```

```dockerfile
FROM python:2.7
LABEL maintainer="emon<emon@163.com>"
RUN pip install flask
COPY app.py /app
WORKDIR /app
EXPOSE 5000
CMD ["python", "app.py"]
```

4：创建镜像

```bash
[emon@emon flask-demo]$ docker build -t rushing/flask-hello-world .
......省略......
Step 4/7 : COPY app.py /app
 ---> 5584b327f25d
Step 5/7 : WORKDIR /app
Cannot mkdir: /app is not a directory
```

可以看到Step 5/7 失败了，如何处理？

进入Step 4/7产生的镜像层：

```bash
[emon@emon flask-demo]$ docker run -it 5584b327f25d /bin/bash
root@7666f9b78e80:/# ls -l|grep app
-rw-rw-r--.   1 root root 212 Mar 13 09:52 app
```

发现app不是一个目录，而是一个文件。

调整Dockerfile内容：

```dockerfile
FROM python:2.7
LABEL maintainer="emon<emon@163.com>"
RUN pip install flask
COPY app.py /app/
WORKDIR /app
EXPOSE 5000
CMD ["python", "app.py"]
```

再次创建镜像：

```bash
[emon@emon flask-demo]$ docker build -t rushing/flask-hello-world .
```

5：运行镜像

```bash
[emon@emon flask-demo]$ docker run rushing/flask-hello-world
# 命令行输出结果
 * Serving Flask app "app" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 471-935-875
```

### 2.2、案例：ubuntu-stress工具镜像

1：创建目录

```bash
$ mkdir dockerdata/ubuntu-stress
$ cd dockerdata/ubuntu-stress/
```

2：创建Dockerfile

```bash
[emon@emon ubuntu-stress]$ vim Dockerfile
```

```dockerfile
FROM ubuntu
RUN apt-get update && apt-get install -y stress
ENTRYPOINT ["/usr/bin/stress"]
CMD []
```

3：创建镜像

```bash
[emon@emon ubuntu-stress]$ docker build -t rushing/ubuntu-stress .
```

4：运行镜像

```bash
[emon@emon ubuntu-stress]$ docker run -it rushing/ubuntu-stress --vm 1 --verbose
```

### 2.3、案例：SpringBoot执行脚本(sh)并启动服务(jar)

- Dockerfile

```dockerfile
FROM openjdk:17-jdk-slim

# 复制文件到容器
COPY add-hosts.sh /add-hosts.sh
COPY app.jar /app.jar

# 确保脚本可执行
RUN chmod +x /add-hosts.sh

# 定义 ENTRYPOINT 执行固定逻辑（先运行脚本）
ENTRYPOINT ["/bin/sh", "-c", "/add-hosts.sh && \"$@\"", "--"]

# 定义 CMD 提供默认 Java 启动命令
CMD ["java", "-jar", "/app.jar"]
```

**工作原理：**

1. **ENTRYPOINT** 部分：
    - 使用 `/bin/sh -c` 执行脚本
    - `&& \"$@\"` 表示先执行脚本，然后执行传入的命令
    - `--` 是占位符，确保 `$@` 能正确获取所有参数
2. **CMD** 部分：
    - 提供默认的 `java -jar /app.jar` 命令

**测试用例：**

1. **用户完全覆盖命令**：

```
docker run myapp java -jar -Dspring.profiles.active=test /app.jar
```

实际执行：

```
/add-hosts.sh && java -jar -Dspring.profiles.active=test /app.jar
```

1. **使用默认命令**：

```
docker run myapp
```

实际执行：

```
/add-hosts.sh && java -jar /app.jar
```

**关键点说明：**

- `\"$@\"` 确保能正确处理带空格和特殊字符的参数
- `--` 是 shell 的特殊参数，表示"选项结束"，后面的内容都视为参数
- 这种写法既保证了脚本总是先执行，又允许用户完全覆盖 Java 命令

**替代方案（更简洁）：**

如果你不需要支持复杂的参数传递，可以简化成：

```
ENTRYPOINT ["/bin/sh", "-c", "/add-hosts.sh && exec java -jar /app.jar $@", "--"]
CMD []
```

这样：

- `docker run myapp` 会执行默认命令
- `docker run myapp -Dspring.profiles.active=test` 会把参数附加到默认命令后
