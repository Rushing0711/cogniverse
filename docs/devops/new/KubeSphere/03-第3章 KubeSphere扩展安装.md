# 第3章 KubeSphere扩展安装

## 1 安装OpenELB负载均衡器

OpenELB 是一个开源的云原生负载均衡器实现，可以在基于裸金属服务器、边缘以及虚拟化的 Kubernetes 环境中使用 LoadBalancer 类型的 Service 对外暴露服务。

OpenELB安装：https://github.com/openelb/openelb/blob/master/README_zh.md

[openelb最新版官网文档](https://openelb.io/docs/getting-started/)

### 1.0 为什么选择 OpenELB

在云服务环境中的 Kubernetes 集群里，通常可以用云服务提供商提供的负载均衡服务来暴露 Service，但是在本地没办法这样操作。而 OpenELB 可以让用户在裸金属服务器、边缘以及虚拟化环境中创建 LoadBalancer 类型的 Service 来暴露服务，并且可以做到和云环境中的用户体验是一致的。

- 核心功能

  - BGP 模式和二层网络模式下的负载均衡

  - ECMP 路由和负载均衡

  - IP 池管理

  - 基于 CRD 来管理 BGP 配置

  - 支持 Helm Chart 方式安装

- 网络协议支持

  | 协议类型   | 适用场景                 | 工作原理                      |                                                          |
  | :--------- | :----------------------- | :---------------------------- | -------------------------------------------------------- |
  | **Layer2** | 同子网环境               | 通过 ARP(IPv4)/NDP(IPv6) 响应 | 简单易用，适合小型环境，<br />但有单点瓶颈（10节点以下） |
  | **BGP**    | 跨路由器环境             | 通过 BGP 协议广播路由         | 专业级解决方案，适合生产环境，<br />需要网络设备支持     |
  | **VIP**    | 需要虚拟 IP 的高可用场景 | 配合 Keepalived 实现          |                                                          |


- 核心工作流程


```mermaid
graph LR
A[创建 Eip 资源] --> B[定义 IP 池]
C[部署 LoadBalancer Service] --> D{OpenELB 控制器}
D -->|申请 IP| E[从 Eip 池分配]
D -->|配置协议| F[Layer2/BGP 广播]
G[外部客户端] -->|访问分配 IP| H[Service 流量]
```

- 绑定方式对比

  [官网OpenELP IP 地址分配](https://openelb.io/docs/getting-started/usage/openelb-ip-address-assignment/#there-is-a-default-eip-in-the-cluster)

  | 特性            | 自动分配          | 指定 Eip 池     | 静态 IP 绑定         |
  | :-------------- | :---------------- | :-------------- | :------------------- |
  | **IP 确定性**   | 随机分配          | 池内随机        | 固定 IP              |
  | **配置复杂度**  | 最简单（1个注解） | 中等（2个注解） | 最复杂（显式声明IP） |
  | **跨命名空间**  | 需 Eip 授权       | 需 Eip 授权     | 需 Eip 授权          |
  | **IP 冲突风险** | 低（自动管理）    | 低（自动管理）  | 高（需人工保障）     |
  | **适用场景**    | 测试环境          | 多团队生产环境  | 关键基础设施         |

  - 指定Eip池分配

  为服务添加注解，指定 OpenELB 作为负载均衡插件，并确保指定的 EIP 存在，无需检查是否分配给了命名空间。

  ```yaml
  apiVersion: network.kubesphere.io/v1alpha2
  kind: Eip
  metadata:
    name: layer2-eip # 定义elp资源
  spec:
    address: 172.31.73.130-172.31.73.132
    namespaces: 
    - project
    interface: eth0
    protocol: layer2
  
  ---
  kind: Service
  apiVersion: v1
  metadata:
    name: nginx
    namespace: project-test
    annotations:
      lb.kubesphere.io/v1alpha1: openelb # 指定 OpenELB 作为负载均衡插件
      eip.openelb.kubesphere.io/v1alpha2: layer2-eip # 指定elp资源
  spec:
    selector:
      app: nginx
    type: LoadBalancer
    ports:
      - name: http
        port: 80
        targetPort: 80
    externalTrafficPolicy: Cluster
  ```

  - 指定静态IP分配

  为服务添加注解，指定 OpenELB 作为负载均衡插件，并确保指定的 IP 在现有 EIP 的 CIDR 范围内，无需检查 EIP 是否分配给了命名空间。

  如果指定的 IP 已经分配，将会共享。

  ```yaml
  apiVersion: network.kubesphere.io/v1alpha2
  kind: Eip
  metadata:
    name: layer2-eip
  spec:
    address: 172.31.73.130-172.31.73.132 # 定义elp资源的ip范围
    namespaces: 
    - project
    interface: eth0
    protocol: layer2
  
  ---
  kind: Service
  apiVersion: v1
  metadata:
    name: nginx
    namespace: project-test
    annotations:
      lb.kubesphere.io/v1alpha1: openelb # 指定 OpenELB 作为负载均衡插件
      eip.openelb.kubesphere.io/v1alpha1: "192.168.1.10" # 指定一个在elp资源ip范围内的一个ip
  spec:
    selector:
      app: nginx
    type: LoadBalancer
    ports:
      - name: http
        port: 80
        targetPort: 80
    externalTrafficPolicy: Cluster
  
  
  # You can also set spec.loadBalancerIP to the specified ip. This method is recommended.
  ---
  kind: Service
  apiVersion: v1
  metadata:
    name: nginx1
    namespace: project-test
    annotations:
      lb.kubesphere.io/v1alpha1: openelb
  spec:
    loadBalancerIP: 192.168.1.10
    selector:
      app: nginx
    type: LoadBalancer
    ports:
      - name: http
        port: 80
        targetPort: 80
    externalTrafficPolicy: Cluster
  ```

  - 自动分配

    - 自动分配（没有默认elp）

    当您仅在注解中配置 `openelb` 而未指定 `eip` 和 `ip` 时，将进入自动分配。OpenELB 首先会找到一个合适的 eip，然后选择一个合适的 ip 完成分配。

    向 Service 添加注解，指定 OpenELB 作为负载均衡插件，并<span style="color:red;font-weight:bold;">确保命名空间分配给可用的 Eips</span>。

    ```yaml
    apiVersion: network.kubesphere.io/v1alpha2
    kind: Eip
    metadata:
      name: layer2-eip
    spec:
      address: 172.31.73.130-172.31.73.132
      namespaces: 
      - project
      interface: eth0
      protocol: layer2
    
    ---
    kind: Service
    apiVersion: v1
    metadata:
      name: nginx
      namespace: project
      annotations:
        lb.kubesphere.io/v1alpha1: openelb
    spec:
      selector:
        app: nginx
      type: LoadBalancer
      ports:
        - name: http
          port: 80
          targetPort: 80
      externalTrafficPolicy: Cluster
    ```

    :::info
  
    自动分配期间的 eip 选择策略：
  
    - 根据 `eip.namespace` 和 `eip.namespaceSelector` 预选可用的 Eips。
    - 按优先级对预选的 Eips 进行排序，并选择优先级最高的 Eip。
    - 如果没有预选 Eips，则使用默认 Eip。
    - 如果没有可用的 Eips，则分配失败并等待合适的 Eip。
    - 分配失败并等待 IP 释放，如果所有可用的 Eips 都已完全分配。
  
    :::
  
    - 自动分配（集群中有一个默认的 EIP）
  
      这里有一个如图所示的示例：
  
      - 使用注解 `"eip.openelb.kubesphere.io/is-default-eip": "true"` 将 `default-eip` 设置为默认的 EIP。
      - 命名空间 `namespace-1` 和 `namespace-2` 具有标签 `label: test` ，该标签被 `eip-selector` 的 `namespaceSelector` 用于匹配和选择。
      - `eip-ns` 的 Eip 有一个 namespaces 字段，它指定了 `namespace-1` 。这使得 `eip-ns` 能够匹配并被分配给 `namespace-1` 。
      - `eip` 弹性公网 IP 没有任何特殊配置。它只能用于指定分配，不能自动分配。
  
    ```yaml
    ```
  
    ![ipam-bind-to-namespace-1](images/ipam-bind-to-namespace-1.svg)
  
    | Namespace 命名空间 | Available Eip Count 可用 Eip 数量 |
    | ------------------ | --------------------------------- |
    | `namespace-1`      | 3                                 |
    | `namespace-2`      | 2                                 |
    | `namespace-3`      | 1                                 |
  
    :::info
  
    当可用 Eip 数量大于 1 时，将根据优先级选择最终的 Eip。
  
    - 命名空间绑定的 Eip 优先级高于默认 Eip。
    - 对于多个命名空间绑定的 Eip，将根据优先级字段确定优先级。优先级值越低，优先级越高。
  
    :::

### 1.1 使用kubectl安装和卸载OpenELB（v0.6.0）

#### 0 前置条件

你需要准备一个 Kubernetes 集群，并确保 Kubernetes 版本为 1.15 或更高版本。OpenELB 需要 CustomResourceDefinition (CRD) v1，而 Kubernetes 1.15 或更高版本才支持 CRD v1。

#### 1 下载并安装

```bash
$ cd /k8s_soft
$ wget https://raw.githubusercontent.com/openelb/openelb/release-0.6/deploy/openelb.yaml
$ kubectl apply -f openelb.yaml
```

#### 2 查看安装结果

```bash
$ kubectl get po -n openelb-system
```

#### 3 卸载

```bash
$ kubectl delete -f openelb.yaml
```

### 1.2 使用helm安装

#### 1 配置helm仓库并安装

```bash
$ helm repo add openelb https://openelb.github.io/openelb
$ helm repo update
$ helm install openelb openelb/openelb -n openelb-system --create-namespace
```

> 若网络不通，设置代理：
>
> ```bash
> $ export https_proxy=http://192.168.200.1:7890 http_proxy=http://192.168.200.1:7890 all_proxy=socks5://192.168.200.1:7890 no_proxy="xxx"
> ```

#### 2 查看安装结果

```bash
$ kubectl get po -n openelb-system
```

#### 3 卸载

```bash
$ helm delete openelb -n openelb-system
```

### 1.3 在 Layer 2 模式下使用 OpenELB

#### 1.3.0 前置条件

- 您需要准备一个已安装 OpenELB 的 Kubernetes 集群。所有 Kubernetes 集群节点必须在同一个 Layer 2 网络（同一路由器下）。
- 您需要准备一台客户端机器，用于验证 OpenELB 在 Layer 2 模式下的功能是否正常。客户端机器需要与 Kubernetes 集群节点位于同一网络。
- Layer 2 模式需要您的基础设施环境允许匿名 ARP/NDP 数据包。如果 OpenELB 在基于云的 Kubernetes 集群中进行测试安装，您需要向您的云供应商确认是否允许匿名 ARP/NDP 数据包。如果不允许，则无法使用 Layer 2 模式。

- <span style="color:red;font-weight:bold;">为OpenELB指定NIC网络接口卡（Network Interface Card）</span>

  如果OpenELB的安装节点有多个网卡（比如：eth0,eth1等），需要指定OpenELB在Layer 2模式下使用哪一个网卡。如果节点只有1个网卡，就不需要指定了。

  - **按需给节点添加注解**

  ```bash
  # 只给有多接口的节点添加注解："当此节点被选为 EIP 的 ARP 响应节点时，请使用 `192.168.200.116` 对应的接口"
  $ kubectl annotate nodes emon layer2.openelb.kubesphere.io/v1alpha1="192.168.200.116"
  ```

  > 查看是否存在多个网络适配器：
  >
  > ```bash
  > $ ip -o link show | awk '{print $2}' | cut -d':' -f1 | grep -Ev "lo|cali"
  > ```

  - **验证注解添加情况**

  ```bash
  $ kubectl describe node emon | grep openelb.kubesphere.io
  ```

  - **删除无用注解**（如果需要）：

  ```bash
  $ kubectl annotate node emon layer2.openelb.kubesphere.io/v1alpha1-
  ```

  - **影响选举行为**：

  ```mermaid
  graph TD
      A[EIP 192.168.200.91] --> B{选举 ARP 响应节点}
      B --> C[已注解节点]
      B --> D[未注解节点]
      C -->|优先选择| E[使用指定 IP 的接口]
      D -->|自动选择| F[同子网的第一个接口]
  ```

  

#### 1.3.1 第一步：确保已启用 Layer 2 模式

Layer 2 模式可以通过命令行参数启用或禁用。在使用 Layer 2 模式时，请确保 Layer 2 发言人已正确启用。

运行以下命令以编辑 openelb-speaker DaemonSet

```bash
$ kubectl edit ds -n openelb-system openelb-speaker
```

将 `enable-layer2` 设置为 `true` 并保存更改。openelb-speaker 将自动重启。

```yaml
    spec:
      containers:
      - args:
        - --api-hosts=:50051
        - --enable-keepalived-vip=false
        - --enable-layer2=true
        command:
        - openelb-speaker
```

#### 1.3.2 第二步：为 kube-proxy 启用 strictARP

在 Layer 2 模式下，您需要为 kube-proxy 启用 strictARP，以便 Kubernetes 集群中的所有网络接口卡停止应答来自其他网络接口卡的 ARP 请求，并由 OpenELB 处理 ARP 请求。

1. 登录到 Kubernetes 集群并运行以下命令编辑 kube-proxy ConfigMap：

```bash
$ kubectl edit configmap kube-proxy -n kube-system
```

2. 在 kube-proxy ConfigMap 的 YAML 配置中，将 `data.config.conf.ipvs.strictARP` 设置为 `true` 。

```yaml
ipvs:
  strictARP: true
```

3. 运行以下命令重启 kube-proxy：

```bash
$ kubectl rollout restart daemonset kube-proxy -n kube-system
```

#### 1.3.3 第三步：创建 Eip 对象

Eip 对象作为 OpenELB 的 IP 地址池使用。

1. 运行以下命令创建 Eip 对象的 YAML 文件：

```bash
$ vim layer2-eip.yaml
```

2. 将以下信息添加到 YAML 文件中：

```yaml
apiVersion: network.kubesphere.io/v1alpha2
kind: Eip
metadata:
  name: layer2-eip
spec:
  address: 192.168.200.91-192.168.200.100
  interface: ens160
  protocol: layer2
```

:::info

`spec:address` 中指定的 IP 地址必须与 Kubernetes 集群节点位于同一网络段。

有关 Eip YAML 配置中字段的详细信息，请参阅[使用 Eip 配置 IP 地址池](https://openelb.io/docs/getting-started/configuration/configure-ip-address-pools-using-eip/)。

:::

3. 运行以下命令创建 Eip 对象：

```bash
$ kubectl apply -f layer2-eip.yaml
```

#### 1.3.4 第四步：创建部署

以下使用 nginx 镜像创建一个包含两个 Pod 的 Deployment。每个 Pod 都会将其自己的 Pod 名称返回给外部请求。

1. 运行以下命令创建 Deployment 的 YAML 文件：

```bash
$ vim layer2-openelb.yaml
```

2. 将以下信息添加到 YAML 文件中：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: layer2-openelb
spec:
  replicas: 2
  selector:
    matchLabels:
      app: layer2-openelb
  template:
    metadata:
      labels:
        app: layer2-openelb
    spec:
      containers:
        - image: nginx:1.25.4
          name: nginx
          ports:
            - containerPort: 80
```

3. 运行以下命令创建 Deployment：

```bash
$ kubectl apply -f layer2-openelb.yaml
```

#### 1.3.5 第五步：创建服务

1. 运行以下命令为服务创建一个 YAML 文件：

```bash
$ vim layer2-svc.yaml
```

2. 将以下信息添加到 YAML 文件中：

```yaml
kind: Service
apiVersion: v1
metadata:
  name: layer2-svc
  annotations:
    lb.kubesphere.io/v1alpha1: openelb
    # For versions below 0.6.0, you also need to specify the protocol
    # protocol.openelb.kubesphere.io/v1alpha1: layer2
    eip.openelb.kubesphere.io/v1alpha2: layer2-eip
spec:
  selector:
    app: layer2-openelb
  type: LoadBalancer
  ports:
    - name: http
      port: 80
      targetPort: 80
  externalTrafficPolicy: Cluster
```

:::warning

- 你必须将 `spec:type` 设置为 `LoadBalancer` 。
- `lb.kubesphere.io/v1alpha1: openelb` 注释指定该服务使用 OpenELB。
- `protocol.openelb.kubesphere.io/v1alpha1: layer2` 注释指定 OpenELB 使用 Layer 2 模式。自 0.6.0 版本起已弃用。
- `eip.openelb.kubesphere.io/v1alpha2: layer2-eip` 注释指定 OpenELB 使用的 Eip 对象。如果未配置此注释，OpenELB 会自动选择一个可用的 Eip 对象。或者，您可以移除此注释并使用 `spec:loadBalancerIP` 字段（例如， `spec:loadBalancerIP: 192.168.200.91` ）或添加注释 `eip.openelb.kubesphere.io/v1alpha1: 192.168.200.91` 为服务分配特定的 IP 地址。当您将多个服务的 `spec:loadBalancerIP` 设置为相同的值以进行 IP 地址共享（这些服务通过不同的服务端口区分）时，在这种情况下，您必须将 `spec:ports:port` 设置为不同的值并将 `spec:externalTrafficPolicy` 设置为 `Cluster` 。有关 IPAM 的更多详细信息，请参阅 openelb ip address assignment。
- 如果 `spec:externalTrafficPolicy` 设置为 `Cluster` （默认值），OpenELB 会从所有 Kubernetes 集群节点中随机选择一个节点来处理 Service 请求。<span style="color:#9400D3;font-weight:bold;">其他节点上的 Pod 也可以通过 kube-proxy 访问</span>。
- 如果 `spec:externalTrafficPolicy` 设置为 `Local` ，OpenELB 会随机选择 Kubernetes 集群中包含 Pod 的节点来处理 Service 请求。<span style="color:#9400D3;font-weight:bold;">只有选中节点上的 Pod 才能被访问</span>。

:::

3. 运行以下命令创建服务：

```bash
$ kubectl apply -f layer2-svc.yaml
```

#### 1.3.6 第六步：验证 OpenELB 在 Layer 2 模式下的功能

以下验证 OpenELB 是否正常运行。

1. 在 Kubernetes 集群中，运行以下命令以确认容器组、部署都已成功，并获取服务的外部 IP 地址：

```bash
$ kubectl get deploy,po,svc
NAME                             READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/layer2-openelb   2/2     2            2           168m

NAME                                 READY   STATUS    RESTARTS   AGE
pod/layer2-openelb-c689cf6cd-8vkhl   1/1     Running   0          7m46s
pod/layer2-openelb-c689cf6cd-gqw6n   1/1     Running   0          7m35s

NAME                 TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)        AGE
service/kubernetes   ClusterIP      10.233.0.1     <none>           443/TCP        6d
service/layer2-svc   LoadBalancer   10.233.18.27   192.168.200.91   80:30996/TCP   147m
```

2. 在 Kubernetes 集群中，运行以下命令以获取集群节点的 IP 地址：

```bash
$ kubectl get nodes -o wide
```

3. 在 Kubernetes 集群中，运行以下命令以检查 Pod 的节点：

```bash
$ kubectl get pod -o wide
```

> 在这个示例中，Pods 会自动分配到不同的节点。你可以手动将 Pods 分配到不同的节点。

4. 在客户端机器（<span style="color:blue;font-weight:bold;">同一网段机器，非集群节点</span>）上，运行以下命令来 ping 服务 IP 地址并检查 IP 邻居：

- 通过 <span style="color:blue;font-weight:bold;">查看邻居</span> 命令查看IP绑定到哪一个集群节点了

```bash
# 无法ping通
$ ping 192.168.200.91 -c 4
# 查看邻居：在Linux机器上使用 `ip neigh`；在Mac机器上使用`arp -a`
$ arp -a
```

```bash
? (192.168.3.1) at f8:20:a9:5e:6d:7b on en0 ifscope [ethernet]
? (192.168.3.4) at 82:2d:64:e0:81:25 on en0 ifscope [ethernet]
? (192.168.3.49) at 40:f9:46:43:dd:42 on en0 ifscope [ethernet]
? (192.168.3.255) at ff:ff:ff:ff:ff:ff on en0 ifscope [ethernet]
? (192.168.32.255) at ff:ff:ff:ff:ff:ff on bridge101 ifscope [bridge]
? (192.168.186.255) at ff:ff:ff:ff:ff:ff on bridge100 ifscope [bridge]
? (192.168.200.91) at 0:c:29:3b:fe:91 on bridge102 ifscope [bridge]
? (192.168.200.92) at 0:c:29:30:af:3f on bridge102 ifscope [bridge]
emon (192.168.200.116) at 0:c:29:30:af:3f on bridge102 ifscope [bridge]
emon2 (192.168.200.117) at 0:c:29:49:3b:3e on bridge102 ifscope [bridge]
emon3 (192.168.200.118) at 0:c:29:3b:fe:91 on bridge102 ifscope [bridge]
? (192.168.200.255) at ff:ff:ff:ff:ff:ff on bridge102 ifscope [bridge]
mdns.mcast.net (224.0.0.251) at 1:0:5e:0:0:fb on en0 ifscope permanent [ethernet]
```

> 在 <span style="color:red;font-weight:bold;">查看邻居</span> 命令的输出中，服务 IP 地址 <span style="color:blue;font-weight:bold;">192.168.200.91</span> 的 MAC 地址与 <span style="color:blue;font-weight:bold;">emon3 (192.168.200.118)</span> 的 MAC 地址相同。因此，OpenELB 已将服务 IP 地址映射到 <span style="color:blue;font-weight:bold;">emon3</span> 的 MAC 地址。

- 通过容器组日志查看IP绑定到哪一个集群节点了

```bash
$ kubectl get pods -n openelb-system -l component=speaker -o name|xargs -I {} kubectl logs -n openelb-system {} | grep -A5 "192.168.200.91"
```

![image-20250719142427128](images/image-20250719142427128.png)

> 如图所示，服务 IP 地址 <span style="color:blue;font-weight:bold;">192.168.200.91</span> 绑定到了集群节点 <span style="color:blue;font-weight:bold;">emon3 (192.168.200.118)</span>  上的 <span style="color:blue;font-weight:bold;">ens160</span> 网卡上

5. 在客户端机器（<span style="color:blue;font-weight:bold;">同一网段机器，非集群节点</span>）上，运行 `curl` 命令以访问服务：

```bash
$ curl 192.168.200.91
```

### 1.4 在 VIP 模式下使用 OpenELB

#### 1.4.0 前置条件

- 您需要准备一个已安装 OpenELB 的 Kubernetes 集群。所有 Kubernetes 集群节点必须在同一个 Layer 2 网络（同一路由器下）。

- <span style="color:#9400D3;font-weight:bold;">所有 Kubernetes 集群节点必须只有一个网卡。当前 VIP 模式不支持具有多个网卡的 Kubernetes 集群节点</span>。
- 您需要准备一台客户端机器，用于验证 OpenELB 在 Layer 2 模式下的功能是否正常。客户端机器需要与 Kubernetes 集群节点位于同一网络。

- <span style="color:red;font-weight:bold;">为OpenELB指定NIC网络接口卡（Network Interface Card）</span>

  如果OpenELB的安装节点有多个网卡（比如：eth0,eth1等），需要指定OpenELB在Layer 2模式下使用哪一个网卡。如果节点只有1个网卡，就不需要指定了。

  - **按需给节点添加注解**

  ```bash
  # 只给有多接口的节点添加注解："当此节点被选为 EIP 的 ARP 响应节点时，请使用 `192.168.200.116` 对应的接口"
  $ kubectl annotate nodes emon layer2.openelb.kubesphere.io/v1alpha1="192.168.200.116"
  ```

  > 查看是否存在多个网络适配器：
  >
  > ```bash
  > $ ip -o link show | awk '{print $2}' | cut -d':' -f1 | grep -Ev "lo|cali"
  > ```

  - **验证注解添加情况**

  ```bash
  $ kubectl describe node emon | grep openelb.kubesphere.io
  ```

  - **删除无用注解**（如果需要）：

  ```bash
  $ kubectl annotate node emon layer2.openelb.kubesphere.io/v1alpha1-
  ```

  - **影响选举行为**：

  ```mermaid
  graph TD
      A[EIP 192.168.200.91] --> B{选举 ARP 响应节点}
      B --> C[已注解节点]
      B --> D[未注解节点]
      C -->|优先选择| E[使用指定 IP 的接口]
      D -->|自动选择| F[同子网的第一个接口]
  ```

#### 1.4.1 第一步：确保已启用 VIP 模式

VIP 模式可以通过命令行参数启用或禁用。使用 VIP 模式时，请确保 VIP 发言人已正确启用。

运行以下命令以编辑 openelb-speaker DaemonSet：

```bash
$ kubectl edit ds -n openelb-system openelb-speaker
```

将 `enable-keepalived-vip` 设置为 `true` 并保存更改。openelb-speaker 将自动重启。

```yaml
    spec:
      containers:
      - args:
        - --api-hosts=:50051
        - --enable-keepalived-vip=true
        - --enable-layer2=false
        command:
        - openelb-speaker
```

#### 1.4.2 第二步：创建 Eip 对象

Eip 对象作为 OpenELB 的 IP 地址池使用。

1. 运行以下命令创建 Eip 对象的 YAML 文件：

```bash
$ vim vip-eip.yaml
```

2. 将以下信息添加到 YAML 文件中：

```yaml
apiVersion: network.kubesphere.io/v1alpha2
kind: Eip
metadata:
  name: vip-eip
spec:
  address: 192.168.200.91-192.168.200.100
  interface: ens160
  protocol: vip
```

:::info

- `spec:address` 中指定的 IP 地址必须与 Kubernetes 集群节点位于同一网络段。
- 有关 Eip YAML 配置中字段的详细信息，请参阅[使用 Eip 配置 IP 地址池](https://openelb.io/docs/getting-started/configuration/configure-ip-address-pools-using-eip/)。

:::

3. 运行以下命令创建 Eip 对象：

```bash
$ kubectl apply -f vip-eip.yaml
```

#### 1.4.3 第三步：创建部署

以下使用 nginx 镜像创建一个包含两个 Pod 的 Deployment。每个 Pod 都会将其自己的 Pod 名称返回给外部请求。

1. 运行以下命令创建 Deployment 的 YAML 文件：

```bash
$ vim vip-openelb.yaml
```

2. 将以下信息添加到 YAML 文件中：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vip-openelb
spec:
  replicas: 2
  selector:
    matchLabels:
      app: vip-openelb
  template:
    metadata:
      labels:
        app: vip-openelb
    spec:
      containers:
        - image: nginx:1.25.4
          name: nginx
          ports:
            - containerPort: 80
```

3. 运行以下命令创建 Deployment：

```bash
$ kubectl apply -f vip-openelb.yaml
```

#### 1.4.4 第三步：创建服务[ ](https://openelb.io/docs/getting-started/usage/use-openelb-in-vip-mode/#step-4-create-a-service)

1. 运行以下命令为服务创建一个 YAML 文件：

```bash
$ vim vip-svc.yaml
```

2. 将以下信息添加到 YAML 文件中：

```yaml
kind: Service
apiVersion: v1
metadata:
  name: vip-svc
  annotations:
    lb.kubesphere.io/v1alpha1: openelb
    # For versions below 0.6.0, you also need to specify the protocol
    # protocol.openelb.kubesphere.io/v1alpha1: vip
    eip.openelb.kubesphere.io/v1alpha2: vip-eip
spec:
  selector:
    app: vip-openelb
  type: LoadBalancer
  ports:
    - name: http
      port: 80
      targetPort: 80
  externalTrafficPolicy: Cluster
```

:::warning

- 你必须将 `spec:type` 设置为 `LoadBalancer` 。
- `lb.kubesphere.io/v1alpha1: openelb` 注释指定该服务使用 OpenELB。
- `protocol.openelb.kubesphere.io/v1alpha1: vip` 注释指定 OpenELB 以 VIP 模式使用。自 0.6.0 版本起已弃用。
- `eip.openelb.kubesphere.io/v1alpha2: vip-eip` 注释指定 OpenELB 使用的 Eip 对象。如果未配置此注释，OpenELB 会自动选择一个可用的 Eip 对象。或者，您可以移除此注释并使用 `spec:loadBalancerIP` 字段（例如， `spec:loadBalancerIP: 192.168.200.91` ）或添加注释 `eip.openelb.kubesphere.io/v1alpha1: 192.168.200.91` 为服务分配特定的 IP 地址。当您将多个服务的 `spec:loadBalancerIP` 设置为相同的值以进行 IP 地址共享（这些服务通过不同的服务端口区分）时，在这种情况下，您必须将 `spec:ports:port` 设置为不同的值并将 `spec:externalTrafficPolicy` 设置为 `Cluster` 。有关 IPAM 的更多详细信息，请参阅 openelb ip address assignment。
- 如果 `spec:externalTrafficPolicy` 设置为 `Cluster` （默认值），OpenELB 会从所有 Kubernetes 集群节点中随机选择一个节点来处理 Service 请求。<span style="color:#9400D3;font-weight:bold;">其他节点上的 Pod 也可以通过 kube-proxy 访问</span>。
- 如果 `spec:externalTrafficPolicy` 设置为 `Local` ，OpenELB 会随机选择 Kubernetes 集群中包含 Pod 的节点来处理 Service 请求。<span style="color:#9400D3;font-weight:bold;">只有选中节点上的 Pod 才能被访问</span>。

:::

3. 运行以下命令创建服务：

```bash
$ kubectl apply -f vip-svc.yaml
```

#### 1.4.5 第五步：验证 VIP 模式下的 OpenELB

以下验证 OpenELB 是否正常运行。

1. 在 Kubernetes 集群中，运行以下命令以获取服务的外部 IP 地址：

```bash
$ kubectl get deploy,po,svc
NAME                          READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/vip-openelb   2/2     2            2           38s

NAME                               READY   STATUS    RESTARTS   AGE
pod/vip-openelb-64fcb9fb58-d55tm   1/1     Running   0          38s
pod/vip-openelb-64fcb9fb58-jmhn6   1/1     Running   0          38s

NAME                 TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)        AGE
service/kubernetes   ClusterIP      10.233.0.1     <none>           443/TCP        6d10h
service/vip-svc      LoadBalancer   10.233.41.54   192.168.200.91   80:31293/TCP   7s
```

2. 在 Kubernetes 集群中，运行以下命令以获取集群节点的 IP 地址：

```bash
$ kubectl get nodes -o wide
```

3. 在 Kubernetes 集群中，运行以下命令以检查 Pod 的节点：

```bash
$ kubectl get pod -o wide
```

>  在这个示例中，Pods 会自动分配到不同的节点。你可以手动将 Pods 分配到不同的节点。

4. 在客户端机器（<span style="color:blue;font-weight:bold;">同一网段机器，非集群节点</span>）上，运行以下命令来 ping 服务 IP 地址并检查 IP 邻居：

- 通过 <span style="color:blue;font-weight:bold;">查看邻居</span> 命令查看IP绑定到哪一个集群节点了

```bash
$ ping 192.168.200.91 -c 4
PING 192.168.200.91 (192.168.200.91): 56 data bytes
64 bytes from 192.168.200.91: icmp_seq=0 ttl=64 time=0.256 ms
64 bytes from 192.168.200.91: icmp_seq=1 ttl=64 time=0.258 ms
64 bytes from 192.168.200.91: icmp_seq=2 ttl=64 time=0.509 ms
64 bytes from 192.168.200.91: icmp_seq=3 ttl=64 time=0.427 ms

--- 192.168.200.91 ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 0.256/0.363/0.509/0.109 ms
```

```bash
# 查看邻居：在Linux机器上使用 `ip neigh`；在Mac机器上使用`arp -a`
$ arp -a
? (192.168.3.1) at f8:20:a9:5e:6d:7b on en0 ifscope [ethernet]
? (192.168.3.45) at 96:61:e1:c9:b0:67 on en0 ifscope [ethernet]
? (192.168.3.49) at 40:f9:46:43:dd:42 on en0 ifscope [ethernet]
? (192.168.3.255) at ff:ff:ff:ff:ff:ff on en0 ifscope [ethernet]
? (192.168.32.255) at ff:ff:ff:ff:ff:ff on bridge101 ifscope [bridge]
? (192.168.186.255) at ff:ff:ff:ff:ff:ff on bridge100 ifscope [bridge]
? (192.168.200.91) at 0:c:29:3b:fe:91 on bridge102 ifscope [bridge]
emon (192.168.200.116) at 0:c:29:30:af:3f on bridge102 ifscope [bridge]
emon2 (192.168.200.117) at 0:c:29:49:3b:3e on bridge102 ifscope [bridge]
emon3 (192.168.200.118) at 0:c:29:3b:fe:91 on bridge102 ifscope [bridge]
? (192.168.200.255) at ff:ff:ff:ff:ff:ff on bridge102 ifscope [bridge]
mdns.mcast.net (224.0.0.251) at 1:0:5e:0:0:fb on en0 ifscope permanent [ethernet]
```

> 在 <span style="color:red;font-weight:bold;">查看邻居</span> 命令的输出中，服务 IP 地址 <span style="color:blue;font-weight:bold;">192.168.200.91</span> 的 MAC 地址与 <span style="color:blue;font-weight:bold;">emon3 (192.168.200.118)</span> 的 MAC 地址相同。因此，OpenELB 已将服务 IP 地址映射到 <span style="color:blue;font-weight:bold;">emon3</span> 的 MAC 地址。

5. 在客户端机器（<span style="color:blue;font-weight:bold;">同一网段机器，非集群节点</span>）上，运行 `curl` 命令以访问服务：

```bash
$ curl 192.168.200.91
```

### 1.5 配置集群网关设置

admin 账户操作

- 集群设置=>网关设置=>启用网关

    - LoadBalancer
        - 负载均衡器提供商：默认 QingCloud Kubernets Engine，这里选择 OpenELB（选择哪一个都没关系，使用的是默认EIP）
        - 注解：添加下面注解

        | 注解key                                 | 注解value | 备注                                      |
        | --------------------------------------- | --------- | ----------------------------------------- |
        | lb.kubesphere.io/v1alpha1               | openelb   |                                           |
        | protocol.openelb.kubesphere.io/v1alpha1 | vip       | v0.6.0之前必须配置，自 0.6.0 版本起已弃用 |
        | eip.openelb.kubesphere.io/v1alpha2      | vip-eip   |                                           |
    
    - 点击确定

> 由于上面创建了默认eip，这里可以不用配置注解

- 查看是否启用成功

```bash
# 查看 EXTERNAL-IP 字段是否已经分配了eip地址，比如：192.168.200.91
$ kubectl -n kubesphere-controls-system get svc
```

<span style="color:green;font-weight:bold;">注意：192.168.200.91可以通过网络适配器ens160添加新ip的方式达到宿主机本地DNS访问</span>

## 2 SonarQube代码质量持续检测工具

[SonarQube](https://www.sonarqube.org/) 是一种主流的代码质量持续检测工具，可用于代码库的静态和动态分析。

### 2.1 安装

- 通过heml安装

```bash
$ helm repo add sonarqube https://charts.kubesphere.io/main
$ helm upgrade --install sonarqube sonarqube/sonarqube \
-n kubesphere-devops-system --create-namespace --set service.type=NodePort \
--set image.tag=9.9.0-community \
--set postgresql.image.tag=11.19.0-debian-11-r32
```

```bash
Release "sonarqube" does not exist. Installing it now.
NAME: sonarqube
LAST DEPLOYED: Tue Jul 22 12:56:14 2025
NAMESPACE: kubesphere-devops-system
STATUS: deployed
REVISION: 1
NOTES:
1. Get the application URL by running these commands:
  export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services sonarqube-sonarqube)
  export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
  echo http://$NODE_IP:$NODE_PORT
```

- 验证，确保所有 pod 都running

```bash
$ kubectl get po -n kubesphere-devops-system
```

- 卸载

```bash
$ helm uninstall sonarqube -n kubesphere-devops-system
```

### 2.2 获取 SonarQube 控制台地址

1. 执行以下命令获取 SonarQube NodePort。

```bash
export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services sonarqube-sonarqube)
export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
echo http://$NODE_IP:$NODE_PORT
```

2. 预期输出结果：（您的 NodeIP 和 NodePort 应该不同）

http://192.168.200.116:30681

### 2.3 配置 SonarQube 服务器

#### 2.3.1 步骤 1：访问 SonarQube 控制台

1. 执行以下命令查看 SonarQube 的状态。注意，只有在 SonarQube 启动并运行后才能访问 SonarQube 控制台。

```bash
$ kubectl get pod -n kubesphere-devops-system
NAME                                   READY   STATUS      RESTARTS            AGE
devops-29219130-b7hcq                  0/1     Completed   0                   3h37m
devops-29219310-vkj57                  0/1     Completed   0                   23m
devops-29219340-z2pwl                  0/1     Completed   0                   7m10s
devops-apiserver-5659d9c674-s7vj9      1/1     Running     4 (12m ago)         20h
devops-controller-6c6978c674-vxnlt     1/1     Running     4 (12m ago)         5d6h
devops-jenkins-7bf45c888-s2jmd         1/1     Running     2 (<invalid> ago)   20h
sonarqube-postgresql-0                 1/1     Running     0                   10m
sonarqube-sonarqube-6df784d857-kws2g   1/1     Running     0                   10m
```

2. 在浏览器中访问 SonarQube 控制台 [http://NodeIP:NodePort](http://nodeip:NodePort/)。

http://192.168.200.116:30681

3. 点击右上角的 **Log in**，然后使用默认账户 **admin/admin** 登录。

| 用户名 | 原密码 | 新密码   |
| ------ | ------ | -------- |
| admin  | admin  | P@88word |

:::info

取决于实例的部署位置，您可能需要设置必要的端口转发规则，并在您的安全组中放行该端口，以便访问 SonarQube。

:::

#### 2.3.2 步骤 2：创建 SonarQube 管理员令牌 (Token)

1. 点击右上角字母 **A**，然后从菜单中选择 **My Account** 以转到 **Profile** 页面。

![image-20250722133228028](images/image-20250722133228028.png)

2. 点击 **Security** 并输入令牌名称，例如 **kubeSphere**。

![image-20250722133715185](images/image-20250722133715185.png)

3. 点击 **Generate** 并复制此令牌。

![image-20250722133819960](images/image-20250722133819960.png)

令牌： sqa_fc5ecc5cabda522c7b67b40d05fd6bc894e3584f

:::danger
如提示所示，您无法再次查看此令牌，因此请确保复制成功。

:::

#### 2.3.3 步骤 3：创建 Webhook 服务器

1. 执行以下命令获取 SonarQube Webhook 的地址。

```bash
export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services devops-jenkins)
export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
echo http://$NODE_IP:$NODE_PORT/sonarqube-webhook/
```

2. 预期输出结果：

```bash
http://192.168.200.116:30180/sonarqube-webhook/
```

3. 依次点击 **Administration**、**Configuration** 和 **Webhooks** 创建一个 Webhook。

![image-20250722134558006](images/image-20250722134558006.png)

4. 点击 **Create**。

![image-20250722134649320](images/image-20250722134649320.png)

5. 在弹出的对话框中输入 **Name** 和 **Jenkins Console URL**（即 SonarQube Webhook 地址）。点击 **Create** 完成操作。

![image-20250722135035892](images/image-20250722135035892.png)

#### 2.3.4 步骤 4：将 SonarQube 服务器添加至 Jenkins

1. 执行以下命令获取 Jenkins 的地址。

```bash
export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services devops-jenkins)
export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
echo http://$NODE_IP:$NODE_PORT
```

您将获得如下输出：

```bash
http://192.168.200.116:30180
```

2. 参照[登录 Jenkins 仪表板](https://www.kubesphere.io/zh/docs/v4.1/11-use-extensions/01-devops/03-how-to-use/02-pipelines/07-access-jenkins-console)进行配置。





## 9、用户-企业空间-项目

- 登录 admin 创建如下用户

| 用户名          | 密码     | 角色                      | 作用                                                         |
| --------------- | -------- | ------------------------- | ------------------------------------------------------------ |
| admin           | Ks@12345 | platform-admin            | 平台管理员，可以管理平台内的所有资源。                       |
| ws-manager      | Ws@12345 | platform-self-provisioner | 创建企业空间并成为所创建企业空间的管理员。                   |
| ws-admin        | Ws@12345 | platform-regular          | 平台普通用户，在被邀请加入企业空间或集群之前没有任何资源操作权限。 |
| project-admin   | Ws@12345 | platform-regular          | 平台普通用户，在被邀请加入企业空间或集群之前没有任何资源操作权限。 |
| project-regular | Ws@12345 | platform-regular          | 平台普通用户，在被邀请加入企业空间或集群之前没有任何资源操作权限。 |

- <span style="color:green;font-weight:bold;">登录 ws-manager 创建企业空间</span>

企业空间： demo-workspace 邀请管理员 ws-admin

- 登录 ws-admin 邀请 project-admin/project-regular 进入企业空间，分别授予 demo-workspace-self-provisioner 和 demo-workspace-viewer 角色。<span style="color:red;font-weight:bold;">可编辑项目配额、默认容器配额</span>

> 备注：
>
> 实际角色名称的格式：`<workspace name>-<role name>`。例如，在名为 demo-workspace 的企业空间中，角色viewer的实际角色名称为 demo-workspace-viewer

| 用户名          | 角色             | 企业空间角色                    |                                                              |
| --------------- | ---------------- | ------------------------------- | ------------------------------------------------------------ |
| ws-admin        | platform-regular | demo-workspace-admin            | 管理指定企业空间中的所有资源（在此示例中，此用户用于邀请新成员加入企业空间）。 |
| project-admin   | platform-regular | demo-workspace-self-provisioner | 创建和管理项目以及 DevOps 项目，并邀请新成员加入项目。       |
| project-regular | platform-regular | demo-workspace-viewer           | `project-regular` 将由 `project-admin` 邀请至项目或 DevOps 项目。该用户将用于在指定项目中创建工作负载、流水线和其他资源。 |

- <span style="color:green;font-weight:bold;">登录 project-admin  创建项目 demo-project</span>，邀请 project-regular 进入项目，并授权 operator 角色。<span style="color:red;font-weight:bold;">可编辑项目配额（仅1次）、默认容器配额</span>

| 用户名          | 角色             | 企业空间角色                    | 项目角色 |
| --------------- | ---------------- | ------------------------------- | -------- |
| project-admin   | platform-regular | demo-workspace-self-provisioner | admin    |
| project-regular | platform-regular | demo-workspace-viewer           | operator |

- <span style="color:green;font-weight:bold;">登录 project-admin  创建项目 demo-devops</span>，邀请 project-regular 进入项目，并授权 operator 角色。<span style="color:red;font-weight:bold;">可编辑项目配额（仅1次）、默认容器配额</span>

| 用户名          | 角色             | 企业空间角色                    | 项目角色 |
| --------------- | ---------------- | ------------------------------- | -------- |
| project-admin   | platform-regular | demo-workspace-self-provisioner | admin    |
| project-regular | platform-regular | demo-workspace-viewer           | operator |

![image-20240628180327978](images/cicd-tools-fullsize.jpeg)



## 10、DevOps项目部署

### 10.1、准备工作

您需要[启用 KubeSphere DevOps 系统](https://www.kubesphere.io/zh/docs/v3.3/pluggable-components/devops/)。

注意：若内存不是很大，建议开启 devops 时内存可以限制为2G。

### 10.2、[将 SonarQube 集成到流水线](https://kubesphere.io/zh/docs/v3.4/devops-user-guide/how-to-integrate/sonarqube/)

要将 SonarQube 集成到您的流水线，必须先安装 SonarQube 服务器。

- 登录

http://192.168.200.116:30712

默认用户名密码：admin/admin

修改密码为： admin/Sq@12345

- 安装后资源概况

![image-20240630105708229](images/image-20240630105708229.png)

### 10.3、将 Harbor 集成到流水线

在应用商店安装Harbor

- 创建企业空间

<span style="color:green;font-weight:bold;">登录 admin 创建企业空间</span>

企业空间： harbor 邀请管理员 admin

- 创建项目

<span style="color:green;font-weight:bold;">登录 admin 在企业空间创建项目</span>

企业空间：harbor 创建项目 harbor

- 安装

在项目中，点击【应用负载】=>【应用】=>【创建】=>【从应用商店】=>搜索“Harbor”并安装。

> 如果不想使用ingress网关访问Harbor，则需要进行以下设置，然后点击**安装**
>
> 请按照如下指示的”修改x”进行修改（不是复制粘贴）

```yaml
expose:
  type: nodePort # 修改1：ingress => nodePort
  tls:
    enabled: false # 修改2：true=>false
      commonName: "192.168.200.116" # 修改3：""=>将commonName更改成你自己的值
externalURL: http://192.168.200.116:30002 # 修改4：使用自己的ipi
```

更改了应用设置后，点击安装即可！等待项目harbor下【应用负载】变成 running 后服务即可使用。

- 登录

http://192.168.200.116:30002

admin/Harbor12345

- 获取Harbor凭证

1. 安装 Harbor 后，请访问 `<NodeIP>:30002` 并使用默认帐户和密码 (`admin/Harbor12345`) 登录控制台。在左侧导航栏中点击**项目**并在**项目**页面点击**新建项目**。
2. 在弹出的对话框中，设置项目名称  ks-devops-harbor  并点击**确定**。
3. 点击刚刚创建的项目，在**机器人帐户**选项卡下点击**添加机器人帐户**。
4. 在弹出的对话框中，为机器人帐户设置名称  robot-test 以及设置永不过期，并点击**添加**。请确保在**权限**中勾选推送制品的权限选框。
5. 在弹出的对话框中，点击**导出到文件中**，保存该令牌。

- 启用 Insecure Registry

您需要配置 Docker，使其忽略您 Harbor 仓库的安全性。

1. 在您的主机上运行 `vim /etc/docker/daemon.json` 命令以编辑 `daemon.json` 文件，输入以下内容并保存更改。

```json
{
  "insecure-registries" : ["192.168.200.116:30002"]
}
```

2. 运行以下命令重启 Docker，使更改生效。

```bash
# 执行重启后，会影响到k8s环境，需要等待一会才可以继续访问k8s
$ systemctl daemon-reload && systemctl restart docker
```

- 安装后资源概况

![image-20240702135052980](images/image-20240702135052980.png)

- 测试

    - 创建凭证

    1. 以 `project-regular` 身份登录 KubeSphere 控制台，转到您的 DevOps 项目，在 **DevOps 项目设置**下的**凭证**页面为 Harbor 创建凭证。
    2. 在**创建凭证**页面，设置凭证 ID (`robot-test`)，**类型**选择**用户名和密码**。**用户名**字段必须和您刚刚下载的 JSON 文件中 `name` 的值相同，并在**密码/令牌**中输入该文件中 `token` 的值。
    3. 点击**确定**以保存。

    - 创建流水

    1. 转到**流水线**页面，点击**创建**。在**基本信息**选项卡，输入名称 (`demo-pipeline`)，然后点击**下一步**。
    2. **高级设置**中使用默认值，点击**创建**。

    - 编辑Jenkinsfile

    1. 点击该流水线进入其详情页面，然后点击**编辑 Jenkinsfile**。
    2. 将以下内容复制粘贴至 Jenkinsfile。请注意，您必须将 `REGISTRY`、`HARBOR_NAMESPACE`、`APP_NAME` 和 `HARBOR_CREDENTIAL` 替换为您自己的值。

  ```groovy
  pipeline {  
    agent {
      node {
        label 'maven'
      }
    }
  
    environment {
      // 您 Harbor 仓库的地址。
      REGISTRY = '192.168.200.116:30002'
      // 项目名称。
      // 请确保您的机器人帐户具有足够的项目访问权限。
      HARBOR_NAMESPACE = 'ks-devops-harbor'
      // Docker 镜像名称。
      APP_NAME = 'docker-example'
      // ‘robot-test’是您在 KubeSphere 控制台上创建的凭证 ID。
      HARBOR_CREDENTIAL = credentials('robot-test')
    }
  
    stages {
      stage('docker login') {
        steps{
          container ('maven') {
            // 请替换 -u 后面的 Docker Hub 用户名，不要忘记加上 ''。您也可以使用 Docker Hub 令牌。
            sh '''echo $HARBOR_CREDENTIAL_PSW | docker login $REGISTRY -u 'robot$robot-test' --password-stdin'''
          }
        }  
      }
  
      stage('build & push') {
        steps {
          container ('maven') {
            sh 'git clone https://github.com/kstaken/dockerfile-examples.git'
            sh 'cd dockerfile-examples/rethinkdb && docker build -t $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:devops-test .'
            sh 'docker push  $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:devops-test'
          }
        }
      }
    }
  }
  ```

    - 运行流水线

  保存该 Jenkinsfile，KubeSphere 会自动在图形编辑面板上创建所有阶段和步骤。点击**运行**来运行该流水线。如果一切运行正常，Jenkins 将推送镜像至您的 Harbor 仓库。

### 10.4、[使用 Jenkinsfile 创建流水线涉及的凭证](https://kubesphere.io/zh/docs/v3.4/devops-user-guide/how-to-use/pipelines/create-a-pipeline-using-jenkinsfile/)

| 凭证ID          | 类型                                     |
| --------------- | ---------------------------------------- |
| harbor-id       | 用户名和密码（密码填写Harbor机器人令牌） |
| github-id       | 用户名和密码（密码填写PAT令牌）          |
| demo-kubeconfig | kubeconfig                               |
| github-token    | 访问令牌                                 |
| gitee-id        | 用户名和密码（密码填写私人令牌）         |
| gitee-token     | 访问令牌                                 |

其中，github-id的创建方式：

![image-20240702175121985](images/image-20240702175121985.png)

![image-20240702175016014](images/image-20240702175016014.png)

### 10.5、为 KubeSphere 中的 Jenkins 安装插件（可选）

- 获取Jenkins地址

1. 运行以下命令获取 Jenkins 的地址。

```bash
export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services devops-jenkins)
export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
echo http://$NODE_IP:$NODE_PORT
```

2. 您会得到类似如下的输出。您可以通过输出的地址使用自己的 KubeSphere 用户和密码（例如 `admin/P@88w0rd`）访问 Jenkins 面板。

http://192.168.200.116:30180

- 在Jenkins面板上安装插件

1. 登录 Jenkins 面板，点击**系统管理**。

2. 在**系统管理**页面，下滑到**插件管理**并点击。

3. 点击**可选插件**选项卡，您必须使用搜索框来搜索所需插件。例如，您可以在搜索框中输入 `git`，勾选所需插件旁边的复选框，然后按需点击**直接安装**或**下载待重启后安装**。

   备注

   Jenkins 的插件相互依赖。安装插件时，您可能还需要安装其依赖项。

4. 如果已预先下载 HPI 文件，您也可以点击**高级**选项卡，上传该 HPI 文件作为插件进行安装。

5. 在**已安装**选项卡，可以查看已安装的全部插件。能够安全卸载的插件将会在右侧显示**卸载**按钮。

6. 在**可更新**选项卡，先勾选插件左侧的复选框，再点击**下载待重启后安装**，即可安装更新的插件。您也可以点击**立即获取**按钮检查更新。