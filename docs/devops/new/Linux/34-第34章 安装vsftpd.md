# 第34章 安装vsftpd

1. 检查是否安装

```bash
[emon@wenqiu ~]$ rpm -qa|grep vsftpd
```

2. 使用yum安装

```bash
[emon@wenqiu ~]$ sudo yum -y install vsftpd
```

3. 备份`vsftpd.conf`配置文件

```bash
[emon@wenqiu ~]$ sudo cp /etc/vsftpd/vsftpd.conf /etc/vsftpd/vsftpd.conf.bak
```

4. 创建文件服务器根目录`/fileserver`

首先，`fileserver` 并非ftp专享的目录，而是ftp、ftps、sftp这三种文件服务器共享的根目录。

```bash
[emon@wenqiu ~]$ sudo mkdir /fileserver
```

5. 创建ftp本地用户

```bash
[emon@wenqiu ~]$ sudo useradd -d /fileserver/ftproot -s /sbin/nologin -c "Ftp User" ftpuser
```

创建用户后，自动创建了`/fileserver/ftproot/`目录，但是该目录权限为700，需要修改为755

```bash
[emon@wenqiu ~]$ sudo chmod -R 755 /fileserver/ftproot/
```

为了创建本地用户模式+虚拟用户模式，都可以登录ftp服务器，这里设置ftpuser用户的密码

```bash
[emon@wenqiu ~]$ sudo passwd ftpuser
```

6. 虚拟用户模式需要如下准备

    1. 配置虚拟用户

   ```bash
   [emon@wenqiu ~]$ sudo vim /etc/vsftpd/virtual_user_list
   ftp
   ftp123
   extra
   extra123
   ```

   文件内容说明：奇数行是虚拟用户名，偶数行是前一行用户名对应的密码。

    2. 根据配置的虚拟用户，生成虚拟用户数据库文件

   ```bash
   [emon@wenqiu ~]$ sudo db_load -T -t hash -f /etc/vsftpd/virtual_user_list /etc/vsftpd/virtual_user_list.db
   [emon@wenqiu ~]$ file /etc/vsftpd/virtual_user_list.db
   /etc/vsftpd/virtual_user_list.db: Berkeley DB (Hash, version 9, native byte-order)
   ```

    3. 配置支持虚拟用户的PAM认证文件，引用生成的虚拟用户数据库文件（默认带`.db`后缀，无需指定）

   ```bash
   [emon@wenqiu ~]$ sudo vim /etc/pam.d/vsftpd 
   ```

   打开文件，在文件头非注释行开始，插入如下内容（插入的内容必须第一行开始）：

   ```bash
   auth sufficient pam_userdb.so db=/etc/vsftpd/virtual_user_list
   account sufficient pam_userdb.so db=/etc/vsftpd/virtual_user_list
   
   # CentOS7.6及以上版本，本地用户ftpuser无法登陆，报错“530 Login incorrect.”，注释掉如下一行即可：
   # auth       required   pam_shells.so
   ```

7. 配置`vsftpd.conf`

```bash
[emon@wenqiu ~]$ sudo vim /etc/vsftpd/vsftpd.conf
```

```bash
# 不允许匿名用户登录【修改】
anonymous_enable=NO
# 允许本地用户登录
local_enable=YES
# 本地用户可以在自己家目录中进行读写操作
write_enable=YES
# 本地用户新增档案时的umask值
local_umask=022
# 如果启动这个选项，那么使用者第一次进入一个目录时，会检查该目录下是否有.message这个档案，如果有，则会出现此档案的内容，通常这个档案会放置欢迎话语，或是对该目录的说明。默认值为开启
dirmessage_enable=YES
# 是否启用上传/下载日志记录。如果启用，则上传与下载的信息将被完整纪录在xferlog_file 所定义的档案中。预设为开启。
xferlog_enable=YES
# 指定FTP使用20端口进行数据传输，默认值为YES
connect_from_port_20=YES
# 如果启用，则日志文件将会写成xferlog的标准格式
xferlog_std_format=YES
# 这里用来定义欢迎话语的字符串【新增】
ftpd_banner=Welcome to emon FTP service.
# 用于指定用户列表文件中的用户是否允许切换到上级的目录【新增】
chroot_local_user=NO
# 用于设置是否启用chroot_list_file配置项指定的用户列表文件【新增】
chroot_list_enable=YES
# 用于指定用户列表文件【新增】
chroot_list_file=/etc/vsftpd/chroot_list
listen=NO
listen_ipv6=YES

# 设置PAM使用的名称，默认值为/etc/pam.d/vsftpd
pam_service_name=vsftpd
# 是否启用vsftpd.user_list文件，黑名单，白名单都可以的
userlist_enable=YES
tcp_wrappers=YES

# 虚拟用户创建文档的umask值【新增】
anon_umask=022
# 是否启用虚拟用户，默认值为NO。【新增】
guest_enable=YES
# 这里用来映射虚拟用户，默认为ftp。【新增】
guest_username=ftpuser
# 当不允许本地用户+虚拟用户切换到主目录上级时，对于虚拟用户而言，可以登录；对于本地用户而言，会报错： 500 OOPS: vsftpd: refusing to run with writable root inside chroot()
# 两种做法，第一种是去掉用户主目录的写权限，第二种是增加如下属性
allow_writeable_chroot=YES
# 默认是GMT时间，改成使用本机系统时间【新增】
use_localtime=YES
# 为虚拟用户设置独立的权限【新增】
user_config_dir=/etc/vsftpd/virtual_user_dir

# 被动模式及其使用的端口范围【新增】
pasv_enable=YES
pasv_min_port=61001
pasv_max_port=62000
```

8. 创建配置属性`chroot_list_file` 和`user_config_dir` 所需要的目录和文件，并创建ftp服务器根目录`/fileserver/ftproot/`下一个index.html文件

    1. `chroot_list_file`所需

   ```bash
   [emon@wenqiu ~]$ sudo vim /etc/vsftpd/chroot_list
   ```

   文件内容：

   ```bash
   ftp
   extra
   ```

    2. `user_config_dir`所需

   首先，`user_config_dir`属性指定的值是一个目录，在该目录下需要为虚拟用户创建同名的权限文件，比如虚拟用户`ftp`的权限文件，命名为`ftp`。

   创建指定目录：

   ```bash
   [emon@wenqiu ~]$ sudo mkdir /etc/vsftpd/virtual_user_dir
   ```

   为虚拟用户`ftp` 和`extra` 创建权限控制文件：

   ```bash
   [emon@wenqiu ~]$ sudo vim /etc/vsftpd/virtual_user_dir/ftp
   ```

   文件内容：

   ```bash
   anon_upload_enable=YES
   anon_mkdir_write_enable=YES
   anon_other_write_enable=YES
   ```

   ```bash
   [emon@wenqiu ~]$ sudo vim /etc/vsftpd/virtual_user_dir/extra
   ```

   文件内容：

   ```bash
   # 先不填写，预留。
   ```

    3. 创建`index.html`文件

   ```bash
   [emon@wenqiu ~]$ sudo vim /fileserver/ftproot/index.html
   ```

   **由于sudo创建的，属于root用户，最好修改为ftpuser用户所有**

   > [emon@wenqiu ~]$ sudo chown ftpuser:ftpuser /fileserver/ftproot/index.html

   ```html
   <html>
       <head>
           <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
           <link href="https://cdn.bootcss.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet">
   		<script>
   			function jump(port) {
   				var baseHref = window.location.href;
   				var index = baseHref.lastIndexOf("/");
   				var baseUrl = baseHref.substring(0, index);
   				var url = baseUrl + ":" + port;
   				window.location.href = url;
   			}
   		</script>
       </head>
       <body>
           <h1>
           </h1>
           <div class="container">
               <div class="row clearfix">
                   <div class="col-md-12 column">
                       <div class="jumbotron">
                           <h1>
                               Welcome to emon FTP service.
                           </h1>
                           <p>
                               <h3>
                                   为了可以预见的忘却，为了想要进阶的自己。
                               </h3>
                               <h3>
                                   种一棵树最好的时间是十年前，其次是现在。
                               </h3>
                           </p>
                       </div>
                   </div>
                   <div class="col-md-12 column">
   					<table class="table table-bordered">
   						<thead>
   							<tr><th>服务</th><th>端口</th><th>url</th></tr>
   						</thead>
   						<tbody>
   							<tr>
   								<td>supervisor</td><td>9001</td>
   								<td><a href="#" target="_blank" onclick="jump(9001)">supervisor</a></td>
   							</tr>
   							<tr>
   								<td>nexus</td><td>8081</td>
   								<td><a href="#" target="_blank" onclick="jump(8081)">nexus</a></td>
   							</tr>
   							<tr>
   								<td>jenkins</td><td>8085</td>
   								<td><a href="#" target="_blank" onclick="jump(8085)">jenkins</a></td>
   							</tr>
   							<tr>
   								<td>eureka</td><td>8761</td>
   								<td><a href="#" target="_blank" onclick="jump(8761)">eureka</a></td>
   							</tr>
   							<tr>
   								<td>RabbitMQ</td><td>5672/15672</td>
   								<td><a href="#" target="_blank" onclick="jump(15672)">RabbitMQ</a></td>
   							</tr>
   						</tbody>
   					</table>
                   </div>
               </div>
           </div>
       </body>
   </html>
   
   ```

9. 配置SELinux对ftp服务器目录`/fileserver/ftproot/` 的限制

查看限制情况：

```bash
[emon@wenqiu ~]$ getsebool -a|grep ftp
ftpd_anon_write --> off
ftpd_connect_all_unreserved --> off
ftpd_connect_db --> off
ftpd_full_access --> off
ftpd_use_cifs --> off
ftpd_use_fusefs --> off
ftpd_use_nfs --> off
ftpd_use_passive_mode --> off
httpd_can_connect_ftp --> off
httpd_enable_ftp_server --> off
tftp_anon_write --> off
tftp_home_dir --> off
```

放开限制：

```bash
[emon@wenqiu ~]$ sudo setsebool -P ftpd_full_access=on
```

10. 校验

    1. 启动vsftpd

    ```bash
    [emon@wenqiu ~]$ sudo systemctl start vsftpd
    ```

    为了ftp登录，需要安装ftp客户端：

    ```bash
    [emon@wenqiu ~]$ yum list ftp|tail -n 2
    可安装的软件包
    ftp.x86_64                         0.17-67.el7                         CentOS7.5
    [emon@wenqiu ~]$ sudo yum install -y ftp
    ```

    2. 登录ftp验证

    ```bash
    [emon@wenqiu ~]$ ftp 127.0.0.1
    Connected to 127.0.0.1 (127.0.0.1).
    220 Welcome to emon FTP service
    Name (127.0.0.1:emon): ftp
    331 Please specify the password.
    Password:
    230 Login successful.
    Remote system type is UNIX.
    Using binary mode to transfer files.
    ftp> ls
    227 Entering Passive Mode (127,0,0,1,239,67).
    150 Here comes the directory listing.
    -rw-r--r--    1 1001     1001         1006 May 27 15:44 index.html
    226 Directory send OK.
    ftp> mkdir test
    257 "/test" created
    ftp> ls
    227 Entering Passive Mode (127,0,0,1,238,221).
    150 Here comes the directory listing.
    -rw-r--r--    1 1001     1001         1006 May 27 15:44 index.html
    drwxr-xr-x    2 1001     1001            6 May 27 15:53 test
    226 Directory send OK.
    ftp> exit
    221 Goodbye.
    ```

11. 开放端口

```bash
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --add-port=20-21/tcp
success
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --add-port=61001-62000/tcp
success
[emon@wenqiu ~]$ sudo firewall-cmd --reload
success
[emon@wenqiu ~]$ sudo firewall-cmd --permanent --zone=public --list-ports
20-21/tcp 61001-62000/tcp
```