# 第10章 Redis持久化

## 10.1、Redis持久化

Redis持久化简单理解就是把内存中的数据持久化到磁盘中，可以保证Redis重启之后还能恢复之前的数据。

Redis支持两种持久化，可以单独使用或者组合使用。

RDB和AOF。

### 10.1.1、RDB是Redis默认的持久化机制

RDB持久化是通过快照完成的，当符合一定条件时，Redis会自动将内存中的所有数据执行快照操作并存储到硬盘上，默认存储在dump.rdb文件中。

> Redis什么时候会执行快照？

Redis执行快照的时机是由以下参数控制的，这些参数是在redis.conf文件中的。

打开`redis.conf`文件：

```bash
save 900 1
save 300 10
save 60 10000
```

save 900 1 表示900秒内至少一个key被更改则进行快照。

这里面的三个时机哪个先满足都会执行快照操作。

RDB的优点：由于存储的有数据快照文件，恢复数据很方便。

RDB的缺点：会丢失最后一次快照以后更改的所有数据，因为两次快照之间是由一个时间差的，这期间之内修改的数据可能会丢失。

### 10.1.2、Redis持久化之AOF（Append Only File）

AOF重做日志在执行之后，MySQL重做日志在提交事务之前。

AOF持久化是通过日志文件的方式，默认情况下没有开启，可以通过appendonly参数开启。

打开`redis.conf`文件：

```bash
appendonly yes
appendfilename "appendonly.aof"
```

AOF日志文件的保存位置和RDB文件相同，都是dir参数设置的，默认的文件名是`appendonly.aof`。

> 注意：dir参数的值为.表示当前目录，也就是说我们在哪一个目录下启动redis，rdb快照文件和aof日志就产生在哪一个目录。

AOF方式只会记录用户的写命令，添加、修改、删除之类的命令，查询命令不会记录，因为查询命令不会影响数据内容。

那redis什么时候会把用户的写命令同步到aof文件中呢？

打开`redis.conf`文件：

```bash
# appendfsync always
appendfsync everysec
# appendfsync no
```

默认是每秒钟执行一次同步操作。`appendfsync everysec`。

也可以实现每执行一次写操作就执行一次同步操作，`appendfsync always`，但是这样效率会有点低。

或者使用`appendfsync no`，表示不主动进行同步，由操作系统来做，30秒执行一次。

如果大家对数据的丢失确实是0容忍的话，可以使用always。

不过一般情况下，redis中存储的都是一些缓存数据，就算丢了也没关系，程序还会继续往里面写新数据，不会造成多大影响。
