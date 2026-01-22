# 第4章 DevOps实战

## 9 用户-企业空间-项目

- 登录 admin 创建如下用户

| 用户名          | 密码     | 角色                      | 作用                                         |
| --------------- | -------- | ------------------------- | -------------------------------------------- |
| admin           | P@88word | platform-admin            | 管理 KubeSphere 平台上的所有资源。           |
| ws-manager      | P@88word | platform-self-provisioner | 创建企业空间并成为所创建的企业空间的管理员。 |
| ws-admin        | P@88word | platform-regular          | 被邀请加入企业空间之前无法访问任何资源。     |
| project-admin   | P@88word | platform-regular          | 被邀请加入企业空间之前无法访问任何资源。     |
| project-regular | P@88word | platform-regular          | 被邀请加入企业空间之前无法访问任何资源。     |

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

## 3 创建并部署 WordPress

本节以安装 WordPress 为例，演示如何在 KubeSphere Web 控制台部署应用程序，并在集群外进行访问。

### 3.1 WordPress 简介

WordPress 是一款基于 PHP 的免费、开源内容管理系统，您可以使用 WordPress 搭建自己的网站。完整的 WordPress 应用程序包括以下 Kubernetes 对象，由 MySQL 作为后端数据库。

![WordPress](images/WordPress.png)

### 3.2 前提条件

- 准备一个项目（例如 **demo-project**）和一个已邀请到该项目的用户（例如 **project-regular**）。该用户在项目中应具有 **operator** 角色。有关更多信息，请参阅[控制用户权限](/devops/new/KubeSphere/01-%E7%AC%AC1%E7%AB%A0%20KubeSphere%E5%AE%89%E8%A3%85.html#_9-%E5%A6%82%E4%BD%95%E6%8E%A7%E5%88%B6%E7%94%A8%E6%88%B7%E6%9D%83%E9%99%90-%E3%80%90%E5%BF%AB%E9%80%9F%E4%BA%86%E8%A7%A3%E3%80%91)。
- KubeSphere 平台需要安装并启用 **KubeSphere 服务网格**扩展组件。

### 3.3 操作步骤

#### 1. 创建保密字典

创建两个保密字典，分别用于设置 MySQL 和 WordPress 的 root 密码。

1. 使用 **project-regular** 用户登录 KubeSphere Web 控制台，点击**企业空间管理**并进入项目所在的企业空间，在项目列表中点击 **demo-project**。
2. 在左侧导航栏，选择**配置** > **保密字典**，在页面右侧点击**创建**。
3. 在**基本信息**页签，输入保密字典的基本信息（例如，将**名称**设置为 **mysql-secret**），点击**下一步**。
4. 在**数据配置**页签，点击**添加数据**添加键值对。
5. 将**键**和**值**分别设置为 **MYSQL_ROOT_PASSWORD** 和 **123456**，在页面右下角点击<img src="./images/check-dark.svg" alt="check" style="width:25px;height:25px;display:inline" />保存设置。
6. 点击**创建**以创建保密字典，用于为 MySQL 提供 root 密码。
7. 重复以上步骤创建一个名为 **wordpress-secret** 的保密字典，将**键**和**值**分别设置为 **WORDPRESS_DB_PASSWORD** 和 **123456**，用于为 WordPress 提供 root 密码。

#### 2. 创建持久卷声明

创建持久卷声明用于存储 WordPress 应用数据。

1. 在左侧导航栏，选择**存储** > **持久卷声明**，在页面右侧点击**创建**。
2. 在**基本信息**页签，输入持久卷声明的基本信息（例如，将**名称**设置为 **wordpress-pvc**），点击**下一步**。
3. 在**存储设置**页签，点击**下一步**。
4. 在**高级设置**页签，点击**创建**即可。

#### 3 创建 MySQL 应用

创建 MySQL 应用为 WordPress 提供数据库服务。

1. 在左侧导航栏，选择**服务网格** > **自制应用**，在页面右侧点击**创建**。

2. 在**基本信息**页面，输入应用基本信息（例如，将**名称**设置为 **wordpress**），点击**下一步**。

3. 在**服务设置**页面，点击**创建服务**为自制应用创建一个服务。

4. 在**创建服务**对话框，点击**有状态服务**。

5. 在弹出的**创建有状态服务**对话框，输入有状态服务的名称（例如 **mysql**）并点击**下一步**。

6. 在**容器组设置**页签，点击**添加容器**。

7. 在搜索框中输入 **mysql:8.4**，按下回车键，向下滚动鼠标，点击**使用默认镜像端口**。

   :::danger

   此时配置还未完成，请不要在页面右下角点击<img src="./images/check-dark.svg" alt="check" style="width:25px;height:25px;display:inline" />。

   :::

8. 在**容器组设置**页签的**高级设置**区域，将内存上限设置为 1000 Mi 或以上，否则 MySQL 可能因内存不足而无法启动。

| CPU预留        | CPU限制        | 内存预留     | 内存上限   |
| :------------- | :------------- | :----------- | :--------- |
| 无预留（Core） | 无上限（Core） | 无预留（Mi） | 1000（Mi） |

9. 在**容器组设置**页签的**端口设置**区域，设置如下：

| 协议 | 名称     | 容器端口 | 服务端口 |
| :--- | :------- | :------- | :------- |
| TCP  | tcp-3306 | 3306     | 3306     |


10. 向下滚动鼠标到**环境变量**区域，选择**环境变量**，在下拉框中选择**来自保密字典**。参数设置如下：

| 来源   | 键              | 资源         | 资源中的键          |
| :----- | :-------------- | :----------- | ------------------- |
| 自定义 | MYSQL_ROOT_HOST | mysql-secret | MYSQL_ROOT_PASSWORD |

11. 点击<img src="./images/check-dark.svg" alt="check" style="width:25px;height:25px;display:inline" />保存配置，然后点击**下一步**。

12. 在**存储设置**页签，点击**添加持久卷声明模板**。

13. 输入 PVC 名称前缀（例如，**mysql**），并指定挂载路径（存储类：基于OpenEBS的**LocalPV**，模式：**RWO-读写**，路径：**/var/lib/mysql**）。

14. 点击<img src="./images/check-dark.svg" alt="check" style="width:25px;height:25px;display:inline" />保存配置，然后点击**下一步**。

15. 在**高级设置**页签，点击**创建**以创建 MySQL 应用。

#### 4 创建 WordPress 应用

1. 再次点击**创建服务**。在弹出的**创建服务**对话框，点击**无状态服务**。

2. 在弹出的**创建无状态服务**对话框，输入无状态服务的名称（例如，**wordpress**）并点击**下一步**。

3. 在**容器组设置**页签，点击**添加容器**。

4. 在搜索框中输入 **wordpress:4.8-apache**，按下回车键，向下滚动鼠标，点击**使用默认镜像端口**。

   | 说明                                                         |
   | :----------------------------------------------------------- |
   | 此时配置还未完成，请不要在页面右下角点击<img src="./images/check-dark.svg" alt="check" style="width:25px;height:25px;display:inline" />。 |

5. 向下滚动鼠标到**环境变量**区域，选择**环境变量**。此处需要添加两个环境变量，请按如下信息设置：

   - 在下拉框中选择**来自保密字典**，输入键名称 **WORDPRESS_DB_PASSWORD**，选择资源 **wordpress-secret** 和资源值 **WORDPRESS_DB_PASSWORD**。

   - 点击**添加环境变量**，分别输入键名称 **WORDPRESS_DB_HOST** 和值 **mysql**。

     | 说明                                                         |
     | :----------------------------------------------------------- |
     | **WORDPRESS_DB_HOST** 环境变量的值必须与[创建 MySQL 应用](https://www.kubesphere.io/zh/docs/v4.1/02-quickstart/05-deploy-wordpress/#_3_创建_mysql_应用)中创建的 MySQL 有状态服务的名称完全相同。否则，WordPress 将无法连接到 MySQL 数据库。 |

6. 点击<img src="./images/check-dark.svg" alt="check" style="width:25px;height:25px;display:inline" />保存配置，然后点击**下一步**。

7. 在**存储设置**页签，点击**挂载卷**。

8. 在**持久卷**页签，点击**选择持久卷声明**。

9. 选择已创建的 **wordpress-pvc**，将模式设置为**读写**，并输入挂载路径 **/var/www/html**。

10. 点击<img src="./images/check-dark.svg" alt="check" style="width:25px;height:25px;display:inline" />保存配置，再点击**下一步**。

11. 在**高级设置**页签，点击**创建**。

12. 在**服务**页面，点击**下一步**。

13. 在**路由设置**页面，点击**创建**以创建 WordPress。您可以在**自制应用**页面查看已创建的应用。

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
