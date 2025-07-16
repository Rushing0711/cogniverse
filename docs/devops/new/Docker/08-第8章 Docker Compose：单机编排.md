# 第8章 Docker Compose：单机编排

[Docker Compose官网手册](https://docs.docker.com/compose/)



## 1 为什么诞生Docker Compose

### 1.1 Docker Compose是什么

Compose是Docker公司推出的一个工具软件，可以管理多个Docker容器组成一个应用。你需要定义一个YAML格式的配置文件`compose.yaml`，<span style="color:red;font-weight:bold;">写好多个容器之间的调用关系</span>。然后，只要一个命令，就能同时启动/关闭这些容器。

### 1.2 为什么使用 Docker Compose？

docker建议我们每一个容器只运行一个服务，因为docker容器本身占用资源极少，所以最好是将每个服务单独的分隔开来，但是这样我们又面临一个问题：“<span style="color:red;">如果我需要同时部署好多个服务，难道每一个服务单独写Dockerfile然后在构建镜像、构建容器</span>”？这样累死了，所以docker官方给我们提供了 `docker compose` 多服务部署的工具。

例如，要实现一个Web微服务项目，除了Web服务容器本身，往往还需要再加上后端的数据库MySQL服务容器，Redis服务器，注册中心Eureka，甚至还包括负载均衡容器等等。

Docker Compose允许用户通过一个单独的`compose.yaml`模板文件（YAML格式）来定义一组相关联的应用容器为一个项目（project）。

可以很容易地用一个配置文件定义一个多容器的应用，然后使用一条指令安装这个应用的所有依赖，完成构建。Docker Compose解决了容器与容器之间如何管理编排的问题。

## 2 ~~安装docker-compose【V1版需单独安装，过时】~~

1：下载

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

:::danger

V1版需单独安装，过时，目前的docker安装时已经默认安装了`docker compose`命令。（注意，不是`docker-compose` 命令）

[Docker Compose Plugin安装手册](https://docs.docker.com/compose/install/linux/)

:::

2：添加可执行权限

```bash
$ sudo chmod +x /usr/local/bin/docker-compose
# 创建软连，避免安装Harbor时报错：? Need to install docker-compose(1.18.0+) by yourself first and run this script again.
$ sudo ln -snf /usr/local/bin/docker-compose /usr/bin/docker-compose
```

3：配置alias

- 配置永久的alias

```bash
alias docker-compose="sudo /usr/local/bin/docker-compose"
```

- 使之生效

```bash
$ source .bashrc 
```

4：测试

```bash
$ docker-compose --version
docker-compose version 1.29.2, build 5becea4c
```

## 3 docker-compose配置文件

Compose 文件的默认路径是<span style="color:red;font-weight:bold;"> `compose.yaml` （推荐）</span>或 `compose.yml` ，它们位于工作目录中。Compose 还支持 `docker-compose.yaml` 和 `docker-compose.yml` 以向后兼容早期版本。<span style="color:red;font-weight:bold;">如果这两个文件都存在，Compose 会优先使用规范化的 `compose.yaml` </span>。

如果你想要重用其他的 Compose 文件，或者将应用程序模型的一部分提取到单独的 Compose 文件中，你也可以使用 `include` 。如果您的 Compose 应用程序依赖于由不同团队管理的另一个应用程序，或者需要与他人共享，则这很有用。

- compose.yaml

  - Services
    - 一个Service代表一个container，这个container可以从dockerhub的image来创建，或者从本地的Dockerfile build出来的image来创建。
    - Service的启动类似docker run，我们可以给其指定network和volume的引用。
  - Networks
  - Volumes

## 4 常用命令

Docker 命令行界面让您可以通过 `docker compose` 命令及其子命令与您的 Docker Compose 应用程序进行交互。使用命令行界面，您可以管理在 `compose.yaml` 文件中定义的多容器应用程序的生命周期。命令行界面使您能够轻松地启动、停止和配置应用程序。

Compose 适用于所有环境；生产、预发布、开发、测试以及 CI 工作流。它还提供了管理应用程序整个生命周期的命令：

### 4.1 关键命令

- 启动`compose.yaml`文件中定义的所有服务

```bash
$ docker compose up -d
```

`-d`参数：后台运行容器

- 停止并删除正在运行的服务、网络（不指定-v，会保留存储卷）

```bash
$ docker compose down -v
```

`-v`参数：删除存储卷

- 如果你想监控正在运行的容器的输出并调试问题，你可以使用以下命令查看日志：

```bash
$ docker compose logs
# 示例
$ docker compose logs -f
$ docker compose logs <ServicesId>
```

- 列出所有服务及其当前状态

```bash
$ docker compose ps
```

- 重启服务

```bash
$ docker compose restart
```

- 启动服务

```bash
$ docker compose start
```

- 停止服务（仅停止容器）

```bash
$ docker compose stop
```

### 4.2 其他常用命令

- 查看帮助

```bash
$ docker compose -h
```

- 进入容器实例内部，执行 `compose.yaml` 文件中写的服务id

```bash
$ docker compose exec compose.yaml文件中写的服务id /bin/bash
# 进入名为 "web" 的服务容器的 bash shell（假设容器内有 bash）
$ docker compose exec web /bin/bash
# 使用 -it 参数保持交互式终端（例如查看实时日志）
$ docker compose exec -it web tail -f /var/log/app.log
```

- 展示当前 docker compose 编排过的容器进程

```bash
$ docker compose top
```

- 检查配置

```bash
$ docker compose config
```

- 检查配置，有问题才有输出

```bash
$ docker compose config -q
```

- 查看当前 docker compose 使用过的镜像信息

```bash
$ docker compose imagesß
```

## 5 案例

### 5.1 案例1：docker compose版wordpress

1：创建目录

```bash
$ mkdir -p composetest/wordpress
$ cd composetest/wordpress
```

2：编写`compose.yaml`文件

```bash
$ vim compose.yaml
```

```yaml
services:
  wordpress:
    image: wordpress:latest
    ports:
      - "80:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wordpress_data:/var/www/html
    depends_on:
      - db
    networks:
      - wp_network

  db:
    image: mysql:8.4.5
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
      MYSQL_ROOT_PASSWORD: root_password
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - wp_network

volumes:
  wordpress_data:
  db_data:

networks:
  wp_network:
```

3：启动

```bash
$ docker compose -f docker-compose.yml up -d
# 或者
$ docker compose up -d
```

4：查看docker compose启动状态

```bash
$ docker compose ps
```

### 5.2 案例2：SpringBoot微服务

SpringBoot项目：https://github.com/Rushing0711/docker-spring-boot 分支：withdb

- 创建目录

```bash
$ mkdir -p composetest/bootapp
$ cd composetest/bootapp
```

:::tip

请确保 dockerfiletest/myboot 目录下有 docker-spring-boot-0.0.1-SNAPSHOT.jar 文件

:::

#### 5.2.1 准备SpringBoot应用镜像

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
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=test", "/app.jar"]
# 暴露8080端口作为微服务
EXPOSE 8080
```

- 构建镜像

```bash
$ docker build -t docker-spring-boot .
```

#### 5.2.2 准备compose.yaml配置

##### 1 编写 `compose.yaml` 文件

```bash
$ vim compose.yaml
```

```yaml
services:
  app:		# 这个名字无所谓，网络和存储卷的前缀是docker compose执行时所在目录（这里是bootapp）
    image: docker-spring-boot
    container_name: dsb
    ports:
      - "8080:8080"
    environment:
      # 配置SpringBoot连接MySQL（通过服务名mysql访问）
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/dockerdb?allowPublicKeyRetrieval=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root123
      # 配置SpringBoot连接Redis（通过服务名redis访问）
      SPRING_REDIS_HOST: redis
      SPRING_REDIS_PORT: 6379
      SPRING_REDIS_PASSWORD: redis123
      # 日志路径
      LOG_PATH: /home/app/logs
    volumes:
      - dsb-data:/home/app/data
      - dsb-logs:/home/app/logs
    networks:
      - dsb-net
    depends_on:
      - mysql
      - redis

  mysql:
    image: mysql:8.4.5
    environment:
      MYSQL_ROOT_HOST: '%.%.%.%'
      MYSQL_ROOT_PASSWORD: 'root123' 	# root密码
      MYSQL_DATABASE: 'dockerdb'			# 自动创建数据库
    ports:
      - "3306:3306"
    volumes:
      - ./sql/init.sql:/docker-entrypoint-initdb.d/init.sql		# SQL初始化脚本
      - mysql-data:/var/lib/mysql															# 数据持久化
    networks:
      - dsb-net

  redis:
    image: redis:7.0
    ports:
      - "6379:6379"
    volumes:
      - ./redis/redis.conf:/etc/redis/redis.conf
      - redis-data:/data
    networks:
      - dsb-net
    command: redis-server /etc/redis/redis.conf

volumes:
  dsb-data:			# 业务数据持久化卷
  dsb-logs:			# 业务日志卷
  mysql-data:		# MySQL数据持久化卷
  redis-data:		# Redis数据持久化卷

networks:
  dsb-net:
    driver: bridge
```

##### 2 配套操作步骤

- 创建 `sql/init.sql` 文件（与 `compose.yaml` 同级目录）：

```bash
$ mkdir sql
$ vim sql/init.sql
```

```sql
-- 建表语句（数据库dockerdb已通过环境变量自动创建）
USE dockerdb;

-- 使用数据库
CREATE TABLE `t_user`
(
    `id`          INT(10) UNSIGNED    NOT NULL AUTO_INCREMENT,
    `username`    varchar(50)         NOT NULL DEFAULT '' COMMENT '用户名',
    `password`    varchar(50)         NOT NULL DEFAULT '' COMMENT '密码',
    `sex`         tinyint(4)          NOT NULL DEFAULT '0' COMMENT '性别 0=女 1=男',
    `deleted`     tinyint(4) UNSIGNED NOT NULL DEFAULT '0' COMMENT '删除标志，默认0不删除，1删除',
    `create_time` TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci
  ROW_FORMAT = Dynamic
    COMMENT = '用户表';
```

- 创建`redis/redis.conf`文件（与`compose.yaml`同级目录）：

```bash
$ mkdir redis
# 下载redis.conf
$ wget -cP redis https://raw.githubusercontent.com/redis/redis/7.0/redis.conf
$ vim redis/redis.conf
```

```bash
# [修改]
bind 127.0.0.1 -::1
==>
bind 0.0.0.0 -::1
# [修改] 默认yes，开启保护模式，限制为本地访问
protected-mode yes
==>
protected-mode no
# [修改] 默认no，改为yes意为开启aof持久化
appendonly no
==>
appendonly yes
# [增加] 开启访问密码
requirepass redis123
```

#### 5.2.3 执行

- 启动

```bash
$ docker compose up -d
```





