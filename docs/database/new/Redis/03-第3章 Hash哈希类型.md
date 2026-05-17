# 第3章 Hash哈希类型

hash：类似map，存储结构化数据结构，比如存储一个对象（不能有嵌套对象）。

- 设置hash

```bash
emon:6379> hset key field value
```

- 获取hash

```bash
emon:6379> hget key field
```

- 获取hash某个对象的全部属性

```bash
emon:6379> hkeys key
```

- 获取hash某个对象的全部值

```bash
emon:6379> hvals key
```

- 累加给定数值

```bash
# 注意，increment 可正可负可小数
emon:6379> hincrby key field increment
```

- 判断hash对象的属性是否存在

```bash
emon:6379> hexists key field
```

- 删除hash对象的属性

```bash
emon:6379> hdel key field [field ...]
```

- 获取hash对象

```bash
emon:6379> hgetall key 
```

- 连续设置hash

```bash
emon:6379> hmset key field value [field value ...]
```

- 连续获取

```bash
emon:6379> hmget key field [field ...]
```

