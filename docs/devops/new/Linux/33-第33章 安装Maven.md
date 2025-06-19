# 第33章 安装Maven

1. 下载

下载地址获取页面： https://maven.apache.org/download.cgi

```bash
$ wget -cP /usr/local/src/ https://dlcdn.apache.org/maven/maven-3/3.8.8/binaries/apache-maven-3.8.8-bin.tar.gz
```

2. 创建安装目录

```bash
$ mkdir /usr/local/Maven
```

3. 解压安装

```bash
$ tar -zxvf /usr/local/src/apache-maven-3.8.8-bin.tar.gz -C /usr/local/Maven/
```

4. 创建软连接

```bash
$ ln -s /usr/local/Maven/apache-maven-3.8.8/ /usr/local/maven
```

5. 配置环境变量

在`/etc/profile.d`目录创建`mvn.sh`文件：

```bash
$ sudo vim /etc/profile.d/mvn.sh
export MAVEN_HOME=/usr/local/maven
export PATH=$MAVEN_HOME/bin:$PATH
```

使之生效：

```bash
$ source /etc/profile
```

6. 校验

```bash
$ mvn -v
```

7. 配置

- 创建repo存放目录

```bash
$ mkdir /usr/local/maven/repository
```

- 配置存放repo

  ```bash
  $ vim /usr/local/maven/conf/settings.xml 
  ```

    - 配置`localRepository`【多用户访问不建议配置】

  ```xml
    <!-- localRepository
     | The path to the local repository maven will use to store artifacts.
     |
     | Default: $ {user.home}/.m2/repository
    <localRepository>/path/to/local/repo</localRepository>
    -->
    <localRepository>/usr/local/maven/repository</localRepository>
  ```

  **说明：**需要修改`/usr/local/maven/repository`为`jenkins`用户权限。

  > $ sudo chown jenkins.jenkins /usr/local/maven/repository

    - 配置`mirror`

  ```xml
    <mirrors>
      <!-- mirror
       | Specifies a repository mirror site to use instead of a given repository. The repository that
       | this mirror serves has an ID that matches the mirrorOf element of this mirror. IDs are used
       | for inheritance and direct lookup purposes, and must be unique across the set of mirrors.
       |
      <mirror>
        <id>mirrorId</id>
        <mirrorOf>repositoryId</mirrorOf>
        <name>Human Readable Name for this Mirror.</name>
        <url>http://my.repository.com/repo/path</url>
      </mirror>
       -->
      <mirror>
          <id>nexus</id>
          <mirrorOf>*,!cloudera</mirrorOf>
          <name>nexus maven</name>
          <url>http://maven.aliyun.com/nexus/content/groups/public</url>
          <!--<url>http://localhost:8081/repository/maven-public/</url>-->
          <!--<url>http://www.ishanshan.com/nexus/content/groups/public/</url>-->
      </mirror>
    </mirrors>
  ```
