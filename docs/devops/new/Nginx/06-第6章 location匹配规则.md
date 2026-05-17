# 第6章 location匹配规则

- `空格`：默认匹配，普通匹配

```bash
location / {
	root /home;
}
```

- `=`：精确匹配

```bash
location = /emon/img/face1.png {
	root /home;
}
```

- `~*`：匹配正则表达式，不区分大小写

```bash
# 符合图片的显示
location ~* .(GIF|jpg|png|jpeg) {
	root /home;
}
```

- `~`：匹配正则表达式，区分大小写

```bash
#GIF必须大写才能匹配到
location ~ .(GIF|jpg|png|jpeg) {
	root /home;
}	
```

- `^~`：以某个字符路径开头

```bash
location ^~ /emon/img {
	root /home;
}
```

## 关于proxy_pass代理转发

在nginx中配置proxy_pass代理转发时，如果在proxy_pass后面的url追加一个/，表示绝对根路径；如果没有/，表示相对根路径，把匹配的路径部分也给代理走。

假设下面四种情况分别用 http://192.168.1.1/proxy/test.html 进行访问。

- 第一种：

```nginx
location /proxy/ {
    proxy_pass http://127.0.0.1/;
}
```

代理到URL：http://127.0.0.1/test.html

- 第二种：

```nginx
location /proxy/ {
    proxy_pass http://127.0.0.1;
}
```

代理到URL：http://127.0.0.1/proxy/test.html

- 第三种：

```nginx
location /proxy/ {
    proxy_pass http://127.0.0.1/aaa/;
}
```

代理到URL：http://127.0.0.1/aaa/test.html

- 第四种：

```nginx
location /proxy/ {
    proxy_pass http://127.0.0.1/aaa;
}
```

代理到URL：http://127.0.0.1/aaatest.html
