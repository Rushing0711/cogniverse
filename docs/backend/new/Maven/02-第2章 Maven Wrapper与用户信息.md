# 第2章 Maven Wrapper与用户信息

## 2.1 mvnw

我们使用Maven时，基本上只会用到`mvn`这一个命令。有些童鞋可能听说过`mvnw`，这个是啥？

`mvnw`是Maven Wrapper的缩写。因为我们安装Maven时，默认情况下，系统所有项目都会使用全局安装的这个Maven版本。但是，对于某些项目来说，它可能必须使用某个特定的Maven版本，这个时候，就可以使用Maven Wrapper，它可以负责给这个特定的项目安装指定版本的Maven，而其他项目不受影响。

简单地说，Maven Wrapper就是给一个项目提供一个独立的，指定版本的Maven给它使用。

### 安装Maven Wrapper

安装Maven Wrapper最简单的方式是在项目的根目录（即`pom.xml`所在的目录）下运行安装命令：

```bash
mvn wrapper:warpper
```

---

## 2.2 用户信息

### Nexus用户

| 用户名 | 密码     |
| ------ | -------- |
| admin  | admin123 |
| nexus  | nexus123 |
|        |          |
