# 第90章 MongoDB的操作工具


## 90.1、Robo 3T连接

1. 下载

下载地址：https://robomongo.org/download

2. 启动并连接

## 90.2、Mongo Express

Mongo Express是一个基于网络的MongoDB数据库管理界面

### 90.2.1、安装MongoExpress（Docker版）

1. 下载mongo-express镜像

```bash
$ docker pull mongo-express
```

2. 运行mongo-express

```bash
[emon@emon ~]docker run --name myMgExp --link mymongo:mongo -p 18081:8081 -d mongo-express
```

- `--link <container_id|container_name>:alias` --> 表示链接2个容器，`:`之前是容器的name或者id，`:`之后的alias是源容器在link下的别名。
- 错误处理：

>/usr/bin/docker: Error response from daemon: driver failed programming external connectivity on endpoint hungry_chandrasekhar (e0b186c6848e9e6b7d01b8d2b99fc152358b80f2b528697c5f415009721686b5):  (iptables failed: iptables --wait -t nat -A DOCKER -p tcp -d 0/0 --dport 8081 -j DNAT --to-destination 172.17.0.4:8081 ! -i docker0: iptables: No chain/target/match by that name.
> (exit status 1)).
>ERRO[0000] error waiting for container: context canceled 

重启docker后再次试试：

```bash
$ sudo systemctl restart docker
```

## 90.3、Mongo Shell（Docker版）

Mongo Shell是用来操作MongoDB的javascript客户端界面

- 运行mongo shell

```bash
$ docker exec -it mymongo mongo
```

- 退出mongo shell

```bash
> exit
```

## 90.4、Studio 3T

### 4.1、复制集连接

【File】->【Connect...】->【New Connection】

在【Server】Tab中：

- Connection name：连接名称
- Connection Type：连接类型选择 Replica Set
- Members：点击【Add...】，录入Server和Port并点击【OK】，然后点击【Discover】
- Replica Set Name：复制集名称
- Read Preference：Primary

在【Authentication】Tab中：

- Authentication Mode：Legacy(SCRAM-SHA-1)
- User name：用户名
- Password：密码
- Authentication DB：数据库

