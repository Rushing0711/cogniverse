# 第99章 Kubernetes常用命令

## 1 kubectl命令

https://kubernetes.io/zh-cn/docs/reference/kubectl/introduction/

### 1.1 资源类型

| 资源类型（Kind）                 | 简写                             | 是否需指定命名空间 |
| -------------------------------- | -------------------------------- | ------------------ |
| `ConfigMap`                      | `cm`                             | true               |
| `DaemonSet`                      | `ds`                             | true               |
| `Deployment`                     | `deploy`                         | true               |
| `Endpoints`                      | `ep`                             | true               |
| `Ingress`                        | `ing`                            | false              |
| `Namespace`                      | `ns`                             | false              |
| `Node`                           | `node/no`                        | false              |
| `PersistentVolume`               | `pv`                             | false              |
| `PersistentVolumeClaim`          | `pvc`                            | true               |
| `Pod`                            | `pod/po`                         | true               |
| `ReplicaSet`                     | `rs`                             | true               |
| `Secret`                         | `secret`                         | false              |
| `Service`                        | `svc`                            | false              |
| `StatefulSet`                    | `sts`                            | true               |
| `StorageClass`                   | `sc`                             | false              |
| `ServiceAccount`                 | `sa`                             | true               |
| `ClusterRole`                    | `clusterrole`                    | true               |
| `ClusterRoleBinding`             | `clusterrolebinding`             | true               |
| `CustomResourceDefinition`       | `crd`                            | false              |
| `Job`                            | `job`                            | true               |
| `CronJob`                        | `cronjob`                        | true               |
| `HorizontalPodAutoscaler`        | `hpa`                            | true               |
| `NetworkPolicy`                  | `netpol`                         | true               |
| `PodDisruptionBudget`            | `pdb`                            | true               |
| `ResourceQuota`                  | `rq`                             | true               |
| `LimitRange`                     | `lr`                             | true               |
| `Event`                          | `ev`                             | true               |
| `MutatingWebhookConfiguration`   | `mutatingwebhookconfiguration`   | false              |
| `ValidatingWebhookConfiguration` | `validatingwebhookconfiguration` | false              |
| `PriorityClass`                  | `priorityclass`                  | false              |
| `Role`                           | `role`                           | true               |
| `RoleBinding`                    | `rolebinding`                    | true               |
| `Lease`                          | `lease`                          | true               |
| `ControllerRevision`             | `controllerrevision`             | true               |
| `PodTemplate`                    | `podtemplate`                    | true               |
| `ReplicaSet`                     | `rs`                             | true               |
| `ReplicationController`          | `rc`                             | true               |

### 1.2 版本

- 查看客户端和服务器侧版本信息

```bash
$ kubectl version
```

- 以group/version的格式显示服务器侧所支持的API版本

```bash
$ kubectl api-versions
```

### 1.3 查看对象信息

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

### 1.4 资源处理

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

### 1.7 查看context

```bash
$ kubectl config get-contexts
CURRENT   NAME                        CLUSTER    AUTHINFO           NAMESPACE
          kubernetes-admin@emon.com   emon.com   kubernetes-admin   
*         orbstack                    orbstack   orbstack 
```

- 设置当前上下文的默认命名空间

```bash
$ kubectl config set-context --current --namespace=kubesphere-system
```

- 清空当前上下文的默认命名空间

```bash
$ kubectl config unset current-context.namespace
```

## 2 docker/ctr/crictl/nerdctl对比说明

### 2.1 **关键区别总结**

<span style="color:#9400D3;font-weight:bold;">**Docker**</span>

- **定位**：完整的容器运行时 + 开发工具链
- **核心功能**：
  - 提供端到端的容器解决方案（构建、运行、分发）
  - 包含守护进程、CLI、镜像格式标准
- **典型场景**：
  ✅ 本地开发测试
  ✅ 单机容器部署
  ✅ CI/CD 流水线

------

<span style="color:#9400D3;font-weight:bold;">**ctr**</span>

- **定位**：containerd 的**底层调试工具**
- **核心功能**：
  - 直接操作 containerd 的核⼼组件（镜像/容器/任务）
  - 无守护进程抽象，命令与 containerd API 1:1 对应
- **典型场景**：
  🔧 containerd 问题排查
  🔍 查看容器运行时底层状态
  ⚠️ **不适合日常运维**

------

<span style="color:#9400D3;font-weight:bold;">**crictl**</span>

- **定位**：Kubernetes 节点的**运维调试工具**
- **核心功能**：
  - 通过 CRI 接口操作容器运行时
  - 专为 Kubernetes 节点设计（直接操作 kubelet 管理的容器）
- **典型场景**：
  ☸️ 诊断 K8s 节点容器问题
  📝 查看 Pod/容器日志
  🔍 检查容器运行时状态

------

<span style="color:#9400D3;font-weight:bold;">**nerdctl**</span>

- **定位**：containerd 的 **Docker 替代 CLI**
- **核心功能**：
  - 兼容 90% Docker 命令语法
  - 支持 rootless/命名空间等高级特性
  - 依赖 containerd，但无守护进程
- **典型场景**：
  🚀 containerd 环境的日常运维
  🔒 安全敏感环境（支持 rootless）
  ☸️ 管理 Kubernetes 使用的镜像（通过 `-n k8s.io`）

|                | Docker | ctr        | crictl     | nerdctl    |
| :------------- | :----- | :--------- | :--------- | :--------- |
| **完整运行时** | ✅      | ❌          | ❌          | ❌          |
| **K8s 原生**   | ❌      | ❌          | ✅          | △          |
| **生产运维**   | ✅      | ❌          | △          | ✅          |
| **开发友好**   | ✅      | ❌          | ❌          | ✅          |
| **依赖关系**   | 独立   | containerd | containerd | containerd |

> △：支持但非主要场景
> ✅：推荐场景
> ❌：不适用

------

**工具定位总结**

| **功能**        | **最佳工具** | **备选方案**    |
| :-------------- | :----------- | :-------------- |
| **日常开发**    | Docker       | nerdctl         |
| **K8s节点运维** | crictl       | ctr -n k8s.io   |
| **镜像构建**    | Docker       | nerdctl         |
| **底层调试**    | ctr          | nerdctl --debug |
| **安全环境**    | nerdctl      | ctr (rootless)  |

> 📌 **提示**：在K8s环境中，推荐组合使用：
>
> - **镜像管理**：`nerdctl -n k8s.io`
> - **容器调试**：`crictl`
> - **底层操作**：`ctr -n k8s.io`

**一句话选择指南**

- 开发环境用 **Docker**
- 排查 K8s 节点问题用 **crictl**
- containerd 生产环境用 **nerdctl**
- 深入 containerd 调试用 **ctr**

### 2.2 镜像与容器管理命令对照表

| 操作类别     | 操作描述       | docker                              | ctr (containerd)                   | crictl (CRI)                        | nerdctl                              |
| ------------ | -------------- | ----------------------------------- | ---------------------------------- | ----------------------------------- | ------------------------------------ |
| **镜像操作** |                |                                     |                                    |                                     |                                      |
|              | 拉取镜像       | `docker pull nginx`                 | `ctr image pull nginx`             | `crictl pull nginx`                 | `nerdctl pull nginx`                 |
|              | 列出本地镜像   | `docker images`                     | `ctr image ls`                     | `crictl images`                     | `nerdctl images`                     |
|              | 删除本地镜像   | `docker rmi nginx`                  | `ctr image rm nginx`               | `crictl rmi nginx`                  | `nerdctl rmi nginx`                  |
|              | **打标签**     | `docker tag nginx mynginx:1.0`      | `ctr image tag nginx mynginx:1.0`  | ❌ 不支持                            | `nerdctl tag nginx mynginx:1.0`      |
|              | 导出镜像       | `docker save -o nginx.tar nginx`    | `ctr image export nginx.tar nginx` | ❌ 不支持                            | `nerdctl save -o nginx.tar nginx`    |
|              | 导入镜像       | `docker load -i nginx.tar`          | `ctr image import nginx.tar`       | ❌ 不支持                            | `nerdctl load -i nginx.tar`          |
| **容器操作** |                |                                     |                                    |                                     |                                      |
|              | 创建容器       | `docker create nginx`               | `ctr container create nginx myctr` | `crictl create <POD> <JSON>`        | `nerdctl create nginx`               |
|              | 启动容器       | `docker start myctr`                | `ctr task start myctr`             | `crictl start <CONTAINER_ID>`       | `nerdctl start myctr`                |
|              | 停止容器       | `docker stop myctr`                 | `ctr task kill myctr`              | `crictl stop <CONTAINER_ID>`        | `nerdctl stop myctr`                 |
|              | 删除容器       | `docker rm myctr`                   | `ctr container rm myctr`           | `crictl rm <CONTAINER_ID>`          | `nerdctl rm myctr`                   |
|              | 列出运行中容器 | `docker ps`                         | `ctr task ls`                      | `crictl ps`                         | `nerdctl ps`                         |
|              | 列出所有容器   | `docker ps -a`                      | `ctr container ls`                 | `crictl ps -a`                      | `nerdctl ps -a`                      |
|              | 进入容器       | `docker exec -it myctr sh`          | `ctr task exec -t myctr sh`        | `crictl exec -it <CONTAINER_ID> sh` | `nerdctl exec -it myctr sh`          |
|              | 查看容器日志   | `docker logs myctr`                 | `ctr task logs myctr`              | `crictl logs <CONTAINER_ID>`        | `nerdctl logs myctr`                 |
|              | 查看容器详情   | `docker inspect myctr`              | `ctr container info myctr`         | `crictl inspect <CONTAINER_ID>`     | `nerdctl inspect myctr`              |
|              | 暂停容器       | `docker pause myctr`                | ❌ 不支持                           | ❌ 不支持                            | `nerdctl pause myctr`                |
|              | 恢复容器       | `docker unpause myctr`              | ❌ 不支持                           | ❌ 不支持                            | `nerdctl unpause myctr`              |
| **仓库操作** |                |                                     |                                    |                                     |                                      |
|              | 登录私有仓库   | `docker login registry.example.com` | ❌ 不支持                           | ❌ 不支持                            | `nerdctl login registry.example.com` |
|              | 登出私有仓库   | `docker logout`                     | ❌ 不支持                           | ❌ 不支持                            | `nerdctl logout`                     |
|              | 推送镜像       | `docker push myimg:1.0`             | `ctr image push myimg:1.0`         | ❌ 不支持                            | `nerdctl push myimg:1.0`             |
| **其他操作** |                |                                     |                                    |                                     |                                      |
|              | 构建镜像       | `docker build -t myimg .`           | ❌ 不支持                           | ❌ 不支持                            | `nerdctl build -t myimg .`           |
|              | 查看资源统计   | `docker stats`                      | ❌ 不支持                           | `crictl stats`                      | `nerdctl stats`                      |
|              | 清理停止容器   | `docker container prune`            | ❌ 不支持                           | ❌ 不支持                            | `nerdctl container prune`            |
|              | 清理悬空镜像   | `docker image prune`                | `ctr image prune`                  | ❌ 不支持                            | `nerdctl image prune`                |

### 2.3 镜像操作时关键差异说明

1. **镜像地址格式**：

- **ctr 必须使用完整路径**：`docker.io/library/nginx:latest`
- 其他工具支持简写：`nginx`

2. **命名空间管理**：

| 工具            | 默认命名空间 | 适用场景                 |
| :-------------- | :----------- | :----------------------- |
| `ctr images ls` | `default`    | 管理手动导入的镜像       |
| `crictl images` | `k8s.io`     | 查看 Kubernetes 集群镜像 |
| `nerdctl`       | `default`    | 运行非 Kubernetes 容器   |

3. 查看ctr所有的命名空间

```bash
$ sudo ctr ns ls
NAME    LABELS 
default        
k8s.io   
```

## 3 K8s资源的层次关系

```bash
集群 (Cluster)
├── 命名空间 (Namespace)
│   ├── 工作负载 (Workloads)
│   │   ├── Pod (容器组) ← 最基础单元
│   │   ├── Deployment (部署) ← 管理无状态应用
│   │   ├── StatefulSet (有状态副本集) ← 管理有状态应用
│   │   ├── DaemonSet (守护进程集) ← 每个节点一个Pod
│   │   ├── Job (任务) ← 一次性任务
│   │   └── CronJob (定时任务) ← 定时执行任务
│   ├── 服务发现 (Service Discovery)
│   │   ├── Service (服务)
│   │   └── Ingress (入口)
│   ├── 存储 (Storage)
│   │   ├── PersistentVolumeClaim (持久卷声明)
│   │   └── ConfigMap/Secret (配置/密钥)
│   └── 权限 (RBAC)
│       ├── Role/RoleBinding (角色/角色绑定)
│       └── ServiceAccount (服务账户)
└── 集群级别资源
    ├── Node (节点)
    ├── PersistentVolume (持久卷)
    ├── StorageClass (存储类)
    ├── ClusterRole/ClusterRoleBinding (集群角色/集群角色绑定)
    └── CustomResourceDefinition (自定义资源定义)
```





















