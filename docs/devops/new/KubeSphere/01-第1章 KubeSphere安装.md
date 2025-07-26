# 第1章 Kubesphere安装

KubeSphere Cloud 官网：https://kubesphere.com.cn/

KubeSphere 开源版官网：https://kubesphere.io/zh/

Github：https://github.com/kubesphere/kubesphere/blob/master/README_zh.md  可以查看与k8s版本关系

v3.4.1安装文档：

[在Kubernetes上最小化安装KubeSphere](https://kubesphere.io/zh/docs/v3.4/quick-start/minimal-kubesphere-on-k8s/)

[在Kubernetes上安装KubeSphere3.4.1](https://kubesphere.io/zh/docs/v3.4/installing-on-kubernetes/)

[启用可插拔组件](https://kubesphere.io/zh/docs/v3.4/pluggable-components/)

[从Kubenetes上卸载KubeSphere](https://kubesphere.io/zh/docs/v3.4/installing-on-kubernetes/uninstall-kubesphere-from-k8s/)

[KubeSphere 开源社区](https://ask.kubesphere.io/forum/)

v4.1.3安装文档：

[在 Kubernetes 上快速安装 KubeSphere](https://kubesphere.io/zh/docs/v4.1/02-quickstart/01-install-kubesphere/)

[在 Linux 上安装 Kubernetes 和 KubeSphere](https://kubesphere.io/zh/docs/v4.1/03-installation-and-upgrade/02-install-kubesphere/02-install-kubernetes-and-kubesphere/)

## 0 先决条件？

### 0.1 Kubesphere是什么？

KubeSphere就是Java编程界的Spring。

KubeSphere，这是国内唯一一个开源的Kubernetes（k8s）发行版，它的开源不涉及任何商业意图，它不属于青云而属于社区，它极大地降低了使用Kubernetes的门槛，它的出现将加速中国企业向云原生迈进的步伐。
“发行版”的说法常用于Linux操作系统。比如，虽有Linux内核，而Ubuntu、CentOS等等叫做Linux发行版，对应的，Kubernetes就相当于内核，KubeSphere就是Kubernetes的发行版，正常人类是很难使用Linux内核和Kubenetes的，为了让大家用起来，要基于Linux内核和Kubernetes做很多周边配套，Linux和Kubenetes就好像一台光秃秃的汽车发动机，为了把它当车开，你起码得有车架子、轮胎、方向盘、刹车、……等等。
所以，开源KubeSphere的青云就像一个汽车厂，负责KubeSphere牌汽车各个组件的组装搭配，不过，这个汽车不需要花钱就能获取到，这就是青云开源KubeSphere的实质。它的意义在于加快了大家使用k8s发动机的进程，让大家都能开上KubeSphere牌汽车。
云原生能帮助企业做数字化转型，帮助企业用数字化转型获取竞争力。而KubeSphere可以让企业更快地上原生，开上汽车。

### 0.2 服务器规划

| 机器名 | 系统类型 | IP地址          | CPU  | 内存  | 部署内容 |
| ------ | -------- | --------------- | ---- | ----- | -------- |
| emon   | Rocky9.5 | 192.168.200.116 | 4核  | >=16G | master   |
| emon2  | Rocky9.5 | 192.168.200.117 | 4核  | >=16G | worker   |
| emon3  | Rocky9.5 | 192.168.200.118 | 4核  | >=16G | worker   |

### 0.3 基础环境准备

参考：[基础环境准备](http://localhost:8751/devops/new/Kubernetes/01-%E7%AC%AC1%E7%AB%A0%20Kubeadmin%E5%AE%89%E8%A3%85K8S%20V1.23.html#_1-%E5%9F%BA%E7%A1%80%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87)

### 0.4 安装Docker【若用KK安装，请忽略】

参考：[Docker的安装与配置.md](http://localhost:8751/devops/new/Docker/01-%E7%AC%AC1%E7%AB%A0%20Docker%E7%9A%84%E5%AE%89%E8%A3%85%E4%B8%8E%E9%85%8D%E7%BD%AE.html)

### 0.5 安装Kubernetes【若用KK安装，请忽略】

参考：[kubeadm创建K8S集群](http://localhost:8751/devops/new/Kubernetes/01-%E7%AC%AC1%E7%AB%A0%20Kubeadmin%E5%AE%89%E8%A3%85K8S%20V1.23.html#_3-kubeadm%E5%88%9B%E5%BB%BA%E9%9B%86%E7%BE%A4-%E4%BB%85master%E8%8A%82%E7%82%B9)

### 0.6 **创建数据目录**

#### 0.6.1 创建 **OpenEBS** 本地数据根目录

```bash
$ mkdir -p /data/openebs/local
```

#### 0.6.2 创建 **Containerd** 数据目录

```bash
$ mkdir -p /data/containerd
```

#### 0.6.3 创建 Containerd 数据目录软连接

```bash
$ ln -snf /data/containerd /var/lib/containerd
```

:::info

**说明：** KubeKey 到 v3.1.1 版为止，一直不支持在部署的时候更改 Containerd 的数据目录，只能用这种目录软链接的方式，变相增加存储空间（**也可以提前手工安装 Containerd**）。

:::

## 1 部署 Kubernetes 集群

本文利用 KubeSphere 出品的 KubeKey 工具，部署一套包含**三个节点**， **Control 和 Worker 复用**的 K8s 高可用集群。

将 **Control 1节点** 作为部署节点，执行下面的操作。

### 1.1 下载 KubeKey

- 下载最新版（v3.1.10）

```bash
$ mkdir /k8s_soft/kubekey
$ cd /k8s_soft/kubekey/

# 选择中文区下载(访问 GitHub 受限时使用)
$ export KKZONE=cn
$ curl -sfL https://get-kk.kubesphere.io | sh -
```

- 查看 KubeKey 支持的 Kubernetes 版本列表

```bash
$ ./kk version --show-supported-k8s
```

> KubeKey 支持的 K8s 版本相对较新。本文选择 v1.30.6，而在生产环境中，建议选择 v1.28.15 或其他次要版本为双数且补丁版本超过 5 的版本，以确保更高的稳定性和兼容性。建议避免选择过老的版本，毕竟目前 v1.31.2 已经发布，可以为集群提供更强的功能和安全性。

### 1.2 创建 Kubernetes 集群部署配置

1. 创建集群配置文件

本文选择了 **v1.30.6**。因此，指定配置文件名称为 **ksp-k8s-v1306.yaml**，如果不指定，默认的文件名为 **config-sample.yaml**。

```bash
$ ./kk create config -f ksp-k8s-v1306.yaml --with-kubernetes v1.30.6
```

> **注意：**
>
> - 安装完成后，请勿删除安装配置文件 **ksp-k8s-v1306.yaml**，后续进行节点扩容、卸载等操作时仍需要使用该文件。如果该文件丢失，您需要重新创建安装配置文件。
> - 生成的默认配置文件内容较多，请参阅 [KubeKey 配置示例](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md) 了解完整配置说明。

2. 修改配置文件

请使用 `vi` 编辑器，编辑配置文件 `ksp-k8s-v1306.yaml`，修改 **kind: Cluster** 小节中 hosts 和 roleGroups 等信息，修改说明如下：

- metadata.name：自定义集群名称 **kspxlab**，默认值 **sample**

- hosts：指定节点的 IP、ssh 用户、ssh 密码；若是arm架构，请指定 arch
- roleGroups：指定 3 个 etcd、control-plane 节点，并复用为 worker 节点
- internalLoadbalancer： 启用内置的 HAProxy 负载均衡器
- domain：自定义域名 **lb.kspxlab.local**，没特殊需求可使用默认值 **lb.kubesphere.local**
- clusterName：自定义 **kspxlab.local**，没特殊需求可使用默认值 **cluster.local**
- autoRenewCerts：该参数可以实现证书到期自动续期，默认为 **true**
- containerManager：容器运行时使用 **containerd**
- storage.openebs.basePath：**默认没有，新增配置**，指定 openebs 默认存储路径为 **/data/openebs/local**
- registry.privateRegistry：**可选配置，** 解决 Docker 官方镜像不可用的问题
- registry.namespaceOverride： **可选配置，** 解决 Docker 官方镜像不可用的问题

修改后的完整示例如下：

```yaml

apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: kspxlab
spec:
  hosts:
  - {name: emon, address: 192.168.200.116, internalAddress: 192.168.200.116, user: root, password: "root123", arch: arm64}
  - {name: emon2, address: 192.168.200.117, internalAddress: 192.168.200.117, user: root, password: "root123", arch: arm64}
  - {name: emon3, address: 192.168.200.118, internalAddress: 192.168.200.118, user: root, password: "root123", arch: arm64}
  roleGroups:
    etcd:
    - emon
    - emon2
    - emon3
    control-plane:
    - emon
    - emon2
    - emon3
    worker:
    - emon
    - emon2
    - emon3
  controlPlaneEndpoint:
    ## Internal loadbalancer for apiservers 
    internalLoadbalancer: haproxy # 如需部署⾼可⽤集群，且⽆负载均衡器可⽤，可开启该参数，做集群内部负载均衡
    domain: lb.kubesphere.local
    address: ""
    port: 6443
  kubernetes:
    version: v1.30.6
    clusterName: cluster.local
    autoRenewCerts: true
    containerManager: containerd # 部署 kubernetes v1.24+ 版本，建议将 containerManager 设置为 containerd
  etcd:
    type: kubekey
  network:
    plugin: calico
    kubePodsCIDR: 10.233.0.0/17
    kubeServiceCIDR: 10.96.0.0/16
    ## multus support. https://github.com/k8snetworkplumbingwg/multus-cni
    multusCNI:
      enabled: false
  storage:
    openebs:
      basePath: /data/openebs/local # 默认没有的新增配置，base path of the local PV 
  registry:
    privateRegistry: "registry.cn-beijing.aliyuncs.com" # 使用 KubeSphere 在阿里云的镜像仓库
    namespaceOverride: "kubesphereio"
    registryMirrors: []
    insecureRegistries: []
  addons: []

```

### 1.3 部署 K8s 集群

使用上面生成的配置文件，执行下面的命令，创建 K8s 集群。

```bash
$ export KKZONE=cn
$ ./kk create cluster -f ksp-k8s-v1306.yaml --with-local-storage
```

> 说明：
>
> 如需使用 openebs localpv，可在命令后添加参数 --with-local-storage。如需对接其他存储，可在配置文件 addons 中添加配置相关存储插件，或 Kubernetes 集群部署完成后自行安装。

命令执行后，首先 **Kubekey** 会检查部署 K8s 的依赖及其他详细要求。通过检查后，系统将提示您确认安装。输入 **yes** 并按 **ENTER** 继续部署。

```bash


 _   __      _          _   __           
| | / /     | |        | | / /           
| |/ / _   _| |__   ___| |/ /  ___ _   _ 
|    \| | | | '_ \ / _ \    \ / _ \ | | |
| |\  \ |_| | |_) |  __/ |\  \  __/ |_| |
\_| \_/\__,_|_.__/ \___\_| \_/\___|\__, |
                                    __/ |
                                   |___/

10:43:06 CST [GreetingsModule] Greetings
10:43:07 CST message: [emon3]
Greetings, KubeKey!
10:43:07 CST message: [emon2]
Greetings, KubeKey!
10:43:07 CST message: [emon]
Greetings, KubeKey!
10:43:07 CST success: [emon3]
10:43:07 CST success: [emon2]
10:43:07 CST success: [emon]
10:43:07 CST [NodePreCheckModule] A pre-check on nodes
10:43:07 CST success: [emon]
10:43:07 CST success: [emon2]
10:43:07 CST success: [emon3]
10:43:07 CST [ConfirmModule] Display confirmation form
+-------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+
| name  | sudo | curl | openssl | ebtables | socat | ipset | ipvsadm | conntrack | chrony | docker | containerd | nfs client | ceph client | glusterfs client | time         |
+-------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+
| emon  | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | y          |            |             |                  | CST 10:43:07 |
| emon2 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | y          |            |             |                  | CST 10:43:07 |
| emon3 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | y          |            |             |                  | CST 10:43:07 |
+-------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+

This is a simple check of your environment.
Before installation, ensure that your machines meet all requirements specified at
https://github.com/kubesphere/kubekey#requirements-and-recommendations

Install k8s with specify version:  v1.30.6

Continue this installation? [yes/no]: yes
```

> **注意：**
>
> - nfs client、ceph client、glusterfs client 3 个与存储有关的 client 显示没有安装，这个我们后期会在对接存储的实战中单独安装
> - docker、containerd 会根据配置文件选择的 **containerManager** 类型自动安装

部署完成需要大约 10-20 分钟左右，具体看网速和机器配置，本次部署完成耗时 6 分钟（千兆宽带）。

部署完成后，如果在终端上显示如下信息，则表明 K8s 集群创建成功。

```bash
10:49:12 CST Pipeline[CreateClusterPipeline] execute successfully
Installation is complete.

Please check the result using the command:

        kubectl get pod -A
```

### 1.4 虚拟机挂起并恢复后k8s网络问题（所有节点）

[虚拟机挂起并恢复后k8s网络问题（所有节点）](http://localhost:8751/devops/new/Kubernetes/01-%E7%AC%AC1%E7%AB%A0%20Kubeadmin%E5%AE%89%E8%A3%85K8S%20V1.23.html#_3-4-%E8%99%9A%E6%8B%9F%E6%9C%BA%E6%8C%82%E8%B5%B7%E5%B9%B6%E6%81%A2%E5%A4%8D%E5%90%8Ek8s%E7%BD%91%E7%BB%9C%E9%97%AE%E9%A2%98-%E6%89%80%E6%9C%89%E8%8A%82%E7%82%B9)

## 2 验证 K8s 集群状态

### 2.1 查看集群节点信息

在 **控制节点 1** 运行 `kubectl` 命令获取 K8s 集群上的可用节点列表。

```bash
$ kubectl get nodes -o wide
```

在输出结果中可以看到，当前的 K8s 集群有三个可用节点、节点角色、K8s 版本号、节点的内部 IP、操作系统类型、内核版本、容器运行时及版本号等信息。

```bash
NAME    STATUS   ROLES                  AGE   VERSION   INTERNAL-IP       EXTERNAL-IP   OS-IMAGE                      KERNEL-VERSION                  CONTAINER-RUNTIME
emon    Ready    control-plane,worker   19m   v1.30.6   192.168.200.116   <none>        Rocky Linux 9.5 (Blue Onyx)   5.14.0-503.40.1.el9_5.aarch64   containerd://1.7.13
emon2   Ready    control-plane,worker   18m   v1.30.6   192.168.200.117   <none>        Rocky Linux 9.5 (Blue Onyx)   5.14.0-503.40.1.el9_5.aarch64   containerd://1.7.13
emon3   Ready    control-plane,worker   18m   v1.30.6   192.168.200.118   <none>        Rocky Linux 9.5 (Blue Onyx)   5.14.0-503.40.1.el9_5.aarch64   containerd://1.7.13
```

### 2.2 查看 Pod 信息

输入以下命令获取在 K8s 集群上运行的 Pod 列表。

```bash
$ kubectl get pods -A -o wide
```

输出结果符合预期，所有 Pod 的状态都是 **Running**。

```bash
NAMESPACE     NAME                                           READY   STATUS    RESTARTS        AGE     IP                NODE    NOMINATED NODE   READINESS GATES
kube-system   calico-kube-controllers-848b87ffbc-dgctg       1/1     Running   6 (130m ago)    10h     10.233.73.3       emon    <none>           <none>
kube-system   calico-node-d5t6l                              1/1     Running   0               10h     192.168.200.118   emon3   <none>           <none>
kube-system   calico-node-mxsg8                              1/1     Running   0               10h     192.168.200.117   emon2   <none>           <none>
kube-system   calico-node-w6tn8                              1/1     Running   0               10h     192.168.200.116   emon    <none>           <none>
kube-system   coredns-7849b497cd-wtk4b                       1/1     Running   0               83m     10.233.73.4       emon    <none>           <none>
kube-system   coredns-7849b497cd-zv6cw                       1/1     Running   0               83m     10.233.68.2       emon3   <none>           <none>
kube-system   kube-apiserver-emon                            1/1     Running   6 (130m ago)    10h     192.168.200.116   emon    <none>           <none>
kube-system   kube-apiserver-emon2                           1/1     Running   7 (127m ago)    10h     192.168.200.117   emon2   <none>           <none>
kube-system   kube-apiserver-emon3                           1/1     Running   7 (130m ago)    10h     192.168.200.118   emon3   <none>           <none>
kube-system   kube-controller-manager-emon                   1/1     Running   2 (4h1m ago)    10h     192.168.200.116   emon    <none>           <none>
kube-system   kube-controller-manager-emon2                  1/1     Running   4 (128m ago)    10h     192.168.200.117   emon2   <none>           <none>
kube-system   kube-controller-manager-emon3                  1/1     Running   3 (3h44m ago)   10h     192.168.200.118   emon3   <none>           <none>
kube-system   kube-proxy-fz9ln                               1/1     Running   0               10h     192.168.200.118   emon3   <none>           <none>
kube-system   kube-proxy-p4sx7                               1/1     Running   0               10h     192.168.200.117   emon2   <none>           <none>
kube-system   kube-proxy-p6b6c                               1/1     Running   0               10h     192.168.200.116   emon    <none>           <none>
kube-system   kube-scheduler-emon                            1/1     Running   3 (4h1m ago)    10h     192.168.200.116   emon    <none>           <none>
kube-system   kube-scheduler-emon2                           1/1     Running   3 (4h2m ago)    10h     192.168.200.117   emon2   <none>           <none>
kube-system   kube-scheduler-emon3                           1/1     Running   2 (3h44m ago)   10h     192.168.200.118   emon3   <none>           <none>
kube-system   nodelocaldns-8th4p                             1/1     Running   0               10h     192.168.200.116   emon    <none>           <none>
kube-system   nodelocaldns-httvk                             1/1     Running   0               10h     192.168.200.118   emon3   <none>           <none>
kube-system   nodelocaldns-tf6r4                             1/1     Running   0               10h     192.168.200.117   emon2   <none>           <none>
kube-system   openebs-localpv-provisioner-677c4fdd9b-4rbc2   1/1     Running   0               83m     10.233.82.3       emon2   <none>           <none>
```

### 2.3 查看 Image 列表

输入以下命令获取在 K8s 集群节点上已经下载的 Image 列表。

```bash
$ crictl images ls
```

输入以下命令获取在 K8s 集群节点上已经下载的 Image 列表。

```bash
IMAGE                                                                   TAG                 IMAGE ID            SIZE
registry.cn-beijing.aliyuncs.com/kubesphereio/cni                       v3.27.4             eaa2969f27e4f       81.3MB
registry.cn-beijing.aliyuncs.com/kubesphereio/coredns                   1.9.3               b19406328e70d       13.4MB
registry.cn-beijing.aliyuncs.com/kubesphereio/haproxy                   2.9.6-alpine        f6930329d1bbb       12.2MB
registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache        1.22.20             c98d4299ba7a2       27.9MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver            v1.30.6             6c71f76b69610       29.9MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager   v1.30.6             b572f51d3f4cc       28.3MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers          v3.27.4             624858d5c19fe       29.9MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy                v1.30.6             95ea5eecb1c87       25.7MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler            v1.30.6             41769a7fc0b67       17.6MB
registry.cn-beijing.aliyuncs.com/kubesphereio/node                      v3.27.4             c3c4dda1645a0       115MB
registry.cn-beijing.aliyuncs.com/kubesphereio/pause                     3.9                 829e9de338bd5       268kB
registry.cn-beijing.aliyuncs.com/kubesphereio/pod2daemon-flexvol        v3.27.4             1088adbc5e875       5.87MB
registry.cn-beijing.aliyuncs.com/kubesphereio/provisioner-localpv       3.3.0               2f625755a998b       27.3MB
```

至此，我们已经完成了在三台服务器部署 Control 和 Worker 节点复用的高可用 Kubernetes 集群。

## 3 安装 NFS 存储

[部署NFS](http://localhost:8751/devops/new/Kubernetes/01-%E7%AC%AC1%E7%AB%A0%20Kubeadmin%E5%AE%89%E8%A3%85K8S%20V1.23.html#_7-1-%E9%83%A8%E7%BD%B2nfs)

[安装Kubernetes NFS Subdir External Provisioner](http://localhost:8751/devops/new/Kubernetes/01-%E7%AC%AC1%E7%AB%A0%20Kubeadmin%E5%AE%89%E8%A3%85K8S%20V1.23.html#_7-2-%E5%AE%89%E8%A3%85kubernetes-nfs-subdir-external-provisioner)

## 4 部署 KubeSphere

接下来我们部署最新的 KubeSphere 4.1.3，实现 K8s 集群的可视化管理。

### 4.1 安装核心组件 KubeSphere Core

执行以下命令通过 `helm` 安装 KubeSphere 的核心组件 KubeSphere Core。

KubeSphere Core (ks-core) 是 KubeSphere 的核心组件，为扩展组件提供基础的运行环境。KubeSphere Core 安装完成后，即可访问 KubeSphere Web 控制台。

> **说明：** KubeKey 部署 Kubernetes 集群时会自动安装 Helm，无需手动安装。

```bash
# 如果无法访问 charts.kubesphere.io, 可将 charts.kubesphere.io 替换为 charts.kubesphere.com.cn
$ helm upgrade --install -n kubesphere-system --create-namespace ks-core https://charts.kubesphere.com.cn/main/ks-core-1.1.4.tgz --debug --wait \
--set multicluster.hostClusterName=kspxlab-main
```

> 说明：
>
> 如果你访问Docker Hub受限，请在命令后添加如下配置，修改默认的镜像拉取地址。
>
> ```bash
> --set global.imageRegistry=swr.cn-southwest-2.myhuaweicloud.com/ks
> ```
>
> ```bash
> --set extension.imageRegistry=swr.cn-southwest-2.myhuaweicloud.com/ks
> ```
>
> - multicluster.hostClusterName： 修改主集群的名字，默认为 host

部署过程需要大约 1-2分钟，具体看网速和机器配置，如果镜像提前下载到本地，基本上能实现 KubeSphere Core 的**秒级**部署。

安装命令执行完成后，如果显示如下信息，则表明 **ks-core** 安装成功：

```bash
NOTES:
Thank you for choosing KubeSphere Helm Chart.

Please be patient and wait for several seconds for the KubeSphere deployment to complete.

1. Wait for Deployment Completion

    Confirm that all KubeSphere components are running by executing the following command:

    kubectl get pods -n kubesphere-system
2. Access the KubeSphere Console

    Once the deployment is complete, you can access the KubeSphere console using the following URL:  

    http://192.168.200.116:30880

3. Login to KubeSphere Console

    Use the following credentials to log in:

    Account: admin
    Password: P@88w0rd

NOTE: It is highly recommended to change the default password immediately after the first login.
For additional information and details, please visit https://kubesphere.io.
```

从成功信息中的 **Console**、**Account** 和 **Password** 参数分别获取 KubeSphere Web 控制台的 IP 地址、管理员用户名和管理员密码，并使用网页浏览器登录 KubeSphere Web 控制台

### 4.2 命令行验证 KubeSphere Core 状态

1. 查看 Pod 列表

```bash
$ kubectl get pods -n kubesphere-system
```

**正确执行后，输出结果如下 :**

```
NAME                                     READY   STATUS    RESTARTS   AGE
extensions-museum-7c9b99d474-5rgkh       1/1     Running   0          2m47s
ks-apiserver-6464f89bd-5qgz9             1/1     Running   0          2m47s
ks-console-64c56484d6-dwvrg              1/1     Running   0          2m11s
ks-controller-manager-7667854855-cv5hd   1/1     Running   0          2m47s
```

当Pod状态都为Running时，使用默认的账户和密码（admin/P@88w0rd）通过`<NodeIP>:30880`访问KubeSphere Web控制台。

> 取决于您的网络环境，您可能需要配置流量转发规则并在防火墙中放行 30880 端口。

2. 首次登录后修改密码

http://192.168.200.116:30880

| 用户名 | 原密码   | 新密码   |
| ------ | -------- | -------- |
| admin  | P@88w0rd | P@88word |

## 5 KubeSphere Core 功能概览

### 5.1 工作台

我们打开浏览器访问 **Control-1** 节点的 IP 地址和端口 **30880**，可以打开熟悉的 KubeSphere 管理控制台的登录页面。

![image-20250713224606182](images/image-20250713224606182.png)

输入默认用户 **admin** 和默认密码 **P@88w0rd**，然后点击「登录」。

登录后，系统会要求您更改 KubeSphere 默认用户 admin 的默认密码，输入新的密码并点击「提交」。

![image-20250713225325640](images/image-20250713225325640.png)

提交完成后，系统会跳转到**新的风格**的 KubeSphere 用户工作台页面。

![image-20250713225419258](images/image-20250713225419258.png)

### 5.2 集群管理

在「工作台」页面，点击「集群管理」，进入集群管理页面，页面风格更方便多集群管理。

![image-20250713233811153](images/image-20250713233811153.png)

> 注意： 集群名称显示符合自定义的 **kspxlab-main**, 默认名称为 host。

点击「opsxlab-main 」主集群，进入集群管理页面。新版本的集群管理菜单更加简洁，默认只有基本的 K8s 管理功能。

- 集群概览

![image-20250713234108566](images/image-20250713234108566.png)

- 集群节点

![image-20250713234233108](images/image-20250713234233108.png)

- 存储类

![image-20250713234327943](images/image-20250713234327943.png)

> **注意：** 可以正常显示 K8s 集群已经配置的nfs-client 和 local两个存储类。

至此，我们完成了 KubeSphere Core 的安装部署。

## 6 通过域名访问 KubeSphere 控制台

### 6.1 前提条件

- 已安装 Kubernetes 集群。
- [已安装 Helm](https://helm.sh/zh/docs/intro/install/)（用于安装 cert-manager 和 ingress-nginx）。
- 已安装 KubeSphere 或准备安装 KubeSphere。

### 6.2 步骤 1：安装 NGINX Ingress Controller

如果您尚未安装 [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)，请按照以下步骤安装。

```bash
# 添加 ingress-nginx 仓库
$ helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

# 更新仓库
$ helm repo update

# 安装 ingress-nginx
$ helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --version 4.2.5

# 验证安装结果
$ kubectl -n ingress-nginx get svc ingress-nginx-controller

# 检查 IngressClass
$ kubectl get ingressclass
```

### 6.3 步骤 2：安装 cert-manager

[cert-manager](https://cert-manager.io/docs/) 是一个 Kubernetes 原生的证书管理控制器，可以帮助您自动化 TLS 证书的管理和签发。

```bash
# 添加 cert-manager 仓库
$ helm repo add jetstack https://charts.jetstack.io

# 更新仓库
$ helm repo update

# 安装 cert-manager
$ helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.12.0 \
  --set installCRDs=true

# 验证安装结果
$ kubectl get pods -n cert-manager
```

### 6.4 步骤 3：为 KubeSphere 配置 TLS

##### 方法 1：安装 KubeSphere 时，配置 TLS

如果您尚未安装 KubeSphere，可以在安装时配置 TLS。以下命令采用 cert-manager 生成自签证书。

```bash
$ helm upgrade --install -n kubesphere-system --create-namespace ks-core https://charts.kubesphere.io/main/ks-core-1.1.4.tgz \
--set portal.hostname=k8s.flyin.com \   # 将 kubesphere.my.org 替换为您的自定义域名
--set portal.https.port=30880 \
--set ingress.enabled=true \
--set ingress.tls.source=generation \
--set ingress.ingressClassName=nginx
```

> 说明：以上参数的更多信息，请参阅 [KubeSphere Core 高级配置](https://kubesphere.io/zh/docs/v4.1/03-installation-and-upgrade/02-install-kubesphere/05-appendix/)。

##### 方法 2：安装 KubeSphere 后，手动配置自签名TLS

如果已安装 KubeSphere，需手动配置 TLS。

- 创建 Issuer

```bash
$ cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: self-signed
  namespace: kubesphere-system
spec:
  selfSigned: {}
EOF
```

- 创建 Certificate

```bash
$ cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: kubesphere-tls-certs
  namespace: kubesphere-system
spec:
  duration: 2160h # 90天
  # 设置在证书到期前15天开始更新
  renewBefore: 360h # 15天 (15 * 24小时)
  dnsNames:
  - kubesphere.my.org # 替换为您的自定义域名
  issuerRef:
    group: cert-manager.io
    kind: Issuer
    name: self-signed
  secretName: kubesphere-tls-certs
  usages:
  - digital signature
  - key encipherment
EOF
```

- 创建 Ingress

```bash
$ cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    cert-manager.io/issuer: self-signed
    cert-manager.io/issuer-kind: Issuer
  name: ks-console
  namespace: kubesphere-system
spec:
  ingressClassName: nginx
  rules:
  - host: k8s.flyin.com # 替换为您的自定义域名
    http:
      paths:
      - backend:
          service:
            name: ks-console
            port:
              number: 80
        pathType: ImplementationSpecific
  tls:
  - hosts:
    - k8s.flyin.com # 替换为您的自定义域名
    secretName: kubesphere-tls-certs
EOF
```

#### 验证配置结果

验证证书签发状态：

```bash
$ kubectl describe certificate kubesphere-tls-certs -n kubesphere-system
```

查看证书签发过程：

```bash
$ kubectl get challenges,orders,certificaterequests -n kubesphere-system
```

### 6.5 步骤 4：验证 TLS 配置

- 检查证书是否成功签发。

```bash
$ kubectl get certificate -n kubesphere-system
```

输出示例如下：

```bash
NAME                   READY   SECRET                 AGE
kubesphere-tls-certs   True    kubesphere-tls-certs   7m51s
```

- 检查 Ingress 配置。

```bash
$ kubectl get ingress -n kubesphere-system
```

输出示例如下：

```bash
NAME         CLASS   HOSTS           ADDRESS   PORTS     AGE
ks-console   nginx   k8s.flyin.com             80, 443   6m49s
```

- 使用 curl 测试 HTTPS 访问。

```bash
$ INGRESS_IP=$(kubectl -n ingress-nginx get svc ingress-nginx-controller -o jsonpath={.spec.clusterIP})
$ curl --resolve k8s.flyin.com:443:$INGRESS_IP https://k8s.flyin.com -k
```

输出示例如下：

```bash
Redirecting to <a href="/login">/login</a>.
```

### 6.6 步骤 5：访问 KubeSphere Web 控制台

在使用自定义 DNS 的情况下，如果要在其他机器使用域名访问 KubeSphere Web 控制台，还需要执行以下步骤。

- 设置 Service 使用 NodePort 模式。

```bash
$ kubectl -n ingress-nginx patch svc ingress-nginx-controller -p '{"spec": {"type": "NodePort"}}'
```

- 查询 Service 信息。

```bash
$ kubectl -n ingress-nginx get svc ingress-nginx-controller
```

- 获取 https 访问地址。

```bash
$ echo https://k8s.flyin.com:$(kubectl -n ingress-nginx get svc ingress-nginx-controller -o jsonpath='{.spec.ports[?(@.port==443)].nodePort}')
```

输出示例如下（您的访问地址可能不同）：

```bash
https://k8s.flyin.com:31869
```

- 获取节点 IP。

```bash
$ kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}'
```

- 在访问 KubeSphere 控制台的机器上添加节点 IP 的 DNS，以配置域名解析规则。

```bash
vim /etc/hosts
```

添加节点 IP 和域名。

```bash
<Node IP> k8s.flyin.com
```

- 如果一切配置正确，您将能够通过第 3 步获取的 https 访问地址，如 [https://k8s.flyin.com:31655](https://kubesphere.my.org:31655/) 访问 KubeSphere Web 控制台。



## 7 KubeSphere核心概念关系梳理

### 7.1 资源种类

- 平台
- 企业空间
- 集群
- 项目

### 7.2 直观层级关系

```bash
KubeSphere 平台 (Platform)
│
├── 集群 (Cluster) —— 物理或虚拟的 Kubernetes 集群
│   │
│   ├── 企业空间 (Workspace) —— 跨集群的逻辑租户单元
│   │   │
│   │   ├── 项目 (Namespace/Project) —— Kubernetes 命名空间的增强版
│   │   ├── 用户/角色 (RBAC) —— 租户内的权限控制
│   │   ├── 资源配额 (Quota) —— CPU/内存等限制
│   │   └── 其他资源（如 DevOps 工程、应用模板等）
│   │
│   └── 其他企业空间...
│
└── 其他集群...
```

### 7.3 示例场景

```bash
平台：公司云平台
├── 集群：生产集群（Cluster-Prod）
│   └── 企业空间：电商事业部
│       ├── 项目：前端服务（属于 Cluster-Prod）
│       └── 项目：订单服务（属于 Cluster-Prod）
└── 集群：测试集群（Cluster-Test）
    └── 同一企业空间：电商事业部
        └── 项目：电商测试环境（属于 Cluster-Test）
```

:::info

**电商事业部**（企业空间）横跨生产集群和测试集群，但项目必须绑定到具体集群。

**总结**

- **企业空间**是面向租户（如团队/部门）的抽象层，用于跨集群管理资源。
- **项目**是面向应用的最小单元，必须属于某个企业空间和集群。
- **集群**是资源的物理载体，可以被多个企业空间共享。

这种设计既支持多租户隔离，又允许灵活的资源分配。

:::

### 7.4 各种角色

#### 7.4.1 平台角色

KubeSphere 平台提供以下预置平台角色，您也可以创建角色以自定义角色权限。

| 参数                      | 描述                                                         |
| :------------------------ | :----------------------------------------------------------- |
| platform-admin            | 平台管理员，在 KubeSphere 平台具有所有权限，包括平台角色管理、用户管理、平台设置管理、安装和卸载扩展组件等。 |
| platform-regular          | 平台普通用户，在平台级别只有应用查看权限。该角色一般授予不需要其他平台权限的企业空间成员。 |
| platform-self-provisioner | 创建企业空间并成为所创建的企业空间的管理员。                 |

#### 7.4.2 企业空间角色

KubeSphere 平台提供以下预置企业空间角色：

| 角色                       | 描述                                                         |
| :------------------------- | :----------------------------------------------------------- |
| workspace-admin            | 企业空间管理员，在企业空间内具有全部权限。                   |
| workspace-self-provisioner | 企业空间自治用户，在企业空间内可以创建项目、查看企业空间设置，同时对自身创建的项目具有管理权限。 |
| workspace-viewer           | 企业空间观察员，可以查看企业空间内的所有资源。               |
| workspace-regular          | 企业空间普通用户，在企业空间内只具有企业空间设置查看权限。该角色一般授予不需要其他企业空间权限的项目成员。 |

#### 7.4.3 集群角色

KubeSphere 平台提供以下预置集群角色：

| 角色           | 描述                                                     |
| :------------- | :------------------------------------------------------- |
| cluster-admin  | 集群管理员，在集群内具有除创建和删除集群以外的所有权限。 |
| cluster-viewer | 集群观察员，在集群内具有所有资源的查看权限。             |

#### 7.4.4 项目角色

KubeSphere 提供以下预置项目角色：

| 角色     | 描述                                                         |
| :------- | :----------------------------------------------------------- |
| admin    | 项目管理员，在项目中具有所有权限。                           |
| operator | 项目操作员，在项目中具有除项目设置管理、角色管理、成员管理以外的权限。 |
| viewer   | 项目观察员，在项目中具有资源查看权限。                       |

## 9 创建企业空间、项目、用户和角色

<span style="color:red;font-weight:bold;">目标：快速了解如何创建用户，并使用企业空间、项目和角色控制用户的访问权限。</span>

作为多租户系统，KubeSphere 支持在平台、集群、企业空间和项目级别基于角色对用户的权限进行控制，实现逻辑层面的资源隔离。

### 9.1 前提条件

您需要准备一个 Kubernetes 集群，并已安装 KubeSphere。

### 9.2 创建用户

1. 使用默认用户 **admin** 和密码 **P@88w0rd** 登录 KubeSphere Web 控制台。

	> 为了您的账户安全，首次登录时系统会提示您修改密码。密码修改后，后续请使用新密码登录。

2. 点击**用户和角色管理**。

3. 在左侧导航栏，选择**用户**。

4. 在用户列表页面，点击**创建**。

5. 在**创建用户**对话框，输入以下必填参数：

- **用户名**：用户的名称（例如 **demo-user**）。
- **邮箱**：用户的邮箱地址。
- **密码**：用户的密码（**P@88w0rd**）。

6. 点击**确定**。用户创建后将显示在用户列表中。

### 9.3 创建企业空间

1. 登录 KubeSphere Web 控制台。

2. 点击**企业空间管理**，点击**创建**。

3. 在**创建企业空间**的**基本信息**页面，

  1. 输入企业空间的名称（例如 **demo-workspace**）。
  2. 选择企业空间管理员（例如 **demo-user**）
  3. 点击右下角下一步，选择集群。猩红<span style="color:red;font-weight:bold;">若这一步不选择集群，只能在集群设置=>集群可见性中授权企业空间了。</span>

  > 对于多集群环境，设置企业空间的基本信息后，点击**下一步**。在**集群设置**页面，选择企业空间需要使用的集群。

4. 点击**确定**。企业空间创建后将显示在企业空间列表中。

### 9.4 创建企业空间角色

1. 在企业空间列表页面，点击企业空间的名称 **demo-workspace** 进入该企业空间。

2. 在左侧导航栏，选择**企业空间设置** > **企业空间角色**。

   企业空间角色列表页面默认列出以下四个内置角色。

   | 角色                           | 描述                                                         |
   | :----------------------------- | :----------------------------------------------------------- |
   | **workspace-viewer**           | 企业空间观察员，可以查看企业空间中的所有资源。               |
   | **workspace-self-provisioner** | 企业空间普通成员，可以查看企业空间设置、管理应用模板、创建项目。 |
   | **workspace-regular**          | 企业空间普通成员，可以查看企业空间设置。                     |
   | **workspace-admin**            | 企业空间管理员，可以管理企业空间中的所有资源。               |

   > 企业空间内置角色的名称以 <企业空间名称>-<角色名称> 格式显示。例如，在名称为 **demo-workspace** 的企业空间中，角色 **admin** 的实际角色名称为 **demo-workspace-admin**。

3. 在企业空间角色列表页面，点击**创建**。

4. 在**创建企业空间角色**对话框，输入**名称**（**demo-workspace-role**），然后点击**编辑权限**继续。

5. 在**编辑权限**对话框，权限归类在不同的**功能模块**下。

   在本示例中，点击**项目管理**，并为该角色选择<span style="color:blue;font-weight:bold;">**项目创建**、**项目管理**和**项目查看**</span>。

   > **依赖于**表示当前授权项依赖所列出的授权项，勾选该权限后系统会自动选上所有依赖权限。

6. 点击**确定**。新创建的角色将显示在企业空间角色列表中。

### 9.5 邀请用户到企业空间

1. 在左侧导航栏，选择**企业空间设置** > **企业空间成员**。
2. 在企业空间成员列表页面，点击**邀请**。
3. 在**邀请成员**对话框，点击用户（**demo-user**）右侧的<img src="./images/add-dark.svg" alt="add" style="width:25px;height:25px;display:inline" />并为用户分配在当前企业空间中的角色（**demo-workspace-role**）。
4. 点击**确定**。用户被邀请后将显示在企业空间成员列表中。

### 9.6 创建项目

1. 在左侧导航栏，选择**项目**。

2. 在**项目**页签，点击**创建**。

3. 在**创建项目**对话框，输入项目的**名称**（例如 **demo-project**）。

   > 对于多集群环境，您需要选择要创建项目的集群。

4. 点击**确定**。项目创建后将显示在项目列表中。

### 9.7 创建项目角色

1. 在**项目**页签，点击项目的名称 **demo-project** 进入该项目。

2. 在左侧导航栏，选择**项目设置** > **项目角色**。

   项目角色页面默认列出以下三个内置角色。

   | 角色         | 描述                                               |
   | :----------- | :------------------------------------------------- |
   | **viewer**   | 项目观察员，可以查看项目中的所有资源。             |
   | **operator** | 项目管理员，可以管理项目中除用户和角色之外的资源。 |
   | **admin**    | 项目管理员，可以管理项目中的所有资源。             |

3. 在项目角色列表页面，点击**创建**。

4. 在**创建角色**对话框，输入**名称**（比如：**demo-project-role**），然后点击**编辑权限**继续。

5. 在**编辑权限**对话框，权限归类在不同的**功能模块**下。

   在本示例中，点击**访问控制**，并为该角色选择<span style="color:blue;font-weight:bold;">**成员查看**和**角色查看**</span>。

6. 点击**确定**。新创建的角色将显示在项目角色列表中。

### 9.8 邀请用户到项目

1. 在左侧导航栏，选择**项目设置** > **项目成员**。
2. 在项目成员列表页面，点击**邀请**。
3. 在**邀请成员**对话框，点击用户（**demo-user**）右侧的<img src="./images/add-dark.svg" alt="add" style="width:25px;height:25px;display:inline" />并为用户分配在当前项目中的（**demo-project-role**）。
4. 点击**确定**。用户被邀请后将显示在项目成员列表中。

### 9.9 登录

首次登录后修改密码

http://192.168.200.116:30880

| 用户名    | 原密码   | 新密码   |
| --------- | -------- | -------- |
| demo-user | P@88w0rd | P@88word |

## 99、FAQ

### FAQ1：如何重置用户密码

https://www.kubesphere.io/zh/docs/v3.4/faq/access-control/forgot-password/

### FAQ2：玩转kubesphere之cni网络插件异常问题

问题描述：Failed to create pod sandbox: rpc error: code = Unknown desc = [ ......getting ClusterInformation: connection is unauthorized: Unauthorized

问题解决：https://blog.csdn.net/weixin_40807433/article/details/135240300

简述：删除异常节点的容器组 calico-node，让它拉起重新同步数据即可修复。

### FAQ3：KubeSphere 镜像构建器（S2I）服务证书过期(x509)问题

问题描述：Internal error occurred: failed calling webhook "s2ibuilder.kb.io": failed to call webhook......x509: certificate has expired or is not yet valid

问题解决：https://ask.kubesphere.io/forum/d/23239-kubesphere-jing-xiang-gou-jian-qi-s2ifu-wu-zheng-shu-guo-qi-x509wen-ti

简述：这个是由于之前 DevOps S2I 内置的证书过期时间是 2024.02.14 ，现在只需要更新证书就可以了；