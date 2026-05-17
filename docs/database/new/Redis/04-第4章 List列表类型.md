# 第4章 List列表类型

list:列表，[a,b,c,d...]

- 构建一个list，从左边开始存入数据

```bash
# 返回列表最新数据量
emon:6379> lpush key value [value ...]
```

- 查看list数据，-1表示到结尾

```bash
# 返回列表最新数据量
emon:6379> lrange key start stop
```

- 从右边存入数据

```bash
emon:6379> rpush key value [value ...]
```

- 从左侧开始拿出一个数据

```bash
# 返回被拿到的值，并从列表中剔除
emon:6379> lpop key
```

- 从右侧开始拿出一个数据

```bash
# 返回被拿到的值，并从列表中剔除
emon:6379> rpop key
```

- 查看list长度

```bash
emon:6379> llen key
```

- 获取list下标的值

```bash
emon:6379> lindex key index
```

- 把某个下标的值替换

```bash
# 成功返回OK
emon:6379> lset key index value
```

- 插入一个新的值

```bash
# pivot指代某个列表元素值，返回插入新值后元素的个数
emon:6379> linsert key before/after pivot value
```

- 删除几个相同数据

```bash
# 返回实际产出的数量
emon:6379> lrem key num value
```

- 截取值，替换原来的list，-1表示到结尾

```bash
# 截取后，原list被改变
emon:6379> ltrim key start end
```

