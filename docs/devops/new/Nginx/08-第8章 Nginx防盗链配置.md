# 第8章 Nginx防盗链配置

```bash
#对源站点验证
valid_referers *.emon.vip;
#非法引入会进入下方判断
if ($invalid_referer) {
	return 404;
}
```
