# 第32章 安装Tomcat

1. 下载

下载地址获取页面： https://tomcat.apache.org/whichversion.html

```bash
[emon@wenqiu ~]$ wget -cP /usr/local/src/ https://mirror.bit.edu.cn/apache/tomcat/tomcat-9/v9.0.34/bin/apache-tomcat-9.0.34.tar.gz
```

2. 创建安装目录

```bash
[emon@wenqiu ~]$ mkdir /usr/local/Tomcat
```

3. 解压安装

```bash
[emon@wenqiu ~]$ tar -zxvf /usr/local/src/apache-tomcat-9.0.34.tar.gz -C /usr/local/Tomcat/
```

4. 创建软连接

```bash
[emon@wenqiu ~]$ ln -s /usr/local/Tomcat/apache-tomcat-9.0.34/ /usr/local/tomcat
```

5. 配置UTF-8字符集

打开文件`/usr/local/tomcat/conf/server.xml ` 找到8080默认端口的配置位置，在xml节点末尾增加`URIEncoding="UTF-8"` ，修改后的内容如下：

```bash
 [emon@wenqiu ~]$ vim /usr/local/tomcat/conf/server.xml 
     <Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" URIEncoding="UTF-8"/>
```

6. 校验

```bash
[emon@wenqiu ~]$ /usr/local/tomcat/bin/catalina.sh version
```