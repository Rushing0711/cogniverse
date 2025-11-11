# 第3章 npm包管理器

## 1、NPM是什么

NPM的全称是`Node Package Manager`，是随同NodeJS一起安装的包管理和分发工具，它很方便让JavaScript开发者下载、安装、上传以及管理已经安装的包。

## 2、NPM模块的版本号

每一个模块后面对应的就是他的版本号，如"^4.10.1"。下面是几个版本的表达式：

| 表达式                     | 版本范围              |
| -------------------------- | --------------------- |
| >=1.2.7                    | 大于等于1.2.7         |
| >=1.2.7<1.3.0              | 1.2.7,1.2.8,1.2.9     |
| 1.2.3-2.3.4                | >=1.2.3<=2.3.4        |
| 1.2-2.3.4                  | >=1.2.0<=2.3.4        |
| 1.2.3-2.3                  | >=1.2.3<2.4.0         |
| 1.2.3-2                    | >=1.2.3<3.0.0         |
| *                          | >=0.0.0               |
| 1.x(等价于1.X)             | >=1.0.0<2.0.0         |
| 1(等价于1.x.x)             | >=1.0.0 <2.0.0        |
| 1.2(等价于1.2.x)           | >=1.2.0 <1.3.0        |
| ~1.2.3(>=1.2.3 <1.(2+1).0) | >=1.2.3 <1.3.0        |
| ~1.2(>=1.2.0 <1.(2+1).0)   | >=1.2.0 <1.3.0        |
| ~1(>=1.0.0 <(1+1).0.0)     | >=1.0.0 <2.0.0        |
| ~0.2.3(>=0.2.3 <0.(2+1).0) | >=0.2.3 <0.3.0        |
| ~0.2(>=0.2.0 <0.(2+1).0)   | >=0.2.0 <0.3.0        |
| ~0(>=0.0.0 <(0+1).0.0)     | >=0.0.0 <1.0.0        |
| ~1.2.3-beta.2              | >=1.2.3-beta.2 <1.3.0 |
| ^1.2.3                     | >=1.2.3 <2.0.0        |
| ^0.2.3                     | >=0.2.3 <0.3.0        |
| ^0.0.3                     | >=0.0.3 <0.0.4        |
| ^1.2.3-beta.2              | >=1.2.3-beta.2 <2.0.0 |
| ^0.0.3-beta                | >=0.0.3-beta <0.0.4   |
| ^1.2.x                     | >=1.2.0 <2.0.0        |
| ^0.0.x                     | >=0.0.0 <0.1.0        |
| ^0.0                       | >=0.0.0 <0.1.0        |
| ^1.x                       | >=1.0.0 <2.0.0        |
| ^0.x                       | >=0.0.0 <1.0.0        |

npm包的版本号格式X.Y.Z，版本号的格式遵循semver 2.0规范，其中X为主版本号，只有更新了不向下兼容的API时修改主版本号；Y为次版本号，当模块增加了向下兼容的功能时进行修改；Z为修订版本号，当模块进行了向下兼容的bug修改后进行修改，这就是**语义化的版本控制**。

### 2.1、脱字符`^`

默认情况下，当用--save或者--save-dev安装模块时，npm通过脱字符（^）来限定所安装模块的`最新的`主版本号，而该脱字符对不同的版本号有不同的更新机制。

- `^1.2.1` 代表的更新版本范围为>=1.2.1&&<2.0.0
- `^0.2.1` 代表的更新版本范围为>=0.2.1&&<0.3.0
- `^0.0.2` 代表的更新版本范围为0.0.2（相当于锁定了0.0.2版本）

### 2.2、波浪号`~`

波浪号`~`会匹配最近的小版本依赖包。

- `~1.2.3`匹配 >=1.2.x<1.3.0
- `~1.2`匹配 >=1.2.0 <1.3.0
- `~1`匹配 >=1.0.0 <2.0.0

## 3、NPM命令

https://docs.npmjs.com/cli/v11/commands/npm

### 3.1 npm init/create

> npm v6版本给init命令添加了别名create。

在项目中引导创建一个package.json文件

安装包的信息可保存到项目的package.json文件中，以便后续的其他的项目开发或者他人合作使用，也就是说package.json在项目中是必不可少的。

```bash
npm init [-f|--force|-y|--yes|--scope]
```

- 无需人工干预的初始化

```bash
npm init -f
或者
npm init -y
```

- 交互式初始化

```bash
$ npm init
```

```bash
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (01-npm) 
version: (1.0.0) 
description: 
entry point: (index.js) 
test command: 
git repository: 
keywords: 
license: (ISC) 
About to write to /Users/wenqiu/WebstormProjects/frontend-node-learning/node-03-npm/01-npm/package.json:

{
  "name": "01-npm",   # 包的名字
  "version": "1.0.0", # 包的版本
  "main": "index.js", # 包的入口文件
  "scripts": {        # 脚本配置
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "wenqiu <liming20110711@163.com>", # 作者
  "license": "ISC",   # 开源证书
  "description": ""   # 包的描述
}


Is this OK? (yes) 

npm notice
npm notice New major version of npm available! 10.8.2 -> 11.6.2
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.2
npm notice To update run: npm install -g npm@11.6.2
npm notice
```

初始化的过程中还有一些注意事项：

1. package name（`包名`）不能使用中文、大写，默认值是`文件夹的名称`，所以文件夹名称也不能使用中文和大写。
2. version（`版本号`）要求`x.x.x`的形式定义，`x`必须是数字，默认值是`1.0.0`
3. ISC证书与MIT证书功能上是相同的，关于开源证书扩展阅读。

http://www.ruanyifeng.com/blog/2011/05/how_to_choose_free_software_licenses.html

4. `package.json`可以手动创建与修改
5. 使用`npm init -y`或者`npm init –yes`极速创建`package.json`



#### 3.1.0 扩展：开源许可说明和举例

| 许可证                 | 特点                           | 菜谱使用/修改/分发规则                                       |
| ---------------------- | ------------------------------ | ------------------------------------------------------------ |
| MIT / BSD              | 极宽松，只要保留署名           | **任你拿走、印刷、修改、再卖钱都行**，只要保留封面上原作者名字即可。 |
| Apache 2.0             | 宽松 + 专利权授予与防护        | **同 MIT，还额外承诺：若有人就这本菜谱提专利纠纷，你来承担赔偿**，其余使用、改动、分发自由。 |
| MPL（Mozilla）         | 文件级开源，修改文件需开源     | **你可以闭源分享整本菜谱，但改动过的那几页（你加的新步骤、新配方）必须公开**，其他章节可私下流通。 |
| LGPL                   | “弱” copyleft，可链接闭源      | **你拿菜谱里的一道配方当“工具”在自己菜谱里用（链接使用）不用公开整个菜谱，但如果你修改了那道配方本身，必须公开修改后的配方**。 |
| GPLv2                  | 强 copyleft，衍生即开源        | **只要用这本菜谱的任意内容做出新菜谱，整本新菜谱都必须公开并保持同样的开源协议**。 |
| GPLv3                  | GPLv2 + 专利与防篡改保护       | **同 GPLv2，且额外保证：如果有人用这本菜谱起诉你专利侵权，你不会“把门关死”**（防止他人用专利或硬件锁定你的改动）。 |
| AGPLv3                 | GPLv3 + 网络交互即开源         | **不仅新菜谱要公开，如果你在线直播教学这本菜谱，直播脚本也要一起发到网上**（网络交互即需开源）。 |
| SSPL                   | AGPLv3 + 后台组件全面开源      | **比 AGPLv3 更严：不但直播脚本要公开，连后台准备食材、布置厨房、配餐流程的所有“幕后”步骤都要一并公布**。 |
| BSL（Business Source） | 源可用限期限制，过期自动转宽松 | **你给出完整菜谱试用，但规定一年内不能靠它开餐厅赚钱；一年后，菜谱自动变成 MIT/Apache 那样的宽松许可证**。 |
| 专有（Proprietary）    | 完全闭源，仅授权使用           | **菜谱完全保密，不给复印，不给修改，也不允许线上教学，想用就得付费买独家授权**。 |

### 3.2 npm search

```bash
npm search <search term> [<search term> ...]

aliases: find, s, se
```

- 搜索math相关包

```bash
$ npm search math
```



### 3.3 npm view 查看某个包的所有版本

```shell
$ npm view webpack versions
```



### 3.4 npm install

```shell
npm install (with no args, in package dir)
npm install [<@scope>/]<name>
npm install [<@scope>/]<name>@<tag>
npm install [<@scope>/]<name>@<version>
npm install [<@scope>/]<name>@<version range>
npm install <git-host>:<git-user>/<repo-name>
npm install <git repo url>
npm install <tarball file>
npm install <tarball url>
npm install <folder>

aliases: npm i, npm add
common options: [-P|--save-prod|-D|--save-dev|-O|--save-optional] [-E|--save-exact] [-B|--save-bundle] [--no-save] [--dry-run]
```

- 安装指定版本：

```shell
npm install gulp@3.9.1
```

项目对模块的依赖可以使用下面的3种方法来表示（假设当前版本号是1.1.0）：

1. 兼容模块新发布的补丁版本：`~1.1.0`、`1.1.x`、`1.1`

2. 先容模块新发布的小版本、补丁版本：`^1.1.0`、`1.x`、`1`

3. 兼容模块新发布的大版本、小版本、补丁版本：`*`、`x`



小贴士：安装`chromedriver@2.27.2`碰到过错误导致安装失败：

> npm ERR! node:events:495
> npm ERR!       throw er; // Unhandled 'error' event
> npm ERR!       ^

解决：

> npm install chromedriver@2.27.2 --ignore-scripts

可以作为以后解决问题的参考！！！



- `S,--save`安装包信息将加入到dependencies(生产阶段的依赖）【默认方式】

```shell
npm install gulp --save 
或
npm install gulp -S
或
npm install gulp
```

package.json文件的dependencies字段：

```json
"dependencies": {
    "gulp": "^3.9.1"
}
```



- `-D,--save-dev`安装包信息将加入到devDependencies（开发阶段的依赖），所以开发阶段一般使用它

```shell
npm install gulp --save-dev 
或
npm install gulp -D
```

package.json文件的devDependencies字段：

```json
"devDependencies": {
    "gulp": "^3.9.1"
}
```



- `-O,--save-optional`安装包信息将加入到optionalDependencies(可选阶段的依赖)

```shell
npm install gulp --save-optional 
或
npm install gulp -O
```

package.json文件的optionalDependencies字段：

```json
"optionalDependencies": {
    "gulp": "^3.9.1
}
```



- `E,--save-exact`精确安装指定模块版本

```shell
npm install gulp --save-exact
或
npm install gulp -E
```

输入命令`npm install gulp -ES`，留意package.json文件的dependencies字段，可以看到版本号中的`^`消失了

```json
"dependencies": {
    "gulp": "3.9.1"
}
```

模块的依赖都被写入了package.json文件后，他人打开项目的根目录（项目开源、内部团队合作），使用`npm install`命令可以根据dependencies配置安装所有的依赖包。

```shell
npm install
```



- 本地安装（local）

```shell
npm install gulp
```

- 全局安装（global），使用`-g`或`--global`

```shell
npm install gulp -g
```

- 全局安装加上`-D`效果，安装到开发和运行环境

```bash
npm install -gd vue-cli
```





### 3.5 npm uninstall

```shell
npm uninstall [<@scope>/]<pkg>[@<version>]... [-S|--save|-D|--save-dev|-O|--save-optional|--no-save]

aliases: remove, rm, r, un, unlink
```



- 卸载开发版本的模块

```shell
npm uninstall gulp --save-dev
```

- 卸载全局安装的vue-cli

```bash
npm uninstall vue-cli -g
```



### 3.6 npm update

```shell
npm update [-g] [<pkg>...]

aliases: up, upgrade
```



### 3.7 npm ls

查看安装的模块

```shell
npm ls [[<@scope>/]<pkg> ...]

aliases: list, la, ll
```

- 查看全局安装的模块及依赖

```bash
npm ls -g
```

- 查看全局安装的模块

```bash
npm ls -g --depth=0
```

### 3.8 npm list

- 查看项目依赖包

```shell
npm list
```

- 指定查看层级

```shell
npm list --depth 2
```

### 3.9 npm help

查看某条命令的帮助详情

```shell
npm help <term> [<terms..>]
```



### 3.10 npm config

管理npm的配置路径

```bash
npm config set <key> <value> [-g|--global]
npm config get <key>
npm config delete <key>
npm config list [-l] [--json]
npm config edit
npm get <key>
npm set <key> <value> [-g|--global]

aliases: c
```

- 设置淘宝镜像

```shell
npm config set registry https://registry.npm.taobao.org # 已废弃
npm config set registry https://registry.npmmirror.com
```

- 获取镜像设置

```shell
npm config get registry
```

- 查看配置列表

```shell
npm config list
```

- 删除配置项

```shell
npm config delete <key>
```

- 编辑配置文件

```shell
npm config edit
```

- 查看所有配置默认值

```bash
npm config ls -l
```



### 3.11 npm cache

管理模块的缓存

```bash
npm cache add <tarball file>
npm cache add <folder>
npm cache add <tarball url>
npm cache add <name>@<version>

npm cache clean [<path>]
aliases: npm cache clear, npm cache rm

npm cache verify
```

- 清除npm本地缓存

```bash
npm cache clean
```

### 3.12 npm root

显示npm根目录

```bash
npm root [-g]
```

在标准输出上将有效的`node_modules`文件夹打印出来。

### 3.13 cnpm

安装：

```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org # 已废弃
npm install -g cnpm --registry=https://registry.npmmirror.com
```

cnpm是npm的国内镜像。

网址：https://npmmirror.com/



### 3.14 npm outdated

检查模块是否已经过时

```shell
npm outdated [[<@scope>/]<pkg> ...]
```



### 3.15 npm audit

**是npm 6 新增的一个命令,可以允许开发人员分析复杂的代码并查明特定的漏洞。** 该命令会在项目中更新或者下载新的依赖包之后自动运行，如果你在项目中使用了具有已知安全问题的依赖，就收到官方的警告通知。

```bash
$ npm audit 
```