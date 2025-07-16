# 第6章 Dockerfile语法梳理及最佳实践

[Docker reference](https://docs.docker.com/engine/reference/builder/)

Dockerfile是用来构建Docker镜像的文本文件，是由一条条构建镜像所需的指令和参数构成的脚本。

## 1 关键字讲解

### 关键字：FROM

- 语法

:::code-group

```dockerfile [方式一]
FROM [--platform=<platform>] <image> [AS <name>]
```

```dockerfile [方式二]
FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]
```

```dockerfile [方式三]
FROM [--platform=<platform>] <image>[@<digest>] [AS <name>]
```

:::



- 示例

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



### 关键字：MAINTAINER

- 语法

```dockerfile
MAINTAINER <name>
```



### 关键字：LABEL

- 语法

```dockerfile
LABEL <key>=<value> [<key>=<value>...]
```



- 示例：添加镜像的元数据（如维护者、版本）。

```dockerfile
LABEL maintainer="rushing@163.com"
LABEL version="1.0"
LABEL description="This is description"
```



### 关键字：RUN

- 语法

::: code-group

```dockerfile [方式一]
# Shell form:
RUN [OPTIONS] <command> ...
# Exec form:
RUN [OPTIONS] [ "<command>", ... ]
```

```dockerfile [方式二]
RUN <<EOF
apt-get update
apt-get install -y curl
EOF
```

:::



- 示例

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



### 关键字：EXPOSE

- 语法：声明容器监听的端口（需通过 `docker run -p` 实际映射到宿主机）

```dockerfile
EXPOSE 80/tcp
EXPOSE 80/udp
```

- 示例：运行时可覆盖端口

```bash
$ docker run -p 80:80/tcp -p 80:80/udp ...
```



### 关键字：WORKDIR

- 语法

```dockerfile
WORKDIR /path/to/workdir
```



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



### 关键字：USER

- 语法：切换运行命令的用户（提升安全性）

:::code-group

```dockerfile [方式一]
USER <user>[:<group>]
```

```dockerfile [方式二]
USER <UID>[:<GID>]
```

:::

- 示例

```dockerfile
USER nobody
```



### 关键字：ENV

- 语法：设置环境变量（可被后续指令或容器运行时使用）。

```dockerfile
ENV <key>=<value> [<key>=<value>...]
```

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



### 关键字：ADD

- 语法

```dockerfile
ADD [OPTIONS] <src> ... <dest>
ADD [OPTIONS] ["<src>", ... "<dest>"]
```

- 示例

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



### 关键字：COPY

- 语法

```dockerfile
COPY [OPTIONS] <src> ... <dest>
COPY [OPTIONS] ["<src>", ... "<dest>"]
```



### 关键字：VOLUME

- 语法

```dockerfile
VOLUME ["/data"]
```



### 关键字：ARG

- 语法

```dockerfile
ARG <name>[=<default value>] [<name>[=<default value>]...]
```

允许在 Dockerfile 中声明变量，为后续步骤（如 `RUN`、`COPY`）提供动态值。

可以为变量设置默认值，当未通过 `--build-arg` 覆盖时生效。

```dockerfile
ARG <变量名>[=<默认值>]
```



### 关键字：CMD

- 语法

:::code-group

```dockerfile [exec 格式]
CMD ["executable","param1","param2"]
```

```dockerfile [shell 格式]
CMD command param1 param2
```

```dockerfile [exec 格式，作为ENTRYPOINT的默认参数]
CMD ["param1","param2"]
```

:::

- CMD：设置容器启动后**默认执行的命令和参数**
    - 容器启动时默认执行的命令
    - 如果docker run指定了其他命令，CMD命令被忽略
    - 如果定义了多个CMD，只有最后一个会执行

#### 1 CMD之Shell

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

#### 2 CMD之Exec

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



### 关键字：ENTRYPOINT

- 语法

:::code-group

```dockerfile [exec 格式]
ENTRYPOINT ["executable", "param1", "param2"]
```

```dockerfile [shell 格式]
ENTRYPOINT ["executable", "param1", "param2"]
```

:::

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

#### 1 ENTRYPOINT之Shell格式

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

#### 2 ENTRYPOINT之Exec格式

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



### 关键字：Shell和Exec格式

关键字`RUN`、`CMD`以及`ENTRYPOINT`都有两种命令格式。

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



## 2 案例

参考示例：https://github.com/docker-library/mysql

### 2.1 案例：Rocky9镜像增加vim+ifconfig+jdk21软件

```bash
# 比较2个镜像的安装包数量
$ docker run --rm rockylinux/rockylinux:9.5 rpm -qa | wc -l
146
$ docker run --rm rockylinux/rockylinux:9.5-minimal rpm -qa | wc -l
118
```

- 创建目录

```bash
$ mkdir -p dockerfiletest/myfile
$ cd dockerfiletest/myfile
```

:::tip

请确保 dockerfiletest/myfile 目录下具有 jdk-17.0.14_linux-aarch64_bin.tar.gz 文件

:::

- 编写`Dockerfile`文件

```bash
$ vim Dockerfile
```

```dockerfile
FROM rockylinux/rockylinux:9.5-minimal
MAINTAINER liming20110711@163.com

ENV MYPATH /usr/local
WORKDIR $MYPATH

# 安装vim编辑器\安装ifconfig命令查看网络IP并清理
RUN microdnf install -y vim net-tools && microdnf clean all
# 安装java8及lib库
RUN mkdir /usr/local/Java
# ADD是相对路径jar,把jdk添加到容器中,安装包必须要和 Dockerfile 文件在同一位置
ADD jdk-17.0.14_linux-aarch64_bin.tar.gz /usr/local/Java
# 创建软连接
RUN ln -snf /usr/local/Java/jdk-17.0.14/ /usr/local/java
# 配置java环境变量
ENV JAVA_HOME=/usr/local/java
ENV CLASSPATH=.:$JAVA_HOME/jre/lib/rt.jar:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
ENV PATH=$JAVA_HOME/bin:$PATH

CMD ["java", "-version"]
```

- 构建镜像

```bash
$ docker build -t rocky-jdk17 .
```

- 运行

```bash
$ docker run -it --rm rocky-jdk17 /bin/bash
```

### 2.2 案例：SpringBoot部署

SpringBoot项目：https://github.com/Rushing0711/docker-spring-boot 分支：nodb

- 创建目录

```bash
$ mkdir -p dockerfiletest/myboot
$ cd dockerfiletest/myboot
```

:::tip

请确保 dockerfiletest/myboot 目录下有 docker-spring-boot-0.0.1-SNAPSHOT.jar 文件

:::

- 编写`Dockerfile`文件

```bash
$ vim Dockerfile
```

```dockerfile
# 基础镜像使用java
FROM openjdk:17-jdk-slim
MAINTAINER liming20110711@163.com

# VOLUME 指定临时文件目录为/tmp,在主机/var/lib/docker目录下创建了一个临时文件并链接到容器的/tmp
VOLUME /tmp
# 将jar包添加到容器中并更名为 app.jar
ADD docker-spring-boot-0.0.1-SNAPSHOT.jar app.jar
# 更新jar包时间戳
#RUN bash -c 'touch /app.jar'
ENTRYPOINT ["java", "-jar", "/app.jar"]
# 暴露8080端口作为微服务
EXPOSE 8080
```

- 构建镜像

```bash
$ docker build -t docker-spring-boot .
```

- 运行

```bash
$ docker run --name myboot --rm -p 8080:8080 docker-spring-boot && docker logs -f myboot
```



### 2.3 案例：SpringBoot执行脚本(sh)并启动服务(jar)

- Dockerfile

```dockerfile
FROM openjdk:17-jdk-slim
MAINTAINER wenqiu
USER root

ARG ADD_HOSTS add-hosts.sh
VOLUME /home/app/data
COPY k8s/app /home/app
# 复制文件到容器
COPY $ADD_HOSTS /add-hosts.sh
# 确保脚本可执行
RUN chmod +x /usr/local/bin/add-hosts.sh
COPY ./target/*.jar /home/app/app.jar

ENV APP_HOME=/home/app
ENV DATA_DIR=/home/app/data
ENV LOG_DIR=/home/app/logs
WORKDIR /home/app

# 定义 ENTRYPOINT 执行固定逻辑（先运行脚本）
ENTRYPOINT ["/bin/sh", "-c", "/add-hosts.sh && \"$@\"", "--"]

# 定义 CMD 提供默认 Java 启动命令
CMD ["java", "-jar", "/app.jar"]
```

:::tip

- add-hosts.sh

```bash
$ vim add-hosts.sh
```

------

```bash
#!/bin/bash
# 若系统需要通过域名访问外部系统，才需要该配置。示例如下：
grep -q "x.y.z" /etc/hosts || echo "1.1.1.1 x.y.z" >> /etc/hosts
exec "$@"
```

- build.sh

```bash
$ docker build --no-cache --build-arg ADD_HOSTS="$ADD_HOSTS" -t "$IMAGE_NAME:$TAG" -t "$IMAGE_NAME:$LATEST" -f Dockerfile ../.
```

:::

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



