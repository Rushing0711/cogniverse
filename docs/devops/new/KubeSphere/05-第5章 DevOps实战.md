# 第4章 DevOps实战

## 1 用户-企业空间-项目

### 1.1 企业版用户-企业空间规划

- <span style="color:green;font-weight:bold;">登录 admin 创建如下用户</span>

| 用户名          | 密码     | 角色                      | 邮箱      | 作用                                         |
| --------------- | -------- | ------------------------- | --------- | -------------------------------------------- |
| admin           | P@88word | platform-admin            | ---       | 管理 KubeSphere 平台上的所有资源。           |
| ws-manager      | P@88word | platform-self-provisioner | wm@qq.com | 创建企业空间并成为所创建的企业空间的管理员。 |
| ws-admin        | P@88word | platform-regular          | wa@qq.com | 被邀请加入企业空间之前无法访问任何资源。     |
| project-admin   | P@88word | platform-regular          | pa@qq.com | 被邀请加入企业空间之前无法访问任何资源。     |
| project-regular | P@88word | platform-regular          | pr@qq.com | 被邀请加入企业空间之前无法访问任何资源。     |

- <span style="color:green;font-weight:bold;">登录 ws-manager 创建企业空间</span>

企业空间： demo-workspace 邀请管理员 ws-admin

- <span style="color:green;font-weight:bold;">登录 ws-admin 邀请 project-admin/project-regular 进入企业空间，分别授予 demo-workspace-self-provisioner 和 demo-workspace-viewer 角色。<span style="color:red;font-weight:bold;">可编辑项目配额、默认容器配额</span></span>

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

### 1.2 社区版用户-企业空间规划

<span style="color:red;font-weight:bold;">社区版只有3个用户配额（包含默认用户admin）</span>

| 用户名   | 密码     | 平台角色           | 集群角色       | 邮箱      | 作用                                     |
| -------- | -------- | ---------------- | --------- | ---------------------------------------- | ---------------------------------------- |
| admin    | P@88word | platform-admin   | cluster-admin | ---       | 管理 KubeSphere 平台上的所有资源。       |
| ws-admin | P@88word | platform-self-provisioner | cluster-admin | wa@qq.com | 被邀请加入企业空间之前无法访问任何资源。 |
| project-admin   | P@88word | platform-regular          | cluster-viewer | pa@qq.com | 被邀请加入企业空间之前无法访问任何资源。     |

- 使用admin
  - 创建用户 `ws-admin` 并赋予平台角色`platform-self-provisioner`和集群角色`cluster-admin`。
  - 创建用户 `project-admin`并赋予平台角色`platform-regular`和集群角色`cluster-viewer`。

- 使用ws-admin创建企业空间 `demo-workspace` ，默认获得企业空间角色`demo-workspace-admin`。
- 使用ws-admin邀请`project-admin`进入企业空间，并赋予企业空间角色`demo-workspace-self-provisioner`角色。
- 使用project-admin创建普通项目 `demo-project` 和DevOps项目 `demo-devops` ，当前登录用户默认被赋予`admin`角色。

![image-20240628180327978](images/cicd-tools-fullsize.jpeg)

## 2 DevOps概述

### 2.1 概述

DevOps 提供一系列持续集成 (CI) 和持续交付 (CD) 工具，可以使 IT 和软件开发团队之间的流程实现自动化。在 CI/CD 工作流中，每次集成都通过自动化构建来验证，包括编码、发布和测试，从而帮助开发者提前发现集成错误，团队也可以快速、安全、可靠地将内部软件交付到生产环境。

不过，传统的 Jenkins Controller-Agent 架构（即多个 Agent 为一个 Controller 工作）有以下不足。

- 如果 Controller 宕机，整个 CI/CD 流水线会崩溃。
- 资源分配不均衡，一些 Agent 的流水线任务 (Job) 出现排队等待，而其他 Agent 处于空闲状态。
- 不同的 Agent 可能配置环境不同，并需要使用不同的编码语言。这种差异会给管理和维护带来不便。

DevOps 组件支持源代码管理工具，例如 GitHub、GitLab、Git 和 Bitbucket，支持通过图形编辑面板 (Jenkinsfile out of SCM) 构建 CI/CD 流水线，或者从代码仓库 (Jenkinsfile in SCM) 创建基于 Jenkinsfile 的流水线。

### 2.2 功能

DevOps 组件提供以下功能：

- 独立的 DevOps 项目，提供访问可控的 CI/CD 流水线。
- 开箱即用的 DevOps 功能，无需复杂的 Jenkins 配置。
- [基于 Jenkinsfile 的流水线](https://docs.kubesphere.com.cn/v4.2.1/11-use-extensions/02-devops/03-pipelines/02-create-a-pipeline-using-jenkinsfile/)，提供一致的用户体验，支持多个代码仓库。
- [图形编辑面板](https://docs.kubesphere.com.cn/v4.2.1/11-use-extensions/02-devops/03-pipelines/01-create-a-pipeline-using-graphical-editing-panel/)，用于创建流水线，学习成本低。
- 强大的工具集成机制，例如 [SonarQube](https://docs.kubesphere.com.cn/v4.2.1/11-use-extensions/02-devops/10-how-to-integrate/01-sonarqube/)，用于代码质量检查。
- 基于 ArgoCD 的持续交付能力，自动化部署到多集群环境。

### 2.3 DevOps 流水线工作流

DevOps CI/CD 流水线基于底层 Kubernetes Jenkins Agent 运行。这些 Jenkins Agent 可以动态扩缩，即根据任务状态进行动态供应或释放。Jenkins Controller 和 Agent 以 Pod 的形式运行在 KubeSphere 节点上。Controller 运行在其中一个节点上，其配置数据存储在一个持久卷声明中。Agent 运行在各个节点上，但可能不会一直处于运行状态，而是根据需求动态创建并自动删除。

当 Jenkins Controller 收到构建请求，会根据标签动态创建运行在 Pod 中的 Jenkins Agent 并注册到 Controller 上。当 Agent 运行完任务后，将会被释放，相关的 Pod 也会被删除。

### 2.4 动态供应 Jenkins Agent

动态供应 Jenkins Agent 有以下优势：

**资源分配合理**：动态分配已创建的 Agent 至空闲节点，避免因单个节点资源利用率高而导致任务排队等待。

**高可扩缩性**：当集群因资源不足而导致任务长时间排队等待时，支持向集群新增节点。

**高可用性**：当 Jenkins Controller 故障时，DevOps 会自动创建一个新的 Jenkins Controller 容器，并将持久卷挂载至新创建的容器，保证数据不会丢失，从而实现集群高可用。

## 3 [登录 Jenkins 仪表板](/devops/new/KubeSphere/05-第5章%20DevOps实战.html#_10-0-1-登录-jenkins-仪表板)

[Jenkins官方文档](https://www.jenkins.io/zh/doc/pipeline/tour/getting-started/)

安装 DevOps 时，默认情况下也会安装 Jenkins 仪表板。

### 3.1 前提条件

KubeSphere 平台需要安装并启用 **DevOps** 扩展组件。

### 3.2 操作步骤

1. 查看 jenkins 仪表盘对应的服务，然后参阅[如何访问服务](https://docs.kubesphere.com.cn/v4.2.1/02-quickstart/08-access-a-service/)，访问 Jenkins 仪表板。

```bash
$ kubectl -n kubesphere-devops-system get svc devops-jenkins
```

```bash
NAME             TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
devops-jenkins   NodePort   10.233.34.54   <none>        80:30180/TCP   5d16h
```

2. 获取 jenkins 管理员的用户名和密码。

```bash
$ kubectl -n kubesphere-devops-system get secret devops-jenkins -o yaml
```

输出示例：

```yml
......
data:
  jenkins-admin-password: aGtIRU9vd1JFVzZjS0h5VTZVYTRaUg==
  jenkins-admin-token: MTE0NTQzMTYxNzkwMzY5NDE4MDg5MjM0NjI5NTgyMDA0OA==
  jenkins-admin-user: YWRtaW4=
......
```

将 `jenkins-admin-user` 和 `jenkins-admin-password` 对应的内容 base64 解码后，即得到 jenkins 管理员的用户名和密码。

比如，这里是： admin / hkHEOowREW6cKHyU6Ua4ZR

3. 使用获取的用户名和密码，登录 Jenkins 仪表板。

:::tip

若想以 LDAP 或 OpenId Connect 的方式登录 jenkins 仪表板，请参阅扩展中心 DevOps 扩展组件的详情页说明。

:::

- 执行以下命令获取 Jenkins 的地址。

```bash
export NODE_PORT=$(kubectl get svc --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" devops-jenkins)
export NODE_IP=$(kubectl get no --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
echo http://$NODE_IP:$NODE_PORT
```

输出：

http://192.168.200.116:30180

<span style="color:red;font-weight:bold;">访问时，未登录KubeSphere会被拦截并调整到KubeSphere的登录界面，登录后自动进入Jenkins页面</span>

## 4 设置 Jenkins 系统

DevOps 系统提供基于 Jenkins 的容器化 CI/CD 功能。Jenkins 作为 CI/CD 工作流的事实标准，具备强大而灵活的特性。然而，许多插件要求用户在使用 Jenkins 之前必须进行系统级配置。

为了提供可调度的 Jenkins 环境，KubeSphere 采用了 **Configuration as Code** 的方式进行 Jenkins 系统设置。用户需要登录 Jenkins 仪表板，修改配置后再重新加载。

本文档演示如何设置 Jenkins 并重新加载配置。

### 4.1 前提条件

KubeSphere 平台需要安装并启用 **DevOps** 扩展组件。

### 4.2 Jenkins Configuration as Code

KubeSphere 默认安装 Jenkins Configuration as Code 插件，支持通过 YAML 文件定义 Jenkins 的期望状态，便于再现 Jenkins 的配置（包括插件配置）。请参阅[该目录](https://github.com/jenkinsci/configuration-as-code-plugin/tree/master/demos)查看具体的 Jenkins 配置和示例 YAML 文件。

### 4.3 修改 ConfigMap

建议通过 Configuration as Code (CasC) 在 KubeSphere 中配置 Jenkins。将内置 Jenkins CasC 文件存储为 ConfigMap。

1. 以 **admin** 用户登录 KubeSphere Web 控制台。
2. 点击**集群管理**，进入一个集群。
3. 在左侧导航栏中选择**配置**下的**配置字典**。在**配置字典**页面，从左上角的下拉列表中选择 **kubesphere-devops-system** 项目，然后点击 **jenkins-casc-config**。
4. 在详情页面，点击**操作**，在下拉列表中选择**编辑 YAML**。
5. **jenkins-casc-config** 的配置模板是一个 YAML 文件，位于 **data:jenkins_user.yaml:** 部分。在 ConfigMap 的代理 (Kubernetes Jenkins Agent) 中修改容器镜像、标签、资源请求 (Request) 和限制 (Limit) 等内容，或者在 podTemplate 中添加容器。完成操作后，点击**确定**。
6. 等待 1 ~ 2 分钟，会自动重新加载新的配置

   **重启 Jenkins：** 使配置生效：（或等待1-2分钟自动加载）

   ```bash
   $ kubectl rollout restart deployment/devops-jenkins -n kubesphere-devops-system
   ```

:::tip

说明
有关如何通过 CasC 设置 Jenkins 的更多信息，请参阅 Jenkins 文档。

在当前版本中，并非所有插件都支持 CasC 设置。CasC 仅会覆盖通过 CasC 设置的插件配置。

:::

## 5 在流水线中使用 Jenkins 共享库

对于包含相同阶段或步骤的 Jenkins 流水线，可以在 Jenkinsfile 中使用 Jenkins 共享库避免流水线代码重复。

本文档演示如何在 DevOps 流水线中使用 Jenkins 共享库。

### 5.1 前提条件

- KubeSphere 平台需要安装并启用 **DevOps** 扩展组件。
- 已创建一个企业空间、一个 DevOps 项目和一个用户（例如 **project-regular**），并已邀请该用户至 DevOps 项目且授予 **operator** 角色。请参阅[邀请用户加入 DevOps 项目](https://docs.kubesphere.com.cn/v4.2.1/11-use-extensions/02-devops/02-devops-project-mangement/03-project-members/01-invite-a-user-to-a-project/)。
- 已有一个可用 Jenkins 共享库。本教程以 [GitHub 仓库](https://github.com/devops-ws/jenkins-shared-library)中的 Jenkins 共享库为例。

### 5.2 步骤 1：在 Jenkins 仪表板配置共享库

1. [登录 Jenkins 仪表板](/devops/new/KubeSphere/05-第5章%20DevOps实战.html#_10-0-1-登录-jenkins-仪表板)并点击左侧导航栏中的**系统管理**。
2. 向下滚动并点击**系统配置**。
3. 向下滚动到 **Global Trusted Pipeline Libraries**，然后点击**新增**。
4. 配置字段如下所示。
   - **Name：** 为共享库设置名称（例如，`demo-shared-library`），以便在 Jenkinsfile 中引用此名称来导入共享库。
   - **Default version：** 设置共享库所在仓库的一个分支名称，将其作为导入共享库的默认分支。本教程将使用 master。
   - 在 **Retrieval method** 下，选择 **Modern SCM**。
   - 在 **Source Code Management** 下，选择 **Git**，并为**项目仓库**输入示例仓库的 URL 。如果您使用自己的仓库且访问此仓库需要凭证，还需要配置**凭证**。
5. 编辑完成后，点击**应用**。

:::tip

说明
您还可以配置[文件夹级别的共享库](https://www.jenkins.io/zh/doc/book/pipeline/shared-libraries/#folder-level-shared-libraries)。

:::

### 5.3 步骤 2：在流水线中使用共享库

#### 创建流水线

1. 以 **project-regular** 用户登录 KubeSphere 控制台并进入您的企业空间。
2. 在左侧导航栏选择 **DevOps > 流水线**。
3. 在页面左上角的下拉列表中选择一个 DevOps 项目。
4. 在页面点击**创建**。
5. 在弹出的对话框中，将其命名为 **demo-shared-library**，点击**下一步**。
6. 在**高级设置**中，直接点击**创建**，使用默认设置创建流水线。

#### 编辑流水线

1. 在流水线列表页面，点击流水线名称进入其详情页面，然后点击**编辑 Jenkinsfile**。
2. 在弹出的对话框中，添加以下示例 Jenkinsfile。完成编辑后，点击**确定**。

- **动态加载共享库** **(Dynamic Library Loading)** 

**流水线：**  demo-shared-library-untrusted

```bash
library identifier: 'demo-shared-library-untrusted@master', retriever: modernSCM([
  $class: 'GitSCMSource',
  remote: 'https://github.com/devops-ws/jenkins-shared-library',
  traits: [[$class: 'jenkins.plugins.git.traits.BranchDiscoveryTrait']]
])

pipeline {
  agent any

  stages {
    stage('Demo') {
      steps {
        script {
          mvn.fake()
        }
      }
    }
  }
}
```

<span style="color:red;font-weight:bold;">等同于 Global Untrusted Pipeline Libraries </span>

:::tip

说明
根据需要，为 agent 指定 label。
:::

- **Global Trusted Pipeline Libraries**

或者，使用以 **@Library('<配置好的共享库名称>') _** 开头的 Jenkinsfile。如果使用这种类型的 Jenkinsfile，需要提前在 Jenkins 仪表板上配置共享库。在本教程中，您可以使用以下示例 Jenkinsfile。

**流水线：** demo-shared-library-trusted

```bash
// 👆 注意：这里的名字必须和你 Jenkins 系统配置里填的 "Name" 完全一致！
// 👆 最后的下划线 "_" 非常重要，它表示把库里的全局变量导入当前作用域。
@Library('demo-shared-library') _

pipeline {
  agent any

  stages {
    stage('Demo') {
      steps {
        script {
          mvn.fake()
        }
      }
    }
  }
}
```

**流水线：** demo-shared-library-trusted-call

```bash
// 👆 注意：这里的名字必须和你 Jenkins 系统配置里填的 "Name" 完全一致！
// 👆 最后的下划线 "_" 非常重要，它表示把库里的全局变量导入当前作用域。
@Library('demo-shared-library') _

// 直接调用，它会启动整个流程
pip() 
```

### 5.4 步骤 3：运行流水线

1. 在流水线详情页面，点击**运行**运行流水线。
2. 点击**运行记录**页签下的记录，查看流水线运行详情。点击**运行日志**查看日志详细信息。

## 6 为流水线设置电子邮件服务器

内置 Jenkins 无法与 KubeSphere 的通知系统共享相同的电子邮件配置。因此，您需要单独为 DevOps 流水线配置电子邮件服务器。

### 6.1 前提条件

- KubeSphere 平台需要安装并启用 **DevOps** 扩展组件。
- 您需要在 KubeSphere 平台具有**集群管理**权限。

### 6.2 操作步骤

1. 以具有**集群管理**权限的账户登录 KubeSphere Web 控制台。
2. 点击**集群管理**，进入一个集群。
3. 在左侧导航栏中选择**工作负载 > 部署**，从下拉列表中选择 **kubesphere-devops-system** 项目。点击 **devops-jenkins** 右侧的<img src="./images/more-3578506.svg" alt="more" style="width:25px;" />，并选择**编辑 YAML**。
4. 在 YAML 文件中编辑如下所示的字段。完成修改后，点击**确定**。

:::danger

警告
修改电子邮件服务器配置后，devops-jenkins 部署 (Deployment) 会重新启动。因此，DevOps 系统将在几分钟内不可用，请在适当的时候修改这些配置。

:::

| 环境变量名称    | 值                     | 描述信息                  |
| :-------------- | ---------------------- | :------------------------ |
| EMAIL_SMTP_HOST | smtp.163.com           | SMTP 服务器地址           |
| EMAIL_SMTP_PORT | ‘456’                  | SMTP 服务器端口（如：25） |
| EMAIL_FROM_ADDR | liming20110711@163.com | 电子邮件发件人地址        |
| EMAIL_FROM_NAME | KubeSphere             | 电子邮件发件人姓名        |
| EMAIL_FROM_PASS | - - -                  | 电子邮件发件人密码        |
| EMAIL_USE_SSL   | ‘true’                 | 是否启用 SSL 配置         |

## 7 工具集成

### 7.1、[将 SonarQube 集成到流水线](/devops/new/KubeSphere/04-%E7%AC%AC4%E7%AB%A0%20KubeSphere%E6%89%A9%E5%B1%95%E6%9C%8D%E5%8A%A1%E5%AE%89%E8%A3%85.html#_2-sonarqube%E4%BB%A3%E7%A0%81%E8%B4%A8%E9%87%8F%E6%8C%81%E7%BB%AD%E6%A3%80%E6%B5%8B%E5%B7%A5%E5%85%B7)

### 7.2、[将 Harbor 集成到流水线](/devops/new/KubeSphere/04-第4章%20KubeSphere扩展服务安装.html#_3-harbor企业级容器镜像仓库)

## 8 凭证

凭证是包含敏感信息的对象，例如用户名和密码、SSH 密钥和令牌 (Token)。当 DevOps 流水线运行时，会与外部环境中的对象进行交互，以执行一系列任务，包括拉取代码、推送和拉取镜像以及运行脚本等。此过程中需要提供相应的凭证，而这些凭证不会明文出现在流水线中。

具有必要权限的 DevOps 项目用户可以为 Jenkins 流水线配置凭证。用户在 DevOps 项目中添加或配置这些凭证后，便可以在 DevOps 项目中使用这些凭证与第三方应用程序进行交互。

目前，您可以在 DevOps 项目中创建以下类型的凭证：

- **用户名和密码**：用户名和密码，可以作为单独的组件处理，或者作为用冒号分隔的字符串（格式为 **username:password**）处理，例如 GitHub 和 GitLab 账户。
- **SSH 密钥**：带有私钥的用户名，SSH 公钥/私钥对。
- **访问令牌**：具有访问权限的令牌。
- **kubeconfig**：用于配置跨集群认证。

### 8.1 前提条件

- KubeSphere 平台需要安装并启用 **DevOps** 扩展组件。
- 已创建一个企业空间、一个 DevOps 项目和一个用户（例如 **project-regular**），并已邀请该用户至 DevOps 项目且授予 **operator** 角色。请参阅[邀请用户加入 DevOps 项目](https://docs.kubesphere.com.cn/v4.2.1/11-use-extensions/02-devops/02-devops-project-mangement/03-project-members/01-invite-a-user-to-a-project/)。

### 8.2 创建凭证

1. 以 **project-regular** 用户登录 KubeSphere 控制台并进入您的企业空间。

2. 在左侧导航栏选择 **DevOps > 凭证**。

3. 在页面左上角的下拉列表中选择一个 DevOps 项目。

4. 在页面点击**创建**。

5. 在弹出的**创建凭证**对话框，输入凭证名称，并选择凭证类型。不同的凭证类型需要设置的参数不同，具体请参考以下内容。


- 创建用户名和密码凭证

以创建 GitHub 用户凭证为例，您需要设置以下参数：

| 参数      | 描述                             |
| :-------- | :------------------------------- |
| 名称      | 设置凭证名称，如 **github-id**。 |
| 类型      | 选择**用户名和密码**。           |
| 用户名    | 输入您的 GitHub 用户名。         |
| 密码/令牌 | 输入您的 GitHub 令牌。           |
| 描述      | 凭证的简介。                     |

:::warning

注意
自 2021 年 8 月起，GitHub 要求使用基于令牌的身份验证，此处需要输入令牌，而非 GitHub 密码。有关如何生成令牌，请参阅创建个人访问令牌。

:::

:::tip

说明
如果您的账户或密码中包含特殊字符，例如 @ 和 $，可能会因为无法识别而在流水线运行时导致错误。在这种情况下，您需要先在一些第三方网站（例如 urlencoder）上对账户或密码进行编码，然后将输出结果复制粘贴作为您的凭证信息。

:::

- 创建 SSH 密钥凭证

| 参数     | 描述                                                     |
| :------- | :------------------------------------------------------- |
| 名称     | 设置凭证名称。                                           |
| 类型     | 选择 **SSH 密钥**。                                      |
| 用户名   | 输入您的用户名。                                         |
| 私钥     | 输入您的 SSH 密钥。                                      |
| 密码短语 | 输入密码短语。为了更好保护您的账户安全，建议设置该参数。 |
| 描述     | 凭证的简介。                                             |

- 创建访问令牌凭证

| 参数 | 描述               |
| :--- | :----------------- |
| 名称 | 设置凭证名称。     |
| 类型 | 选择**访问令牌**。 |
| 令牌 | 输入您的令牌。     |
| 描述 | 凭证的简介。       |

- 创建 kubeconfig 凭证

| 参数 | 描述                                                         |
| :--- | :----------------------------------------------------------- |
| 名称 | 设置凭证名称，例如 **demo-kubeconfig**。                     |
| 类型 | 选择 **kubeconfig**。                                        |
| 内容 | 系统自动获取当前 Kubernetes 集群的 kubeconfig 文件内容，并自动填充该字段，您无须做任何更改。但是访问其他集群时，您可能需要更改 kubeconfig。 |
| 描述 | 凭证的简介。                                                 |

:::tip

说明
用于配置集群访问的文件称为 kubeconfig 文件。这是引用配置文件的通用方法。有关更多信息，请参阅 Kubernetes 官方文档。

:::

### 8.3 查看和管理凭证

1. 点击已创建的凭证，进入其详情页面，查看凭证详情和与此凭证相关的所有事件。
2. 点击**操作 > 编辑**修改凭证信息，点击**操作 > 删除**删除凭证。

:::tip

说明
编辑凭证时，KubeSphere 不会显示现有密码/令牌信息。如果输入新的密码/令牌，则前一个将被覆盖。

:::

## 9 导入代码仓库

KubeSphere 支持导入 GitHub、GitLab、Bitbucket 或其它基于 Git 的代码仓库，如 Gitee。

下面以 Github 仓库为例，展示如何导入代码仓库。

### 9.1 前提条件

- KubeSphere 平台需要安装并启用 **DevOps** 扩展组件。
- 已创建一个企业空间、一个 DevOps 项目和一个用户（例如 **project-regular**），并已邀请该用户至 DevOps 项目且授予 **operator** 角色。请参阅[邀请用户加入 DevOps 项目](https://docs.kubesphere.com.cn/v4.2.1/11-use-extensions/02-devops/02-devops-project-mangement/03-project-members/01-invite-a-user-to-a-project/)。

### 9.2 操作步骤

1. 以 **project-regular** 用户登录 KubeSphere 控制台并进入您的企业空间。
2. 在左侧导航栏选择 **DevOps > 代码仓库**。
3. 在页面左上角的下拉列表中选择一个 DevOps 项目。
4. 在页面点击**创建**。
5. 在**导入代码仓库**对话框，输入代码仓库名称，点击选择代码仓库。

下表列举了支持导入的代码仓库和参数设置项。

- GitHub

  - **凭证**：选择访问代码仓库的凭证，如 github-id。

- GitLab

  - **GitLab 服务器地址**：选择 GitLab 服务器地址，默认值为 [https://gitlab.com](https://gitlab.com/)。
  - **项目组/所有者**：输入 GitLab 账号。
  - **凭证**：选择访问代码仓库的凭证。
  - **代码仓库**：选择代码仓库。

- Bitbucket

  - **Bitbucket 服务器地址**：设置 Bitbucket 服务器地址。
  - **凭证**：选择访问代码仓库的凭证。

- Git

  - **代码仓库地址**：输入代码仓库地址，如 [https://gitee.com](https://gitee.com/)。

  - **凭证**：选择访问代码仓库的凭证。

  - **TLS 证书设置**：可选择标准 TLS 验证、跳过 TLS 验证、或配置自签名证书。对于自建的代码仓库，没有添加证书可能导致访问失败，可以使用 “跳过 TLS 验证“或者“配置自签名证书”。

    - **标准 TLS 验证**： 适用于公有的代码仓库，如：GitHub、GitLab，无需特殊验证。

    - **跳过 TLS 验证**：此处的配置同时适用于 DevOps 代码仓库和持续部署代码仓库。

    - **配置自签名证书**：添加证书后，在此处选择即可。

      对于 DevOps 流水线，需要将证书添加到 agent namespace（默认为：`kubesphere-devops-worker` 项目）下的配置字典 `tls-certs` 中，在 `data` 下的 `ca.crt` 字段进行配置，若有多个可以换行后追加；

      对于 ArgoCD 持续部署，需要将证书添加到 `argocd` 项目下的配置字典 `argocd-tls-certs-cm` 中，追加 `data` 下的键值对, 其 key 为用户自定义域名或者 IP 地址，value 为证书。可参考[此文档](https://argo-cd.readthedocs.io/en/latest/operator-manual/declarative-setup/#repositories-using-self-signed-tls-certificates-or-are-signed-by-custom-ca)进行配置。

:::tip
说明
如需使用 GitLab 私有仓库，请参阅使用 GitLab 创建多分支流水线。
:::

6. 以下步骤以 GitHub 为例。在**凭证**区域，点击**创建凭证**。在弹出的**创建凭证**对话框，设置以下参数，点击**确定**。

- **名称**：输入凭证名称，如 **github-id**。
- **类型**：取值包括**用户名和密码**、**SSH 密钥**、**访问令牌**和 **kubeconfig**。在 DevOps 项目中，建议使用**用户名和密码**。
- **用户名**：默认用户名为 **admin**。
- **密码/令牌**：输入您的 GitHub 令牌。
- **描述**：添加描述信息。

:::tip

说明
更多关于如何添加凭证的信息，请参阅凭证。

:::

7. 在**凭证**下拉列表中，选择创建的凭证，点击**确定**。

8. 在弹出的 GitHub 仓库中，选择一个代码仓库，点击**确定**即可导入。导入的代码仓库将显示在列表中。
9. 点击代码仓库右侧的<img src="https://docs.kubesphere.com.cn/images/ks-qkcp/zh/icons/more.svg" alt="more" style="width:25px" />，可以执行以下操作：

- **编辑**：修改代码仓库别名和描述信息，以及重新选择代码仓库。
- **编辑 YAML**：编辑代码仓库 YAML 文件。
- **删除**：删除代码仓库。

## 10 使用 GitOps 实现应用持续部署

KubeSphere 引入了一种为云原生应用实现持续部署的理念 – GitOps。GitOps 的核心思想是拥有一个 Git 仓库，并将应用系统的申明式基础架构和应用程序存放在 Git 仓库中进行版本控制。GitOps 结合 Kubernetes 能够利用自动交付流水线将更改应用到指定的任意多个集群中，从而解决跨云部署的一致性问题。

### 10.1 前提条件

- KubeSphere 平台需要安装并启用 **DevOps** 扩展组件。
- 已创建一个企业空间、一个 DevOps 项目和一个用户（例如 **project-regular**），并已邀请该用户至 DevOps 项目且授予 **operator** 角色。请参阅[邀请用户加入 DevOps 项目](https://docs.kubesphere.com.cn/v4.2.1/11-use-extensions/02-devops/02-devops-project-mangement/03-project-members/01-invite-a-user-to-a-project/)。
- 已在企业空间的**项目管理 > 项目列表**中创建一个项目。

### 10.2 导入代码仓库

1. 以 **project-regular** 用户登录 KubeSphere 控制台并进入您的企业空间。
2. 在左侧导航栏，点击 **DevOps > 代码仓库**。
3. 在页面左上角的下拉列表中选择一个 DevOps 项目。
4. 在页面点击**创建**。
5. 在**导入代码仓库**对话框，输入代码仓库名称，如 **devops-spring-boot-gitops**，然后点击选择代码仓库。您也可以为代码仓库设置别名和添加描述信息。
6. 在**选择代码仓库**对话框，点击 **GitHub**，选择凭证，如 **github-id**，点击**确定**。根据凭证加载出仓库，选择一个，如：[devops-spring-boot-gitops](https://github.com/Rushing0711/devops-spring-boot-gitops)，然后点击**确定**。

:::tip

说明
若此处导入的是公共仓库，则不需要创建凭证。如果您添加的是私有仓库，则需要创建凭证。有关如何添加凭证的更多信息，请参阅凭证。

:::

### 10.3 创建持续部署

1. 在左侧导航栏，点击**持续部署**。
2. 在右侧的**持续部署**页面，点击**创建**。
3. 在**基本信息**页签，输入持续部署名称，如 **devops-spring-boot-gitops**。在**部署位置**区域，选择持续部署的部署集群和项目。点击**下一步**。
4. 在**代码仓库设置**页签，选择上一步创建的代码仓库，设置代码仓库的分支或标签以及 Kustomization 清单文件路径。点击**下一步**。

| 参数         | 描述                                                         |
| :----------- | :----------------------------------------------------------- |
| 修订版本     | Git 仓库中的 commit ID、分支或标签。例如，**master**, **v1.2.0**, **0a1b2c3** 或 **HEAD**。这里：<span style="color:#32CD32;font-weight:bold;">master</span> |
| 清单文件路径 | 设置清单文件路径。例如，**deployments/nginx** 或 **deployments/**。这里：<span style="color:#32CD32;font-weight:bold;">k8s/dev</span> |

:::tip

注意：k8s/dev/deployment.yaml中拉取镜像是从非公开的harbor中，配置了secret，需要提前创建。

```bash
$ kubectl create secret docker-registry harbor-secret \
  --docker-server=192.168.200.116:30002 \
  --docker-username='robot$ks-devops-harbor+robot-test' \
  --docker-password='qGBGzF7seF9uh9jCGqr6I6EtSiQzWsCT' \
  --docker-email=your-email@example.com \
  -n demo-project
```

:::

5. 在**同步策略**区域，根据需要选择**自动同步**或**手动同步**。

- **自动同步**：在检测到 Git 仓库中的清单与部署资源的实时状态之间存在差异时，根据设置的同步选项，自动触发应用程序同步。具体参数如下表所示。

| 参数                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| <span style="color:#32CD32;font-weight:bold;">清理资源</span> | 如果勾选，自动同步时会删除 Git 仓库中不存在的资源。不勾选时，自动同步触发时不会删除集群中的资源。 |
| <span style="color:#32CD32;font-weight:bold;">自恢复</span>  | 如果勾选，当检测到 Git 仓库中定义的状态与部署资源中有偏差时，将强制应用 Git 仓库中的定义。不勾选时，对部署资源做更改时不会触发自动同步。 |

- **手动同步**：根据设置的同步选项，手动触发应用程序同步。

6. 在**同步设置**区域，根据需要设置同步相关参数。

| 参数         | 描述                                                         |
| :----------- | :----------------------------------------------------------- |
| 跳过规范校验 | 跳过 **kubectl** 验证。执行 **kubectl apply** 时，增加 **--validate=false** 标识。 |
| 自动创建项目 | 在项目不存在的情况下自动为应用程序资源创建项目。             |
| 最后清理     | 同步操作时，其他资源都完成部署且处于健康状态后，再清理资源。 |
| 选择性同步   | 仅同步 **out-of-sync** 状态的资源。                          |

7. 在**依赖清理策略**区域，根据需要选择依赖清理策略。

| 参数                                                         | 描述                               |
| :----------------------------------------------------------- | :--------------------------------- |
| <span style="color:#32CD32;font-weight:bold;">foreground</span> | 先删除依赖资源，再删除主资源。     |
| background                                                   | 先删除主资源，再删除依赖资源。     |
| orphan                                                       | 删除主资源，留下依赖资源成为孤儿。 |

8. 在**替换资源**区域，选择是否需要替换已存在的资源。

:::tip

说明
如果勾选，将执行 kubectl replace/create 命令同步资源。不勾选时，使用 kubectl apply 命令同步资源。
:::

9. 点击**创建**。资源创建完成后将显示在持续部署列表中。
9. <span style="color:red;font-weight:bold;">说明：同步之前，先准备好镜像。可以[通过流水线生成](https://github.com/Rushing0711/devops-spring-boot-gitops/tree/master/ci)。</span>

### 10.4 查看持续部署信息

1. 在**持续部署**列表查看已创建的持续部署信息。具体参数如下表所示。

| 参数     | 描述                                                         |
| :------- | :----------------------------------------------------------- |
| 名称     | 持续部署的名称。                                             |
| 健康状态 | 持续部署的健康状态。主要包含以下几种状态：**健康**：资源健康。**已降级**：资源已经被降级。**进行中**：资源正在同步。默认返回该状态。**已暂停**：资源已经被暂停并等待恢复。**未知**：资源健康状态未知。**缺失**：资源已缺失。 |
| 同步状态 | 持续部署的同步状态。主要包含以下几种状态：**已同步**：资源同步已完成。**未同步**：资源的实际运行状态和期望状态不一致。**未知**：资源同步状态未知。 |
| 部署位置 | 资源部署的集群和项目。                                       |
| 更新时间 | 资源更新的时间。                                             |

点击持续部署右侧的<img src="./images/more.svg" alt="more" style="width:25px;" />，您可以执行以下操作：

- **编辑信息**：编辑别名和描述信息。
- **编辑 YAML**：编辑持续部署的 YAML 文件。
- **同步**：触发资源同步。
- **删除**：删除持续部署。

:::danger
警告
删除持续部署的同时会删掉和该持续部署关联的资源。请谨慎操作。
:::

3. 点击持续部署名称进入详情页面，查看同步状态和同步结果。

### 10.5 访问已创建的应用

1. 在左侧导航栏，点击**服务与网络** > **服务**，在项目下拉列表中选择持续部署所属的项目。
2. 在**服务**列表，找到已部署的应用，并点击右侧<img src="./images/more-20260307214001463.svg" alt="more" style="width:25px;" />，选择**编辑外部访问**。
3. 在**访问模式**中选择 **NodePort**，点击**确定**。
4. 在服务列表页面的**外部访问**列，查看暴露的端口，
5. 通过 {Node IP}:{NodePort} 访问此应用。

:::tip

说明
在访问服务之前，请确保安全组中的端口已打开。

:::



## 11 流水线基础

### 11.1 为依赖项缓存设置 CI 节点

构建应用程序通常需要拉取不同的依赖项。拉取过程中可能会遇到某些问题，例如拉取时间长、网络不稳定，进而导致构建失败。为了提供更可靠和稳定的环境，可以配置节点或节点组，专门用于持续集成 (CI)，并通过使用缓存来加快构建过程。

#### 11.1.1 前提条件

您需要在 KubeSphere 平台具有**集群管理**权限。

#### 11.1.2 标记 CI 节点

1. 以具有**集群管理**权限的账户登录 KubeSphere Web 控制台。
2. 点击**集群管理**，进入一个集群。
3. 在左侧导航栏中选择**节点**下的**集群节点**，查看当前集群中的现有节点。
4. 从列表中选择一个节点用来运行 CI 任务。点击节点名称转到其详情页面，点击**操作** > **编辑标签**。
5. 在弹出的对话框中，在键为 **node-role.kubernetes.io/worker** 的后面，输入 **ci** 作为此标签的值，点击**确定**。

#### 11.1.3 给 CI 节点添加污点

流水线一般会根据[节点亲和性](https://kubernetes.io/zh/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)来确定是否调度任务到某一节点。如果要将节点专用于 CI 任务，即不允许将其他工作负载调度到该节点，可以在该节点上添加[污点](https://kubernetes.io/zh/docs/concepts/scheduling-eviction/taint-and-toleration/)。

1. 点击**操作** > **编辑污点**。
2. 点击**添加**，输入键 **node.kubernetes.io/ci** 而不指定值。根据需要选择**阻止调度**、**尽可能阻止调度**或**阻止调度并驱逐现有容器组** 。
3. 点击**确定**。KubeSphere 将根据您设置的污点调度任务。



### 11.2 选择 Jenkins Agent

**agent** 部分指定整个流水线或特定阶段 (Stage) 将在 Jenkins 环境中执行的位置，具体取决于该 **agent** 部分的放置位置。该部分必须在 **pipeline** 块的顶层进行定义，但是阶段级别的使用是可选的。有关更多信息，请参阅 [Jenkins 官方文档](https://www.jenkins.io/zh/doc/book/pipeline/syntax/#代理)。

#### 11.2.1 内置 podTemplate

podTemplate 是一种 Pod 模板，用于创建 Agent。您可以定义在 Kubernetes 插件中使用的 podTemplate。

在流水线运行期间，每个 Jenkins Agent Pod 必须具有一个名为 **jnlp** 的容器，以便实现 Jenkins Controller 与 Jenkins Agent 之间的通信。此外，您可以在 podTemplate 中添加容器，以满足个性化需求。可选择使用自定义的 Pod YAML 来灵活控制运行时环境（Runtime），并通过 **container** 命令来切换容器。以下是相关示例。

- **normal-customized** 含2个容器`maven`和`jnlp`

```bash
pipeline {
  agent {
    kubernetes {
      //cloud 'kubernetes'
      label 'normal-customized'
      yaml """
        apiVersion: v1
        kind: Pod
        spec:
          nodeSelector:
            node-role.kubernetes.io/worker: ci
          tolerations:
          - key: node.kubernetes.io/ci
            operator: Exists
            effect: NoSchedule
          - key: node.kubernetes.io/ci
            operator: Exists
            effect: PreferNoSchedule
          containers:
          - name: maven
            image: docker.io/library/maven:3.9.12-eclipse-temurin-21-alpine
            command: ['cat']
            tty: true
      """
    }
  }
  stages {
    stage('Run maven') {
      steps {
        container('maven') {
          sh 'mvn -version'
        }
      }
    }
  }
}
```

在当前版本中，KubeSphere 内置了一类 podTemplate：**base**，并且在 Pod 中提供隔离的 Docker 环境。

您可以通过指定 Agent 的标签来使用内置 podTemplate。例如，要使用 nodejs 的 podTemplate，在创建流水线时指定标签为 **nodejs** 即可，具体参阅以下示例。

- **base** 含2个容器`base`和`jnlp`

```bash
pipeline {
  agent {
    kubernetes {
      label 'base'
    }
  }

  stages {
    stage('nodejs hello') {
      steps {
        container('base') {
        	sh 'java -version'
        	sh 'mvn -version'
        	sh 'python3 --version'
          sh 'yarn -v'
          sh 'node -v'
          sh 'npm -v'
          sh 'pnpm -v'
          sh 'nerdctl version'
          sh 'nerdctl images'
          sh 'helm version'
        }
      }
    }
  }
}
```

还可以继承base容器。

- **base-customized** 含3个容器`maven`、`base`和`jnlp`

```bash
/**
 * 获取指定节点的标签列表
 * @NonCPS 是关键：告诉 Jenkins 不要转换此方法，也不要序列化其中的对象
 */
@NonCPS
def getNodeLabels(String nodeName) {
	try {
		// 获取 Node 对象 (这可能触发沙箱检查，需确保有权限)
		def node = Jenkins.instance.getNode(nodeName)
		if (node == null) {
			return ["Node not found: ${nodeName}"]
		}
		// 获取标签集合
		def labelSet = node.getAssignedLabels()
		return labelSet.collect {
			it.toString()
		}
	} catch (Exception e) {
		// 捕获可能的 AccessDeniedException 或其他错误
		return ["Error accessing node info: ${e.message} (Check Script Approval or Permissions)"]
	}
}

pipeline {
	agent {
		kubernetes {
		  label 'base-customized'
			// 1. 指定继承全局配置的 base 模板
			inheritFrom 'base'
			// 2. 这里的 yaml 将会合并到 base 模板中。注意：不需要再写 label，inheritFrom 会自动处理
			yaml """
        spec:
          nodeSelector:
            node-role.kubernetes.io/worker: ci
          tolerations:
          - key: node.kubernetes.io/ci
            operator: Exists
            effect: NoSchedule
          - key: node.kubernetes.io/ci
            operator: Exists
            effect: PreferNoSchedule
          volumes:
            # 确保工作目录挂载一致，以便共享代码
            - name: workspace-volume
              emptyDir: {}
          containers:
            - name: maven
              image: docker.io/library/maven:3.9.12-eclipse-temurin-21-alpine
              tty: true
              command: ["cat"]
              volumeMounts:
                - name: workspace-volume
                  mountPath: /home/jenkins/agent
      """
		}
	}

	environment {
		// 您 Harbor 仓库的地址。
		HARBOR_ADDR = '192.168.200.116:30002'
		// 项目名称，请确保您的机器人账户具有足够的项目访问权限。
		HARBOR_PROJECT = 'ks-devops-harbor'
		// Docker 镜像名称。
		APP_NAME = 'docker-example'
		// ‘robot-test’ 是您在 KubeSphere Web 控制台上创建的凭证 ID。
		HARBOR_CREDENTIAL = credentials('robot-test')
	}

	stages {
		stage('check node labels') {
			steps {
				script {
					sh "env"
					// 获取当前节点的所有标签
					def labels = getNodeLabels(env.NODE_NAME)
					echo "Node name: ${env.NODE_NAME}"
					// 输出类似: Node labels: [base-customized-shcvs-g36nv, base-customized]
					echo "Node labels: ${labels}"
				}
			}
		}

		stage('debug shared workspace') {
			steps {
				script {
					// 在 base 容器写文件
					container('base') {
						sh 'echo "Hello from Base" > /home/jenkins/agent/test.txt'
						sh 'ls -l /home/jenkins/agent/'
					}
					// 在 maven 容器读文件
					container('maven') {
						sh 'ls -l /home/jenkins/agent/'
						// 如果没挂载，这里会报错 file not found，或者看不到 test.txt
						sh 'cat /home/jenkins/agent/test.txt'
					}
				}
			}
		}
	}
}
```

#### 11.2.2 podTemplate base

| 名称               | 类型/版本                                 |
| :----------------- | :---------------------------------------- |
| Jenkins Agent 标签 | base, go, java, jdk, maven, nodejs 等     |
| 容器名称           | base                                      |
| 操作系统           | Ubuntu 24.04                              |
| Docker             | 最新稳定版                                |
| Helm               | 最新稳定版                                |
| Kubectl            | 最新稳定版                                |
| 内置工具           | unzip、which、make、wget、zip、bzip2、git |

### 11.3 自定义 Jenkins Agent

若要使用运行特定环境（例如 JDK 11）的 Jenkins Agent，可以在 KubeSphere 上自定义 Jenkins Agent。

本文档描述如何在 KubeSphere 上自定义 Jenkins Agent。

#### 11.3.1 前提条件

KubeSphere 平台需要安装并启用 **DevOps** 扩展组件。

#### 11.3.2 自定义 Jenkins Agent

1. 以 **admin** 用户登录 KubeSphere Web 控制台。
2. 点击**集群管理**，进入一个集群。
3. 在左侧导航栏选择**配置**下的**配置字典**。
4. 在**配置字典**页面的搜索框中输入 **jenkins-casc-config** 并按**回车键**。
5. 点击 **jenkins-casc-config** 进入其详情页面，点击**操作**，选择**编辑 YAML**。
6. 在弹出的对话框中，搜寻至 **data:jenkins_user.yaml:jenkins:clouds:kubernetes:templates** 下方并输入以下代码，点击**确定**。

```bash
  jenkins_user.yaml: |
    jenkins:
      mode: EXCLUSIVE
      numExecutors: 0
      scmCheckoutRetryCount: 2
      disableRememberMe: true
      clouds:
        - kubernetes:
            name: "kubernetes"
            serverUrl: "https://kubernetes.default"
            skipTlsVerify: true
            namespace: "kubesphere-devops-worker"
            credentialsId: "k8s-service-account"
            jenkinsUrl: "http://devops-jenkins.kubesphere-devops-system:80"
            jenkinsTunnel: "devops-jenkins-agent.kubesphere-devops-system:50000"
            containerCapStr: "10"
            connectTimeout: "60"
            readTimeout: "60"
            maxRequestsPerHostStr: "32"
            templates:
              - name: "maven-jdk8" # [!code ++][!code focus:24]
                label: "maven jdk8" # [!code ++]
                inheritFrom: "base" # [!code ++]
                containers: # [!code ++]
                  - name: "maven-jdk8" # [!code ++]
                    image: "maven:3.9.14-eclipse-temurin-8-noble" # [!code ++]
                    command: "cat" # [!code ++]
                    ttyEnabled: true # [!code ++]
              - name: "maven-jdk11" # [!code ++]
                label: "maven jdk11" # [!code ++]
                inheritFrom: "base" # [!code ++]
                containers: # [!code ++]
                  - name: "maven-jdk11" # [!code ++]
                    image: "maven:3.9.14-eclipse-temurin-11-noble" # [!code ++]
                    command: "cat" # [!code ++]
                    ttyEnabled: true # [!code ++]
              - name: "maven-jdk17" # [!code ++]
                label: "maven jdk17" # [!code ++]
                inheritFrom: "base" # [!code ++]
                containers: # [!code ++]
                  - name: "maven-jdk17" # [!code ++]
                    image: "maven:3.9.14-eclipse-temurin-17-noble" # [!code ++]
                    command: "cat" # [!code ++]
                    ttyEnabled: true # [!code ++]
              - name: "base"
                namespace: "kubesphere-devops-worker"
                label: "base python nodejs go java jdk maven kubectl helm docker podman npm yarn gradle ant kustomize sonar-scanner"
                nodeUsageMode: "NORMAL"
                idleMinutes: 0
                containers:
                  - name: "base"
                    image: "docker.io/kubesphere/builder-base:v4.2.1"
                    command: "cat"
                    args: ""
                    ttyEnabled: true
```

7. 等待 1 ~ 2 分钟，会自动重新加载新的配置。

8. 要使用自定义的 Jenkins Agent，请参考下方的示例 Jenkinsfile，在创建流水线时指定自定义 Jenkins Agent 对应的标签和容器名。

- **multi-jdk**

```bash
pipeline {
  agent none 

  stages {
    stage('Build on JDK 8') {
      agent {
        kubernetes { label 'jdk8' }  // 切换到 JDK 8 的模板
      }
      // 若agent后面只有一步，也可以省略 stages->stage的组合
      steps {
        // 此时 Pod 里只有 maven-jdk8 容器 (和 base 以及 jnlp)
        container('maven-jdk8') {
          sh 'mvn -v && java -version'
        }
      }
    }

    stage('Build on JDK 11') {
      agent {
        kubernetes { label 'maven jdk11' } // 切换到 JDK 11 的模板
      }
      stages {
        stage('Check Env') {
          steps {
            container('maven-jdk11') {
              sh 'mvn -v && java -version'
            }
          }
        }
      }
    }

    stage('Build on JDK 17') {
      agent {
        node { label 'maven && jdk17' } // 切换到 JDK 17 的模板
      }
      stages {
        stage('Check Env') {
          steps {
            container('maven-jdk17') {
              sh 'mvn -v && java -version'
            }
          }
        }
      }
    }
  }
}
```

### 11.4 Jenkins Agent使用总结

#### 11.4.1 **如何选择代理执行节点：**

- 方式一：需要`jenkins-casc-config`中定义了对应标签的容器组。（<span style="color:red;font-weight:bold;">不推荐</span>）

```bash
agent {
	node {
		label 'x && y'
	}
}
```

- 方式二：也需要`jenkins-casc-config`中定义了对应标签的容器组。（<span style="color:red;font-weight:bold;">推荐</span>）

```bash
agent {
	kubernetes {
		label 'x y'
	}
}
```

- 方式三：可以额外定义容器，比如：jdk8。（<span style="color:red;font-weight:bold;">推荐</span>）

```bash
agent {
	kubernetes {
		label 'x y'
		inheritFrom 'base' # 继承，不是必须的
		yaml '''
		'''
	}
}
```

#### 11.4.2 **agent{node{}} VS agent{kubernetes{}}：**

**场景 A：**`agent { kubernetes { ... } }` **(原生模式)**

- **发起者**：**Kubernetes 插件**直接接管。
- **流程**：
  1. Pipeline 解析到 `agent { kubernetes }`。
  2. 插件直接调用 K8s API 创建 Pod。
  3. Pod 启动，JNLP 连接建立。
  4. 插件**立即**在内存中注册一个临时 Node 对象，并绑定给当前构建。
  5. **特点**：这个 Node 对象的生命周期与 Pod **严格绑定**。Pod 删，Node 立刻删。它通常不会经过 Jenkins 传统的“节点标签匹配队列”逻辑，而是直达。

**场景 B：**`agent { node { label '...' } }` **(兼容模式)**

- **发起者**：**Jenkins Core 调度器**。
- **流程**：
  1. Pipeline 解析到 `agent { node { label 'xxx' } }`。
  2. Jenkins Core 说：“我要找一个标签为 `xxx` 的空闲节点。”
  3. Core 去查节点列表，没找到（或者都在忙）。
  4. Core 触发 **Cloud Provisioning (云供给)** 机制，问 Kubernetes 插件：“你能给我一个标签为 `xxx` 的节点吗？”
  5. Kubernetes 插件收到请求，创建 Pod。
  6. Pod 启动，连接，插件注册 Node 对象。
  7. Jenkins Core 发现：“哈！现在有一个标签匹配的节点了！” -> 分配任务。
  8. **特点**：多了一层“Core 调度 -> 云供给 -> 注册 -> Core 发现”的过程。这就是为什么有时候 `node` 模式启动稍慢，且容易看到任务在队列里显示 "Waiting for next available executor"。



| 特性                 | `agent { kubernetes { ... } }`   (原生模式)                  | `agent { node { label '...' } }`   (兼容模式)                |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 底层机制             | 直接调用 K8s API 创建 Pod，绕过 Jenkins Node 注册流程。      | 先让 K8s 插件创建一个 Pod，将其注册为临时 Jenkins Node，再由 Core 调度。 |
| 启动速度             | 🚀 极快。Pod 启动即连接，无额外注册开销。                     | 🐢 稍慢。需等待 Pod 启动 + JNLP 连接 + Node 注册完成。        |
| 配置灵活性           | ⭐⭐⭐⭐⭐ 极高。 支持直接在 Pipeline 中覆盖镜像、环境变量、Volumes、容器参数。 | ⭐⭐ 低。 只能引用 Casc/Cloud 中预定义的 Label，无法在 Pipeline 中动态修改容器细节。 |
| 多容器支持           | ✅ 原生支持。 可轻松定义 `containers { }` 块，添加 Sidecar 容器（如 Docker-in-Docker）。 | ❌ 不支持。 只能使用模板中预定义好的容器组合，无法临时追加。  |
| 工作空间 (Workspace) | 默认挂载 emptyDir 或 PVC，逻辑清晰，专为 K8s 设计。          | 沿用传统 Node 的 Workspace 逻辑，有时在 K8s  ephemeral 环境下会有路径混淆。 |
| 调试体验             | 🛠️ 友好。 日志直接显示 Pod 创建过程、事件、容器启动日志。     | 🕵️ 黑盒。 报错常显示 "No node found with label..."，难以区分是节点没注册还是标签不匹配。 |
| 适用场景             | 云原生 CI/CD、动态环境、需要临时定制镜像的场景。             | 迁移旧项目、团队只熟悉传统语法、环境极其固定且无需定制的场景。 |


### 11.5 增强KubeSphere默认base构建镜像的能力

#### 11.5.1 添加nerdctl+buildctl能力（<span style="color:red;font-weight:bold;">修改后需要重启部署devops-jenkins，或等待1-2分钟自动加载</span>）

**背景**：为了支持在 Jenkins Pod 中使用 `nerdctl` 命令直接调用宿主机节点的 `containerd` 和 `buildkit` 服务进行镜像构建，替代传统的 Docker-in-Docker (DinD) 模式。

**目标**：在 **KubeSphere 4.2.1** 的 Jenkins Kubernetes Agent（动态构建节点）中，**启用并配置 `nerdctl` + `buildkit` + `containerd` 的原生容器构建能力**。

传统的 Jenkins Docker 构建通常依赖 Docker Daemon (`docker.sock`)，但在 KubeSphere 这种基于 Kubernetes 的环境中，更推荐直接使用底层的 `containerd` 运行时配合 `buildkit` 进行构建，这样更安全、高效且符合云原生架构。

**操作**：登录KubeSphere控制台，进入主集群，在 配置==>配置字典 中搜索到`jenkins-casc-config`配置，编辑内容。

:::details 查看配置

```js
kind: ConfigMap
apiVersion: v1
metadata:
  name: jenkins-casc-config
  namespace: kubesphere-devops-system
  creationTimestamp: '2026-02-05T15:27:59Z'
  labels:
    app.kubernetes.io/managed-by: Helm
    kubesphere.io/extension-ref: devops
  annotations:
    devops.kubesphere.io/jenkins-config-customized: 'true'
    devops.kubesphere.io/jenkins-config-formula: custom
    meta.helm.sh/release-name: devops-agent
    meta.helm.sh/release-namespace: kubesphere-devops-system
data:
  jenkins.yaml: |
    jenkins:
      mode: EXCLUSIVE
      numExecutors: 0
      scmCheckoutRetryCount: 2
      disableRememberMe: true

      clouds:
        - kubernetes:
            name: "kubernetes"
            serverUrl: "https://kubernetes.default"
            skipTlsVerify: true
            namespace: "kubesphere-devops-worker"
            credentialsId: "k8s-service-account"
            jenkinsUrl: "http://devops-jenkins.kubesphere-devops-system:80"
            jenkinsTunnel: "devops-jenkins-agent.kubesphere-devops-system:50000"
            containerCapStr: "10"
            connectTimeout: "60"
            readTimeout: "60"
            maxRequestsPerHostStr: "32"
            templates:
              - name: "base"
                namespace: "kubesphere-devops-worker"
                label: "base python nodejs go java jdk maven kubectl helm docker podman npm yarn gradle ant kustomize sonar-scanner"
                nodeUsageMode: "NORMAL"
                idleMinutes: 0
                containers:
                - name: "base"
                  image: "docker.io/kubesphere/builder-base:v4.2.1"
                  command: "cat"
                  args: ""
                  ttyEnabled: true
                  privileged: false
                  resourceRequestCpu: "100m"
                  resourceLimitCpu: "4000m"
                  resourceRequestMemory: "100Mi"
                  resourceLimitMemory: "8192Mi"
                - name: "jnlp"
                  image: "docker.io/jenkins/inbound-agent:3355.v388858a_47b_33-4-jdk21"
                  args: "^${computer.jnlpmac} ^${computer.name}"
                  resourceRequestCpu: "50m"
                  resourceLimitCpu: "500m"
                  resourceRequestMemory: "400Mi"
                  resourceLimitMemory: "1536Mi"
                workspaceVolume:
                  emptyDirWorkspaceVolume:
                    memory: false
                volumes:
                - configMapVolume:
                    configMapName: "podman-config"
                    optional: true
                    mountPath: "/etc/containers/registries.conf"
                    subPath: "registries.conf"
                - configMapVolume:
                    configMapName: "tls-certs"
                    optional: true
                    mountPath: "/etc/ssl/certs/ca.crt"
                    subPath: "ca.crt"
                - hostPathVolume:
                    hostPath: "/var/run/docker.sock"
                    mountPath: "/var/run/docker.sock"
                - hostPathVolume:
                    hostPath: "/var/data/jenkins_sonar_cache"
                    mountPath: "/root/.sonar/cache"
                - hostPathVolume:
                    hostPath: "/var/data/jenkins_python_pip_cache"
                    mountPath: "/root/.cache/pip"
                - hostPathVolume:
                    hostPath: "/var/data/jenkins_python_pipenv_cache"
                    mountPath: "/root/.local/share/virtualenvs"
                - hostPathVolume:
                    hostPath: "/var/data/jenkins_nodejs_yarn_cache"
                    mountPath: "/root/.yarn"
                - hostPathVolume:
                    hostPath: "/var/data/jenkins_nodejs_npm_cache"
                    mountPath: "/root/.npm"
                - hostPathVolume:
                    hostPath: "/var/data/jenkins_maven_cache"
                    mountPath: "/root/.m2"
                - hostPathVolume:
                    hostPath: "/var/data/jenkins_go_cache"
                    mountPath: "/home/jenkins/go/pkg"
                yaml: |
                  spec:
                    activeDeadlineSeconds: 21600
                    affinity:
                      nodeAffinity:
                        preferredDuringSchedulingIgnoredDuringExecution:
                        - weight: 1
                          preference:
                            matchExpressions:
                            - key: node-role.kubernetes.io/worker
                              operator: In
                              values:
                              - ci
                    tolerations:
                    - key: "node.kubernetes.io/ci"
                      operator: "Exists"
                      effect: "NoSchedule"
                    - key: "node.kubernetes.io/ci"
                      operator: "Exists"
                      effect: "PreferNoSchedule"
                    containers:
                    - name: "base"
                      resources:
                        requests:
                          ephemeral-storage: "1Gi"
                        limits:
                          ephemeral-storage: "10Gi"
                      volumeMounts:
                      - name: config-volume
                        mountPath: /opt/apache-maven/conf/settings.xml
                        subPath: settings.xml
                    volumes:
                      - name: config-volume
                        configMap:
                          name: ks-devops-agent
                          items:
                          - key: MavenSetting
                            path: settings.xml
                    securityContext:
                      fsGroup: 1000

      securityRealm:
        local:
          allowsSignup: false

    unclassified:
      eventDispatcher:
        receiver: "http://devops-apiserver.kubesphere-devops-system:9090/v1alpha3/webhooks/jenkins"
      gitLabServers:
        servers:
        - name: https://gitlab.com
          serverUrl: https://gitlab.com
  jenkins_user.yaml: |
    jenkins:
      mode: EXCLUSIVE
      numExecutors: 0
      scmCheckoutRetryCount: 2
      disableRememberMe: true
      clouds:
        - kubernetes:
            name: "kubernetes"
            serverUrl: "https://kubernetes.default"
            skipTlsVerify: true
            namespace: "kubesphere-devops-worker"
            credentialsId: "k8s-service-account"
            jenkinsUrl: "http://devops-jenkins.kubesphere-devops-system:80"
            jenkinsTunnel: "devops-jenkins-agent.kubesphere-devops-system:50000"
            containerCapStr: "10"
            connectTimeout: "60"
            readTimeout: "60"
            maxRequestsPerHostStr: "32"
            templates:
              // 0. 继承基础模板的JDK模板（后定义，确保继承生效） // [!code --][!code focus:25]
              - name: "maven-jdk8" // [!code ++]
                label: "maven jdk8" // [!code ++]
                inheritFrom: "base" // [!code ++]
                containers: // [!code ++]
                  - name: "maven-jdk8" // [!code ++]
                    image: "maven:3.9.14-eclipse-temurin-8-noble" // [!code ++]
                    command: "cat" // [!code ++]
                    ttyEnabled: true // [!code ++]
              - name: "maven-jdk11" // [!code ++]
                label: "maven jdk11" // [!code ++]
                inheritFrom: "base" // [!code ++]
                containers: // [!code ++]
                  - name: "maven-jdk11" // [!code ++]
                    image: "maven:3.9.14-eclipse-temurin-11-noble" // [!code ++]
                    command: "cat" // [!code ++]
                    ttyEnabled: true // [!code ++]
              - name: "maven-jdk17" // [!code ++]
                label: "maven jdk17" // [!code ++]
                inheritFrom: "base" // [!code ++]
                containers: // [!code ++]
                  - name: "maven-jdk17" // [!code ++]
                    image: "maven:3.9.14-eclipse-temurin-17-noble" // [!code ++]
                    command: "cat" // [!code ++]
                    ttyEnabled: true // [!code ++]
              - name: "base"
                namespace: "kubesphere-devops-worker"
                label: "base python nodejs go java jdk maven kubectl helm docker podman npm yarn gradle ant kustomize sonar-scanner"
                nodeUsageMode: "NORMAL"
                idleMinutes: 0
                containers:
                  - name: "base"
                    image: "docker.io/kubesphere/builder-base:v4.2.1"
                    command: "cat"
                    args: ""
                    ttyEnabled: true
                    privileged: false
                    resourceRequestCpu: "100m"
                    resourceLimitCpu: "4000m"
                    resourceRequestMemory: "100Mi"
                    resourceLimitMemory: "8192Mi"
                    // 1. 第一处：环境变量注入 (EnvVars) // [!code --][!code focus:7]
                    envVars: // [!code ++]
                      - envVar: // [!code ++]
                          key: "BUILDKIT_HOST" // [!code ++]
                          value: "unix:///run/buildkit/buildkitd.sock" // [!code ++]
                      - envVar: // [!code ++]
                          key: "CONTAINERD_ADDRESS" // [!code ++]
                          value: "unix:///run/containerd/containerd.sock" // [!code ++]
                  - name: "jnlp"
                    image: "docker.io/jenkins/inbound-agent:3355.v388858a_47b_33-4-jdk21"
                    args: "^${computer.jnlpmac} ^${computer.name}"
                    resourceRequestCpu: "50m"
                    resourceLimitCpu: "500m"
                    resourceRequestMemory: "400Mi"
                    resourceLimitMemory: "1536Mi"
                workspaceVolume:
                  emptyDirWorkspaceVolume:
                    memory: false
                volumes:
                  - configMapVolume:
                      configMapName: "podman-config"
                      optional: true
                      mountPath: "/etc/containers/registries.conf"
                      subPath: "registries.conf"
                  - configMapVolume:
                      configMapName: "tls-certs"
                      optional: true
                      mountPath: "/etc/ssl/certs/ca.crt"
                      subPath: "ca.crt"
                  - hostPathVolume:
                      hostPath: "/var/run/docker.sock"
                      mountPath: "/var/run/docker.sock"
                  // 2. 第二处：Pod 级别卷定义 (Volumes - JCasC 语法) // [!code --][!code focus:7]
                  - hostPathVolume: // [!code ++]
                      hostPath: "/run/buildkit/buildkitd.sock" // [!code ++]
                      mountPath: "/run/buildkit/buildkitd.sock" // [!code ++]
                  - hostPathVolume: // [!code ++]
                      hostPath: "/run/containerd/containerd.sock" // [!code ++]
                      mountPath: "/run/containerd/containerd.sock" // [!code ++]
                  - hostPathVolume:
                      hostPath: "/var/data/jenkins_sonar_cache"
                      mountPath: "/root/.sonar/cache"
                  - hostPathVolume:
                      hostPath: "/var/data/jenkins_python_pip_cache"
                      mountPath: "/root/.cache/pip"
                  - hostPathVolume:
                      hostPath: "/var/data/jenkins_python_pipenv_cache"
                      mountPath: "/root/.local/share/virtualenvs"
                  - hostPathVolume:
                      hostPath: "/var/data/jenkins_nodejs_yarn_cache"
                      mountPath: "/root/.yarn"
                  - hostPathVolume:
                      hostPath: "/var/data/jenkins_nodejs_npm_cache"
                      mountPath: "/root/.npm"
                  - hostPathVolume:
                      hostPath: "/var/data/jenkins_maven_cache"
                      mountPath: "/root/.m2"
                  - hostPathVolume:
                      hostPath: "/var/data/jenkins_go_cache"
                      mountPath: "/home/jenkins/go/pkg"
                yaml: |
                  spec:
                    activeDeadlineSeconds: 21600
                    affinity:
                      nodeAffinity:
                        preferredDuringSchedulingIgnoredDuringExecution:
                        - weight: 1
                          preference:
                            matchExpressions:
                            - key: node-role.kubernetes.io/worker
                              operator: In
                              values:
                              - ci
                    tolerations:
                    - key: "node.kubernetes.io/ci"
                      operator: "Exists"
                      effect: "NoSchedule"
                    - key: "node.kubernetes.io/ci"
                      operator: "Exists"
                      effect: "PreferNoSchedule"
                    containers:
                    - name: "base"
                      resources:
                        requests:
                          ephemeral-storage: "1Gi"
                        limits:
                          ephemeral-storage: "10Gi"
                      volumeMounts:
                      - name: config-volume
                        mountPath: /opt/apache-maven/conf/settings.xml
                        subPath: settings.xml
                      // 3. 第三处：容器内挂载点定义 (VolumeMounts) // [!code --][!code focus:9]
                      - name: containerd-sock // [!code ++]
                        mountPath: /run/containerd/containerd.sock // [!code ++]
                      - name: buildkit-sock // [!code ++]
                        mountPath: /run/buildkit/buildkitd.sock // [!code ++]
                      - name: nerdctl-binary // [!code ++]
                        mountPath: /usr/local/bin/nerdctl // [!code ++]
                      - name: buildctl-binary // [!code ++]
                        mountPath: /usr/local/bin/buildctl // [!code ++]
                    volumes:
                      - name: config-volume
                        configMap:
                          name: ks-devops-agent
                          items:
                          - key: MavenSetting
                            path: settings.xml
                      // 4. 第四处：卷源定义 (Volumes - Kubernetes Spec) // [!code --][!code focus:13]
                      - name: containerd-sock // [!code ++]
                        hostPath: // [!code ++]
                          path: /run/containerd/containerd.sock // [!code ++]
                      - name: buildkit-sock // [!code ++]
                        hostPath: // [!code ++]
                          path: /run/buildkit/buildkitd.sock // [!code ++]
                      - name: nerdctl-binary // [!code ++]
                        hostPath: // [!code ++]
                          path: /usr/local/bin/nerdctl // [!code ++]
                      - name: buildctl-binary // [!code ++]
                        hostPath: // [!code ++]
                          path: /usr/local/bin/buildctl // [!code ++]
                    securityContext:
                      fsGroup: 1000
      securityRealm:
        local:
          allowsSignup: false
    unclassified:
      eventDispatcher:
        receiver: "http://devops-apiserver.kubesphere-devops-system:9090/v1alpha3/webhooks/jenkins"
      gitLabServers:
        servers:
          - name: https://gitlab.com
            serverUrl: https://gitlab.com
```

**第一处：环境变量注入 (EnvVars)：**

- 作用解释：
  - 告知工具连接地址：在 Pod 内部运行的构建工具（如 buildctl 或 nerdctl）需要知道后端服务的 socket 地址。
  - BUILDKIT_HOST：告诉 buildctl 或支持 BuildKit 后端的 nerdctl 去连接哪个 socket 以执行构建逻辑。
  - CONTAINERD_ADDRESS：告诉 nerdctl 直接对话哪个 containerd 实例来拉取基础镜像、推送最终镜像或管理容器生命周期。
  - 关键点：这里的路径是 Pod 内部 的挂载路径，必须与后续 Volume 挂载的路径一致。

**第二处：Pod 级别卷定义 (Volumes - JCasC 语法)：**

- 作用解释
  - 桥接宿主机与 Pod：这是 Jenkins Kubernetes Plugin (JCasC) 的特有语法，用于定义 Pod 需要的存储卷。
  - HostPath 机制：它将 Kubernetes 节点（宿主机） 上的 /run/buildkit/buildkitd.sock 和 /run/containerd/containerd.sock 文件，直接映射（挂载）到 Pod 内部 的相同路径。
  - 目的：让 Pod 内的进程能够“穿透”容器隔离，直接操作宿主机上运行的 containerd 守护进程和 buildkitd 守护进程。这是实现无特权（或低特权）构建的关键。

**第三处：容器内挂载点定义 (VolumeMounts)：**

- 作用解释：
  - 挂载声明：这是标准 Kubernetes Pod Spec 的一部分，告诉名为 base 的容器，需要将上面定义的哪些卷（Volumes）挂载到容器内的什么位置。
  - Socket 挂载：将名为 containerd-sock 和 buildkit-sock 的卷挂载到对应路径，使应用程序可以访问 socket 文件。
  - 二进制文件挂载：
    - 注意这里还挂载了 nerdctl 和 buildctl 的二进制文件。
    - 这意味着宿主机上已经预装好了这两个工具（位于 /usr/local/bin/），Pod 不需要自己在镜像里安装，而是直接复用宿主机的二进制文件。这保证了构建工具版本与宿主机运行时环境的高度兼容。

**第四处：卷源定义：**

- 作用解释：
  - 定义卷的来源：这是标准 Kubernetes Pod Spec 中 volumes 数组的定义，与第三处的 volumeMounts 一一对应（通过 name 字段关联）。
  - 具体化 HostPath：
    - 明确指定 containerd-sock 卷来源于宿主机的 /run/containerd/containerd.sock。
    - 明确指定 nerdctl-binary 卷来源于宿主机的 /usr/local/bin/nerdctl。
  - 完整性闭环：如果没有这部分定义，第三处的 volumeMounts 将找不到对应的卷名而报错。这部分确保了 Pod 启动时，Kubelet 会去宿主机寻找这些具体的文件或 Socket 并挂载进去。

:::

**重启 Jenkins：** 使配置生效：（或等待1-2分钟自动加载）

```bash
$ kubectl rollout restart deployment/devops-jenkins -n kubesphere-devops-system
```

#### 11.5.9 验证Jenkins节点信息

##### 11.5.9.1 通过 Groovy 脚本控制台查询可用节点信息

1. 点击 **系统管理 (Manage Jenkins)** -> **脚本命令行 (Script Console)**。
2. 粘贴并运行以下代码：

```bash
import jenkins.model.Jenkins
import org.csanchez.jenkins.plugins.kubernetes.KubernetesCloud

def jenkins = Jenkins.instance
def cloud = jenkins.clouds.find { it instanceof KubernetesCloud }

if (cloud) {
    println "✅ 找到 Kubernetes 云: ${cloud.name}"
    
    // 1. 检查全局默认模板名称
    def defaultTemplate = cloud.getTemplate("") // 传入空字符串通常获取默认模板
    if (defaultTemplate) {
        println "🌟 全局默认 Pod 模板名称: ${defaultTemplate.name}"
        println "🏷️ 全局默认 Label: ${defaultTemplate.label}"
        if (defaultTemplate.name == 'base' || defaultTemplate.label == 'base') {
            println ">>> 结论：'base' 是全局默认模板！"
        }
    } else {
        println "⚠️ 未设置全局默认 Pod 模板 (Default Pod Template is null)"
    }

    // 2. 列出所有可用的 Pod 模板
    println "\n📋 所有已配置的 Pod 模板:"
    cloud.templates.each { template ->
        def isDefault = (template.label == 'base') ? " (可能是默认/常用)" : ""
        println "   - 名称: ${template.name}, Label: '${template.label}'${isDefault}"
    }
} else {
    println "❌ 未找到 Kubernetes 云配置"
}
```

![image-20260317223537436](images/image-20260317223537436.png)

![image-20260317223451729](images/image-20260317223451729.png)

##### 11.5.9.2 查看Configurtion as Code是否配置正确

1. 点击 **系统管理 (Manage Jenkins)** -> **Configuration as Code**。
2. 可以看到如下图所示界面，请检查加载的配置是否正确。

正确加载的配置位置：

```bash
/var/jenkins_home/casc_configs/jenkins_user.yaml
```

![image-20260318133816211](images/image-20260318133816211.png)

## 12 流水线进阶

### 12.1 使用图形编辑面板创建流水线

DevOps 中的图形编辑面板包含用于 Jenkins [阶段 (Stage)](https://www.jenkins.io/zh/doc/book/pipeline/#阶段) 和[步骤 (Step)](https://www.jenkins.io/zh/doc/book/pipeline/#步骤) 的所有必要操作。DevOps 支持直接在交互式面板上定义这些阶段和步骤，无需创建任何 Jenkinsfile。

本文档演示如何在 KubeSphere 中使用图形编辑面板创建流水线。在整个过程中，DevOps 将根据编辑面板上的设置自动生成 Jenkinsfile，您无需手动创建 Jenkinsfile。待流水线成功运行，它会在您的开发环境中创建一个部署和一个服务，并将镜像推送至 Docker Hub。

#### 12.1.1 前提条件

- KubeSphere 平台需要安装并启用 **DevOps** 扩展组件。
- 已有一个 [Docker Hub](http://www.dockerhub.com/) 账户。
- 已创建一个企业空间、一个 DevOps 项目和一个用户（例如 **project-regular**），并已邀请该用户至 DevOps 项目且授予 **operator** 角色。请参阅[邀请用户加入 DevOps 项目](https://docs.kubesphere.com.cn/v4.2.1/11-use-extensions/02-devops/02-devops-project-mangement/03-project-members/01-invite-a-user-to-a-project/)。
- 已创建一个用户（例如 **project-admin**），其在企业空间中具有**项目创建**权限。
- 已设置 CI 专用节点用于运行流水线。请参阅[为缓存依赖项设置 CI 节点](/devops/new/KubeSphere/05-第5章%20DevOps实战.html#_11-1-为依赖项缓存设置-ci-节点)。
- 配置电子邮件服务器用于接收流水线通知（可选）。 请参阅[为流水线设置电子邮件服务器](/devops/new/KubeSphere/05-第5章%20DevOps实战.html#_6-为流水线设置电子邮件服务器)。
- 配置 SonarQube 将代码分析纳入流水线中（可选）。 请参阅[将 SonarQube 集成到流水线](/devops/new/KubeSphere/04-第4章%20KubeSphere扩展服务安装.html#_2-sonarqube代码质量持续检测工具)。

#### 12.1.2 流水线概述

本示例流水线包括以下阶段。

:::tip
说明
阶段 1：Checkout SCM：从 GitHub 仓库拉取源代码。

阶段 2：单元测试：待该测试通过后才会进行下一阶段。

阶段 3：代码分析（可选）：配置 SonarQube 用于静态代码分析。

阶段 4：构建并推送：构建镜像并附上标签 snapshot-$BUILD_NUMBER 推送至 Docker Hub，其中 $BUILD_NUMBER 是流水线运行记录列表中的记录的运行 ID。

阶段 5：生成制品：生成一个制品（JAR 文件包）并保存。

阶段 6：部署至开发环境：在开发环境中创建一个部署和一个服务。该阶段需要进行审核，部署成功运行后，会发送电子邮件通知。
:::

#### 12.1.3 步骤 1：创建凭证

1. 以 **project-regular** 用户登录 KubeSphere 控制台并进入您的企业空间。
2. 在左侧导航栏选择 **DevOps > 凭证**。
3. 在页面左上角的下拉列表中选择一个 DevOps 项目。
4. 创建以下凭证。有关如何创建凭证的更多信息，请参阅[凭证](https://docs.kubesphere.com.cn/v4.2.1/11-use-extensions/02-devops/07-credentials/01-credential-management/)。

:::tip

说明
如果您的账户或密码中包含特殊字符，例如 @ 和 $，可能会因为无法识别而在流水线运行时导致错误。在这种情况下，请先在一些第三方网站（例如 urlencoder）上对账户或密码进行编码，然后将输出结果复制粘贴作为您的凭证信息。

:::

| 凭证 ID         | 类型         | 用途       |
| :-------------- | :----------- | :--------- |
| dockerhub-id    | 用户名和密码 | Docker Hub |
| demo-kubeconfig | kubeconfig   | Kubernetes |

5. 再为 SonarQube 创建一个凭证 (**sonar-token**)，用于上述的阶段 3（代码分析）。凭证类型选择**访问令牌**，在**令牌**字段输入 SonarQube 令牌，请参阅[为新项目创建 SonarQube Token](/devops/new/KubeSphere/04-第4章%20KubeSphere扩展服务安装.html#_2-4-为新项目创建-sonarqube-token)。点击**确定**完成操作。

6. 创建完成后，您将在凭证页面看到已创建的凭证。

#### 12.1.4 步骤 2：创建项目

本示例中，流水线会将 [sample](https://github.com/kubesphere/devops-maven-sample/tree/v4.1.0-sonarqube) 应用部署至一个项目。因此，需要创建一个项目（例如 **kubesphere-sample-dev**）。待流水线成功运行，将在该项目中自动创建该应用的部署和服务。

1. 使用 **project-admin** 账户创建项目，该用户也将是 CI/CD 流水线的审核员。
2. 邀请 **project-regular** 账户至该项目，并授予 **operator** 角色。

#### 12.1.5 步骤 3：创建流水线

1. 在 **DevOps > 流水线**页面点击**创建**。
2. 在弹出的对话框中，将其命名为 **graphical-pipeline**，点击**下一步**。
3. 在**高级设置**页面，点击**添加**，添加以下字符串参数。这些参数将用于流水线的 Docker 命令。添加完成后，点击**创建**。

| 参数类型 | 名称                | 值              | 参数说明                                   |
| :------- | :------------------ | :-------------- | :----------------------------------------- |
| 字符串   | REGISTRY            | `docker.io`     | 镜像仓库地址。本示例使用 **docker.io**。   |
| 字符串   | DOCKERHUB_NAMESPACE | 您的 Docker ID  | 您的 Docker Hub 账户或该账户下的组织名称。 |
| 字符串   | APP_NAME            | `devops-sample` | 应用名称。本示例使用 **devops-sample**。   |

:::tip
说明
有关其他字段，请直接使用默认值或者参阅流水线设置以自定义配置。

:::

#### 12.1.6 步骤 4：编辑流水线

1. 点击流水线名称进入其详情页面。
2. 要使用图形编辑面板，点击**流水线配置**页签下的**编辑流水线**。在弹出的对话框中：
   - 点击**自定义流水线**，按照以下步骤设置各个阶段。
   - 或使用 DevOps 提供的[内置流水线模板](https://docs.kubesphere.com.cn/v4.2.1/11-use-extensions/02-devops/03-pipelines/03-use-pipeline-templates/)。
3. 点击**下一步**，然后点击**创建**。

:::tip

说明
有关其他字段，请直接使用默认值或者参阅流水线设置以自定义配置。

:::

##### 12.1.6.1 阶段 1：拉取源代码 (Checkout SCM)

图形编辑面板包括两个区域：左侧的**画布**和右侧的**内容**。它会根据您对不同阶段和步骤的配置自动生成一个 Jenkinsfile，为开发者提供更加用户友好的操作体验。

:::tip
说明
流水线包括[声明式流水线](https://www.jenkins.io/zh/doc/book/pipeline/syntax/#%E5%A3%B0%E6%98%8E%E5%BC%8F%E6%B5%81%E6%B0%B4%E7%BA%BF)和[脚本化流水线](https://www.jenkins.io/zh/doc/book/pipeline/syntax/#%E8%84%9A%E6%9C%AC%E5%8C%96%E6%B5%81%E6%B0%B4%E7%BA%BF)。目前，支持使用该面板创建声明式流水线。有关流水线语法的更多信息，请参阅 [Jenkins 文档](https://www.jenkins.io/zh/doc/book/pipeline/syntax/)。
:::

1. 在图形编辑面板上，从**类型**下拉列表中选择 **node**，从 **Label** 下拉列表中选择 **base**。

:::tip

说明
Agent 用于定义执行环境。Agent 指令指定 Jenkins 执行流水线的位置和方式。有关更多信息，请参阅[选择 Jenkins Agent](/devops/new/KubeSphere/05-第5章%20DevOps实战.html#_11-2-选择-jenkins-agent)。

:::

![image-20260316234415104](images/image-20260316234415104.png)

2. 点击左侧的加号图标来添加阶段。点击**添加步骤**上方的文本框，然后在右侧的**名称**字段中为该阶段设置名称（例如 **Checkout SCM**）。

![image-20260316234630908](images/image-20260316234630908.png)

3. 点击**添加步骤**。在列表中选择 **Git Clone**，以从 GitHub 拉取示例代码。在弹出的对话框中，填写必需的字段。点击**确定**完成操作。

- **URL**：输入 GitHub 仓库地址 https://github.com/kubesphere/devops-maven-sample.git。注意，这里是示例地址，请使用自己的仓库地址。
- **凭证 ID**：本示例中无需输入凭证 ID。
- **分支**：输入 **v4.1.0-sonarqube**。如果不需要代码分析阶段，则使用默认的 **v4.1.0** 分支。

![image-20260316235203525](images/image-20260316235203525.png)

##### 12.1.6.2 阶段 2：单元测试

1. 点击阶段 1 右侧的加号图标添加新的阶段，以在容器中执行单元测试。将它命名为 **Unit Test**。

![image-20260317101543296](images/image-20260317101543296.png)

2. 点击**添加步骤**，在列表中选择**指定容器**。将其命名为 **base** 然后点击**确定**。

![image-20260317101818757](images/image-20260317101818757.png)

3. 点击 **base** 容器步骤下的**添加嵌套步骤**，在列表中选择 **shell** 并输入以下命令。点击**确定**保存操作。

```bash
mvn clean test
```

![image-20260317102210266](images/image-20260317102210266.png)

![image-20260317103036700](images/image-20260317103036700.png)

![image-20260317103154494](images/image-20260317103154494.png)



:::tip
说明
在图形编辑面板上，可指定在给定阶段指令中执行的一系列[步骤](https://www.jenkins.io/zh/doc/book/pipeline/syntax/#steps)。
:::

##### 12.1.6.3 阶段 3：代码分析（可选）

本阶段使用 SonarQube 用于测试代码。如果不需要代码分析，可以跳过该阶段。

1. 点击 **Unit Test** 阶段右侧的加号图标添加一个阶段，以在容器中进行 SonarQube 代码分析。将它命名为 **Code Analysis**。

![image-20260317104324985](images/image-20260317104324985.png)

2. 在 **Code Analysis** 中，点击**添加步骤**，选择**指定容器**。将其命名为 **base** 然后点击**确定**。

![image-20260317105747428](images/image-20260317105747428.png)

3. 点击 **base** 容器步骤下的**添加嵌套步骤**，以添加一个嵌套步骤。点击**添加凭证**并从**凭证 ID** 列表中选择 SonarQube 令牌 (**sonar-token**)。在**文本变量**中输入 **SONAR_TOKEN**，然后点击**确定**。

![image-20260317110820967](images/image-20260317110820967.png)

4. 在**添加凭证**步骤下，点击**添加嵌套步骤**为其添加一个嵌套步骤。

![image-20260317110940605](images/image-20260317110940605.png)

5. 点击 **Sonarqube 配置**，在弹出的对话框中输入名称 **sonar**（在Jenkins中设置：**Manage Jenkins** => **System**=>**SonarQube servers**中定义的名称），点击**确定**保存操作。

![image-20260317111310888](images/image-20260317111310888.png)

6. 在 **Sonarqube 配置**步骤下，点击**添加嵌套步骤**为其添加一个嵌套步骤。

![image-20260317111528773](images/image-20260317111528773.png)

7. 点击 **shell** 并在命令行中输入以下命令，用于 sonarqube 认证和分析，点击**确定**完成操作。

```bash
mvn sonar:sonar -Dsonar.login=$SONAR_TOKEN
```

8. 点击**指定容器**步骤下的**添加嵌套步骤**（第三个），选择**超时**。在时间中输入 **1** 并将单位选择为**小时**，点击**确定**完成操作。

![image-20260317111722874](images/image-20260317111722874.png)

![image-20260317111819313](images/image-20260317111819313.png)

9. 点击**超时**步骤下的**添加嵌套步骤**，选择**运行代码质量检查 (SonarQube)**。在弹出的对话框中勾选**如果质量阈值状态不是绿色，则中止流水线**。点击**确定**保存操作。

![image-20260317111942679](images/image-20260317111942679.png)

![image-20260317112038831](images/image-20260317112038831.png)

##### 12.1.6.4 阶段 4：构建并推送镜像

1. 点击前一个阶段右侧的加号图标添加一个新的阶段，以构建并推送镜像至 Docker Hub。将其命名为 **Build and Push**。
2. 在 **Build and Push** 中，点击**添加步骤**，选择**指定容器**，将其命名为 **base**，然后点击**确定**。
3. 点击 **base** 容器步骤下的**添加嵌套步骤**，在列表中选择 **shell** 并在弹出窗口中输入以下命令，点击**确定**完成操作。

```bash
mvn -Dmaven.test.skip=true clean package
```

4. 再次点击**添加嵌套步骤**，选择 **shell**。在命令行中输入以下命令，以根据 [Dockerfile](https://github.com/kubesphere/devops-maven-sample/blob/v4.1.0-sonarqube/Dockerfile-online) 构建 Docker 镜像。点击**确定**确认操作。

```bash
nerdctl build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER .
```

5. 再次点击**添加嵌套步骤**，选择**添加凭证**。在弹出的对话框中填写以下字段，点击**确定**确认操作。

- **凭证名称**：选择您创建的 Docker Hub 凭证，例如 **dockerhub-id**。
- **用户名变量**：输入 **DOCKER_USERNAME**。
- **密码变量**：输入 **DOCKER_PASSWORD**。

:::tip

说明
出于安全原因，账户信息在脚本中显示为变量。

:::

6. 在**添加凭证**步骤中点击**添加嵌套步骤**（第一个）。选择 **shell** 并在弹出窗口中输入以下命令，用于登录 Docker Hub。点击**确定**确认操作。

```bash
echo "$DOCKER_PASSWORD"|nerdctl login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin
```

7. 再次在**添加凭证**步骤中点击**添加嵌套步骤**。选择 **shell** 并输入以下命令，将 SNAPSHOT 镜像推送至 Docker Hub。点击**确定**完成操作。

```bash
nerdctl push $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER
```

##### 12.1.6.5 阶段 5：生成制品

1. 点击 **Build and Push** 阶段右侧的加号图标添加一个新的阶段，以保存制品，将其命名为 **Artifacts**。本示例使用 JAR 文件包。
2. 选中 **Artifacts** 阶段，点击**添加步骤**，选择**保存制品**。在弹出的对话框中输入 **target/\*.jar**，将其设置为 Jenkins 中制品的保存路径。点击**确定**完成操作。

#### 12.1.7 阶段 6：部署至开发环境

1. 点击 **Artifacts** 阶段右侧的加号图标添加最后一个阶段，将其命名为 **Deploy to Dev**。该阶段用于将资源部署至您的开发环境（即 **kubesphere-sample-dev** 项目）。
2. 点击 **Deploy to Dev** 阶段下的**添加步骤**，在列表中选择**审核**，然后在**消息**字段中填入 **@project-admin**，即 **project-admin** 账户在流水线运行到该阶段时会进行审核。点击**确定**保存操作。

:::tip
说明
在 KubeSphere 中，能够运行流水线的账户也能够继续或终止该流水线。

此外，流水线创建者、拥有该项目管理员角色的用户或者您指定的账户也有权限继续或终止流水线。
:::

3. 再次点击 **Deploy to Dev** 阶段下的**添加步骤**。在列表中选择**指定容器**，将其命名为 **base**，然后点击**确定**。

4. 点击 **base** 容器步骤下的**添加嵌套步骤**。在列表中选择**添加凭证**，在弹出的对话框中填写以下字段，然后点击**确定**。

- 凭证名称：选择您创建的 kubeconfig 凭证，例如 **demo-kubeconfig**。
- kubeconfig 变量：输入 **KUBECONFIG_CONTENT**。

5. 点击**添加凭证**步骤下的**添加嵌套步骤**。在列表中选择 **shell**，在弹出的对话框中输入以下命令，然后点击**确定**。

```bash
mkdir ~/.kube
echo "$KUBECONFIG_CONTENT" > ~/.kube/config
envsubst < deploy/no-branch-dev/devops-sample-svc.yaml | kubectl apply -f -
envsubst < deploy/no-branch-dev/devops-sample.yaml | kubectl apply -f -
```

6. 如果想在流水线运行成功时接收电子邮件通知，请点击**添加步骤**，选择**邮件**，以添加电子邮件信息。注意，配置电子邮件服务器是可选操作，如果跳过该步骤，依然可以运行流水线。

:::tip
说明
有关配置电子邮件服务器的更多信息，请参阅[为流水线设置电子邮件服务器](https://docs.kubesphere.com.cn/v4.2.1/11-use-extensions/02-devops/03-pipelines/11-jenkins-email/)。 
:::

7. 待完成上述步骤，在右下角点击**确定**，结束编辑流水线。该流水线将展示完整的工作流，并且清晰列示每个阶段。

   在用图形编辑面板定义流水线时，DevOps 会自动创建相应的 Jenkinsfile。点击**编辑 Jenkinsfile** 查看该 Jenkinsfile。

:::tip

说明
在流水线列表页面，点击该流水线右侧的more，选择复制来创建该流水线的副本。

:::

#### 12.1.8 步骤 5：运行流水线

1. 使用图形编辑面板创建的流水线需要手动运行。点击**运行**，弹出的对话框会显示[步骤 3：创建流水线](https://docs.kubesphere.com.cn/v4.2.1/11-use-extensions/02-devops/03-pipelines/01-create-a-pipeline-using-graphical-editing-panel/#_步骤_3创建流水线)中已定义的三个字符串参数。点击**确定**来运行流水线。
2. 在**运行记录**页签，查看流水线的运行状态，点击运行状态查看详情。
3. 稍等片刻，流水线如果运行成功，会在 **Deploy to Dev** 阶段停止。**project-admin** 作为流水线的审核员，需要进行审批，然后资源才会部署至开发环境。
4. 以 **project-admin** 用户登录 KubeSphere Web 控制台并进入您的企业空间，在 **DevOps > 流水线**页面，点击流水线名称进入详情页。在**运行记录**页签下，点击要审核的记录，点击**继续**以批准流水线。

:::tip

说明
如果要同时运行多个不包含多分支的流水线，在流水线列表页面，全部选中这些流水线，然后点击运行来批量运行它们。
:::

#### 12.1.9 步骤 6：查看流水线详情

1. 以 **project-regular** 用户登录 KubeSphere 控制台并进入您的企业空间。
2. 在 **DevOps > 流水线**页面，选择项目后，点击 **graphical-pipeline** 流水线。
3. 在**运行记录**页签下，点击**状态**下的记录，进入**运行记录**详情页。如果任务状态为**成功**，流水线所有阶段都会显示**成功**。
4. 在**运行日志**页签下，点击每个阶段查看其详细日志。点击**查看完整日志**，根据日志排除故障和问题，也可以将日志下载到本地进行进一步分析。

#### 12.1.10 步骤 7：下载制品

在**运行记录**详情页，点击**制品**页签，然后点击制品右侧的图标下载该制品。

#### 12.1.11 步骤 8：查看代码分析结果

在**代码检查**页面，查看由 SonarQube 提供的本示例流水线的代码分析结果。如果没有事先配置 SonarQube，则该部分不可用。有关更多信息，请参阅[将 SonarQube 集成到流水线](https://docs.kubesphere.com.cn/v4.2.1/11-use-extensions/02-devops/10-how-to-integrate/01-sonarqube/)。

#### 12.1.12 步骤 9：验证 Kubernetes 资源

如果流水线的每个阶段都成功运行，则会自动构建一个 Docker 镜像并推送至您的 Docker Hub 仓库。最终，流水线会在您事先设置的项目中自动创建一个部署和一个服务。

1. 点击**工作负载 > 部署**，进入项目（本示例中即 **kubesphere-sample-dev**），查看流水线自动创建的部署。
2. 点击**服务与网络 > 服务**，查看示例服务通过 NodePort 暴露的端口号。使用 **`<Node IP>:<NodePort>`** 访问该服务。

:::tip

说明
访问服务前，您可能需要配置端口转发规则并在安全组中放行该端口。
:::

3. 流水线成功运行后，会推送一个镜像至 Docker Hub。登录 Docker Hub 查看结果。



4. 该应用名称为 **APP_NAME** 的值，本示例中即 **devops-sample**。Tag 为 **SNAPSHOT-$BUILD_NUMBER** 的值，**$BUILD_NUMBER** 即**运行记录**页签下记录的**运行 ID**。
5. 如果您在[阶段 6：部署至开发环境](https://docs.kubesphere.com.cn/v4.2.1/11-use-extensions/02-devops/03-pipelines/01-create-a-pipeline-using-graphical-editing-panel/#_阶段_6部署至开发环境)配置了电子邮件服务器并添加了电子邮件信息，运行完成后还会收到邮件通知。

### 12.2 使用 Jenkinsfile 创建流水线

### 12.3 使用流水线模板创建流水线

### 12.4 使用 GitLab 创建多分支流水线

### 12.5 设置流水线

### 12.6 使用 Webhook 触发流水线



## 99 资源

### 99.1 凭证

| 凭证ID          | 类型                                                         |
| --------------- | ------------------------------------------------------------ |
| harbor-id       | 用户名和密码（密码填写Harbor机器人令牌）<br />name: 	robot$ks-devops-harbor+robot-test<br/>secret:	qGBGzF7seF9uh9jCGqr6I6EtSiQzWsCT |
| github-id       | 用户名和密码（密码填写classic令牌）                          |
| github-token    | 访问令牌                                                     |
| gitee-id        | 用户名和密码（密码填写私人令牌）                             |
| gitee-token     | 访问令牌                                                     |
| demo-kubeconfig | kubeconfig                                                   |
| dockerhub-id    | 用户名和密码                                                 |

其中，github-id的创建方式：

![image-20240702175121985](images/image-20240702175121985.png)

![image-20240702175016014](images/image-20240702175016014.png)
