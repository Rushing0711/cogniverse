# 第2章 Nginx配置WebSocket

```nginx
location / {
    proxy_pass http://IP:Port;
  
    proxy_http_version 1.1; # 必须使用 HTTP/1.1
  
    # WebSocket代理协议升级头
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  
    # 标准代理头
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr; # 客户端的真实IP
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # 告诉后端客户端的真实IP
    proxy_set_header X-Forwarded-Proto $scheme;
  
    # 其他WebSocket优化配置
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
    proxy_connect_timeout 60s;
}
```
