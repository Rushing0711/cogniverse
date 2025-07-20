# 第2章 Kubeadmin安装K8S V1.23

单点版本：https://blog.csdn.net/Josh_scott/article/details/121961369?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-0.pc_relevant_default&spm=1001.2101.3001.4242.1&utm_relevant_index=3

高可用版本：https://blog.csdn.net/qq_16538827/article/details/120175489

Kubeadm是一个K8s部署工具，提供kubeadm init和kubeadm join，用于快速部署Kubernetes集群。

## 1 基础环境准备

[基础环境准备](http://localhost:5173/devops/new/Kubernetes/01-%E7%AC%AC1%E7%AB%A0%20%E5%9F%BA%E7%A1%80%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87.html)

## 2 安装基础工具（所有节点）

### 2.1 安装Docker

参考：[Docker的安装与配置.md](http://localhost:8751/devops/new/Docker/01-%E7%AC%AC1%E7%AB%A0%20Docker%E7%9A%84%E5%AE%89%E8%A3%85%E4%B8%8E%E9%85%8D%E7%BD%AE.html)

### 2.2 安装kubeadm/kubelet/kubectl

K8S依赖的Docker最佳版本： 20.10

https://github.com/kubernetes/kubernetes/blob/release-1.23/build/dependencies.yaml

1. 设置k8s源

参考：https://mirrors.aliyun.com/kubernetes/yum/repos/

:::code-group

```bash [CentOS7.5]
$ cat > /etc/yum.repos.d/kubernetes.repo << EOF
[kubernetes] 
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64 
enabled=1 
gpgcheck=0 
repo_gpgcheck=0 
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg 
EOF

# 可以更新/缓存，也可以忽略
$ yum clean all && yum makecache
```

```bash [Rocky9.5]
# 此操作会覆盖 /etc/yum.repos.d/kubernetes.repo 中现存的所有配置
$ cat > /etc/yum.repos.d/kubernetes.repo << EOF
[kubernetes] 
name=Kubernetes ARM
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-aarch64 
enabled=1 
gpgcheck=0 
repo_gpgcheck=0 
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg 
EOF

# 可以更新/缓存，也可以忽略
$ dnf clean all && dnf makecache
```

:::

2. 可以查看所有仓库中所有k8s版本，并选择安装特定的版本

```bash
$ dnf list kubelet --showduplicates |sort -r
```

3. 安装kubeadm/kubelet/kubectl

```bash
# 某些 Linux 发行版（如 RHEL/CentOS/Rocky）的 YUM/DNF 配置中默认排除了 Kubernetes 相关包，这里临时禁用针对 Kubernetes 的排除规则，允许安装 kube* 开头的包
$ dnf install -y kubelet-1.23.17 kubeadm-1.23.17 kubectl-1.23.17 --disableexcludes=kubernetes
# kubeadm init 和 kubeadm join 都会触发启动 kubelet，但会给警告；但若直接启动 kubelet 则每隔几秒就会重启，因为它陷入了一个等待 kubeadm 指令的死循环。（master和worker节点），这里选择仅加入开机启动，并不直接启动。
$ systemctl enable kubelet
```

## 3 kubeadm创建集群（仅master节点）

### 3.0 预下载镜像（开启Docker代理可忽略）

<span style="color:red;font-weight:bold;">`10.96.0.0/16`：Kubernetes Service 的默认网段</span>

<span style="color:red;font-weight:bold;">`10.244.0.0/16`：Flannel CNI 的默认 Pod 网段</span>

<span style="color:red;font-weight:bold;">`10.233.xx.0/18`：Calico 等 CNI 的中型 Pod 网段</span>

- 查看依赖镜像

```bash
$ kubeadm config images list
```

- 配置并执行脚本

```bash
$ vim master_images.sh
```

```bash
#!/bin/bash

images=(
	kube-apiserver:v1.23.17
	kube-controller-manager:v1.23.17
	kube-scheduler:v1.23.17
	kube-proxy:v1.23.17
	pause:3.6
	etcd:3.5.6-0
	coredns/coredns:v1.8.6
)

for imageName in ${images[@]} ; do
    docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName
#   docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName  k8s.gcr.io/$imageName
done
# 若不希望制定kubeadm init的镜像--image-repository，这里可以放开docker tag到k8s.gcr.io
```

```bash
$ chmod +x master_images.sh
```

- 执行

```bash
$ sh master_images.sh
```

### 3.1 kubeadm init

- 初始化

```bash
# 在Master上执行，由于默认拉取镜像地址 k8s.gcr.io 国内无法访问，这里指定阿里云镜像仓库地址。
# 执行该步骤之前，也可以执行 kubeadm config images pull 预下载镜像
# 查看镜像 kubeadm config images list 查看默认配置 kubeadm config print init-defaults
# Classless Inter-Domain Routing (CIDR)，中文译为无类别域间路由，是互联网中用于更有效分配和路由 IP 地址（主要是 IPv4）的一种方法。
# --image-repository registry.cn-hangzhou.aliyuncs.com/google_containers 指定镜像地址，默认是 k8s.gcr.io
# 镜像地址也可以是 registry.aliyuncs.com/google_containers 请注意：没有开启Docker代理服务器时必须指定
# --control-plane-endpoint 是部署 Kubernetes HA 控制平面的关键步骤，单master节点时可以不配置，多master节点时必须指定，而且要有负载均衡器来解析该配置项到具体master节点。
$ kubeadm init \
--apiserver-advertise-address=192.168.200.116 \
--control-plane-endpoint=emon \
--kubernetes-version v1.23.17 \
--service-cidr=10.96.0.0/16 \
--pod-network-cidr=10.233.0.0/17

# 使用 kubectl 工具（Master&&Node节点）
$ mkdir -p $HOME/.kube 
$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config 
$ sudo chown $(id -u):$(id -g) $HOME/.kube/config

# 【二选一】如果是root用户，可以使用如下配置替换上面：（与上面二选一）
export KUBECONFIG=/etc/kubernetes/admin.conf

# 【临时】无需执行，仅做记录参考
# ==============================初始化部分日志==============================
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of control-plane nodes by copying certificate authorities
and service account keys on each node and then running the following as root:

  kubeadm join emon:6443 --token ldsakh.zkzpetkutui6ypmp \
        --discovery-token-ca-cert-hash sha256:7268baf811b3f1f2ca1e657fe90db99b8d3ed3f9efb8be03811b809d8efa5c5e \
        --control-plane 

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join emon:6443 --token ldsakh.zkzpetkutui6ypmp \
        --discovery-token-ca-cert-hash sha256:7268baf811b3f1f2ca1e657fe90db99b8d3ed3f9efb8be03811b809d8efa5c5e
```

> 带有`–control-plane`的命令，是添加一个主节点；
>
> 不带有`–control-plane`的命令，是添加一个工作点；

- 等待一小会后，查看当前pods

```bash
$ kubectl get pods -n kube-system
NAME                           READY   STATUS    RESTARTS   AGE
coredns-bd6b6df9f-llqtt        0/1     Pending   0          10m
coredns-bd6b6df9f-lsj6h        0/1     Pending   0          10m
etcd-emon                      1/1     Running   0          10m
kube-apiserver-emon            1/1     Running   0          10m
kube-controller-manager-emon   1/1     Running   0          10m
kube-proxy-r2jpz               1/1     Running   0          10m
kube-scheduler-emon            1/1     Running   0          10m

$ kubectl get pods -n kube-system -o wide
NAME                           READY   STATUS    RESTARTS   AGE   IP                NODE     NOMINATED NODE   READINESS GATES
coredns-bd6b6df9f-llqtt        0/1     Pending   0          11m   <none>            <none>   <none>           <none>
coredns-bd6b6df9f-lsj6h        0/1     Pending   0          11m   <none>            <none>   <none>           <none>
etcd-emon                      1/1     Running   0          11m   192.168.200.116   emon     <none>           <none>
kube-apiserver-emon            1/1     Running   0          11m   192.168.200.116   emon     <none>           <none>
kube-controller-manager-emon   1/1     Running   0          11m   192.168.200.116   emon     <none>           <none>
kube-proxy-r2jpz               1/1     Running   0          11m   192.168.200.116   emon     <none>           <none>
kube-scheduler-emon            1/1     Running   0          11m   192.168.200.116   emon     <none>           <none>

$ kubectl get all
NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   12m

$ kubectl get nodes
NAME   STATUS     ROLES                  AGE   VERSION
emon   NotReady   control-plane,master   13m   v1.23.17
```

分析：coredns是Pending状态，表示缺少网络插件，下面开始安装网络插件！

网络插件列表： https://kubernetes.io/zh-cn/docs/concepts/cluster-administration/addons/

### 3.2 网络插件多选1-[Calico](https://www.tigera.io/project-calico/)（仅master节点）

GitHub： https://github.com/projectcalico/calico

官网：https://docs.tigera.io/archive

系统需求： https://docs.tigera.io/calico/latest/getting-started/kubernetes/requirements

#### 3.2.1 切换目录

```bash
$ cd
$ mkdir -pv /root/k8s_soft/k8s_v1.23.17 && cd /root/k8s_soft/k8s_v1.23.17
```

这部分我们部署kubernetes的网络查件 CNI。

文档地址：https://docs.projectcalico.org/getting-started/kubernetes/self-managed-onprem/onpremises

#### 3.2.2 下载文件与配置调整

文档中有两个配置，50以下节点和50以上节点，它们的主要区别在于这个：typha。
当节点数比较多的情况下，Calico 的 Felix组件可通过 Typha 直接和 Etcd 进行数据交互，不通过 kube-apiserver，降低kube-apiserver的压力。大家根据自己的实际情况选择下载。
下载后的文件是一个all-in-one的yaml文件，我们只需要在此基础上做少许修改即可。

```bash
# 下载calico.yaml文件
# $ curl https://projectcalico.docs.tigera.io/manifests/calico.yaml -O 会加载最新版本，对K8S版本V1.23.17不再适合。
# 兼容k8s v1.23.17版本，支持多架构的网络插件版本是 v3.24.5，可以如下执行；但若需要修改一些配置，可以先下载
# kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.24.5/manifests/calico.yaml
$ curl https://docs.tigera.io/archive/v3.24/manifests/calico.yaml -O
```

修改IP自动发现：

> 当kubelet的启动参数中存在--node-ip的时候，以host-network模式启动的pod的status.hostIP字段就会自动填入kubelet中指定的ip地址。

```js
- name: IP
  value: "autodetect" // [!code --]
  valueFrom: // [!code ++]
    fieldRef: // [!code ++]
      fieldPath: status.hostIP // [!code ++]
```

修改CIDR：修改成你自己的pod-network-cidr网段的value，我这里是10.244.0.0/16

```js
# - name: CALICO_IPV4POOL_CIDR // [!code --]
#   value: "192.168.0.0/16" // [!code --]
- name: CALICO_IPV4POOL_CIDR // [!code ++]
  value: "10.233.0.0/17" // [!code ++]
```

#### 3.2.3 执行安装

```bash
# 生效之前查看
$ kubectl get nodes
NAME   STATUS     ROLES                  AGE     VERSION
emon   NotReady   control-plane,master   5m31s   v1.23.17
# 使之生效
$ kubectl apply -f calico.yaml
# 查看pod
$ kubectl get po -n kube-system
NAME                                       READY   STATUS    RESTARTS   AGE
calico-kube-controllers-577f77cb5c-g78c7   1/1     Running   0          13h
calico-node-hxvx8                          1/1     Running   0          13h
coredns-7f89b7bc75-8ks6f                   1/1     Running   0          14h
coredns-7f89b7bc75-kfdbm                   1/1     Running   0          14h
etcd-emon                                  1/1     Running   0          14h
kube-apiserver-emon                        1/1     Running   0          14h
kube-controller-manager-emon               1/1     Running   0          14h
kube-proxy-f2r8l                           1/1     Running   0          14h
kube-scheduler-emon                        1/1     Running   0          14h
# 查看node
$ kubectl get nodes
NAME    STATUS     ROLES                  AGE    VERSION
emon    Ready      control-plane,master   7m2s   v1.23.17
```

### 3.2 网络插件多选2-[Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually)（仅master节点）

#### 3.2.1 切换目录

```bash
$ cd
$ mkdir -pv /root/k8s_soft/k8s_v1.23.17 && cd /root/k8s_soft/k8s_v1.23.17
```

#### 3.2.2 下载文件

Flannel是配置为Kubernetes设计的第3层网络结构的一种简单易行的方法。

For Kubernetes v1.17+

```bash
$ wget https://github.com/flannel-io/flannel/releases/download/v0.25.4/kube-flannel.yml
```

#### 3.2.3 执行安装

```bash
# 查看nodes
$ kubectl get nodes
NAME   STATUS     ROLES                  AGE   VERSION
emon   NotReady   control-plane,master   16m   v1.23.17
# 安装
$ kubectl apply -f kube-flannel.yml
# 查看pods
$ kubectl get po -n kube-system -o wide
NAME                           READY   STATUS    RESTARTS   AGE     IP               NODE   NOMINATED NODE   READINESS GATES
coredns-bd6b6df9f-72cb6        1/1     Running   0          3m3s    10.244.0.3       emon   <none>           <none>
coredns-bd6b6df9f-nqfn5        1/1     Running   0          3m3s    10.244.0.2       emon   <none>           <none>
etcd-emon                      1/1     Running   0          3m17s   192.168.32.116   emon   <none>           <none>
kube-apiserver-emon            1/1     Running   0          3m18s   192.168.32.116   emon   <none>           <none>
kube-controller-manager-emon   1/1     Running   0          3m15s   192.168.32.116   emon   <none>           <none>
kube-proxy-cbb2x               1/1     Running   0          3m3s    192.168.32.116   emon   <none>           <none>
kube-scheduler-emon            1/1     Running   0          3m17s   192.168.32.116   emon   <none>           <none>
$ kubectl get nodes
NAME   STATUS   ROLES                  AGE     VERSION
emon   Ready    control-plane,master   4m29s   v1.23.17
```

### 3.3 加入节点到集群（仅worker节点）

- 加入集群

```bash
# kubeadm init的执行结果中有如下命令，在各个worker节点执行加入即可
$ kubeadm join emon:6443 --token ldsakh.zkzpetkutui6ypmp \
        --discovery-token-ca-cert-hash sha256:7268baf811b3f1f2ca1e657fe90db99b8d3ed3f9efb8be03811b809d8efa5c5e
```

- 查看节点

```bash
# 等节点加入成功，过一会查看得到
$ kubectl get nodes
NAME    STATUS   ROLES                  AGE   VERSION
emon    Ready    control-plane,master   19m   v1.23.17
emon2   Ready    <none>                 82s   v1.23.17
emon3   Ready    <none>                 45s   v1.23.17
# 此时，worker节点上的容器实例如下：
$ docker images
REPOSITORY                   TAG        IMAGE ID       CREATED        SIZE
hello-world                  latest     f1f77a0f96b7   4 months ago   5.2kB # docker测试产生的
registry.k8s.io/kube-proxy   v1.23.17   d3c3d806adc6   2 years ago    107MB
calico/cni                   v3.24.5    efd8ebfc4b4f   2 years ago    190MB
registry.k8s.io/pause        3.6        7d46a07936af   3 years ago    484kB
```

### 3.4 虚拟机挂起并恢复后k8s网络问题（所有节点）

问题描述：虚拟机挂起并恢复后，各个节点通信会出问题，设置“未托管”后解决。

<span style="color:red;font-weight:bold;">解决前查看网络如下效果：</span>

```bash
# 主节点网络
$ nmcli device status
DEVICE           TYPE      STATE         CONNECTION 
ens160           ethernet  已连接        ens160     
docker0          bridge    连接（外部）  docker0    
lo               loopback  连接（外部）  lo         
tunl0            iptunnel  已断开        --         
cali4969f0a9f96  ethernet  未托管        --         
cali67f6c4be37a  ethernet  未托管        --         
cali6cd2b22a701  ethernet  未托管        --   
# 子节点网络
$ nmcli device status
DEVICE   TYPE      STATE         CONNECTION 
ens160   ethernet  已连接        ens160     
docker0  bridge    连接（外部）  docker0    
lo       loopback  连接（外部）  lo         
tunl0    iptunnel  已断开        --  
```

<span style="color:#32CD32;font-weight:bold;">解决后查看网络如下效果：</span>

```bash
# 主节点网络
$ nmcli device status
DEVICE           TYPE      STATE         CONNECTION 
ens160           ethernet  已连接        ens160     
lo               loopback  连接（外部）  lo         
docker0          bridge    未托管        --         
cali4969f0a9f96  ethernet  未托管        --         
cali67f6c4be37a  ethernet  未托管        --         
cali6cd2b22a701  ethernet  未托管        --         
tunl0            iptunnel  未托管        -- 
# 子节点网络
$ nmcli device status
DEVICE   TYPE      STATE         CONNECTION 
ens160   ethernet  已连接        ens160     
lo       loopback  连接（外部）  lo         
docker0  bridge    未托管        --         
tunl0    iptunnel  未托管        --  
```

- 查看设备状态

```bash
$ nmcli device status
```

- 永久unmanaged

```bash
$ tee /etc/NetworkManager/conf.d/99-unmanaged-devices.conf << EOF
[keyfile]
unmanaged-devices=interface-name:docker*;interface-name:veth*;interface-name:br-*;interface-name:vmnet*;interface-name:vboxnet*;interface-name:cni0;interface-name:cali*;interface-name:flannel*;interface-name:tun*
EOF
```

- 重启NetworkManager

```bash
$ systemctl restart NetworkManager
```



# 补充 演练与理解

## 1 常规命令部署一个tomcat

```bash
# 部署一个tomcat
$ kubectl create deployment tomcat8 --image=tomcat:8.5-jre8-slim
# 暴露nginx访问，Pod的80映射容器的8080；service会代理Pod的80.
$ kubectl expose deployment tomcat8 --port=80 --target-port=8080 --type=NodePort
# 查询NodePort端口
$ kubectl get svc|grep tomcat8
tomcat8      NodePort    10.96.82.16   <none>        80:3736/TCP   86s
# 访问 http://192.168.32.116:3736
# 查看所有
$ kubectl get all

# 扩容：扩容了多份，所以无论访问哪个node的指定端口，都可以访问到tomcat6
$ kubectl scale --replicas=3 deployment tomcat8
# 删除
$ kubectl delete deployment.apps/tomcat8 service/tomcat8
```

- 查看部署一个tomcat对应的yaml信息

```bash
$ kubectl create deployment tomcat8 --image=tomcat:8.5-jre8-slim --dry-run=client -o yaml > tomcat8-deploy.yml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: tomcat8
  name: tomcat8
spec:
  replicas: 1
  selector:
    matchLabels:
      app: tomcat8
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: tomcat8
    spec:
      containers:
      - image: tomcat:8.5-jre8-slim
        name: tomcat
        resources: {}
status: {}
```

```bash
$ kubectl apply -f tomcat8.yml
```

- 查看暴露nginx访问对应的yaml信息

```bash
$ kubectl expose deployment tomcat8 --port=80 --target-port=8080 --type=NodePort --dry-run=client -o yaml > tomcat8-svc.yml
```

```yaml
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: null
  labels:
    app: tomcat8
  name: tomcat8
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 8080
  selector:
    app: tomcat8
  type: NodePort
status:
  loadBalancer: {}
```

- 查看暴露pod对应的yaml信息

```bash
$ kubectl get pods tomcat8-5796df556f-rzdf6 -o yaml > pod.yaml
```

## 2 通过yaml部署一个tomcat

- 准备一个部署

```bash
$ vim tomcat8.yml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: tomcat8
  name: tomcat8-deploy
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tomcat8-pod
  template:
    metadata:
      labels:
        app: tomcat8-pod
    spec:
      containers:
      - image: tomcat:8.5-jre8-slim
        name: tomcat
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: tomcat8
  name: tomcat8-service
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 8080
  selector:
    app: tomcat8-pod
  type: NodePort

---
#ingress
#old version: extensions/v1beta1
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-http
spec:
  ingressClassName: nginx
  rules:
  - host: tomcat.fsmall.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: tomcat8-service
            port:
              number: 80
```

```bash
$ kubectl apply -f tomcat8.yaml
```



