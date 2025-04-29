# 第43章 安装Jenkins

### 13.1、基本安装

1. 下载

下载地址获取页面： https://jenkins.io/download/

下载地址专项页面(rpm)： https://pkg.jenkins.io/redhat-stable/

下载地址专项页面(war)： http://mirrors.jenkins.io/war-stable/

```bash
[emon@wenqiu ~]$ wget -cP /usr/local/src/ https://pkg.jenkins.io/redhat-stable/jenkins-2.222.3-1.1.noarch.rpm
```

2. 安装

```bash
[emon@wenqiu ~]$ sudo rpm -ivh /usr/local/src/jenkins-2.222.3-1.1.noarch.rpm
```

3. 修改配置

```bash
[emon@wenqiu ~]$ sudo vim /etc/sysconfig/jenkins 
```

```bash
# 控制内存占用
JENKINS_JAVA_OPTIONS="-XX:MaxPermSize=512m -Djava.awt.headless=true"

# 默认的8080端口，与tomcat冲突
JENKINS_PORT="8085"
```

4. 检测依赖环境

- 检测JDK：

```bash
[emon@wenqiu ~]$ java -version
```

- 检测jenkins是否配置JDK，在candidates后面加上自己的jdk路径，如下：

```bash
[emon@wenqiu ~]$ sudo vim /etc/rc.d/init.d/jenkins

candidates="
/etc/alternatives/java
/usr/lib/jvm/java-1.8.0/bin/java
/usr/lib/jvm/jre-1.8.0/bin/java
/usr/lib/jvm/java-1.7.0/bin/java
/usr/lib/jvm/jre-1.7.0/bin/java
/usr/bin/java
/usr/local/java/bin/java
"
```

5. 开放端口

此处使用了之前开通的8080-8090端口的8085端口，无需再次开通。

6. 启动

```bash
加载服务：
[emon@wenqiu ~]$ sudo systemctl daemon-reload
启动服务：
[emon@wenqiu ~]$ sudo systemctl start jenkins.service
```

7. 访问

http://192.168.1.116:8085

首次进入页面需要输入初始密码，该密码在`/var/lib/jenkins/secrets/initialAdminPassword`文件里面，复制密码，粘贴登录。

```bash
[emon@wenqiu ~]$ sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

8. 自定义Jenkins

安装推荐的插件。

创建用户（通过【Manage Jenkins】->【Manage Users】）。

重点安装一个`Misc(localization)->Locale`插件，可以在【Manage Jenkins】->【Manage Plugins】->【Available】中过滤`Localization`看到。

备注：安装后部分内容变为中文，并不是全部汉化。

**如果碰到jenkins时区问题（登录页面右下角时间不正确，比实际慢8小时），处理如下：**

配置时区：【Manage Jenkins】->【Script Console】，输入如下命令并【运行】

```bash
System.setProperty('org.apache.commons.jelly.tags.fmt.timeZone', 'Asia/Shanghai')
```

同时确保linux服务器的时区：

```bash
[emon@wenqiu ~]$ timedatectl |grep "Time zone"
       Time zone: Asia/Shanghai (CST, +0800)
[emon@wenqiu ~]$ ll /etc/localtime 
lrwxrwxrwx. 1 root root 35 5月   3 20:19 /etc/localtime -> ../usr/share/zoneinfo/Asia/Shanghai
# 如果不是上面的时区，可以修改
rm -rf /etc/localtime
[emon@wenqiu ~]$ ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime 
```

9. Jenkins URL

http://192.168.1.116:8085/

### 13.2、插件安装

【系统管理】->【管理插件】->【可选插件】：

1. 安装`Publish over SSH`插件

配置插件：【系统管理】->【系统设置】，在配置页面找到`Publish over SSH`

- Publish over  SSH
    - Jenkins SSH Key
        - Passphrase： 私钥口令（SSH）/用户密码（用户名方式）
        - Path to key： 私钥文件路径
        - Key： 私钥文件内容

    - SSH Servers
        - SSH Servers
            - Name： repo.emon.vip-common
            - Hostname： emon
            - Username： emon
            - Remote Directory： /home/emon/saas
            - Use password authentication,or use a different key[勾选]
                - Passphrase / Password： `[密码]`

      **说明**：Hostname对应的emon，是表示主机名emon，对应的是虚拟机当前的IP地址。

    - 使用插件：在构建Job时，Post Steps可以勾选Send files or execute commands over SSH了。

2. 安装`Maven Integration`



### 13.3、Jenkins配置

```bash
一些目录：
-----------------------------------------------------------------------------------------
/usr/lib/jenkins/jenkins.war                        jenkins的war包
-----------------------------------------------------------------------------------------
/etc/sysconfig/jenkins                              配置文件
-----------------------------------------------------------------------------------------
/etc/rc.d/init.d/jenkins                            辅助配置文件
-----------------------------------------------------------------------------------------
ls /var/lib/jenkins/workspace/                      git项目clone位置
-----------------------------------------------------------------------------------------
ls /var/lib/jenkins/users                           用户的存放位置
-----------------------------------------------------------------------------------------
/var/log/jenkins/jenkins.log                        日志文件位置
-----------------------------------------------------------------------------------------
```

### 13.4、常规配置

1. 全局工具配置：

【系统管理】->【全局工具配置】：

- JDK配置
    - JDK->JDK安装->输入本地安装的
- Maven配置
    - Maven->Maven安装->输入本地安装的

2. Credentials 证书管理

首先，生成Jenkins用户的SSH keys：

检查是否存在SSH keys

```bash
[emon@wenqiu ~]$ ls /var/lib/jenkins/.ssh
```

如果不存在，则生成SSH keys

```bash
[emon@wenqiu ~]$ sudo mkdir /var/lib/jenkins/.ssh
[emon@wenqiu ~]$ sudo chown jenkins.jenkins /var/lib/jenkins/.ssh/
[emon@wenqiu ~]$ sudo ssh-keygen -t rsa -b 4096 -C "liming20110711@163.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): /var/lib/jenkins/.ssh/id_rsa
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /var/lib/jenkins/.ssh/id_rsa.
Your public key has been saved in /var/lib/jenkins/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:/uMBzdRX85mBDk63HoowigltmqsAb0lasWAKjjKav3Q liming20110711@163.com
The key's randomart image is:
+---[RSA 4096]----+
|              .o.|
|           + o .*|
|o.o       + = oo.|
|*o =   o + . =   |
|*.O o . S + o .  |
|+X + . . o . .   |
|= * E   . .      |
|.= .     ...     |
|o o.     .o.     |
+----[SHA256]-----+
[emon@wenqiu ~]$ sudo chown -R jenkins.jenkins /var/lib/jenkins/.ssh/
```

在GitHub的SSH keys加入jenkins用户公钥

```bash
Title: centos-jenkins-rsa
Key `上面生成的公钥id_rsa.pub的内容`
```

- SSH认证：创建持续集成项目配置地址时，使用SSH/HTTPS地址

    - 方法一：公钥方法
        - 拷贝公钥到github服务器即可。
    - 方法二：私钥方法

  ```bash
  在jenkins界面，依次点击：【Credentials】->【System】->【Add domain】
  Domain Name：填写你git服务器的地址，比如：github.com
  Description：随便的描述，比如：GitHub的认证
  点击【OK】跳转到认证界面，点击链接： adding credentials
  在弹出的界面中，选择：
  Kind: SSH Username with private key
  Username: SSH所属用户的名称，这里是：jenkins
  Private Key：执行如下命令，并拷贝私钥到这里
  [emon@wenqiu ~]$ sudo cat /var/lib/jenkins/.ssh/id_rsa
  Passphrase: 如果你在创建 ssh key 的时候输入了 Passphrase 那就填写相应的Passphrase，为空就不填写 
  ID: 空，保存后会自动生成
  Description： 空
  ```


- 用户名密码认证：创建持续集成项目配置地址时，使用HTTPS地址

```
在上一步创建的domain中，添加认证。
Kind：Username with password
Username： Git用户
Password： Git用户密码
ID：空，保存后会自动生成
Description：Username with password
```

3. 权限控制

【系统管理】->【全局安全配置】

```
启用安全[勾选]
安全域[勾选]
Jenkins专有用户数据库[勾选]
允许用户注册[勾选]
授权策略
安全矩阵[勾选]
-- Overall                      (全局）
-- Administer               管理员，拥有该权限可以做任何事情
-- Read                     阅读
-- RunScripts               运行脚本
-- UploadPlugins            升级插件
-- ConfigureUpdateCenter    配置升级中心
-- Credentials                  （凭证）
-- Create                   创建
-- Delete                   删除   
-- ManageDomains            管理域
-- Update                   更新
-- View                     查看
-- Agent                        （代理）
-- Build                    构建
-- Configure                配置
-- Connect                  连接
-- Create                   创建
-- Delete                   删除
-- Disconnect               断开连接
-- Job                          （任务）
-- Build                    构建                                【受限用户】
-- Cancel                   取消构建                            【受限用户】
-- Configure                配置
-- Create                   创建
-- Delete                   删除
-- Discover                 重定向
-- Move                     移动                                【受限用户】
-- Read                     阅读                                【受限用户】
-- Release                  发布                                【受限用户】
-- Workspace                查看工作区                          【受限用户】
-- Run                          （运行）
-- Delete                   删除
-- Replay                   重新部署
-- Update                   更新
-- View                         （视图）
-- Configure                配置
-- Create                   创建
-- Delete                   删除
-- Read                     阅读
-- SCM                          （版本控制）
-- Tag                      打包
用户/组
Anonymous User      推荐，Overall->Read 权限
Authenticated Users 推荐，Overall->Read 权限

通过【添加用户/组】输入框加入的用户，根据需要配置权限，比如这里2个用户：
jenkins             Overall->Administer
test                Overall->Read,Run->Replay
```

### 13.5、项目配置

```bash
1、创建一个Maven项目
【新建任务】->输入一个任务名称，比如 spring-boot-demo->选择构建一个maven项目->点击确定
2、配置页面
	-- General
		-- 项目名称：			自动填写了
		-- 丢弃旧的构建
			-- Strategy		Log Rotation
				-- 保持构建的天数：	7
				-- 保持构建的最大个数： 30
	-- 源码管理
		-- Git
			-- Repositories
				-- Repository URL： git@github.com:EmonCodingBackEnd/spring-boot-demo.git
				-- Credentials： 上面创建的认证方式
			-- Branches to build
				-- Branch Specifier(blank for 'any')：*/master
	-- Build
		-- Root POM: pom.xml
		-- Goals and options: clean package -Dmaven.test.skip=true
	-- Post Steps
		Run only if build succeeds or is unstable[勾选]
		-- Send files or execute commands over SSH
		-- SSH Publishers
			-- SSH Server
				-- Name： 选择上面的配置
				-- Transfers
					-- Transfer Set
						-- Source files: target/*.jar
						-- Remove prefix: target
						-- Remote directory: spring-boot-demo
						-- Exec command: /home/emon/bin/start.sh sbd
```

start.sh是什么？

```bash
[emon@wenqiu ~]$ mkdir bin
[emon@wenqiu ~]$ vim /home/emon/bin/start.sh 
#!/bin/bash
MODULE=$1
echo 'emon123' | sudo -S supervisorctl restart $MODULE
[emon@wenqiu ~]$ chmod u+x /home/emon/bin/start.sh 
```