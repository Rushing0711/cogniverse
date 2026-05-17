# 第5章 root与alias

假如服务器路径为：`/home/emon/files/img/face.png`

- root路径完全匹配访问

配置的时候为：

```bash
location /emon {
	root /home
}
```

用户访问的时候请求路径为：`url:port/emon/files/img/face.png`

- alias可以为你的路径做一个别名，对用户透明

配置的时候为：

```bash
location /hello {
	alias /home/emon
}
```

用户访问的时候请求路径为：`url:port/hello/files/img/face.png`，如此相当于为目录`emon`做一个自定义的别名。
