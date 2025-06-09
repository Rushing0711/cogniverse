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
| secret                | secret  |                    |

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

























