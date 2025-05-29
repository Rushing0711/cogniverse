# 第1章 Kubeadmin安装K8S V1.23

单点版本：https://blog.csdn.net/Josh_scott/article/details/121961369?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-0.pc_relevant_default&spm=1001.2101.3001.4242.1&utm_relevant_index=3

高可用版本：https://blog.csdn.net/qq_16538827/article/details/120175489

Kubeadm是一个K8s部署工具，提供kubeadm init和kubeadm join，用于快速部署Kubernetes集群。

## 1、基础环境准备

### 1.1、服务器规划

| 机器名 | 系统类型 | IP地址          | 内存 | 部署内容 |
| ------ | -------- | --------------- | ---- | -------- |
| emon   | Rocky9.5 | 192.168.200.116 | >=2G | master   |
| emon2  | Rocky9.5 | 192.168.200.117 | >=2G | worker   |
| emon3  | Rocky9.5 | 192.168.200.118 | >=2G | worker   |

### 1.2、系统设置（所有节点）

#### 1.2.1、主机名

主机名必须每个节点都不一样（建议命名规范：数字+字母+中划线组合，不要包含其他特殊字符）。

```bash
# 查看主机名
$ hostname
# 设置主机名：注意修改为具体的主机名
$ hostnamectl set-hostname wenqiu
```

#### 1.2.2、本地DNS

配置host，使得所有节点之间可以通过hostname互相访问。

```bash
$ tee >> /etc/hosts <<- 'EOF'
192.168.200.116	emon
192.168.200.117 emon2
192.168.200.118 emon3
EOF
```

#### 1.2.3、安装依赖包

```bash
# 更新yum
$ dnf update -y
# 安装依赖包
$ dnf install -y socat conntrack ipvsadm ipset jq sysstat curl iptables libseccomp yum-utils
```

#### 1.2.4、关闭防火墙、重置iptables、关闭swap、关闭selinux和dnsmasq

```bash
# 关闭防火墙
$ systemctl stop firewalld && systemctl disable firewalld

# 设置iptables规则
$ iptables -F && iptables -X && iptables -F -t nat && iptables -X -t nat && iptables -P FORWARD ACCEPT

# 关闭swap
$ swapoff -a
# 去掉swap开机启动
$ sed -i '/swap/s/^\(.*\)$/#\1/g' /etc/fstab

# 关闭selinux
$ setenforce 0
# 防止重启恢复
$ sed -i 's/^SELINUX=enforcing$/SELINUX=disabled/' /etc/selinux/config

# 关闭dnsmasq（否则可能导致docker容器无法解析域名）：如果没有该启动单元，可以忽略！
$ systemctl stop dnsmasq && systemctl disable dnsmasq
```

#### 1.2.5、系统参数设置

```bash
# 将桥接的IPv4流量传递到 iptables 的链：
$ cat > /etc/sysctl.d/kubernetes.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_nonlocal_bind = 1
net.ipv4.ip_forward = 1
vm.swappiness = 0
vm.overcommit_memory = 1
EOF
# 生效文件
$ sysctl -p /etc/sysctl.d/kubernetes.conf
```

> 如果执行sysctl -p报错：
>
> > sysctl: cannot stat /proc/sys/net/bridge/bridge-nf-call-ip6tables: 没有那个文件或目录
> >
> > sysctl: cannot stat /proc/sys/net/bridge/bridge-nf-call-iptables: 没有那个文件或目录
>
> 临时方案！无需重启！
>
> > modprobe br_netfilter
>
> 永久方案！重启后生效！
>
> > cat > /etc/rc.sysinit << EOF
> > #!/bin/bash
> > for file in /etc/sysconfig/modules/*.modules ; do
> > [ -x $file ] && $file
> > done
> > EOF
> >
> >
> >
> > cat > /etc/sysconfig/modules/br_netfilter.modules << EOF
> > modprobe br_netfilter
> > EOF
> >
> >
> >
> > chmod 755 /etc/sysconfig/modules/br_netfilter.modules
> > lsmod |grep br_netfilter

#### 1.2.6、配置SSH免密登录（仅中转节点）

为了方便文件的copy我们选择一个中转节点（随便一个节点，可以是集群中的也可以是非集群中的），配置好跟其他所有节点的免密登录。这里选择emon节点：

```bash
# 看看是否已经存在rsa公钥
$ cat ~/.ssh/id_rsa.pub

# 如果不存在就创建一个新的
$ ssh-keygen -t rsa

# 把id_rsa.pub文件内容copy到其他机器的授权文件中
$ ssh-copy-id -i ~/.ssh/id_rsa.pub emon
$ ssh-copy-id -i ~/.ssh/id_rsa.pub emon2
$ ssh-copy-id -i ~/.ssh/id_rsa.pub emon3
```

#### 1.2.7、移除docker相关软件包（可选）

```bash
$ yum remove -y docker* container-selinux
$ rm -f /etc/docker/daemon.json
$ rm -rf /var/lib/docker/
```

如果yum报告说以上安装包未安装，未匹配，未删除任何安装包，表示环境干净，没有历史遗留旧版安装。



## 2、基础安装（所有节点）

### 2.1、安装Docker

[查看官方CentOS安装Docker教程](https://docs.docker.com/engine/install/centos/)

#### 2.1.1、CentOS环境下安装Docker

1. 安装需要的软件包，yum-util提供yum-config-manager功能，另外两个是devicemapper驱动依赖的

```shell
$ yum install -y yum-utils device-mapper-persistent-data lvm2
```

2. 设置yum源

```shell
# $ yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# 若上面命令网络不可达，请利用阿里云
$ yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

3. 可以查看所有仓库中所有docker版本，并选择安装特定的版本

```shell
$ yum list docker-ce --showduplicates |sort -r
```

4. 安装docker

```shell
# 安装最新
# $ yum install -y docker-ce
# 安装指定版本
# $ yum install -y docker-ce-18.06.3.ce 【一个使用了很久的版本】
# $ yum install -y docker-ce-19.03.15
$ yum install -y docker-ce-20.10.24
# $ yum install -y docker-ce-23.0.6
# $ yum install -y docker-ce-24.0.9
# $ yum install -y docker-ce-25.0.5
# $ yum install -y docker-ce-26.1.4
```

> `docker-ce-cli` 是Docker的命令行客户端，用于与Docker守护程序交互；`docker-ce` 是Docker的社区版，提供了完整的容器化平台；而  `containerd.io`则是底层的容器运行时组件，用于管理容器的生命周期和镜像管理。这些组件在Docker生态系统中各自发挥着不同的作用，共同构成了强大的容器化解决方案。
>
> `docker-ce`：它是一个完整的容器化平台，包括了**Docker-ce-cli**以及其他必要的组件，如Docker守护程序和基础设施管理工具

5. 启动

```shell
$ systemctl enable docker && systemctl start docker
```

6. 验证安装

```shell
$ docker version
$ docker info
$ docker run hello-world
```

7. 隐含安装了compose

```bash
$ docker compose version
Docker Compose version v2.33.1
```

#### 2.1.2、配置Docker的cgroup driver

k8s的v1.23版本使用的 systemd，而Docker的20.10版本默认

- 查看Docker的cgroup

```bash
$ docker info|grep group
 Cgroup Driver: cgroupfs
 Cgroup Version: 1
```

```bash
$ sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "exec-opts": ["native.cgroupdriver=systemd"]
}
EOF
$ systemctl restart docker
```

#### 2.1.3、配置Docker代理服务

- 配置Docker代理

```bash
$ mkdir -p /etc/systemd/system/docker.service.d
$ vim /etc/systemd/system/docker.service.d/proxy.conf
```

```bash
[Service]
Environment="HTTP_PROXY=http://192.168.200.1:7890"
Environment="HTTPS_PROXY=http://192.168.200.1:7890"
Environment="NO_PROXY=127.0.0.1,localhost,192.168.200.116"
```

- 重启Docker并查看代理配置情况

```bash
$ systemctl daemon-reload && systemctl restart docker
$ systemctl show --property=Environment docker
# Environment=HTTP_PROXY=http://192.168.32.1:29290 HTTPS_PROXY=http://192.168.32.1:29290
Environment=HTTP_PROXY=http://192.168.200.1:7890 HTTPS_PROXY=http://192.168.200.1:7890 NO_PROXY=127.0.0.1,localhost,192.168.200.116
```

#### 2.1.4、配置alias

配置永久的alias：

```shell
# 如果是root用户安装的，不需要带sudo命令
$ vim ~/.bashrc
alias docker="sudo /usr/bin/docker"
alias dockerpsf="sudo /usr/bin/docker ps --format \"table{{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Image}}\t{{.RunningFor}}\t{{.Ports}}\""
alias dockerps="sudo /usr/bin/docker ps --format \"table{{.ID}}\t{{.Status}}\t{{.Names}}\""
```

使之生效：

```shell
$ source ~/.bashrc
```

### 2.2、安装kubeadm/kubelet/kubectl

K8S依赖的Docker最佳版本： 20.10

https://github.com/kubernetes/kubernetes/blob/release-1.23/build/dependencies.yaml

#### 2.2.1、安装

1. 设置k8s源

```bash
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
$ yum update
$ yum makecache
```

2. 可以查看所有仓库中所有k8s版本，并选择安装特定的版本

```bash
$ yum list kubelet --showduplicates |sort -r
```

3. 安装kubeadm/kubelet/kubectl

```bash
$ yum install -y kubelet-1.23.17 kubeadm-1.23.17 kubectl-1.23.17
# 在 kubeadm init 后 join 命令，kubelet服务会启动，这里不需要手工启动，但需要加入开机启动！！！（master和worker节点）
$ systemctl enable kubelet
```

## 3、部署Kubernetes Mater（仅master节点）

### 3.0、预下载镜像（开启Docker代理可忽略）

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
	coredns:v1.8.6
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

### 3.1、kubeadm init

- 初始化

```bash
# 在Master上执行，由于默认拉取镜像地址 k8s.gcr.io 国内无法访问，这里指定阿里云镜像仓库地址。
# 执行该步骤之前，也可以执行 kubeadm config images pull 预下载镜像
# 查看镜像 kubeadm config images list 查看默认配置 kubeadm config print init-defaults
# 无类别域间路由 (Classless Inter -Domain Routing、CIDR)是一个用于给用户分配IP地址以及在互联网上有效地路由IP数据包的对# IP地址进行归类的方法。
# --image-repository registry.cn-hangzhou.aliyuncs.com/google_containers 指定镜像地址，默认是 k8s.gcr.io
# 镜像地址也可以是 registry.aliyuncs.com/google_containers 请注意：没有开启Docker代理服务器时必须指定
$ kubeadm init \
--apiserver-advertise-address=192.168.32.116 \
--kubernetes-version v1.23.17 \
--service-cidr=10.96.0.0/16 \
--pod-network-cidr=10.244.0.0/16

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

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.32.116:6443 --token h5hwp6.uee0zzwxesbghzom \
	--discovery-token-ca-cert-hash sha256:689bd2149ef17b545e03507289c660c1c8795ff1d88405c7b826364a86f8c246
```

- 等待一小会后，查看当前pods

```bash
$ kubectl get pods -n kube-system
NAME                           READY   STATUS    RESTARTS   AGE
coredns-74ff55c5b-q9t88        0/1     Pending   0          4m58s
coredns-74ff55c5b-xjsdg        0/1     Pending   0          4m58s
etcd-emon                      1/1     Running   0          5m12s
kube-apiserver-emon            1/1     Running   0          5m12s
kube-controller-manager-emon   1/1     Running   0          5m12s
kube-proxy-8b7qv               1/1     Running   0          4m58s
kube-scheduler-emon            1/1     Running   0          5m12s
$ kubectl get pods -n kube-system -o wide
NAME                           READY   STATUS    RESTARTS   AGE     IP               NODE     NOMINATED NODE   READINESS GATES
coredns-74ff55c5b-q9t88        0/1     Pending   0          5m29s   <none>           <none>   <none>           <none>
coredns-74ff55c5b-xjsdg        0/1     Pending   0          5m29s   <none>           <none>   <none>           <none>
etcd-emon                      1/1     Running   0          5m43s   192.168.32.116   emon     <none>           <none>
kube-apiserver-emon            1/1     Running   0          5m43s   192.168.32.116   emon     <none>           <none>
kube-controller-manager-emon   1/1     Running   0          5m43s   192.168.32.116   emon     <none>           <none>
kube-proxy-8b7qv               1/1     Running   0          5m29s   192.168.32.116   emon     <none>           <none>
kube-scheduler-emon            1/1     Running   0          5m43s   192.168.32.116   emon     <none>           <none>
$ kubectl get all
NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   7m57s
$ kubectl get nodes
NAME   STATUS     ROLES                  AGE    VERSION
emon   NotReady   control-plane,master   8m1s   v1.23.17
$ kubectl get ns
NAME              STATUS   AGE
default           Active   8m13s
kube-node-lease   Active   8m14s
kube-public       Active   8m14s
kube-system       Active   8m14s
```

分析：coredns是Pending状态，表示缺少网络插件，下面开始安装网络插件！

网络插件列表： https://kubernetes.io/zh-cn/docs/concepts/cluster-administration/addons/

### 3.2、网络插件多选1-[Calico](https://www.tigera.io/project-calico/)（仅master节点）

GitHub： https://github.com/projectcalico/calico

官网：https://docs.tigera.io/archive

系统需求： https://docs.tigera.io/calico/latest/getting-started/kubernetes/requirements

#### 3.2.1、切换目录

```bash
$ cd
$ mkdir -pv /root/k8s_soft/k8s_v1.23.17 && cd /root/k8s_soft/k8s_v1.23.17
```

这部分我们部署kubernetes的网络查件 CNI。

文档地址：https://docs.projectcalico.org/getting-started/kubernetes/self-managed-onprem/onpremises

#### 3.2.2、下载文件与配置调整

文档中有两个配置，50以下节点和50以上节点，它们的主要区别在于这个：typha。
当节点数比较多的情况下，Calico 的 Felix组件可通过 Typha 直接和 Etcd 进行数据交互，不通过 kube-apiserver，降低kube-apiserver的压力。大家根据自己的实际情况选择下载。
下载后的文件是一个all-in-one的yaml文件，我们只需要在此基础上做少许修改即可。

```bash
# 下载calico.yaml文件
# $ curl https://projectcalico.docs.tigera.io/manifests/calico.yaml -O 会加载最新版本，对K8S版本V1.20.15不再适合。
$ curl https://docs.projectcalico.org/v3.20/manifests/calico.yaml -O
```

修改IP自动发现

> 当kubelet的启动参数中存在--node-ip的时候，以host-network模式启动的pod的status.hostIP字段就会自动填入kubelet中指定的ip地址。

修改前：

```bash
- name: IP
  value: "autodetect"
```

修改后：

```bash
- name: IP
  valueFrom:
    fieldRef:
      fieldPath: status.hostIP
```

修改CIDR

修改前：

```bash
# - name: CALICO_IPV4POOL_CIDR
#   value: "192.168.0.0/16"
```

修改后（修改成你自己的value，我这里是10.244.0.0/16）

```bash
- name: CALICO_IPV4POOL_CIDR
  value: "10.244.0.0/16"
```

#### 3.2.3、执行安装

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

### 3.2、网络插件多选2-[Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually)（仅master节点）

#### 3.2.1、切换目录

```bash
$ cd
$ mkdir -pv /root/k8s_soft/k8s_v1.23.17 && cd /root/k8s_soft/k8s_v1.23.17
```

#### 3.2.2、下载文件

Flannel是配置为Kubernetes设计的第3层网络结构的一种简单易行的方法。

For Kubernetes v1.17+

```bash
$ wget https://github.com/flannel-io/flannel/releases/download/v0.25.4/kube-flannel.yml
```

#### 3.2.3、执行安装

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

### 3.3、加入节点到集群（仅worker节点）

- 加入集群

```bash
# kubeadm init的执行结果中有如下命令，在各个worker节点执行加入即可
$ kubeadm join 192.168.32.116:6443 --token h5hwp6.uee0zzwxesbghzom \
	--discovery-token-ca-cert-hash sha256:689bd2149ef17b545e03507289c660c1c8795ff1d88405c7b826364a86f8c246
```

- 查看节点

```bash
# 等节点加入成功，过一会查看得到
$ kubectl get nodes
NAME    STATUS   ROLES                  AGE    VERSION
emon    Ready    control-plane,master   7m5s   v1.23.17
emon2   Ready    <none>                 85s    v1.23.17
emon3   Ready    <none>                 83s    v1.23.17

# 网络插件flannel时的查询结果
$ kubectl get pods -n kube-system -o wide
NAME                           READY   STATUS    RESTARTS   AGE     IP               NODE    NOMINATED NODE   READINESS GATES
coredns-bd6b6df9f-72cb6        1/1     Running   0          8m40s   10.244.0.3       emon    <none>           <none>
coredns-bd6b6df9f-nqfn5        1/1     Running   0          8m40s   10.244.0.2       emon    <none>           <none>
etcd-emon                      1/1     Running   0          8m54s   192.168.32.116   emon    <none>           <none>
kube-apiserver-emon            1/1     Running   0          8m55s   192.168.32.116   emon    <none>           <none>
kube-controller-manager-emon   1/1     Running   0          8m52s   192.168.32.116   emon    <none>           <none>
kube-proxy-9wvmt               1/1     Running   0          3m17s   192.168.32.117   emon2   <none>           <none>
kube-proxy-cbb2x               1/1     Running   0          8m40s   192.168.32.116   emon    <none>           <none>
kube-proxy-xgnpf               1/1     Running   0          3m15s   192.168.32.118   emon3   <none>           <none>
kube-scheduler-emon            1/1     Running   0          8m54s   192.168.32.116   emon    <none>           <none>
```

## 3.4、虚拟机挂起并恢复后k8s网络问题

- 查看设备状态

```bash
$ nmcli device status
```

- 永久unmanaged

```bash
$ vim /etc/NetworkManager/conf.d/99-unmanaged-devices.conf
```

```bash
[keyfile]
unmanaged-devices=interface-name:docker*;interface-name:veth*;interface-name:br-*;interface-name:vmnet*;interface-name:vboxnet*;interface-name:cni0;interface-name:cali*;interface-name:flannel*;interface-name:tun*
```

- 重启NetworkManager

```bash
$ systemctl restart NetworkManager
```

## 4、安装ingress-nginx（仅master节点）

ingress-nginx GitHub：https://github.com/kubernetes/ingress-nginx

ingress-nginx官网：https://kubernetes.github.io/ingress-nginx/deploy/

### 4.1、切换目录

```bash
$ cd
$ mkdir -pv /root/k8s_soft/k8s_v1.23.17 && cd /root/k8s_soft/k8s_v1.23.17
```

### 4.2、下载文件与配置调整

```bash
# 下载 https://github.com/kubernetes/ingress-nginx/blob/controller-v1.6.4/deploy/static/provider/cloud/deploy.yaml 到 ingress-nginx.yaml
# 若 raw.githubusercontent.com 无法访问，可以通过 https://www.ipaddress.com 查询其ip地址并配置本地dns
$ curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.6.4/deploy/static/provider/cloud/deploy.yaml -O
```

#### 4.2.1、调整镜像

- 调整镜像名称1

image: registry.k8s.io/ingress-nginx/controller:v1.6.3@sha256:b92667e0afde1103b736e6a3f00dd75ae66eec4e71827d19f19f471699e909d2

==>

image: registry.k8s.io/ingress-nginx/controller:v1.6.3

- 调整镜像名称2

image: registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343@sha256:39c5b2e3310dc4264d638ad28d9d1d96c4cbb2b2dcfb52368fe4e3c63f61e10f

==>

image: registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343

#### 4.2.2、调整Service

- 调整Service的type为 NodePort 并固定 nodePort 为80和443

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/component: controller
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
    app.kubernetes.io/version: 1.6.3
  name: ingress-nginx-controller
  namespace: ingress-nginx
spec:
  externalTrafficPolicy: Local
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  ports:
  - appProtocol: http
    name: http
    port: 80
    protocol: TCP
    targetPort: http
    nodePort: 80
  - appProtocol: https
    name: https
    port: 443
    protocol: TCP
    targetPort: https
    nodePort: 443
  selector:
    app.kubernetes.io/component: controller
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/name: ingress-nginx
  #type: LoadBalancer
  type: NodePort
```

- 调整nodePort允许的端口范围（在master节点）

上面直接设置为80和443会报错：nodePort: Invalid value valid ports is 30000-32767

是因为k8s的node节点的端口默认被限制在30000-32767的范围。

修改node节点的允许范围：

```bash
$ vim /etc/kubernetes/manifests/kube-apiserver.yaml 
```

在 spec.containers.command 中找到`- --service-cluster-ip-range`，并在其后增加一行：

```bash
    - --service-node-port-range=1-65535
```

- 重启

```bash
$ systemctl daemon-reload && systemctl restart kubelet
```

#### 4.2.3、调整Deployment

修改kind模式 Deployment ==> DaemonSet

### 4.3、安装ingress-nginx

- 安装插件（master节点）

```bash
# 配置资源
$ kubectl apply -f ingress-nginx.yaml
# 查看
$ kubectl get all -n ingress-nginx -o wide
NAME                                       READY   STATUS      RESTARTS   AGE   IP            NODE    NOMINATED NODE   READINESS GATES
pod/ingress-nginx-admission-create-gdv6g   0/1     Completed   0          57m   10.244.1.20   emon2   <none>           <none>
pod/ingress-nginx-admission-patch-cdfj9    0/1     Completed   0          57m   10.244.2.21   emon3   <none>           <none>
pod/ingress-nginx-controller-mpx75         1/1     Running     0          57m   10.244.1.21   emon2   <none>           <none>
pod/ingress-nginx-controller-vx8qg         1/1     Running     0          57m   10.244.2.22   emon3   <none>           <none>

NAME                                         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)                 AGE   SELECTOR
service/ingress-nginx-controller             NodePort    10.96.57.167   <none>        80:80/TCP,443:443/TCP   57m   app.kubernetes.io/components=controller,app.kubernetes.io/instance=ingress-nginx,app.kubernetes.io/name=ingress-nginx
service/ingress-nginx-controller-admission   ClusterIP   10.96.171.51   <none>        443/TCP                 57m   app.kubernetes.io/components=controller,app.kubernetes.io/instance=ingress-nginx,app.kubernetes.io/name=ingress-nginx

NAME                                      DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE   CONTAINERS   IMAGES                                            SELECTOR
daemonset.apps/ingress-nginx-controller   2         2         2       2            2           kubernetes.io/os=linux   57m   controller   registry.k8s.io/ingress-nginx/controller:v1.6.3   app.kubernetes.io/components=controller,app.kubernetes.io/instance=ingress-nginx,app.kubernetes.io/name=ingress-nginx

NAME                                       COMPLETIONS   DURATION   AGE   CONTAINERS   IMAGES                                                                    SELECTOR
job.batch/ingress-nginx-admission-create   1/1           3s         57m   create       registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343   controller-uid=e4a52a60-df3f-48e7-92f7-e60dacdb5cde
job.batch/ingress-nginx-admission-patch    1/1           3s         57m   patch        registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343   controller-uid=046a9d6b-cf6d-45b5-9f08-0c3f0d5d4fa6
```

### 4.4、测试服务

#### 4.5.1、ingress-test.yaml配置

```bash
$ vim ingress-test.yaml
```

```yaml
#deploy
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deploy
spec:
  selector:
    matchLabels:
      app: nginx-pod
  replicas: 1
  template:
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
      - name: nginx
        image: nginx:1.22
        ports:
        - containerPort: 80

---      
#deploy
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tomcat-deploy
spec:
  selector:
    matchLabels:
      app: tomcat-pod
  replicas: 1
  template:
    metadata:
      labels:
        app: tomcat-pod
    spec:
      containers:
      - name: tomcat
        image: tomcat:8.5-jre8-slim
        ports:
        - containerPort: 8080
        
---
#service
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx-pod
  type: ClusterIP
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80

---
#service
apiVersion: v1
kind: Service
metadata:
  name: tomcat-service
spec:
  selector:
    app: tomcat-pod
  type: ClusterIP
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080

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
  - host: nginx.fsmall.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-service
            port:
              number: 80
  - host: tomcat.fsmall.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: tomcat-service
            port:
              number: 80
```

配置资源生效：

```bash
# 创建
$ kubectl apply -f ingress-test.yaml
# 查看ingress-test的pod状态
$ kubectl get all -o wide
NAME                                 READY   STATUS    RESTARTS   AGE    IP            NODE    NOMINATED NODE   READINESS GATES
pod/nginx-deploy-ddbb599fb-5z9kd     1/1     Running   0          3m1s   10.244.2.23   emon3   <none>           <none>
pod/tomcat-deploy-54ccd7f798-l6r2r   1/1     Running   0          3m1s   10.244.1.22   emon2   <none>           <none>

NAME                     TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE    SELECTOR
service/kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP   9h     <none>
service/nginx-service    ClusterIP   10.96.221.149   <none>        80/TCP    3m1s   app=nginx-pod
service/tomcat-service   ClusterIP   10.96.174.145   <none>        80/TCP    3m1s   app=tomcat-pod

NAME                            READY   UP-TO-DATE   AVAILABLE   AGE    CONTAINERS   IMAGES                 SELECTOR
deployment.apps/nginx-deploy    1/1     1            1           3m1s   nginx        nginx:1.22             app=nginx-pod
deployment.apps/tomcat-deploy   1/1     1            1           3m1s   tomcat       tomcat:8.5-jre8-slim   app=tomcat-pod

NAME                                       DESIRED   CURRENT   READY   AGE    CONTAINERS   IMAGES                 SELECTOR
replicaset.apps/nginx-deploy-ddbb599fb     1         1         1       3m1s   nginx        nginx:1.22             app=nginx-pod,pod-template-hash=ddbb599fb
replicaset.apps/tomcat-deploy-54ccd7f798   1         1         1       3m1s   tomcat       tomcat:8.5-jre8-slim   app=tomcat-pod,pod-template-hash=54ccd7f798

# 命令行访问service
$ curl 10.96.221.149:80
$ curl 10.96.174.145:80

# --------------------------------------------------------------------------------
# 查看发现ingress启动在emon2和emon3上
$ kubectl get po -n ingress-nginx -o wide
# 查看ingress的NodePort地址
$ kubectl get svc -n ingress-nginx
NAME                                 TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)                 AGE
ingress-nginx-controller             NodePort    10.96.57.167   <none>        80:80/TCP,443:443/TCP   62m
ingress-nginx-controller-admission   ClusterIP   10.96.171.51   <none>        443/TCP                 62m

# 命令行访问service
$ curl  -H "Host: nginx.fsmall.com" 10.96.57.167:80
$ curl  -H "Host: tomcat.fsmall.com" 10.96.57.167:80

# --------------------------------------------------------------------------------
$ kubectl get ing
NAME           CLASS   HOSTS                                ADDRESS        PORTS   AGE
ingress-http   nginx   nginx.fsmall.com,tomcat.fsmall.com   10.96.57.167   80      5m46s

# 配置本地DNS：访问emon2或emon3的DNS
$ vim /etc/hosts
192.168.32.117 nginx.fsmall.com
192.168.32.118 tomcat.fsmall.com
192.168.32.117 api.fsmall.com

# 访问
http://nginx.fsmall.com # 看到正常nginx界面
http://tomcat.fsmall.com # 看到正常tomcat界面
http://api.fsmall.com # 看到 nginx 的 404 页面

# 删除资源
$ kubectl delete -f ingress-test.yaml
```

## 5、集群冒烟测试（在主节点emon操作）

### 5.1、创建nginx ds

```bash
 # 写入配置
$ cat > nginx-ds.yml <<EOF
apiVersion: v1
kind: Service
metadata:
  name: nginx-ds
  labels:
    app: nginx-ds
spec:
  type: NodePort
  selector:
    app: nginx-ds
  ports:
  - name: http
    port: 80
    targetPort: 80
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: nginx-ds
spec:
  selector:
    matchLabels:
      app: nginx-ds
  template:
    metadata:
      labels:
        app: nginx-ds
    spec:
      containers:
      - name: my-nginx
        image: nginx:1.19
        ports:
        - containerPort: 80
EOF

# 创建ds
$ kubectl apply -f nginx-ds.yml
```

### 5.2、检查各种ip连通性

```bash
# 检查各 Node 上的 Pod IP 连通性
$ kubectl get pods -o wide

# 在每个worker节点上ping pod ip
$ ping <pod-ip>

# 检查service可达性
$ kubectl get svc

# 在每个worker节点上访问服务
$ curl <service-ip>:<port>

# 在每个节点检查node-port可用性
$ curl <node-ip>:<port>
```

### 5.3、检查dns可用性

```bash
# 创建一个nginx pod
$ cat > pod-nginx.yaml <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: docker.io/library/nginx:1.19
    ports:
    - containerPort: 80
EOF

# 创建pod
$ kubectl apply -f pod-nginx.yaml

# 进入pod，查看dns
$ kubectl exec nginx -it -- /bin/bash

# 查看dns配置
root@nginx:/# cat /etc/resolv.conf

# 查看名字是否可以正确解析
root@nginx:/# curl nginx-ds

# 退出测试
root@nginx:/# exit
```

### 5..4、日志功能

测试使用kubectl查看pod的容器日志

```bash
$ kubectl get pods
# 命令行输出结果
NAME             READY   STATUS    RESTARTS   AGE
nginx            1/1     Running   0          54s
nginx-ds-dkfjm   1/1     Running   0          2m54s
nginx-ds-rx6mj   1/1     Running   0          2m54s

# 查看日志
$ kubectl logs <pod-name>
```

### 5.5、Exec功能

测试kubectl的exec功能

```bash
# 查询指定标签的pod
$ kubectl get pods -l app=nginx-ds
$ kubectl exec -it <nginx-pod-name> -- nginx -v
```

### 5.6、删除配置的测试资源

```bash
$ kubectl delete -f pod-nginx.yaml
$ kubectl delete -f nginx-ds.yml
# 查看是否清理完成
$ kubectl get pods
# 命令行输出结果
No resources found in default namespace.
```

## 6、Harbor镜像私服（在emon主机root用户安装）

### 6.1、安装docker-compose

1：下载

```bash
$ curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

2：添加可执行权限

```bash
$ chmod +x /usr/local/bin/docker-compose
# 创建软连，避免安装Harbor时报错：? Need to install docker-compose(1.18.0+) by yourself first and run this script again.
$ ln -snf /usr/local/bin/docker-compose /usr/bin/docker-compose
```

33：测试

```bash
$ docker-compose --version
# 命令行输出结果
docker-compose version 1.29.2, build 5becea4c
```

### 6.2、安装Harbor镜像私服

Harbor镜像私服（在emon主机root用户安装）

0. 切换目录

```bash
$ cd
$ mkdir -pv /root/k8s_soft/k8s_v1.20.15 && cd /root/k8s_soft/k8s_v1.20.15
```

1. 下载地址

https://github.com/goharbor/harbor/releases

```bash
$ wget https://github.com/goharbor/harbor/releases/download/v2.2.4/harbor-offline-installer-v2.2.4.tgz
```

2. 创建解压目录

```bash
# 创建Harbor解压目录
$ mkdir /usr/local/Harbor
# 创建Harbor的volume目录
$ mkdir -p /usr/local/dockerv/harbor_home
```

3. 解压

```bash
# 推荐v2.2.4版本，更高版本比如2.3和2.4有docker-compose down -v ==> down-compose up -d时postgresql服务启动不了的bug，数据库重启失败！
$ tar -zxvf harbor-offline-installer-v2.2.4.tgz -C /usr/local/Harbor/
$ ls /usr/local/Harbor/harbor
common.sh  harbor.v2.2.4.tar.gz  harbor.yml.tmpl  install.sh  LICENSE  prepare
```

4. 创建自签名证书【参考实现，建议走正规渠道的CA证书】【缺少证书无法浏览器登录】

- 创建证书存放目录

```bash
# 切换目录
$ mkdir /usr/local/Harbor/cert && cd /usr/local/Harbor/cert
```

- 创建CA根证书

```bash
# 其中C是Country，ST是State，L是local，O是Origanization，OU是Organization Unit，CN是common name(eg, your name or your server's hostname)
$ openssl req -newkey rsa:4096 -nodes -sha256 -keyout ca.key -x509 -days 3650 -out ca.crt \
-subj "/C=CN/ST=ZheJiang/L=HangZhou/O=HangZhou emon Technologies,Inc./OU=IT emon/CN=emon"
# 查看结果
$ ls
ca.crt  ca.key
```

- 生成一个证书签名，设置访问域名为 emon

```bash
$ openssl req -newkey rsa:4096 -nodes -sha256 -keyout emon.key -out emon.csr \
-subj "/C=CN/ST=ZheJiang/L=HangZhou/O=HangZhou emon Technologies,Inc./OU=IT emon/CN=emon"
# 查看结果
$ ls
ca.crt  ca.key  emon.csr  emon.key
```

- 生成主机的证书

```bash
$ openssl x509 -req -days 3650 -in emon.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out emon.crt
# 查看结果
$ ls
ca.crt  ca.key  ca.srl  emon.crt  emon.csr  emon.key
```

5. 编辑配置

```bash
$ cp /usr/local/Harbor/harbor/harbor.yml.tmpl /usr/local/Harbor/harbor/harbor.yml
$ vim /usr/local/Harbor/harbor/harbor.yml
```

```yaml
# 修改
# hostname: reg.mydomain.com
hostname: 192.168.32.116
# 修改
  # port: 80
  port: 5080
# 修改
https:
  # https port for harbor, default is 443
  port: 5443
  # The path of cert and key files for nginx
  # certificate: /your/certificate/path
  # private_key: /your/private/key/path
  # 修改：注意，这里不能使用软连接目录 /usr/loca/harbor替换/usr/local/Harbor/harbor-2.2.4
  # 否则会发生证书找不到错误：FileNotFoundError: [Errno 2] No such file or directory: 
  certificate: /usr/local/Harbor/cert/emon.crt
  private_key: /usr/local/Harbor/cert/emon.key
# 修改
# data_volume: /data
data_volume: /usr/local/dockerv/harbor_home
```

6. 安装

```bash
# 安装时，确保 /usr/bin/docker-compose 存在，否则会报错：? Need to install docker-compose(1.18.0+) by yourself first and run this script again.
$ /usr/local/Harbor/harbor/install.sh --with-chartmuseum --with-trivy
# 切换目录
$  cd /usr/local/Harbor/harbor/
# 查看服务状态
$ docker-compose ps
# 命令行输出结果
      Name                     Command                  State                           Ports                     
------------------------------------------------------------------------------------------------------------------
chartmuseum         ./docker-entrypoint.sh           Up (healthy)                                                 
harbor-core         /harbor/entrypoint.sh            Up (healthy)                                                 
harbor-db           /docker-entrypoint.sh 96 13      Up (healthy)                                                 
harbor-jobservice   /harbor/entrypoint.sh            Up (healthy)                                                 
harbor-log          /bin/sh -c /usr/local/bin/ ...   Up (healthy)   127.0.0.1:1514->10514/tcp                     
harbor-portal       nginx -g daemon off;             Up (healthy)                                                 
nginx               nginx -g daemon off;             Up (healthy)   0.0.0.0:5080->8080/tcp, 0.0.0.0:5443->8443/tcp
redis               redis-server /etc/redis.conf     Up (healthy)                                                 
registry            /home/harbor/entrypoint.sh       Up (healthy)                                                 
registryctl         /home/harbor/start.sh            Up (healthy)                                                 
trivy-adapter       /home/scanner/entrypoint.sh      Up (healthy)
```

8. 登录

访问：http://192.168.32.116:5080 （会被跳转到http://192.168.32.116:5443）

用户名密码： admin/Harbor12345

harbor数据库密码： root123

登录后创建了用户：emon/Emon@123

登录后创建了命名空间：devops-learning 并将emon用户用于该命名空间

9. 修改配置重启

```bash
$ cd /usr/local/Harbor/harbor/
$ docker-compose down -v
# 如果碰到 postgresql 服务不是UP状态，导致登录提示：核心服务不可用。 请执行下面命令（根据data_volume配置调整路径），这个是该版本的bug。目前，v2.2.4版本可以正确重启，无需删除pg13
# [emon@emon harbor]$ sudo rm -rf /usr/local/dockerv/harbor_home/database/pg13
$ docker-compose up -d
```

10. 私服安全控制

- 对文件 `/etc/docker/daemon.json` 追加 `insecure-registries`内容：

```bash
$ vim /etc/docker/daemon.json
```

```bash
{
  "registry-mirrors": ["https://pyk8pf3k.mirror.aliyuncs.com","https://dockerproxy.com","https://mirror.baidubce.com","https://docker.nju.edu.cn","https://docker.mirrors.sjtug.sjtu.edu.cn","https://docker.mirrors.ustc.edu.cn"],
  "graph": "/usr/local/lib/docker",
  "exec-opts": ["native.cgroupdriver=cgroupfs"],
  "insecure-registries": ["192.168.32.116:5080"]
}
```

- 对文件 `/lib/systemd/system/docker.service` 追加`EnvironmentFile`：【可省略】

```bash
$ vim /lib/systemd/system/docker.service 
```

```bash
# 在ExecStart后面一行追加：经验证daemon.json配置了insecure-registries即可，无需这里再配置
EnvironmentFile=-/etc/docker/daemon.json
```

重启Docker服务：

```bash
$ systemctl daemon-reload
$ systemctl restart docker
```

10. 推送镜像

登录harbor后，先创建devops-learning项目，并创建emon用户。

```bash
# 下载
$ docker pull openjdk:8-jre
# 打标签
$ docker tag openjdk:8-jre 192.168.32.116:5080/devops-learning/openjdk:8-jre
# 登录
$ docker login -u emon -p Emon@123 192.168.32.116:5080
# 上传镜像
$ docker push 192.168.32.116:5080/devops-learning/openjdk:8-jre
# 退出登录
$ docker logout 192.168.32.116:5080

机器人账户：
token：  
XsttKM4zpuFWcchUmEhJErmiRRRfBu0A
```

# 补充、演练与理解

## 1、常规命令部署一个tomcat

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

## 2、通过yaml部署一个tomcat

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