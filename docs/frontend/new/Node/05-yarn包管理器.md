# 第5章 yarn包管理器

[Yarn中文官网](https://yarn.bootcss.com/)

[Yarn英文官网](https://yarnpkg.com/)

## 1、YARN是什么

Yarn对你的代码来说是一个包管理器，你可以通过它使用全世界开发者的代码，或者分享自己的代码。Yarn做这些块捷、安全、可靠，所以你不用担心什么。

通过Yarn你可以使用其他开发者针对不同问题的解决方案，使自己的开发过程更简单。使用讴歌过程中遇到问题，你可以将其上报或者贡献解决方案。一旦问题被修复，Yarn会更新保持同步。

代码通过`包（package）（或者称为模块（moudule））`的方式来共享。一个包里包含所有需要共享的代码，以及描述包信息的文件，称为`package.json`。

## 2、使用方法

### 2.1、安装yarn

```bash
npm install -g yarn
yarn --version
```



### 2.2、初始化一个新项目

```bash
yarn init
```



### 2.3、添加依赖包

```bash
yarn add [package]
yarn add [package]@[version]
yarn add [package]@[tag]
```



### 2.4、将依赖项添加到不同依赖项类别中

分别添加到`devDependencies`、`peerDependencies`和`optionalDependencies`类别中：

```bash
yarn add [package] --dev
yarn add [package] --peer
yarn add [package] --optional
```



### 2.5、升级依赖包

```bash
yarn upgrade [package]
yarn upgrade [package]@[version]
yarn upgrade [package]@[tag]
```



### 2.6、移除依赖包

```bash
yarn remove [package]
```



### 2.7、安装项目的全部依赖

```bash
yarn
或
yarn install
```



## 3、YARN命令详解

[YARN命令详解](https://www.cnblogs.com/Jimc/p/10108821.html)

### 3.1、常用命令

- 创建项目

```bash
yarn init
```

- 安装依赖包

```bash
yarn
或
yarn install
```

- 添加依赖包

```bash
yarn add
```

- 配置淘宝镜像

```bash
yarn config set registry "https://registry.npm.taobao.org"
```

### 3.1、yarn add

添加依赖包

```bash
yarn add <package...>
yarn add <package...> [--dev/-D]
yarn add <package...> [--peer/-P]
yarn add <package...> [--optional/-O]
yarn add <package...> [--exact/-E]
yarn add <package...> [--tilde/-T]
yarn add <package...> [--ignore-workspace-root-check/-W]
yarn add <alias-package>@npm:<package>
yarn add <package...> --audit
```

- 安装到`dependencies`

```bash
yarn add <package...>
```

- 安装到`devDependencies`

```bash
yarn add <package...> [--dev/-D]
```



### 3.2、yarn bin

显示yarn安装目录

```bash
yarn bin [<executable>]
```



### 3.3、yarn cache

显示缓存

```bash
yarn cache list [--pattern <pattern>]
yarn cache dir
yarn cache clean [<module_name...>]
```

- 打印缓存目录

```bash
yarn cache dir
```

- 列出缓存包【已废弃】

```bash
yarn cache ls
```

- 列出缓存包【推荐】

```bash
yarn cache list
```

- 清除缓存

```bash
yarn cache clean
```



### 3.4、yarn check

检查包

```bash
yarn check
yarn check --integrity
yarn check --verify-tree
```



### 3.5、yarn config

配置

```bash
yarn config set <key> <value> [-g|--global]
yarn config get <key>
yarn config delete <key>
yarn config list
```



### 3.6、yarn global

全局安装依赖包

```bash
yarn global <add/bin/list/remove/upgrade> [--prefix]
```



### 3.7、yarn list

```bash
yarn list
yarn list [--depth] [--pattern]
```

- 过滤列表

```bash
yarn list --pattern gulp
yarn list --pattern "gulp|grunt"
yarn list --pattern "gulp|grunt" --depth=1
```



### 3.8、yarn remove

```bash
yarn remove <package...>
```