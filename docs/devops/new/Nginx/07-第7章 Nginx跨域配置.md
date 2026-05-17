# 第7章 Nginx跨域配置

```bash
#允许跨域请求的域，*代表所有
add_header 'Access-Control-Allow-Origin' *;
#允许带上cookie请求
add_header 'Access-Control-Allow-Credentials' 'true';
#允许请求的方法，比如 GET/POST/PUT/DELETE
add_header 'Access-Control-Allow-Methods' *;
#允许请求的header
add_header 'Access-Control-Allow-Headers' *;
#允许发送按段获取资源的请求
add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
# 一定要有！！！否则Post请求无法进行跨域！
#在发送POST跨域请求之前，会以OPTIONS方式发送预检请求，服务器接受时才会正式请求！！！
if ($request_method = 'OPTIONS'){
	return 204;
}
```

## chrome证书问题

NET::ERR_CERT_AUTHORITY_INVALID

测试时启动Chrome添加参数：`--ignore-certificate-errors`

"C:\Program Files\Google\Chrome\Application\chrome.exe" --ignore-certificate-errors

在使用自动化测试Selenium、jvppeteer时也可以在启动Chrome浏览器时添加上这个参数。



## Access-Control-Allow-Origin multiple values 问题

Access to XMLHttpRequest at 'https://xxx' from origin 'https://xxx.com.cn' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header contains multiple values '*, *', but only one is allowed.

这个是由于"https://xxx"接口访问时，得到不止一个跨域的配置，最终导致：

> 'Access-Control-Allow-Origin' header contains multiple values '*, *'

去掉接口链路中多余的跨域配置即可！！！
