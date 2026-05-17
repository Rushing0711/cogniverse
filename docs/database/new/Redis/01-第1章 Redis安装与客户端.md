# 第1章 Redis安装与客户端

[安装redis](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/Linux/LinuxInAction.md#12%E5%AE%89%E8%A3%85redis)


## 1.1、Redis的命令行客户端

- 关闭redis

```bash
redis-cli -a password shutdown
```

- 进入到redis客户端

```bash
# 默认登录本机服务
$ redis-cli
# 指定ip和端口
$ redis-cli -h localhost -p 6379
```

- 输入密码

```bash
emon:6379> auth `[密码]`
```

- 切换数据库，总共默认16个

```bash
# index的值在[0, 15]之间
emon:6379> select index
```

- 删除当前数据库中的数据

```bash
emon:6379> flushdb [ASYNC]
```

- 删除所有db中的数据

```bash
emon:6379> flushall
```

- 清屏

```bash
emon:6379> clear
```

- 帮助

```bash
# string类型命令操作帮助
emon:6379> help @string
# ttl命令帮助
emon:6379> help ttl
```

- 查看当前连接数

```bash
emon:6379> info clients
```

- 查看最大连接数

```bash
 emon:6379> config get maxclients
```

