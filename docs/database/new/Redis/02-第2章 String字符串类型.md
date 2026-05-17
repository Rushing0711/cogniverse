# 第2章 String字符串类型

string：最简单的字符串类型键值对缓存，也是最基本的。

- 查看所有的key（不建议在生产上使用，有性能影响）

```bash
emon:6379> keys * 
```

- 游标查询

```bash
emon:6379> scan cursor [MATCH pattern] [COUNT count]
# 第一次迭代传0
emon:6379> scan 0
# 指定返回2条
emon:6379> scan 0 count 2
# 指定match
emon:6379> scan 0 match day* count 3
```

- 查看key的类型

```bash
emon:6379> type key
```

- 设置以及存档的key，会覆盖已有同名key的值

```bash
emon:6379> set key value
OK
```

- 设置以及存档在key，不会覆盖

```bash
# 结果0表示未设置成功，1表示设置成功
emon:6379> setnx key value
(integer) 0
```

- 设置带过期时间的数据

```bash
# 设置秒为单位过期的数据
emon:6379> set key value ex time
# 设置毫秒为单位过期的数据
emon:6379> set key value px time
```

- 设置过期时间

```bash
# 结果0表示设置失败，比如key已不存在，1表示设置成功
emon:6379> expire key time
(integer) 0
```

- 查看剩余时间

```bash
# 结果-1表示永不过期，-2已过期
emon:6379> ttl key
(integer) -2
```

- 合并字符串

```bash
emon:6379> append key value
```

- 字符串长度

```bash
emon:6379> strlen key
```

- 累加1

```bash
# 仅能对integer类型的字符串数据操作，返回的结果表示累加1后的值
emon:6379> incr key
```

- 累减1

```bash
# 仅能对integer类型的字符串数据操作，返回的结果表示累加1后的值
emon:6379> decr key
```

- 累加给定数值

```bash
# 仅能对integer类型的字符串数据操作，返回的结果表示累加num后的值
emon:6379> incrby key num
```

- 累减给定数值

```bash
# 仅能对integer类型的字符串数据操作，返回的结果表示累减num后的值
emon:6379> decrby key num
```

- 截取数据，end=-1代表到最后

```bash
# 仅能对string类型的字符串数据操作
emon:6379> getrange key start end
```

- 从start位置开始替换数据

```bash
# 仅能对string类型的字符串数据操作
emon:6379> setrange key start newdata
```

- 连续设置

```bash
emon:6379> mset key value [key value ...]
```

- 连续取值

```bash
emon:6379> mget key [key ...]
```

- 连续设置，如果存在则不设置

```bash
# 特殊：如连续设置的key，有任何一个已经存在，则整体都会被忽略！0-表示全部被忽略，1-表示全部成功！
emon:6379> msetnx key value [key value ...]
(integer) 1
```

- 是否存在

```bash
# 存在返回1，否则返回0
emon:6379> exists key
```



