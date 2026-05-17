# 第6章 SortedSet有序集合

zet也称为sorted set：

sorted set：排序的set，可以去重可以排序，比如可以根据用户积分做排名，积分作为set的一个数值，根据数值可以做排序。set中的每一个member都带有一个分数。

- 添加zset元素

```bash
emon:6379> zadd key [NX|XX] [CH] [INCR] score member [score member ...]
```

- 查看zset元素

```bash
emon:6379> zrange key start stop [WITHSCORES]
```

- 获取zset指定元素的下标

```bash
emon:6379> zrank key member
```

- 获取zset指定元素的分数

```bash
emon:6379> zscore key member
```

- 查看zset元素数量

```bash
emon:6379> zcard key
```

- 统计分数区间内的元素数量

```bash
emon:6379> zcount key min max
```

- 统计分数区间内的元素，以列表显示元素

```bash
# 获取min<=x<=max的元素，如果不想要等于，可以使用 (min 和 (max，比如 zrangebyscore key (20 (40 表示大于20且小于40
emon:6379> zrangebyscore key min max [WITHSCORES] [LIMIT offset count]
```

- 删除zset元素，返回删除的元素数量

```bash
emon:6379> zrem key member [member ...]
```

- 正无穷和负无穷

```bash
# 添加最大得分元素
emon:6379> zadd zset1 +inf m
(integer) 1
# 添加最小
emon:6379> zadd zset1 -inf n
(integer) 1
emon:6379> zcard zset1
(integer) 2
emon:6379> zrange zset1 0 -1
1) "n"
2) "m"
```



