# 第4章 kubernetes-the-hard-way

> 注意：以下命令在root权限下执行；切换到root用户或者提升权限：```sudo -i```

## 主要特性

- 学习: 依照github知名项目kubernetes-the-hard-way的流程，全部手动部署，深入了解集群各个组件
- 生产级高可用: 在kubernetes-the-hard-way基础上增加了各个组件的高可用方案，满足生产集群要求
- 99年永久证书，不用为证书过期烦恼
- 不依赖ansible等第三方工具
- 高可用不依赖haproxy、keepalived，采用本地代理的方式，简单优雅

## 如果是你

- 如果你想深入学习kubernetes
- 如果你喜欢二进制的运维方式
- 如果你正在部署生产环境的kubernetes

## 部署文档

## 1、基础环境准备

### 1.1、服务器规划

| 机器名 | 系统类型  | IP地址         | 内存 | 部署内容       |
| ------ | --------- | -------------- | ---- | -------------- |
| emon   | CentOS7.7 | 192.168.32.116 | >=2G | master         |
| emon2  | CentOS7.7 | 192.168.32.117 | >=2G | master、worker |
| emon3  | CentOS7.7 | 192.168.32.118 | >=2G | worker         |

### 1.2、系统设置（所有节点）

#### 1.2.1、主机名

主机名必须每个节点都不一样（建议命名规范：数字+字母+中划线组合，不要包含其他特殊字符）。

```bash
# 查看主机名
$ hostname
# 设置主机名：注意修改为具体的主机名
$ hostnamectl set-hostname emon
```

#### 1.2.2、本地DNS

配置host，使得所有节点之间可以通过hostname互相访问。

```bash
$ vim /etc/hosts
```

```bash
192.168.32.116 emon
192.168.32.117 emon2
192.168.32.118 emon3
```

#### 1.2.3、安装依赖包

```bash
# 更新yum
$ yum update -y
# 安装依赖包
$ yum install -y socat conntrack ipvsadm ipset jq sysstat curl iptables libseccomp yum-utils
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
# 制作配置文件
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
> > cat > /etc/sysconfig/modules/br_netfilter.modules << EOF
> > modprobe br_netfilter
> > EOF
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
$ yum remove -y docker*
$ rm -f /etc/docker/daemon.json
$ rm -rf /var/lib/docker/
```

### 1.3、准备k8s软件包（仅master节点emon）

#### 1.3.0、切换目录

```bash
$ cd
$ mkdir -pv k8s_soft/k8s_v1.20.2 && cd k8s_soft/k8s_v1.20.2
```

#### 1.3.1、软件包下载

在任意一个节点下载好压缩包后，复制到所有节点即可

master节点组件：kube-apiserver、kube-controller-manager、kube-scheduler、kubectl

worker节点组件：kubelet、kube-proxy

```bash
# 设定版本号
$ export VERSION=v1.20.2

# 下载master节点组件
$ wget https://storage.googleapis.com/kubernetes-release/release/${VERSION}/bin/linux/amd64/kube-apiserver
$ wget https://storage.googleapis.com/kubernetes-release/release/${VERSION}/bin/linux/amd64/kube-controller-manager
$ wget https://storage.googleapis.com/kubernetes-release/release/${VERSION}/bin/linux/amd64/kube-scheduler
$ wget https://storage.googleapis.com/kubernetes-release/release/${VERSION}/bin/linux/amd64/kubectl

# 下载worker节点组件
$ wget https://storage.googleapis.com/kubernetes-release/release/${VERSION}/bin/linux/amd64/kube-proxy
$ wget https://storage.googleapis.com/kubernetes-release/release/${VERSION}/bin/linux/amd64/kubelet

# =================================================================================================
# 下载etcd组件
$ export VERSION=v3.4.10
$ wget https://github.com/etcd-io/etcd/releases/download/${VERSION}/etcd-${VERSION}-linux-amd64.tar.gz
$ tar -zxvf etcd-${VERSION}-linux-amd64.tar.gz -C .
$ mv etcd-${VERSION}-linux-amd64/etcd* .
$ rm -rf etcd-${VERSION}-linux-amd64

# =================================================================================================
# 统一修改文件权限为可执行
$ chmod +x kube*

# 下载
$ wget https://github.com/cloudflare/cfssl/releases/download/v1.6.1/cfssl_1.6.1_linux_amd64
$ wget https://github.com/cloudflare/cfssl/releases/download/v1.6.1/cfssljson_1.6.1_linux_amd64

# 修改为可执行权限
$ chmod +x cfssl_1.6.1_linux_amd64 cfssljson_1.6.1_linux_amd64

# =================================================================================================
# 设定containerd的版本号
$ VERSION=1.4.3
# 下载压缩包
$ wget https://github.com/containerd/containerd/releases/download/v${VERSION}/cri-containerd-cni-${VERSION}-linux-amd64.tar.gz
```

#### 1.3.2、软件包分发

完成下载后，分发文件，将每个节点需要的文件scp过去

```bash
# 把master相关组件分发到master节点
$ MASTERS=(emon emon2)
for instance in ${MASTERS[@]}; do
  scp kube-apiserver kube-controller-manager kube-scheduler kubectl root@${instance}:/usr/local/bin/
done

# 把worker先关组件分发到worker节点
$ WORKERS=(emon2 emon3)
for instance in ${WORKERS[@]}; do
  scp kubelet kube-proxy root@${instance}:/usr/local/bin/
done

# 把etcd组件分发到etcd节点
$ ETCDS=(emon emon2 emon3)
for instance in ${ETCDS[@]}; do
  scp etcd etcdctl etcdutl root@${instance}:/usr/local/bin/
done
```



## 2、生成证书（仅中转节点）

如下操作，都在`/root/k8s_soft/k8s_v1.20.2`目录执行。

### 2.0、安装cfssl

- 安装cfssl

cfssl是非常好用的CA工具，我们用它来生成证书和秘钥文件 安装过程比较简单，如下：

```bash
# 加入可执行目录
$ cp cfssl_1.6.1_linux_amd64 /usr/local/bin/cfssl
$ cp cfssljson_1.6.1_linux_amd64 /usr/local/bin/cfssljson

# 验证
$ cfssl version
# 命令行输出结果
Version: 1.6.1
Runtime: go1.12.12
```

### 2.1、根证书

根证书是集群所有节点共享的，只需要创建一个 CA 证书，后续创建的所有证书都由它签名。
在任意节点（可以免密登录到其他节点）创建一个单独的证书目录，如：`mkdir pki && cd pki`

#### 根证书配置文件

```json
$ cat > ca-config.json <<EOF
{
  "signing": {
    "default": {
      "expiry": "876000h"
    },
    "profiles": {
      "kubernetes": {
        "usages": ["signing", "key encipherment", "server auth", "client auth"],
        "expiry": "876000h"
      }
    }
  }
}
EOF

$ cat > ca-csr.json <<EOF
{
  "CN": "Kubernetes",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "US",
      "L": "Portland",
      "O": "Kubernetes",
      "OU": "CA",
      "ST": "Oregon"
    }
  ]
}
EOF
```

#### 生成证书和私钥

```bash
# 生成证书和私钥
$ cfssl gencert -initca ca-csr.json | cfssljson -bare ca
# 生成完成后会有以下文件（我们最终想要的就是ca-key.pem和ca.pem，一个秘钥，一个证书）
$ ls ca*
ca-config.json  ca.csr  ca-csr.json  ca-key.pem  ca.pem
```

### 2.2、admin客户端证书

#### admin客户端证书配置文件

```bash
$ cat > admin-csr.json <<EOF
{
  "CN": "admin",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "CN",
      "ST": "BeiJing",
      "L": "BeiJing",
      "O": "system:masters",
      "OU": "seven"
    }
  ]
}
EOF
```

#### 生成admin客户端证书和私钥

```bash
$ cfssl gencert \
  -ca=ca.pem \
  -ca-key=ca-key.pem \
  -config=ca-config.json \
  -profile=kubernetes \
  admin-csr.json | cfssljson -bare admin

# 查看
$ ls admin*
admin.csr  admin-csr.json  admin-key.pem  admin.pem
```

### 2.3、kubelet客户端证书

Kubernetes使用一种称为Node Authorizer的专用授权模式来授权Kubelets发出的API请求。 Kubelet使用将其标识为system:nodes组中的凭据，其用户名为system：node:nodeName，接下里就给每个工作节点生成证书。

#### 生成kubelet客户端证书和私钥

```bash
# 设置你的worker节点列表
$ WORKERS=(emon2 emon3)
$ WORKER_IPS=(192.168.32.117 192.168.32.118)
# 生成所有worker节点的证书配置
$ for ((i=0;i<${#WORKERS[@]};i++)); do
cat > ${WORKERS[$i]}-csr.json <<EOF
{
  "CN": "system:node:${WORKERS[$i]}",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "CN",
      "L": "Beijing",
      "O": "system:nodes",
      "OU": "seven",
      "ST": "Beijing"
    }
  ]
}
EOF
cfssl gencert \
  -ca=ca.pem \
  -ca-key=ca-key.pem \
  -config=ca-config.json \
  -hostname=${WORKERS[$i]},${WORKER_IPS[$i]} \
  -profile=kubernetes \
  ${WORKERS[$i]}-csr.json | cfssljson -bare ${WORKERS[$i]}
done

# 查看
$ ls emon*
emon2.csr  emon2-csr.json  emon2-key.pem  emon2.pem  emon3.csr  emon3-csr.json  emon3-key.pem  emon3.pem
```

### 2.4、kube-controller-manager客户端证书

#### kube-controller-manager客户端证书配置文件

```bash
$ cat > kube-controller-manager-csr.json <<EOF
{
    "CN": "system:kube-controller-manager",
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
      {
        "C": "CN",
        "ST": "BeiJing",
        "L": "BeiJing",
        "O": "system:kube-controller-manager",
        "OU": "seven"
      }
    ]
}
EOF
```

#### 生成kube-controller-manager客户端证书

```bash
$ cfssl gencert \
  -ca=ca.pem \
  -ca-key=ca-key.pem \
  -config=ca-config.json \
  -profile=kubernetes \
  kube-controller-manager-csr.json | cfssljson -bare kube-controller-manager
  
# 查看
$ ls -1 kube-controller-manager*
kube-controller-manager
kube-controller-manager.csr
kube-controller-manager-csr.json
kube-controller-manager-key.pem
kube-controller-manager.pem
```

### 2.5、kube-proxy客户端证书

#### kube-proxy客户端证书配置文件

```bash
$ cat > kube-proxy-csr.json <<EOF
{
  "CN": "system:kube-proxy",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "CN",
      "ST": "BeiJing",
      "L": "BeiJing",
      "O": "k8s",
      "OU": "seven"
    }
  ]
}
EOF
```

#### 生成kube-proxy客户端证书

```bash
$ cfssl gencert \
  -ca=ca.pem \
  -ca-key=ca-key.pem \
  -config=ca-config.json \
  -profile=kubernetes \
  kube-proxy-csr.json | cfssljson -bare kube-proxy
# 查看  
$ ls -1 kube-proxy*
kube-proxy
kube-proxy.csr
kube-proxy-csr.json
kube-proxy-key.pem
kube-proxy.pem
```

### 2.6、kube-scheduler客户端证书

#### kube-scheduler客户端证书配置文件

```bash
$ cat > kube-scheduler-csr.json <<EOF
{
    "CN": "system:kube-scheduler",
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
      {
        "C": "CN",
        "ST": "BeiJing",
        "L": "BeiJing",
        "O": "system:kube-scheduler",
        "OU": "seven"
      }
    ]
}
EOF
```

#### 生成kube-scheduler客户端证书

```bash
$ cfssl gencert \
  -ca=ca.pem \
  -ca-key=ca-key.pem \
  -config=ca-config.json \
  -profile=kubernetes \
  kube-scheduler-csr.json | cfssljson -bare kube-scheduler
# 查看
ls -1 kube-scheduler*
kube-scheduler
kube-scheduler.csr
kube-scheduler-csr.json
kube-scheduler-key.pem
kube-scheduler.pem
```

### 2.7、kube-apiserver服务端证书

#### kube-apiserver服务端证书配置文件

```bash
$ cat > kubernetes-csr.json <<EOF
{
  "CN": "kubernetes",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "CN",
      "ST": "BeiJing",
      "L": "BeiJing",
      "O": "k8s",
      "OU": "seven"
    }
  ]
}
EOF
```

#### 生成kube-apiserver服务端证书

服务端证书与客户端略有不同，客户端需要通过一个名字或者一个ip去访问服务端，所以证书必须要包含客户端所访问的名字或ip，用以客户端验证。

```bash
# apiserver的service ip地址（一般是svc网段的第一个ip）
$ KUBERNETES_SVC_IP=10.233.0.1
# 所有的master内网ip，逗号分隔（云环境可以加上master公网ip以便支持公网ip访问）：虽然118不是master，但未来可能是
$ MASTER_IPS=192.168.32.116,192.168.32.117,192.168.32.118
# 生成证书
$ cfssl gencert \
  -ca=ca.pem \
  -ca-key=ca-key.pem \
  -config=ca-config.json \
  -hostname=${KUBERNETES_SVC_IP},${MASTER_IPS},127.0.0.1,kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.svc.cluster.local \
  -profile=kubernetes \
  kubernetes-csr.json | cfssljson -bare kubernetes
# 查看
$ ls -1 kubernetes*
kubernetes.csr
kubernetes-csr.json
kubernetes-key.pem
kubernetes.pem
```

### 2.8、Service Account证书

#### 配置文件

```bash
$ cat > service-account-csr.json <<EOF
{
  "CN": "service-accounts",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "CN",
      "ST": "BeiJing",
      "L": "BeiJing",
      "O": "k8s",
      "OU": "seven"
    }
  ]
}
EOF
```

#### 生成证书

```bash
$ cfssl gencert \
  -ca=ca.pem \
  -ca-key=ca-key.pem \
  -config=ca-config.json \
  -profile=kubernetes \
  service-account-csr.json | cfssljson -bare service-account
# 查看
$ ls -1 service-account*
service-account.csr
service-account-csr.json
service-account-key.pem
service-account.pem
```

### 2.9、proxy-client证书

#### 配置文件

```bash
$ cat > proxy-client-csr.json <<EOF
{
  "CN": "aggregator",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "CN",
      "ST": "BeiJing",
      "L": "BeiJing",
      "O": "k8s",
      "OU": "seven"
    }
  ]
}
EOF
```

#### 生成证书

```bash
$ cfssl gencert \
  -ca=ca.pem \
  -ca-key=ca-key.pem \
  -config=ca-config.json \
  -profile=kubernetes \
  proxy-client-csr.json | cfssljson -bare proxy-client
# 查看
$ ls -1 proxy-client*
proxy-client.csr
proxy-client-csr.json
proxy-client-key.pem
proxy-client.pem
```

### 2.10、分发客户端、服务端证书

#### 分发worker节点需要的证书和私钥

```bash
$ WORKERS=(emon2 emon3)
for instance in ${WORKERS[@]}; do
  scp ca.pem ${instance}-key.pem ${instance}.pem root@${instance}:~/
done
```

#### 分发master节点需要的证书和私钥

> 注意：由于下面分发的证书即包含了etcd的证书也包含了k8s主节点的证书。 所以 MASTER_IPS 中必须包含所有 `master` 节点以及 `etcd` 节点。如果没有包含所有etcd节点的证书，需要重新定义，逗号分隔

```bash
$ MASTER_IPS=192.168.32.116,192.168.32.117,192.168.32.118
OIFS=$IFS
IFS=','
for instance in ${MASTER_IPS}; do
  scp ca.pem ca-key.pem kubernetes-key.pem kubernetes.pem \
    service-account-key.pem service-account.pem proxy-client.pem proxy-client-key.pem root@${instance}:~/
done
IFS=$OIFS
```

## 3、kubernetes各组件的认证配置（仅中转节点）

>  当前位置：emon主机

kubernetes的认证配置文件，也叫kubeconfigs，用于让kubernetes的客户端定位kube-apiserver并通过apiserver的安全认证。

接下来我们一起来生成各个组件的kubeconfigs，包括controller-manager，kubelet，kube-proxy，scheduler，以及admin用户。

以下命令需要与上一节“生成证书”在同一个目录下执行。

### 3.0、切换目录

```bash
$ cd
$ mkdir -pv k8s_soft/k8s_v1.20.2 && cd k8s_soft/k8s_v1.20.2
```

### 3.1、kubelet

```bash
# 指定你的worker列表（hostname），空格分隔
$ WORKERS="emon2 emon3"
$ for instance in ${WORKERS}; do
  kubectl config set-cluster kubernetes \
    --certificate-authority=ca.pem \
    --embed-certs=true \
    --server=https://127.0.0.1:6443 \
    --kubeconfig=${instance}.kubeconfig

  kubectl config set-credentials system:node:${instance} \
    --client-certificate=${instance}.pem \
    --client-key=${instance}-key.pem \
    --embed-certs=true \
    --kubeconfig=${instance}.kubeconfig

  kubectl config set-context default \
    --cluster=kubernetes \
    --user=system:node:${instance} \
    --kubeconfig=${instance}.kubeconfig

  kubectl config use-context default --kubeconfig=${instance}.kubeconfig
done
# 查看
$ ls -1tr|tail -n 2
emon2.kubeconfig
emon3.kubeconfig
```

### 3.2、kube-proxy

```bash
kubectl config set-cluster kubernetes \
    --certificate-authority=ca.pem \
    --embed-certs=true \
    --server=https://127.0.0.1:6443 \
    --kubeconfig=kube-proxy.kubeconfig

kubectl config set-credentials system:kube-proxy \
   --client-certificate=kube-proxy.pem \
   --client-key=kube-proxy-key.pem \
   --embed-certs=true \
   --kubeconfig=kube-proxy.kubeconfig

kubectl config set-context default \
   --cluster=kubernetes \
   --user=system:kube-proxy \
   --kubeconfig=kube-proxy.kubeconfig

kubectl config use-context default --kubeconfig=kube-proxy.kubeconfig
# 查看
$ ls -1tr|tail -n 1
kube-proxy.kubeconfig
```

### 3.3、kube-controller-manager

```bash
kubectl config set-cluster kubernetes \
  --certificate-authority=ca.pem \
  --embed-certs=true \
  --server=https://127.0.0.1:6443 \
  --kubeconfig=kube-controller-manager.kubeconfig

kubectl config set-credentials system:kube-controller-manager \
  --client-certificate=kube-controller-manager.pem \
  --client-key=kube-controller-manager-key.pem \
  --embed-certs=true \
  --kubeconfig=kube-controller-manager.kubeconfig

kubectl config set-context default \
  --cluster=kubernetes \
  --user=system:kube-controller-manager \
  --kubeconfig=kube-controller-manager.kubeconfig

kubectl config use-context default --kubeconfig=kube-controller-manager.kubeconfig
# 查看
$ ls -1tr|tail -n 1
kube-controller-manager.kubeconfig
```

### 3.4、kube-scheduler

```bash
kubectl config set-cluster kubernetes \
  --certificate-authority=ca.pem \
  --embed-certs=true \
  --server=https://127.0.0.1:6443 \
  --kubeconfig=kube-scheduler.kubeconfig

kubectl config set-credentials system:kube-scheduler \
  --client-certificate=kube-scheduler.pem \
  --client-key=kube-scheduler-key.pem \
  --embed-certs=true \
  --kubeconfig=kube-scheduler.kubeconfig

kubectl config set-context default \
  --cluster=kubernetes \
  --user=system:kube-scheduler \
  --kubeconfig=kube-scheduler.kubeconfig

kubectl config use-context default --kubeconfig=kube-scheduler.kubeconfig
# 查看
ls -1tr|tail -n 1
kube-scheduler.kubeconfig
```

### 3.5、admin用户配置

为admin用户生成kubeconfig配置

```bash
kubectl config set-cluster kubernetes \
  --certificate-authority=ca.pem \
  --embed-certs=true \
  --server=https://127.0.0.1:6443 \
  --kubeconfig=admin.kubeconfig

kubectl config set-credentials admin \
  --client-certificate=admin.pem \
  --client-key=admin-key.pem \
  --embed-certs=true \
  --kubeconfig=admin.kubeconfig

kubectl config set-context default \
  --cluster=kubernetes \
  --user=admin \
  --kubeconfig=admin.kubeconfig

kubectl config use-context default --kubeconfig=admin.kubeconfig
# 查看
$ ls -1tr|tail -n 1
admin.kubeconfig
```

### 3.6、分发配置文件

#### 3.6.1、把kubelet和kube-proxy需要的kubeconfig配置分发到每个worker节点

```bash
$ WORKERS="emon2 emon3"
for instance in ${WORKERS}; do
    scp ${instance}.kubeconfig kube-proxy.kubeconfig ${instance}:~/
done
```

#### 3.6.2、把kube-controller-manager和kube-scheduler需要的kubeconfig配置分发到master节点

```bash
$ MASTERS="emon emon2"
for instance in ${MASTERS}; do
    scp admin.kubeconfig kube-controller-manager.kubeconfig kube-scheduler.kubeconfig ${instance}:~/
done
```

## 4、部署ETCD集群（所有节点）

Kubernetes组件是无状态的，并在etcd中存储集群状态。 在本小节中，我们将部署三个节点的etcd群集，并对其进行配置以实现高可用性和安全的远程访问。

### 4.0、切换目录

```bash
$ cd
```

### 4.1、配置etcd

- copy必要的证书文件

```bash
$ mkdir -p /etc/etcd /var/lib/etcd
$ chmod 700 /var/lib/etcd
$ cp ca.pem kubernetes-key.pem kubernetes.pem /etc/etcd/
```

- 配置etcd.service文件

```bash
$ ETCD_NAME=$(hostname -s)
$ ETCD_IP=192.168.32.116 # IP地址替换为具体节点IP地址
# etcd所有节点的ip地址
$ ETCD_NAMES=(emon emon2 emon3)
$ ETCD_IPS=(192.168.32.116 192.168.32.117 192.168.32.118)
$ cat <<EOF > /etc/systemd/system/etcd.service
[Unit]
Description=etcd
Documentation=https://github.com/coreos

[Service]
Type=notify
ExecStart=/usr/local/bin/etcd \\
  --name ${ETCD_NAME} \\
  --cert-file=/etc/etcd/kubernetes.pem \\
  --key-file=/etc/etcd/kubernetes-key.pem \\
  --peer-cert-file=/etc/etcd/kubernetes.pem \\
  --peer-key-file=/etc/etcd/kubernetes-key.pem \\
  --trusted-ca-file=/etc/etcd/ca.pem \\
  --peer-trusted-ca-file=/etc/etcd/ca.pem \\
  --peer-client-cert-auth \\
  --client-cert-auth \\
  --initial-advertise-peer-urls https://${ETCD_IP}:2380 \\
  --listen-peer-urls https://${ETCD_IP}:2380 \\
  --listen-client-urls https://${ETCD_IP}:2379,https://127.0.0.1:2379 \\
  --advertise-client-urls https://${ETCD_IP}:2379 \\
  --initial-cluster-token etcd-cluster-0 \\
  --initial-cluster ${ETCD_NAMES[0]}=https://${ETCD_IPS[0]}:2380,${ETCD_NAMES[1]}=https://${ETCD_IPS[1]}:2380,${ETCD_NAMES[2]}=https://${ETCD_IPS[2]}:2380 \\
  --initial-cluster-state new \\
  --data-dir=/var/lib/etcd
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

### 4.2、启动etcd集群

所有etcd节点都配置好etcd.service后，启动etcd集群

```bash
# 注意：碰到卡主不要怕，所有节点都执行如下命令后，就连通了；卡是为了等待其他节点加入
$ systemctl daemon-reload && systemctl enable etcd && systemctl restart etcd
```

### 4.3、验证etcd集群

```bash
$ ETCDCTL_API=3 etcdctl member list \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/etcd/ca.pem \
  --cert=/etc/etcd/kubernetes.pem \
  --key=/etc/etcd/kubernetes-key.pem
# 命令行输出结果
3bae6ef756268744, started, emon2, https://192.168.32.117:2380, https://192.168.32.117:2379, false
48fd167b46c04497, started, emon3, https://192.168.32.118:2380, https://192.168.32.118:2379, false
7d04ddf76c096e96, started, emon, https://192.168.32.116:2380, https://192.168.32.116:2379, false
```



## 5、部署kubernetes控制平面（所有master节点）

这部分我们部署kubernetes的控制平面，每个组件有多个点保证高可用。实例中我们在两个节点上部署 API Server、Scheduler 和 Controller Manager。当然你也可以按照教程部署三个节点的高可用，操作都是一致的。

> 下面的所有命令都是运行在每个master节点的，我们的实例中是 emon 和 emon2

性和安全的远程访问。

### 5.0、切换目录

```bash
$ cd
```

### 5.1、配置API Server

```bash
# 创建kubernetes必要目录
$ mkdir -p /etc/kubernetes/ssl
# 准备证书文件
$ cp ca.pem ca-key.pem kubernetes-key.pem kubernetes.pem \
    service-account-key.pem service-account.pem \
    proxy-client.pem proxy-client-key.pem \
    /etc/kubernetes/ssl/

# 配置kube-apiserver.service
# 本机内网ip
$ IP=192.168.32.116 # IP地址替换为具体节点IP地址
# apiserver实例数
$ APISERVER_COUNT=2
# etcd节点
$ ETCD_ENDPOINTS=(192.168.32.116 192.168.32.117 192.168.32.118)
# 创建 apiserver service
$ cat <<EOF > /etc/systemd/system/kube-apiserver.service
[Unit]
Description=Kubernetes API Server
Documentation=https://github.com/kubernetes/kubernetes

[Service]
ExecStart=/usr/local/bin/kube-apiserver \\
  --advertise-address=${IP} \\
  --allow-privileged=true \\
  --apiserver-count=${APISERVER_COUNT} \\
  --audit-log-maxage=30 \\
  --audit-log-maxbackup=3 \\
  --audit-log-maxsize=100 \\
  --audit-log-path=/var/log/audit.log \\
  --authorization-mode=Node,RBAC \\
  --bind-address=0.0.0.0 \\
  --client-ca-file=/etc/kubernetes/ssl/ca.pem \\
  --enable-admission-plugins=NamespaceLifecycle,NodeRestriction,LimitRanger,ServiceAccount,DefaultStorageClass,ResourceQuota \\
  --etcd-cafile=/etc/kubernetes/ssl/ca.pem \\
  --etcd-certfile=/etc/kubernetes/ssl/kubernetes.pem \\
  --etcd-keyfile=/etc/kubernetes/ssl/kubernetes-key.pem \\
  --etcd-servers=https://${ETCD_ENDPOINTS[0]}:2379,https://${ETCD_ENDPOINTS[1]}:2379,https://${ETCD_ENDPOINTS[2]}:2379 \\
  --event-ttl=1h \\
  --kubelet-certificate-authority=/etc/kubernetes/ssl/ca.pem \\
  --kubelet-client-certificate=/etc/kubernetes/ssl/kubernetes.pem \\
  --kubelet-client-key=/etc/kubernetes/ssl/kubernetes-key.pem \\
  --service-account-issuer=api \\
  --service-account-key-file=/etc/kubernetes/ssl/service-account.pem \\
  --service-account-signing-key-file=/etc/kubernetes/ssl/service-account-key.pem \\
  --api-audiences=api,vault,factors \\
  --service-cluster-ip-range=10.233.0.0/16 \\
  --service-node-port-range=30000-32767 \\
  --proxy-client-cert-file=/etc/kubernetes/ssl/proxy-client.pem \\
  --proxy-client-key-file=/etc/kubernetes/ssl/proxy-client-key.pem \\
  --runtime-config=api/all=true \\
  --requestheader-client-ca-file=/etc/kubernetes/ssl/ca.pem \\
  --requestheader-allowed-names=aggregator \\
  --requestheader-extra-headers-prefix=X-Remote-Extra- \\
  --requestheader-group-headers=X-Remote-Group \\
  --requestheader-username-headers=X-Remote-User \\
  --tls-cert-file=/etc/kubernetes/ssl/kubernetes.pem \\
  --tls-private-key-file=/etc/kubernetes/ssl/kubernetes-key.pem \\
  --v=1
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```



### 5.2、配置kube-controller-manager

```bash
# 准备kubeconfig配置文件
$ cp kube-controller-manager.kubeconfig /etc/kubernetes/

# 创建 kube-controller-manager.service
$ cat <<EOF > /etc/systemd/system/kube-controller-manager.service
[Unit]
Description=Kubernetes Controller Manager
Documentation=https://github.com/kubernetes/kubernetes

[Service]
ExecStart=/usr/local/bin/kube-controller-manager \\
  --bind-address=0.0.0.0 \\
  --cluster-cidr=10.200.0.0/16 \\
  --cluster-name=kubernetes \\
  --cluster-signing-cert-file=/etc/kubernetes/ssl/ca.pem \\
  --cluster-signing-key-file=/etc/kubernetes/ssl/ca-key.pem \\
  --cluster-signing-duration=876000h0m0s \\
  --kubeconfig=/etc/kubernetes/kube-controller-manager.kubeconfig \\
  --leader-elect=true \\
  --root-ca-file=/etc/kubernetes/ssl/ca.pem \\
  --service-account-private-key-file=/etc/kubernetes/ssl/service-account-key.pem \\
  --service-cluster-ip-range=10.233.0.0/16 \\
  --use-service-account-credentials=true \\
  --v=1
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

### 5.3、配置kube-scheduler

```bash
# 准备kubeconfig配置文件
$ cp kube-scheduler.kubeconfig /etc/kubernetes/

# 创建 scheduler service 文件
$ cat <<EOF > /etc/systemd/system/kube-scheduler.service
[Unit]
Description=Kubernetes Scheduler
Documentation=https://github.com/kubernetes/kubernetes

[Service]
ExecStart=/usr/local/bin/kube-scheduler \\
  --authentication-kubeconfig=/etc/kubernetes/kube-scheduler.kubeconfig \\
  --authorization-kubeconfig=/etc/kubernetes/kube-scheduler.kubeconfig \\
  --kubeconfig=/etc/kubernetes/kube-scheduler.kubeconfig \\
  --leader-elect=true \\
  --bind-address=0.0.0.0 \\
  --port=0 \\
  --v=1
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

### 5.4、启动服务

```bash
$ systemctl daemon-reload && systemctl enable kube-apiserver kube-controller-manager kube-scheduler
$ systemctl restart kube-apiserver kube-controller-manager kube-scheduler
```

### 5.5、服务验证

端口验证

```bash
# 各个组件的监听端口
$ netstat -tnlp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      17094/master        
tcp        0      0 192.168.32.116:2379    0.0.0.0:*               LISTEN      61298/etcd          
tcp        0      0 127.0.0.1:2379          0.0.0.0:*               LISTEN      61298/etcd          
tcp        0      0 192.168.32.116:2380    0.0.0.0:*               LISTEN      61298/etcd          
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      9808/sshd           
tcp6       0      0 ::1:25                  :::*                    LISTEN      17094/master        
tcp6       0      0 :::6443                 :::*                    LISTEN      61426/kube-apiserve 
tcp6       0      0 :::10252                :::*                    LISTEN      61444/kube-controll 
tcp6       0      0 :::10257                :::*                    LISTEN      61444/kube-controll 
tcp6       0      0 :::10259                :::*                    LISTEN      61457/kube-schedule 
tcp6       0      0 :::22                   :::*                    LISTEN      9808/sshd 
```



系统日志验证

```bash
# 查看系统日志是否有组件的错误日志
$ journalctl -f
```

### 5.6、配置kubectl（emon这个master节点即可）

kubectl是用来管理kubernetes集群的客户端工具，前面我们已经下载到了所有的master节点。下面我们来配置这个工具，让它可以使用。

```bash
# 创建kubectl的配置目录
$ mkdir ~/.kube/
# 把管理员的配置文件移动到kubectl的默认目录
$ cp ~/admin.kubeconfig ~/.kube/config
# 测试
$ kubectl get nodes
# 命令行输出结果：目前，正常！
No resources found
```

在执行 kubectl exec、run、logs 等命令时，apiserver 会转发到 kubelet。这里定义 RBAC 规则，授权 apiserver 调用 kubelet API。

```bash
$ kubectl create clusterrolebinding kube-apiserver:kubelet-apis --clusterrole=system:kubelet-api-admin --user kubernetes
```



## 6、部署kubernetes工作节点（所有worker节点）

这部分我们部署kubernetes的工作节点。实例中我们有两个工作节点，一个是独立的工作节点，一个是跟master在一起的节点。
在每个节点上我们会部署kubelet、kube-proxy、container runtime、cni、nginx-proxy

### 6.0、切换目录（仅中转节点）

```bash
$ cd
$ mkdir -pv k8s_soft/k8s_v1.20.2 && cd k8s_soft/k8s_v1.20.2
```

### 6.1、Container Runtime - Containerd

#### 6.1.1、软件包下载（仅中转节点）

```bash
# 设定containerd的版本号，分发到两个work节点
$ VERSION=1.4.3
WORKERS="emon2 emon3"
for instance in ${WORKERS}; do
    scp cri-containerd-cni-${VERSION}-linux-amd64.tar.gz ${instance}:~/
done
```

#### 6.1.2、整理压缩文件

下载后的文件是一个tar.gz，是一个allinone的包，包括了runc、circtl、ctr、containerd等容器运行时以及cni相关的文件，解压缩到一个独立的目录中

```bash
$ VERSION=1.4.3
# 创建解压目录
$ mkdir containerd
# 解压缩
$ tar -zxvf cri-containerd-cni-${VERSION}-linux-amd64.tar.gz -C containerd
# 复制需要的文件
$ cp containerd/etc/crictl.yaml /etc/
$ cp containerd/etc/systemd/system/containerd.service /etc/systemd/system/
$ cp -r containerd/usr /
```

#### 6.1.3、containerd配置文件

```bash
$ mkdir -p /etc/containerd
# 默认配置生成配置文件
$ containerd config default > /etc/containerd/config.toml

# 定制化配置（可选）
# 创建镜像目录
$ mkdir /usr/local/lib/containerd
$ vi /etc/containerd/config.toml
```

修改默认镜像目录（非必须）【忽略】

```bash
# 调整config.toml配置
root = "/var/lib/containerd" ==> root = "/usr/local/lib/containerd"
```

#### 6.1.4、启动containerd

```bash
$ systemctl enable containerd && systemctl restart containerd
# 检查状态
$ systemctl status containerd
```

#### 6.1.5、配置镜像加速器（已验证）

https://help.aliyun.com/document_detail/60750.html

```bash
# 备份源文件 
$ cp /etc/containerd/config.toml /etc/containerd/config.toml.bak
# 修改配置文件：搜索 registry，调整如下
$ vim /etc/containerd/config.toml
```

```toml
    [plugins."io.containerd.grpc.v1.cri".registry]
      [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
          #endpoint = ["https://registry-1.docker.io"]
          endpoint = ["https://pyk8pf3k.mirror.aliyuncs.com"]
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."192.168.32.116:5080"]
          endpoint = ["https://192.168.32.116:5443"]
      [plugins."io.containerd.grpc.v1.cri".registry.configs]
        [plugins."io.containerd.grpc.v1.cri".registry.configs."192.168.32.116:5443".tls]
          insecure_skip_verify = true
        [plugins."io.containerd.grpc.v1.cri".registry.configs."192.168.32.116:5443".auth]
          username = "admin"
          password = "Harbor12345"
```

- 重启k8s使配置生效

```bash
systemctl restart containerd
```



### 6.2、配置kubelet

#### 准备kubelet配置

```bash
$ mkdir -p /etc/kubernetes/ssl/
$ cp ${HOSTNAME}-key.pem ${HOSTNAME}.pem ca.pem ca-key.pem /etc/kubernetes/ssl/
$ cp ${HOSTNAME}.kubeconfig /etc/kubernetes/kubeconfig
$ IP=192.168.32.117 # IP地址替换为具体节点IP地址
# 写入kubelet配置文件
$ cat <<EOF > /etc/kubernetes/kubelet-config.yaml
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    enabled: true
  x509:
    clientCAFile: "/etc/kubernetes/ssl/ca.pem"
authorization:
  mode: Webhook
clusterDomain: "cluster.local"
clusterDNS:
  - "169.254.25.10"
podCIDR: "10.200.0.0/16"
address: ${IP}
readOnlyPort: 0
staticPodPath: /etc/kubernetes/manifests
healthzPort: 10248
healthzBindAddress: 127.0.0.1
kubeletCgroups: /systemd/system.slice
resolvConf: "/etc/resolv.conf"
runtimeRequestTimeout: "15m"
kubeReserved:
  cpu: 200m
  memory: 512M
tlsCertFile: "/etc/kubernetes/ssl/${HOSTNAME}.pem"
tlsPrivateKeyFile: "/etc/kubernetes/ssl/${HOSTNAME}-key.pem"
EOF
```

#### 配置kubelet服务

```bash
$ cat <<EOF > /etc/systemd/system/kubelet.service
[Unit]
Description=Kubernetes Kubelet
Documentation=https://github.com/kubernetes/kubernetes
After=containerd.service
Requires=containerd.service

[Service]
ExecStart=/usr/local/bin/kubelet \\
  --config=/etc/kubernetes/kubelet-config.yaml \\
  --container-runtime=remote \\
  --container-runtime-endpoint=unix:///var/run/containerd/containerd.sock \\
  --image-pull-progress-deadline=2m \\
  --kubeconfig=/etc/kubernetes/kubeconfig \\
  --network-plugin=cni \\
  --node-ip=${IP} \\
  --register-node=true \\
  --v=2
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```



### 6.3、配置nginx-proxy（仅在没有apiserver的节点部署：这里emon3）

nginx-proxy是一个用于worker节点访问apiserver的一个代理，是apiserver一个优雅的高可用方案，它使用kubelet的staticpod方式启动，让每个节点都可以均衡的访问到每个apiserver服务，优雅的替代了通过虚拟ip访问apiserver的方式。

> Tips: nginx-proxy 只需要在没有 apiserver 的节点部署哦~

#### 6.3.1、nginx配置文件

```bash
$ mkdir -p /etc/nginx
# master ip列表
$ MASTER_IPS=(192.168.32.116 192.168.32.117)
# 执行前请先copy一份，并修改好upstream的 'server' 部分配置
$ cat <<EOF > /etc/nginx/nginx.conf
error_log stderr notice;

worker_processes 2;
worker_rlimit_nofile 130048;
worker_shutdown_timeout 10s;

events {
  multi_accept on;
  use epoll;
  worker_connections 16384;
}

stream {
  upstream kube_apiserver {
    least_conn;
    # 如果有多个master，依次配置即可
    server ${MASTER_IPS[0]}:6443;
    server ${MASTER_IPS[1]}:6443;
  }

  server {
    listen        127.0.0.1:6443;
    proxy_pass    kube_apiserver;
    proxy_timeout 10m;
    proxy_connect_timeout 1s;
  }
}

http {
  aio threads;
  aio_write on;
  tcp_nopush on;
  tcp_nodelay on;

  keepalive_timeout 5m;
  keepalive_requests 100;
  reset_timedout_connection on;
  server_tokens off;
  autoindex off;

  server {
    listen 8081;
    location /healthz {
      access_log off;
      return 200;
    }
    location /stub_status {
      stub_status on;
      access_log off;
    }
  }
}
EOF
```

#### 6.3.2、nginx manifest

```bash
# 【特殊】：该文件夹在emon2也需要创建，nginx-proxy.yaml不需要
$ mkdir -p /etc/kubernetes/manifests/
$ cat <<EOF > /etc/kubernetes/manifests/nginx-proxy.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-proxy
  namespace: kube-system
  labels:
    addonmanager.kubernetes.io/mode: Reconcile
    k8s-app: kube-nginx
spec:
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
  nodeSelector:
    kubernetes.io/os: linux
  priorityClassName: system-node-critical
  containers:
  - name: nginx-proxy
    image: docker.io/library/nginx:1.19
    imagePullPolicy: IfNotPresent
    resources:
      requests:
        cpu: 25m
        memory: 32M
    securityContext:
      privileged: true
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8081
    readinessProbe:
      httpGet:
        path: /healthz
        port: 8081
    volumeMounts:
    - mountPath: /etc/nginx
      name: etc-nginx
      readOnly: true
  volumes:
  - name: etc-nginx
    hostPath:
      path: /etc/nginx
EOF
```



### 6.4、配置kube-proxy

#### 6.4.1、配置文件

```bash
$ mv kube-proxy.kubeconfig /etc/kubernetes/
# 创建 kube-proxy-config.yaml
$ cat <<EOF > /etc/kubernetes/kube-proxy-config.yaml
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
bindAddress: 0.0.0.0
clientConnection:
  kubeconfig: "/etc/kubernetes/kube-proxy.kubeconfig"
clusterCIDR: "10.200.0.0/16"
mode: ipvs
EOF
```

#### 6.4.2、kube-proxy服务文件

```bash
$ cat <<EOF > /etc/systemd/system/kube-proxy.service
[Unit]
Description=Kubernetes Kube Proxy
Documentation=https://github.com/kubernetes/kubernetes

[Service]
ExecStart=/usr/local/bin/kube-proxy \\
  --config=/etc/kubernetes/kube-proxy-config.yaml
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

### 6.5、启动服务

```bash
# 【特殊】：emon2不需要，仅在emon3节点非常推荐先pull下nginx镜像：crictl pull docker.io/library/nginx:1.19  再启动
$ crictl pull docker.io/library/nginx:1.19

# 在emon2和emon3节点，非常推荐先pull下pause镜像，再启动；pause镜像pull方法参见下面！！！
$ crictl pull registry.cn-hangzhou.aliyuncs.com/kubernetes-kubespray/pause:3.2
$ ctr -n k8s.io i tag  registry.cn-hangzhou.aliyuncs.com/kubernetes-kubespray/pause:3.2 k8s.gcr.io/pause:3.2

$ systemctl daemon-reload && systemctl enable kubelet kube-proxy
$ systemctl restart kubelet kube-proxy
$ journalctl -f -u kubelet
$ journalctl -f -u kube-proxy

# 截止目前结果：crictl ps emon3仅有nginx启动，emon2并无容器启动。
```

> 特殊说明：以下是个人记录的问题，后来优化了镜像拉取提前，启动后5秒之内就正常了，不再有如下2个问题！！！切记！！！
>
> 
>
> journalctl -f -u kubelet
>
> 问题一、
>
> emon2节点报错： Unable to read config path "/etc/kubernetes/manifests"
>
> 创建目录即可：mkdir -p /etc/kubernetes/manifests/
>
> 问题2、
>
> emon3节点报错：kubelet.go:2243] node "emon3" not found
>
> 命令crictl images 发现，由于镜像 pause:3.2 尚未下载启动，等待即可！
>
> 经验之谈！！！
>
> 手工下载：
>
> crictl pull docker.io/library/nginx:1.19
>
> 此时在emon3节点，看到的还是报错信息，不着急，如果网络没问题，等待接近10分钟，会发现如下：
>
> ```tex
> 4月 01 17:27:56 emon3 kubelet[60611]: E0401 17:27:56.859842   60611 kubelet.go:2243] node "emon3" not found
> 4月 01 17:27:56 emon3 kubelet[60611]: E0401 17:27:56.959939   60611 kubelet.go:2243] node "emon3" not found
> 4月 01 17:27:57 emon3 kubelet[60611]: E0401 17:27:57.060894   60611 kubelet.go:2243] node "emon3" not found
> 4月 01 17:27:59 emon3 kubelet[60611]: I0401 17:27:59.174140   60611 setters.go:86] Using node IP: "192.168.32.118"
> 4月 01 17:28:00 emon3 kubelet[60611]: E0401 17:28:00.488025   60611 kubelet.go:2163] Container runtime network not ready: NetworkReady=false reason:NetworkPluginNotReady message:Network plugin returns error: cni plugin not initialized
> 4月 01 17:28:05 emon3 kubelet[60611]: I0401 17:28:05.318879   60611 kubelet_getters.go:176] "Pod status updated" pod="kube-system/nginx-proxy-emon3" status=Running
> 4月 01 17:28:05 emon3 kubelet[60611]: E0401 17:28:05.489211   60611 kubelet.go:2163] Container runtime network not ready: NetworkReady=false reason:NetworkPluginNotReady message:Network plugin returns error: cni plugin not initialized
> 4月 01 17:28:09 emon3 kubelet[60611]: I0401 17:28:09.178972   60611 setters.go:86] Using node IP: "192.168.32.118"
> 4月 01 17:28:10 emon3 kubelet[60611]: E0401 17:28:10.490192   60611 kubelet.go:2163] Container runtime network not ready: NetworkReady=false reason:NetworkPluginNotReady message:Network plugin returns error: cni plugin not initialized
> 4月 01 17:28:15 emon3 kubelet[60611]: E0401 17:28:15.491678   60611 kubelet.go:2163] Container runtime network not ready: NetworkReady=false reason:NetworkPluginNotReady message:Network plugin returns error: cni plugin not initialized
> 4月 01 17:28:19 emon3 kubelet[60611]: I0401 17:28:19.182519   60611 setters.go:86] Using node IP: "192.168.32.118"
> 4月 01 17:28:20 emon3 kubelet[60611]: E0401 17:28:20.493213   60611 kubelet.go:2163] Container runtime network not ready: NetworkReady=false reason:NetworkPluginNotReady message:Network plugin returns error: cni plugin not initialized
> ```
>
> OK了，从头部署了3遍，都碰到该问题了，第三次发现在执行了命令：`modprobe -r br_netfilter`后或者重启系统了，该模块都不会重新加载，导致：
> sysctl -p /etc/sysctl.d/kubernetes.conf 失败。
>
> 在第三遍时，解决了该问题。部署到这一步时还是提示 node "emon3" not found，瞬间绝望！！！
>
> 抱着算了，先继续往下看视频，继续学习的想法时，过了约莫10分钟，发现OK了，然后：`crictl ps`看到启动了一个容器，6443接口被监听了！！！
>
> 真真是，唉！
>
> 学习，需要细心，也需要耐心！！！2022年04月01日，愚人节快乐！搞了前后3天，才碰巧搞定的问题，记录下！！！

### 6.6、手动下载镜像（服务器无法访问外网情况）（本安装教程已经提前下载镜像）

在每个工作节点下载pause镜像，为后面打基础！！！

```bash
$ crictl pull registry.cn-hangzhou.aliyuncs.com/kubernetes-kubespray/pause:3.2
$ ctr -n k8s.io i tag  registry.cn-hangzhou.aliyuncs.com/kubernetes-kubespray/pause:3.2 k8s.gcr.io/pause:3.2
```



## 7、网络插件-Calico（在主节点emon）

### 7.0、切换目录

```bash
$ cd
$ mkdir -pv k8s_soft/k8s_v1.20.2 && cd k8s_soft/k8s_v1.20.2
```

这部分我们部署kubernetes的网络查件 CNI。

文档地址：https://docs.projectcalico.org/getting-started/kubernetes/self-managed-onprem/onpremises

### 7.1、下载文件说明

文档中有两个配置，50以下节点和50以上节点，它们的主要区别在于这个：typha。
当节点数比较多的情况下，Calico 的 Felix组件可通过 Typha 直接和 Etcd 进行数据交互，不通过 kube-apiserver，降低kube-apiserver的压力。大家根据自己的实际情况选择下载。
下载后的文件是一个all-in-one的yaml文件，我们只需要在此基础上做少许修改即可。

```bash
# 下载calico.yaml文件
$ curl https://projectcalico.docs.tigera.io/manifests/calico.yaml -O
```

### 7.2、修改IP自动发现

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

### 7.3、修改CIDR

修改前：

```bash
# - name: CALICO_IPV4POOL_CIDR
#   value: "192.168.0.0/16"
```

修改后（修改成你自己的value，我这里是10.200.0.0/16）

```bash
- name: CALICO_IPV4POOL_CIDR
  value: "10.200.0.0/16"
```

### 7.4、使之生效

```bash
# 生效之前查看
$ kubectl get nodes
NAME    STATUS     ROLES    AGE     VERSION
emon2   NotReady   <none>   5m39s   v1.20.2
emon3   NotReady   <none>   5m35s   v1.20.2
# 使之生效
$ kubectl apply -f calico.yaml
# 查看node
$ kubectl get nodes
NAME    STATUS     ROLES    AGE     VERSION
emon2   NotReady   <none>   4h52m   v1.20.2
emon3   NotReady   <none>   4h44m   v1.20.2
# 查看pod信息
$ kubectl get po -n kube-system
NAME                                       READY   STATUS     RESTARTS   AGE
calico-kube-controllers-858c9597c8-lm45b   0/1     Pending    0          42s
calico-node-cnt7b                          0/1     Init:0/3   0          42s
calico-node-l7xgf                          0/1     Init:0/3   0          42s
nginx-proxy-emon3                          1/1     Running    0          4h44m
# ===================================================================================================
# 过几分钟再次查看
$ kubectl get po -n kube-system
NAME                                       READY   STATUS    RESTARTS   AGE
calico-kube-controllers-858c9597c8-lm45b   1/1     Running   0          3m32s
calico-node-cnt7b                          1/1     Running   0          3m32s
calico-node-l7xgf                          1/1     Running   0          3m32s
nginx-proxy-emon3                          1/1     Running   0          4h47m
# 再次查看node
$ kubectl get nodes
NAME    STATUS   ROLES    AGE     VERSION
emon2   Ready    <none>   4h56m   v1.20.2
emon3   Ready    <none>   4h48m   v1.20.2
```



## 8、DNS插件-CoreDNS（在主节点emon）

这部分我们部署kubernetes的DNS插件 - CoreDNS。

在早期的版本中dns组件以pod形式独立运行，为集群提供dns服务，所有的pod都会请求同一个dns服务。
从kubernetes 1.18版本开始NodeLocal DnsCache功能进入stable状态。
NodeLocal DNSCache通过daemon-set的形式运行在每个工作节点，作为节点上pod的dns缓存代理，从而避免了iptables的DNAT规则和connection tracking。极大提升了dns的性能。

### 8.0、切换目录

```bash
$ cd
$ mkdir -pv k8s_soft/k8s_v1.20.2 && cd k8s_soft/k8s_v1.20.2
```

### 8.1、部署CoreDNS

```bash
# 设置 coredns 的 cluster-ip
$ COREDNS_CLUSTER_IP=10.233.0.10
# 下载coredns配置all-in-one（addons/coredns.yaml）：参考下面的 coredns.yaml文件
$ vim coredns.yaml
# 替换cluster-ip
$ sed -i "s/\${COREDNS_CLUSTER_IP}/${COREDNS_CLUSTER_IP}/g" coredns.yaml
# 创建 coredns
$ kubectl apply -f coredns.yaml
# 查看pod
$ kubectl get po -n kube-system
```



### 8.2、部署NodeLocal DNSCache

```bash
# 设置 coredns 的 cluster-ip
$ COREDNS_CLUSTER_IP=10.233.0.10
# 下载nodelocaldns配置all-in-one(addons/nodelocaldns.yaml)：参考下面的 nodelocaldns.yaml文件
$ vim nodelocaldns.yaml
# 替换cluster-ip
$ sed -i "s/\${COREDNS_CLUSTER_IP}/${COREDNS_CLUSTER_IP}/g" nodelocaldns.yaml
# 创建 nodelocaldns
$ kubectl apply -f nodelocaldns.yaml
# 查看pod
$ kubectl get po -n kube-system
```



### 8.3、验证

```bash
# 查看pod信息
$ kubectl get po -n kube-system
NAME                                       READY   STATUS    RESTARTS   AGE
calico-kube-controllers-858c9597c8-vdc7n   1/1     Running   0          6m57s
calico-node-4qz8m                          1/1     Running   0          6m57s
calico-node-q5x6w                          1/1     Running   0          6m57s
coredns-84646c885d-ghjsk                   1/1     Running   0          116s
coredns-84646c885d-plqbz                   1/1     Running   0          116s
nginx-proxy-emon3                          1/1     Running   0          12m
nodelocaldns-72nns                         1/1     Running   0          62s
nodelocaldns-n6fqj                         1/1     Running   0          62s

# 此时，emon2启动的容器如下：
$ crictl ps
CONTAINER           IMAGE               CREATED             STATE               NAME                ATTEMPT             POD ID
c48922e60a868       90f9d984ec9a3       4 minutes ago       Running             node-cache          0                   5ed3cb8b8d249
54c7c7c3ad922       67da37a9a360e       5 minutes ago       Running             coredns             0                   33d271c6a6f5b
95f0d92df2c56       7a71aca7b60fc       9 minutes ago       Running             calico-node         0                   75a971d7d731d
# 此时，emon3启动的容器如下：
$ crictl ps
CONTAINER           IMAGE               CREATED             STATE               NAME                      ATTEMPT             POD ID
af46c12946807       90f9d984ec9a3       4 minutes ago       Running             node-cache                0                   a9de1d50e76d1
4a58b042b9887       67da37a9a360e       5 minutes ago       Running             coredns                   0                   0202b404f9e97
cd668919ab62b       c0c6672a66a59       9 minutes ago       Running             calico-kube-controllers   0                   f1a7cbc5c54c5
28ae265580655       7a71aca7b60fc       9 minutes ago       Running             calico-node               0                   1f0c2fc445512
acb35f522c6d6       f0b8a9a541369       17 minutes ago      Running             nginx-proxy               0                   0c96cb3f33875
```

- 其他验证

```bash
# 查看pod分布详情
$ kubectl get po -n kube-system -o wide
NAME                                       READY   STATUS    RESTARTS   AGE   IP                NODE    NOMINATED NODE   READINESS GATES
calico-kube-controllers-858c9597c8-vdc7n   1/1     Running   0          16m   10.200.161.1      emon3   <none>           <none>
calico-node-4qz8m                          1/1     Running   0          16m   192.168.32.117   emon2   <none>           <none>
calico-node-q5x6w                          1/1     Running   0          16m   192.168.32.118   emon3   <none>           <none>
coredns-84646c885d-ghjsk                   1/1     Running   0          11m   10.200.161.2      emon3   <none>           <none>
coredns-84646c885d-plqbz                   1/1     Running   0          11m   10.200.108.65     emon2   <none>           <none>
nginx-proxy-emon3                          1/1     Running   0          21m   192.168.32.118   emon3   <none>           <none>
nodelocaldns-72nns                         1/1     Running   0          10m   192.168.32.117   emon2   <none>           <none>
nodelocaldns-n6fqj                         1/1     Running   0          10m   192.168.32.118   emon3   <none>           <none>
```





**官方文档地址**

**coredns官方文档**：https://coredns.io/plugins/kubernetes/
**NodeLocal DNSCache**：https://kubernetes.io/docs/tasks/administer-cluster/nodelocaldns/



**coredns.yaml**

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
  labels:
      addonmanager.kubernetes.io/mode: EnsureExists
data:
  Corefile: |
    .:53 {
        errors
        health {
            lameduck 5s
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
          pods insecure
          fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        forward . /etc/resolv.conf {
          prefer_udp
        }
        cache 30
        loop
        reload
        loadbalance
    }
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: coredns
  namespace: kube-system
  labels:
    addonmanager.kubernetes.io/mode: Reconcile
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  labels:
    kubernetes.io/bootstrapping: rbac-defaults
    addonmanager.kubernetes.io/mode: Reconcile
  name: system:coredns
rules:
  - apiGroups:
      - ""
    resources:
      - endpoints
      - services
      - pods
      - namespaces
    verbs:
      - list
      - watch
  - apiGroups:
      - ""
    resources:
      - nodes
    verbs:
      - get
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  annotations:
    rbac.authorization.kubernetes.io/autoupdate: "true"
  labels:
    kubernetes.io/bootstrapping: rbac-defaults
    addonmanager.kubernetes.io/mode: EnsureExists
  name: system:coredns
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: system:coredns
subjects:
  - kind: ServiceAccount
    name: coredns
    namespace: kube-system
---
apiVersion: v1
kind: Service
metadata:
  name: coredns
  namespace: kube-system
  labels:
    k8s-app: kube-dns
    kubernetes.io/name: "coredns"
    addonmanager.kubernetes.io/mode: Reconcile
  annotations:
    prometheus.io/port: "9153"
    prometheus.io/scrape: "true"
spec:
  selector:
    k8s-app: kube-dns
  clusterIP: ${COREDNS_CLUSTER_IP}
  ports:
    - name: dns
      port: 53
      protocol: UDP
    - name: dns-tcp
      port: 53
      protocol: TCP
    - name: metrics
      port: 9153
      protocol: TCP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: "coredns"
  namespace: kube-system
  labels:
    k8s-app: "kube-dns"
    addonmanager.kubernetes.io/mode: Reconcile
    kubernetes.io/name: "coredns"
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 10%
  selector:
    matchLabels:
      k8s-app: kube-dns
  template:
    metadata:
      labels:
        k8s-app: kube-dns
      annotations:
        seccomp.security.alpha.kubernetes.io/pod: 'runtime/default'
    spec:
      priorityClassName: system-cluster-critical
      nodeSelector:
        kubernetes.io/os: linux
      serviceAccountName: coredns
      tolerations:
        - key: node-role.kubernetes.io/master
          effect: NoSchedule
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - topologyKey: "kubernetes.io/hostname"
            labelSelector:
              matchLabels:
                k8s-app: kube-dns
        nodeAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            preference:
              matchExpressions:
              - key: node-role.kubernetes.io/master
                operator: In
                values:
                - ""
      containers:
      - name: coredns
        image: "docker.io/coredns/coredns:1.6.7"
        imagePullPolicy: IfNotPresent
        resources:
          # TODO: Set memory limits when we've profiled the container for large
          # clusters, then set request = limit to keep this container in
          # guaranteed class. Currently, this container falls into the
          # "burstable" category so the kubelet doesn't backoff from restarting it.
          limits:
            memory: 170Mi
          requests:
            cpu: 100m
            memory: 70Mi
        args: [ "-conf", "/etc/coredns/Corefile" ]
        volumeMounts:
        - name: config-volume
          mountPath: /etc/coredns
        ports:
        - containerPort: 53
          name: dns
          protocol: UDP
        - containerPort: 53
          name: dns-tcp
          protocol: TCP
        - containerPort: 9153
          name: metrics
          protocol: TCP
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            add:
            - NET_BIND_SERVICE
            drop:
            - all
          readOnlyRootFilesystem: true
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
            scheme: HTTP
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8181
            scheme: HTTP
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 10
      dnsPolicy: Default
      volumes:
        - name: config-volume
          configMap:
            name: coredns
            items:
            - key: Corefile
              path: Corefile
```



**nodelocaldns.yaml**

```bash
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: nodelocaldns
  namespace: kube-system
  labels:
    addonmanager.kubernetes.io/mode: EnsureExists

data:
  Corefile: |
    cluster.local:53 {
        errors
        cache {
            success 9984 30
            denial 9984 5
        }
        reload
        loop
        bind 169.254.25.10
        forward . ${COREDNS_CLUSTER_IP} {
            force_tcp
        }
        prometheus :9253
        health 169.254.25.10:9254
    }
    in-addr.arpa:53 {
        errors
        cache 30
        reload
        loop
        bind 169.254.25.10
        forward . ${COREDNS_CLUSTER_IP} {
            force_tcp
        }
        prometheus :9253
    }
    ip6.arpa:53 {
        errors
        cache 30
        reload
        loop
        bind 169.254.25.10
        forward . ${COREDNS_CLUSTER_IP} {
            force_tcp
        }
        prometheus :9253
    }
    .:53 {
        errors
        cache 30
        reload
        loop
        bind 169.254.25.10
        forward . /etc/resolv.conf
        prometheus :9253
    }
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: nodelocaldns
  namespace: kube-system
  labels:
    k8s-app: kube-dns
    addonmanager.kubernetes.io/mode: Reconcile
spec:
  selector:
    matchLabels:
      k8s-app: nodelocaldns
  template:
    metadata:
      labels:
        k8s-app: nodelocaldns
      annotations:
        prometheus.io/scrape: 'true'
        prometheus.io/port: '9253'
    spec:
      priorityClassName: system-cluster-critical
      serviceAccountName: nodelocaldns
      hostNetwork: true
      dnsPolicy: Default  # Don't use cluster DNS.
      tolerations:
      - effect: NoSchedule
        operator: "Exists"
      - effect: NoExecute
        operator: "Exists"
      containers:
      - name: node-cache
        image: "registry.cn-hangzhou.aliyuncs.com/kubernetes-kubespray/dns_k8s-dns-node-cache:1.16.0"
        resources:
          limits:
            memory: 170Mi
          requests:
            cpu: 100m
            memory: 70Mi
        args: [ "-localip", "169.254.25.10", "-conf", "/etc/coredns/Corefile", "-upstreamsvc", "coredns" ]
        securityContext:
          privileged: true
        ports:
        - containerPort: 53
          name: dns
          protocol: UDP
        - containerPort: 53
          name: dns-tcp
          protocol: TCP
        - containerPort: 9253
          name: metrics
          protocol: TCP
        livenessProbe:
          httpGet:
            host: 169.254.25.10
            path: /health
            port: 9254
            scheme: HTTP
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 10
        readinessProbe:
          httpGet:
            host: 169.254.25.10
            path: /health
            port: 9254
            scheme: HTTP
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 10
        volumeMounts:
        - name: config-volume
          mountPath: /etc/coredns
        - name: xtables-lock
          mountPath: /run/xtables.lock
      volumes:
        - name: config-volume
          configMap:
            name: nodelocaldns
            items:
            - key: Corefile
              path: Corefile
        - name: xtables-lock
          hostPath:
            path: /run/xtables.lock
            type: FileOrCreate
      # Minimize downtime during a rolling upgrade or deletion; tell Kubernetes to do a "force
      # deletion": https://kubernetes.io/docs/concepts/workloads/pods/pod/#termination-of-pods.
      terminationGracePeriodSeconds: 0
  updateStrategy:
    rollingUpdate:
      maxUnavailable: 20%
    type: RollingUpdate
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nodelocaldns
  namespace: kube-system
  labels:
    addonmanager.kubernetes.io/mode: Reconcile
```



## 9、集群冒烟测试（在主节点emon操作）

### 9.0、网络环境切换后k8s网络不通小妙招

```bash
# 如果发现冒烟测试不通，再尝试
$ systemctl restart NetworkManager
```

### 9.1、创建nginx ds

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

### 9.2、检查各种ip连通性

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

### 9.3、检查dns可用性

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

### 9.4、日志功能

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

### 9.5、Exec功能

测试kubectl的exec功能

```bash
# 查询指定标签的pod
$ kubectl get pods -l app=nginx-ds
$ kubectl exec -it <nginx-pod-name> -- nginx -v
```

### 9.6、删除配置的测试资源

```bash
$ kubectl delete -f pod-nginx.yaml
$ kubectl delete -f nginx-ds.yml
# 查看是否清理完成
$ kubectl get pods
# 命令行输出结果
No resources found in default namespace.
```