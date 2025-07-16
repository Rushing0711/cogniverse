# 第2章 编写一个Chart和Helm3内置对象详解

## 1 Helm3创建编写一个Chart

### 1.1 创建一个Chart

使用`helm create`命令即可创建一个Chart，其中包含完整的目录结构。

```bash
$ helm create mychart
$ tree mychart
mychart/
├── charts
├── Chart.yaml
├── templates # Chart的模板文件，根据需要自己改动或都删除掉后，编写自己需要的模板yaml文件即可
│   ├── deployment.yaml
│   ├── _helpers.tpl
│   ├── hpa.yaml
│   ├── ingress.yaml
│   ├── NOTES.txt
│   ├── serviceaccount.yaml
│   ├── service.yaml
│   └── tests
│       └── test-connection.yaml
└── values.yaml

3 directories, 10 files
```

### 1.2 编写一个Chart

不引用内置对象的变量值（用Helm3创建发布一个configmap到K8S集群中，发布其他应用也一样，我们由浅入深进行学习）

```bash
$ kubectl get node
```

```bash
kubectl get nodes
NAME    STATUS   ROLES                  AGE   VERSION
emon    Ready    control-plane,master   8d    v1.23.17
emon2   Ready    <none>                 8d    v1.23.17
emon3   Ready    <none>                 8d    v1.23.17
```

#### 1.2.1 创建一个简单的Chart

- 创建一个Chart包：

```bash
# 创建一个chart包，chart包名为：mychart
$ helm create mychart
$ cd mychart/
$ ls
charts  Chart.yaml  templates  values.yaml
$ cd templates
$ ls
deployment.yaml  _helpers.tpl  hpa.yaml  ingress.yaml  NOTES.txt  serviceaccount.yaml  service.yaml  tests
# 全部删除
$ rm -rf *
# 编写一个自己需要的模板文件
$ tee ~/mychart/templates/configmap.yaml << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "hello world"
EOF
```

- 创建一个release实例：

```bash
# 使用helm安装一个release的实例，指定release实例名：myconfigmap，指定chart目录./mychart/
$ helm install myconfigmap ~/mychart
NAME: myconfigmap
LAST DEPLOYED: Thu Jun 26 11:58:52 2025
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
$ helm ls
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART           APP VERSION
myconfigmap     default         1               2025-06-26 11:58:52.804289035 +0800 CST deployed        mychart-0.1.0   1.16.0 
$ kubectl get cm
NAME                DATA   AGE
mychart-configmap   1      50m
```

- 删除实例

```bash
$ helm uninstall myconfigmap
```

#### 1.2.2 创建带有变量的Chart

- 编写带有变量的模板文件：

```bash
$ tee ~/mychart/templates/configmap.yaml << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  # 最前面的 . 从作用域最顶层命名空间开始，即：在顶层命名空间中开始查找Release对象，再查找Name对象
  # 也就是通过内置对象获取内置对象的变量值（Release的名字）作为拼接成configmap的名字
  name: {{ .Release.Name }}-configmap
data:
  myvalue: {{ .Values.MY_VALUE }}
EOF
# 配置变量
$ echo MY_VALUE: \"Hello World\" > ~/mychart/values.yaml 
```

:::info

引用内置对象变量或其他变量（如values.yaml）的好处：

如果 metadata.name 中设置的值时一个固定值，这样的模板时无法在K8S中多次部署的，所以我们可以试着在每次安装chart时，都自动metadata.name的值设置为release的名称，因为每次部署的时候release实例名是不一样的，这样部署的时候，里面的资源名也就可以作为一个区分，而可以进行重复部署。

:::

- 创建一个release实例：

```bash
# 使用helm安装一个release的实例，指定release实例名：myconfigmap2，指定chart目录./mychart/
$ helm install myconfigmap2 ~/mychart
NAME: myconfigmap2
LAST DEPLOYED: Thu Jun 26 17:01:08 2025
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
$ helm ls
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART           APP VERSION
myconfigmap2    default         1               2025-06-26 17:01:08.791734987 +0800 CST deployed        mychart-0.1.0   1.16.0     
$ kubectl get cm
NAME                     DATA   AGE
myconfigmap2-configmap   1      13s
```

- 删除实例

```bash
$ helm uninstall myconfigmap2
```

### 1.3 Helm3的测试渲染指令

不真正执行，知识试运行看是否能运行。

helm提供了一个用来渲染模板的命令，该命令可以将模板内容渲染出来，但是不会进行任何安装的操作。可以用该命令来测试模板渲染的内容是否正确。

用法：`$ helm install release实例名 chart目录 --debug --dry-run`

```bash
$ helm install myconfigmap ~/mychart --debug --dry-run
```

### 1.4 Helm3通过各种类型chart包安装

Helm3通过各种类型chart包安装一个release实例名来部署K8S相关资源（如：pod,deployment,svc,ingress等，根据模板文件定义）

1. 从加入到本地的chart官方仓库（从官方仓库安装）安装release实例
2. 将从chart仓库拉下来的压缩包进行安装release实例（下载好的压缩包本地离线安装release）
3. 将从chart仓库拉下来的压缩包解压后，从解压目录安装release实例（解压下载好的压缩包，从解压目录离线安装release实例）
4. 从一个网络地址仓库压缩包直接安装release实例

```bash
# 从加入到本地的chart官方仓库安装release实例，db为release实例名（从官方仓库安装）
$ helm install db stable/mysql
# 从加入到本地的chart社区仓库安装release实例，my-tomcat为release实例名（从官方仓库安装）
$ helm install my-tomcat test-repo/tomcat
# 从chart仓库拉下来的压缩包进行安装release实例（从本地存档文件离线安装），db为release实例名
$ helm install db mysql-1.6.9.tgz
# 从chart仓库拉下来的压缩包解压后，从解压目录安装release实例（从解压目录离线安装），db为release实例名
$ helm install db mysql
# 从一个网络地址仓库压缩包直接安装release实例（从下载服务器安装），db为release实例名
$ helm install db http://url.../mysql-1.6.9.tgz
```

## 2 Helm2内置对象详解

### 2.1 Helm2常用的内置对象

- Release对象
- Values对象
- Chart对象
- Capabilities对象
- Template对象

### 2.2 各内置对象详解

#### 2.2.1 Release对象

描述了版本发布自身的一些信息。它包含了以下对象：

| 对象名称           | 描述                                                        |
| ------------------ | ----------------------------------------------------------- |
| .Release.Name      | release的名称                                               |
| .Release.Namespace | release的命名空间                                           |
| .Release.IsUpgrade | 如果当前操作是升级或回滚的话，该值为true                    |
| .Release.isInstall | 如果当前操作是安装的话，该值为true                          |
| .Release.Revision  | 获取此次修订的版本号。初次安装时为1，每次升级或回滚都会递增 |
| .Release.Service   | 获取渲染当前模板的服务名称。一般都是Helm                    |

#### 2.2.2 Values对象

描述的是value.yaml文件（定义变量的文件）中的内容，默认为空。使用Value对象可以获取到value.yaml文件中已定义的任何变量数值。

| Value键值对                   | 获取方式           |
| ----------------------------- | ------------------ |
| name1: test1                  | .Values.name1      |
| info:<br />&nbsp;&nbsp;name2: test2 | .Values.info.name2 |

#### 2.2.3 Chart对象

用于获取Chart.yaml文件中的内容。

| 对象名称       | 描述            |
| -------------- | --------------- |
| .Chart.Name    | 获取Chart的名称 |
| .Chart.Version | 获取Chart的版本 |

#### 2.2.4 .Capabilities对象

提供了关于kubernetes集群相关的信息。该对象有如下方法：

| 对象名称                                                     | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .Capabilities.APIVersions                                    | 返回kubernetes集群，API版本信息集合                          |
| .Capabilities.APIVersions.Has $version                       | 用于检测指定的版本或资源在K8S集群中是否可用，例如：apps/v1/Deployment |
| .Capabilities.KubeVersion<br />.Capabilities.KubeVersion.version | 都用于获取kubernetes的版本号                                 |
| .Capabilities.KubeVersion.Major                              | 获取kubernetes的主版本号                                     |
| .Capabilities.KubeVersion.Minor                              | 获取kubernetes的小版本号                                     |

#### 2.2.4 Template

用于获取当前模板的信息，它包含如下两个对象。

| 对象名称           | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| .Template.Name     | 用于获取当前模板的名称和路径（例如：mychart/templates/mytemplate.yaml） |
| .Template.BasePath | 用于获取当前模板的路径（例如：mychart/templates）            |

## 3 编写一个使用内置对象的chart

编写自己需要的yaml文件，调用上面各自内置对象获取相关变量的值。

### 3.1 调用Release对象

```bash
$ helm create mychart
$ cd ~/mychart/templates
$ rm -rf *
# 编写一个自己需要的模板文件
$ tee ~/mychart/templates/configmap.yaml << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  namespace: {{ .Release.Namespace }}
data:
  value1: {{ .Release.IsUpgrade }}
  value2: {{ .Release.IsInstall }}
  value3: {{ .Release.Revision }}
  value4: {{ .Release.Service }}  
EOF

# 不真正执行，只是试运行看是否能运行
$ helm install myconfigmap ~/mychart --debug --dry-run
```

### 3.2 调用Values对象

```bash
# 清空里面的初始化信息，设置成我们需要的（变量名和赋值）（里面默认的信息都是初始化信息，仅供参考）
$ tee ~/mychart/values.yaml << EOF
name1: test1 
info:
  name2: test2
EOF

# 编写一个自己需要的模板文件
$ tee ~/mychart/templates/configmap.yaml << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  namespace: {{ .Release.Namespace }}
data:
  value1: {{ .Values.name1 }}
  value2: {{ .Values.info.name2 }}
EOF

# 不真正执行，只是试运行看是否能运行
$ helm install myconfigmap ~/mychart --debug --dry-run
```

### 3.3 调用Chart对象

```bash
# 先查看下CHart.yaml文件中内容中定义的变量
$ cat /root/mychart/Chart.yaml|grep -vE "#|^$"
apiVersion: v2
name: mychart
description: A Helm chart for Kubernetes
type: application
version: 0.1.0
appVersion: "1.16.0"

# 编写一个自己需要的模板文件
$ tee ~/mychart/templates/configmap.yaml << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  namespace: {{ .Release.Namespace }}
data:
  value1: {{ .Chart.Name }}
  value2: {{ .Chart.Version }}
EOF

# 不真正执行，只是试运行看是否能运行
$ helm install myconfigmap ~/mychart --debug --dry-run
```

### 3.4 调用Capabilities对象

```bash
# 编写一个自己需要的模板文件
$ tee ~/mychart/templates/configmap.yaml << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  namespace: {{ .Release.Namespace }}
data:
  value1: "{{ .Capabilities.APIVersions }}" # 返回kubernetes集群 API版本信息集合
  value2: '{{ .Capabilities.APIVersions.Has "apps/v1/Deployment" }}' # 用于检测指定的版本或资源在K8S集群中是否可用
  value3: "{{ .Capabilities.KubeVersion.Version }}" # 用于获取kubernetes的版本号
  value4: "{{ .Capabilities.KubeVersion.Major }}" # 获取Kubernetes的主版本号
  value5: "{{ .Capabilities.KubeVersion.Minor }}" # 获取kubernetes的小版本号
EOF

# 不真正执行，只是试运行看是否能运行
$ helm install myconfigmap ~/mychart --debug --dry-run
```

### 3.5 调用Template对象

```bash
# 编写一个自己需要的模板文件
$ tee ~/mychart/templates/configmap.yaml << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  namespace: {{ .Release.Namespace }}
data:
  value1: {{ .Template.Name }}
  value2: {{ .Template.BasePath }}
EOF

# 不真正执行，只是试运行看是否能运行
$ helm install myconfigmap ~/mychart --debug --dry-run
```













