# backend-spring6-learning

[TOC]

进度：

https://www.bilibili.com/video/BV1kR4y1b7Qc?spm_id_from=333.788.player.switch&vd_source=b850b3a29a70c8eb888ce7dff776a5d1&p=14

源码：

https://www.bilibili.com/video/BV1zd4y1L7YD/?spm_id_from=333.337.search-card.all.click&vd_source=b850b3a29a70c8eb888ce7dff776a5d1

# 第1章 环境要求

- Spring6.2.1

- IntelliJ IDEA 2024.3.1.1

- Java17（Spring6要求最低Java17）
- Maven3.6.3+

## 1.1 pom模板

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.coding.spring</groupId>
    <artifactId>spring6</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <modules>
        <module>spring-first</module>
    </modules>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!-- 定义三方包 beg -->
            <!-- 定义三方包 end -->


            <!-- 定义二方包 beg -->
            <!-- 定义二方包 end -->


            <!-- 定义一方包 beg -->
            <!-- 定义一方包 end -->
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <!-- 定义三方包 beg -->
        <!-- 定义三方包 end -->


        <!-- 定义二方包 beg -->
        <!-- 定义二方包 end -->


        <!-- 定义一方包 beg -->
        <!-- 定义一方包 end -->
    </dependencies>
</project>
```



