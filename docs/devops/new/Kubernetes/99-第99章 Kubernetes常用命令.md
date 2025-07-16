# 第99章 Kubernetes常用命令

## 1 kubectl命令

https://kubernetes.io/zh-cn/docs/reference/kubectl/introduction/

### 1.1 资源类型

| 资源                  | 简写    | 是否需指定命名空间 |
| --------------------- | ------- | ------------------ |
| namespaces            | ns      | false              |
| nodes                 | node/no | false              |
| service               | svc     | false              |
| pods                  | pod/po  | true               |
| deployments           | deploy  | true               |
| replicaset            | rs      | true               |
| ingress               | ing     | false              |
| persistentvolume      | pv      | false              |
| persistentVolumeClaim | pvc     | true               |
| ConfigMap             | cm      | true               |
| secret                | secret  | false              |
| endpoints             | ep      | true               |
| serviceaccount        | sa      | true               |
| clusterrole           |         | true               |
| clusterrolebinding    |         | true               |

## 1.2 版本

- 查看客户端和服务器侧版本信息

```bash
$ kubectl version
```

- 以group/version的格式显示服务器侧所支持的API版本

```bash
$ kubectl api-versions
```

## 1.3 查看对象信息

- 查看默认命名空间下所有资源

```bash
$ kubectl get all
```

- 查看指定命名空间下所有资源 

```bash
$ kubectl get all -n kube-system
```

- 查看集群所有节点

```bash
$ kubectl get nodes
```

- 查看集群所有的应用pods

```bash
$ kubectl get pods -A
```

- 查看集群中指定命名空间的应用pods

```bash
$ kubectl get pods -n <namespace>
```

## 1.4 资源处理

- 配置资源

```bash
$ kubectl apply -f <xxx.yaml>
```

- 删除资源

```bash
$ kubectl delete -f <xxx.yaml>
```

### 1.5 查看节点架构

```bash
$ kubectl describe node emon3 | grep "Architecture"
```

### 1.6 查看镜像支持的架构

```bash
$ docker manifest inspect quay.io/argoproj/argocd-applicationset:v0.4.1 | grep "architecture"
```



## 2 docker与containerd

 **常用命令**

ctr 是 containerd 的一个客户端工具。 crictl 是 CRI 兼容的容器运行时命令行接口，可以使用它来检查和调试 k8s 节点上的容器运行时和应用程序。 ctr -v 输出的是 containerd 的版本，crictl -v 输出的是当前 k8s 的版本，从结果显而易见你可以认为 crictl 是用于 k8s 的。

| docker              | ctr（containerd） | crictl（kubernetes）         |                      |
| :------------------ | :---------------- | :--------------------------- | -------------------- |
| 查看运行的容器      | docker ps         | ctr task ls/ctr container ls | crictl ps            |
| 查看镜像            | docker images     | ctr image ls                 | crictl images        |
| 查看容器日志        | docker logs       | 无                           | crictl logs          |
| 查看容器数据信息    | docker inspect    | ctr container info           | crictl inspect       |
| 查看容器资源        | docker stats      | 无                           | crictl stats         |
| 启动/关闭已有的容器 | docker start/stop | ctr task start/kill          | crictl start/stop    |
| 运行一个新的容器    | docker run        | ctr run                      | 无（最小单元为 pod） |
| 修改镜像标签        | docker tag        | ctr image tag                | 无                   |
| 创建一个新的容器    | docker create     | ctr container create         | crictl create        |
| 导入镜像            | docker load       | ctr image import             | 无                   |
| 导出镜像            | docker save       | ctr image export             | 无                   |
| 删除容器            | docker rm         | ctr container rm             | crictl rm            |
| 删除镜像            | docker rmi        | ctr image rm                 | crictl rmi           |
| 拉取镜像            | docker pull       | ctr image pull               | ctictl pull          |
| 推送镜像            | docker push       | ctr image push               | 无                   |
| 在容器内部执行命令  | docker exec       | 无                           | crictl exec          |







































