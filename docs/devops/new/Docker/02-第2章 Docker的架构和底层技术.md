# 第2章 Docker的架构和底层技术

## 1、Docker Platform

- Docker提供了一个开发，打包，运行app的平台
- 把app和底层infrastructure隔离开来

|         Docker Platform          |
| :------------------------------: |
|           Application            |
|          Docker Engine           |
| Infrastructure(physical/virtual) |

### 1.1、Docker Engine

- 后台进程（dockerd）
- REST API Server
- CLI接口（docker）

![image-20220312112414087](images/image-20220312112414087.png)

查看Docker后台进程：

```bash
$ ps -ef|grep docker
root         921       1  0 15:09 ?        00:00:01 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
root        1514    1106  0 15:57 pts/0    00:00:00 grep --color=auto docker
```



## 2、Docker Architecture

![image-20220312113046549](images/image-20220312113046549.png)

## 3、底层技术支持

- Namespaces：做隔离pid，net，ipc，mnt，uts
- Control groups：做资源限制
- Union file systems：Container和image的分层
