# 第3章 Nginx参考实现

```nginx
server {
  listen 8808;
  server_name 192.168.1.66;
  access_log  logs/scrm.access.log  main;

  location ^~ /h5/ {
      rewrite ^/(.*)$  /index.html last;
  }

  location / {
    #root html/dist;
    root /home/saas/huiba/scrm/huiba-scrm-h5/webroot/h5;
    index index.html index.htm;
  }

  location ^~ /api/ {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto  $scheme;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_pass http://192.168.1.66:28781;
  }

  location ^~ /mgr/ {
      #rewrite ^/(.*)$  /index.html last;
      root /home/saas/huiba/scrm/huiba-scrm-web/webroot/;
      index index.html index.htm;
      add_header Access-Control-Allow-Origin *;
  }
}
```

```bash
server {
    listen 443 ssl;
    #配置HTTPS的默认访问端口为443。
    #如果未在此处配置HTTPS的默认访问端口，可能会造成Nginx无法启动。
    #如果您使用Nginx 1.15.0及以上版本，请使用listen 443 ssl代替listen 443和ssl on。
    server_name yourdomain; #需要将yourdomain替换成证书绑定的域名。
    rewrite ^(.*)$ https://$host$1; #将所有HTTP请求通过rewrite指令重定向到HTTPS。
    
    root html;
    index index.html index.htm;
    ssl_certificate cert/cert-file-name.pem;  #需要将cert-file-name.pem替换成已上传的证书文件的名称。
    ssl_certificate_key cert/cert-file-name.key; #需要将cert-file-name.key替换成已上传的证书私钥文件的名称。
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    #表示使用的加密套件的类型。
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3; #表示使用的TLS协议的类型。
    ssl_prefer_server_ciphers on;
    location / {
        root html;  #Web网站程序存放目录。
        index index.html index.htm;
    }
}
```



## Nginx配置https域名证书

```nginx
server {
    listen       80;
    listen       443 ssl;
    server_name  edeninterface.ishanshan.com;
    
    # 开启ssl
    ssl on;
    # 配置ssl证书
    ssl_certificate      /usr/local/openresty/nginx/conf/https/_.ishanshan.com_bundle.crt;
    # 配置证书秘钥
    ssl_certificate_key  /usr/local/openresty/nginx/conf/https/_.ishanshan.com.key;
    # ssl会话cache
    ssl_session_cache    shared:SSL:1m;
    # ssl会话超时时间
    ssl_session_timeout  5m;

    # 配置加密套件，写法遵循 openssl 标准
    ssl_protocols SSLv3 TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;
    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    location / {
        rewrite ^/website/introduction$  /eden-server/website/introduction last;
    }

    location ^~ /eden-server/website/introduction {
        #proxy_set_header x-rule "offline";
        proxy_pass http://edeninterface;
    
        # 客户端真实信息
        proxy_set_header X-Real-IP $remote_addr; # 客户端的真实IP
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # 告诉后端客户端的真实IP
        
        # 协议和主机信息
        proxy_set_header Host $http_host; # 客户端请求头中的 Host 值，包含端口号（如果指定），比如：example.com:8080	
        proxy_set_header X-Forwarded-Proto $scheme; # 告诉后端原始请求的协议（http/https）
        proxy_set_header X-Forwarded-Host $host; # 告诉后端原始请求的主机名，不包含端口号，比如：example.com	
        proxy_set_header X-Forwarded-Port $server_port; # 告诉后端原始请求的端口
        
        # 连接设置
        proxy_set_header Connection "Keep-Alive";
        proxy_http_version 1.1;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        proxy_redirect off;
    }
    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
    error_page  404              /404.html;

    location = /404.html {
        root   html;
    }

}
```



```nginx
server {
    listen 80;
    autoindex off;
    server_name interface.tamizoo.cn;
    # HTTPS ?.疆寮濮
    #if ($server_port = 80) {
    #   rewrite ^http://$host https://$host permanent;
    #   rewrite ^(.*)$ https://$host$1 permanent;
    #}
    listen 443;
    ssl on;
    ssl_certificate      cert/interface.tamizoo.cn/214688233200754.pem;
    ssl_certificate_key  cert/interface.tamizoo.cn/214688233200754.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    # HTTPS ?.疆缁..
    access_log /usr/local/nginx/logs/access.log combined;
    index index.html index.htm index.jsp index.php;
    #error_page 404 /404.html;
    if ( $query_string ~* ".*[\;'\<\>].*" ){
        return 404;
    }

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_read_timeout 600s;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```
