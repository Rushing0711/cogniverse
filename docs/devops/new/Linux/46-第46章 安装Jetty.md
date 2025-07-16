# 第46章 安装Jetty

https://jetty.org/download.html

1. 下载

下载地址获取页面：https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-distribution/

```bash
[emon@wenqiu ~]$ wget -cP /usr/local/src/ https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-distribution/9.4.55.v20240627/jetty-distribution-9.4.55.v20240627.tar.gz
```

2. 创建安装目录

```bash
[emon@wenqiu ~]$ mkdir /usr/local/Jetty
```

3. 解压安装

```bash
[emon@wenqiu ~]$ tar -zxvf /usr/local/src/jetty-distribution-9.4.55.v20240627.tar.gz -C /usr/local/Jetty/
```

4. 创建软连接

```bash
[emon@wenqiu ~]$ ln -s /usr/local/Jetty/jetty-distribution-9.4.55.v20240627/ /usr/local/jetty
```

5. 启动

```bash
$ sh jetty.sh start
```