# 序一 Vagrant的安装与使用

Vagrant官网： https://developer.hashicorp.com/vagrant/install

## 1 Vagrant 是什么？

- **核心功能**：由 HashiCorp 开发的工具，用于快速创建和配置轻量级、可复用的虚拟开发环境。
- **依赖技术**：基于 VirtualBox、VMware、Hyper-V 等虚拟机管理程序，或 Docker 容器。
- **核心文件**：通过 `Vagrantfile` 定义虚拟机配置（如操作系统、网络、共享目录等）。

## 2 典型使用场景

1. **统一开发环境**
    - 团队共享相同的开发环境配置，避免“在我机器上能运行”的问题。
    - 示例：通过 `vagrant up` 一键启动预装 Python/Node.js/数据库的虚拟机。
2. **多环境测试**
    - 快速创建不同操作系统（Ubuntu/CentOS/Windows）的实例，测试跨平台兼容性。
3. **持续集成（CI）**
    - 在 CI 流程中自动启动虚拟机运行测试任务。
4. **快速原型开发**
    - 结合 Provisioning（如 Ansible、Shell 脚本）自动部署应用依赖。

## 3 安装

```bash
% brew tap hashicorp/tap
% brew install hashicorp/tap/hashicorp-vagrant
```

## 4 常用命令

### 4.1 Vagrant的常用命令

| 命令                               | 命令执行结果状态 | 解释                                     |
| ---------------------------------- | ---------------- | ---------------------------------------- |
| `vagrant --version/vagrant -v`     |                  | 查看当前版本                             |
| `vagrant box list`                 |                  | 查看本地已下载的镜像列表                 |
| `vagrant box add`                  |                  | 添加镜像到本地仓库（如 `rockylinux/9`）  |
| `vagrant box remove < name >`      |                  | 删除本地镜像                             |
| `vagrant box update`               |                  | 更新本地镜像到最新版本                   |
| `vagrant init`                     |                  | 生成默认的 Vagrantfile（需手动指定镜像） |
| `vagrant init < boxes >`           |                  | 生成 Vagrantfile 并指定默认镜像          |
| `vagrant init <box名称> <镜像URL>` |                  | 指定镜像名称及下载地址                   |
| `vagrant up`                       | running          | 启动虚拟机                               |
| `vagrant ssh`                      |                  | ssh登录虚拟机                            |
| `vagrant suspend`                  | saved            | 挂起虚拟机                               |
| `vagrant resume`                   | running          | 唤醒虚拟机                               |
| `vagrant halt`                     | poweroff         | 关闭虚拟机                               |
| `vagrant reload`                   | running          | 重启虚拟机                               |
| `vagratn status`                   | running          | 查看虚拟机状态                           |
| `vagrant destroy [name\|id]`       |                  | 删除虚拟机，如果是default可以省略id      |
| `vagrant provision`                |                  | 重新运行配置脚本（如 Ansible）           |

特殊说明：vagrant up是一个万能命令，可以对saved/poweroff状态的虚拟机唤醒。

- vagrant box 示例

```bash
# 添加官方 Ubuntu 20.04 镜像
vagrant box add ubuntu/focal64
# 从本地文件添加镜像（如 centos.box）
vagrant box add centos7 /path/to/centos.box
# 列出所有本地镜像
vagrant box list
```

- vagrant init 示例

```bash
# 初始化项目并指定镜像（本地已存在 ubuntu/focal64）
vagrant init ubuntu/focal64
# 初始化项目并指定镜像 URL（自动下载）
vagrant init centos/7 https://example.com/centos7.box
# 生成 Vagrantfile 并指定默认镜像
vagrant init rockylinux/9 --box-version 5.0.0
```

### 4.2 Vagrant Plugin的常用命令

| 命令                                  | 解释           |
| ------------------------------------- | -------------- |
| vagrant plugin install < pluginName > | 安装插件       |
| vagrant plugin list                   | 查看安装的插件 |
| vagrant plugin uninstall              | 卸载插件       |
| vagrant plugin help                   | 查看命令用法   |

## 5、Vagrant的使用

### 5.1、使用VirtualBox创建虚拟机

#### 第一步：启动virtualbox

virtualbox安装后启动！

#### 第二步：下载镜像box

如何查询各种boxes：https://portal.cloud.hashicorp.com/vagrant/discover

下载地址：https://app.vagrantup.com/centos/boxes/7

根据使用的Vagrant是VirtualBox还是VMWare，选择`virtualbox`或者`vmware_desktop ` 类型的 provider下载！

下载后本地安装：

```bash
# 若是从本地加载，可以 vagrant box add CentOS/7 CentOS-7-x86_64-Vagrant-2004_01.VMwareFusion.box
$ vagrant box add rockylinux/9 
==> box: Loading metadata for box 'rockylinux/9'
    box: URL: https://vagrantcloud.com/api/v2/vagrant/rockylinux/9
This box can work with multiple providers! The providers that it
can work with are listed below. Please review the list and choose
the provider you will be working with.

1) libvirt
2) virtualbox
3) vmware_desktop

Enter your choice: vmware_desktop
Invalid choice. Try again: 3 
==> box: Adding box 'rockylinux/9' (v5.0.0) for provider: vmware_desktop (arm64)
    box: Downloading: https://vagrantcloud.com/rockylinux/boxes/9/versions/5.0.0/providers/vmware_desktop/arm64/vagrant.box
Progress: 4% (Rate: 1123k/s, Estimated time remaining: 0:13:42)
```

#### 第三步：初始化项目Vagrantfile

- 规划一个目录，作为Vagrant虚拟机目录，比如：Vagrant/centos7

如果尚未看到Vagrantfile，初始化配置Vagrantfile

```bash
$ vagrant init rockylinux/9 --box-version 5.0.0
```

- 编辑Vagrantfile

```bash
$ vim Vagrantfile
```

```bash
Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"
end
```

#### 第四步：启动虚拟机

运行 `vagrant up`，Vagrant 会根据 `Vagrantfile` 中的配置创建虚拟机。

```bash
$ vagrant up
# 指定virtualbox这个provider【推荐】；特别说明：默认也是 virtualbox
$ vagrant up --provider virtualbox
```



### 5.2 使用VMWare创建虚拟机

#### 第一步：安装VMWare provider插件vmware-desktop

1. 下载VMWare-utility

https://www.vagrantup.com/docs/providers/vmware/vagrant-vmware-utility

下载后，双击安装！

2. 下载VMWare-desktop查看

```bash
$ vagrant plugin install vagrant-vmware-desktop
# 命令行输出结果
Installing the 'vagrant-vmware-desktop' plugin. This can take a few minutes...
Installed the plugin 'vagrant-vmware-desktop (3.0.1)'!
```

3. 安装VMWare并启动

双击VMWare安装后，启动！

#### 第二步：下载box

如何查询各种boxes：https://app.vagrantup.com/boxes/search

下载地址：https://app.vagrantup.com/centos/boxes/7

根据使用的Vagrant是VirtualBox还是VMWare，选择`virtualbox`或者`vmware_desktop ` 类型的 provider下载！

下载后本地安装：

```bash
# 如果不是为了`vagrant add box boxesname boxespath`可以不下载。
vagrant box add CentOS/7 CentOS-7-x86_64-Vagrant-2004_01.VMwareFusion.box
```

#### 第三步：Vagrantfile

- 规划一个目录，作为Vagrant虚拟机目录，比如：Vagrant/centos7

如果尚未看到Vagrantfile，初始化配置Vagrantfile

```bash
vagrant init
# 或者指定boxes【推荐】
vagrant init centos/7
```

- 编辑Vagrant

```bash
$ vim Vagrantfile
```

```bash
Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"
end
```

#### 第四步：初始化机器

```bash
# 指定vmware_desktop这个provider【推荐】
vagrant up --provider vmware_desktop
```



### 5.3 Vagrant虚拟机访问

### 5.3.1 通过vagrant ssh命令

```bash
$ vagrant ssh
[vagrant@localhost ~]$ pwd
/home/vagrant
```

### 5.3.2 通过XShell工具

#### 1.查看vagrant的ssh配置

```bash
$ vagrant ssh-config
# 命令行输出结果
Host default
  HostName 127.0.0.1
  User vagrant
  Port 2222
  UserKnownHostsFile /dev/null
  StrictHostKeyChecking no
  PasswordAuthentication no
  IdentityFile D:/SharedWorkspace/Vagrant/centos7/.vagrant/machines/default/virtualbox/private_key
  IdentitiesOnly yes
  LogLevel FATAL
```

可以看到：

- HostName 127.0.0.1
- Port 2222
- IdentityFile D:/SharedWorkspace/Vagrant/centos7/.vagrant/machines/default/virtualbox/private_key

#### 2.XShell连接

![image-20220311142612246](images/image-20220311142612246.png)



![image-20220311155658798](images/image-20220311155658798.png)

点击确定后登陆，首次登陆，会提示输入密码；这时，输入密码： vagrant 即可！

#### 3.切换到root

```bash
# 密码是 vagrant
[vagrant@localhost ~]$ su - root
Password: 
Last login: Fri Mar 11 07:45:14 UTC 2022 on pts/0
[root@localhost ~]# 
```