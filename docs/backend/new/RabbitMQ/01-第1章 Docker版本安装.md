# 第1章 Docker版本安装

## 1.1 下载

下载地址获取页面： http://www.rabbitmq.com/download.html

docker镜像页面： https://hub.docker.com/_/rabbitmq/

## 1.2 安装

- 安装镜像

```bash
# 如果找不到镜像，下载并启动
$ docker run -itd --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.8.3-management
```

- 验证

http://IP:15672
