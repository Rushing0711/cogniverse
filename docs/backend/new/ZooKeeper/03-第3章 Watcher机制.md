# 第3章 Watcher机制

## 3.1 watcher操作概述

- 如何设置watcher？
  - `get -w path`
  - `ls -w path`
  - `stat -w path`
- 如何触发watcher？
  - 父节点增删改操作触发watcher
  - 子节点增删改操作触发watcher

## 3.2 父节点触发watcher

- 删除父节点触发：NodeDeleted

```bash
stat -w /test
deleteall /test
# 命令行输出
WATCHER::

WatchedEvent state:SyncConnected type:NodeDeleted path:/test
```

- 创建父节点触发：NodeCreated

```bash
stat -w /test
create /test 123
# 命令行输出
WATCHER::

WatchedEvent state:SyncConnected type:NodeCreated path:/test
```

- 修改父节点触发：NodeDataChanged

```bash
get -w /test
set /test 789
# 命令行输出
WATCHER::

WatchedEvent state:SyncConnected type:NodeDataChanged path:/test
```

## 3.3 子节点触发watcher

- 创建子节点触发：NodeChildrenChanged

```bash
ls -w /test
create /test/abc 888
# 命令行输出
WATCHER::

WatchedEvent state:SyncConnected type:NodeChildrenChanged path:/test
Created /test/abc
```

- 修改子节点不会触发事件

```bash
ls -w /test
set -s /test/abc 9090
```

- 删除子节点触发：NodeChildrenChanged

```bash
ls -w /test
delete /test/abc
# 命令行输出
WATCHER::

WatchedEvent state:SyncConnected type:NodeChildrenChanged path:/test
```
