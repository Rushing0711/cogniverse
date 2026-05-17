# 第4章 Stream代理TCP

Nginx代理Kafka：https://zhuanlan.zhihu.com/p/358413575

如果客户端无法直接访问Kafka，通过Nginx代理访问到Kafka。

配置stream：

```bash
#增加stream配置，开启stream模块，nginx.conf中该模块和http模块同级
http {
	xxxxxxxxxx
}
#stream模块和http模块是并列级别的，所以stream要写在http{}外边
stream {
    log_format basic '$remote_addr [$time_local] '
                 '$protocol $status $bytes_sent $bytes_received '
                 '$session_time';
    access_log logs/stream-access.log basic buffer=32k;
    
    # 为了让这个配置文件简单一些，将配置stream放入到/etc/nginx/conf.d，并以.stream做后缀名。
    # 需要为每个端口创建一个.stream做后缀名的配置文件
    include vstream/*.stream;
}
```

创建文件夹`vstream`：

```bash
$ mkdir /usr/local/nginx/conf/vstream
```

创建一个stream配置：

```nginx
server {
    listen 9091;
    proxy_connect_timeout 1h;
    proxy_timeout 1h;
    proxy_pass 9.96.47.53:9092;
}
```
