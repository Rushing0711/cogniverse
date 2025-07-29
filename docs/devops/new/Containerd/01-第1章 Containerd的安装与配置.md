# 第1章 Containerd的安装与配置

[查看官方安装教程](https://github.com/containerd/containerd/blob/main/docs/getting-started.md)



## 1 配置docker代理服务器

### 1.1 通过环境变量配置代理（推荐）

适用于通过 `systemd` 管理的 containerd 服务：

若加速器不好使，请使用代理服务器，前提是能科学上网，这里推荐一个：Aurora 和 [ClashX](https://bigbearvpn.sodtool.com/login)

- 配置代理

```bash
$ mkdir -p /etc/systemd/system/containerd.service.d
```

```bash
$ sudo tee /etc/systemd/system/containerd.service.d/proxy.conf <<-'EOF'
[Service]
Environment="HTTP_PROXY=http://192.168.200.1:7890"
Environment="HTTPS_PROXY=http://192.168.200.1:7890"
Environment="NO_PROXY=127.0.0.1,localhost,192.168.200.116,emon,/10.233.0.0/17,10.96.0.0/16"
EOF
```

> NO_PROXY需要包含集群内部地址（如 Pod CIDR 、 Service CIDR）、私有仓库、内网域名
>
> ```bash
> $ kubectl -n kube-system describe pod $(kubectl -n kube-system get pods -l component=kube-controller-manager -o jsonpath='{.items[0].metadata.name}') | grep -E 'cluster-cidr|service-cluster-ip-range' 
> ```
>
> ```bash
> # 输出结果      
>       --cluster-cidr=10.233.0.0/17
>       --service-cluster-ip-range=10.96.0.0/16
> ```
>
> - <span style="color:red;font-weight:bold;">这种代理配置对crictl命令生效，对ctr和nerdctl不生效</span>
>   - `crictl` → 连接 containerd 的 **CRI 插件**（实现 Kubernetes CRI 接口）
>
>   - `ctr` → 直接连接 containerd 的**核心服务**
>
>   **关键区别**：
>
>   | 工具     | 网络操作执行者      | 依赖的环境变量来源    |
>   | :------- | :------------------ | :-------------------- |
>   | `ctr`    | `ctr` 客户端自身    | 当前 Shell 的环境变量 |
>   | `crictl` | containerd 守护进程 | systemd 服务环境变量  |
>
>   - 可以在shell中设置代理，也可以在命令中添加代理
>
>   ```bash
>   $ HTTPS_PROXY=http://192.168.200.1:7890 ctr image pull docker.io/library/openjdk:8-jre
>   $ HTTPS_PROXY=http://192.168.200.1:7890 nerdctl pull openjdk:8-jre
>   ```
>
> 

- 重载并重启服务并查看代理配置情况

```bash
$ sudo systemctl daemon-reload && sudo systemctl restart containerd
$ systemctl show --property=Environment containerd
```

```bash
Environment=HTTP_PROXY=http://192.168.200.1:7890 HTTPS_PROXY=http://192.168.200.1:7890 NO_PROXY=127.0.0.1,localhost,192.168.200.116,emon,10.233.0.0/17,10.96.0.0/16
```

### 1.2 通过 `config.toml` 配置镜像仓库代理

适用于为特定仓库配置代理或镜像加速：

1. **编辑 containerd 主配置**

```bash
sudo vim /etc/containerd/config.toml
```

2. **添加镜像仓库代理配置**（示例为 Docker Hub）

```toml
[plugins."io.containerd.grpc.v1.cri".registry]
  [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
    [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
      endpoint = ["https://registry-1.docker.io"]

  [plugins."io.containerd.grpc.v1.cri".registry.configs]
    [plugins."io.containerd.grpc.v1.cri".registry.configs."docker.io".proxy]
      http_proxy = "http://proxy.example.com:8080"
      https_proxy = "http://proxy.example.com:8080"
```

3. **重启 containerd**

```bash
$ sudo systemctl restart containerd
```

### 1.3 验证代理是否生效

1. **拉取镜像测试**

   bash

   ```
   sudo crictl pull nginx
   ```

2. **查看 containerd 日志**

   bash

   ```
   sudo journalctl -u containerd -f
   ```

   成功日志示例：

   text

   ```
   INFO[2025-07-13T10:00:00] Fetching image via proxy: http://proxy.example.com:8080 
   ```









