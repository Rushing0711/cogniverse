# backend-springboot3-learning

[TOC]

SpringBoot3进度：

https://www.bilibili.com/video/BV1Es4y1q7Bf?spm_id_from=333.788.player.switch&vd_source=b850b3a29a70c8eb888ce7dff776a5d1&p=94

SpringBoot学习笔记：https://www.yuque.com/leifengyang/springboot3

SpringBoot示例代码：https://gitee.com/leifengyang/spring-boot-3

SpringBoot文档： https://docs.spring.io/spring-boot/reference/using/build-systems.html#using.build-systems.starters

Thymeleaf官方文档：https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html

响应式编程进度：

https://www.bilibili.com/video/BV1sC4y1K7ET?spm_id_from=333.788.player.switch&vd_source=b850b3a29a70c8eb888ce7dff776a5d1&p=50

Spring AI 生态开发：

https://www.bilibili.com/video/BV11b421h7uX/?spm_id_from=333.788.recommend_more_video.3&vd_source=b850b3a29a70c8eb888ce7dff776a5d1

# SpringBoot3全栈指南

<img src="./images/SpringBoot3全栈指南.jpeg" alt="SpringBoot3全栈指南" style="zoom: 50%;" />

# SpringBoot3核心特性篇

# 第1章 SpringBoot3快速入门

## 1.1 简介

### 1.1.1 前置知识

- Java17
- Spring、SpringMVC、MyBatis
- Maven
- IDEA

### 1.1.2 环境要求

[System Requirements](https://docs.spring.io/spring-boot/system-requirements.html)

- Spring6.2.1+
- SpringBoot3.4.1+

- IntelliJ IDEA 2024.3.1.1

- Java17+ 至 Java23
- Maven3.6.3+
- Tomcat 10.1 (10.1.25 or later）
- Servlet 5.0+

### 1.1.3 SpringBoot是什么

SpringBoot帮我们简单、快速地创建一个独立的、生产级别的Spring应用（说明：SpringBoot底层是Spring）。

大多数SpringBoot应用只需要编写少量配置即可快速整合Spring平台以及第三方技术。

**特性：**

- <span style="color:red;font-weight:bold;">快速创建</span>独立Spring应用。
- 直接<span style="color:red;font-weight:bold;">嵌入</span>Tomcat、Jetty or Undertow（无需部署war包）【Servlet容器】。
- 【重点】提供可选的<span style="color:red;font-weight:bold;">starter（场景启动器）</span>，简化应用整合。
- 【重点】<span style="color:red;font-weight:bold;">按需自动配置</span>Spring以及第三方库。
- 提供<span style="color:red;font-weight:bold;">生产级特性</span>：如 监控指标、健康检查、外部化配置等。
- 无代码生成，<span style="color:red;font-weight:bold;">无xml</span>

总结：简化整合，简化开发，简化配置，简化部署，简化监控，简化运维。

## 1.2 快速体验

> 场景：浏览器发送 / 请求，返回 Hello World!

### 1.2.1 开发流程

**1 创建项目**

Maven项目父pom集成，所有SpringBoot项目都必须继承自 spring-boot-starter-parent

```xml
		<groupId>com.coding.springboot3</groupId>
		<artifactId>boot3-01-demo</artifactId>

		<parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.1</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
```

**2 导入场景**

场景启动器

```xml
    <dependencies>
        <!-- 定义三方包 beg -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!-- 定义三方包 end -->
    </dependencies>
```

**3 主程序和业务代码**

```java
@RestController
@SpringBootApplication
public class Boot301Application {

    @RequestMapping("/")
    String home() {
        return "Hello World!";
    }

    public static void main(String[] args) {
        SpringApplication.run(Boot301Application.class, args);
    }

}
```

**4 测试**

默认启动访问： http://localhost:8080/

**5 打包**

```xml
    <build>
      	<finalName>demo</finalName>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
```

- 打包命令

```bash
$ mvn -pl boot3-01-demo -am clean package -Dmaven.test.skip=true
```

- 执行命令

  - 方式一

  ```bash
  $ java -jar boot3-01-demo/target/demo.jar 
  ```

  - 方式二

  ```bash
  $ mvn -pl boot3-01-demo spring-boot:run
  ```

  - 方式三

  直接运行注解`@SpringBootApplication`标注的main方法。

### 1.2.2 特性小结

**1 简化整合**

导入相关的场景启动器，拥有相关的功能。

默认支持的所有场景：https://docs.spring.io/spring-boot/reference/using/build-systems.html#using.build-systems.starters

- 官方提供的场景：命名为`spring-boot-starter-*`
- 第三方提供场景：命名为`thirdpartyproject-spring-boot-starter`

<span style="color:#32CD32;font-weight:bold;">场景一导入，万物皆就绪</span>

**2 简化开发**

无需编写任何配置，直接开发业务。

**3 简化配置**

`application.properties`

- 集中式管理配置。只需要修改这个文件即可。
- 配置基本都有默认值。
- 能写的所有配置都在：https://docs.spring.io/spring-boot/appendix/application-properties/index.html

**4 简化部署**

打包为可执行的jar包。

Linux服务器上有Java环境。

**5 简化监控**

可以通过指标（比如健康检查等指标）监控。

**6 简化运维**

修改配置（外部放一个application.properties文件）。

......

### 1.2.3 Spring Initializr创建向导

Spring Boot向导：

<img src="./images/image-20250121230423280.png" alt="image-20250121230423280" style="zoom:50%;" />

Spring Boot创建好的项目结构：

<img src="./images/image-20250121230323947.png" alt="image-20250121230323947" style="zoom:50%;" />

## 1.3 应用分析

### 1.3.1 依赖管理机制

**1 为什么导入`spring-boot-starter-web`所有相关依赖都导入进来了？**

- 在Spring Boot中，开发什么场景，导入什么场景的启动器即可。比如：开发Web，引入`spring-boot-starter-web`
- maven依赖传递原则。假若A=>B=>C，则A就拥有B和C。
- 导入场景启动器。场景启动器自动把这个场景的所有核心依赖全部导入进来。

**2 为什么版本号都不需要写？**

- 每个boot项目都有一个父项目`spring-boot-starter-parent`
- parent的父项目是`spring-boot-dependencies`
- 父项目**版本仲裁中心**，把所有场景的jar的依赖版本都声明好了。
- 比如：`mysql-connector-j`

**3 自定义版本号**

- 利用maven的就近原则

  - 直接在当前项目`properties`标签中声明父项目用的版本属性的key。

    ```xml
        <properties>
            <mysql.version>9.1.0</mysql.version>
        </properties>
    ```

  - 直接在**导入依赖的时候声明版本**

    ```xml
        <dependencies>
            <dependency>
                <groupId>com.mysql</groupId>
                <artifactId>mysql-connector-j</artifactId>
                <version>${mysql.version}</version>
            </dependency>
    	  </dependencies>
    ```

**4 第三方的jar包**

- boot父项目没有管理的需要自行声明

```xml
<!-- https://mvnrepository.com/artifact/com.alibaba/druid -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.2.16</version>
</dependency>
```

![img](images/1679294529375-4ee1cd26-8ebc-4abf-bff9-f8775e10c927.png)

### 1.3.2 自动配置机制

**1 初步理解**

- **自动配置**的 Tomcat、SpringMVC等

  - **导入场景**，容器中就会自动配置好这个场景的核心组件。
  - 以前：DispatcherServlet、ViewResolver、CharacterEncodingFilter......
  - 现在：自动配置好的这些组件
  - 验证：**容器中有了什么组件，就具有什么功能**

  ```java
      public static void main(String[] args) {
          // java10: 局部变量类型的自动推断
          var ioc = SpringApplication.run(Boot302Application.class, args);
  
          // 1 获取容器中所有组件的名字
          var names = ioc.getBeanDefinitionNames();
          // 2 挨个遍历
          // SpringBoot把以前配置的核心组件现在都给我们自动配置好了，比如：dispatcherServlet、beanNameViewResolver、characterEncodingFilter、multipartResolver
          for (String name : names) {
              System.out.println(name);
          }
      }
  
  ```

- 默认的包扫描规则
  - `@SpringBootApplication`标注的类就是主程序类
  - **SpringBoot只会扫描主程序所在的包及其下面的子包，自动的component-scan功能**
  - **自定义扫描路径**
    - `@SpringBootApplication(scanBasePackages="com.coding")`
    - `@ComponentScan("com.coding")`直接指定扫描的路径。
- **配置默认值**
  - **配置文件**的所有配置项是和某个**类的对象**值进行一一绑定的。
  - 绑定了配置文件中每一项值的类：**属性类**
  - 比如：
    - `ServerProperties`绑定了所有Tomcat服务器有关的配置
    - `MultipartProperties`绑定了所有文件上传相关的配置
    - ......参照[官方文档](https://docs.spring.io/spring-boot/appendix/application-properties/index.html)：或者参照绑定的**属性类**

-  按需加载自动配置
  - 导入场景`spring-boot-starter-web`
  - 场景启动器除了会导入相关功能依赖，导入一个`spring-boot-starter`，是所有`starter`的`starter`，基础核心starter
  - `spring-boot-starter`导入了一个包`spring-boot-autoconfigure`。包里面都是各种场景的`AutoConfiguration`**自动配置类**
  - 虽然全场景的自动配置都在`spring-boot-autoconfigure`这个包，但是不是全部都开启的。
    - 导入哪个场景就开启哪个自动配置。

总结：导入场景启动器、触发`spring-boot-autoconfigure`这个包的自动配置生效、容器中就会具有相关场景的功能。



**2 完整流程**

> 思考：
>
> 1、<span style="color:red;font-weight:bold;">SpringBoot怎么实现导入一个`starter`、写一些简单配置，应用就能跑起来，让我们无需关心整合。</span>
>
> 2、为什么Tomcat的端口号可以配置在`application.properties`中，并且`Tomcat`能启动成功？
>
> 3、导入场景后哪些**自动配置能生效**？

![img](images/1679970508234-3c6b8ecc-6372-4eb5-8c67-563054d1a72d.png)

**自动配置流程细节梳理：**

1. 导入`spring-boot-starter-web`：导入了web开发场景
   1. 场景启动器导入了相关场景的所有依赖：
      - `spring-boot-starter-json`
      - `spring-boot-starter-tomcat`
      - `spring-web`
      - `spring-webmvc`
   2. 每个场景启动器都引入了一个`spring-boot-starter`，核心场景启动器。
   3. **核心场景启动器**引入了`spring-boot-autoconfigure`包。
   4. `spring-boot-autoconfigure`里面囊括了所有场景的所有配置。
   5. 只要这个包下的所有类都能生效，那么相当于SpringBoot官方写好的整合功能就生效了。
   6. SpringBoot默认却扫描不到`spring-boot-autoconfigure`下写好的所有**配置类**。（这些**配置类**给我们做了整合操作），**默认只扫描主程序所在的包**。
2. **主程序**：`@SpringBootApplication`
   1. `@SpringBootApplication`由三个注解组成`@SpringBootConfiguration`、`@EnableAutoConfiguration`和`@ComponentScan`。
   2. SpringBoot默认只能扫描自己主程序所在的包及其下面的子包，扫描不到`spring-boot-autoconfigure`包中官方写好的**配置类**。
   3. `@EnableAutoConfiguration`：SpringBoot**开启自动配置的核心**。
      1. 是由`@Import({AutoConfigurationImportSelector.class})`提供功能：批量给容器中导入组件。
      2. SpringBoot启动会默认加载`153`个配置类。
      3. 这**153个配置类**来自于`spring-boot-autoconfigure`下`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`包下的153个`xxxxAutoConfiguration`类导入进来（**自动配置类**）。
   4. 按需生效：
      1. 虽然导入了`153`个自动配置类，并不是这`153`个自动配置类都能生效。
      2. 每一个自动配置类，都有条件注解`@ConditionalOnxxx`，只有条件成立，才能生效。
3. **`xxxxAutoConfiguration`自动配置类**
   1. **给容器中使用@Bean放一堆组件。**
   2. 每个**自动配置类**都可能有这个注解`@EnableConfigurationProperties(ServerProperties.class)`，用来把配置文件中配的指定前缀的属性封装到`XXXXProperties`属性类中。
   3. 以Tomcat为例：把服务器的所有配置都是以`server`开头的。配置都封装到了属性类中。
   4. 给**容器**中放的所有**组件**的一些**核心参数**，都来自于**`XXXXProperties`**。**`XXXXProperties`都是和配置文件绑定。**
   5. **只需要修改配置文件的值，核心组件的底层参数都能修改。**
4. 写业务，全程无需关心各种整合（底层这些整合写好了，而且也生效了）

<span style="color:red;font-weight:bold;">核心流程总结：</span>

1. 导入`starter`，就会导入`autoconfigure`包。
2. `autoconfigure`包里面有一个文件`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`，里面指定的所有启动要加载的自动配置类。
3. `@EanbleAutoConfiguration`会自动的把上面文件里面写的所有**自动配置类都导入进来。XXXXAutoConfiguration是有条件注解进行按需加载**。
4. `XXXXAutoConfiguration`给容器中导入一堆组件，组件都是从`XXXXProperties`中提取属性值。
5. `XXXXProperties`又是和**配置文件**进行了绑定。

**效果：**导入`starter`、修改配置文件，就能修改底层行为。



**3 如何学好SpringBoot**

框架的框架、底层基于Spring。能调整每一个场景的底层行为。100%项目一定会用到**底层自定义**。

以摄影为例：

- 傻瓜（SpringBoot）：自动配置好。
- **单反**（Spring）：焦距、光圈、快门、感光度......
- 傻瓜+**单反**：

1. 理解**自动配置原理**

   a. 导入starter ==> 生效xxxxAutoConfiguration ==> 组件 ==> xxxxProperties ==> 配置文件

2. 理解**其他框架底层**

   a. 拦截器

3. 可以随时**定制化任何组件**

   a. 配置文件

   b. 自定义组件

普通开发：`导入starter`，Controller、Service、Mapper、偶尔修改配置文件

**高级开发**：自定义组件、自定义配置、自定义starter

核心：

- 这个场景自动配置导入了哪些组件，我们能不能Autowired进来使用
- 能不能通过修改配置改变组件的一些默认参数
- 需不需要自己完全定义这个组件
- <span style="color:red;font-weight:bold;">场景定制化</span>

<span style="color:red;font-weight:bold;">最佳实战：</span>

- <span style="color:red;font-weight:bold;">选场景，导入到项目</span>
  - <span style="color:red;">官方：starter</span>
  - <span style="color:red;">第三方：去仓库搜</span>
- <span style="color:red;font-weight:bold;">写配置，改配置文件关键项</span>
  - <span style="color:red;">数据库参数（连接地址、账号密码......）</span>
- <span style="color:red;">分析这个场景给我们导入了</span><span style="color:red;font-weight:bold;">那些能用的组件</span>
  - <span style="color:red;font-weight:bold;">自动装配</span><span style="color:red;">这些组件进行后续使用</span>
  - <span style="color:red;">不满意boot提供的自动配好的默认组件</span>
    - <span style="color:red;font-weight:bold;">定制化</span>
      - <span style="color:red;">改配置</span>
      - <span style="color:red;">自定义组件</span>

整合redis：

- <span style="color:#1E90FF;">选场景</span>：`spring-boot-starter-data-redis`
  - 场景AutoConfiguration就是这个场景的自动配置类
- 写配置
  - 分析到这个场景的自动配置类开启了哪些属性绑定关系
  - `@EanbleConfigurationProperties(RedisProperties.class)`
  - 给业务代码中自动装配`StringRedisTemplate`
- 分析组件
  - 分析到`RedisAutoConfiguration`给容器中放了`StringRedisTemplate`
  - 给业务代码中自动装配了`StringRedisTemplate`
- 定制化
  - 修改配置文件
  - 自定义组件，自己给容器中放一个`StringRedisTemplate`

## 1.4 核心技能

### 1.4.1 常用注解

> SpringBoot摒弃XML配置方式，改为**全注解驱动**

**1 组件注册**

@Configuration、@SpringBootConfiguration

@Bean、@Scope

@Controller、@Service、@Repository、@Component

@Import

@ComponentScan

步骤：

1、@Configuration编写一个配置类

2、在配置类中，自定义方法给容器中注册组件。配置@Bean

3、或使用@Import导入第三方的组件



**2 条件注解**

> 如果注解指定的**条件成立**，则触发指定行为。

<span style="color:#FF00FF;font-weight:bold;">@ConditionalOnXXXX</span>

<span style="color:#9400D3;font-weight:bold;">@ConditionalOnClass：如果类路径中存在这个类，则触发指定行为</span>

<span style="color:#9400D3;font-weight:bold;">@ConditionalOnMissingClass：如果类路径中不存在这个类，则触发指定行为</span>

<span style="color:#9400D3;font-weight:bold;">@ConditionalOnBean：如果容器中存在这个Bean（组件），则触发指定行为</span>

<span style="color:#9400D3;font-weight:bold;">@ConditionalOnMissingBean：如果容器中不存在这个Bean（组件），则触发指定行为</span>

> 场景：
>
> - 如果存在`FastsqlException`这个类，给容器中放一个`Cat`组件，名cat01，
> - 否则，就给容器中放一个`Dog`组件，名为dog01
> - 如果系统中有`dog01`这个组件，就给容器中放一个User组件，名为zhangsan
> - 否则，就放一个User，名叫lisi

<span style="color:#9400D3;font-weight:bold;">@ConditionalOnBean(value=组件类型，name=组件名字)：判断容器中是否有这个类型的组件，并且名字是指定的值</span>

@ConditionalOnRepositoryType (org.springframework.boot.autoconfigure.data)
@ConditionalOnDefaultWebSecurity (org.springframework.boot.autoconfigure.security)
@ConditionalOnSingleCandidate (org.springframework.boot.autoconfigure.condition)
@ConditionalOnWebApplication (org.springframework.boot.autoconfigure.condition)
@ConditionalOnWarDeployment (org.springframework.boot.autoconfigure.condition)
@ConditionalOnJndi (org.springframework.boot.autoconfigure.condition)
@ConditionalOnResource (org.springframework.boot.autoconfigure.condition)
@ConditionalOnExpression (org.springframework.boot.autoconfigure.condition)
<span style="color:#9400D3;font-weight:bold;">@ConditionalOnClass</span> (org.springframework.boot.autoconfigure.condition)
@ConditionalOnEnabledResourceChain (org.springframework.boot.autoconfigure.web)
<span style="color:#9400D3;font-weight:bold;">@ConditionalOnMissingClass</span> (org.springframework.boot.autoconfigure.condition)
@ConditionalOnNotWebApplication (org.springframework.boot.autoconfigure.condition)
@ConditionalOnProperty (org.springframework.boot.autoconfigure.condition)
@ConditionalOnCloudPlatform (org.springframework.boot.autoconfigure.condition)
<span style="color:#9400D3;font-weight:bold;">@ConditionalOnBean</span> (org.springframework.boot.autoconfigure.condition)
<span style="color:#9400D3;font-weight:bold;">@ConditionalOnMissingBean</span> (org.springframework.boot.autoconfigure.condition)
@ConditionalOnMissingFilterBean (org.springframework.boot.autoconfigure.web.servlet)
@Profile (org.springframework.context.annotation)
@ConditionalOnInitializedRestarter (org.springframework.boot.devtools.restart)
@ConditionalOnGraphQlSchema (org.springframework.boot.autoconfigure.graphql)
@ConditionalOnJava (org.springframework.boot.autoconfigure.condition)



**3 属性绑定**

<span style="color:#9400D3;font-weight:bold;">@ConfigurationProperties：声明组件的属性和配置文件哪些前缀开始项进行绑定</span>

<span style="color:#9400D3;font-weight:bold;">@EnableConfigurationProperties：快速注册注解</span>

- <span style="color:#9400D3;font-weight:bold;">场景：</span>SpringBoot默认只扫描自己主程序所在的包。如果导入第三方包，即使组件上标注了@Component、@ConfigurationProperties注解，也没用。因为组件都扫描不进来，此时使用这个注解就可以快速进行属性绑定并把组件注册进容器。

> 将容器中任意**组件（Bean）的属性值和配置文件**的配置项的值**进行绑定**
>
> - 1、给容器中注册组件（@Component、@Bean）
> - 2、<span style="color:#9400D3;font-weight:bold;">@ConfigurationProperties声明组件和配置文件的哪些配置项进行绑定</span>

更多注解参照：[Spring注解驱动开发](https://www.bilibili.com/video/BV1gW411W7wy)【1-26集】

### 1.4.2 YAML配置文件

> 痛点：SpringBoot集中化管理配置，`application.properties`
>
> 问题：配置多以后难阅读和修改，**层级结构辨识度不高。**

> YAML是“YAML Ain't a Markup Language”（YAML不是一种标记语言）。
>
> 在开发的这种语言时，YAML的意思其实是：“Yet Another Markup Language”（是另一种标记语言）。
>
> - 设计目标，就是**方便人类读写。**
> - **层次分明**，更适合做配置文件。
> - 使用`.yaml`或`.yml`作为文件后缀。

**1 基本语法**

- **大小写敏感**
- 使用**缩进表示层级关系，`k: v`，使用空格分隔k和v。**
- 缩进时不允许使用Tab键，只允许**使用空格**、换行。
- 缩进的空格数目不重要，只要**相同层级**的元素**左侧对齐**即可。
- **# 表示注释**，从这个字符一直到行尾，都会被解析器忽略。

支持的写法：

- **对象：键值对**的集合，如：映射（map）/哈希（hash）/字典（dictionary）
- **数组**：一组按次序排列的值，如：序列（sequence）/列表（list）
- **纯量**：单个的、不可再分的值，如：字符串、数字、bool、日期



**2 示例**

```java
@Data
@Component
@ConfigurationProperties(prefix = "person")
public class Person {
    private String name;
    private int age;
    private Date birthday;
    private Boolean like;
    private Child child; // 嵌套对象
    private List<Dog> dogs; // 数字（里面是对象）
    private Map<String, Cat> cats; // 表示Map
}

@Data
public class Child {
    private String name;
    private int age;
    private Date birthday;
    private List<String> text; // 文本字符串
}

@Data
public class Cat {
    private Long id;
    private String name;
    private Integer age;
}

@Data
public class Dog {
    private Long id;
    private String name;
    private Integer age;
}
```

- properties表示法

```properties
person.name=张三
person.age=18
person.birthday=2010/10/12 12:12:12
person.like=true
person.child.name=李四
person.child.age=12
person.child.birthday=2018/10/12
person.child.text[0]=abc
person.child.text[1]=def
person.dogs[0].name=小黑
person.dogs[0].age=3
person.dogs[1].name=小白
person.dogs[1].age=2
person.cats.c1.name=小蓝
person.cats.c1.age=3
person.cats.c2.name=小灰
person.cats.c2.age=2
```

- yaml表示法

```yaml
person:
  name: 张三
  age: 18
  birthday: 2010/10/12 12:12:12
  like: true
  child:
    name: 李四
    age: 20
    birthday: 2018/10/12
    #    text: ["abc", "def"]
    text:
      - abc
      - def
  dogs:
    - name: 小黑
      age: 3
    - name: 小白
      age: 2
  cats:
    c1:
      name: 小蓝
      age: 2
    c2: { name: 小绿, age: 2 }
```



**3 细节**

- 若是小驼峰命名的变量，比如：birthDay，推荐写为 birth-day

- **文本**：

  - **单引号**不会转义【\n则为普通字符串显示】
  - **双引号**会转义【\n会显示为换行符】

- **大文本**

  - `|`开头，大文本写在下层，**保留文本格式，换行符正确显示。**

  - `>`开头，大文本写在下层，折叠换行符。

    > <span style="color:red;font-weight:bold;">注意：若多行文本，行与行之间没有缩进，则会把\n变成空格；否则会保留格式。</span>

    <img src="./images/image-20250129121129505.png" alt="image-20250129121129505" style="zoom:50%;" />

- **多文档合并**
  - 使用`---`可以把多个yaml文档合并在一个文档中，每个文档区依然认为内容独立。

**4 小技巧：lombok**

```xml
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <scope>compile</scope>
        </dependency>
```

使用`@Data`等注解。

### 1.4.3 日志配置

> 规范：项目开发不要编写`System.out.println()`，应该用**日志**记录信息。

- 日志门面
  - JCL（Jakarta Commons Logging）
  - <span style="color:red;font-weight:bold;">SLF4j（Simple Logging Facade for Java）</span>
  - jboss-logging
- 日志实现
  - Log4j
  - JUL（java.util.logging）
  - Log4j2
  - <span style="color:red;font-weight:bold;">Logback</span>

<span style="color:red;font-weight:bold;">感兴趣日志框架关系与起源可参考：</span>https://ww.bilibili.com/video/BV1gW411W76m 视频21~27集

<span style="color:#40E0D0;font-weight:bold;">logback与log4j2引入的包对比</span>

<div style="display:flex">
	<img src="./images/image-20250131182011846.png" alt="image-20250131182011846" style="zoom:50%;" />
  <img src="./images/image-20250131182024598.png" alt="image-20250131182024598" style="zoom:50%;" />
</div>

**1 简介**

1. Spring使用<span style="color:red;">`commons-logging`</span>作为内部日志，但底层日志实现是开放的。可对接其他日志框架。
   1. Spring5及以后commongs-logging被Spring直接自己写。
2. 支持<span style="color:red;">`jul`</span>，<span style="color:red;">`log4j2`</span>，<span style="color:red;">`logback`</span>。SpringBoot提供了默认的控制台输出配置，也可以配置输出位文件。
3. <span style="color:red;">`logback`</span>是默认使用的。
4. 虽然**日志框架很多**，但是我们不用担心，使用SpringBoot的**默认配置就能工作的很好**。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              

**SpringBoot怎么把日志默认配置好的**

1. 每个`starter`场景，都会导入一个核心场景`spring-boot-starter`
2. 核心场景引入了日志的所有功能`spring-boot-starter-logging`
3. 默认使用了`logback + slf4j`组合作为默认底层日志
4. 日志是系统一启动就要用，`xxxxAutoConfiguration`是系统启动好了以后放好的组件，后来用的。
5. 日志是利用**监听器机制**配置好的。`ApplicationListener`。
6. 日志所有的配置都可以通过修改配置文件实现。以`logging`开始的所有配置。

**2 日志格式**

```shell
2025-01-29T12:08:51.210+08:00  INFO 77755 --- [boot3-02-demo] [           main] c.c.springboot3.demo.Boot302Application  : Starting Boot302Application using Java 17.0.12 with PID 77755 (/Users/wenqiu/IdeaProjects/backend-spring-learning/spring-boot-3.x/boot3-02-demo/target/classes started by wenqiu in /Users/wenqiu/IdeaProjects/backend-spring-learning)
2025-01-29T12:08:51.211+08:00  INFO 77755 --- [boot3-02-demo] [           main] c.c.springboot3.demo.Boot302Application  : No active profile set, falling back to 1 default profile: "default"
```

默认格式示例输出：

- 时间和日期：毫秒级精度。`2025-01-29T12:08:51.210+08:00`
- 日志级别：<span style="color:red;">`ERROR`</span>、<span style="color:red;">`WARN`</span>、<span style="color:red;">`INFO`</span>、<span style="color:red;">`DEBUG`</span> or <span style="color:red;">`TRACE`</span>。`INFO`
- 进程ID：`77755`
- --- ：消息分隔符
- 应用程序名称：使用[]包含。`boot-03-demo`
- 应用程序组：`无`
- 线程名：`main`
- 日志记录器Logger名：通常是产生日志的**类名**。`c.c.springboot3.demo.Boot302Application`
- 日志消息：日志记录的内容。`Starting Boot302Application using Java 17.0.12 with PID 77755 `

默认值：参照`spring-boot`包`additional-spring-configuration-metadata.json`文件

默认输出格式：参照`spring-boot`包`defaults.xml`文件

```shell
${CONSOLE_LOG_PATTERN:-%clr(%d{${LOG_DATEFORMAT_PATTERN:-yyyy-MM-dd'T'HH:mm:ss.SSSXXX}}){faint} %clr(${LOG_LEVEL_PATTERN:-%5p}){} %clr(${PID:-}){magenta} %clr(--- %esb(){APPLICATION_NAME}%esb{APPLICATION_GROUP}[%15.15t] ${LOG_CORRELATION_PATTERN:-}){faint}%clr(%-40.40logger{39}){cyan} %clr(:){faint} %m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}}
```

**逐段解析**

1. **`%clr(...){color}`**
   - 这是 Spring Boot 提供的日志着色功能，用于为日志内容添加颜色。
   - `%clr(...)` 表示对括号内的内容进行着色。
   - `{color}` 指定颜色，例如 `faint`（浅色）、`magenta`（洋红色）、`cyan`（青色）等。
2. **`%d{${LOG_DATEFORMAT_PATTERN:-yyyy-MM-dd'T'HH:mm:ss.SSSXXX}}`**
   - 定义日志的时间戳格式。
   - `%d` 表示日期时间。
   - `${LOG_DATEFORMAT_PATTERN:-yyyy-MM-dd'T'HH:mm:ss.SSSXXX}` 是一个默认值表达式：
     - 如果 `LOG_DATEFORMAT_PATTERN` 有定义，则使用它的值。
     - 如果未定义，则使用默认格式 `yyyy-MM-dd'T'HH:mm:ss.SSSXXX`（ISO 8601 格式）。
3. **`%clr(${LOG_LEVEL_PATTERN:-%5p}){}`**
   - 定义日志级别的输出格式。
   - `${LOG_LEVEL_PATTERN:-%5p}` 表示：
     - 如果 `LOG_LEVEL_PATTERN` 有定义，则使用它的值。
     - 如果未定义，则使用默认格式 `%5p`（日志级别，右对齐，宽度为 5）。
   - `%clr(...){}` 表示对日志级别进行着色，但未指定颜色（使用默认颜色）。
4. **`%clr(${PID:-}){magenta}`**
   - 输出当前进程的 PID（进程 ID）。
   - `${PID:-}` 表示：
     - 如果 `PID` 有定义，则使用它的值。
     - 如果未定义，则输出空字符串。
   - `{magenta}` 表示将 PID 着色为洋红色。
5. **`%clr(--- %esb(){APPLICATION_NAME}%esb{APPLICATION_GROUP}[%15.15t] ${LOG_CORRELATION_PATTERN:-}){faint}`**
   - 输出应用程序名称、应用程序组、线程名和关联信息（如 `traceId`）。
   - `%esb(){APPLICATION_NAME}` 和 `%esb{APPLICATION_GROUP}` 是自定义的占位符，用于输出应用程序名称和组。
   - `[%15.15t]` 表示线程名，限制为 15 个字符，超过部分截断。
   - `${LOG_CORRELATION_PATTERN:-}` 表示：
     - 如果 `LOG_CORRELATION_PATTERN` 有定义，则使用它的值。
     - 如果未定义，则输出空字符串。
   - `{faint}` 表示将这部分内容着色为浅色。
6. **`%clr(%-40.40logger{39}){cyan}`**
   - 输出日志记录器的名称。
   - `%-40.40logger{39}` 表示：
     - `logger{39}` 输出日志记录器的名称，最多 39 个字符。
     - `%-40.40` 表示左对齐，总宽度为 40 个字符，超过部分截断。
   - `{cyan}` 表示将日志记录器名称着色为青色。
7. **`%clr(:){faint}`**
   - 输出一个冒号 `:`，并着色为浅色。
8. **`%m%n`**
   - `%m` 表示日志消息。
   - `%n` 表示换行符。
9. **`${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}`**
   - 定义异常信息的输出格式。
   - `${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}` 表示：
     - 如果 `LOG_EXCEPTION_CONVERSION_WORD` 有定义，则使用它的值。
     - 如果未定义，则使用默认格式 `%wEx`（输出异常堆栈信息）。

<span style="color:red;font-weight:bold;">简化日志输出格式：</span>`%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level [%thread] %logger{15} ===> %msg%n`

- application.propertie

```properties
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level [%thread] %logger{15} ===> %msg%n
```

**3 记录日志**

```java
// 或者使用Lombok的@Slf4j注解
Logger logger = LoggerFactory.getLogger(getClass());
```

**4 日志级别**

- 由低到高：<span style="color:red;font-weight:bold;">只会打印指定级别及以上级别的日志</span>
  - ALL：打印所有日志
  - TRACE：追踪框架详细流程日志，一般不用
  - DEBUG：开发调试细节日志
  - INFO：关键、感兴趣的日志信息
  - WARN：警告但不是错误的信息日志，比如：版本过时
  - ERROR：业务错误日志，比如出现各种异常
  - FATAL：致命错误日志，比如JVM系统崩溃
  - OFF：关闭所有日志记录
- 不指定级别的所有类，都使用root指定的级别作为默认级别
- SpringBoot日志**默认级别是INFO**

1. 在<span style="color:red;font-weight:bold;">`application.properties/yaml`</span>中配置<span style="color:red;font-weight:bold;">`logging.level.<logger-name>=<level>`</span>指定日志级别
2. `level`可取值范围：`TRACE, DEBUG, INFO, WARN, ERROR, FATAL, or OFF`，定义在LogLevel类中。
3. root的`logger-name`叫`root`，可以配置`logging.level.root=warn`，代表所有未指定日志级别的类都使用root的warn级别。

**5 日志分组**

比较有用的技巧是：

将相关的`logger`分组在一起，统一配置。SpringBoot也支持。比如：Tomcat相关的日志统一设置。

```properties
logging.group.tomcat=org.apache.catalina,org.apache.coyote,org.apache.tomcat
logging.level.tomcat=trace
```

SpringBoot预定义两个组：

| Name | Loggers                                                      |
| ---- | ------------------------------------------------------------ |
| web  | <span style="color:red;">org.springframework.core.codec</span><br /><span style="color:red;">org.springframework.http</span><br /><span style="color:red;">org.springframework.web</span><br /><span style="color:red;">org.springframework.boot.actuate.endpoint.web</span><span style="color:red;">org.springframework.boot.web.servlet.ServletContextInitializerBeans</span> |
| sql  | <span style="color:red;">org.springframework.jdbc.core</span><br /><span style="color:red;">org.hibernate.SQL</span><br /><span style="color:red;">org.jooq.tools.LoggerListener</span> |

**6 文件输出**

SpringBoot默认只把日志写在控制台，如果想额外记录到文件，可以在<span style="color:red;">application.properties</span>中添加<span style="color:red;">`logging.file.name`</span>or<span style="color:red;">`logging.file.path`</span>配置项。

| <span style="color:red;">`logging.file.name`</span> | <span style="color:red;">`logging.file.path`</span> | 示例     | 效果                                                         |
| --------------------------------------------------- | --------------------------------------------------- | -------- | ------------------------------------------------------------ |
| 未指定                                              | 未指定                                              |          | 进控制台输出                                                 |
| **指定**                                            | 未指定                                              | my.log   | 写入指定文件。可以<span style="color:red;">`加路径`</span>。 |
| 未指定                                              | **指定**                                            | /var/log | 写入指定目录，文件名为<span style="color:red;">`spring.log`</span> |
| **指定**                                            | **指定**                                            |          | 以<span style="color:red;">`logging.file.name`</span>为准    |

**7 文件归档与滚动切割**

> 归档：每天的日志单独存到一个日志文件中。
>
> 切割：每个文件10MB，超过大小切割成另外一个文件。

1. 每天的日志应该独立分隔出来存档。如果使用<span style="color:red;">`logback`</span>（SpringBoot默认整合），可以通过<span style="color:red;">`application.properties/yaml`</span>文件指定日志滚动规则。
2. 如果是其他日志系统，需要自行配置（添加<span style="color:red;">`log4j2.xml`</span>或<span style="color:red;">`log4j2-spring.xml`</span>）
3. 支持的滚动规则设置如下

| 配置项                                                       | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| <span style="color:red;">`logging.logback.rollingpolicy.file-name-pattern`</span> | 日志存档的文件名格式（默认值：<span style="color:red;">`${LOG_FILE}.%d{yyyy-MM-dd}.%i.gz`</span>） |
| <span style="color:red;">`logging.logback.rollingpolicy.clean-history-on-start`</span> | 应用启动时是否清除以前存档（默认值：<span style="color:red;">`false`</span>） |
| <span style="color:red;">`logging.logback.rollingpolicy.max-file-size`</span> | 存档前，每个日志文件的最大大小（默认值：<span style="color:red;">`10MB`</span>） |
| <span style="color:red;">`logging.logback.rollingpolicy.total-size-cap`</span> | 日志文件被删除之前，可以容纳的最大大小（默认值：<span style="color:red;">`0B`</span>）。<br />设置<span style="color:red;">`1GB`</span>则磁盘存储超过1GB日志后就会删除旧日志文件。 |
| <span style="color:red;">`logging.logback.rollingpolicy.max-history`</span> | 日志文件保存的最大天数（默认值：<span style="color:red;">`7`</span>） |

**8 自定义配置**

通常我们配置<span style="color:red;">`application.properties`</span>就够了。当然也可以自定义，比如：

| 日志系统                 | 自定义                                                       |
| ------------------------ | ------------------------------------------------------------ |
| Logback                  | <span style="color:red;">`logback-spring.xml`</span>，<span style="color:red;">`logback-spring.groovy`</span>，<span style="color:red;">`logback.xml`</span>，or<span style="color:red;">`logback.groovy`</span> |
| Log4j2                   | <span style="color:red;">`log4j2-spring.xml`</span> or <span style="color:red;">`log4j2.xml`</span> |
| JDK（Java Util Logging） | <span style="color:red;">`logging.properties`</span>         |

​	如果可能，我们建议您在日志配置中使用`-spring`变量（例如：`logback-spring.xml`而不是`logback.xml`）。如果您使用标准配置文件，spring无法完全控制日志初始化。

最佳实践：自己要写配置，配置文件名加上`xx-spring.xml`。

**9 切换日志组合**

```xml
       <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
            <exclusions>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-logging</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-log4j2</artifactId>
        </dependency>
```

log4j2支持yaml和json格式的配置文件。

| 格式 | 依赖                                                         | 文件名                   |
| ---- | ------------------------------------------------------------ | ------------------------ |
| YAML | com.fasterxml.jackson.core:jackson-databind<br/>com.fasterxml.jackson.dataformat:jackson-dataformat-yaml | log4j2.yaml + log4j2.yml |
| JSON | com.fasterxml.jackson.core:jackson-databind                  | log4j2.json + log4j2.jsn |

**10 最佳实战**

1. 导入任何第三方框架，先排除它的日志包，因为Boot底层控制好了日志。
2. 修改`application.properties`配置文件，就可以调整日志的所有行为。如果不够，可以编写日志框架自己的配置文件放在类路径下就行，比如：`logback-spring.xml`，`log4j2-spring.xml`
3. 如需对接**专业日志系统**，也只需要把logback记录的日志灌倒**kafka**之类的中间件，这和SpringBoot没关系，都是日志框架自己的配置，**修改配置文件即可**。
4. **业务中使用slf4j-api记录日志。不要在sout了！！！**



# 第2章 SpringBoot3之Web开发

> SpringBoot的Web开发能力，由**SpringMVC**提供。

## 2.1 WebMvcAutoConfiguration原理

### 2.1.1 生效条件

```java
@AutoConfiguration(after = { DispatcherServletAutoConfiguration.class, TaskExecutionAutoConfiguration.class,
		ValidationAutoConfiguration.class }) // 在这些自动配置之后
@ConditionalOnWebApplication(type = Type.SERVLET) // 如果是Web应用就生效，类型SERVLET
@ConditionalOnClass({ Servlet.class, DispatcherServlet.class, WebMvcConfigurer.class })
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class) // 容器中没有这个Bean，才生效。默认没有
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE + 10) // 优先级
@ImportRuntimeHints(WebResourcesRuntimeHints.class)
public class WebMvcAutoConfiguration {
```

### 2.1.2 效果

1. 放了两个Filter：
   - a、`HiddenHttpMethodFilter`；辅助于页面表单提交Rest请求（GET、POST、PUT、DELETE）；是一个用于支持HTTP方法转换的过滤器。它允许通过POST请求来模拟其他HTTP方法（如PUT、DELETE等），这对于那些不直接支持这些方法的浏览器或客户端来说非常有用。
   - b、`FormContentFilter`：表单内容Filter，是一个用于解析提交的表单数据的过滤器。它主要的作用是处理那些通过HTTP POST请求发送的、带有application/x-www-form-urlencoded或multipart/form-data内容类型的表单数据。解析后的数据可以被Spring MVC框架正确地映射到控制器的方法参数上，比如@RequestParam, @ModelAttribute等注解所指定的参数。HTTP协议中，GET（数据放URL后面）、POST（数据放请求体）请求可以携带数据，PUT、DELETE的请求体数据会被忽略；

```java
	@Bean
	@ConditionalOnMissingBean(HiddenHttpMethodFilter.class)
	@ConditionalOnProperty(prefix = "spring.mvc.hiddenmethod.filter", name = "enabled")
	public OrderedHiddenHttpMethodFilter hiddenHttpMethodFilter() {
		return new OrderedHiddenHttpMethodFilter();
	}

	@Bean
	@ConditionalOnMissingBean(FormContentFilter.class)
	@ConditionalOnProperty(prefix = "spring.mvc.formcontent.filter", name = "enabled", matchIfMissing = true)
	public OrderedFormContentFilter formContentFilter() {
		return new OrderedFormContentFilter();
	}
```

2. `给容器中放了WebMvcConfigurer`组件；给SpringMVC添加各种定制功能
   - a、所有的功能最终会和配置文件进行绑定
   - b、WebMvcProperties：`spring.mvc`配置文件
   - c、WebProperties：`spring.web`配置文件

```java
	@Configuration(proxyBeanMethods = false)
	@Import(EnableWebMvcConfiguration.class)
	@EnableConfigurationProperties({ WebMvcProperties.class, WebProperties.class })
	@Order(0)
	public static class WebMvcAutoConfigurationAdapter implements WebMvcConfigurer, ServletContextAware {}
```

### 2.1.3 WebMvcConfigurer接口

提供了配置SpringMVC底层的所有组件入口

<img src="./images/image-20250202205643717.png" alt="image-20250202205643717" style="zoom:50%;" />

### 2.1.4 静态资源规则源码

```java
		@Override
		public void addResourceHandlers(ResourceHandlerRegistry registry) {
			if (!this.resourceProperties.isAddMappings()) {
				logger.debug("Default resource handling disabled");
				return;
			}
			addResourceHandler(registry, this.mvcProperties.getWebjarsPathPattern(),
					"classpath:/META-INF/resources/webjars/");
			addResourceHandler(registry, this.mvcProperties.getStaticPathPattern(), (registration) -> {
				registration.addResourceLocations(this.resourceProperties.getStaticLocations());
				if (this.servletContext != null) {
					ServletContextResource resource = new ServletContextResource(this.servletContext, SERVLET_LOCATION);
					registration.addResourceLocations(resource);
				}
			});
    }
```

1. 规则一：访问：`/webjars/**`路径就去`classpath:/META-INF/resources/webjars/`下找资源。

   - a、maven导入依赖

   ```xml
           <dependency>
               <groupId>org.webjars</groupId>
               <artifactId>jquery</artifactId>
               <version>3.6.1</version>
           </dependency>
   ```

   - b、jar结构图

   <img src="./images/image-20250206151715464.png" alt="image-20250206151715464" style="zoom:50%;" />

   - c、访问地址

   http://localhost:9000/webjars/jquery/3.6.1/jquery.js

2. 规则二：访问：`/**`路径就去`静态资源默认的四个位置找资源`

   - a、`classpath:/META-INF/resources/`
   - b、`classpath:/resources/`
   - c、`classpath:/static/`
   - d、`classpath:/public/`

3. 规则三：**静态资源默认都有缓存规则的设置**

   - a、所有缓存的设置，直接通过**配置文件**：`spring.web`
   - b、cachePeriod：缓存周期；多久不用找服务器要新的。默认没有，以s为单位
   - c、cacheControl：**HTTP缓存**控制； https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching
   - d、**useLastModified**：是否使用最后一次修改。配合HTTP Cache规则。

> 如果浏览器访问了一个静态资源`index.js`，如果服务这个资源没有发生变化，下次访问的时候就可以直接让浏览器用自己缓存中的东西，而不用给服务器发请求。

```java
		private void addResourceHandler(ResourceHandlerRegistry registry, String pattern,
				Consumer<ResourceHandlerRegistration> customizer) {
			if (registry.hasMappingForPattern(pattern)) {
				return;
			}
			ResourceHandlerRegistration registration = registry.addResourceHandler(pattern);
			customizer.accept(registration);
			registration.setCachePeriod(getSeconds(this.resourceProperties.getCache().getPeriod()));
						registration.setCacheControl(this.resourceProperties.getCache().getCachecontrol().toHttpCacheControl());
			registration.setUseLastModified(this.resourceProperties.getCache().isUseLastModified());
			customizeResourceHandlerRegistration(registration);
    }
```

### 2.1.5 EnableWebMvcConfiguration 源码

```java
// SpringBoot给容器中放 WebMvcConfigurationSupport 组件。
// 若自己放了 WebMvcConfigurationSupport 组件，Boot的 WebMvcAutoConfiguration 都会失效。
	@Configuration(proxyBeanMethods = false)
	@EnableConfigurationProperties(WebProperties.class)
	public static class EnableWebMvcConfiguration extends DelegatingWebMvcConfiguration implements ResourceLoaderAware {}
```

1. `HandlerMapping`：根据请求路径`/a`找哪个handler能处理请求
   - a、`WelcomePageHandlerMapping`：
     - 访问`/**`路径下的所有请求，都在以前四个静态资源路径下找，欢迎页也一样。
     - 找 `index.html`：只要静态资源的位置有一个 `index.html` 页面，项目启动默认访问。
   - b、`WelcomePageNotAcceptableHandlerMapping`：
2. `Validator`：



### 2.1.6 为什么容器中放一个WebMvcConfigurer就能配置底层行为

1. WebMvcAutoConfiguration是一个自动配置类，它里面有一个 `EnableWebMvcConfiguration`
2. `EnableWebMvcConfiguration` 继承于 `DelegatingWebMvcAutoConfiguration`，这两个类的功能都生效
3. `DelegatingWebMvcConfiguration` 利用 DI 把容器中所有 `WebMvcConfigurer` 注入进来
4. 别人调用 `DelegatingWebMvcAutoConfiguration` 的方法配置底层规则，而它委托所有的 `WebMvcConfigurer` 去配置底层方法。

### 2.1.7 WebMvcConfigurationSupport

该类提供了很多的默认设置。

判断系统中是否有相应的类：如果有，就加入相应的 `HttpMessageConverter`

```java
	static {
		ClassLoader classLoader = WebMvcConfigurationSupport.class.getClassLoader();
		romePresent = ClassUtils.isPresent("com.rometools.rome.feed.WireFeed", classLoader);
		jaxb2Present = ClassUtils.isPresent("jakarta.xml.bind.Binder", classLoader);
		jackson2Present = ClassUtils.isPresent("com.fasterxml.jackson.databind.ObjectMapper", classLoader) &&
				ClassUtils.isPresent("com.fasterxml.jackson.core.JsonGenerator", classLoader);
		jackson2XmlPresent = ClassUtils.isPresent("com.fasterxml.jackson.dataformat.xml.XmlMapper", classLoader);
		jackson2SmilePresent = ClassUtils.isPresent("com.fasterxml.jackson.dataformat.smile.SmileFactory", classLoader);
		jackson2CborPresent = ClassUtils.isPresent("com.fasterxml.jackson.dataformat.cbor.CBORFactory", classLoader);
		jackson2YamlPresent = ClassUtils.isPresent("com.fasterxml.jackson.dataformat.yaml.YAMLFactory", classLoader);
		gsonPresent = ClassUtils.isPresent("com.google.gson.Gson", classLoader);
		jsonbPresent = ClassUtils.isPresent("jakarta.json.bind.Jsonb", classLoader);
		kotlinSerializationCborPresent = ClassUtils.isPresent("kotlinx.serialization.cbor.Cbor", classLoader);
		kotlinSerializationJsonPresent = ClassUtils.isPresent("kotlinx.serialization.json.Json", classLoader);
		kotlinSerializationProtobufPresent = ClassUtils.isPresent("kotlinx.serialization.protobuf.ProtoBuf", classLoader);
	}
```

## 2.2 Web场景

### 2.2.1 自动配置

1. 整合Web场景

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
```

2. 引入了`autoconfigure`功能
3. `@EnableAutoConfiguration`注解使用`@Import(AutoConfigurationImportSelector.class)`批量导入组件。（`spring-boot-autoconfigure`）
4. 加载`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`文件中配置的所有组件。（`spring-boot-autoconfigure`）
5. 所有自动配置类如下

```tex
org.springframework.boot.autoconfigure.web.client.RestClientAutoConfiguration
org.springframework.boot.autoconfigure.web.client.RestTemplateAutoConfiguration
org.springframework.boot.autoconfigure.web.embedded.EmbeddedWebServerFactoryCustomizerAutoConfiguration
=====以下是响应式Web场景和现在的没关系-beg=====
org.springframework.boot.autoconfigure.web.reactive.HttpHandlerAutoConfiguration
org.springframework.boot.autoconfigure.web.reactive.ReactiveMultipartAutoConfiguration
org.springframework.boot.autoconfigure.web.reactive.ReactiveWebServerFactoryAutoConfiguration
org.springframework.boot.autoconfigure.web.reactive.WebFluxAutoConfiguration
org.springframework.boot.autoconfigure.web.reactive.WebSessionIdResolverAutoConfiguration
org.springframework.boot.autoconfigure.web.reactive.error.ErrorWebFluxAutoConfiguration
org.springframework.boot.autoconfigure.web.reactive.function.client.ClientHttpConnectorAutoConfiguration
org.springframework.boot.autoconfigure.web.reactive.function.client.WebClientAutoConfiguration
=====以下是响应式Web场景和现在的没关系-end=====
org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration
org.springframework.boot.autoconfigure.web.servlet.ServletWebServerFactoryAutoConfiguration
org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration
org.springframework.boot.autoconfigure.web.servlet.HttpEncodingAutoConfiguration
org.springframework.boot.autoconfigure.web.servlet.MultipartAutoConfiguration
org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration
```

6. 绑定了配置文件的一堆配置项

- 1、SpringMVC的所有配置`spring.mvc`
- 2、Web场景通用配置`spring.web`
- 3、文件上传配置`spring.servlet.multipart`
- 4、服务器的配置`server`
  - 比如：编码方式

### 2.2.2 默认效果

**默认配置：**

1. 包含了<span style="color:red;">`ContentNegotiatingViewResolver`</span>和<span style="color:red;">`BeanNameViewResolver`</span>组件，**方便视图解析**。
2. **默认的静态资源处理机制**：静态资源放在<span style="color:red;">static</span>文件夹下即可直接访问。
3. **自动注册**了<span style="color:red;">`Converter`</span>，<span style="color:red;">`GenericConverter`</span>，<span style="color:red;">`Formatter`</span>组件，适配常见的**数据类型转换和格式化需求**。
4. 支持<span style="color:red;">`HttpMessageConverters`</span>，可以**方便返回<span style="color:red;">`json`</span>等数据类型**。
5. 注册<span style="color:red;">`MessageCodesResolver`</span>，方便**国际化**及错误消息处理。
6. 支持静态<span style="color:red;">`index.html`</span>
7. **自动使用**<span style="color:red;">`ConfigurableWebBindingInitializer`</span>，实现<span style="color:red;">`消息处理`</span>、<span style="color:red;">`数据绑定`</span>、<span style="color:red;">`类型转化`</span>等功能

> **重要：**
>
> - 如果想保持 boot mvc 的默认配置，并且自定义更多的 mvc 配置，如：interceptors，formatters，view controllers等。可以使用<span style="color:red;">`@Configuration`</span>注解添加一个<span style="color:red;">`WebMvcConfigurer`</span>类型的配置类，并不要标注<span style="color:red;">`@EnableWebMvc`</span>。
> - 如果想保持 boot mvc 的默认配置，但要自定义核心组件实例，比如：<span style="color:red;">`RequestMappingHandlerMapping`</span>，<span style="color:red;">`RequestMappingHandlerAdapter`</span>，或<span style="color:red;">`ExceptionHandlerExceptionResolver`</span>，给容器中放一个<span style="color:red;">`WebMvcRegistrations`</span>组件即可。
> - 如果想要全面接管 Spring MVC，<span style="color:red;">`@Configuration`</span>标注一个配置类，并加上<span style="color:red;">@EnableWebMvc</span>注解，实现<span style="color:red;">`WebMvcConfigurer`</span>接口。

## 2.3 静态资源

### 2.3.1 默认规则

**1 静态资源映射**

静态资源映射规则在<span style="color:red;">`WebMvcAutoConfiguration`</span>中进行了定义：

1. <span style="color:red;">`/webjars/**`</span>的所有路径资源都在<span style="color:red;">`classpath:/META-INF/resources/webjars/`</span>
2. <span style="color:red;">`/**`</span>的所有路径资源都在<span style="color:red;">`classpath:/META-INF/resources/`</span>、<span style="color:red;">`classpath:/resources/`</span>、<span style="color:red;">`classpath:/static/`</span>、<span style="color:red;">`classpath:/public/`</span>
3. 所有静态资源都定义了<span style="color:red;">`缓存规则`</span>。【浏览器访问过一次，就会缓存一段时间】，但次功能参数无默认值。
   - a、<span style="color:red;">`period`</span>：缓存间隔。默认0S；
   - b、<span style="color:red;">`cacheControl`</span>：缓存控制。默认无；
   - c、<span style="color:red;">`useLastModified`</span>：是否使用<span style="color:red;">`lastModified`</span>头。默认false；

**2 静态资源缓存**

如前面所述：

1. 所有静态资源都定义了<span style="color:red;">`缓存规则`</span>。【浏览器访问过一次，就会缓存一段时间】，但次功能参数无默认值。
   - a、<span style="color:red;">`period`</span>：缓存间隔。默认0S；
   - b、<span style="color:red;">`cacheControl`</span>：缓存控制。默认无；
   - c、<span style="color:red;">`useLastModified`</span>：是否使用<span style="color:red;">`lastModified`</span>头。默认false；

**3 欢迎页**

欢迎页规则在<span style="color:red;">`WebMvcAutoConfiguration`</span>中进行了定义：

1. 在**静态资源**目录下找<span style="color:red;">`index.html`</span>
2. 没有就在<span style="color:red;">`templates`</span>下找<span style="color:red;">`index`</span>模板页

**4 Favicon**

1. 在静态资源目录下找<span style="color:red;">`favicon.ico`</span>

**5 缓存实验**

```properties
# 1、配置国际化的区域信息
# 2、静态资源策略（开启、处理链、缓存）
# 开启静态资源映射规则
spring.web.resources.add-mappings=true
# 设置缓存
#spring.web.resources.cache.period=3600
# 缓存详细合并项控制，覆盖period配置：浏览器第一次请求服务器，服务器告诉浏览器此资源缓存 7200 秒，以后 7200 秒以内的所有此资源访问不用向服务器请求，超过 7200 秒后再向服务器请求，特征：(disk cache) Cache-Control=“max-age=7200”
spring.web.resources.cache.cachecontrol.max-age=7200
# 共享缓存
#spring.web.resources.cache.cachecontrol.cache-public=true
# 使用资源 last-modified 时间，来对比服务器和浏览器的资源是否相同，若相同，返回 304，特征：Cache-Control=“空”；
spring.web.resources.cache.use-last-modified=true
```

### 2.3.2 自定义静态资源规则

> 自定义静态资源路径、自定义缓存规则

**1 配置方式**

`spring.mvc`：静态资源访问前缀路径

`spring.web`：

- 静态资源目录
- 静态资源缓存策略

```properties
# 1、配置国际化的区域信息
# 2、静态资源策略（开启、处理链、缓存）
# 开启静态资源映射规则
spring.web.resources.add-mappings=true
# 设置缓存
#spring.web.resources.cache.period=3600
# 缓存详细合并项控制，覆盖period配置：浏览器第一次请求服务器，服务器告诉浏览器此资源缓存 7200 秒，以后 7200 秒以内的所有此资源访问不用向服务器请求，超过 7200 秒后再向服务器请求，特征：(disk cache) Cache-Control=“max-age=7200”
spring.web.resources.cache.cachecontrol.max-age=7200
# 共享缓存
#spring.web.resources.cache.cachecontrol.cache-public=true
# 使用资源 last-modified 时间，来对比服务器和浏览器的资源是否相同，若相同，返回 304，特征：Cache-Control=“空”；
spring.web.resources.cache.use-last-modified=true
#
# 3、spring.mvc
# 3.1、自定义 webjars 访问路径前缀
spring.mvc.webjars-path-pattern=/wj/**
# 3.2、静态资源访问路径前缀
spring.mvc.static-path-pattern=/static/**
# 3.3、静态资源路径
spring.web.resources.static-locations=classpath:/staticaliasa/, classpath:/staticaliasb/
```

**2 代码方式**

> 容器中只要有一个WebMvcConfigurer组件。配置的底层行为都会生效
>
> @EnableWebMvc // 禁用 boot 的默认配置

```java
//@EnableWebMvc // 禁用 boot 的默认配置
/*@Configuration // 这是一个配置类，给容器中放一个 WebMvcConfigurer 组件，就能自定义底层
public class MyConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 自己写新的规则，仍旧保留了以前的默认规则
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/staticaliasa/", "classpath:/staticaliasb/")
                .setCacheControl(CacheControl.maxAge(Duration.ofSeconds(1180)));
    }
}*/

@Configuration
public class MyConfig {

    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/static/**").addResourceLocations("classpath:/staticaliasa/", "classpath:/staticaliasb/")
                        .setCacheControl(CacheControl.maxAge(Duration.ofSeconds(1180)));
            }
        };
    }
}
```

## 2.4 路径匹配

>  Spring5.3之后加入了更多的<span style="color:red;">`PathPatternParser`</span>的实现策略；
>
> 以前只支持<span style="color:red;">`AntPathMatcher`</span>策略，现在提供了<span style="color:red;">`PathPatternParser`</span>策略。并且可以让我们指定到底使用哪种策略。

### 2.4.1 Ant风格路径用法

Ant风格的路径模式语法具有以下规则：

- `*`：表示任意数量的字符。
- `?`：表示任意一个字符。
- `**`：表示任意数量的目录。
- `{}`：表示一个命名的模式占位符。
- `[]`：表示字符集合，例如<span style="color:red;">`[a-z]`</span>表示小写字母。

例如：

- `*.html`：匹配任意名称，扩展名为<span style="color:red;">`html`</span>的文件。
- `/folder1/*/*.java`：匹配在<span style="color:red;">`folder1`</span>目录下的任意两级目录下的<span style="color:red;">`java`</span>文件。
- `/folder2/**/*.jsp`：匹配在<span style="color:red;">`folder2`</span>目录下任意目录深度的<span style="color:red;">`.jsp`</span>文件。
- `/{type}/{id}.html`：匹配任意文件名为<span style="color:red;">`{id}.html`</span>，在任意命名的<span style="color:red;">`{type}`</span>目录下的文件。

注意：Ant风格路径模式语法中的特色字符需要转义，如：

- 要匹配文件路径中的星号，则需要转义为<span style="color:red;">`\\*`</span>。
- 要匹配文件路径中的问号，则需要转义为<span style="color:red;">`\\?`</span>。

### 2.4.2 模式切换

> AntPathMatcher 与 PathPatternParser
>
> - <span style="color:red;">`PathPatternParser`</span> 在jmh基准测试下，有6-8倍吞吐量提升，降低30%-40%空间分配率。
> - <span style="color:red;">`PathPatternParser`</span> 兼容<span style="color:red;">`AntPathMatcher`</span>语法，并支持更多类型的路径模式
> - <span style="color:red;">`PathPatternParser`</span> `**`多段匹配的支持**仅允许在模式末尾使用**

```java
@Slf4j
@RestController
public class HelloController {

    /**
     * 默认使用新版 PathPatternParser 进行路径匹配
     * 不能匹配 ** 在中间的情况，剩下的和 AntPathMatcher 语法兼容
     *
     * @param request
     * @param p1
     * @return
     */
    @GetMapping("/a*/b?/{p1:[a-f]+}/**")
    public String hello(HttpServletRequest request, @PathVariable("p1") String p1) {
        /*
         * http://localhost:9000/alibaba/ba/abcf/a/b/c
         * 路径变量p1:abcf
         */
        log.info("路径变量p1:{}", p1);
        String uri = request.getRequestURI();
        return uri;
    }
}
```

总结：

- 使用默认的路径匹配规则，是由<span style="color:red;">`PathPatternParser`</span>提供的
- 如果路径中间需要有 `**`，替换成<span style="color:red;">`AntPathMatcher`</span>风格路径

```properties
# 改变路径匹配策略 ant_path_matcher-老版策略，path_pattern_parser-新版策略
spring.mvc.pathmatch.matching-strategy=path_pattern_parser
```

## 2.5 内容协商

> 一套系统适配多端数据返回

![image.png](images/1681217799861-dde49224-a767-489b-80b7-7d8d503e33cf.png)

### 2.5.1 多端内容适配

**1 默认规则**

1. SpringBoot多端内容适配
   1. <span style="color:#9400D3;font-weight:bold;">基于</span><span style="color:red;font-weight:bold;">请求头</span><span style="color:#9400D3;font-weight:bold;">内容协商：（默认开启）</span>
      1. 客户端向服务端发送请求，鞋带HTTP标准的**Accept请求头**。
         1. **Accept：** `application/json`、`text/xml`、`text/yaml`
         2. 服务端根据客户端**请求头期望的数据类型**进行**动态返回**
   2. <span style="color:#9400D3;font-weight:bold;">基于</span><span style="color:red;font-weight:bold;">请求参数</span><span style="color:#9400D3;font-weight:bold;">内容协商：（需要开启）</span>
      1. 发送请求 <span style="color:red;">`GET /projects/spring-boot?format=json`</span>
      2. 匹配到<span style="color:red;">`@GetMapping("/projects/spring-boot")`</span>
      3. 根据**参数协商**，优先返回json类型数据【**需要开启参数匹配设置**】
      4. 发送请求<span style="color:red;">`GET /projects/spring-boot?format=xml`</span>，优先返回xml类型数据

**2 效果演示**

> 请求同一个接口，可以返回json和xml不同格式数据

1. 引入支持写出xml内容依赖

```xml
        <dependency>
            <groupId>com.fasterxml.jackson.dataformat</groupId>
            <artifactId>jackson-dataformat-xml</artifactId>
        </dependency>
```

2. 标注注解

```java
@JacksonXmlRootElement // 可以写出为xml文档
@Data
public class Person {
    private Long id;
    private String userName;
    private String email;
    private int age;
}
```

3. 开启基于请求参数的内容协商

```properties
# 修改内容协商方式
# 使用参数进行内容协商，默认 false
spring.mvc.contentnegotiation.favor-parameter=true
```

4. 效果

![image-20250211171039661](images/image-20250211171039661.png)

![image-20250211171057920](images/image-20250211171057920.png)

**3 配置协商规则与支持类型**

1. 修改<span style="color:red;font-weight:bold;">内容协商方式</span>

```properties
# 修改内容协商方式
# 使用参数进行内容协商，默认 false
spring.mvc.contentnegotiation.favor-parameter=true
# 自定义参数名，默认为 format
spring.mvc.contentnegotiation.parameter-name=myparam
```

![image-20250211134319260](images/image-20250211134319260.png)

![image-20250211133906708](images/image-20250211133906708.png)

2. 大多数 MediaType 都是开箱即用的。也可以<span style="color:red;font-weight:bold;">自定义内容，如：</span>

```properties
# 自定义内容类型
spring.mvc.contentnegotiation.media-types.yaml=text/yaml
```

### 2.5.2 自定义内容返回

**1 增加yaml返回支持**

导入依赖：

```xml
        <dependency>
            <groupId>com.fasterxml.jackson.dataformat</groupId>
            <artifactId>jackson-dataformat-yaml</artifactId>
        </dependency>
```

把对象写出成YAML

```java
    public static void main(String[] args) throws JsonProcessingException {
        Person person = new Person();
        person.setId(1L);
        person.setUserName("张三");
        person.setEmail("aaa@qq.com");
        person.setAge(18);

        YAMLFactory factory = new YAMLFactory().disable(YAMLGenerator.Feature.WRITE_DOC_START_MARKER);
        ObjectMapper mapper = new ObjectMapper(factory);

        String s = mapper.writeValueAsString(person);
        System.out.println(s);
    }
```

编写配置

```properties
# 自定义内容类型
spring.mvc.contentnegotiation.media-types.yaml=text/yaml
```

增加`HttpMessageConverter`组件，专门负责把对象写出为yaml格式

```java
    @Bean
    public WebMvcConfigurer webMvcConfigurer(){
        return new WebMvcConfigurer() {
            @Override //配置一个能把对象转为yaml的messageConverter
            public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
                converters.add(new MyYamlHttpMessageConverter());
            }
        };
    }
```

**2 思考：如何增加其他**

- 配置媒体类型支持：
  - `spring.mvnc.contentnegotiation.media-types.yaml=text/yaml`
- 编写对应的 `HttpMessageConverter`，要告诉Boot这个支持的媒体类型
  - 按照3的示例
- 把 `MessageConverter` 组件加入到底层
  - 容器中放一个 `WebMvcConfigurer` 组件，并配置底层的 `MessageConverter`

**3 HttpMessageConverter的示例写法**

```java
public class MyYamlHttpMessageConverter extends AbstractHttpMessageConverter<Object> {

    private ObjectMapper objectMapper = null; //把对象转成yaml

    public MyYamlHttpMessageConverter() {
        //告诉SpringBoot这个MessageConverter支持哪种媒体类型  //媒体类型
        super(new MediaType("text", "yaml", StandardCharsets.UTF_8));
        YAMLFactory factory = new YAMLFactory()
                .disable(YAMLGenerator.Feature.WRITE_DOC_START_MARKER);
        this.objectMapper = new ObjectMapper(factory);
    }

    @Override
    protected boolean supports(Class<?> clazz) {
        //只要是对象类型，不是基本类型
        return true;
    }

    @Override  //@RequestBody
    protected Object readInternal(Class<?> clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException {
        return null;
    }

    @Override //@ResponseBody 把对象怎么写出去
    protected void writeInternal(Object methodReturnValue, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {

        //try-with写法，自动关流
        try (OutputStream os = outputMessage.getBody()) {
            this.objectMapper.writeValue(os, methodReturnValue);
        }

    }
}
```

### 2.5.3 内容协商原理-`HttpMessageConverter`

> - `HttpMessageConverter` 怎么工作？何时工作？
> - 定制 `HttpMessageConverter` 来实现多端内容协商
> - 编写 `WebMvcConfigurer` 提供的 `configureMessageConverters` 底层，修改底层的 `MessageConverter`

**1 `@ResponseBody` 由 `HttpMessageConverter处理`** 

> 标注了 `@ResponseBody` 的返回值，将会由支持它的 `HttpMessageConverter` 协给浏览器

1. 如果 controller 方法的返回值标注了 `@ResponseBody` 注解
   1. 请求进来先到 `DispatcherServlet` 的 `doDispatch()` 进行处理
   2. 找到一个 `HandlerAdapter` 适配器。利用适配器执行目标方法
   3. `RequestMappingHandlerAdapter` 来执行，调用 `invokeHandlerMethod()` 来执行目标方法
   4. 目标方法执行之前，准备好两个东西
      1. `HandlerMethodArgumentResolver`： 参数解析器，确定目标方法每个参数值
      2. `HandlerMethodReturnValueHandler` ： 返回值处理器，确定目标方法的返回值该怎么处理
   5. `RequestMappingHandlerAdapter` 里面的 `invokeAndHandle()` 真正执行目标方法
   6. 目标方法执行完成，会返回**返回值对象**
   7. **找到一个合适的返回值处理器** `HandlerMethodReturnValueHandler`
   8. 最终找到 `RequestResponseBodyMethodProcesser` 能处理标注了 `@ResponseBody` 注解的方法。
   9. `RequestResponseBodyMethodProcessor` 调用 `writeWithMessageConverters`，利用 `MessageConverter` 把返回值写出去

> 上面解释：`@ResponseBody` 由 `HttpMessageConverter` 处理

2. `HttpMessageConverter` 会**先进行内容协商**

   1. 遍历所有的 `MessageConverter` 看谁支持这种**内容类型的数据**

   2. 默认 `MessageConverter` 有以下

      <img src="./images/image-20250212131518757.png" alt="image-20250212131518757" style="zoom:50%;" />

   3. 最终因为要 `json` 所以 `MappingJackson2HttpMessageConverter` 支持写出json
   4. jackson 用 `ObjectMapper` 把对象写出去

**2 `WebMvcAutoConfiguration` 提供几种默认 `HttpMessageConverters`**

- `EnableWebMvcConfiguration` 通过 `addDefaultHttpMessageConverters` 添加了默认的 `MessageConverter`；如下：
  - `ByteArrayHttpMessageConverter`：支持字节数据读写
  - `StringHttpMessageConverter`：支持字符串读写
  - `ResourceHttpMessageConverter`：支持资源读写
  - `ResourceRegionHttpMessageConverter`：支持分区资源写出
  - `AllEncompassingFormHttpMessageConverter`：支持表单 `xml/json` 读写
  - `MappingJackson2HttpMessageConverter`：支持请求响应体json读写

默认8个：

<img src="./images/image-20250212132759514.png" alt="image-20250212132759514" style="zoom:50%;" />

> 系统提供默认的MessageConverter功能有限，仅用于json或者普通返回数据。额外增加新的内容协商功能，必须增加新的 `HttpMessageConverter`

## 2.6 模板引擎

> - 由于 **SpringBoot** 使用了**嵌入式Servlet容器**。所以**JSP**默认是**不能使用**的。
> - 如果需要**服务端页面渲染**，优先考虑使用 <span style="color:red;">`模板引擎`</span>。

![image.png](images/1681354523290-b89d7e0d-b9aa-40f5-8d22-d3d09d02b136.png)

<span style="color:red;">模板引擎</span>页面默认放在<span style="color:red;">`src/main/resources/templates`</span>

**SpringBoot**包含以下模板引擎的自动配置

- FreeMarker
- Groovy
- **Thymeleaf**
- Mustache

<span style="color:#9400D3;">Themeleaf官网：</span>https://www.thymeleaf.org/

```html
```



### 2.6.1 Thymeleaf整合

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
```

自动配置原理

1. 开启了 <span style="color:red;">`org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration`</span>自动配置
2. 属性绑定在 <span style="color:red;">`ThymeleafProperties`</span> 中，对应配置文件 <span style="color:red;">`spring.thymeleaf`</span> 内容
3. 所有的模板页面默认在 `classpath:/templates/` 文件夹下
4. 默认效果
   1. 所有的模板页面在 `classpath:/templates/` 下面找
   2. 找后缀名为 `.html` 的页面

### 2.6.2 基础语法

**1 核心用法**

<span style="color:#9400D3;font-weight:bold;">`th:xxx`： 动态渲染指定的 html 标签属性值、或者th指令（遍历、判断等）</span>

- `th:text`：标签体内文本值渲染
  - `th:utext`：不会转义，显示为html原本的样子。
- `th:属性`：标签指定属性渲染
- `th:attr`：标签任意属性渲染
- `th:if` `th:each` `...`：其他th指令
- 例如：

```html
<div>
    <p>你好，<span th:text="${name}"></span>！</p>
    <hr>
    th:text替换标签体的内容 <br>
    th:utext替换标签体的内容；不会转义 html 标签，真正显示未 html 该有的样子 <br>
    <h1 th:text="${msg}">哈哈，替换我？</h1>
    <h1 th:utext="${msg}">哈哈，替换我？</h1>
    <hr>
    转大写 <br>
    <h1 th:text="${#strings.toUpperCase(name)}"></h1>
    <h1 th:text="${'前缀:'+name+'后缀'}"></h1>
    <h1 th:text="|前缀:${name}后缀|"></h1>
    <hr>
    th:任意 html 属性；动态替换任意属性的值
    <img th:src="@{${imgUrl}}" style="width: 300px;" alt=""><br>
    th:attr: 任意属性指定
    <img src="1.png" style="width: 300px;" th:attr="src=@{${imgUrl}},style=${style}" alt=""><br>
    th:其他指令
    <img th:src="${imgUrl}" th:style="${style}" th:if="${show}" alt="">
</div>
```

<span style="color:#9400D3;font-weight:bold;">`表达式`：用来动态取值</span>

- **`${}`：变量取值；使用model共享给页面的值都直接用${}**
- **`@{}`：url路径；**
- `#{}`：国际化消息
- `~{}`：片段引用
- `*{}`：变量选择：需要配合 th:object 绑定对象

<span style="color:#9400D3;font-weight:bold;">`系统工具&内置对象`：</span>[详细文档](https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html#base-objects)

- `param`：请求参数对象
- `session`：session对象
- `application`：application对象
- `#execInfo`：模板执行信息
- `#messages`：国际化消息
- `#uris`：uri/url工具
- `#conversions`：类型转换工具
- `#dates`：日期工具，是 `java.util.Date` 对象的工具类
- `#calendars`：类似#dates，只不过是 `java.util.Calendar` 对象的工具类
- `#temporals`：JDK8+ `java.time` API工具类

- `#numbers`：数字操作工具
- `#strings`：字符串操作
- `#objects`：对象操作
- `#bools`：bool操作
- `#arrays`：array工具
- `#lists`：list工具
- `#sets`：set工具
- `#maps`：map工具
- `#aggregates`：集合聚合工具（sum、avg）
- `#ids`：id生成工具

**2 语法示例**

<span style="color:#9400D3;font-weight:bold;">表达式：</span>

- 变量取值：<span style="color:red;">`${…}`</span>
- url取值：<span style="color:red;">`@{…}`</span>
- 国际化消息：<span style="color:red;">`#{…}`</span>
- 变量选择：<span style="color:red;">`*{…}`</span>
- 片段引用：<span style="color:red;">`~{…}`</span>

<span style="color:#9400D3;font-weight:bold;">常见：</span>

- 文本：<span style="color:red;">`one text`</span>，<span style="color:red;">`another one!`</span>，…
- 数字：<span style="color:red;">`0`</span>，<span style="color:red;">`34`</span>，<span style="color:red;">`3.0`</span>，<span style="color:red;">`12.3`</span>，…
- 布尔：<span style="color:red;">`true`</span>、<span style="color:red;">`false`</span>
- null：<span style="color:red;">`null`</span>
- 变量名：<span style="color:red;">`one`</span>,<span style="color:red;">`sometext`</span>,<span style="color:red;">`main`</span>…

<span style="color:#9400D3;font-weight:bold;">文本操作：</span>

- 拼串：<span style="color:red;">`+`</span>
- 文本替换：<span style="color:red;">`|The name is ${name}|`</span>

<span style="color:#9400D3;font-weight:bold;">布尔操作：</span>

- 二进制运算：<span style="color:red;">`and`</span>，<span style="color:red;">`or`</span>
- 取反：<span style="color:red;">`!`</span>，<span style="color:red;">`not`</span>

<span style="color:#9400D3;font-weight:bold;">比较运算：</span>

- 比较：<span style="color:red;">`>`</span>，<span style="color:red;">`<`</span>，<span style="color:red;">`<=`</span>，<span style="color:red;">`>=`</span>，（<span style="color:red;">`gt`</span>，<span style="color:red;">`lt`</span>，<span style="color:red;">`ge`</span>，<span style="color:red;">`le`</span>）
- 等值运算：<span style="color:red;">`==`</span>，<span style="color:red;">!`=`</span>，（<span style="color:red;">`eq`</span>，<span style="color:red;">`ne`</span>）

<span style="color:#9400D3;font-weight:bold;">条件运算：</span>

- if-then：<span style="color:red;">`(if)?(then)`</span>
- if-then-else：<span style="color:red;">`(if)?(then):(else)`</span>
- default：<span style="color:red;">`(value)?:(defaultValue)`</span>

<span style="color:#9400D3;font-weight:bold;">特殊语法：</span>

- 无操作：<span style="color:red;">`_`</span>

<span style="color:#9400D3;font-weight:bold;">所有以上都可以嵌套组合：</span>

```
'User is of type ' + (${user.isAdmin()} ? 'Administrator' : (${user.type} ?: 'Unknown'))
```

### 2.6.3 属性设置

1. <span style="color:red;">`th:href="@{/product/list}"`</span>
2. <span style="color:red;">`th:attr="class=${active}"`</span>
3. <span style="color:red;">`th:attr="src=@{/images/gtvglogo.png},title=${logo},alt=#{logo}"`</span>
4. <span style="color:red;">`th:checked="${user.active}"`</span>

```html
<p th:text="${content}">原内容</p>
<a th:href="${url}">登录</a>
<img src="../../images/gtvglogo.png" 
     th:attr="src=@{/images/gtvglogo.png},title=#{logo},alt=#{logo}" />
```

### 2.6.4 遍历

> 语法：`th:each="元素名, 迭代状态 : ${集合}"`

```html
<table class="table">
    <thead>
    <tr>
        <th scope="col">#</th>
        <th scope="col">名字</th>
        <th scope="col">邮箱</th>
        <th scope="col">年龄</th>
        <th scope="col">角色</th>
        <th scope="col">状态</th>
    </tr>
    </thead>
    <tbody>
    <tr th:each="person, stats : ${persons}">
        <th scope="row" th:text="${person.id}"></th>
        <td th:text="${person.userName}"></td>
        <td>[(${person.email})]</td>
        <td>[[${person.age}]]</td>
        <td th:text="${person.role}"></td>
        <td>
            index: [[${stats.index}]] <br>
            count: [[${stats.count}]] <br>
            size: [[${stats.size}]] <br>
            current: [[${stats.current}]] <br>
            even(true)/odd(false): 是偶数吗？[[${stats.even}]] <br>
            first: [[${stats.first}]] <br>
            last: [[${stats.last}]] <br>
        </td>
    </tr>
    </tbody>
</table>
```

iterStat有以下属性：

- index：当前遍历元素的索引，从0开始
- count：当前遍历元素的索引，从1开始
- size：需要遍历元素的总数量
- current：当前正在遍历的元素对象
- even/odd：是否偶数/奇数行
- first：是否第一个元素
- last：是否最后一个元素

### 2.6.5 判断

**`th:if`**

```html
<td th:if="${#strings.isEmpty(person.email)}" th:text="'无法联系！'"></td>
<td th:if="${not #strings.isEmpty(person.email)}">[(${person.email})]</td>
```

**`th:switch`**

```html
<td th:switch="${person.role}">
<button th:case="'admin'" type="button" class="btn btn-danger" th:text="|${person.role}/管理员|"></button>
<button th:case="'pm'" type="button" class="btn btn-primary" th:text="|${person.role}/项目经理|"></button>
<button th:case="'hr'" type="button" class="btn btn-info" th:text="|${person.role}/人事|"></button>
<!--默认选项-->
<button th:case="*" type="button" class="btn btn-dark" th:text="|${person.role}/未知岗位|"></button>
</td>
```



### 2.6.6 属性优先级

- 片段
- 遍历
- 判断

```html
<td th:if="${#strings.isEmpty(person.email)}" th:text="'无法联系！'"></td>

<tr th:each="person, stats : ${persons}" th:if="${person.age > 10}">
```

| Order | Feature          | Attributes                                                   |
| ----- | ---------------- | ------------------------------------------------------------ |
| 1     | 片段包含         | <span style="color:red;">`th:insert`</span> <span style="color:red;">`th:replace`</span> |
| 2     | 遍历             | <span style="color:red;">`th:each`</span>                    |
| 3     | 判断             | <span style="color:red;">`th:if`</span>  <span style="color:red;">`th:unless`</span> <span style="color:red;">`th:switch`</span> <span style="color:red;">`th:case`</span><span style="color:red;">`th:case`</span> |
| 4     | 定义本地变量     | <span style="color:red;">`th:object`</span> <span style="color:red;">`th:with`</span> |
| 5     | 通用方式属性修改 | <span style="color:red;">`th:attr`</span> <span style="color:red;">`th:attrprepend`</span> <span style="color:red;">`th:attrappend`</span> |
| 6     | 指定属性修改     | <span style="color:red;">`th:value`</span> <span style="color:red;">`th:href`</span> <span style="color:red;">`th:src`</span> <span style="color:red;">`...`</span> |
| 7     | 文本值           | <span style="color:red;">`th:text`</span> <span style="color:red;">`th:utext`</span> |
| 8     | 片段指定         | <span style="color:red;">`th:fragment`</span>                |
| 9     | 片段移除         | <span style="color:red;">`th:remove`</span>                  |

### 2.6.7 行内写法

<span style="color:red;">`[[...]]`</span> or <span style="color:red;">`[(…)]`</span>

```html
        <td th:if="${not #strings.isEmpty(person.email)}">[(${person.email})]</td>
        <td>[[${person.age}]]</td>
```

### 2.6.8 变量选择

```html
    <tr th:each="person, stats : ${persons}" th:if="${person.age > 10}" th:object="${person}">
        <td th:text="*{userName}"></td>
      	......
```

等同于

```html
    <tr th:each="person, stats : ${persons}" th:if="${person.age > 10}">
        <td th:text="${person.userName}"></td>
      	......
```



### 2.6.9 模板布局

- 定义模板：`th:fragment`
- 引用模板：`~{templatename::selector}`
- 插入模板：`th:insert`、`th:replace`

**common.html**

```html
<!--抽取的判断，名字叫 myheader-->
<header th:fragment="myheader"></header>
```

**index.html**

```html
<!--导航 使用公共部分进行替换-->
<!--引用方式： ~{ 模板名 :: 片段名 }-->
<div th:replace="~{common :: myheader}"></div>
```

### 2.6.10 devtools

```xml
				<!--热启动功能-->
				<dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <optional>true</optional><!--表示依赖不会传递-->
        </dependency>
```

修改页面后，`⌘+F9`刷新效果；

java代码的修改，如果 `devtools` 热启动了，可能会引起一些bug，难以排查。

## 2.7 国际化

国际化的自动配置参照 `MessageSourceAutoConfiguration`

**实现步骤：**

1. SpringBoot 在类路径根下查找 <span style="color:red;">`messages`</span> 资源绑定文件。文件名为： <span style="color:red;">`messages.properties`</span>
2. 多语言可以定义多个消息文件，命名为 `messages_区域代码.properties`。如：
   1. `messages.properties`：默认
   2. `messages_zh_CN.properties`：中文环境
   3. `messages_en_US.properties`：英语环境
3. 在**程序中**可以自动注入 `MessageSource` 组件，获取国际化的配置项值
4. 在**页面中**可以使用表达式 `#{}` 获取国际化的配置项值

```java
    // 国际化取消息用的组件
    @Autowired
    private MessageSource messageSource;

    @GetMapping("/i18n")
    public String haha(HttpServletRequest request) {
        Locale locale = request.getLocale();
        // 利用代码的方式获取国际化配置文件中指定的配置项的值
        String login = messageSource.getMessage("login", null, locale);
        return login;
    }
```

## 2.8 错误处理

### 2.8.1 默认机制

> 错误处理的自动配置都在 `ErrorMvcAutoConfiguration` 中，量大核心机制：
>
> 1. SpringBoot 会<span style="color:#9400D3;font-weight:bold;">自适应</span>**处理错误**，<span style="color:#9400D3;font-weight:bold;">响应页面</span>或<span style="color:#9400D3;font-weight:bold;">JSON数据</span>
>
> 2. <span style="color:#9400D3;font-weight:bold;">SpringMVC的错误处理机制</span>依然保留，<span style="color:#9400D3;font-weight:bold;">MVC处理不了</span>，才会<span style="color:#9400D3;font-weight:bold;">交给boot进行处理</span>

![img](images/1681723795095-828d2034-1e6c-4d98-8e47-573dd6b5463b.svg)

- 发生错误以后，转发给 /error 路径，SpringBoot 在底层写好一个 BasicErrorController 的组件，专门处理这个请求

```java
	@RequestMapping(produces = MediaType.TEXT_HTML_VALUE) // 返回HTML
	public ModelAndView errorHtml(HttpServletRequest request, HttpServletResponse response) {
		HttpStatus status = getStatus(request);
		Map<String, Object> model = Collections
			.unmodifiableMap(getErrorAttributes(request, getErrorAttributeOptions(request, MediaType.TEXT_HTML)));
		response.setStatus(status.value());
		ModelAndView modelAndView = resolveErrorView(request, response, status, model);
		return (modelAndView != null) ? modelAndView : new ModelAndView("error", model);
	}

	@RequestMapping // 返回 ResponseEntity，JSON
	public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {
		HttpStatus status = getStatus(request);
		if (status == HttpStatus.NO_CONTENT) {
			return new ResponseEntity<>(status);
		}
		Map<String, Object> body = getErrorAttributes(request, getErrorAttributeOptions(request, MediaType.ALL));
		return new ResponseEntity<>(body, status);
	}
```

- 错误页面是这么解析到的

```java
// 1、解析错误的自定义视图地址
		ModelAndView modelAndView = resolveErrorView(request, response, status, model);
// 2、如果解析不到错误页面的地址，默认的错误页就是 error
		return (modelAndView != null) ? modelAndView : new ModelAndView("error", model);
```

resolveErrorView 中显示会使用到 errorViewResolvers

```java
	protected ModelAndView resolveErrorView(HttpServletRequest request, HttpServletResponse response, HttpStatus status,
			Map<String, Object> model) {
		for (ErrorViewResolver resolver : this.errorViewResolvers) {
			ModelAndView modelAndView = resolver.resolveErrorView(request, status, model);
			if (modelAndView != null) {
				return modelAndView;
			}
		}
		return null;
	}
```

容器中专门有一个错误视图解析器（在 ErrorMvcAutoConfiguration 类中）

```java
		@Bean
		@ConditionalOnBean(DispatcherServlet.class)
		@ConditionalOnMissingBean(ErrorViewResolver.class)
		DefaultErrorViewResolver conventionErrorViewResolver() {
			return new DefaultErrorViewResolver(this.applicationContext, this.resources);
		}
```

SpringBoot 解析自定义错误页的默认规则（在 DefaultErrorViewResolver 类中）

```java
	@Override
	public ModelAndView resolveErrorView(HttpServletRequest request, HttpStatus status, Map<String, Object> model) {
		ModelAndView modelAndView = resolve(String.valueOf(status.value()), model);
		if (modelAndView == null && SERIES_VIEWS.containsKey(status.series())) {
			modelAndView = resolve(SERIES_VIEWS.get(status.series()), model);
		}
		return modelAndView;
	}

	private ModelAndView resolve(String viewName, Map<String, Object> model) {
		String errorViewName = "error/" + viewName;
		TemplateAvailabilityProvider provider = this.templateAvailabilityProviders.getProvider(errorViewName,
				this.applicationContext);
		if (provider != null) {
			return new ModelAndView(errorViewName, model);
		}
		return resolveResource(errorViewName, model);
	}

	private ModelAndView resolveResource(String viewName, Map<String, Object> model) {
		for (String location : this.resources.getStaticLocations()) {
			try {
				Resource resource = this.applicationContext.getResource(location);
				resource = resource.createRelative(viewName + ".html");
				if (resource.exists()) {
					return new ModelAndView(new HtmlResourceView(resource), model);
				}
			}
			catch (Exception ex) {
				// Ignore
			}
		}
		return null;
	}
```

容器中有一个默认的名为 error 的 view；提供了默认白页功能（在 ErrorMvcAutoConfiguration 类中）

```java
		@Bean(name = "error")
		@ConditionalOnMissingBean(name = "error")
		public View defaultErrorView() {
			return this.defaultErrorView;
		}
```

封装了JSON格式的错误信息

```java
	@Bean
	@ConditionalOnMissingBean(value = ErrorAttributes.class, search = SearchStrategy.CURRENT)
	public DefaultErrorAttributes errorAttributes() {
		return new DefaultErrorAttributes();
	}
```

规则：

1. **解析一个错误页**
   1. 如果发生了 `500`、`404`、`503`、`403` 这些错误
      1. 如果有**模板引擎**，默认在 `classpath:/templates/error/`**精确码.html**
      2. 如果**没有模板引擎**，在静态资源文件夹下找**精确码.html**
   2. 如果匹配不到**精确码.html**这些精确的错误页，就去找 `5xx.html`，`4xx.html` **模糊匹配**
      1. 如果有**模板引擎**，默认在 `classpath:/templates/error/`**5xx.html**
      2. 如果**没有模板引擎**，在静态资源文件夹下找**5xx.html**
2. 如果模板引擎路径 `templates` 下有 `error.html` 页面，就直接渲染

### 2.8.2 自定义错误响应

**1 自定义json响应**

> 使用 @ControllerAdvice + @ExceptionHandler 进行统一异常处理

**2 自定义页面响应**

> 根据 boot 的错误页面规则，自定义页面模板

### 2.8.3 最佳实践

- **前后分离**
  - 后台发生的所有错误，`@ControllerAdvice` + `@ExceptionHandler` 进行统一异常处理。
- **服务端页面渲染**
  - **不可预知的一些，HTTP码表示的服务器或客户端错误**
    - 给 `classpath:/templates/error/` 下面，放常用精确的错误码页面。`500.html`，`404.html`
    - 给 `classpath:/templates/error/` 下面，放通用模糊匹配的错误码页面。`5xx.html`，`4xx.html`
  - **发生业务错误**
    - **核心业务**，每一种错误，都应该代码控制，**跳转到自己定制的错误页**。
    - **通用业务**，`classpath:/templates/error.html` 页面，**显示错误信息**。

页面，JSON，可用的Model数据如下：

![image-20250216142523607](images/image-20250216142523607.png)

## 2.9 嵌入式容器

> **Servlet容器** 默认嵌入 Tomcat 作为Servlet容器。

### 2.9.1 自动配置原理

> - SpringBoot 默认嵌入 Tomcat 作为Servlet容器。
> - **自动配置类**是 `ServletWebServerFactoryAutoConfiguration`，`EmbeddedWebServerFactoryCustomizerAutoConfiguration`
> - 自动配置类开始分析功能。`xxxxAutoConfiguration`

```java
@AutoConfiguration(after = SslAutoConfiguration.class)
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
@ConditionalOnClass(ServletRequest.class)
@ConditionalOnWebApplication(type = Type.SERVLET)
@EnableConfigurationProperties(ServerProperties.class)
@Import({ ServletWebServerFactoryAutoConfiguration.BeanPostProcessorsRegistrar.class,
		ServletWebServerFactoryConfiguration.EmbeddedTomcat.class,
		ServletWebServerFactoryConfiguration.EmbeddedJetty.class,
		ServletWebServerFactoryConfiguration.EmbeddedUndertow.class })
public class ServletWebServerFactoryAutoConfiguration {
```

1. `ServletWebServerFactoryAutoConfiguration`自动配置了嵌入式容器场景
2. 绑定了 `ServerProperties` 配置类，所有和服务器有关的配置 `server`

3. `ServletWebServerFactoryAutoConfiguration`导入了嵌入式的三大服务器 `Tomcat`、`Jetty`、`Undertow`
   1. 导入 `Tomcat`、`Jetty`、`Undertow`都有条件注解。系统中有这个类才行（也就是到了包）
   2. 默认 `Tomcat` 配置生效。给容器中放 `TomcatServletWebServerFactory`
   3. 都给容器中 `ServletWebServerFactory`放了一个**Web服务器工厂（造Web服务器的）**
   4. **Web服务器工厂都有一个功能**，`getWebServer`获取Web服务器
   5. `TomcatServletWebServerFacroty`创建了tomcat

4. `ServletWebServerFactory`什么时候回创建`webServer`出来？

5. `ServletWebServerApplicationContext` ioc容器，启动的时候回调用创建web服务器

6. Spring**容器刷新（启动）**的时候，会预留一个时机，刷新子容器。 `onRefresh()`

   > org.springframework.context.support.AbstractApplicationContext#refresh
   >
   > ==>onRefresh()
   >
   > ==>org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext#onRefresh
   >
   > ==>org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory#getWebServer

7. `refresh()`容器刷新**十二大步**的刷新子容器会调用 `onRefresh()`

*org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext#onRefresh*

```java
	@Override
	protected void onRefresh() {
		super.onRefresh();
		try {
			createWebServer();
		}
		catch (Throwable ex) {
			throw new ApplicationContextException("Unable to start web server", ex);
		}
	}
```

> Web场景的Spring容器启动，在 onRefresh 的时候，会调用创建Web服务器的方法。
>
> Web服务器的创建是通过WebServerFactory搞定的。容器中又会根据导了什么包条件注解，启动相关的服务器配置，默认 `EmbeddedTomcat` 会给容器中放一个 `TomcatServletWebServerFactory`，导致项目启动，自动创建出Tomcat。

### 2.9.2 自定义

![img](images/1681725850466-2ecf12f4-8b66-469f-9d5d-377a33923b3c.png)

> 切换服务器；

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <exclusions>
                <!--Exclude the Tomcat dependency-->
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-tomcat</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <!--Use Jetty Instead-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jetty</artifactId>
        </dependency>
```

### 2.9.3 最佳实践

**用法：**

- 修改 `server` 下的相关配置就可以修改**服务器参数**
- 通过给容器中放一个 **`ServletWebServerFactory`**，来禁用掉 SpringBoot 默认放的服务器工厂，实现自定义嵌入**任意服务器**。

## 2.10 全面接管SpringMVC

> - SpringBoot 默认配置好了 SpringMVC 的所有常用特性。
> - 如果我们需要全面接管 SpringMVC 的所有配置并**禁用默认配置**，仅需要编写一个 `WebMvcConfigurer`配置类，并标注 `@EnableWebMvc` 即可。
> - 全手动模式
>   - `@EnableWebMvc`：禁用默认配置
>   - **`WebMvcConfigurer`**组件：定义MVC的底层行为

### 2.10.1 WebMvcAutoConfiguration到底自动配置了哪些规则

> SpringMVC自动配置场景给我们配置了如下所有**默认行为**

1. `WebMvcAutoConfiguration` web场景的自动配置类
   1. 支持 RESTful 的 filter：`HiddenHttpMethodFilter`
   2. 支持非 POST 请求，请求体携带数据：`FormContentFilter`
   3. 导入 **`EnableWebMvcConfiguration`**：
      1. `RequestMappingHandlerAdapter`
      2. `WelcomePageHandlerMapping` **欢迎页功能**支持（模板引擎目录、静态资源目录放 index.html），项目访问 `/` 就默认展示这个页面
      3. `RequestMappingHandlerMapping`：找每个请求由谁处理的映射关系
      4. `ExceptionHandlerExceptionResolver`：默认的异常解析器
      5. `LocalResolver`：国际化解析器
      6. `ThemeResolver`：主题解析器
      7. `FlashMapManager`：临时数据共享
      8. `FormattingConversionService`：数据格式化、类型转化
      9. `Validator`：数据校验 `JSR303` 提供的数据校验功能
      10. `WebBindingInitializer`：请求参数的封装与绑定
      11. `ContentNegotiationManager`：内容协商管理器
   4. **`WebMvcAutoConfigurationAdapter`**配置生效，它是一个 `WebMvcConfigurer`，定义mvc底层组件
      1. 定义好 `WebMvcConfigurer` **底层组件默认功能；所有功能详见列表**
      2. 视图解析器：`InternalResourceViewResolver`
      3. 视图解析器：`BeanNameViewResolver`，**视图名（controller方法的返回值字符串）**就是组件名
      4. 内容协商解析器：`ContentNegotiatingViewResolver`
      5. 请求上下文过滤器：`RequestContextFilter`：任意位置直接获取当前请求
      6. 静态资源链规则
      7. `ProblemDetailsExceptionHandler`：错误详情
         1. SpringMVC内部场景异常被它捕获：
   5. 定义了MVC默认的底层行为：`WebMvcConfigurer`

### 2.10.2 @EnableWebMvc禁用默认行为

1. `@EnableWebMvc`给容器中导入 `DelegatingWebMvcConfiguration`组件，他是 `WebMvcConfigurationSupport`
2. `WebMvcAutoConfiguration`有一个核心的条件注解，`@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)`，容器中没有 `WebMvcConfigurationSupport`，`WebMvcAutoConfiguration`才生效。
3. `@EnableWebMvc`导入 `WebMvcConfigurationSupport` 导致 `WebMvcAutoConfiguration`失效。导致禁用了默认行为

> - @EnableWebMvc 禁用了Mvc的自动配置
> - WebMvcConfigurer定义SpringMVC底层组件的功能类

### 2.10.3 WebMvcConfigurer功能

> 定义扩展SpringMVC底层功能

| 提供方法                                                     | 核心参数                                                     | 功能                                                         | 默认                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| addFormatters                                                | FormatterRegistry                                            | **格式化器：**支持属性上 <span style="color:red;">`@NumberFormat`</span>和 <span style="color:red;">`@DatetimeFormat`</span>的数据类型转换 | GenericConversionService                                     |
| getValidator                                                 | 无                                                           | **数据校验：**校验Controller上使用<span style="color:red;">`@Valid`</span>标注的参数合法性。需要导入<span style="color:red;">`starter-validator`</span> | 无                                                           |
| <span style="color:red;">`addInterceptors`</span>            | InterceptorRegistry                                          | **拦截器：**拦截收到的所有请求                               | 无                                                           |
| <span style="color:red;">`configureContentNegotiation`</span> | ContentNegotiationConfigurer                                 | **内容协商：**支持多种数据格式返回。需要配合支持这种类型的<span style="color:red;">`HttpMessageConverter`</span> | 支持json                                                     |
| <span style="color:red;">`configureMessageConverters`</span> | List<span style="color:red;">`<HttpMessageConverter<?>>`</span> | **消息转换器：**标注<span style="color:red;">`@ResponseBody`</span>的返回值会利用<span style="color:red;">`MessageConverter`</span>直接写出去 | 8个，支持<span style="color:red;">`byte`</span>，<span style="color:red;">`string`</span>，<span style="color:red;">`multipart`</span>，<span style="color:red;">`resource`</span>，<span style="color:red;">`json`</span> |
| addViewControllers                                           | ViewControllerRegistry                                       | **视图映射：**直接将请求路径与物理视图映射。用于无java业务逻辑的直接视图页渲染 | 无<mvc:view-controller>                                      |
| configureViewResolvers                                       | ViewResolverRegistry                                         | **视图解析器：**逻辑视图转为物理视图                         | ViewResolverComposite                                        |
| addResourceHandlers                                          | ResourceHandlerRegistry                                      | **静态资源处理：**静态资源路径映射、缓存控制                 | ResourceHandlerRegistry                                      |
| configureDefaultServletHandling                              | DefaultServletHandlerConfigurer                              | **默认Servlet：**可以覆盖Tomcat的<span style="color:red;">`DefaultServlet`</span>。让<span style="color:red;">`DispatcherServlet`</span>拦截<span style="color:red;">`/`</span> | 无                                                           |
| configurePathMatch                                           | PathMatchConfigurer                                          | **路径匹配：**自定义URL路径匹配。可以自动为所有路径加上指定前缀，比如：<span style="color:red;">`/api`</span> | 无                                                           |
| <span style="color:red;">`configureAsyncSupport`</span>      | AsyncSupportConfigurer                                       | **异步支持：**                                               | <span style="color:red;">`TaskExecutionAutoConfiguration`</span> |
| addCorsMappings                                              | CorsRegistry                                                 | **跨域：**                                                   | 无                                                           |
| addArgumentResolvers                                         | List<span style="color:red;">`<HandlerMethodArgumentResolver>`</span> | **参数解析器：**                                             | mvc默认提供                                                  |
| addReturnValueHandlers                                       | List<span style="color:red;">`<HandlerMethodReturnValueHandler>`</span> | **返回值解析器：**                                           | mvc默认提供                                                  |
| configureHandlerExceptionResolvers                           | List<span style="color:red;">`<HandlerExceptionResolver>`</span> | 异常处理器                                                   | 默认3个；ExceptionHandlerExceptionResolver<br />ResponseStatusExceptionResolver<br />DefaultHandlerExceptionOnResolver |
| getMessageCodesResolver                                      | 无                                                           | **消息码解析器：**国际化使用                                 | 无                                                           |

## 2.11 最佳实践

> SpringBoot已经默认配置好了**Web开发**场景常用功能。我们直接使用即可。

### 2.11.1 三种方式

| 方式                                                       | 用法                                                         | 效果                                                         |
| ---------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 全自动                                                     | 直接编写控制器逻辑                                           | 全部使用**自动默认效果**                                     |
| <span style="color:red;font-weight:bold;">手动+自动</span> | `@Configuration`+配置**`WebMvcConfigurer`**+配置<span style="color:red;">`WebMvcRegistrations`</span>，<br />注意：<span style="color:red;font-weight:bold;">不要标注`@EnableWebMvc`</span> | **保留自动配置效**<br />**手动设置部分功**<br />定义MVC底层组件 |
| 全手动                                                     | `@Configuration`+配置**`WebMvcConfigurer`**<br />注意：<span style="color:red;font-weight:bold;">需要标注`@EnableWebMvc`</span> | 禁用自动配置效果<br />**全手动设置**                         |

总结：

**给容器中写一个配置类`@Configuration`实现`WebMvcConfigurer`但是不要标注`@EnableWebMvc`注解，实现手自一体的效果**

### 2.11.2 两种模式

1. `前后分离模式`：`@RestController`响应JSON数据
2. `前后不分离模式`：`@Controller`+`Thymeleaf`模板引擎

## 2.12 Web新特性

### 2.12.1 Problemdetails

> RFC 7807：https://www.rfc-editor.org/rfc/rfc7807
>
> **错误信息**返回新格式

原理：（在WebMvcAutoConfiguration类中）

```java
	@Configuration(proxyBeanMethods = false)
// 配置过一个属性 spring.mvc.problemdetails.enabled=true
	@ConditionalOnProperty(prefix = "spring.mvc.problemdetails", name = "enabled", havingValue = "true")
	static class ProblemDetailsErrorHandlingConfiguration {

		@Bean
		@ConditionalOnMissingBean(ResponseEntityExceptionHandler.class)
		@Order(0)
		ProblemDetailsExceptionHandler problemDetailsExceptionHandler() {
			return new ProblemDetailsExceptionHandler();
		}

  }
```

1. `ProblemDetailsExceptionHandler`是一个 `@ControllerAdvice` 集中处理系统异常
2. 处理以下异常。如果系统出现以下异常，会被 SpringBoot 支持以 `RFC 7807` 规范方式返回错误数据

```java
	@ExceptionHandler({
			HttpRequestMethodNotSupportedException.class, // 请求方式不支持
			HttpMediaTypeNotSupportedException.class,
			HttpMediaTypeNotAcceptableException.class,
			MissingPathVariableException.class,
			MissingServletRequestParameterException.class,
			MissingServletRequestPartException.class,
			ServletRequestBindingException.class,
			MethodArgumentNotValidException.class,
			HandlerMethodValidationException.class,
			NoHandlerFoundException.class,
			NoResourceFoundException.class,
			AsyncRequestTimeoutException.class,
			ErrorResponseException.class,
			MaxUploadSizeExceededException.class,
			ConversionNotSupportedException.class,
			TypeMismatchException.class,
			HttpMessageNotReadableException.class,
			HttpMessageNotWritableException.class,
			MethodValidationException.class,
			AsyncRequestNotUsableException.class
		})
```

> 效果：

默认响应错误的json。状态码405

```json
{
    "timestamp": "2025-02-18T05:33:52.203+00:00",
    "status": 405,
    "error": "Method Not Allowed",
    "trace": "org.springframework.web.HttpRequestMethodNotSupportedException: Request method 'POST' is not supported\n\tat org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping.handleNoMatch(RequestMappingInfoHandlerMapping.java:267)\n\tat org.springframework.web.servlet.handler.AbstractHandlerMethodMapping.lookupHandlerMethod(AbstractHandlerMethodMapping.java:441)\n\tat org.springframework.web.servlet.handler.AbstractHandlerMethodMapping.getHandlerInternal(AbstractHandlerMethodMapping.java:382)\n\tat org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping.getHandlerInternal(RequestMappingInfoHandlerMapping.java:127)\n\tat org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping.getHandlerInternal(RequestMappingInfoHandlerMapping.java:68)\n\tat org.springframework.web.servlet.handler.AbstractHandlerMapping.getHandler(AbstractHandlerMapping.java:509)\n\tat org.springframework.web.servlet.DispatcherServlet.getHandler(DispatcherServlet.java:1283)\n\tat org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1064)\n\tat org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:978)\n\tat org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1014)\n\tat org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:914)\n\tat jakarta.servlet.http.HttpServlet.service(HttpServlet.java:547)\n\tat org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:885)\n\tat jakarta.servlet.http.HttpServlet.service(HttpServlet.java:614)\n\tat org.eclipse.jetty.ee10.servlet.ServletHolder.handle(ServletHolder.java:736)\n\tat org.eclipse.jetty.ee10.servlet.ServletHandler$ChainEnd.doFilter(ServletHandler.java:1619)\n\tat org.eclipse.jetty.ee10.websocket.servlet.WebSocketUpgradeFilter.doFilter(WebSocketUpgradeFilter.java:195)\n\tat org.eclipse.jetty.ee10.servlet.FilterHolder.doFilter(FilterHolder.java:205)\n\tat org.eclipse.jetty.ee10.servlet.ServletHandler$Chain.doFilter(ServletHandler.java:1591)\n\tat org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\n\tat org.eclipse.jetty.ee10.servlet.FilterHolder.doFilter(FilterHolder.java:205)\n\tat org.eclipse.jetty.ee10.servlet.ServletHandler$Chain.doFilter(ServletHandler.java:1591)\n\tat org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\n\tat org.eclipse.jetty.ee10.servlet.FilterHolder.doFilter(FilterHolder.java:205)\n\tat org.eclipse.jetty.ee10.servlet.ServletHandler$Chain.doFilter(ServletHandler.java:1591)\n\tat org.springframework.web.filter.ServerHttpObservationFilter.doFilterInternal(ServerHttpObservationFilter.java:114)\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\n\tat org.eclipse.jetty.ee10.servlet.FilterHolder.doFilter(FilterHolder.java:205)\n\tat org.eclipse.jetty.ee10.servlet.ServletHandler$Chain.doFilter(ServletHandler.java:1591)\n\tat org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\n\tat org.eclipse.jetty.ee10.servlet.FilterHolder.doFilter(FilterHolder.java:205)\n\tat org.eclipse.jetty.ee10.servlet.ServletHandler$Chain.doFilter(ServletHandler.java:1591)\n\tat org.eclipse.jetty.ee10.servlet.ServletHandler$MappedServlet.handle(ServletHandler.java:1552)\n\tat org.eclipse.jetty.ee10.servlet.ServletChannel.dispatch(ServletChannel.java:819)\n\tat org.eclipse.jetty.ee10.servlet.ServletChannel.handle(ServletChannel.java:436)\n\tat org.eclipse.jetty.ee10.servlet.ServletHandler.handle(ServletHandler.java:469)\n\tat org.eclipse.jetty.security.SecurityHandler.handle(SecurityHandler.java:575)\n\tat org.eclipse.jetty.ee10.servlet.SessionHandler.handle(SessionHandler.java:717)\n\tat org.eclipse.jetty.server.handler.ContextHandler.handle(ContextHandler.java:1060)\n\tat org.eclipse.jetty.server.Handler$Wrapper.handle(Handler.java:740)\n\tat org.eclipse.jetty.server.handler.EventsHandler.handle(EventsHandler.java:81)\n\tat org.eclipse.jetty.server.Server.handle(Server.java:182)\n\tat org.eclipse.jetty.server.internal.HttpChannelState$HandlerInvoker.run(HttpChannelState.java:662)\n\tat org.eclipse.jetty.server.internal.HttpConnection.onFillable(HttpConnection.java:418)\n\tat org.eclipse.jetty.io.AbstractConnection$ReadCallback.succeeded(AbstractConnection.java:322)\n\tat org.eclipse.jetty.io.FillInterest.fillable(FillInterest.java:99)\n\tat org.eclipse.jetty.io.SelectableChannelEndPoint$1.run(SelectableChannelEndPoint.java:53)\n\tat org.eclipse.jetty.util.thread.QueuedThreadPool.runJob(QueuedThreadPool.java:979)\n\tat org.eclipse.jetty.util.thread.QueuedThreadPool$Runner.doRunJob(QueuedThreadPool.java:1209)\n\tat org.eclipse.jetty.util.thread.QueuedThreadPool$Runner.run(QueuedThreadPool.java:1164)\n\tat java.base/java.lang.Thread.run(Thread.java:842)\n",
    "message": "Method 'POST' is not supported.",
    "path": "/list"
}
```

开启ProblemDetails返回，使用新的MediaType

`Content-Type: application/problem+json`+ 额外扩展返回

```json
{
    "type": "about:blank",
    "title": "Method Not Allowed",
    "status": 405,
    "detail": "Method 'POST' is not supported.",
    "instance": "/list"
}
```

### 2.12.2 函数式Web

> `SpringMVC 5.2`以后允许我们使用**函数式**的方式，**定义Web的请求处理流程**。
>
> 函数式接口
>
> Web请求处理的方式：
>
> 1. `@Controller`+`@RequestMapping`：**耦合式**（**路由**、**业务**耦合）
> 2. **函数式Web**：分离式（路由、业务分离）

**1 场景**

> 场景：User RESTful - CRUD

- GET /user/1 获取1号用户
- GET /users 获取所有用户
- POST /user **请求体**鞋带JSON，新增一个用户
- PUT /user/1 **请求体**携带JSON，修改1号用户
- DELETE /user/1 **删除**1号用户

**2 核心类**

- **RouterFunction**
- **RequestPredicate**
- **ServerRequest**
- **ServerResponse**

**3 示例**

- WebFunctionConfig

```java
@Configuration
public class WebFunctionConfig {

    /**
     * 函数式Web：
     * 1、给容器中放一个Bean：类型是 RouterFunction<ServerResponse>
     * 2、每个业务准备一个自己的Handler
     * <p>
     * 核心四大对象
     * 1、RouterFunction：定义路由信息。发什么请求，谁来处理
     * 2、RequestPredicate：定义请求规则，请求谓语。请求方式（GET、POST）、请求参数
     * 3、ServerRequest：请求
     * 4、ServerResponse：响应
     */
    @Bean
    public RouterFunction<ServerResponse> userRoute(UserBizHandler userBizHandler/*这个对象会被自动注入进来*/) {
        return RouterFunctions.route() // 开始定义路由信息
                .GET("/user/{id}", RequestPredicates.accept(MediaType.ALL), userBizHandler::getUser)
                .GET("/users", userBizHandler::getUsers)
                .POST("/user", RequestPredicates.accept(MediaType.APPLICATION_JSON), userBizHandler::saveUser)
                .PUT("/user/{id}", RequestPredicates.accept(MediaType.APPLICATION_JSON), userBizHandler::updateUser)
                .DELETE("/user/{id}", userBizHandler::deleteUser).build();
    }
}

```

- UserBizHandler

```java
/**
 * 专门处理User相关的业务
 */
@Slf4j
@Service
public class UserBizHandler {

    /**
     * 查询单个用户
     *
     * @param request
     * @return
     * @throws Exception
     */
    public ServerResponse getUser(ServerRequest request) throws Exception {
        String id = request.pathVariable("id");
        log.info("获取id={}的用户信息", id);
        // 业务处理
        Person person = new Person(1L, "哈哈", "aa@qq.com", 18, "admin");
        // 构造响应
        return ServerResponse.ok().body(person);
    }

    /**
     * 获取所有用户
     *
     * @param request
     * @return
     * @throws Exception
     */
    public ServerResponse getUsers(ServerRequest request) throws Exception {
        // 业务处理
        List<Person> list = Arrays.asList(new Person(1L, "张三", "", 15, "pm"),
                new Person(2L, "李四", "ls@qq.com", 16, "pm"),
                new Person(3L, "王五", "ww@qq.com", 17, "manager"),
                new Person(4L, "赵六", "zl@qq.com", 18, "admin"),
                new Person(5L, "田七", "tq@qq.com", 19, "hr"));
        // 构造响应
        return ServerResponse.ok().body(list); // 凡是body中的对象，就是以前 @ResponseBody 原理。利用 HttpMessageConverter 写出为 json/xml/yaml 等
    }

    /**
     * 保存用户
     *
     * @param request
     * @return
     * @throws Exception
     */
    public ServerResponse saveUser(ServerRequest request) throws Exception {
        // 提取请求体
        Person person = request.body(Person.class);
        log.info("保存用户信息完成，person={}", person);
        return ServerResponse.ok().build();
    }

    /**
     * 更新用户
     *
     * @param request
     * @return
     * @throws Exception
     */
    public ServerResponse updateUser(ServerRequest request) throws Exception {
        log.info("更新用户信息完成");
        return ServerResponse.ok().build();
    }

    /**
     * 删除用户
     *
     * @param request
     * @return
     * @throws Exception
     */
    public ServerResponse deleteUser(ServerRequest request) throws Exception {
        log.info("删除用户信息完成");
        return ServerResponse.ok().build();
    }

}

```

## 2.13 常用扩展点

- 统一应答处理

```java
@RestControllerAdvice
@Slf4j
public class IgnoreResponseResolver implements ResponseBodyAdvice<Object> {}
```

- 请求参数解析

```java
@Slf4j
public class AppCacheArgumentResolver implements HandlerMethodArgumentResolver {}
```

- 统一异常处理

```java
@ControllerAdvice
@ConditionalOnMissingBean(annotation = DisableGlobalExceptionInterceptor.class)
@Slf4j
public class GlobalExceptionInterceptor {}
```

- 异步任务装饰器

```java
public class AsyncMDCTaskDecorator implements TaskDecorator {}
```

# 第3章 SpringBoot3之数据访问

> SpringBoot 整合 `Spring`、`SpringMVC`、`MyBatis`进行**数据访问场景**开发

## 3.1 创建SSM整合项目

```xml
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>3.0.4</version>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
				</dependency>
```

**2 配置数据源**

```properties
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.type=com.zaxxer.hikari.HikariDataSource
spring.datasource.url=jdbc:mysql://localhost:3306/boot3db?characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=root123
```

安装MyBatisX插件，帮我们生成Mapper接口的xml文件即可

**3 配置MyBatis**

```properties
# 指定mapper映射文件位置
mybatis.mapper-locations=classpath*:/mapper/**/*.xml
# 打开驼峰命名规则
mybatis.configuration.map-underscore-to-camel-case=true
```

**4 CRUD编写**

- 编写Bean
- 编写Mapper
- 使用 `MyBatisx` 插件，快速生成MapperXML
- 测试CRUD

**5 自动配置原理**

**SSM整合总结：**

> 1. 导入 `mybatis-spring-boot-starter`
>
> 2. 配置**数据源**信息
>
> 3. 配置MyBatis的 **`mapper接口扫描`**与 **`xml映射文件扫描`**
>
> 4. 编写bean、mapper、生成xml、编写sql，进行CRUD。<span style="color:red;font-weight:bold;">事务等操作依然和Spring中用法一样</span>
>
> 5. 效果：
>    1. 所有sql写在xml中
>    2. 所有 **`MyBatis配置`**写在 `application.properties`下面

- <span style="color:red;">Jdbc场景的自动配置</span>
  - `mybatis-spring-boot-starter`导入 `spring-boot-starter-jdbc`，jdbc是操作数据库的场景
  - `Jdbc`场景的几个自动配置
    - org.springframework.boot.autoconfigure.jdbc.**DataSourceAutoConfiguration**
      - **数据源的自动配置**
      - 所有和数据源有关的配置都绑定在 `DataSourceProperties`
      - 默认使用 `HikariDatasource`
    - org.springframework.boot.autoconfigure.jdbc.**JdbcTemplateAutoConfiguration**
      - 给容器中放了 `JdbcTemplate`操作数据库
    - org.springframework.boot.autoconfigure.jdbc.**JndiDataSourceAutoConfiguration**
    - org.springframework.boot.autoconfigure.jdbc.**XADataSourceAutoConfiguration**
      - **基于XA二阶提交协议的分布式事务数据源**
    - org.springframework.boot.autoconfigure.jdbc.**DataSourceTransactionManagerAutoConfiguration**
      - **支持事务**
  - **具有的底层能力：数据源、`JdbcTemplate`、事务**

- `MyBatisAutoConfiguration`：配置了MyBatis的整合流程
  - `mybatis-spring-boot-starter`导入 `mybatis-spring-boot-autoconfigure(mybatis的自动配置包)`
  - 默认加载两个自动配置类：
    - org.mybatis.spring.boot.autoconfigure.MybatisLanguageDriverAutoConfiguration
    - org.mybatis.spring.boot.autoconfigure.**MybatisAutoConfiguration**
      - **必须在数据源配置好之后才配置**
      - 给容器中 `SqlSessionFactory` 组件。创建和数据库的一次会话
      - 给容器中 `SqlSessionTemplate` 组件。操作数据库
  - **MyBatis的所有配置绑定在** `MybatisProperties`
  - 每个**Mapper接口**的**代理对象**是怎么创建放到容器中。详见**@MapperScan**原理：
    - 利用 `@Import(MapperScannerRegistrar.class)`批量给容器中注册组件。解析指定的包路径里面的每一个类，为每一个Mapper接口类，创建Bean定义信息，注册到容器中。

> 如何分析哪个场景导入以后，开启了哪些自动配置类。
>
> 找：`classpath:/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`文件中配置的所有值，就是要开启的自动配置类，但是每个类可能有条件注解，基于条件注解判断哪个自动配置类生效了。

**6 快速定位生效的配置**

```properties
# 开启调试模式，详细打印开启了哪些自动配置 Positive（生效的自动配置） Negative（不生效的自动配置）
debug=true
```

**7 扩展：整合其他数据源**

- Druid数据源

> 暂不支持 `SpringBoot3`
>
> - 导入 `druid-starter`
> - 写配置
> - 分析自动配置了哪些东西，怎么使用

Druid官网：https://github.com/alibaba/druid



# 第4章 SpringBoot3之基础特性

## 4.1 SpringApplication

### 4.1.1 自定义banner

1. 类路径添加 <span style="color:red;">`banner.txt`</span> 或设置 <span style="color:red;">`spring.banner.location`</span> 就可以定制 banner
2. 推荐网站：[Spring Boot banner 在线生成工具，制作下载英文 banner.txt，修改替换 banner.txt 文字实现自定义，个性化启动 banner-bootschool.net](https://www.bootschool.net/ascii)

### 4.1.2 自定义SpringApplication

```java
@RestController
@SpringBootApplication
public class Boot306Application {

    public static void main(String[] args) {
        // 1、SpringApplication：Boot应用的核心API入口
//        SpringApplication.run(Boot306Application.class, args);

        // 1、自定义SpringApplication的底层设置
        SpringApplication application = new SpringApplication(Boot306Application.class);

        // 程序化调整SpringApplication的参数
        // 配置文件中的优先级，高于这里的调整优先级
        application.setBannerMode(Banner.Mode.CONSOLE);

        // 2、SpringApplication 运行起来
        application.run(args);
    }

}
```

### 4.1.3 FluentBuilder API

```java
@RestController
@SpringBootApplication
public class Boot306Application {

    public static void main(String[] args) {
        // 2、Builder方式构建SpringApplication，通过FlentAPI进行设置
        new SpringApplicationBuilder()
                .sources(Boot306Application.class)
                .bannerMode(Banner.Mode.CONSOLE)
                .run(args);
    }

}
```

## 4.2 Profiles

> 环境隔离能力；快速切换开发、测试、生产环境
>
> 步骤：
>
> 1. **标识环境：**指定哪些组件、配置在哪个环境生效
> 2. **切换环境：**这个环境对应的所有组件和配置就应该生效

### 4.2.1 使用

**1 指定环境**

- Spring Profiles提供一种**隔离配置**的方式，使其仅在**特定环境**生效；
- 任何 <span style="color:red;">`@Component`</span>，<span style="color:red;">`@Configuration`</span> 或 <span style="color:red;">`@ConfigurationProperties`</span> 可以使用 <span style="color:red;">`@Profile`</span> 标记，来指定何时被加载。【**容器中的组件**都可以被 <span style="color:red;">`@Profile`</span> 标记】

**2 环境激活**

1. 配置激活指定环境；配置文件

```properties
spring.profiles.active=production,hsqldb
```

2 也可以使用命令行激活。<span style="color:red;">`--spring.profiles.active=dev,hsqldb`</span> 或者 <span style="color:red;">`-Dspring.profiles.active=dev,hsqldb`</span>

3. 还可以配置默认环境；不标注@Profile的组件永远都存在。
   1. 以前默认环境叫 default
   2. `spring.profiles.default=test`
4. 推荐使用激活方式激活指定环境

**3 环境包含**

注意：

1. <span style="color:red;">`spring.profiles.active`</span> 和 <span style="color:red;">`spring.profiles.default`</span> 只能用到**无profile的文件**中，如果在 <span style="color:red;">`application-dev.yaml`</span>中编写就是**无效的**。

2. 也可以额外添加生效文件，而不是激活替换。比如：

```properties
# 包含指定环境，不管你激活哪一个环境，这个都要有。是总是要生效的环境
spring.profiles.include[0]=base,common
spring.profiles.include[1]=local
```

最佳实践：

- **生效的环境** = **激活的环境/默认环境** + **包含的环境**
- 项目里面这么用
  - 基础的配置 `mybatis`、`log`、`xxx`：写到**包含环境中**
  - 需要动态切换变化的 `db`、`redis`：写到**激活的环境中**


### 4.2.2 Profile分组

创建<span style="color:red;">`prod`</span>组，指定包含<span style="color:red;">`db`</span>和<span style="color:red;">`mq`</span>配置

```properties
spring.profiles.group.prod[0]=db
spring.profiles.group.prod[1]=mq
```

使用<span style="color:red;">`--spring.profiles.active=prod`</span>，就会激活<span style="color:red;">`prod`</span>，<span style="color:red;">`db`</span>，<span style="color:red;">`mq`</span>配置文件

### 4.2.3 Profile配置文件

- `application-{profile}.properties`可以作为**指定环境的配置文件**。
- 激活这个环境，**配置**就会生效。最终生效的所有**配置**是：
  - `application.properties`：主配置文件，任意时候都生效。
  - `application-{profile}.properties`：指定环境配置文件，激活指定环境生效。

profile优先级 > application

## 4.3 外部化配置

> **场景**：线上应用如何**快速修改配置**，并**应用最新配置**？
>
> - SpringBoot 使用 **配置优先级** + **外部配置** 简化配置更新、简化运维。
> - 只需要给 `jar` 应用所在的文件夹放一个 `application.properties` 最新配置文件，重启项目就能自动应用最新配置。

### 4.3.1 配置优先级

Spring Boot 允许将**配置外部化**，以便可以在不同的环境中使用相同的应用程序代码。

我们可以使用各种**外部配资源**，包括 <span style="color:red;">`Java Properties文件`</span>、<span style="color:red;">`YAML文件`</span>、<span style="color:red;">`环境变量`</span>和<span style="color:red;">`命令行参数`</span>。

<span style="color:red;">`@Value`</span>可以获取值，也可以用<span style="color:red;">`@ConfigurationProperties`</span>将所有属性绑定到<span style="color:red;">`java object`</span>中。

**以下是 SpringBoot 属性源加载顺序。**<span style="color:#9400D3;font-weight:bold;">后面的会覆盖前的值。</span><span style="color:#9400D3;">由低到高，高优先级配置覆盖低优先级配置</span>

1. <span style="color:#9400D3;font-weight:bold;">默认属性</span>（通过 <span style="color:red;">`SpringApplication.setDefaultProperties` </span>指定的）
2. <span style="color:red;">`@PropertySource`</span>指定加载的配置（需要写在<span style="color:red;">`@Configuration`</span>类才可生效）
3. <span style="color:#9400D3;font-weight:bold;">配置文件（`application.properties/yml`等）</span>
4. <span style="color:red;">`RandomValuePropertySource`</span>支持的<span style="color:red;">`random.*`</span>配置（如：`@Value("${random.int}")`)
5. OS 环境变量
6. Java 系统属性（<span style="color:red;">`System.getProperties()`</span>）
7. JNDI 属性（来自<span style="color:red;">`java.comp/env`</span>）
8. <span style="color:red;">`ServletContext`</span> 初始化参数
9. <span style="color:red;">`ServletConfig`</span> 初始化参数
10. <span style="color:red;">`SPRING_APPLICATION_SJON`</span>属性（内置在环境变量或系统属性中的 JSON）
11. <span style="color:#9400D3;font-weight:bold;">命令行参数</span>
12. 测试属性。（<span style="color:red;">`@SpringBootTest`</span>进行测试时指定的属性）
13. 测试类<span style="color:red;">@TestPropertySource</span>注解
14. Devtools设置的全局属性。（<span style="color:red;">`$HOME/.config/spring-boot`</span>）

> 结论：配置可以写到很多为止，常见的优先级顺序：
>
> - `命令行` > `配置文件` > `SpringApplication配置`

<span style="color:#9400D3;font-weight:bold;">配置文件优先级</span>如下：（**后面覆盖前面**）

1. **jar 包内**的<span style="color:red;">`application.properties/yml`</span>
2. **jar 包内**的<span style="color:red;">application-{profile}.properties/yml</span>
3. **jar 包外**的<span style="color:red;">application.properties/yml</span>
4. **jar 包外**的<span style="color:red;">application-{profile}.properties/yml</span>

**建议：用一种格式的配置文件。如果<span style="color:red;">`.properties`</span>和<span style="color:red;">`.yml`</span>同时存在，则.properties优先。**

> 结论：`包外 > 包内`；同级情况：`profile配置` > `application配置`

<span style="color:#9400D3;font-weight:bold;">所有参数均可由命令行传入，使用 `–参数项=参数值`，将会被添加到环境变量中，并优先于 `配置文件`。比如： java -jar app.jar --name="Spring"，可以使用 `@Value("${name}")` 获取</span>



演示场景：

- 包内：application.properties `server.port=8000`
- 包内：application-dev.properties `server.port=9000`
- 包外：application.properties `server.port=8001`
- 包外：application-dev.properties `server.port=90001`

启动端口？：命令行 > `9001` > `8001` > `9000` > `8000`

### 4.3.2 外部配置

SpringBoot 应用启动时会自动寻找 `application.properties` 和 `application.yaml` 位置，进行加载。顺序如下：（**后面覆盖前面**）

1. 类路径：内部
   1. 类根路径
   2. 类下 `config` 包
2. 当前路径（项目所在的位置）
   1. 当前路径
   2. 当前下 `/config` 子目录
   3. `/config` 目录的直接子目录

------

最终效果：优先级由高到低，前面覆盖后面

- 命令行 > 包外config直接子目录 > 包外config目录 > 包外根目录 > 包内目录
- 同级比较：
  - profile配置 > 默认配置
  - properties配置 > yaml配置

------

![img](images/1682073869709-2cba18c8-55bd-4bf1-a9df-ac784e30d89a.svg)

规律：最外层的最优先。

- 命令行 > 所有
- 包外 > 包内
- config目录 > 根目录
- profile > application

配置不同就都生效（互补），配置相同高优先级覆盖低优先级

### 4.3.3 导入配置

使用 <span style="color:red;">`spring.config.import`</span> 可以导入额外配置

```properties
spring.config.import=my.properties
my.property=value
```

无论以上写法的先后顺序，导入的<span style="color:red;">`my.properties`</span>的值总是优先于直接在配置文件中编写的<span style="color:red;">`my.property`</span>。

### 4.3.4 属性占位符

配置文件中可以使用 <span style="color:red;">`${name.default}`</span> 形式取出之前配置过的值。

```properties
app.name=MyApp
app.description=${app.name} is a Spring Boot application written by ${username:Unknown}
```

## 4.4 单元测试-JUnit5

### 4.4.1 整合

SpringBoot提供一系列测试工具集及注解方便我们进行测试。

<span style="color:red;">`spring-boot-test`</span>提供核心测试能力，<span style="color:red;">`spring-boot-test-autoconfigure`</span>提供测试的一些自动配置。我们只需要导入<span style="color:red;">`spring-boot-starter-test`</span>即可整合测试。

```java
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
```

<span style="color:red;">spring-boot-starter-test</span>默认提供了以下库供我们测试使用。

- [JUnit5](https://junit.org/junit5/)
- [Spring Test](https://docs.spring.io/spring-framework/docs/6.0.4/reference/html/testing.html#integration-testing)
- [AssertJ](https://assertj.github.io/doc/)
- [Hamcrest](https://github.com/hamcrest/JavaHamcrest)
- [Mockito](https://site.mockito.org/)
- [JSONassert](https://github.com/skyscreamer/JSONassert)
- [JsonPath](https://github.com/json-path/JsonPath)

### 4.4.2 测试

**1 组件测试**

直接 `@Autowired` 容器中的组件进行测试。

**2 注解**

JUnit5的注解与JUnit4的注解有所变化

https://junit.org/junit5/docs/current/user-guide/#writing-tests-annotations

- **@Test：**表示方法是测试方法。但是与JUnit4的@Test不同，他的职责非常单一不能声明任何属性，拓展的测试将会由Jupiter提供额外测试。
- **@ParameterizedTest：**表示方法是参数化测试，下方会有详细介绍。
- **@RepeatedTest：**表示方法可重复执行，下方会有详细介绍。
- **@DisplayName：**为测试类或者测试方法设置展示名称。
- **@BeforeEach：**表示在每个单元测试之前执行。
- **@AfterEach：**表示在每个单元测试之后执行。
- **@BeforeAll：**表示在所有单元测试之前执行。
- **@AfterAll：**表示在所有单元测试之后执行。
- **@Tag：**表示单元测试类别，类似于JUnit4中的@Categories。
- **@Disabled：**表示测试类或测试方法不执行，类似于JUnit4中的@Ignore。
- **@Timeout：**表示测试方法运行如果超过了指定时间将会返回错误。
- **@ExtendWith：**为测试类或测试方法提供扩展类引用。

```java
import static org.junit.jupiter.api.Assertions.fail;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class StandardTests {

    @BeforeAll
    static void initAll() {
    }

    @BeforeEach
    void init() {
    }

    @DisplayName("😱")
    @Test
    void succeedingTest() {
    }

    @Test
    void failingTest() {
        fail("a failing test");
    }

    @Test
    @Disabled("for demonstration purposes")
    void skippedTest() {
        // not executed
    }

    @Test
    void abortedTest() {
        assumeTrue("abc".contains("Z"));
        fail("test should have been aborted");
    }

    @AfterEach
    void tearDown() {
    }

    @AfterAll
    static void tearDownAll() {
    }

}
```

**3 断言**

| 方法                                               | 说明                                      |
| -------------------------------------------------- | ----------------------------------------- |
| assertEquals                                       | 判断两个对象或两个原始类型是否相等。      |
| assertNotEquals                                    | 判断两个对象或两个原始类型是否不相等      |
| assertSame                                         | 判断两个对象引用是否指向同一个对象        |
| assertNotSame                                      | 判断两个对象引用是否指向不同的对象        |
| assertTrue                                         | 判断给定的布尔值是否为true                |
| assertFalse                                        | 判断给定的布尔值是否为false               |
| assertNull                                         | 判断给定的对象引用是否为null              |
| assertNotNull                                      | 判断给定的对象引用是否不为null            |
| <span style="color:blue;">assertArrayEquals</span> | <span style="color:blue;">数组断言</span> |
| <span style="color:blue;">assertAll</span>         | <span style="color:blue;">组合断言</span> |
| <span style="color:blue;">assertThrows</span>      | <span style="color:blue;">异常断言</span> |
| <span style="color:blue;">数组断言</span>          | <span style="color:blue;">超时断言</span> |
| <span style="color:blue;">fail</span>              | <span style="color:blue;">快速失败</span> |

**4 嵌套测试**

> JUnit 5可以通过 Java 中的内部类和 @Nested 注解实现嵌套测试，从而可以更好的把相关的测试方法组织在一起。在内部类中可以使用 @BeforeEach 和 @AfterEach 注解，而且嵌套的层次没有限制。

```java
@DisplayName("A stack")
class TestingAStackDemo {

    Stack<Object> stack;

    @Test
    @DisplayName("is instantiated with new Stack()")
    void isInstantiatedWithNew() {
        new Stack<>();
    }

    @Nested
    @DisplayName("when new")
    class WhenNew {

        @BeforeEach
        void createNewStack() {
            stack = new Stack<>();
        }

        @Test
        @DisplayName("is empty")
        void isEmpty() {
            assertTrue(stack.isEmpty());
        }

        @Test
        @DisplayName("throws EmptyStackException when popped")
        void throwsExceptionWhenPopped() {
            assertThrows(EmptyStackException.class, stack::pop);
        }

        @Test
        @DisplayName("throws EmptyStackException when peeked")
        void throwsExceptionWhenPeeked() {
            assertThrows(EmptyStackException.class, stack::peek);
        }

        @Nested
        @DisplayName("after pushing an element")
        class AfterPushing {

            String anElement = "an element";

            @BeforeEach
            void pushAnElement() {
                stack.push(anElement);
            }

            @Test
            @DisplayName("it is no longer empty")
            void isNotEmpty() {
                assertFalse(stack.isEmpty());
            }

            @Test
            @DisplayName("returns the element when popped and is empty")
            void returnElementWhenPopped() {
                assertEquals(anElement, stack.pop());
                assertTrue(stack.isEmpty());
            }

            @Test
            @DisplayName("returns the element when peeked but remains not empty")
            void returnElementWhenPeeked() {
                assertEquals(anElement, stack.peek());
                assertFalse(stack.isEmpty());
            }
        }
    }
}
```

**5 参数化测试**

参数化测试是JUnit5很重要的一个新特性，它使得用不同的参数多次运行测试成为了可能，也为我们的单元测试带来许多便利。

利用 `@ValueSource` 等注解，指定入参，我们将可以使用不同的参数进行多次单元测试，而不需要每新增一个参数就新增一个单元测试，省去了很多冗余代码。

**`@ValueSource`**：为参数化测试指定入参来源，支持八大基础类以及String类型，Class类型。

**`@NullSource`**：表示为参数化测试提供一个null的入参。

**`@EnumSource`**：表示为参数化测试提供一个枚举入参。

**`@CsvFileSource`**：表示读取指定CSV文件内容作为参数化测试入参。

**`@MethodSource`**：表示读取指定方法的返回值作为参数化测试入参（注意方法返回需要是一个流）。

```java
@ParameterizedTest
@ValueSource(strings = {"one", "two", "three"})
@DisplayName("参数化测试1")
public void parameterizedTest1(String string) {
    System.out.println(string);
    Assertions.assertTrue(StringUtils.isNotBlank(string));
}


@ParameterizedTest
@MethodSource("method")    //指定方法名
@DisplayName("方法来源参数")
public void testWithExplicitLocalMethodSource(String name) {
    System.out.println(name);
    Assertions.assertNotNull(name);
}

static Stream<String> method() {
    return Stream.of("apple", "banana");
}
```



# 第5章 SpringBoot3之核心原理

## 5.1 事件和监听器

### 5.1.1 生命周期监听

场景：监听**应用**的<span style="color:red;font-weight:bold;">生命周期</span>

#### 1 监听器-SpringApplicationRunListener

1. 自定义 <span style="color:red;font-weight:bold;">`SpringApplicationRunListener`</span> 来**监听事件**

   1. 编写<span style="color:red;font-weight:bold;">`SpringApplicationRunListener`</span> **实现类**
   2. 在 <span style="color:red;font-weight:bold;">`META-INF/spring.factories`</span> 中配置 <span style="color:red;font-weight:bold;">`org.springframework.boot.SpringApplicationRunListener=自己的Listener`</span>，还可以指定一个 **有参构造器**，接受两个参数 <span style="color:red;font-weight:bold;">`（SpringApplication application, String[] args)`</span>
   3. SpringBoot 在 <span style="color:red;font-weight:bold;">`spring-boot.jar`</span> 中配置了默认的 Listener，如下

   <span style="color:#9400D3;font-weight:bold;">`org.springframework.boot.SpringApplicationRunListener=\`</span><span style="color:blue;font-weight:bold;">`org.springframework.boot.context.event.EventPublishingRunListener`</span>

   <span style="color:#FFD700;font-weight:bold;">注意：这里的EventPublishingRunListener负责在生命周期钩子执行之前，先触发对应的SpringApplicationEvent事件。</span>
   
   ```java
   /**
    * SpringBoot应用生命周期监听
    * Listener先要从 META-INF/spring.factories 读到
    * 1、引导：利用 BootstrapContext 引导整个项目启动
    * starting：应用开始，SpringApplication的run方法一调用，只要有了 BootstrapContext 就执行
    * environmentPrepared：环境准备好（把启动参数等绑定到环境变量中），但是IOC还没有创建【调一次】
    * 2、启动：
    * contextPrepared：IOC容器创建并准备好，但是sources（主配置类）尚未加载，并关闭引导上下文；组件并未创建。【调一次】
    * contextLoaded： IOC容器已经被加载。主配置加载进去了，但是IOC容器还没刷新（我们的bean没有创建）。
    * ==========截止以前，ioc容器里面还没造bean呢==========
    * started：IOC容器刷新了（所有bean造好了），但是 runner 没调用。
    * ready：IOC容器刷新了（所有bean造好了），所有 runner 调用完了
    * 3、运行
    * 如果以前步骤都正确执行，代表容器 running
    */
   
   ```

#### 2 生命周期全流程

![image.png](images/1682322663331-25a89875-7ce3-40ae-9be7-9ea752fbab20.png)

### 5.1.2 事件触发时机

#### 1 各种回调监听器

- `BootstrapRegistryInitializer`：<span style="color:#9400D3;font-weight:bold;">感知特定阶段：</span>感知**引导初始化**
  - <span style="color:red;font-weight:bold;">`创建引导上下文 bootstrapContext 的时候触发`</span>
  - <span style="color:red;font-weight:bold;">`META-INF/spring.factories`</span>
  - `application.addBootstrapRegistryInitializer()`
  - <span style="color:red;font-weight:bold;">`场景：进行密钥校对授权。`</span>
  
- `ApplicationContextInitializer`：<span style="color:#9400D3;font-weight:bold;">感知特定阶段：</span>感知ioc容器初始化
  - <span style="color:red;font-weight:bold;">`environmentPrepared之后、contextPrepared之前 的时候触发`</span>
  - <span style="color:red;font-weight:bold;">`META-INF/spring.factories`</span>
  - `application.addInitializers()`

- <span style="color:#9400D3;font-weight:bold;">`ApplicationListener：`感知全阶段：基于事件机制，感知事件。一旦到了哪个阶段可以做别的事</span>
  - <span style="color:red;font-weight:bold;">`META-INF/spring.factories`</span>
  - `@Bean`或`@EventListener`：`事件驱动`
  - `SpringApplication.addListeners(...)`或 `SpringApplicationBuilder.listeners(...)`

- <span style="color:#9400D3;font-weight:bold;">`SpringApplicationRunListener：`感知全阶段生命周期+各种阶段都能自定义操作；功能更完善。</span>
  - <span style="color:red;font-weight:bold;">`META-INF/spring.factories`</span>
- <span style="color:#9400D3;font-weight:bold;">`ApplicationRunner：`感知特定阶段：感知应用就绪Ready。卡死应用，就不会就绪。</span>
  - `@Bean`
- <span style="color:#9400D3;font-weight:bold;">`CommandLineRunner：`感知特定阶段：感知应用就绪Ready。卡死应用，就不会就绪。</span>
  - `@Bean`

最佳实战：

- 如果项目启动前做事：`BootstrapRegistryInitializer`和`ApplicationContextInitializer`
- 如果想要在项目启动完成后做事：<span style="color:#9400D3;font-weight:bold;">`ApplicationRunner`和`CommandLineRunner`</span>
- <span style="color:#9400D3;font-weight:bold;">如果要干涉生命周期做事：`SpringApplicationRunListener`</span>
- <span style="color:#9400D3;font-weight:bold;">如果想要用事件机制：`ApplicationListener`</span>

#### 2 完整触发流程

**9 大事件** 触发顺序&时机

1. `ApplicationStartingEvent`：应用启动但未做任何事情，除过注册listeners and initializers。
2. `ApplicationEnvironmentPreparedEvent`：Environment准备好，但context未创建。
3. `ApplicationContextInitializedEvent`：ApplicationContext准备好，ApplicationContextInitializers调用，但是任何bean未加载。
4. `ApplicationPreparedEvent`：容器刷新之前，bean定义信息加载。
5. `ApplicationStartedEvent`：容器刷新完成，runner未调用。

==========以下就开始插入了**探针机制**==========

6. `AvailabilityChangeEvent`：`LivenessState.CORRECT`应用存活；**存活探针**
7. `ApplicationReadyEvent`：任何runner被调用
8. `AvailabilityChangeEvent`：`ReadinessState.ACCEPTING_TRAFFIC`**就绪探针**，可以接请求。
9. `ApplicationFailedEvent`：启动出错

![image.png](images/1682332243584-e7dd3527-b00f-4f65-a44c-19b88e0943fc.png)

应用事件发送顺序如下：![image.png](images/1681829576515-f8e3e993-f696-4d9d-9cdd-76ba3ba396c3.png)

感知应用是否**存活**了：可能植物状态，虽然活着但是不能处理请求。

应用是否**就绪**了：能响应请求，说明确实活的比较好。

#### 3 SpringBoot事件驱动开发

> **应用启动过程生命周期事件感知（9大事件）、应用运行中事件感知（无数种）**。

- **事件发布：**`ApplicationEventPublisherAware`或`注入：ApplicationEventMulticaster`
- **事件监听：**`组件 + @EventListener`

![image.png](images/1682327167479-8f634931-f8ca-48fb-9566-c914f1795ff2.png)

![image.png](images/1682341921101-aa095a84-00cc-4815-b675-f4ed81cecf3b.png)

> 事件发布者

```java
@Service
public class EventPublisher implements ApplicationEventPublisherAware {

    /**
     * 底层发送事件用的组件，SpringBoot会通过ApplicationEventPublisherAware接口自动注入给我们
     * 事件是广播出去的。所有监听这个事件的监听器都可以收到
     */
    ApplicationEventPublisher applicationEventPublisher;

    /**
     * 所有事件都可以发
     * @param event
     */
    public void sendEvent(ApplicationEvent event) {
        //调用底层API发送事件
        applicationEventPublisher.publishEvent(event);
    }

    /**
     * 会被自动调用，把真正发事件的底层组组件给我们注入进来
     * @param applicationEventPublisher event publisher to be used by this object
     */
    @Override
    public void setApplicationEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.applicationEventPublisher = applicationEventPublisher;
    }
}
```

> 事件订阅者

```java
@Service
public class CouponService {

    @Order(1)
    @EventListener
    public void onEvent(LoginSuccessEvent loginSuccessEvent){
        System.out.println("===== CouponService ====感知到事件"+loginSuccessEvent);
        UserEntity source = (UserEntity) loginSuccessEvent.getSource();
        sendCoupon(source.getUsername());
    }

    public void sendCoupon(String username){
        System.out.println(username + " 随机得到了一张优惠券");
    }
}
```

## 5.2 自动配置原理

### 5.2.1 入门理解

> 应用关注的**三大核心：场景、配置、组件**

#### 1 自动配置流程

![image.png](images/1681829645812-0f0cad01-66d4-42fc-8111-091e33a062c6.png)

1. 导入 `starter`
2. 依赖导入 `autoconfigure`
3. 寻找类路径下 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`文件
4. 启动，加载所有 `自动配置类` `xxxAutoConfiguration`
   1. 给容器中配置**功能**`组件`
   2. `组件参数`绑定到 `属性类`中。`xxxProperties`
   3. `属性类` 和 `配置文件` 前缀项绑定
   4. `@Contional派生的条件注解`进行判断**是否组件生效**
5. 效果：
   1. 修改配置文件，修改底层参数
   2. 所有场景自动配置好直接使用
   3. 可以注入SpringBoot配置好的组件随时使用

#### 2 SPI机制

> - <span style="color:red;font-weight:bold;">Java中的SPI（Service Provider Interface）是一种软件设计模式，用于</span><span style="color:blue;font-weight:bold;">在应用程序中动态地发现和加载组件</span>。**SPI的思想**是，定义一个接口或抽象类，然后通过在classpath中定义实现该接口的类来实现对组件的动态发现和加载。
> - SPI的主要目的是解决在应用程序中使用可插拔组件的问题。例如，一个应用程序可能需要使用不同的日志框架或数据库连接池，但是这些组件的选择可能取决于运行时的条件。通过使用SPI，应用程序可以在运行时发现并加载适当的组件，而无需在代码中硬编码这些组件的实现类。
> - 在Java中，**SPI**的实现方式是通过在 `META-INF/services` 目录下创建一个以服务接口全限定名为名字的文件，文件中包含实现该服务接口的类的全限定名。当应用程序启动时，Java的SPI机制会自动扫描 classpath 中的这些文件，并根据文件中指定的类名来加载实现类。
> - 通过使用SPI，应用程序可以实现更灵活、可扩展的架构，同时也可以避免硬编码依赖关系和增加代码的可维护性。
>
> 以上回答来自 `ChatGPT-3.5`

#### 3 功能开关

- 自动配置：全部都配置好，什么都不用管。自动批量导入
  - 项目一启动，SPI文件中指定的所有都加载。
  - `@EnableXXX`：手动控制哪些功能的开启；手动导入。
    - 开启xxx功能
    - 都是利用 @import 把此功能要用的组件导入进去

### 5.2.2 进阶理解

#### 1 @SpringBootApplication

**1.1 @SpringBootConfiguration**

就是：@Configuration，容器中的组件，配置类。spring ioc启动就会加载创建这个类对象。



**1.2 @EnableAutoConfiguration**

**1.2.1 @AutoConfigurationPackage：**扫描主程序包：加载自己的组件

- 利用 `@Import(AutoConfigurationPackages.Registrar.class)` 想要给容器中导入组件。
- 把主程序所在的**包**的所有组件导入进来。
- **为什么SpringBoot默认只扫描主程序所在的包及其子包**

**1.2.2 @Import(AutoConfigurationImportSelector.class)：加载所有自动配置类：加载starter导入的组件**

```java
		List<String> configurations = ImportCandidates.load(AutoConfiguration.class, getBeanClassLoader())
			.getCandidates();
```

> 扫描SPI文件：`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`



**1.3 @ComponentScan**

> 组件扫描：排除一些组件（哪些不要）
>
> 排除前面已经扫描进来的 `配置类` 和 `自动配置类`。

```java
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
      @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
```



#### 2 完整启动加载流程

> 生命周期启动加载流程

![自动配置进阶原理.svg](images/1682569555020-b6cbc750-3171-44c6-810f-1c59e590b792.svg)





## 5.3 自定义starter

> 场景：**抽取聊天机器人场景，它可以打招呼。**
>
> 效果：任何项目导入此 `starter` 都具有打招呼功能，并且**问候语**中的**人名**需要可以在**配置文件**中修改。

1. 创建 `自定义starter` 项目，引入 <span style="color:red;">`spring-boot-starter`</span> 基础依赖
2. 编写模块功能，引入模块所有需要的依赖。
3. 编写 `xxxAutoConfiguration` 自动配置类，帮其他项目导入这个模块需要的所有组件
4. 编写配置文件 <span style="color:red;"> `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`</span> 指定启动需要加载的自动配置
5. 其他项目引入即可使用



### 5.3.1 业务代码

> 自定义配置有提示。导入以下依赖重启项目，再写配置文件就有提示

```java
@Data
@ConfigurationProperties(prefix = "robot")
@Component
public class RobotProperties {
    private String name;
    private String age;
    private String email;
}
```

```xml
        <!--生成配置元数据<spring-configuration-metadata.json>，
            从 @ConfigurationProperties 注释生成自己的配置元数据文件，辅助yml配置时自动提示 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional><!--表示依赖不会传递-->
        </dependency>
```

### 5.3.2 基本抽取

- 创建 starter 项目，把公共代码需要的所有依赖导入
- 把公共代码复制过来
- 自己写一个 `RobotAutoConfiguration`，给容器中导入这个场景需要的所有组件
  - 为什么这些组件默认不会被扫描进去？
  - **starter所在的包和引入她的项目的主程序所在的包不是父子层级**
- 别人引用这个`starter`，直接导入这个 `RobotAutoConfiguration`，就能把这个场景的组件导入进来

- 功能生效
- 测试编写配置文件

### 5.3.3 使用@EnableXXX机制

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
@Documented
@Import(RobotAutoConfiguration.class)
public @interface EnableRobot {
}
```

别人引入`starter`需要使用 `@EnableRobot`开启功能  

### 5.3.4 完全自动配置

- 依赖SpringBoot的SPI机制
- <span style="color:red;">`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`</span> 文件中编写好我们自动配置类的全类名即可
- 项目启动，自动加载我们的自动配置类

# 附录：SpringBoot3改变及新特性

1、**自动配置包位置变化**

```
META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
```

2、**jakata api迁移**

- **`druid`**有问题

3、**新特性** - **函数式Web**、**ProblemDetails**

**4、GraalVM 与 AOT**

**5、响应式编程全套**

6、剩下变化都是版本升级，意义不大



# SpringBoot3之场景整合篇

# 第1章 NoSQL

## 1.1 场景整合

- 依赖导入

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
```

- 配置

```properties
spring.data.redis.host=192.168.200.116
spring.data.redis.port=6379
```

- 测试

```java
@RestController
public class RedisTestController {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @GetMapping("/count")
    public String count() {
        Long count = stringRedisTemplate.opsForValue().increment("count");

        /*
        常见数据类型：k: v value可以有很多类型
        string: 普通字符串   redisTemplate.opsForValue().set("key", "value");
        list:   列表        redisTemplate.opsForList().leftPush("list", "value");
        set:    集合        redisTemplate.opsForSet().add("set", "value");
        zset:   有序集合     redisTemplate.opsForZSet().add("zset", "value", 1);
        hash:   散列        redisTemplate.opsForHash().put("hash", "key", "value");
         */

        return "访问了【" + count + "】次！";
    }
}
```

## 1.2 自动配置原理

1. <span style="color:red;">`META-INF/spring/org.springframework.boott.autoconfigure.AutoConfiguration.imports`</span>中导入了<span style="color:red;">`RedisAutoConfiguration`</span>、<span style="color:red;">`RedisReactiveAutoConfiguration`</span>和<span style="color:red;">`RedisRepositoriesAutoConfiguration`</span>。所有属性绑定<span style="color:red;">`RedisProperties`</span>中。
2. <span style="color:red;">`RedisReactiveAutoConfiguration`</span>属于响应式编程，不用管。<span style="color:red;">`RedisRepositoriesAutoConfiguration`</span>属于JPA操作，也不用管。
3. <span style="color:red;">`RedisAutoConfiguration`</span>配置了以下组件：
   1. <span style="color:red;">`LettuceConnectionConfiguration`</span>：给容器中注入了连接工厂<span style="color:red;">`LettuceConnectionFactory`</span>，和操作redis的客户端<span style="color:red;">`DefaultClientResources`</span>。
   2. <span style="color:red;">`RedisTemplate<Object, Object>`</span>：可给redis中存储任意对象，会使用jdk默认序列化方式。
   3. <span style="color:red;">`StringRedisTemplate`</span>：给redis中存储字符串，如果要存储对象，需要开发人员自己进行序列化。**key-value都必须是字符串**进行操作。

## 1.3 定制化

### 1.3.1 序列化机制

```java
@Configuration
public class AppRedisConfiguration {

    /**
     * 允许Object类型的key-value，都可以转为json进行存储。
     *
     * @param redisConnectionFactory - RedisAutoConfiguration配置的，被自动注入的RedisConnectionFactory
     * @return
     */
    @Bean
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        // 把对象转为json字符串的序列化工具
        template.setDefaultSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }

}
```

### 1.3.2 redis客户端

> RedisTemplate、StringRedisTemplate、操作redis的工具类
>
> - 要从redis的连接工厂获取链接才能操作redis
> - **Redis客户端**
>   - Lettuce：默认
>   - Jedis：可以使用以下切换

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
            <exclusions>
                <exclusion>
                    <groupId>io.lettuce</groupId>
                    <artifactId>lettuce-core</artifactId>
                </exclusion>
            </exclusions>
        </dependency>

        <!--切换 jedis 作为操作redis的底层客户端-->
        <dependency>
            <groupId>redis.clients</groupId>
            <artifactId>jedis</artifactId>
        </dependency>
```

### 1.3.3 配置参考

```properties
spring.data.redis.host=192.168.200.116
spring.data.redis.port=6379

# 设置 lettuce 的底层参数
#spring.data.redis.client-type=lettuce
#spring.data.redis.lettuce.pool.enabled=true
#spring.data.redis.lettuce.pool.max-active=8

# 设置 jedis 的底层参数
spring.data.redis.client-type=jedis
spring.data.redis.jedis.pool.enabled=true
spring.data.redis.jedis.pool.max-active=8

```

# 第2章 接口文档

## OpenAPI3与Swagger

> Swagger可以快速生成**实时接口文档**，方便前后开发人员进行协调沟通。遵循**OpenAPI**规范。
>
> 文档：https://springdoc.org/

## 2.1 OpenAPI3架构

![img](images/1681977849796-4b79ef53-8969-488d-aaa8-73fc333e8be7.png)

## 2.2 整合

- 导入场景

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.1.0</version>
</dependency>
```

http://localhost:8080/swagger-ui/index.html

- 配置【待定】

```properties
# /api-docs endpoint custom path 默认 /v3/api-docs
springdoc.api-docs.path=/api-docs

# swagger 相关配置在  springdoc.swagger-ui
# swagger-ui custom path
springdoc.swagger-ui.path=/swagger-ui.html

springdoc.show-actuator=true
```

## 2.3 使用

### 2.3.1 常用注解

| 注解         | 标注位置            | 作用                   |
| ------------ | ------------------- | ---------------------- |
| @Tag         | controller 类       | 标识 controller 作用   |
| @Parameter   | 参数                | 标识参数作用           |
| @Parameters  | 参数                | 参数多重说明           |
| @Schema      | model 层的 JavaBean | 描述模型作用及每个属性 |
| @Operation   | 方法                | 描述方法作用           |
| @ApiResponse | 方法                | 描述响应状态码等       |

### 2.3.2 Docket配置

> 如果有多个Docket，配置如下

```java
    /**
     * 分组设置
     *
     * @return
     */
    @Bean
    public GroupedOpenApi empApi() {
        return GroupedOpenApi.builder()
                .group("员工管理")
                .pathsToMatch("/emp/**", "/emps")
                .build();
    }

    @Bean
    public GroupedOpenApi deptApi() {
        return GroupedOpenApi.builder()
                .group("部门管理")
                .pathsToMatch("/dept/**", "/depts")
                .addOpenApiMethodFilter(method -> method.getName().startsWith("get"))
                .build();
    }
```

> 如果只有一个Docket，可以配置如下【待定】

```properties
springdoc.packagesToScan=package1, package2
springdoc.pathsToMatch=/v1, /api/balance/**
```

### 2.3.3 OpenAPI配置

```java
    @Bean
    public OpenAPI docOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("SpringBoot3-CRUD API")
                        .description("专门测试接口文档")
                        .version("v0.0.1")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")))
                .externalDocs(new ExternalDocumentation()
                        .description("springlearning Wiki Documentation")
                        .url("https://springlearning.wiki.github.org/docs"));
    }

```

## 2.4 Springfox迁移

### 2.4.1 注解变化

| 原注解                                      | 现注解                                                       | 作用           |
| ------------------------------------------- | ------------------------------------------------------------ | -------------- |
| @Api                                        | @Tag                                                         | 描述Controller |
| @ApiIgnore                                  | @Parameter(hidden = true)  @Operation(hidden = true) @Hidden | 描述忽略操作   |
| @ApiImplicitParam                           | @Parameter                                                   | 描述参数       |
| @ApiImplicitParams                          | @Parameters                                                  | 描述参数       |
| @ApiModel                                   | @Schema                                                      | 描述对象       |
| @ApiModelProperty(hidden = true)            | @Schema(accessMode = READ_ONLY)                              | 描述对象属性   |
| @ApiModelProperty                           | @Schema                                                      | 描述对象属性   |
| @ApiOperation(value = "foo", notes = "bar") | @Operation(summary = "foo", description = "bar")             | 描述方法       |
| @ApiParam                                   | @Parameter                                                   | 描述参数       |
| @ApiResponse(code = 404, message = "foo")   | @ApiResponse(responseCode = "404", description = "foo")      | 描述响应       |

### 2.4.2 Docket配置【参考】

1. 以前写法

```java
  @Bean
  public Docket publicApi() {
      return new Docket(DocumentationType.SWAGGER_2)
              .select()
              .apis(RequestHandlerSelectors.basePackage("org.github.springshop.web.public"))
              .paths(PathSelectors.regex("/public.*"))
              .build()
              .groupName("springshop-public")
              .apiInfo(apiInfo());
  }

  @Bean
  public Docket adminApi() {
      return new Docket(DocumentationType.SWAGGER_2)
              .select()
              .apis(RequestHandlerSelectors.basePackage("org.github.springshop.web.admin"))
              .paths(PathSelectors.regex("/admin.*"))
              .apis(RequestHandlerSelectors.withMethodAnnotation(Admin.class))
              .build()
              .groupName("springshop-admin")
              .apiInfo(apiInfo());
  }
```

2. 新写法

```java
  @Bean
  public GroupedOpenApi publicApi() {
      return GroupedOpenApi.builder()
              .group("springshop-public")
              .pathsToMatch("/public/**")
              .build();
  }
  @Bean
  public GroupedOpenApi adminApi() {
      return GroupedOpenApi.builder()
              .group("springshop-admin")
              .pathsToMatch("/admin/**")
              .addOpenApiMethodFilter(method -> method.isAnnotationPresent(Admin.class))
              .build();
  }
```

3. 添加OpenAPI组件

```java
  @Bean
  public OpenAPI springShopOpenAPI() {
      return new OpenAPI()
              .info(new Info().title("SpringShop API")
              .description("Spring shop sample application")
              .version("v0.0.1")
              .license(new License().name("Apache 2.0").url("http://springdoc.org")))
              .externalDocs(new ExternalDocumentation()
              .description("SpringShop Wiki Documentation")
              .url("https://springshop.wiki.github.org/docs"));
  }
```



# 第3章 远程调用

**RPC（Remote Procedure Call)：远程过程调用**

![img](images/1683348699620-39b5acb1-9f2a-4a7f-af3a-7829769ca567.png)

**本地过程调用**：a(); b(); a() { b(); } 不同方法都在**同一个JVM运行**

**远程过程调用**：

- 服务提供者：
- 服务消费者：
- 通过连接对方服务器进行请求\响应交互，来实现调用效果

API/SDK的区别是什么？

- api：接口（Application Programming Interface）
  - 远程提供功能；
- sdk：工具包（Software Development Kit）
  - 导入jar包，直接调用功能即可

> **开发过程中**，我们经常需要调用别人写的功能
>
> - 如果是**内部**微服务，可以通过**依赖cloud**、**注册中心**、**openfeign**等进行调用
> - 如果是**外部**暴露的，可以**发送http请求，或遵循外部协议**进行调用
>
> SpringBoot整合提供了很多方式进行远程调用
>
> - 轻量级客户端方式
>
>   - RestTemplate：普通开发
>   - WebClient：响应式编程开发
>   - Http Interface：声明式编程
>
> - Spring Cloud分布式解决方案方式
>
>   - Spring Cloud OpenFeign
>
> - 第三方框架
>
>   - Dubbo
>   - gRPC
>
>   - ……



## 3.1 WebClient

> 非阻塞、响应式HTTP客户端

### 3.1.1 创建与配置

发请求：

- 请求方式：GET\POST\DELETE\xxxx
- 请求路径：/xxx
- 请求参数：aa=bb&cc=dd&xxx
- 请求头：aa=bb,cc=ddd
- 请求体：

创建 <span style="color:red;">`WebClient`</span>非常简单：

- <span style="color:red;">`WebClient.create()`</span>
- <span style="color:red;">`WebClient.create(String baseUrl)`</span>

还可以使用 <span style="color:red;">`WebClient.builder()`</span> 配置更多参数项：

- <span style="color:red;">`uriBuilderFactory`</span>：自定义 <span style="color:red;">`UriBuilderFactory`</span>，定义 baseurl。
- <span style="color:red;">`defaultUriVariables`</span>：默认 uri 变量。
- <span style="color:red;">`defaultHeader`</span>：每个请求默认头
- <span style="color:red;">`defaultCookie`</span>：每个请求默认 cookie。
- <span style="color:red;">`defaultRequest`</span>：<span style="color:red;">`Consumer`</span> 自定义每个请求。
- <span style="color:red;">`filter`</span>：过滤 client 发送的每个请求
- <span style="color:red;">`exchangeStrategies`</span>：HTTP消息 reader/writer 自定义。
- <span style="color:red;">`clientConnector`</span>：HTTP client库设置。

```java
//获取响应完整信息
WebClient client = WebClient.create("https://example.org");
```

### 3.1.2 获取响应

> <span style="color:red;">`retrieve()`</span>方法用来声明如何提取响应数据。比如：

```java
//获取响应完整信息
WebClient client = WebClient.create("https://example.org");
Mono<ResponseEntity<Person>> result = client.get()
        .uri("/persons/{id}", id).accept(MediaType.APPLICATION_JSON)
        .retrieve()
        .toEntity(Person.class);

//只获取body
WebClient client = WebClient.create("https://example.org");
Mono<Person> result = client.get()
        .uri("/persons/{id}", id).accept(MediaType.APPLICATION_JSON)
        .retrieve()
        .bodyToMono(Person.class);

//stream数据
Flux<Quote> result = client.get()
        .uri("/quotes").accept(MediaType.TEXT_EVENT_STREAM)
        .retrieve()
        .bodyToFlux(Quote.class);

//定义错误处理
Mono<Person> result = client.get()
        .uri("/persons/{id}", id).accept(MediaType.APPLICATION_JSON)
        .retrieve()
        .onStatus(HttpStatus::is4xxClientError, response -> ...)
        .onStatus(HttpStatus::is5xxServerError, response -> ...)
        .bodyToMono(Person.class);
```



### 3.1.3 定义请求体

```java
//1、响应式-单个数据
Mono<Person> personMono = ... ;
Mono<Void> result = client.post()
        .uri("/persons/{id}", id)
        .contentType(MediaType.APPLICATION_JSON)
        .body(personMono, Person.class)
        .retrieve()
        .bodyToMono(Void.class);

//2、响应式-多个数据
Flux<Person> personFlux = ... ;
Mono<Void> result = client.post()
        .uri("/persons/{id}", id)
        .contentType(MediaType.APPLICATION_STREAM_JSON)
        .body(personFlux, Person.class)
        .retrieve()
        .bodyToMono(Void.class);

//3、普通对象
Person person = ... ;
Mono<Void> result = client.post()
        .uri("/persons/{id}", id)
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(person)
        .retrieve()
        .bodyToMono(Void.class);
```

## 3.2 HTTP Interface

> Spring 允许我们通过定义接口的方式，给任意位置发送 http 请求，实现远程调用，可以用来简化 HTTP 远程访问。需要 <span style="color:red;">`webflux`</span> 场景才可。

### 3.2.1 导入依赖

```properties
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

### 3.2.2 定义接口

```java
public interface WeatherInterface {

    @GetExchange(url = "https://jisuqgtq.market.alicloudapi.com/weather/query", accept = "application/json")
    Mono<String> getWeather(@RequestParam("city") String city, @RequestHeader("Authorization") String auth);
}
```

### 3.2.3 创建代理&测试

```java
@Configuration
public class WeatherConfiguration {

    @Bean
    public HttpServiceProxyFactory httpServiceProxyFactory() {
        // 1、创建客户端
        WebClient client = WebClient.builder()
                .codecs(clientCodecConfigurer -> {
                    clientCodecConfigurer.defaultCodecs()
                            .maxInMemorySize((256 * 1024 * 1024)); // 响应数据量太大有可能会超出 BufferSize，所以这里设置的大一点。
                }).build();
        // 2、创建工厂
        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(WebClientAdapter.create(client)).build();
        return factory;
    }

    @Bean
    public WeatherInterface weatherInterface(HttpServiceProxyFactory factory) {
        // 3、获取代理对象
        WeatherInterface weatherInterface = factory.createClient(WeatherInterface.class);
        return weatherInterface;
    }
}
```

# 第4章 消息服务

## 4.1 消息队列-场景

### 4.1.1 异步

![img](images/1683508559265-41439f88-8a77-421b-8072-64ac18836e14.png)

### 4.1.2 解耦

![img](images/1683509053856-89249929-3fd0-46c9-bef0-05fdf1d4a57a.png)

### 4.1.3 削峰

![img](images/1683509270156-4f382e30-4c48-48f4-be07-502178966813.png)

### 4.1.4 缓冲

![img](images/1683509501803-432efaf3-227a-488c-9751-67bdb8cbeb5e.png)

## 4.2 消息队列-Kafka

https://kafka.apache.org/documentation/ 

### 4.2.1 消息模式

![img](images/1682662791504-6cf21127-d9da-4602-a076-ae38c298f0ac.png)

### 4.2.2 Kafka工作原理

![img](images/1683170677428-6ffa28b6-d522-435f-9e50-20fe3ddfd024-20250323011221910.png)

### 4.2.3 SpringBoot整合

参照：https://docs.spring.io/spring-kafka/reference/

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

配置

```properties
spring.kafka.bootstrap-servers=192.168.200.116:9092
```

修改`C:\Windows\System32\drivers\etc\hosts`文件，配置`192.168.200.116 kafka`

### 4.2.4 消息发送

```java
@SpringBootTest
class Boot312ApplicationTests {

    @Autowired
    private KafkaTemplate kafkaTemplate;

    @Test
    void contextLoads() {
        StopWatch sw = new StopWatch();

        sw.start();
        CompletableFuture[] futures = new CompletableFuture[10000];
        for (int i = 0; i < 10000; i++) {
            CompletableFuture future = kafkaTemplate.send("news", "haha", "hello kafka");
            futures[i] = future;
        }
        CompletableFuture.allOf(futures).join();
        sw.stop();

        System.out.println("cost time:" + sw.getTotalTimeMillis());
    }

    @Test
    void send() {
        CompletableFuture future = kafkaTemplate.send("news", "person", new Person(1L, "张三", "aaa@qq.com"));
        future.join();
        System.out.println("消息发送成功！");
    }

}
```

### 4.2.5 消息监听

```java
@Component
public class MyTopicListener {
    // 默认仅监听消息队列最新的消息
    @KafkaListener(groupId = "group1", topics = "news")
    public void onMessage1(ConsumerRecord<Object, Object> record) {
        Object key = record.key();
        Object value = record.value();
        System.out.printf("MyTopicListener group1 接收到消息：key=%s,value=%s%n", key, value);
    }

    @KafkaListener(groupId = "group2", topicPartitions = {@TopicPartition(topic = "news",
            partitionOffsets = {@PartitionOffset(partition = "0", initialOffset = "0")})})
    public void onMessage2(ConsumerRecord<Object, Object> record) {
        Object key = record.key();
        Object value = record.value();
        System.out.printf("MyTopicListener group2 接收到消息：key=%s,value=%s%n", key, value);
    }
}

```

### 4.2.6 参数配置

- 消费者

```properties
spring.kafka.consumer.value-deserializer=org.springframework.kafka.support.serializer.JsonDeserializer
spring.kafka.consumer.properties[spring.json.value.default.type]=com.example.Invoice
spring.kafka.consumer.properties[spring.json.trusted.packages]=com.example.main,com.example.another
```

- 生产者

```properties
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.springframework.kafka.support.serializer.JsonSerializer
spring.kafka.producer.properties[spring.json.add.type.headers]=false
```



### 4.2.7 自动配置原理

kafka 自动配置在<span style="color:red;">`KafkaAutoConfiguration`</span>

1. 容器中放了 <span style="color:red;">`KafkaTemplate`</span> 可以进行消息收发

2. 容器中放了<span style="color:red;">`KafkaAdmin`</span> 可以进行 Kafka 的管理，比如创建 topic 等

3. kafka 的配置在 <span style="color:red;">`KafkaProperties`</span> 中

4. <span style="color:red;">`@EnableKafka`</span> 可以开启基于注解的模式（该注解默认启用了）

   `org.springframework.boot.autoconfigure.kafka.KafkaAnnotationDrivenConfiguration`

   ```java
   	@Configuration(proxyBeanMethods = false)
   	@EnableKafka
   	@ConditionalOnMissingBean(name = KafkaListenerConfigUtils.KAFKA_LISTENER_ANNOTATION_PROCESSOR_BEAN_NAME)
   	static class EnableKafkaConfiguration {
   
   	}
   ```



# 第5章 Web安全

- Apache Shiro

- Spring Security
- 自研：Filter

## Spring Security

## 5.1 安全架构

### 5.1.1 认证：Authentication

> who are you?
>
> 登录系统，用户系统。

### 5.1.2 授权：Authorization

> what are you allowed to do?
>
> 权限管理，用户授权

### 5.1.3 攻击防护

> - XSS （Cross-site scripting）
> - CSRF（Cross-site request forgery）
> - CORS（Cross-Origin Resource Sharing）
> - SQL注入
> - ……

### 扩展：权限模型

#### 1 RBAC（Role Based Access Controll）

> - 用户（t_user）
>   - id，username，password，xxx
>   - 1，zhangsan
>   - 2，lisi
> - 用户_角色（t_user_role）【N对N关系需要中间表】
>   - zhangsan，admin
>   - zhangsan，common_user
>   - lisi，hr
>   - lisi，common_user
> - 角色_权限（t_role_perm）
>   - admin，文件r
>   - admin，文件w
>   - admin，文件执行
>   - admin，订单query，create，xxx
>   - hr，文件r
> - 权限（t_permission）
>   - id，perm_id
>   - 文件r，w，x
>   - 订单query，create，xxx

#### 2 ACL（Access Controll List）

> 直接用户和权限挂钩
>
> - 用户（t_user）
>
>   - zhangsan
>   - lisi
>
> - 用户——权限（t_user_perm）
>
>   - zhangsan，文件r
>   - zhangsan，文件x
>   - zhangsan，订单query
>
> - 权限（t_permission）
>
>   - id，perm_id
>   - 文件r，w，x
>
>   - 订单query，create，xxx

```java
@Secured("文件 r")
public void readFile(){
    //读文件
}
```

## 5.2 Spring Security原理

### 5.2.1 过滤器链架构

> Spring Security利用 FilterChainProxy 封装一系列拦截器链，实现各种安全拦截功能
>
> Servlet三大组件：Servlet、Filter、Listener

![img](images/1682513527616-e1e9054a-9049-4005-8c92-86392f3012a2.png)

### 5.2.2 FilterChainProxy

![img](images/1682513900851-013516c0-b3d4-4a09-823a-e924a5fa8f2c.png)

### 5.2.3 SecurityFilterChain

![img](images/1683548784456-8c66fd8e-783e-4f89-b81f-d3f2771a3ef9.png)

## 5.3 使用

### 5.3.1 HttpSecurity

```java
@Configuration
@Order(SecurityProperties.BASIC_AUTH_ORDER - 10)
public class ApplicationConfigurerAdapter extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.antMatcher("/match1/**")
      .authorizeRequests()
        .antMatchers("/match1/user").hasRole("USER")
        .antMatchers("/match1/spam").hasRole("SPAM")
        .anyRequest().isAuthenticated();
  }
}
```

### 5.3.2 MethodSecurity

```java
@SpringBootApplication
@EnableGlobalMethodSecurity(securedEnabled = true)
public class SampleSecureApplication {
}

@Service
public class MyService {

  @Secured("ROLE_USER")
  public String secure() {
    return "Hello Security";
  }

}
```

### 核心

- WebSecurityConfigurerAdapter
- @EnableGlobalMethodSecurity：开启全局方法安全配置
  - @Secured
  - @Preauthorize
  - @PostAuthorize
- UserDetailService：去数据库查询用户详细信息的service（用户基本信息、用户角色、用户权限）

## 5.4 实战

### 5.4.1 引入依赖

```xml
    <dependencies>
        <!-- 定义三方包 beg -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.thymeleaf.extras</groupId>
            <artifactId>thymeleaf-extras-springsecurity6</artifactId>
        </dependency>

        <!--热启动功能-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <optional>true</optional><!--表示依赖不会传递-->
        </dependency>
        <!-- 定义三方包 end -->

        <!-- 定义二方包 beg -->
        <!-- 定义二方包 end -->


        <!-- 定义一方包 beg -->
        <!-- 定义一方包 end -->
    </dependencies>

```

### 5.4.2 页面

**index.html**

```xml
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
Welcome to the world of Spring Boot!
<hr>
<a th:href="@{/hello}">hello</a>
<a th:href="@{/world}">world</a>
<a th:href="@{/logout}">logout</a>
</body>
</html>
```

**login.html**

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Spring Security Example</title>
</head>
<body>
<div th:if="${param.error}">Invalid username and password.</div>
<div th:if="${param.logout}">You have been logged out.</div>
<form th:action="@{/login}" method="post">
    <div>
        <label> User Name : <input type="text" name="username"/> </label>
    </div>
    <div>
        <label> Password: <input type="password" name="password"/> </label>
    </div>
    <div><input type="submit" value="Sign In"/></div>
</form>
</body>
</html>
```

### 5.4.3 配置类

**Security配置**

```java
package com.coding.boot3.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

/**
 * 1、自定义请求授权规则：http.authorizeHttpRequests()
 * 2、自定义登录规则：http.formLogin()
 * 3、自定义用户信息查询规则：http.userDetailsService()
 * 4、开启方法级别的精确权限控制： @EnableMethodSecurity + @PreAuthorize("hasAuthority('world_exec')")
 */
@EnableMethodSecurity // 开启方法权限控制
@Configuration
public class AppSecurityConfiguration {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // 请求授权
        http.authorizeHttpRequests((requests) -> {
            requests.requestMatchers("/").permitAll() // 1、首页所有人都允许
//                    .requestMatchers("/admin/**").hasRole("ADMIN")
//                    .requestMatchers("/user/**").hasRole("USER")
                    .anyRequest().authenticated(); // 2、剩下的任意请求都需要认证（登录）
        });

        // 表单登录
        // 表单登录功能：开启默认表单登录功能；Spring Security提供默认登录页
        http.formLogin(formLogin -> {
            formLogin.loginPage("/login").permitAll(); // 3、自定义登录页面，并允许所有人访问
        });
        return http.build();
    }

    // 查询用户信息
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
//        return username -> {
//            if ("admin".equals(username)) {
//                return new User(
//                        "admin",
//                        "{noop}123456",
//                        AuthorityUtils.commaSeparatedStringToAuthorityList("ROLE_ADMIN"));
//            }
//            return null;
//        };

        // 一旦配置了passwordEncoder，则需要使用加密后的密码进行登录， {noop} 表示明文密码，不再可用  Encoded password does not look like BCrypt
        UserDetails zsDetails = User.withUsername("zs").password(passwordEncoder.encode("123456")).roles("admin", "hr").authorities("file_read", "file_write").build();
        UserDetails lsDetails = User.withUsername("ls").password("{noop}123456").roles("hr").authorities("file_read").build();
        UserDetails wwDetails = User.withUsername("ww").password(passwordEncoder.encode("123456")).roles("admin").authorities("file_write", "world_exec").build();
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager(zsDetails, lsDetails, wwDetails);
        return manager;
    }

    @Bean // 密码加密器
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

# 第6章 可观测性

> 可观测性 Observability

对线上应用进行观测、监控、预警…

- 健康状况【组件状态、存活状态】Health
- 运行指标【CPU、内存、垃圾回收、吞吐量、响应成功率】Metrics
- 链路追踪
- ……

## 6.1 SpringBoot Actuator

### 6.1.1 实战

**1 场景引入**

```xml
        <!--对微服务端点进行管理和配置监控，可观测性场景启动器，线上指标监控、运行状态监控-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
```

默认效果：

http://localhost:8080/actuator

![image-20250315190503822](images/image-20250315190503822.png)

**2 暴露指标**

```properties
# 定义端点的默认访问规则，是否允许访问；默认 true。目前已经启用，建议 management.endpoints.access.default
#management.endpoints.enabled-by-default=false
# 定义端点的默认访问规则，允许访问的限制；默认 只读访问。可选值 不允许访问、只读访问（会禁用掉 shutdown 等微信行为）和无限制访问
#management.endpoints.access.default=unrestricted
# 以web方式暴露所有监控端点
management.endpoints.web.exposure.include=*
```

**3 访问数据**

- [http://localhost:8080/actuator](http://localhost:8080/actuator/)；展示出所有可以用的监控端点
- http://localhost:8080/actuator/beans
- http://localhost:8080/actuator/configprops
- http://localhost:8080/actuator/metrics
- http://localhost:8080/actuator/metrics/jvm.gc.pause
- [http://localhost:8080/actuator/](http://localhost:8080/actuator/metrics)endpointName/detailPath

### 6.1.2 Endpoint

#### 1 常用端点

| ID                 | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| `auditevents`      | 暴露当前应用程序的审核事件信息。需要一个`AuditEventRepository组件`。 |
| `beans`            | 显示应用程序中所有Spring Bean的完整列表。                    |
| `caches`           | 暴露可用的缓存。                                             |
| `conditions`       | 显示自动配置的所有条件信息，包括匹配或不匹配的原因。         |
| `configprops`      | 显示所有`@ConfigurationProperties`。                         |
| `env`              | 暴露Spring的属性`ConfigurableEnvironment`                    |
| `flyway`           | 显示已应用的所有Flyway数据库迁移。 需要一个或多个`Flyway`组件。 |
| `health`           | 显示应用程序运行状况信息。                                   |
| `httptrace`        | 显示HTTP跟踪信息（默认情况下，最近100个HTTP请求-响应）。需要一个`HttpTraceRepository`组件。 |
| `info`             | 显示应用程序信息。                                           |
| `integrationgraph` | 显示Spring `integrationgraph` 。需要依赖`spring-integration-core`。 |
| `loggers`          | 显示和修改应用程序中日志的配置。                             |
| `liquibase`        | 显示已应用的所有Liquibase数据库迁移。需要一个或多个`Liquibase`组件。 |
| `metrics`          | 显示当前应用程序的“指标”信息。                               |
| `mappings`         | 显示所有`@RequestMapping`路径列表。                          |
| `scheduledtasks`   | 显示应用程序中的计划任务。                                   |
| `sessions`         | 允许从Spring Session支持的会话存储中检索和删除用户会话。需要使用Spring Session的基于Servlet的Web应用程序。 |
| `shutdown`         | 使应用程序正常关闭。默认禁用。                               |
| `startup`          | 显示由`ApplicationStartup`收集的启动步骤数据。需要使用`SpringApplication`进行配置`BufferingApplicationStartup`。 |
| `threaddump`       | 执行线程转储。                                               |
| `heapdump`         | 返回`hprof`堆转储文件。                                      |
| `jolokia`          | 通过HTTP暴露JMX bean（需要引入Jolokia，不适用于WebFlux）。需要引入依赖`jolokia-core`。 |
| `logfile`          | 返回日志文件的内容（如果已设置`logging.file.name`或`logging.file.path`属性）。支持使用HTTP`Range`标头来检索部分日志文件的内容。 |
| `prometheus`       | 以Prometheus服务器可以抓取的格式公开指标。需要依赖`micrometer-registry-prometheus`。 |

`threaddump`、`heapdump`、`metrics`

#### 2 定制端点

- 健康监控：返回存活、死亡

- 指标监控：次数、频率

##### HealthEndpoint

- 组件

```java
package com.coding.boot3.actuator.component;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class MyComponent {

    public int check() {
        // 业务代码判断这个组件是否应该是存活状态
        return new Random().nextInt(2);
    }
}

```

- 健康端点

```java
package com.coding.boot3.actuator.health;

import com.coding.boot3.actuator.component.MyComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.AbstractHealthIndicator;
import org.springframework.boot.actuate.health.Health;
import org.springframework.stereotype.Component;

/**
 * 1、实现 HealthIndicator 接口来定制组件的健康状态对象（Health）返回
 */
@Component
public class MyHealthIndicator extends AbstractHealthIndicator {

    @Autowired
    private MyComponent component;

    /**
     * 健康检查
     *
     * @param builder the {@link Health.Builder} to report health status and details
     */
    @Override
    protected void doHealthCheck(Health.Builder builder) {
        // 自定义检查方法
        int check = component.check();
        if (check == 0) {
            builder.up().withDetail("code", check).withDetail("msg", "活的很健康").withDetail("data", "我是MyComponent的监控状态").build();
        } else {
            builder.down().withDetail("code", check).withDetail("msg", "error service").withDetail("data", "我是MyComponent的监控状态")
//                    .withException(new RuntimeException())
                    .build();
        }
    }
}

```

- 配置

```properties
management.endpoint.health.access=read_only
# 总是显示详细信息。可显示每个模块的状态信息
management.endpoint.health.show-details=always
```

- 效果

http://localhost:8080/actuator/health/my

![image-20250316211809051](images/image-20250316211809051.png)

##### MetricsEndpoint

- 服务指标

```java
package com.coding.boot3.actuator.service;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

@Service
public class MyService {


    Counter counter;

    /**
     * 若类只有一个有参构造器，则有参构造器的参赛，默认从容器中获取
     *
     * @param meterRegistry - 注入 meterRegistry 来保存和统计所有指标
     */
    public MyService(MeterRegistry meterRegistry) {
        counter = meterRegistry.counter("myService.method.running.counter");
    }


    public void hello() {
        System.out.println("hello");
        counter.increment();
    }
}
```

- 控制器

```java
package com.coding.boot3.actuator.controller;

import com.coding.boot3.actuator.service.MyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @Autowired
    private MyService component;

    @GetMapping("/hello")
    public String hello() {
        // 业务调用
        component.hello();
        return "hello";
    }
}

```

- 效果

http://localhost:8080/actuator/metrics/myService.method.running.counter

![image-20250316211636482](images/image-20250316211636482.png)

## 6.2 监控案例落地

> 基于 Prometheus + Grafana
>
> ![img](images/1683607956768-13b9f5cb-30fc-42a2-9119-ec7570b921f0.png)

### 6.2.1 安装 Prometheus + Grafana

```bash
#安装prometheus:时序数据库
docker run -p 9090:9090 -d \
-v pc:/etc/prometheus \
prom/prometheus

#安装grafana；默认账号密码 admin:admin
docker run -d --name=grafana -p 3000:3000 grafana/grafana
```

### 6.2.2 导入依赖

- pom.xml

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-registry-prometheus</artifactId>
        </dependency>
```

- application.properties

```properties
management.endpoints.web.exposure.include=*
```

访问： http://localhost:8080/actuator/prometheus  验证，返回 prometheus 格式的所有指标

> 部署Java应用，为了避免端口冲突，端口调整为 9999

```bash
# 安装上传工具，Termius终端模拟器不支持ZMODEM协议，会导致卡主，建议直接使用scp或SFTP即可。
yum install lrzsz

# 安装openjdk
# 下载openjdk
wget -cP /usr/local/src/ https://download.oracle.com/otn/java/jdk/17.0.13+10/00d8a0bf05cc4f9087f2bb0f5191ea34/jdk-17.0.13_macos-aarch64_bin.tar.gz?AuthParam=1742139122_bdb4fa5687b00fdd34fe9b8ae544e1c5
# 安装openjdk
mkdir /usr/local/Java
tar -zxvf /usr/local/src/jdk-17.0.13_macos-aarch64_bin.tar.gz\?AuthParam\=1742139122_bdb4fa5687b00fdd34fe9b8ae544e1c5 -C /usr/local/Java/
ln -snf /usr/local/Java/jdk-17.0.13.jdk/ /usr/local/java

# 配置openjdk
sudo vim /etc/profile.d/jdk.sh
# 加入以下内容
export JAVA_HOME=/usr/local/java
export CLASSPATH=.:$JAVA_HOME/jre/lib/rt.jar:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export PATH=$JAVA_HOME/bin:$PATH

# 环境变量生效
source /etc/profile

# 后台启动java应用
nohup java -jar actuator.jar > output.log 2>&1 &

```

确认可以访问到： http://192.168.200.116:9999/actuator/prometheus

### 6.2.3 配置 Prometheus 拉去数据

```properties
## 修改 prometheus.yml 配置文件
scrape_configs:
  - job_name: 'spring-boot-demo'
    metrics_path: '/actuator/prometheus' #指定抓取的路径
    static_configs:
      - targets: ['192.168.200.116:9999']
        labels:
          nodename: 'app-demo'
```

> 注意：重启 Prometheus （docker restart prometheus） 
>
> 或执行 http://192.168.200.116:9090/-/reload （【API方式已废弃】使用POST/PUT方法）加载新的配置

重启后，访问 Prometheus：http://192.168.200.116:9090/targets 查看是否包含 spring-boot-demo

### 6.2.4 配置 Grafana 监控面板

- 添加数据源（Prometheus）
- 添加面板。可去 dashboard 市场找一个自己喜欢的面板，也可以自己开发面板；[Dashboards | Grafana Labs](https://grafana.com/grafana/dashboards/?plcmt=footer)

### 6.2.5 效果

![image-20250317010508820](images/image-20250317010508820.png)

# 第7章 AOT

## 7.1 AOT与JIT

<span style="color:#9400D3;font-weight:bold;">AOT</span>：Ahead-of-Time（提前编译）：**程序执行前**，全部被编译成**机器码**。

<span style="color:#9400D3;font-weight:bold;">JIT</span>：Just in Time（即时**编译**）：程序**边编译，边运行**。

**编译：**

- 源代码（.c、.cpp、.go、.java…），编译=====> 机器码

**语言：**

- 编译型语言：编译器
- 解释型语言：解释器

### 7.1.1 Compiler 与 Interpreter

Java：**半编译半解释**

https://anycodes.cn/editor

![img](images/1683766057952-6f218ecf-4d0a-44ee-a930-1fc7f19085db.png)

### 7.1.2 AOT与JIT对比

| 对比项                 | **编译器**                                         | **解释器**                                               |
| ---------------------- | -------------------------------------------------- | -------------------------------------------------------- |
| **机器执行速度**       | **快**，因为源代码只需被转换一次                   | **慢**，因为每行代码都需要被解释执行                     |
| **开发效率**           | **慢**，因为需要耗费大量时间编译                   | **快**，无需花费时间生成目标代码，更快的开发和测试       |
| **调试**               | **难以调试**编译器生成的目标代码                   | **容易调试**源代码，因为解释器一行一行地执行             |
| **可移植性（跨平台）** | 不同平台需要重新编译目标平台代码                   | 同一份源码可以跨平台执行，因为每个平台会开发对应的解释器 |
| **学习难度**           | 相对较高，需要了解源代码、编译器以及目标机器的知识 | 相对较低，无需了解机器的细节                             |
| **错误检查**           | 编译器可以在编译代码时检查错误                     | 解释器只能在执行代码时检查错误                           |
| **运行时增强**         | 无                                                 | 可以**动态增强**                                         |

在OpenJDK的官方Wiki上，介绍了HotSpot虚拟机一个相对比较全面的、**即时编译器（JIT）**中采用的[优化技术列表](https://wiki.openjdk.org/display/HotSpot/PerformanceTacticIndex)。

![img](images/1683773230399-b3fe0f68-f85a-4efb-bf38-d1783ea63d49.png)

![img](images/1683773247546-787b3fcf-ad8a-42d2-9a7b-2980eccff97d.png)

可使用：-XX:+PrintCompilation 打印JIT编译信息



### 7.1.3 JVM架构

.java === .class === 机器码

![img](images/1684124528903-feb1ce8f-302a-4872-a63d-ae5da99501eb.png)

**JVM**：既有**解释器**，又有**编译器（JIT：即时编译）**；



### 7.1.4 Java的执行过程

> 建议阅读：
>
> - 美团技术：https://tech.meituan.com/2020/10/22/java-jit-practice-in-meituan.html
>
> - openjdk官网：https://wiki.openjdk.org/display/HotSpot/Compiler

#### 1 流程概要

![img](images/1683774822566-f6860477-868e-4115-8ee9-7fe9d787e7a9.png)

解释执行：

编译执行：

#### 2 详细流程

热点代码：调用次数非常多的代码

![img](images/1684143084003-df41f505-f8d0-4ab9-a684-5c39037e8e30.png)

### 7.1.5 JVM编译器

JVM中集成了两种编译器，Client Compiler 和 Server Compiler；

- Client Compiler注重启动速度和局部的优化
- Server Compiler更加关注全局优化，性能更好，但由于会进行更多的全局分析，所以启动速度会慢。

Client Compiler：

- HotSpot VM带有一个Client Compiler **C1编译器**
- 这种编译器**启动速度快**，但是性能比较Server Compiler来说会差一些。
- 编译后的机器码执行效率没有C2的高

Server Compiler：

- Hotspot虚拟机中使用的Server Compiler有两种：**C2** 和 **Graal**。
- 在Hotspot VM中，默认的Server Compiler是**C2编译器。**

### 7.1.6 分层编译

Java 7开始引入了分层编译(**Tiered Compiler**)的概念，它结合了**C1**和**C2**的优势，追求启动速度和峰值性能的一个平衡。分层编译将JVM的执行状态分为了五个层次。**五个层级**分别是：

- 解释执行。
- 执行不带profiling的C1代码。
- 执行仅带方法调用次数以及循环回边执行次数profiling的C1代码。
- 执行带所有profiling的C1代码。
- 执行C2代码。

**profiling就是收集能够反映程序执行状态的数据**。其中最基本的统计数据就是方法的调用次数，以及循环回边的执行次数。

![img](images/1683775747739-e428b122-ace8-4b33-b860-6a6c7ea11abd.png)

- 图中第①条路径，代表编译的一般情况，**热点方法**从解释执行到被3层的C1编译，最后被4层的C2编译。
- 如果**方法比较小**（比如Java服务中常见的**getter/setter**方法），3层的profiling没有收集到有价值的数据，JVM就会断定该方法对于C1代码和C2代码的执行效率相同，就会执行图中第②条路径。在这种情况下，JVM会在3层编译之后，放弃进入C2编译，**直接选择用1层的C1编译运行**。
- 在**C1忙碌**的情况下，执行图中第③条路径，在解释执行过程中对程序进行**profiling** ，根据信息直接由第4层的**C2编译**。
- 前文提到C1中的执行效率是**1层>2层>3层**，**第3层**一般要比**第2层**慢35%以上，所以在**C2忙碌**的情况下，执行图中第④条路径。这时方法会被2层的C1编译，然后再被3层的C1编译，以减少方法在**3层**的执行时间。
- 如果**编译器**做了一些比较**激进的优化**，比如分支预测，在实际运行时**发现预测出错**，这时就会进行**反优化**，重新进入**解释执行**，图中第⑤条执行路径代表的就是**反优化**。

总的来说，C1的编译速度更快，C2的编译质量更高，分层编译的不同编译路径，也就是JVM根据当前服务的运行情况来寻找当前服务的最佳平衡点的一个过程。从JDK 8开始，JVM默认开启分层编译。

**云原生**：Cloud Native； Java小改版；



最好的效果：

存在的问题：

- java应用如果用jar，解释执行，热点代码才编译成机器码；初始启动速度慢，初始处理请求数量少。
- 大型云平台，要求每一种应用都必须秒级启动。每个应用都要求效率高。

希望的效果：

- java应用也能提前被编译成**机器码**，随时**急速启动**，一启动就急速运行，最高性能
- 编译成机器码的好处：

- 另外的服务器还需要安装Java环境
- 编译成**机器码**的，可以在这个平台 Windows X64 **直接运行**。

**原生**镜像：**native**-image（机器码、本地镜像）

- 把应用打包成能适配本机平台 的可执行文件（机器码、本地镜像）

## 7.2 GraalVM

https://www.graalvm.org/

> **GraalVM**是一个高性能的**JDK**，旨在**加速**用Java和其他JVM语言编写的**应用程序**的**执行**，同时还提供JavaScript、Python和许多其他流行语言的运行时。 
>
> **GraalVM**提供了**两种**运行**Java应用程序**的方式：
>
> - 1. 在HotSpot JVM上使用**Graal即时（JIT）编译器**
> - 2. 作为**预先编译（AOT）**的本机**可执行文件**运行（**本地镜像**）。
>
>  GraalVM的多语言能力使得在单个应用程序中混合多种编程语言成为可能，同时消除了外部语言调用的成本。

### 7.2.1 架构

![img](images/1683779334574-5040fa9c-d4cc-497a-aa2c-c937ccd2078d.png)

### 7.2.2 Mac 安装

> 跨平台提供原生镜像原理：

![img](images/1684149328177-6e1474c9-bec3-4b9a-afbe-b17b851f3ab1.png)

> 各个平台先决条件安装文档介绍：https://www.graalvm.org/latest/reference-manual/native-image/
>
> 其中Windows平台下需要安装 [Visual Studio 2022 version](https://visualstudio.microsoft.com/zh-hans/vs/) 17.6.0 or later,and Microsoft Visual C++(MSVC)。

#### 1 安装 GraavlVM

下载 GraalVM + native-image

![image-20250318163728563](images/image-20250318163728563.png)

1. 添加 GraalVM 的 Homebrew Tap：

```bash
% brew tap graalvm/tap
```

2. 安装 GraalVM（以 Java 17 为例）：

```bash
% brew install graalvm-ce-java17
```

3. 首次使用会收到警告，可以如下命令禁用警告

```bash
% xattr -r -d com.apple.quarantine "/Library/Java/JavaVirtualMachines/graalvm-ce-java17-22.3.1"
```

4. 验证

```bash
% /Library/Java/JavaVirtualMachines/graalvm-ce-java17-22.3.1/Contents/Home/bin/java -version
openjdk version "17.0.6" 2023-01-17
OpenJDK Runtime Environment GraalVM CE 22.3.1 (build 17.0.6+10-jvmci-22.3-b13)
OpenJDK 64-Bit Server VM GraalVM CE 22.3.1 (build 17.0.6+10-jvmci-22.3-b13, mixed mode, sharing)
```

5. 加入 jEnv 管理

```bash
% jenv add /Library/Java/JavaVirtualMachines/graalvm-ce-java17-22.3.1/Contents/Home       
graalvm64-17.0.6 added
17.0.6 added
 17.0 already present, skip installation
 17 already present, skip installation
```

6. 创建graalvm目录，并使用jenv设置改目录java版本

```bash
% mkdir graalvm
% jenv local 17.0.6
# 验证
% java -version
openjdk version "17.0.6" 2023-01-17
OpenJDK Runtime Environment GraalVM CE 22.3.1 (build 17.0.6+10-jvmci-22.3-b13)
OpenJDK 64-Bit Server VM GraalVM CE 22.3.1 (build 17.0.6+10-jvmci-22.3-b13, mixed mode, sharing)
```

7. 查看GraalVM工具链：

```bash
# 应列出已安装的 GraalVM 组件（如 Native Image）。
% gu list
ComponentId              Version             Component name                Stability                     Origin 
---------------------------------------------------------------------------------------------------------------------------------
graalvm                  22.3.1              GraalVM Core                  Experimental  
```

#### 2 安装 Native Image

- 先决条件

**Native Image 编译失败**：安装 Xcode 命令行工具

```bash
% xcode-select --install
```

GraalVM 的 Native Image 工具用于将 Java 应用编译为原生可执行文件：

```bash
% gu install native-image
```

#### 3 验证

```shell
$ native-image --version
zsh: command not found: native-image
$ source ~/.zshrc
% native-image --version
GraalVM 22.3.1 Java 17 CE (Java Version 17.0.6+10-jvmci-22.3-b13)
```

### 7.2.3 Mac 测试

#### 1 创建项目

- 创建普通java项目。编写HelloWorld类；

  - 使用`mvn clean package`进行打包

  - 确认jar包是否可以执行`java -jar xxx.jar`

  - 可能需要给 `MANIFEST.MF`添加 `Main-Class: 你的主类`

#### 2 编译镜像

- 编译为原生镜像（native-image）

```bash
% native-image -cp aot-normal.jar com.coding.boot3.aot.normal.MainApplication -o Haha
```

![image-20250318183656341](images/image-20250318183656341.png)

> 也可以直接指定类路径：
>
> ```bash
> % native-image -cp /Users/wenqiu/IdeaProjects/backend-spring-learning/spring-boot-3.x/boot3-15-aot-normal/target/classes com.coding.boot3.aot.normal.MainApplication -o Hehe
> ```

### 7.2.4 Linux平台安装与测试

#### 1 安装gcc等环境

```shell
% sudo dnf install gcc glibc-devel zlib-devel
```

#### 2 安装GraalVM

- 下载：https://www.graalvm.org/downloads/
- 安装：GraalVM、native-image
- 配置：JAVA环境变量为GraalVM

```shell
# 下载
$ wget -cP /usr/local/src/ https://download.oracle.com/otn/utilities_drivers/oracle-labs/graalvm-jdk-17.0.14_linux-aarch64_bin.tar.gz?AuthParam=1742305789_d444dbf2d812480c2f16ffe6c7c01bb5
# 安装
$ mkdir /usr/local/Java
$ tar -zxvf /usr/local/src/graalvm-jdk-17.0.14_linux-aarch64_bin.tar.gz\?AuthParam\=1742305789_d444dbf2d812480c2f16ffe6c7c01bb5 -C /usr/local/Java/
$ ln -snf /usr/local/Java/graalvm-jdk-17.0.14+8.1/ /usr/local/java

# 配置openjdk
sudo vim /etc/profile.d/jdk.sh
# 加入以下内容
export JAVA_HOME=/usr/local/java
export CLASSPATH=.:$JAVA_HOME/jre/lib/rt.jar:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export PATH=$JAVA_HOME/bin:$PATH

# 环境变量生效
source /etc/profile
```

#### 3 安装native-image

```shell
$ gu install native-image
```

![image-20250318220309021](images/image-20250318220309021.png)

#### 4 编译为原生程序

使用native-image编译jar为原生程序

```shell
$ native-image -cp aot-normal.jar com.coding.boot3.aot.normal.MainApplication -o Haha
```

![image-20250318220222222](images/image-20250318220222222.png)

## 7.3 SpringBoot整合

### 7.3.1 依赖导入

```xml
    <build>
        <finalName>aot-springboot</finalName>
        <plugins>
            <plugin>
                <groupId>org.graalvm.buildtools</groupId>
                <artifactId>native-maven-plugin</artifactId>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

```

### 7.3.2 生成native-image

1、运行aot提前处理命令：

```bash
% mvn clean compile spring-boot:process-aot
```

2、运行native打包： （备注：`mvn native:build` 已经过时了）

```bash
% mvn native:compile-no-fork -Pnative
```

> [WARNING] 'native:build' goal is deprecated. Use 'native:compile-no-fork' instead.



# 响应式编程篇

![image-20250319065628566](images/image-20250319065628566.png)

# 第1章 Reactor核心

## 1.1 前置知识

### 1.1.1 Lambda

Java8语法糖：

```java
package com.coding.reactor.stream.lambda;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

// 函数式接口：只要是函数式接口就可以用Lambda表达式简化
// 函数式接口，接口中有且只有一个未实现的方法，这个接口就叫函数式接口
@FunctionalInterface
interface MyInterface {
    int sum(int i, int j);
}

@FunctionalInterface // 检查注解，帮我们快速检查我们写的接口是否是函数式接口
interface MyHaha {
    default void haha() {
    }

    void haha2();
}

// 1、自己写实现类
class MyInterfaceImpl implements MyInterface {
    @Override
    public int sum(int i, int j) {
        return i + j;
    }
}

public class Lambda {

    /**
     * Lambda简化函数式接口
     *
     * @param args
     */
    public static void simplifiedFunctionalInterface(String[] args) {
        // 1.自己创建实现类对象
        MyInterface myInterface = new MyInterfaceImpl();
        System.out.println(myInterface.sum(1, 2));

        // 2.创建匿名实现类
        MyInterface myInterface2 = new MyInterface() {
            @Override
            public int sum(int i, int j) {
                return i * i + j * j;
            }
        };
        System.out.println(myInterface2.sum(1, 2));

        // 3.使用lambda表达式
        MyInterface myInterface3 = (i, j) -> i * i + j * j;
        System.out.println(myInterface3.sum(1, 2));
    }

    public static void main(String[] args) {
        var names = new ArrayList<String>();
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");
        names.add("David");
        names.sort(new Comparator<String>() {
            @Override
            public int compare(String o1, String o2) {
                return o1.compareTo(o2);
            }
        }); // 正序
        // 直接写函数式接口
        names.sort((o1, o2) -> o2.compareTo(o1)); // 倒序
        // 调用工具方法逆向排序
        names.sort(Comparator.naturalOrder()); // 正序
        names.sort(Comparator.reverseOrder()); // 正序
        // 类::方法；引用类中的实例方法
        names.sort(String::compareTo); // 正序

        System.out.println(names);

        // ==================================================华丽的分割线==================================================

        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("Hello，问秋！");
            }
        }).start();
        new Thread(() -> System.out.println("Hello，问秋！")).start();
    }
}

```



### 1.1.2 Function

函数式接口的出入参定义：

1. 有入参，无出参【**消费者**】：function.accept

```java
        BiConsumer<String, String> consumer = (a, b) -> {
            System.out.println("哈哈：" + a + "；呵呵：" + b);
        };
        consumer.accept("1", "2");
```

2. 有入参，有出参【**多功能函数**】：function.apply

```java
        Function<String, Integer> function = Integer::parseInt;
        System.out.println(function.apply("123"));
```

3. 无入参，无出参【**普通函数**】：

```java
        Runnable runnable = () -> System.out.println("runnable");
        new Thread(runnable).start();
```

4. 无入参，有出参【**提供者**】：supplier.get()

```java
        Supplier<String> supplier = () -> UUID.randomUUID().toString();
        System.out.println(supplier.get());
```

java.util.function包下的所有function定义：

- Consumer： 消费者
- Supplier： 提供者
- Predicate： 断言

get/test/apply/accept调用的函数方法；

#### 内置Function

https://blog.csdn.net/TianKongShuLovey/article/details/144897367

| BiConsumer                                                | IntBinayOperator     | ObjDoubleConsumer                                          |
| --------------------------------------------------------- | -------------------- | ---------------------------------------------------------- |
| BiFunction                                                | IntConsumer          | ObjIntConsumer                                             |
| BinaryOperator                                            | IntFunction          | ObjLongConsumer                                            |
| BiPredicate                                               | IntPredicate         | <span style="color:red;font-weight:bold;">Predicate</span> |
| BooleanSupplier                                           | IntSupplier          | <span style="color:red;font-weight:bold;">Supplier</span>  |
| <span style="color:red;font-weight:bold;">Consumer</span> | IntToDoubleFunction  | ToDoubleBiFunction                                         |
| DoubleBinaryOperator                                      | IntToLongFunction    | ToDoubleFunction                                           |
| DoubleConsumer                                            | IntUnaryOperator     | ToIntBiFunction                                            |
| DoubleFunction                                            | LongBinaryOperator   | ToIntFunction                                              |
| DoublePredicate                                           | LongConsumer         | ToLongBiFunction                                           |
| DoubleSupplier                                            | LongFunction         | ToLongFunction                                             |
| DoubleToIntFunction                                       | LongFunction         | UnaryOperator                                              |
| DoubleToLongFunc#                                         | LongPredicate        |                                                            |
| DoubleUnaryOperator                                       | LongSupplier         |                                                            |
| <span style="color:red;font-weight:bold;">Function</span> | LongToDoubleFunction |                                                            |
|                                                           | LongToIntFunction    |                                                            |
|                                                           | LongUnaryOperator    |                                                            |

### 1.1.3 StreamAPI

<img src="./images/image-20250320133131528.png" alt="image-20250320133131528" style="zoom:50%;" />

最佳实战：以后凡是你写for循环处理数据的统一全部用StreamAPI进行替换；

Stream所有数据和操作被组合成流管道：

- 一个数据源（可以是一个数组、集合、生成器函数、I/O管道）
- 零或多个中间操作（将一个流变形成另一个流）
- 一个终止操作（产生最终结果）

#### 创建流

- Stream.of(1, 2, 3);
- Stream.builder().add("11").add("22").build();
- Stream.empty();
- Stream.generate(() -> 1).limit(10);
- Stream.concat(Stream.of(4, 5, 6), integerStream);
- Stream.iterate(0, i -> i + 2).limit(10);

- Stream.ofNullable("给定一个元素，该元素可为null");

#### 中间操作：Intermediate Operations

- filter：过滤；挑出我们用的元素
- map：映射；一一映射，a变成b
  - mapToInt、mapToLong、mapToDouble
- flatMap：打散、散列、展开、扩维：一对多映射

```java
filter、
map、mapToInt、mapToLong、mapToDouble
flatMap、flatMapToInt、flatMapToLong、flatMapToDouble
mapMulti、mapMultiToInt、mapMultiToLong、mapMultiToDouble、
parallel、unordered、onClose、sequential
distinct、sorted、peek、limit、skip、takeWhile、dropWhile、
```

#### 终止操作：Terminal Operations

```java
forEach、forEachOrdered、toArray、reduce、collect、toList、min、
max、count、anyMatch、allMatch、noneMatch、findFirst、findAny、iterator
```

### 1.1.4 Reactive-Streams

#### 1 标准和规范

https://www.reactive-streams.org/

响应式宣言：  https://reactivemanifesto.org/

响应式宣言中文版： https://reactivemanifesto.org/zh-CN

**Reactive Streams是JVM面向流的库的**<span style="color:red;font-weight:bold;">标准和规范</span>

1. 处理可能无限数量的元素
2. 有序
3. 在组件之间异步传递元素
4. 强制性**非阻塞**、**背压模式**

![img](images/reactive-traits-zh-cn.svg)

基于异步、消息驱动的全事件回调系统：响应式系统。

<span style="color:#FFD700;font-weight:bold;font-size:18px;">引入一个缓冲区，引入消息队列，就能实现全系统、全异步、不阻塞、不等待、实时响应</span>

<img src="./images/1700230458143-d5a32c94-40e6-4494-9572-df4fd5c65fd9.png" alt="img" style="zoom:180%;" />

#### 2 API Components

1. <span style="color:red;font-weight:bold;">Publisher：发布者</span>产生数据流

2. <span style="color:red;font-weight:bold;">Subscriber：订阅者</span>消费数据流

3. <span style="color:red;font-weight:bold;">Subscription：订阅关系</span>
   1. 订阅关系是发布者和订阅者之间的关键接口。订阅者通过订阅来表示对发布者产生的数据的兴趣。订阅者可以请求一定数量的元素，也可以取消订阅。

4. <span style="color:red;font-weight:bold;">Processor：处理器</span>
   1. 处理器是同时实现了发布者和订阅者接口的组件。它可以接收来自一个发布者的数据，进行处理，并将结果发布给下一个订阅者。处理器在Reactor中充当中间环节，<span style="color:#1E90FF;font-weight:bold;">代表一个处理阶段</span>，允许你在数据流中进行转换、过滤和其他操作。

这种模型遵循 Reactive Streams 规范，确保了异步流的一致性和可靠性。

<img src="./images/image-20250321222659174.png" alt="image-20250321222659174" style="zoom:50%;" />

#### 3 响应式编程：

1. 底层：基于数据缓冲队列 + 消息驱动模型 + 异步回调机制
2. 编码：流式编程 + 链式调用 + 声明式API

3. 效果：优雅全异步 + 消息实时处理 + 高吞吐量 + 占用少量资源

<span style="color:red;font-weight:bold;">使用少量资源处理大量并发的一种解决方案。</span>

#### 4 响应式编程解决的痛点

以前：要做一个高并发系统：缓存、异步、排队；**手动控制整个逻辑**。

现在：**全自动控制整个逻辑**，开发者只需要组装好数据处理流水线即可。

> 高并发：缓存、异步、队排好
>
> 高可用：分片、复制、选领导

非阻塞的原理：缓冲 + 回调

少量线程一直运行 > 大量线程切换等待

## 1.2 Reactor（3.7.4版）

官网：https://projectreactor.io

Reactor是基于 Reactive Streams 的第四代响应式库规范，用于在JVM上构建非阻塞应用程序；

### 1.2.0 响应式编程模型

<img src="./images/image-20250323151954072.png" alt="image-20250323151954072" style="zoom:50%;" />

主要概念：

- 发布者（Publisher）
- 订阅者（Subscriber）
- 订阅关系（Subscription）
- 处理器（Processor）
- 调度器（Scheduler）
- 事件/信号（event/signal）
- 序列/流（sequence/stream）
- 元素（element/item）
- 操作符（operator）



### 1.2.1 快速上手

#### 介绍

Reactor是一个用于JVM的完全非阻塞的响应式编程框架，具备高效的需求管理（即对”背压（backpressure）“的控制）能力。它与Java8函数式API直接集成，比如<span style="color:#FF1493;">CompletableFuture</span>，<span style="color:#FF1493;">Stream</span>以及<span style="color:#FF1493;">Duration</span>。它提供了异步序列API <span style="color:#FF1493;">Flux</span>（用于[N]个元素）和<span style="color:#FF1493;">Mono</span>（用于[0|1]个元素），并完全遵循和实现了“响应式扩展规范”（Reactive Extensions Specification）。

Reactor的 <span style="color:#FF1493;">reactor-ipc</span> 组件还支持非阻塞的进程间通信（inter-process communication，IPC）。Reactor IPC为HTTP（包括Websockets）、TCP和UDP提供了支持背压的网络引擎，从而适合应用于微服务架构。并且完整支持响应式编解码（reactive encoding and decoding）。

#### 依赖定义

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>io.projectreactor</groupId>
            <artifactId>reactor-bom</artifactId>
            <version>2024.0.4</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

#### 依赖引用

```xml
<dependencies>
    <dependency>
        <groupId>io.projectreactor</groupId>
        <artifactId>reactor-core</artifactId>

    </dependency>
    <dependency>
        <groupId>io.projectreactor</groupId>
        <artifactId>reactor-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 1.2.2 响应式编程

> 响应式编程是一种关注于**数据流（data streams）**和**变化传递（propagation of change）**的**异步编程**方式。
>
> 这意味着它可以用既有的编程语言表达静态（如数组）或动态（如事件源）的数据流。

了解历史：

- 在响应式编程方面，微软跨出了第一步，它在 .NET 生态中创建了响应式扩展库（Reactive Extensions library，Rx）。接着 RxJava 在JVM上实现了响应式编程。后来，在 JVM 平台出现了一套标准的响应式编程规范，它定义了一系列标准接口和交互规范。并整合到 Java 9 中（使用<span style="color:#FF1493;font-weight:bold;">Flow</span>类）。
- 响应式编程通常作为面向对象编程中的“观察者模式”（Observer design pattern）的一种扩展。响应式流（reactive streams）与“迭代子模式”（Iterator design pattern）也有相通之处，因为其中也有<span style="color:#FF1493;">Iterable-Iterator</span>这样的对应关系。主要的区别在于，Iterator是基于“拉取”（pull）方式的，而响应式流是基于“推送”（push）方式的。
- 使用 iterator 是一种“命令式”（imperative）编程范式，即使访问元素的方法是 <span style="color:#FF1493;">Iterable</span> 的唯一职责。关键在于，什么时候执行 <span style="color:#FF1493;">next()</span> 获取元素取决于开发者。在响应式流中，相对应的角色是 <span style="color:#FF1493;">Publisher-Subscriber</span>，但是当有新的值到来的时候，却反过来由发布者（Publisher）通知订阅者（Subscriber），这种“推送”模式是响应式的关键。此外，对推送来的数据的操作是通过一种声明式（declaratively）而不是命令式（imperatively）的方式表达的：开发者表达计算的逻辑，而不是描述其确切的控制流。。
- 除了数据推送，对错误处理（error handling）和完成（completion）信号的定义也很完善。一个 <span style="color:#FF1493;">Publisher</span> 可以推送新的值到它的 <span style="color:#FF1493;">Subscriber</span> （调用 <span style="color:#FF1493;">onNext</span> 方法），同样也可以推送错误（调用 <span style="color:#FF1493;">onError</span> 方法）和完成（调用 <span style="color:#FF1493;">onComplete</span> 方法）信号。错误和完成信号都可以终止响应式流。可以用下边的表达式描述：

```R
onNext x 0..N [onError | onComplete]
```

这种方法非常灵活。该模式支持没有值、一个值或 n 个值（包括无限的值序列，例如时钟的连续滴答声）的用例。

但是，为什么我们首先需要这样一个异步响应式库呢？

#### 1 阻塞是对资源的浪费

现代应用需要**应对大量的并发用户**，而且即使现代硬件的处理能力飞速发展，**软件性能仍然是关键问题**。

广义来说我们有两种思路来提升程序性能：

1. **并行化（parallelize）**：使用更多的线程和硬件资源。【异步】
2. **寻求提高**当前资源使用效率。

通常，Java开发者使用阻塞式（blocking）编写代码。这没有问题，在出现性能瓶颈后，我们可以增加处理线程，线程中同样是阻塞的代码。但是这种使用资源的方式会迅速面临资源竞争和并发问题。

更糟糕的是，阻塞会浪费资源。具体来说，比如当一个程序面临延迟（通常是I/O方面，比如数据库读写请求或网络调用），所在线程需要进入 idle 状态等待数据，从而浪费资源。

所以，并行化方式并非银弹。这是挖掘硬件潜力的方式，但是却带来了复杂性，而且容易造成浪费。

#### 2 异步可以解决问题吗？

第二种思路——提高执行效率——可以解决资源浪费问题。通过编写 *异步非阻塞* 的代码，（任务发起异步调用后）执行过程会切换到另一个 **使用同样底层资源** 的活跃任务，然后等异步调用返回结果再去处理。

但是在 JVM 上如何编写异步代码呢？Java 提供了两种异步编程方式：

- **回调（Callbacks）**：异步方法没有返回值，而是采用一个 <span style="color:#FF1493;">callback</span> 作为参数（lambda或匿名类），当结果出来后回调这个 <span style="color:#FF1493;">callback</span>。常见的例子比如 Swings 的 <span style="color:#FF1493;">EventListener</span>。
- **Futures**：异步方法**立即**返回一个 <span style="color:#FF1493;">`Future<T>`</span>，该异步方法要返回结果的是 <span style="color:#FF1493;">T</span> 类型，通过 <span style="color:#FF1493;">Future</span> 封装。这个结果并不是 *立即* 可以拿到，而是等实际处理结束才可用。比如，<span style="color:#FF1493;">ExecutorService</span> 执行 <span style="color:#FF1493;">`Callable<T>`</span> 任务时会返回 <span style="color:#FF1493;">Future</span> 对象。

这些技术够用吗？并非对于每个用例都是如此，两种方式都有局限性。

回调很难组合起来，因为很快就会导致代码难以理解和维护（即所谓的“回调地狱（callback hell）”）。

考虑这样一种情景：

- 在用户界面上显示用户的5个收藏，或者如果没有任何收藏提供5个建议。
- 这需要3个服务（一个提供收藏的ID列表，第二个服务获取收藏内容，第三个提供建议内容）：

回调地狱（Callback Hell）的例子：

```java
userService.getFavorites(userId, new Callback<List<String>>() {
  public void onSuccess(List<String> list) {
    if (list.isEmpty()) {
      suggestionService.getSuggestions(new Callback<List<Favorite>>() {
        public void onSuccess(List<Favorite> list) {
          UiUtils.submitOnUiThread(() -> {
            list.stream()
                .limit(5)
                .forEach(uiList::show);
            });
        }

        public void onError(Throwable error) {
          UiUtils.errorPopup(error);
        }
      });
    } else {
      list.stream()
          .limit(5)
          .forEach(favId -> favoriteService.getDetails(favId,
            new Callback<Favorite>() {
              public void onSuccess(Favorite details) {
                UiUtils.submitOnUiThread(() -> uiList.show(details));
              }

              public void onError(Throwable error) {
                UiUtils.errorPopup(error);
              }
            }
          ));
    }
  }

  public void onError(Throwable error) {
    UiUtils.errorPopup(error);
  }
});
```

Reactor改造后为：

```java
userService.getFavorites(userId)
           .flatMap(favoriteService::getDetails)
           .switchIfEmpty(suggestionService.getSuggestions())
           .take(5)
           .publishOn(UiUtils.uiThreadScheduler())
           .subscribe(uiList::show, UiUtils::errorPopup);
```

​	如果你想确保“收藏的ID”的数据在 800ms 内获得（如果超时，从缓存中获取）呢？在基于回调的代码中，会比较复杂。但 Reactor 中就很简单，在处理链中增加一个 <span style="color:#FF1493;">timeout</span> 的操作符即可。

```java
userService.getFavorites(userId)
           .timeout(Duration.ofMillis(800))
           .onErrorResume(cacheService.cachedFavoritesFor(userId))
           .flatMap(favoriteService::getDetails)
           .switchIfEmpty(suggestionService.getSuggestions())
           .take(5)
           .publishOn(UiUtils.uiThreadScheduler())
           .subscribe(uiList::show, UiUtils::errorPopup);
```

> 额外扩展：
>
> Futures比回调要好一点，但即使在 Java 8 引入了 <span style="color:#FF1493;">CompletableFuture</span>，它对于多个处理的组合仍不够好用。编排多个Futures是可行的，但却不易。此外，<span style="color:#FF1493;">Future</span> 还有一个问题：当对 <span style="color:#FF1493;">Future</span> Future对象最终调用 <span style="color:#FF1493;">get()</span> 方法时，仍然会导致阻塞，并且缺乏对多个值以及更进一步对错误的处理。
>
> 考虑另外一个例子，我们首先得到 ID 的列表，然后通过它进一步获取到“对应的 name 和 statistics”为元素的列表，整个过程用异步方式来实现。
>
> <span style="color:#FF1493;">CompletableFuture</span> 处理组合的例子。

```java
CompletableFuture<List<String>> ids = ifhIds();

CompletableFuture<List<String>> result = ids.thenComposeAsync(l -> {
	Stream<CompletableFuture<String>> zip =
			l.stream().map(i -> {
				CompletableFuture<String> nameTask = ifhName(i);
				CompletableFuture<Integer> statTask = ifhStat(i);

				return nameTask.thenCombineAsync(statTask, (name, stat) -> "Name " + name + " has stats " + stat);
			});
	List<CompletableFuture<String>> combinationList = zip.collect(Collectors.toList());
	CompletableFuture<String>[] combinationArray = combinationList.toArray(new CompletableFuture[combinationList.size()]);

	CompletableFuture<Void> allDone = CompletableFuture.allOf(combinationArray);
	return allDone.thenApply(v -> combinationList.stream()
			.map(CompletableFuture::join)
			.collect(Collectors.toList()));
});

List<String> results = result.join();
assertThat(results).contains(
		"Name NameJoe has stats 103",
		"Name NameBart has stats 104",
		"Name NameHenry has stats 105",
		"Name NameNicole has stats 106",
		"Name NameABSLAJNFOAJNFOANFANSF has stats 121");
```

​	由于 Reactor 具有更多开箱即用的组合运算符，因此可以简化此过程，如下所示：

​	与 future 代码等效的 Reactor 代码示例

```java
Flux<String> ids = ifhrIds();

Flux<String> combinations =
		ids.flatMap(id -> {
			Mono<String> nameTask = ifhrName(id);
			Mono<Integer> statTask = ifhrStat(id);

			return nameTask.zipWith(statTask,
					(name, stat) -> "Name " + name + " has stats " + stat);
		});

Mono<List<String>> result = combinations.collectList();

List<String> results = result.block();
assertThat(results).containsExactly(
		"Name NameJoe has stats 103",
		"Name NameBart has stats 104",
		"Name NameHenry has stats 105",
		"Name NameNicole has stats 106",
		"Name NameABSLAJNFOAJNFOANFANSF has stats 121"
);
```

#### 3 从命令式编程到响应式编程

​	类似 Reactor 这样的响应式库的目标就是要弥补上述“经典”的JVM异步方式所带来的不足，此外还会关注以下几个方面：

- **可编排性（Composability）**以及**可读性（Readability）**
- 数据作为**流** ，使用丰富的**运算符**词汇进行作。
- 在**订阅（Subscriber）**之前什么都不会发生
- **背压（Backpressure）**具体来说即 *消费者能够反向告知生产者生产内容的速度的能力*
- **高层次**（同时也是有高价值的）抽象，从而达到 *并发无关* 的效果

##### 1 可编排性与可读性

​	可编排性，指的是编排多个异步任务的能力。比如我们将前一个任务的结果传递给后一个任务作为输入，或者将多个任务以分解再汇总（fork-join）的形式执行，或者将异步的任务作为离散的组件在系统中进行重用。

​	这种编排任务的能力与代码的可读性和可维护性是紧密相关的。随着异步处理任务数量和复杂度的提高，编写和阅读代码都变得越来越困难。就像我们刚才看到的，回调模式是简单的，但是缺点是在复杂的处理逻辑中，回调中会层层嵌入回调，导致**回调地狱（Callback Hell）**。你能猜到（或有过这种痛苦经历），这样的代码是难以阅读和分析的。

​	Reactor提供了丰富的编排操作，从而代码直观反映了处理流程，并且所有的操作保持在同一层次（尽量避免了嵌套）。

##### 2 就像装配流水线

​	你可以想象数据在响应式应用中的处理，就像流过一条装配流水线。Reactor既是传送带，又是一个个的装配工或机器人。原材料从源头（最初的Publisher）流出，最终被加工为成品，等待被推送到消费者（或者说Subscriber）。

​	原材料会经过不同的中间处理过程，或者作为半成品与其他半成品进行组装。如果某处有齿轮卡主，或者某件产品的包装过程花费了太久时间，相应的工位就可以向上游发出信号来限制或停止发出原材料。

##### 3 操作符（Operators）

​	在 Reactor 中，操作符（operator）就像装配线中的工位（操作员或装配机器人）。<span style="color:red;font-weight:bold;">每一个操作符对Publisher进行相应的处理，然后将Publisher包装为一个新的Publisher。</span>就像一个链条，数据源自第一个Publisher，然后顺链条而下，在每个环节进行相应的处理。<span style="color:red;font-weight:bold;">最终，一个订阅者（Subscriber）终结这个过程。</span>请记住，<span style="color:red;font-weight:bold;">在订阅者（Subscriber）订阅（subscribe）到一个发布者（Publisher）之前，什么都不会发生。</span>

> 理解了操作符会创建新的 <span style="color:#FF1493;">Publisher</span> 实例这一点，能够帮助你避免一个常见的问题，这种问题会让你觉得处理链上的某个操作符没有起作用。

​	虽然响应式流规范（Reactive Streams specification）没有规定任何操作符，类似 Reactor 这样的响应式库所带来的最大附加价值之一就是提供丰富的操作符。包括基础的转换操作，到过滤操作，甚至复杂的编排和错误处理操作。

##### 4 subscribe()之前什么都不会发生

​	在 Reactor 中，当你创建了一条 Publisher 处理链，数据还不会开始生成。事实上，你是创建了一种抽象的对于异步处理流程的描述（从而方便重用和组装。

​	当真正“订阅（subscribe）”的时候，你需要 Publisher 关联到一个 Subscriber，然后才会触发整个链的流动。这时候，Subscriber 会向上游发送一个request信号，一直到达源头的Publisher。



##### 5 背压

​	向上游传递信号这一点也被用于实现 **背压**，就像在装配线上，某个工位的处理速度如果慢于流水线速度，会对上游发送反馈信号一样。

​	在响应式流规范中实际定义的机制同刚才的类比非常接近：订阅者可以无限接受数据并让它的源头“满负荷”推送所有的数据，也可以通过使用 <span style="color:#FF1493;">request</span> 机制来告知源头它一次最多能够处理 <span style="color:#FF1493;">n</span> 个元素。

​	中间环节的操作也可以影响 <span style="color:#FF1493;">request</span>。想象一个能够将每10个元素分批打包的缓存（<span style="color:#FF1493;">buffer</span>）操作。如果订阅者请求一个元素，那么对于源头来说可以生成10个元素。此外预取策略也可以使用了，比如在订阅前预先生成元素。

​	**这样能够将“推送”模式转换为“推送+拉取”混合的模式，如果下游准备好了，可以从上游拉取n个元素；但是如果上游元素还没有准备好，下游还是要等待上游的推送。**



##### 6 热（Hot） vs 冷（Cold）

​	在 Rx 价值的响应式库中，响应式流分为“热”和“冷”两种模型，区别主要在于响应式流如何对订阅者进行响应：

- 一个“冷”的序列，指对于每一个 <span style="color:#FF1493;">Subscriber</span>，都会收到从头开始所有的数据。如果源头生成了一个 HTTP 请求，对于每一个订阅都会创建一个新的 HTTP 请求。
- 一个“热”的序列，指对于一个<span style="color:#FF1493;">Subscriber</span>，只能获取从它开始订阅之后发出的数据。不过注意，有些“热”的响应式流可以缓存部分或全部历史数据。通常意义上来说，一个“热”的响应式流，甚至在即使没有订阅者接收数据的情况下，也可以发出数据（这一点同“<span style="color:#FF1493;">Subscribe()</span>之前什么都不会发生”的规则有冲突）。

### 1.2.3 Reactor 核心特性

​	反应器项目的主要工件是 `reactor-core` ，这是一个专注于反应式流规范并针对 Java 8 的响应式库。

​	反应器引入了可组合的响应式类型，这些类型实现了 `Publisher` ，同时也提供了一套丰富的操作符： `Flux` 和 `Mono` 。一个 `Flux` 对象代表一个 0..N 个元素的响应式序列，而一个 `Mono` 对象代表一个单值或空（0..1）的结果。

​	这种区分将一些语义信息引入到类型中，表示异步处理的粗略基数。例如，HTTP 请求只产生一个响应，因此进行 `count` 操作没有太多意义。将此类 HTTP 调用的结果表示为 `Mono<HttpResponse>` 比表示为 `Flux<HttpResponse>` 更有意义，因为后者只提供与零项或单项上下文相关的操作符。

​	改变处理最大基数的操作符也会切换到相关类型。例如， `count` 操作符存在于 `Flux` 中，但它返回一个 `Mono<Long>` 。

#### 1 0-N 个项目的异步序列：Flux

​	以下图片显示了如何将 `Flux` 转换项目：

![Flux](images/flux.svg)

​	`Flux<T>` 是一个标准 `Publisher<T>` ，表示从 0 到 N 个发射项的非同步序列，可以选择以完成信号或错误结束。与反应流规范一样，这三种类型的信号转换为对下游订阅者的 `onNext` 、 `onComplete` 和 `onError` 方法的调用。

​	在这个广泛的信号范围内， `Flux` 是一种通用反应类型。请注意，所有事件，即使是终止事件，都是可选的：没有 `onNext` 事件但有一个 `onComplete` 事件表示一个空的有限序列，但移除 `onComplete` ，你将得到一个无限空的序列（除了测试取消之外，并不特别有用）。同样，无限序列不一定是空的。例如， `Flux.interval(Duration)` 产生一个 `Flux<Long>` ，它是无限的，并从时钟中发出定期的滴答声。

#### 2 0-1 个结果的异步：Mono

​	以下图片展示了 `Mono` 如何转换一个项目：

![Mono](images/mono.svg)

​	`Mono<T>` 是一种特殊的 `Publisher<T>` ，通过 `onNext` 信号最多发射一个项目，然后以 `onComplete` 信号（成功 `Mono` ，无论是否有值）或仅发射一个 `onError` 信号（失败 `Mono` ）终止。

​	大多数 `Mono` 实现都预期在调用 `onNext` 后立即在其 `Subscriber` 上调用 `onComplete` 。 `Mono.never()` 是一个例外：它不发射任何信号，虽然技术上并非禁止，但除了测试之外并不十分有用。另一方面， `onNext` 和 `onError` 的组合是明确禁止的。

​	`Mono` 仅提供了一部分对于 `Flux` 可用的操作符，并且一些操作符（特别是那些将 `Mono` 与另一个 `Publisher` 组合的操作符）会切换到 `Flux` 。例如， `Mono#concatWith(Publisher)` 返回一个 `Flux` ，而 `Mono#then(Mono)` 返回另一个 `Mono` 。

​	注意您可以使用 `Mono` 来表示无值异步过程，这类过程只有完成的概念（类似于 `Runnable` ）。要创建一个这样的过程，您可以使用一个空的 `Mono<Void>` 。

#### 3 创建 Flux 或 Mono 及其订阅的简单方法

​	要开始使用 `Flux` 和 `Mono` ，最简单的方法是使用它们各自类中的众多工厂方法之一。

- 例如，要创建一个 `String` 的序列，您可以逐一列举它们，或者将它们放入一个集合中，然后从它创建 Flux，如下所示：

```java
        Flux<String> seq1 = Flux.just("foo", "bar", "foobar");
        List<String> iterable = Arrays.asList("foo", "bar", "foobar");
        Flux<String> seq2 = Flux.fromIterable(iterable);
        Flux<String> seq3 = Flux.from(seq1);
        // 注意，即使工厂方法没有值，它也仍然遵循泛型类型。
        Flux<Object> seq4 = Flux.empty();
        // 第一个参数是范围的开始，而第二个参数是要生成的项目数量。
        Flux<Integer> seq5 = Flux.range(5, 3);
```

- 在订阅方面， `Flux` 和 `Mono` 使用了 Java 8 的 lambda 表达式。您有多种 `.subscribe()` 变体可供选择，这些变体接受 lambda 表达式，用于不同的回调组合，如下所示的方法签名中所示：

​	基于 Lambda 的订阅变体 `Flux`

```java
        Consumer<Object> consumer = v -> System.out.println("v = " + v);
        Consumer<? super Throwable> errorConsumer = throwable -> System.out.println("throwable = " + throwable);
        Runnable completeConsumer = () -> System.out.println("流结束了...");
        Consumer<? super Subscription> subscriptionConsumer = subscription -> System.out.println("subscription = " + subscription);

        // 订阅并触发序列。
        Flux.empty().subscribe();
        // 对每个产生的值进行处理。
        Flux.empty().subscribe(consumer);
        // 处理值，同时响应错误。
        Flux.empty().subscribe(consumer, errorConsumer);
        // 处理值和错误，并在序列成功完成时运行一些代码。
        Flux.empty().subscribe(consumer, errorConsumer, completeConsumer);
        // 处理值和错误以及成功完成，但也要对由此 subscribe 调用产生的 Subscription 进行一些操作。
        Flux.empty().subscribe(consumer, errorConsumer, completeConsumer, subscriptionConsumer);
        Flux.empty().subscribe(new BaseSubscriber<Object>() {
        });
```

​	这些变体返回一个订阅引用，您可以使用它来取消订阅，当不再需要更多数据时。取消订阅后，源应停止产生值并清理它创建的任何资源。这种取消和清理行为在 Reactor 中通过通用 `Disposable` 接口表示。

##### 1 方法示例

​	对 `subscribe` 方法的五种签名的基本示例。

- 不带参数的基本方法示例：

```java
Flux<Integer> ints = Flux.range(1, 3);
// 以最简单的方式订阅。
ints.subscribe();
```

- 带有一个消费者参数的示例：

```java
Flux<Integer> ints = Flux.range(1, 3);
ints.subscribe(i -> System.out.println(i));
```



##### 2 使用其 `Disposable` 取消 `subscribe()`

​	所有这些基于 lambda 的 `subscribe()` 变体都有一个 `Disposable` 返回类型。在这种情况下， `Disposable` 接口表示可以通过调用其 `dispose()` 方法来取消订阅。

```java
        Disposable subscribe = Flux.range(1, 7)
                .delayElements(Duration.ofSeconds(1))
                .subscribe(System.out::println);

        System.out.println("subscribe.isDisposed() = " + subscribe.isDisposed());
        try {
            Thread.sleep(3000);
            subscribe.dispose();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        System.out.println("subscribe.isDisposed() = " + subscribe.isDisposed());
```

​	对于 `Flux` 或 `Mono` ，取消是一个信号，表示源应该停止产生元素。但是，这并不保证是立即的：一些源可能产生元素非常快，以至于它们可能在接收到取消指令之前就已经完成了。

​	在 `Disposables` 类中提供了一些关于 `Disposable` 的实用工具。其中， `Disposables.swap()` 创建了一个 `Disposable` 包装器，允许您原子性地取消并替换一个具体的 `Disposable` 。这在 UI 场景中非常有用，例如，当用户点击按钮时，您希望取消请求并替换为新的请求。销毁包装器本身将关闭它。这样做将销毁当前的实体值以及所有未来的尝试替换。

​	另一个有趣的实用工具是 `Disposables.composite(…)` 。这个组合允许您收集多个 `Disposable` ——例如，与一个服务调用相关的多个正在进行的请求——并在稍后一次性销毁它们。一旦调用了组合的 `dispose()` 方法，任何尝试添加另一个 `Disposable` 都会立即销毁它的。

​	存在一个额外的 `subscribe` 方法，它更通用，接受一个完整的 `Subscriber` 而不是从 lambda 中组合一个。为了帮助编写这样的 `Subscriber` ，我们提供了一个可扩展的类，称为 `BaseSubscriber` 。

##### 3 Lambda 的替代方案： `BaseSubscriber`

​	自定义消费者，推荐直接编写<span style="color:blue;font-weight:bold;">BaseSubscribe 的逻辑</span>；

​	存在一个额外的 `subscribe` 方法，它更通用，接受一个完整的 `Subscriber` 而不是从 lambda 中组合一个。为了帮助编写这样的 `Subscriber` ，我们提供了一个可扩展的类，称为 `BaseSubscriber` 。

> `BaseSubscriber` （或其子类）是单次使用的，这意味着如果一个 `BaseSubscriber` 已经订阅了第二个 `Publisher` ，那么它将取消对第一个 `Publisher` 的订阅。这是因为如果使用一个实例两次，将违反 Reactive Streams 规则，即 `onNext` 方法不能在并行调用中被调用。因此，只有当匿名实现直接在 `Subscriber` 调用中声明时，它们才是可行的。

​	现在我们可以实现其中之一。我们称它为 `SampleSubscriber` 。以下示例展示了它将如何附加到 `Flux` 上：

```java
SampleSubscriber<Integer> ss = new SampleSubscriber<Integer>();
Flux<Integer> ints = Flux.range(1, 4);
ints.subscribe(ss);
```

​	以下示例展示了 `SampleSubscriber` 可能的样子，作为 `BaseSubscriber` 的最小化实现：

```java
import org.reactivestreams.Subscription;

import reactor.core.publisher.BaseSubscriber;

public class SampleSubscriber<T> extends BaseSubscriber<T> {

	@Override
	public void hookOnSubscribe(Subscription subscription) {
		System.out.println("Subscribed");
		request(1);
	}

	@Override
	public void hookOnNext(T value) {
		System.out.println(value);
		request(1);
	}
}
```

​	`SampleSubscriber` 类继承自 `BaseSubscriber` ，这是 Reactor 中用户自定义 `Subscribers` 的推荐抽象类。该类提供了可以覆盖的钩子，以调整订阅者的行为。默认情况下，它触发无界请求，并且行为与 `subscribe()` 完全相同。然而，当您想要自定义请求量时，扩展 `BaseSubscriber` 要更有用得多。

​	对于自定义请求量，最低要求是实现 `hookOnSubscribe(Subscription subscription)` 和 `hookOnNext(T value)` ，就像我们做的那样。在我们的例子中， `hookOnSubscribe` 方法将一条语句打印到标准输出，并执行第一个请求。然后 `hookOnNext` 方法打印一条语句，并逐个执行额外的请求。

​	`BaseSubscriber` 还提供了一个 `requestUnbounded()` 方法来切换到无界模式（相当于 `request(Long.MAX_VALUE)` ），以及一个 `cancel()` 方法。

​	它还具有额外的钩子： `hookOnComplete` ， `hookOnError` ， `hookOnCancel` ，和 `hookFinally` （当序列终止时始终被调用，终止类型作为 `SignalType` 参数传入）

> 你几乎肯定需要实现 `hookOnError` ， `hookOnCancel` ，和 `hookOnComplete` 方法。你可能还需要实现 `hookFinally` 方法。 `SampleSubscriber` 是执行有界请求的 `Subscriber` 的绝对最小实现。

##### 4 一个信号感知+自定义消费者的示例

> 自定义流的信号感知回调

```java
        Flux flux = Flux.just(1, 2, 3, 4, 5).subscribe(
                v -> System.out.println("v = " + v),// 流元素消费
                throwable -> System.out.println("throwable = " + throwable), // 感知异常结束
                () -> System.out.println("流结束了...") // 感知正常结束
        );
```

> 自定义消费者

```java
        flux.subscribe(new BaseSubscriber<Integer>() {

            // 生命周期钩子1： 订阅关系绑定的时候触发
            @Override
            protected void hookOnSubscribe(Subscription subscription) {
                System.out.println("订阅者和发布者绑定......" + subscription);
                // 找发布者要数据
                request(1);
            }

            @Override
            protected void hookOnNext(Integer value) {
                System.out.println("元素到达......" + value);
                if (value < 5) {
                    if (value == 3) {
                        // 会触发 hookOnError；不会触发 doOnError，但会触发 doOnCancel
                        // throw new RuntimeException("数据流异常");
                    }
                } else if (value == 7) {
                    // cancel();
                }
                request(1);
            }

            @Override
            protected void hookOnComplete() {
                System.out.println("数据流完成......");
            }

            @Override
            protected void hookOnError(Throwable throwable) {
                System.out.println("数据流异常......" + throwable);
            }

            @Override
            protected void hookOnCancel() {
                System.out.println("数据流被取消......");
            }

            @Override
            protected void hookFinally(SignalType type) {
                System.out.println("数据流必做之事......" + type);
            }
        })
```

##### 5 背压（Backpressure）和请求重塑（Reshape Requests）

​	在实现 Reactor 中的背压时，消费者压力通过向上游操作员发送 `request` 来传播回源。当前请求的总和有时被称为当前的“需求”或“挂起请求”。需求上限为 `Long.MAX_VALUE` ，表示无界请求（意味着“尽可能快地生产”——基本上禁用背压）。

首次请求来自订阅时的最后一个订阅者，但所有立即触发订阅的最直接方式都会导致对 `Long.MAX_VALUE` 的无界请求

- `subscribe()` 以及其大多数基于 lambda 的变体（除了那个有 `Consumer<Subscription>` 的之外）
- `block()` 、 `blockFirst()` 和 `blockLast()`
- 遍历 `toIterable()` 或 `toStream()`

​	修改原始请求的最简单方法是通过使用一个带有 `hookOnSubscribe` 方法重写的 `BaseSubscriber` ，如下例所示：

```java
Flux.range(1, 10)
    .doOnRequest(r -> System.out.println("request of " + r))
    .subscribe(new BaseSubscriber<Integer>() {

      @Override
      public void hookOnSubscribe(Subscription subscription) {
        request(1);
      }

      @Override
      public void hookOnNext(Integer integer) {
        System.out.println("Cancelling after having received " + integer);
        cancel();
      }
    });
```

​	当操作请求时，你必须小心地产生足够的需求以使序列前进，否则你的 Flux 可能会“卡住”。这就是为什么 `BaseSubscriber` 默认为 `hookOnSubscribe` 的无界请求。当你覆盖这个钩子时，通常你应该至少调用 `request` 一次。

###### 1 改变下游需求的操作符

​	有一个需要注意的事情是，在订阅级别表达的需求可以被上游链中的每个操作符重塑。一个典型的例子是 `buffer(N)` 操作符：如果它收到一个 `request(2)` ，它被解释为对两个完整缓冲区的要求。因此，由于缓冲区需要 `N` 个元素才能被认为是满的， `buffer` 操作符将请求重塑为 `2 x N` 。

**1 buffer、缓冲**

```java
        // 10元素，buffer(3)；消费者请求4次，数据消费完成
        Flux.range(1, 10)
                .buffer(3) // 缓冲区：缓冲3个元素: 消费一次最多可以拿到三个元素； 凑满数批量发给消费者
                .log()
                .subscribe(System.out::println);
```

**2 limit：限流**

```java
Flux.range(1, 1000)
    .log()
    // 限流触发，看上游是怎么限流获取数据的
    .limitRate(100) // 一次预取30个元素； 第一次 request(100)，以后request(75)
    .subscribe();
```

​	你可能也注意到了，一些操作符有变体，它们接受一个名为 `prefetch` 的 `int` 输入参数。这是另一类修改下游请求的操作符。这些操作符通常处理内部序列，从每个传入元素中派生出 `Publisher` （例如 `flatMap` ）。

​	预取是一种调整这些内部序列初始请求的方法。如果没有指定，大多数这些操作符最初都以 `32` 的需求开始。

​	这些操作符通常还实现了补充优化：一旦操作符看到 75% 的预取请求得到满足，它就会从上游重新请求 75%。这是一种启发式优化，使得这些操作符能够主动预测即将到来的请求。

​	最后，有一些操作符允许你直接调整请求： `limitRate` 和 `limitRequest` 。

​	将下游请求分割，以便以更小的批次向上游传播。例如，向 `limitRate(10)` 发起的 `100` 请求最多会向上游传播 `10` 个 `10` 请求。注意，在这种情况下， `limitRate` 实际上实现了前面讨论过的补充优化。

#### 4 以编程方式创建序列-Sink

​	在本节中，我们将介绍通过程序定义其相关事件（ `Flux` 、 `Mono` 、 `onNext` 和 `onError` ）来创建一个 `Flux` 或 `Mono` 的方法。所有这些方法都共享一个事实，即它们提供了一个 API 来触发我们称之为“sink”的事件。实际上，存在几种sink的变体，我们将在稍后讨论。

> Sink.next
>
> Sink.complete

##### 1 同步 generate

​	最简单的程序化创建 `Flux` 的形式是通过 `generate` 方法，该方法接受一个生成器函数。

​	这适用于同步和逐个发射，意味着接收器是 `SynchronousSink` ，并且其 `next()` 方法<span style="color:red;font-weight:bold;">在每个回调调用中最多只能被调用一次</span>。然后您可以额外调用 `error(Throwable)` 或 `complete()` ，但这不是必须的。

​	最有用的变体可能是同时让你保持一个可以在你的下游使用中引用的状态，以决定下一个要发出什么。生成器函数随后变为一个 `BiFunction<S, SynchronousSink<T>, S>` ，其中 `<S>` 是状态对象的类型。你必须提供一个 `Supplier<S>` 作为初始状态，并且你的生成器函数现在在每一轮都返回一个新的状态。

```java
        Flux<Object> generate = Flux.generate(
                // 我们提供初始状态值 0。
                () -> 0,
                (state, sink) -> {
                    if (state == 7) {
                        sink.error(new RuntimeException("我不太喜欢7"));
                    }
                    if (state <= 10) {
                        sink.next("Generated: " + state); // 我们使用状态来选择要发射的内容。
                    } else {
                        sink.complete(); // 我们也用它来选择何时停止。
                    }
                    return state + 1; // 我们返回一个新的状态，我们将在下一次调用中使用它（除非序列在此终止）。
                }
        );
        generate.log().subscribe();
```

​	您还可以使用可变的 `<S>` 。例如，上面的例子可以用单个 `AtomicLong` 作为状态重写，并在每一轮中修改它：

​	如果您的状态对象需要清理一些资源，请使用 `generate(Supplier<S>, BiFunction, Consumer<S>)` 变体来清理最后一个状态实例。

```java
        // 可变状态变体
        Flux<String> flux = Flux.generate(
                AtomicLong::new, // 可变对象作为状态
                (state, sink) -> {
                    long i = state.getAndIncrement(); // 我们在这里修改状态。
                    sink.next("3 x " + i + " = " + 3 * i);
                    if (i == 10) sink.complete();
                    return state; // 返回相同的实例作为新状态。
                },
                (state) -> System.out.println("state: " + state) // 我们看到最后一个状态值（11）作为此 Consumer lambda 的输出。
        );
        flux.subscribe(System.out::println);
```

##### 2 异步和多线程 create

​	`create` 是程序化创建一个 `Flux` 的更高级形式，适用于每轮多次发射，甚至可以从多个线程发射。

​	它公开了一个 `FluxSink` ，以及其 `next` 、 `error` 和 `complete` 方法。与 `generate` 不同，它没有基于状态的变体。另一方面，它可以在回调中触发多线程事件。

> `create` 可以非常有助于将现有的 API 与响应式世界连接起来——例如基于监听器的异步 API。

> `create` 不会并行化你的代码，也不会使其异步，尽管它可以与异步 API 一起使用。如果你在 `create` lambda 中阻塞，你会暴露自己于死锁和类似副作用。即使使用了 `subscribeOn` ，也存在这样的警告：一个长时间阻塞的 `create` lambda（例如调用 `sink.next(t)` 的无限循环）可能会锁定管道：由于循环耗尽了应该从中运行的同一线程，请求将永远不会执行。使用 `subscribeOn(Scheduler, false)` 变体： `requestOnSeparateThread = false` 将使用 `Scheduler` 线程来执行 `create` ，同时通过在原始线程中执行 `request` 来让数据流动。

​	想象你使用了一个基于监听器的 API。它通过数据块处理数据，并有两个事件：（1）数据块已准备好，以及（2）处理完成（终端事件），如 `MyEventListener` 接口所示：

​	您可以使用 `create` 将其桥接到 `Flux<T>` ：

```java
package com.coding.reactor.projectreactor;

import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.List;

public class FluxCreateExample {
    public static void main(String[] args) {
        MyEventProcessor<String> myEventProcessor = new MyEventProcessor<>();
        Flux<String> bridge = Flux.create(sink -> {
            // 先注册事件，所有这些操作都是在 myEventProcessor 执行时异步完成的。
            myEventProcessor.register(
                    new MyEventListener<>() {
                        public void onDataChunk(List<String> chunk) {
                            for (String s : chunk) {
                                sink.next(s);
                            }
                        }

                        public void processComplete() {
                            sink.complete();
                        }
                    });
        });
        bridge.log().subscribe();

        // 5秒之后触发
        try {
            Thread.sleep(5000);
            // 启动一个线程，模拟外部事件
            new Thread(() -> {
                for (int i = 0; i < 10; i++) {
                    try {
                        Thread.sleep(100);
                        myEventProcessor.listener.onDataChunk(List.of("a" + i, "b" + i, "c" + i));
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                }
                myEventProcessor.listener.processComplete();
            }).start();
            // 启动一个线程，模拟外部事件
            new Thread(() -> {
                for (int i = 0; i < 10; i++) {
                    try {
                        Thread.sleep(100);
                        myEventProcessor.listener.onDataChunk(List.of("x" + i, "y" + i, "z" + i));
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                }
                myEventProcessor.listener.processComplete();
            }).start();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        try {
            System.in.read();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    interface MyEventListener<T> {
        void onDataChunk(List<T> chunk);

        void processComplete();
    }

    static class MyEventProcessor<T> {
        private MyEventListener<T> listener;

        public void register(MyEventListener<T> listener) {
            this.listener = listener;
        }
    }
}

```

​	此外，由于 `create` 可以桥接异步 API 并管理背压，您可以通过指示一个 `OverflowStrategy` 来细化背压行为：

- `IGNORE` 完全忽略下游背压请求。这可能导致 `IllegalStateException` 当队列在下游满时。
- `ERROR` 通知 `IllegalStateException` 当下游无法跟上时。
- `DROP` 如果下游尚未准备好接收，则丢弃传入的信号。
- `LATEST` 允许下游仅从上游获取最新的信号。
- `BUFFER` （默认）如果下游无法跟上，则缓冲所有信号。（这会导致无界缓冲，可能引发 `OutOfMemoryError` 。）

> `Mono` 还有一个 `create` 生成器。Mono 的 create 的 `MonoSink` 不允许多次发射。它将在第一次发射后丢弃所有信号。

##### 3 异步但单线程 push

​	`push` 是介于 `generate` 和 `create` 之间的中间地带，适合处理来自**单个生产者**的事件。在这一点上，它与 `create` 类似，因为也可以异步，并且可以使用 `create` 支持的任何溢出策略来管理背压。然而，一次只能有一个生产线程调用 `next` 、 `complete` 或 `error` 

```java
package com.coding.reactor.projectreactor;

import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.List;

public class FluxPushExample {
    public static void main(String[] args) {
        MyEventProcessor<String> myEventProcessor = new MyEventProcessor<>();
        Flux<String> bridge = Flux.push(sink -> {
            // 先注册事件，所有这些操作都是在 myEventProcessor 执行时异步完成的。
            myEventProcessor.register(
                    new SingleThreadEventListener<>() {
                        public void onDataChunk(List<String> chunk) {
                            for (String s : chunk) {
                                // 事件由单个监听线程使用 next 推送到接收器。
                                sink.next(s);
                            }
                        }

                        public void processComplete() {
                            // 由同一监听线程生成 complete 事件。
                            sink.complete();
                        }

                        public void processError(Throwable e) {
                            // 由同一监听线程生成的事件
                            sink.error(e);
                        }
                    });
        });
        bridge.log().subscribe();

        // 5秒之后触发
        try {
            Thread.sleep(5000);
            // 启动一个线程，模拟外部事件；若此处启动多个线程，也不会报错，但会数据丢失
            new Thread(() -> {
                for (int i = 0; i < 10; i++) {
                    try {
                        Thread.sleep(100);
                        myEventProcessor.listener.onDataChunk(List.of("a" + i, "b" + i, "c" + i));
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                }
                myEventProcessor.listener.processComplete();
            }).start();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        try {
            System.in.read();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    interface SingleThreadEventListener<T> {
        void onDataChunk(List<T> chunk);

        void processComplete();

        void processError(Throwable e);
    }

    static class MyEventProcessor<T> {
        private SingleThreadEventListener<T> listener;

        public void register(SingleThreadEventListener<T> listener) {
            this.listener = listener;
        }
    }
}
```

##### 4 Handle 处理

​	`handle` 方法略有不同：它是一个实例方法，意味着它附加在现有源上（就像常见的操作符一样）。它在 `Mono` 和 `Flux` 中都存在。

​	它与 `generate` 很接近，在意义上它使用 `SynchronousSink` 并且**只允许逐个发射**。然而， `handle` 可以用来从每个源元素生成一个任意值，可能跳过一些元素。这样，它可以作为 `map` 和 `filter` 的组合。handle 的签名如下：

```java
Flux<R> handle(BiConsumer<T, SynchronousSink<R>>);
```

​	让我们考虑一个例子。反应式流规范禁止在序列中使用 `null` 值。如果你想要执行 `map` 操作，但又想使用现有的方法作为 map 函数，而这个方法有时会返回 null 怎么办？
​	例如，以下方法可以安全地应用于整数源：

```java
package com.coding.reactor.projectreactor;

import reactor.core.publisher.Flux;

public class FluxHandleExample {

    public static void main(String[] args) {
        Flux<String> alphabet = Flux.just(-1, 30, 13, 9, 20)
                .handle((i, sink) -> {
                    String letter = alphabet(i); // 映射到字母。
                    if (letter != null) {
                        sink.next(letter);
                    }
                });

        alphabet.subscribe(System.out::println);
    }

    public static String alphabet(int letterNumber) {
        if (letterNumber < 1 || letterNumber > 26) {
            return null;
        }
        int letterIndexAscii = 'A' + letterNumber - 1;
        return "" + (char) letterIndexAscii;
    }
}

```



#### 5 线程和调度器

​	Reactor，就像 RxJava 一样，可以被认为是无并发限制的。也就是说，它不会强制执行并发模型。相反，它将控制权交给了你，开发者。然而，这并不意味着库不能帮助你处理并发。

​	获取一个 `Flux` 或一个 `Mono` 并不一定意味着它在专门的 `Thread` 中运行。相反，大多数操作符会继续在之前操作符执行的 `Thread` 上工作。除非指定，否则最顶层的操作符（源）本身将在 `Thread` 中运行，即 `subscribe()` 调用发生的地方。以下示例在一个新线程中运行 `Mono` ：

```java
package com.coding.reactor.projectreactor;

import reactor.core.publisher.Mono;

public class ThreadAndSchedule {

    public static void main(String[] args) throws InterruptedException {
        final Mono<String> mono = Mono.just("hello "); // Mono<String> 在线程 main 中被组装。

        Thread t = new Thread(() -> mono
                .map(msg -> msg + "thread ")
                .subscribe(v -> // 然而，它在线程 Thread-0 中进行了订阅。
                        System.out.println(v + Thread.currentThread().getName()) // 因此， map 和 onNext 回调实际上都在 Thread-0 中运行。

                )
        );
        t.start();
        t.join();

    }
}

```

​	在 Reactor 中，执行模型和执行发生的位置由所使用的 `Scheduler` 决定。一个 `Scheduler` 具有与 `ExecutorService` 相似的调度职责，但拥有专门的抽象可以做得更多，特别是充当时钟，并允许更广泛的实现（测试中的虚拟时间、弹跳或立即调度等）。

​	`Schedulers` 类具有静态方法，可以访问以下执行上下文：

| **调度器**                | **线程池类型**                 | **线程数量**                 | **队列类型**          | **是否适合阻塞操作** | **适用场景**                                                 | **注意事项**                       |
| :------------------------ | :----------------------------- | :--------------------------- | :-------------------- | :------------------- | :----------------------------------------------------------- | :--------------------------------- |
| **`parallel()`**          | 固定线程池                     | 默认等于 CPU 核心数          | 无界队列              | ❌ 不适合             | 非阻塞计算密集型任务（如数值运算、内存处理）                 | 阻塞任务会导致线程饥饿             |
| **`boundedElastic()`**    | 弹性线程池（有界）             | 最大线程数 = 10 × CPU 核心数 | 有界队列（默认 10万） | ✅ 适合               | IO 密集型或阻塞任务（如 HTTP 调用、数据库查询）              | 防止资源耗尽，默认队列可能积压任务 |
| **`single()`**            | 单线程池                       | 1 个线程                     | 无界队列              | ❌ 不适合             | 需要严格顺序的任务（如事件顺序处理、单线程写入文件）         | 阻塞任务会阻塞整个调度器           |
| **`immediate()`**         | 无线程池（直接在当前线程执行） | 无                           | 无                    | ❌ 不适合             | 快速执行且无需线程切换的任务（如简单同步操作）               | 阻塞操作会卡住当前线程             |
| **`fromExecutor()`**      | 自定义线程池                   | 用户定义                     | 用户定义              | 取决于线程池配置     | 集成现有线程池（如 Tomcat 线程池、自定义 Executor）          | 需手动管理生命周期（如关闭）       |
| **`newParallel()`**       | 固定线程池（可自定义大小）     | 用户定义（默认=CPU 核心数）  | 无界队列              | ❌ 不适合             | 需要控制并行度的非阻塞任务（类似 `parallel()`，但可自定义线程数） | 需手动调用 `dispose()` 释放资源    |
| **`newBoundedElastic()`** | 弹性线程池（可自定义参数）     | 用户定义最大线程数           | 有界队列（用户定义）  | ✅ 适合               | 需要精细控制资源的阻塞任务（如限制并发连接数）               | 需手动配置队列大小和线程数         |

​	您还可以通过使用 `newXXX` 方法创建各种调度程序类型的新实例。例如， `Schedulers.newParallel(yourScheduleName)` 创建了一个名为 `yourScheduleName` 的新并行调度程序。

​	一些操作符默认使用 `Schedulers` 中的特定调度器（并且通常提供提供不同调度器的选项）。例如，调用 `Flux.interval(Duration.ofMillis(300))` 工厂方法会产生一个每 300ms 触发一次的 `Flux<Long>` 。默认情况下，这是通过 `Schedulers.parallel()` 启用的。以下行将调度器更改为类似 `Schedulers.single()` 的新实例：

```java
    public static void main(String[] args) {
        Flux.interval(Duration.ofMillis(300), Schedulers.newSingle("test")).log().subscribe();
    }
```

​	Reactor 提供了两种在响应式链中切换执行上下文（或 `Scheduler` ）的方法： `publishOn` 和 `subscribeOn` 。两者都接受 `Scheduler` 并允许您将执行上下文切换到该调度器。但 `publishOn` 在链中的位置很重要，而 `subscribeOn` 的位置则不重要。要理解这种差异，您首先必须记住，在您订阅之前，什么都不会发生。

​	在 Reactor 中，当你链式调用操作符时，你可以根据需要将多个 `Flux` 和 `Mono` 实现嵌套在一起。一旦你进行订阅，就会创建一个由 `Subscriber` 对象组成的链，从第一个发布者向上（沿着链）。这实际上对你来说是隐藏的。你所看到的就是最外层的 `Flux` （或 `Mono` ）和 `Subscription` ，但真正的操作是在这些中间操作符特定的订阅者中发生的。

​	基于这个知识，我们可以更仔细地看看 `publishOn` 和 `subscribeOn` 操作符：

##### 1 `publishOn` 方法

​	`publishOn` 与任何其他操作符一样，应用于订阅者链的中间。它从上游获取信号，并在关联的 `Scheduler` 上执行回调的同时将它们重新播放到下游。因此，它影响后续操作符的执行位置（直到链入另一个 `publishOn` ），如下所示：

- 将执行上下文更改为由 `Thread` 选择的 `Scheduler`

- 根据规范， `onNext` 调用按顺序发生，因此这会占用单个线程
- 除非它们在特定的 `Scheduler` 上工作，否则 `publishOn` 后的操作将继续在同一线程上执行

​	以下示例使用了 `publishOn` 方法：

```java
    public static void main(String[] args) throws InterruptedException {
        // 创建一个由四个 Thread 实例支持的新的 Scheduler
        Scheduler s = Schedulers.newParallel("parallel-scheduler", 4);

        final Flux<String> flux = Flux
                .range(1, 2)
                .map(i -> 10 + i)
                .publishOn(s)
                .map(i -> "value " + i + Thread.currentThread().getName()); // 这里的打印，使用的是线程调度器 s 中的线程

        //只要不指定线程池，默认发布者用的线程就是订阅者的线程；
        Thread t = new Thread(() -> flux.subscribe(System.out::println));
        t.start();
        t.join();
    }

```

##### 2 `subscribeOn` 方法

​	`subscribeOn` 适用于在构建反向链的订阅过程中。通常建议将其放置在数据源之后，因为中间操作符可能会影响执行上下文。

​	然而，这不会影响后续对 `publishOn` 的调用行为——它们仍然切换它们之后链部分的执行上下文。

> 只有下游链中最接近的 `subscribeOn` 调用才能有效地安排订阅和请求信号到源或可以拦截它们的操作符（ `doFirst` ， `doOnRequest` ）。使用多个 `subscribeOn` 调用将引入没有价值的线程切换。

​	以下示例使用 `subscribeOn` 方法：

```java
    public static void main(String[] args) throws InterruptedException {
        Scheduler s = Schedulers.newParallel("parallel-scheduler", 4);

        final Flux<String> flux = Flux
                .range(1, 2)
                .log()
                .map(i -> 10 + i) // 这里使用的是线程调度器 s 中的线程
                .subscribeOn(s)
                .map(i -> "value " + i + "-" +Thread.currentThread().getName()); // 这里的打印，使用的是线程调度器 s 中的线程

        Thread t = new Thread(() -> flux.subscribe(System.out::println));
        t.start();
        t.join();
    }

```

#### 6 处理错误

​	在响应式流中，错误是终止事件。一旦发生错误，就会停止序列，并将其传播到运算符链的最后一个步骤，即您定义的 `Subscriber` 及其 `onError` 方法。
​	这些错误仍然应该在应用层进行处理。例如，你可以在 UI 中显示错误通知，或者在 REST 端点发送有意义的错误负载。因此，订阅者的 `onError` 方法始终应该被定义。

> 如果没有定义， `onError` 将抛出 `UnsupportedOperationException` 。你可以进一步通过 `Exceptions.isErrorCallbackNotImplemented` 方法检测和分类它。

​	Reactor 还提供了处理链中错误的其他方法，即错误处理操作符。以下示例展示了如何做到这一点：

```java
Flux.just(1, 2, 0)
    .map(i -> "100 / " + i + " = " + (100 / i)) //this triggers an error with 0
    .onErrorReturn("Divided by zero :("); // error handling example
```

​	在学习错误处理操作符之前，你必须记住，任何在反应式序列中的错误都是一个终止事件。即使使用了错误处理操作符，它也不会让原始序列继续。相反，它将 `onError` 信号转换为新序列的开始（回退序列）。换句话说，它替换了其上游终止的序列。

​	现在我们可以逐一考虑每种错误处理方法。当相关时，我们将与命令式编程的 `try` 模式进行类比。

##### 1 错误处理运算符

​	您可能熟悉在 try-catch 块中处理异常的几种方式。最值得注意的是以下几种：

- 捕获并返回一个静态默认值。
- 捕获并执行一个带有回退方法的替代路径。
- 捕获并动态计算一个回退值。
- 捕获，包装到 `BusinessException` ，然后重新抛出。
- 捕获，记录一个错误特定的消息，然后重新抛出。
- 使用 `finally` 块来清理资源或 Java 7 的“try-with-resource”构造。

​	所有这些在 Reactor 中都有等价的操作符，用于错误处理。在探讨这些操作符之前，我们首先想要在反应链和 try-catch 块之间建立一种平行关系。

​	订阅时，链尾的 `onError` 回调类似于 `catch` 块。在那里，如果抛出了 `Exception` ，则执行跳转到 catch，以下示例展示了这一点：

```java
Flux<String> s = Flux.range(1, 10)
    .map(v -> doSomethingDangerous(v)) // 执行可能会抛出异常的转换
    .map(v -> doSecondTransform(v)); // 如果一切顺利，将执行第二个转换
s.subscribe(value -> System.out.println("RECEIVED " + value), // 每个成功转换的值都会被打印出来
            error -> System.err.println("CAUGHT " + error) // 如果发生错误，序列将终止并显示错误消息
);
```

​	上述示例在概念上类似于以下 try-catch 块：

```java
try {
    for (int i = 1; i < 11; i++) {
        String v1 = doSomethingDangerous(i);
        String v2 = doSecondTransform(v1);
        System.out.println("RECEIVED " + v2);
    }
} catch (Throwable t) {
    System.err.println("CAUGHT " + t);
}
```

​	现在我们已经建立了一个并行，我们可以查看不同的错误处理情况及其等效运算符。

###### 1.1 静态回退值（Static Fallback Value）

<span style="color:#1E90FF;font-weight:bold;">Catch and return a static default value.</span>

<span style="color:blue;font-weight:bold;">捕获并返回一个静态默认值</span>

​	“捕获并返回静态默认值”的等效操作为 `onErrorReturn` 。以下示例展示了如何使用它：

```java
try {
  return doSomethingDangerous(10);
}
catch (Throwable error) {
  return "RECOVERED";
}
```

​	以下示例展示了 Reactor 的等效操作：

```java
Flux.just(10)
    .map(this::doSomethingDangerous)
    .onErrorReturn("RECOVERED");
```

​	您还可以选择在异常上应用 `Predicate` 来决定是否恢复，如下例所示：

```java
Flux.just(10)
    .map(this::doSomethingDangerous)
    .onErrorReturn(e -> e.getMessage().equals("boom10"), "recovered10");
```

​	仅在异常消息为 `"boom10"` 时恢复

**示例：**

```java
    /**
     * 1、吃掉异常，消费者无异常感知
     * 2、返回一个默认值
     * 3、流直接中断，并以正常方式结束
     */
    @Test
    void onErrorReturn() {
        Flux.just(1, 2, 0, 5)
                .map(i -> "100 / " + i + " = " + (100 / i))
                .onErrorReturn("Divided by zero :(")
                .subscribe(v -> System.out.println("v = " + v),
                        err -> System.out.println("err = " + err),
                        () -> System.out.println("流结束"));
    }

    @Test
    void onErrorReturn2() {
        Flux.just(1, 2, 0, 5)
                .map(i -> "100 / " + i + " = " + (100 / i))
                .onErrorReturn(NullPointerException.class, "Divided by zero :(")
                .subscribe(v -> System.out.println("v = " + v),
                        err -> System.out.println("err = " + err),
                        () -> System.out.println("流结束"));
    }
```

###### 1.2 捕获并吞掉错误（Catch and swallow the error）【onErrorComplete】

​	如果您甚至不想用回退值替换异常，而是忽略它并仅传播已产生的元素，本质上您需要将 `onError` 信号替换为 `onComplete` 信号。这可以通过 `onErrorComplete` 操作符完成：

```java
Flux.just(10,20,30)
    .map(this::doSomethingDangerousOn30)
    .onErrorComplete();
```

​	通过将 `onError` 转换为 `onComplete` 来恢复

​	类似于 `onErrorReturn` ， `onErrorComplete` 有变体，允许您根据异常的类或基于一个 `Predicate` 来过滤要回退的异常。

**示例：**

```java
    /**
     * 1、吃掉异常，消费者无异常感知
     * 2、流直接中断，并以正常方式结束
     */
    @Test
    void onErrorComplete() {
        Flux.just(1, 2, 0, 5)
                .map(i -> "100 / " + i + " = " + (100 / i))
                .doOnError(original -> {
                    System.out.println("original已被记录 = " + original);
                })
                .onErrorComplete()
                .subscribe(v -> System.out.println("v = " + v),
                        err -> System.out.println("err = " + err),
                        () -> System.out.println("流结束"));
    }

```

###### 1.3 回退方法（Fallback Method）

<span style="color:#1E90FF;font-weight:bold;">Catch and execute an alternative path with a fallback method.</span>

<span style="color:blue;font-weight:bold;">捕获并执行一个带有回退方法的替代路径。</span>

​	如果您需要多个默认值，并且您有处理数据的替代（更安全）方法，您可以使用 `onErrorResume` 。这相当于“捕获并执行带有回退方法的替代路径”。

​	例如，如果您的标准流程是从外部不可靠的服务获取数据，但您还保留了一个可能稍显过时但更可靠的数据本地缓存，您可以这样做：

```java
String v1;
try {
  v1 = callExternalService("key1");
}
catch (Throwable error) {
  v1 = getFromCache("key1");
}

String v2;
try {
  v2 = callExternalService("key2");
}
catch (Throwable error) {
  v2 = getFromCache("key2");
}
```

​	以下示例展示了 Reactor 的等效操作：

```java
Flux.just("key1", "key2")
    .flatMap(k -> callExternalService(k) // 对于每个键，异步调用外部服务。
        .onErrorResume(e -> getFromCache(k)) // 如果外部服务调用失败，则回退到该键的缓存。注意，无论源错误是什么，我们始终应用相同的回退。
    );
```

​	与 `onErrorReturn` 类似， `onErrorResume` 有变体，允许您根据异常的类或基于一个 `Predicate` 来过滤要回退的异常。它接受一个 `Function` 的事实也允许您根据遇到的错误选择不同的回退序列来切换。以下示例显示了如何做到这一点：

```java
Flux.just("timeout1", "unknown", "key2")
    .flatMap(k -> callExternalService(k)
        .onErrorResume(error -> { // 该函数允许动态选择如何继续。
            if (error instanceof TimeoutException) // 如果是超时，则访问本地缓存
                return getFromCache(k);
            else if (error instanceof UnknownKeyException) // 如果是未知键，则创建新条目
                return registerNewEntry(k, "DEFAULT");
            else
                return Flux.error(error); // 在所有其他情况下，重新抛出异常
        })
    );
```

**示例：**

```java
    /**
     * 1、吃掉异常，消费者无异常感知
     * 2、调用一个兜底方法
     * 3、流直接中断，并以正常方式结束
     */
    @Test
    void onErrorResume() {
        Flux.just(1, 2, 0, 5)
                .map(i -> "100 / " + i + " = " + (100 / i))
                .onErrorResume(err -> Mono.just("Divided by zero :("))
                .subscribe(v -> System.out.println("v = " + v),
                        err -> System.out.println("err = " + err),
                        () -> System.out.println("流结束"));
    }
```

###### 1.4 动态回退值（Dynamic Fallback Value）

<span style="color:#1E90FF;font-weight:bold;">Catch and dynamically compute a fallback value</span>

<span style="color:blue;font-weight:bold;">捕获并动态计算一个回退值</span>

​	即使你没有处理数据的替代（更安全）方法，你也可能想从接收到的异常中计算一个回退值。这相当于“捕获并动态计算回退值”。

​	例如，如果你的返回类型（ `MyWrapper` ）有一个专门用于存储异常的变体（想想 `Future.complete(T success)` 与 `Future.completeExceptionally(Throwable error)` ），你可以实例化错误存储变体并传递异常。

​	一个命令式示例将如下所示：

```java
try {
  Value v = erroringMethod();
  return MyWrapper.fromValue(v);
}
catch (Throwable error) {
  return MyWrapper.fromError(error);
}
```

​	您可以通过与回退方法解决方案相同的方式，以响应式的方式执行此操作，通过使用 `onErrorResume` ，添加少量模板代码，如下所示：

```java
erroringFlux.onErrorResume(error -> Mono.just( // 由于您期望错误以 MyWrapper 的形式表示，因此您需要获取 Mono<MyWrapper> 的 onErrorResume 。我们使用 Mono.just() 来实现这一点。
        MyWrapper.fromError(error) // 我们需要计算异常的值。在这里，我们通过使用相关的 MyWrapper 工厂方法来包装异常，实现了这一点。
));
```

**示例：**

```java
    @Test
    void onErrorResume2() {
        Flux.just(1, 2, 0, 5)
                .map(i -> "100 / " + i + " = " + (100 / i))
                .onErrorResume(err -> {
                            if (err instanceof NullPointerException) {
															return Mono.just("Not Allow Divided by zero :(");
                            } else if (err instanceof ArithmeticException) {
                                return Mono.just("Divided by zero :(");
                            }
                            return Mono.error(err);
                        }
                )
                .subscribe(v -> System.out.println("v = " + v),
                        err -> System.out.println("err = " + err),
                        () -> System.out.println("流结束"));
    }
```

###### 1.5 捕获并重新抛出（Catch and Rethrow）

<span style="color:#1E90FF;font-weight:bold;">Catch, wrap to a BusinessException, and re-throw.</span>

<span style="color:blue;font-weight:bold;">捕获，包装到 BusinessException，然后重新抛出。</span>

​	在命令式世界中，“捕获、包装为 `BusinessException` 并重新抛出”看起来如下：

```java
try {
  return callExternalService(k);
}
catch (Throwable error) {
  throw new BusinessException("oops, SLA exceeded", error);
}
```

​	在“回退方法”示例中， `flatMap` 内的最后一行为我们提供了以以下方式实现相同反应性的提示：

```java
Flux.just("timeout1")
    .flatMap(k -> callExternalService(k))
    .onErrorResume(original -> Flux.error(
            new BusinessException("oops, SLA exceeded", original))
    );
```

​	然而，使用 `onErrorMap` 有更直接的方法来实现相同的效果：

```java
Flux.just("timeout1")
    .flatMap(k -> callExternalService(k))
    .onErrorMap(original -> new BusinessException("oops, SLA exceeded", original));
```

**示例：**

```java
    /**
     * 1、吃掉异常
     * 2、抛出新异常，消费者有感知
     * 3、流程异常完成
     * 推荐使用onErrorMap
     */
    @Test
    void onErrorResume3() {
        Flux.just(1, 2, 0, 5)
                .map(i -> "100 / " + i + " = " + (100 / i))
                .onErrorResume(err ->
                        Flux.error(
                                new RuntimeException("oops, SLA exceeded", err))
                )
                .subscribe(v -> System.out.println("v = " + v),
                        err -> System.out.println("err = " + err),
                        () -> System.out.println("流结束"));
    }

    @Test
    void onErrorMap() {
        Flux.just(1, 2, 0, 5)
                .map(i -> "100 / " + i + " = " + (100 / i))
                .onErrorMap(original -> new RuntimeException("oops, SLA exceeded", original))
                .subscribe(v -> System.out.println("v = " + v),
                        err -> System.out.println("err = " + err),
                        () -> System.out.println("流结束"));
    }
```

###### 1.6 在旁边记录或反应（Log or React on the Side）

<span style="color:#1E90FF;font-weight:bold;">Catch, log an error-specific message, and re-throw.</span>

<span style="color:blue;font-weight:bold;">捕获，记录一个错误特定的消息，然后重新抛出。</span>

​	对于您想要错误继续传播但仍然想对其进行反应而不修改序列（例如记录它）的情况，您可以使用 `doOnError` 运算符。这相当于“捕获、记录错误特定消息并重新抛出”的模式，以下示例所示：

```java
try {
  return callExternalService(k);
}
catch (RuntimeException error) {
  //make a record of the error
  log("uh oh, falling back, service failed for key " + k);
  throw error;
}
```

​	`doOnError` 操作符以及所有以 `doOn` 前缀开头的操作符有时被称为具有“副作用”。它们允许您在不修改它们的情况下查看序列的事件。

​	就像前面展示的命令式示例一样，下面的示例仍然传播错误，但至少确保我们记录了外部服务失败的情况：

```java
LongAdder failureStat = new LongAdder();
Flux<String> flux =
Flux.just("unknown")
    .flatMap(k -> callExternalService(k) // 可能会失败的外部服务调用
        .doOnError(e -> {
            failureStat.increment(); // 被装饰了日志和统计副作用
            log("uh oh, falling back, service failed for key " + k);
          // 之后，它仍然会出错，除非我们在这里使用错误恢复操作符
        })
    );
```

​	我们还可以想象我们有一个统计计数器，作为第二个错误副作用来递增。

**示例：**

```java
    /**
     * 异常被捕获，做自己的事情
     * 不影响异常继续顺着流水线传播
     */
    @Test
    void doOnError() {
        Flux.just(1, 2, 0, 5)
                .map(i -> "100 / " + i + " = " + (100 / i))
                .doOnError(original -> {
                    System.out.println("original已被记录 = " + original);
                    throw new RuntimeException("oops, SLA exceeded", original);
                })
                .subscribe(v -> System.out.println("v = " + v),
                        err -> System.out.println("err = " + err),
                        () -> System.out.println("流结束"));
    }

```



###### 1.7 使用资源和Finally块（Using Resources and the Finally Block）

<span style="color:#1E90FF;font-weight:bold;">Use the finally block to clean up resources or a Java7 ”try-with-resource“ construct.</span>

<span style="color:blue;font-weight:bold;">使用 finally 块来清理资源或 Java 7 的”try-with-resource“构造</span>

​	最后与命令式编程相对应的并行操作是可以通过使用“使用 `finally` 块清理资源”或使用“Java 7 try-with-resource 构造”来完成的，如下所示：

​	命令式的 finally 使用

```java
Stats stats = new Stats();
stats.startTimer();
try {
  doSomethingDangerous();
}
finally {
  stats.stopTimerAndRecordTiming();
}
```

**示例：**

```java
    @Test
    void doFinally() {
        Flux.just(1, 2, 0, 5)
                .map(i -> "100 / " + i + " = " + (100 / i))
                .doOnError(original -> {
                    System.out.println("original已被记录 = " + original);
                })
                .doFinally(signalType -> {
                    System.out.println("流信号：" + signalType);
                })
                .subscribe(v -> System.out.println("v = " + v),
                        err -> System.out.println("err = " + err),
                        () -> System.out.println("流结束"));
    }
```



​	命令式的 try-with-resource 使用

```java
try (SomeAutoCloseable disposableInstance = new SomeAutoCloseable()) {
  return disposableInstance.toString();
}
```

​	它们都有 Reactor 的对应物： `doFinally` 和 `using` 。

​	`doFinally` 是关于在序列终止时（使用 `onComplete` 或 `onError` ）或取消时执行副作用的内容。它提供了有关触发副作用的终止类型的信息。以下示例显示了如何使用 `doFinally` ：

```java
Stats stats = new Stats();
LongAdder statsCancel = new LongAdder();

Flux<String> flux =
Flux.just("foo", "bar")
    .doOnSubscribe(s -> stats.startTimer())
    .doFinally(type -> { // doFinally 消耗一个 SignalType 用于终止的类型。
        stats.stopTimerAndRecordTiming(); // 类似于 finally 块，我们始终记录时间。
        if (type == SignalType.CANCEL) // 在取消的情况下，我们也会增加统计信息
          statsCancel.increment();
    })
    .take(1); // 从上游请求 exactly 1个请求，并在发出一个项目后取消。
```

​	另一方面， `using` 处理从资源派生出的 `Flux` 的情况，并且每当处理时都必须对该资源进行操作。在下面的示例中，我们将“try-with-resource”的 `AutoCloseable` 接口替换为 `Disposable` ：

```java
AtomicBoolean isDisposed = new AtomicBoolean();
Disposable disposableInstance = new Disposable() {
    @Override
    public void dispose() {
        isDisposed.set(true);
    }

    @Override
    public String toString() {
        return "DISPOSABLE";
    }
};
```

​	现在我们可以对它执行反应式“try-with-resource”的等效操作，其形式如下：

```java
Flux<String> flux =
Flux.using(
        () -> disposableInstance, // 第一个lambda生成资源。这里，我们返回我们的模拟Disposable
        disposable -> Flux.just(disposable.toString()), // 第二个lambda处理资源，返回一个Flux<T>
        Disposable::dispose // 当第二步中的Flux终止或取消时，第三个lambda被调用，以清理资源。
);
// 订阅并执行序列后， isDisposed 原子布尔值变为 true 。
```

###### 1.8 忽略当前异常，仅通知记录，并继续推进后续元素执行【onErrorContinue】

**示例**

```java
    /**
     * 吃掉错误，让流继续运行下去，不至于中断，最终流可以正常结束
     */
    @Test
    void onErrorContinue() {
        Flux.just(1, 2, 0, 5)
                .map(i -> "100 / " + i + " = " + (100 / i))
                .doOnError(original -> {
                    System.out.println("original已被记录 = " + original);
                })
                .onErrorContinue((throwable, o) -> {
                    System.out.println("err = " + throwable);
                    System.out.println("val = " + o);
                    System.out.println("发现" + o + "有问题了，继续执行");
                })
                .subscribe(v -> System.out.println("v = " + v),
                        err -> System.out.println("err = " + err),
                        () -> System.out.println("流结束"));
    }
```

###### 1.9 遇到错误，停止流，也阻止后续的恢复操作【onErrorStop】

**示例：**

```java
    /**
     * 操作符	        行为
     * onErrorResume	终止原始流，替换为新的 Publisher（如 Mono.empty()）。
     * onErrorContinue	吞掉错误，继续处理原始流的后续元素（需 Reactor 3.3.0+ 支持）。
     * onErrorStop	    强制错误传播到下游，阻止恢复操作符生效。
     */
    @Test
    void onErrorStop() {
        Flux.just(1, 2, 0, 5, 10, 20, 25, 50)
                .map(i -> "100 / " + i + " = " + (100 / i))
                .onErrorStop() // 强制终止，阻止下游恢复；注意：不能放到onErrorContinue后面，必须在之前，才可以在错误时终止流
                .onErrorContinue((err, o) -> {
                    System.out.println("发现" + o + "有问题了，跳过该元素继续执行");
                })
                .subscribe(
                        v -> System.out.println("v = " + v),
                        err -> System.out.println("err = " + err),
                        () -> System.out.println("流结束")
                );
    }

```

###### 1.10 展示 onError 的终端特性

​	为了演示所有这些操作符在发生错误时都会导致上游原始序列终止，我们可以使用一个更直观的例子来展示 `Flux.interval` 。 `interval` 操作符每隔 x 个时间单位就会以递增的 `Long` 值触发。以下示例使用了一个 `interval` 操作符：

```java
Flux<String> flux =
Flux.interval(Duration.ofMillis(250))
    .map(input -> {
        if (input < 3) return "tick " + input;
        throw new RuntimeException("boom");
    })
    .onErrorReturn("Uh oh");

flux.subscribe(System.out::println);
Thread.sleep(2100); // 注意， interval 默认情况下会在计时器 Scheduler 上执行。如果我们想在主类中运行该示例，就需要在这里添加一个 sleep 调用，以防止应用程序在没有产生任何值的情况下立即退出。
```

​	前面的示例每 250 毫秒打印一行，如下所示：

```java
tick 0
tick 1
tick 2
Uh oh
```

​	即使运行时间多一秒钟，也不会从 `interval` 接收到更多的 tick。序列确实是由错误终止的。

###### 1.9 超时与重试

​	与错误处理相关的另一个有趣的操作符，你可能想在上一个章节描述的情况中使用它。正如其名称所示，它允许你重试产生错误的序列。

​	需要注意的是，它是通过重新订阅上游 `Flux` 来实现的。这实际上是一个不同的序列，原始序列仍然被终止。为了验证这一点，我们可以重用之前的示例，并添加一个 `retry(1)` 来重试一次，而不是使用 `onErrorReturn` 。以下示例展示了如何可以做到这一点：

**示例：**

```java
    @Test
    void retryAndTimeout() {
        Flux.interval(Duration.ofMillis(250))
                .map(input -> {
                    if (input < 3) return "tick " + input;
                    throw new RuntimeException("boom");
                })
                .retry(1) // 把流重头开始再执行一次
                .elapsed() // elapsed 将每个值与其上一个值发出的持续时间相关联。
                .subscribe(System.out::println, System.err::println); // 我们也想看到当出现 onError 时的情况。

        try {
            System.in.read();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
```

​	之前的示例生成了以下输出：

```java
[256,tick 0]
[250,tick 1]
[245,tick 2]
[514,tick 0] // 一个新的 interval 启动了，从 tick 0 开始。额外的 250ms 持续时间来自第 4 个 tick，即导致异常和后续重试的那个 tick。
[250,tick 1]
[245,tick 2]
java.lang.RuntimeException: boom
```

​	如前例所示， `retry(1)` 仅仅重新订阅了原始的 `interval` 一次，从 0 重新启动计时。第二次，由于异常仍然发生，它放弃并向下传播错误。

​	`retry` 有一个更高级的版本（称为 `retryWhen` ），它使用一个“伴随者” `Flux` 来判断是否应该重试特定的失败。这个伴随者 `Flux` 由操作员创建，但由用户装饰，以便自定义重试条件。

​	伴随者 `Flux` 是一个 `Flux<RetrySignal>` ，它被传递给一个 `Retry` 策略/函数，作为 `retryWhen` 的唯一参数。作为用户，您定义该函数并使其返回一个新的 `Publisher<?>` 。 `Retry` 类是一个抽象类，但如果您想使用简单的 lambda（ `Retry.from(Function)` ）转换伴随者，它提供了一个工厂方法。

​	重试周期如下：

1. 每次发生错误（有重试的可能性）时，都会向伴随的 `Flux` 发出一个 `RetrySignal` ，该伴随的 `Flux` 已被您的函数装饰。在这里使用 `Flux` 可以提供一个迄今为止所有尝试的鸟瞰图。 `RetrySignal` 可以访问错误及其相关元数据。
2. 如果伴随的 `Flux` 发出一个值，则会发生重试。
3. 如果伴随的 `Flux` 完成，则错误会被吞没，重试周期停止，结果序列也会完成。
4. 如果伴随的 `Flux` 产生一个错误（ `e` ），则重试周期停止，结果序列会以 `e` 出错。

​	前两种情况之间的区别很重要。仅仅完成伴随操作实际上会吞没错误。考虑以下使用 `retryWhen` 来模拟 `retry(3)` 的方法：

```java
Flux<String> flux = Flux
    .<String>error(new IllegalArgumentException()) // 这会持续产生错误，需要重试尝试
    .doOnError(System.out::println) // 在重试之前使用doOnError可以让我们记录并查看所有失败
    .retryWhen(Retry.from(companion -> // Retry是从一个非常简单的Function lambda中改编的
        companion.take(3))); // 在这里，我们考虑前三个错误为可重试的（take(3)），然后放弃
```

**示例：**

```java
    @Test
    void retryWhenAndTimeout() {
        Mono.fromSupplier(() -> {
                    double random = Math.random();
                    System.out.println("random = " + random);
                    if (random > 0.5) {
                        throw new RuntimeException("服务调用失败");
                    }
                    return "服务调用成功";
                }).retryWhen(Retry
                        .backoff(3, Duration.ofSeconds(1)) // 最大3次重试，初始间隔1秒
                        .maxBackoff(Duration.ofSeconds(10)) // 最大间隔10秒
                        .filter(throwable -> throwable instanceof RuntimeException) // 仅重试IOException
                        .onRetryExhaustedThrow((spec, signal) ->
                                new RuntimeException("重试耗尽，最后错误: " + signal.failure()))
                )
                .subscribe(
                        System.out::println,
                        error -> System.err.println("最终错误: " + error)
                );

        try {
            System.in.read();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
```

输出：

```bash
random = 0.8988159509042778
random = 0.5902249420139738
random = 0.5101870582580813
random = 0.636319441957303
最终错误: java.lang.RuntimeException: 重试耗尽，最后错误: java.lang.RuntimeException: 服务调用失败
```



##### 2 处理操作符或函数中的异常



#### 7 Sinks 汇聚器

​	在 Reactor 中，sink 是一个允许以独立方式安全手动触发信号的类，创建类似于 `Publisher` 的结构，能够处理多个 `Subscriber` （除了 `unicast()` 版本）。

​	在 `3.5.0` 之前，也存在一套 `Processor` 实现，现已逐步淘汰。

##### 1 通过使用 `Sinks.One` 和 `Sinks.Many` 安全地从多个线程生成

#### 10 常用操作

filter、flatMap、concatMap、flatMapMany、transform、defaultIfEmpty、switchIfEmpty、concat、concatWith、merge、mergeWith、mergeSequential、zip、zipWith……

今日内容：

- **Sinks工具类**

  - **单播**
  - **多播**
  - **重放**
  - **背压**
  - **缓存**

- **阻塞式API**

  - block

  ```java
      @Test
      void block() {
          Mono<List<Integer>> listMono = Flux.just(1, 2, 3, 4).map(i -> i + 10).collectList();
          System.out.println(listMono.block());
      }
  ```

- **Context-API**：响应式中的ThreadLocal

  - ThreadLocal机制失效

  ```java
      /**
       * ThreadLocal在响应式编程中无法使用。
       * 响应式中，数据流期间共享数据，Context API: Context: 读写；ContextView：只读。
       * <p>
       * 响应式流的“组装时”与“订阅时”分离
       * Reactor 的操作符（如 map、filter、contextWrite）在组装阶段（定义流时）被声明，但实际执行是在订阅阶段（调用 subscribe() 时）。
       * <p>
       * 上下文的传递是基于订阅的，而订阅是从下游到上游（即从最后一个操作符到第一个操作符）触发的。因此，contextWrite 的生效顺序需要与订阅顺序一致。
       */
      @Test
      void threadlocal() {
          Flux.just(1, 2, 3)
                  .transformDeferredContextual((flux, context) -> {
                      System.out.println("context = " + context);
                      return flux.map(i -> context.get("prefix").toString() + i);
                  })
                  // 上游能拿到下游的最近一次数据
                  .contextWrite(Context.of("prefix", "哈哈")) // ThreadLocal共享了数据，上游的所有人能看到；Context由下游传播给上游
                  .subscribe(v -> System.out.println("v = " + v));
      }
  ```

  - **ParallelFlux**：

    - 并发流

    ```java
        @Test
        void parallelFlux() {
            Flux.range(1, 100)
                    .buffer(10)
                    .parallel(8) // 并行化，8个线程
                    .runOn(Schedulers.newParallel("yy"))
                    .log()
                    .flatMap(Flux::fromIterable)
                    .collectSortedList(Integer::compareTo)
                    .subscribe(v -> System.out.println("v = " + v));
            try {
                System.in.read();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    ```
    

# 第2章 Spring WebFlux

- **Reactor核心**：**HttpHandler** 原生API；

- **DispatcherHandler** 原理；

  - DispatcherHandler 组件分析

  - DispatcherHandler 请求处理流程

  - 返回结果处理

  - 异常处理

  - 视图解析

    - 重定向

    - Rendering

- **注解式 - Controller**

  - 兼容老版本方式

  - **新版本变化**

    - **SSE**

    - **文件上传**

- **错误响应**

  - @ExceptionHandler 

    - ErrorResponse： 自定义 错误响应

    - ProblemDetail：自定义PD返回

- **WebFlux配置**

  - @EnableWebFlux

  - WebFluxConfigurer

>  WebFlux：底层完全基于netty+reactor+springweb 完成一个全异步非阻塞的web**响应式框架**
>
> **底层：异步 + 消息队列(内存) + 事件回调机制 = 整套系统**
>
> **优点：能使用少量资源处理大量请求；**



## 0 组件对比

| API功能      | Servlet-阻塞式Web               | WebFlux-响应式Web                                        |
| ------------ | ------------------------------- | -------------------------------------------------------- |
| 前端控制器   | DispatcherServlet               | DispatcherHandler                                        |
| 处理器       | Controller                      | WebHandler/Controller                                    |
| 请求、响应   | ServletRequest、ServletResponse | ServerWebExchange：ServerHttpRequest、ServerHttpResponse |
| 过滤器       | Filter（HttpFilter）            | WebFilter                                                |
| 异常处理器   | HandlerExceptionResolver        | DispatchExceptionHandler                                 |
| Web配置      | @EnableWebMvc                   | @EnableWebFlux                                           |
| 自定义配置   | WebMvcConfigurer                | WebFluxConfigurer                                        |
| 返回结果     | 任意                            | Mono、Flux、任意                                         |
| 发送REST请求 | RestTemplate                    | WebClient                                                |

## 1 WebFlux

> 底层**基于Netty实现的Web容器**与请求/响应处理机制
>
> 参考：https://docs.spring.io/spring-framework/reference/web-reactive.html
>
> ​	https://docs.spring.io/spring-framework/reference/web/webflux.html
>
> 参考：https://docs.spring.io/spring-boot/reference/web/reactive.html

### 1.1 引入

```xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.4</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <dependencies>
        <!-- 定义三方包 beg -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-webflux</artifactId>
        </dependency>
		</dependencies>
```

> **Context 响应式上下文数据传递； 由下游传播给上游；**
>
> **以前： 浏览器 --> Controller --> Service --> Dao： 阻塞式编程**
>
> <span style="color:red;font-weight:bold;">现在： Dao（数据源查询对象【数据发布者】） --> Service --> Controller --> 浏览器： 响应式</span>



>**大数据流程： 从一个数据源拿到大量数据进行分析计算；**
>
>**ProductVistorDao.loadData()**
>
>   **.distinct()**
>
>​    **.map()**
>
>​    **.filter()**
>
>​     **.handle()**
>
>**.subscribe();**
>
>**;//加载最新的商品浏览数据**

![spring mvc and webflux venn](images/spring-mvc-and-webflux-venn.png)

![image-20250329213530701](images/image-20250329213530701.png)

##### 1.2 Reactor Core

###### 1.2.1 HttpHandler、HttpServer

```java
package com.coding.boot3.webflux;

import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.http.server.reactive.HttpHandler;
import org.springframework.http.server.reactive.ReactorHttpHandlerAdapter;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import reactor.core.publisher.Mono;
import reactor.netty.http.server.HttpServer;

import java.io.IOException;

public class FluxMainApplication {
    public static void main(String[] args) {
        // 快速自己编写一个能处理请求的服务器
        // 1、创建一个能处理 http 请求的处理器；参数：请求、响应；返回值：Mono<Void>：代表处理完成的信号
        HttpHandler httpHandler = (ServerHttpRequest request, ServerHttpResponse response) -> {
            // 编写请求处理的业务
            System.out.println(Thread.currentThread() + " 请求路径：" + request.getURI());
//            response.getHeaders(); // 获取响应头
//            response.getCookies(); // 获取Cookie
//            response.getStatusCode(); // 获取响应状态码
//            response.bufferFactory(); // buffer工厂
//            // response.writeWith(null); // 把XXX写出去
//            response.setComplete(); // 响应完成

            // 数据的发布者：Mono<DataBuffer>、Flux<DataBuffer>
            DataBufferFactory dataBufferFactory = response.bufferFactory();
            // 创建一个数据缓冲区
            DataBuffer dataBuffer = dataBufferFactory.wrap("Hello, Spring Boot 3.0".getBytes());
            // 创建一个响应体，把数据缓冲区写入响应中
            Mono<DataBuffer> mono = Mono.just(dataBuffer);
            // 需要一个 DataBuffer 的发布者
            return response.writeWith(mono);
        };

        // 2、启动一个服务器，监听8080端口，接收数据，拿到数据交给 HttpHandler 进行请求处理
        ReactorHttpHandlerAdapter adapter = new ReactorHttpHandlerAdapter(httpHandler);

        // 3、启动Netty服务器
        String host = "localhost";
        int port = 8080;
        HttpServer.create().host(host).port(port).handle(adapter).bindNow(); // 现在就绑定
        try {
            System.out.println("服务器启动成功，访问地址：http://" + host + ":" + port);
            System.in.read();
            System.out.println("服务器停止......");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

```

##### 1.3 DispatcherHandler

> SpringMVC： DispatcherServlet；
>
> SpringWebFlux： DispatcherHandler

###### 1.3.1 请求处理流程

- HandlerMapping：**请求映射处理器**； 保存每个请求由哪个方法进行处理
- HandlerAdapter：**处理器适配器**；反射执行目标方法
- HandlerResultHandler：**处理器结果**处理器；



SpringMVC： DispatcherServlet 有一个 doDispatch() 方法，来处理所有请求；

WebFlux： DispatcherHandler 有一个 handle() 方法，来处理所有请求；

- DispatcherHandler.handle 核心代码逻辑

```java
	@Override
	public Mono<Void> handle(ServerWebExchange exchange) {
		if (this.handlerMappings == null) {
			return createNotFoundError();
		}
		if (CorsUtils.isPreFlightRequest(exchange.getRequest())) {
			return handlePreFlight(exchange);
		}
		return Flux.fromIterable(this.handlerMappings) // 拿到所有的 handlerMappings
				.concatMap(mapping -> mapping.getHandler(exchange)) // 找每一个 mapping 看谁能处理请求
				.next() // 直接触发获取元素，找到第一个能处理这个请求的 handler
				.switchIfEmpty(createNotFoundError()) // 如果没拿到这个元素，则响应404错误
				.onErrorResume(ex -> handleResultMono(exchange, Mono.error(ex))) // 异常处理，一旦前面发生异常，调用处理异常
				.flatMap(handler -> handleRequestWith(exchange, handler)); // 调用方法处理请求，得到响应结果
	}

```

- DispatcherHandler.createNotFoundError

```java
	private <R> Mono<R> createNotFoundError() {
		return Mono.defer(() -> {
			Exception ex = new ResponseStatusException(HttpStatus.NOT_FOUND);
			return Mono.error(ex);
		}); // defer 方法只有在订阅（subscribe()）时才会触发 Mono 的创建逻辑，防止在声明阶段就固定数据
	}
```

- 1、请求和响应都封装在 ServerWebExchange 对象中，由handle方法进行处理
- 2、如果没有任何的请求映射器； 直接返回一个： 创建一个未找到的错误； 404； 返回Mono.error；终结流
- 3、跨域工具，是否跨域请求，跨域请求检查是否复杂跨域，需要预检请求；
- 4、Flux流式操作，先找到HandlerMapping，再获取handlerAdapter，再用Adapter处理请求，期间的错误由onErrorResume触发回调进行处理；

源码中的核心两个：

- **handleRequestWith**： 编写了handlerAdapter怎么处理请求
- **handleResult**： String、User、ServerSendEvent、Mono、Flux ...

concatMap： 先挨个元素变，然后把变的结果按照之前元素的顺序拼接成一个完整流

##### 1.4 注解开发

###### 1.4.1 目标方法传参

https://docs.spring.io/spring-framework/reference/web/webflux/controller/ann-methods/arguments.html

| Controller method argument                                   | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ServerWebExchange                                            | 封装了请求和响应对象的对象; 自定义获取数据、自定义响应       |
| ServerHttpRequest, ServerHttpResponse                        | 请求、响应                                                   |
| WebSession                                                   | 访问Session对象                                              |
| java.security.Principal                                      | 当前认证用户                                                 |
| org.springframework.http.HttpMethod                          | 请求方式                                                     |
| java.util.Locale                                             | 国际化                                                       |
| java.util.TimeZone + java.time.ZoneId                        | 时区                                                         |
| @PathVariable                                                | 路径变量                                                     |
| @MatrixVariable                                              | 矩阵变量                                                     |
| @RequestParam                                                | 请求参数                                                     |
| @RequestHeader                                               | 请求头；                                                     |
| @CookieValue                                                 | 获取Cookie                                                   |
| @RequestBody                                                 | 获取请求体，Post、文件上传                                   |
| HttpEntity`<B>`                                                | 封装后的请求对象                                             |
| @RequestPart                                                 | 获取文件上传的数据 multipart/form-data.                      |
| java.util.Map, org.springframework.ui.Model, and org.springframework.ui.ModelMap. | Map、Model、ModelMap                                         |
| @ModelAttribute                                              | 用于访问模型中现有的属性（如果不存在则实例化），并应用数据绑定和验证。 |
| Errors, BindingResult                                        | 数据校验，封装错误                                           |
| SessionStatus + class-level @SessionAttributes               | 用于标记表单处理完成，这会触发通过类级别的 `@SessionAttributes` 注解声明的会话属性的清理 |
| UriComponentsBuilder                                         | For preparing a URL relative to the current request’s host, port, scheme, and context path. See [URI Links](https://docs.spring.io/spring-framework/reference/6.0/web/webflux/uri-building.html). |
| @SessionAttribute                                            | 用于访问任何会话属性                                         |
| @RequestAttribute                                            | 转发请求的请求域数据                                         |
| Any other argument                                           | 所有对象都能作为参数：1、基本类型 ，等于标注@RequestParam 2、对象类型，等于标注 @ModelAttribute |

###### 1.4.2 返回值写法

sse和websocket区别：

- SSE：单工；请求过去以后，等待服务端源源不断的数据
- websocket：双工： 连接建立后，可以任何交互；

| Controller method return value                               | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| @ResponseBody                                                | 把响应数据写出去，如果是对象，可以自动转为json               |
| HttpEntity`<B>`, ResponseEntity`<B>`                             | ResponseEntity：支持快捷自定义响应内容                       |
| HttpHeaders                                                  | 没有响应内容，只有响应头                                     |
| ErrorResponse                                                | 快速构建错误响应                                             |
| ProblemDetail                                                | SpringBoot3；                                                |
| String                                                       | 就是和以前的使用规则一样；forward: 转发到一个地址redirect: 重定向到一个地址配合模板引擎 |
| View                                                         | 直接返回视图对象                                             |
| java.util.Map, org.springframework.ui.Model                  | 以前一样                                                     |
| @ModelAttribute                                              | 以前一样                                                     |
| Rendering                                                    | 新版的页面跳转API； 不能标注 @ResponseBody 注解              |
| void                                                         | 仅代表响应完成信号                                           |
| Flux`<ServerSentEvent>`, Observable`<ServerSentEvent>`, or other reactive type | 使用  text/event-stream 完成SSE效果                          |
| Other return values                                          | 未在上述列表的其他返回值，都会当成给页面的数据；             |

##### 1.5 文件上传

https://docs.spring.io/spring-framework/reference/web/webflux/controller/ann-methods/multipart-forms.html

- 以前的方式

```java
class MyForm {

	private String name;

	private MultipartFile file;

	// ...

}

@Controller
public class FileUploadController {

	@PostMapping("/form")
	public String handleFormUpload(MyForm form, BindingResult errors) {
		// ...
	}

}
```

- 新版

```java
@PostMapping("/")
public String handle(@RequestPart("meta-data") Part metadata, // 使用 @RequestPart 获取元数据。
		@RequestPart("file-data") FilePart file // 使用 @RequestPart 获取文件。
                    ) {
	// ...
}
```

##### 1.6 错误处理

```java
    @ExceptionHandler(ArithmeticException.class)
    public String handleException(ArithmeticException e) {
        System.out.println("GlobalExceptionHandler.handleException 发生了数学运算异常" + e);
        // 返回这些进行错误处理
//        ProblemDetail
//        ErrorResponse
        return "炸了，哈哈";
    }
```

##### 1.7 RequestContext

##### 1.8 自定义Flux配置

- WebFluxConfigurer

```java
package com.coding.boot3.webflux.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;

@Configuration

public class MyWebFluxConfigurer {

    // 配置底层
    @Bean
    public WebFluxConfigurer webFluxConfigurer() {
        return new WebFluxConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedHeaders("*")
                        .allowedMethods("*")
                        .allowedOrigins("localhost");
            }
        };
    }

}

```

##### 1.9 Filter

```java
package com.coding.boot3.webflux.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class MyWebFilter implements WebFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();

        System.out.println("请求处理放行到目标方法之前...");
        Mono<Void> voidMono = chain.filter(exchange)
                .doOnError(throwable -> {
                    System.out.println("请求处理过程中出现异常...");
                })
                .doFinally(signalType -> {
                    System.out.println("请求处理放行到目标方法之后...");
                });

        return voidMono;
    }
}

```



# 第3章 R2DBC

## 3.1 R2DBC

Web、网络、IO（存储）、中间件（Redis、MySQL）

应用开发：

- 网络
- **存储**：MySQL、Redis
- **Web**：Webflux
- 前端； 后端：Controller -- Service -- Dao（r2dbc；mysql）



数据库：

- **导入驱动**； 以前：JDBC（jdbc、各大驱动mysql-connector）； 现在：r2dbc（[r2dbc-spi](https://github.com/r2dbc/r2dbc-spi)、各大驱动 r2dbc-mysql）
- **驱动**：

- 获取连接
- 发送SQL、执行
- 封装数据库返回结果



今日任务：

- r2dbc原生API：https://r2dbc.io
- boot整合spring data r2dbc：spring-boot-starter-data-r2dbc
- 三大组件：R2dbcRepository、R2dbcEntityTemplate 、DatabaseClient
- RBAC权限模型导入，基础CRUD练习；SQL文件在附录
- 1-1，1-N 关系处理；
- 扩展：导入接口文档进行测试： 访问 项目/doc.html

```xml
        <!-- https://mvnrepository.com/artifact/org.springdoc/springdoc-openapi-starter-webflux-ui -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webflux-ui</artifactId>
            <version>2.8.5</version>
        </dependency>
```

## 3.1 R2DBC

> 用法：
>
> 1、导入驱动: 导入连接池（[r2dbc-pool](https://github.com/r2dbc/r2dbc-pool)）、导入驱动（[r2dbc-mysql](https://github.com/asyncer-io/r2dbc-mysql) ）
>
> 2、使用驱动提供的API操作

```xml
        <!-- https://mvnrepository.com/artifact/io.asyncer/r2dbc-mysql -->
        <dependency>
            <groupId>io.asyncer</groupId>
            <artifactId>r2dbc-mysql</artifactId>
            <version>1.4.0</version>
        </dependency>
        <!--主动引入mac下arm版的jar依赖包，默认是osx-x86_64-->
        <dependency>
            <groupId>io.netty</groupId>
            <artifactId>netty-resolver-dns-native-macos</artifactId>
            <version>4.1.119.Final</version>
            <classifier>osx-aarch_64</classifier>
        </dependency>
```

```java
    @Test
    void namedQuery() throws IOException {
        // 1、获取连接工厂；注意：查询字符串必须进行URL编码
        ConnectionFactory connectionFactory = ConnectionFactories.get("r2dbc:mysql://root:root123@127.0.0.1:3306/r2dbc");


        // 2、获取到连接，发送sql
        Mono<Connection> connectionMono = Mono.from(connectionFactory.create());

        connectionMono.flatMapMany(connection ->
                        connection.createStatement("SELECT * FROM t_author where id=?id and name=?name ").bind("id", 1L).bind("name", "张三").execute())
                .flatMap(result -> result.map((row, rowMetadata) -> {
                            TAuthor tAuthor = new TAuthor();
                            tAuthor.setId(row.get("id", Long.class));
                            tAuthor.setName(row.get("name", String.class));
                            return tAuthor;
                        })
                ).subscribe(author -> System.out.println("author = " + author));

        System.in.read();
    }

```

### 3.2 Spring Data R2DBC

> 提升生产力方式的响应式数据库操作

### 3.2.0 整合

1、导入依赖

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-r2dbc</artifactId>
        </dependency>
        <!-- https://mvnrepository.com/artifact/io.asyncer/r2dbc-mysql -->
        <dependency>
            <groupId>io.asyncer</groupId>
            <artifactId>r2dbc-mysql</artifactId>
            <version>1.4.0</version>
        </dependency>
        <!--主动引入mac下arm版的jar依赖包，默认是osx-x86_64-->
        <dependency>
            <groupId>io.netty</groupId>
            <artifactId>netty-resolver-dns-native-macos</artifactId>
            <version>4.1.119.Final</version>
            <classifier>osx-aarch_64</classifier>
        </dependency>
```

2、编写配置

```properties
spring.r2dbc.url=r2dbc:mysql://localhost:3306/r2dbc
spring.r2dbc.username=root
spring.r2dbc.password=root123
```

### 3.2.1 声明式接口：R2dbcRepository

- Repository接口

```java
@Repository
public interface BookRepositories extends R2dbcRepository<TBook, Long> {
    // 默认继承了一堆CRUD方法；类似 mybatis-plus 的 IService 接口

    // 不推荐直接使用 ? 占位符；推荐使用 :name 形式的命名参数
    /*@Query("""
            select tb.*, ta.name from t_book tb\s
            left join t_author ta on ta.id = tb.author_id\s
            where tb.id = ?;""")*/
    @Query("""
            select tb.*, ta.name from t_book tb\s
            left join t_author ta on ta.id = tb.author_id\s
            where tb.id = :bookId;""")
    Mono<TBook> findBookAndAuthor(Long bookId);
}
```

- 自定义Converter

```java
@ReadingConverter  // 读取数据库数据的时候，把Row转换为TBook
public class BookReadConverter implements Converter<Row, TBook> {

    @Override
    public TBook convert(Row source) {
        // 自定义结果集的封装
        TBook tBook = new TBook();
        tBook.setId(source.get("id", Long.class));
        tBook.setTitle(source.get("title", String.class));
        tBook.setAuthorId(source.get("author_id", Long.class));
        tBook.setPublishTime(source.get("publish_time", LocalDateTime.class));
        if (source.getMetadata().contains("name")) {
            tBook.setAuthor(new TAuthor(source.get("author_id", Long.class), source.get("name", String.class)));
        }
        return tBook;
    }
}
```

- 配置生效

```java
@EnableR2dbcRepositories // 启用R2DBC仓库
@Configuration
public class R2dbcConfiguration {

    @Bean
    public R2dbcCustomConversions r2dbcCustomConversions(ConnectionFactory connectionFactory) {
        // return R2dbcCustomConversions.of(MySqlDialect.INSTANCE, new BookReadConverter());
        R2dbcDialect dialect = DialectResolver.getDialect(connectionFactory);
        // 假如自定义的转换器，需要知道当前数据库的方言；效果是：新增了我们自定义的转换器，保留了之前的转换器
        return R2dbcCustomConversions.of(dialect, new BookReadConverter());
    }
}
```

### 3.2.2 编程式组件

1. R2dbcEntityTemplate
2. DatabaseClient

## 3.3 RBAC-SQL联系

### 3.3.1 1-1

- 自定义 Converter<Row, Bean> 方式

  - R2dbcRepository接口方法定义

  ```java
  @Repository
  public interface BookRepositories extends R2dbcRepository<TBook, Long> {
      // 默认继承了一堆CRUD方法；类似 mybatis-plus 的 IService 接口
  
      // 不推荐直接使用 ? 占位符；推荐使用 :name 形式的命名参数
      /*@Query("""
              select tb.*, ta.name from t_book tb\s
              left join t_author ta on ta.id = tb.author_id\s
              where tb.id = ?;""")*/
      @Query("""
              select tb.*, ta.name from t_book tb\s
              left join t_author ta on ta.id = tb.author_id\s
              where tb.id = :bookId;""")
      Mono<TBook> findBookAndAuthor(Long bookId);
  }
  ```

  - 转换器定义

  ```java
  @ReadingConverter  // 读取数据库数据的时候，把Row转换为TBook
  public class BookReadConverter implements Converter<Row, TBook> {
  
      @Override
      public TBook convert(Row source) {
          // 自定义结果集的封装
          TBook tBook = new TBook();
          tBook.setId(source.get("id", Long.class));
          tBook.setTitle(source.get("title", String.class));
          tBook.setAuthorId(source.get("author_id", Long.class));
          tBook.setPublishTime(source.get("publish_time", LocalDateTime.class));
          if (source.getMetadata().contains("name")) {
              tBook.setAuthor(new TAuthor(source.get("author_id", Long.class), source.get("name", String.class)));
          }
          return tBook;
      }
  }
  ```

- 编程式封装方式：使用DatabaseClient

```java
    @Test
    void booAndAuthor2() throws InterruptedException {
        client.sql("""
                        select tb.*, ta.name from t_book tb\s
                        left join t_author ta on ta.id = tb.author_id\s
                        where tb.id = :bookId;""")
                .bind("bookId", 1L)
                .fetch()
                .all()
                .map(row -> {
                    TBook tBook = new TBook();
                    tBook.setId(Long.parseLong(row.get("id").toString()));
                    tBook.setTitle(row.get("title").toString());
                    tBook.setAuthorId(Long.parseLong(row.get("author_id").toString()));
                    tBook.setPublishTime(LocalDateTime.parse(row.get("publish_time").toString()));
                    tBook.setAuthor(new TAuthor(Long.parseLong(row.get("author_id").toString()), row.get("name").toString()));
                    return tBook;
                })
                .subscribe(System.out::println);
        TimeUnit.SECONDS.sleep(1);
    }
```



### 3.3.2 1-N

```java
    @Test
    void oneToN() throws InterruptedException {
        client.sql("""
                        select ta.name, tb.* from t_author ta\s
                        left join t_book tb on tb.author_id = ta.id\s
                        where tb.id is not null and ta.id = :authorId\s
                        order by ta.id
                        """)
                .bind("authorId", 2L)
                .fetch().all()
                .bufferUntilChanged(rowMap -> rowMap.get("author_id").toString())
                .map(list -> {
                    TAuthor tAuthor = new TAuthor();
                    tAuthor.setId(Long.parseLong(list.get(0).get("author_id").toString()));
                    tAuthor.setName(list.get(0).get("name").toString());

                    List<TBook> books = list.stream().map(rowMap ->
                            new TBook(Long.parseLong(rowMap.get("id").toString()),
                                    rowMap.get("title").toString(),
                                    Long.parseLong(rowMap.get("author_id").toString()),
                                    LocalDateTime.parse(rowMap.get("publish_time").toString()))).toList();
                    tAuthor.setBooks(books);
                    return tAuthor;
                })
                .subscribe(System.out::println);
        TimeUnit.SECONDS.sleep(1);
    }
```

## 3.4 最佳实践

最佳实践：  提升生产效率的做法

- 1、Spring Data R2DBC，基础的CRUD用 **R2dbcRepository** 提供好了
- 2、自定义复杂的SQL（**单表**）： **@Query**；
- 3、**多表查询复杂结果集**： **DatabaseClient** 自定义SQL及结果封装；
  - **@Query + 自定义 Converter 实现结果封装**；

**经验：**

- **1-1:1-N 关联关系的封装都需要自定义结果集的方式**

  - **Spring Data R2DBC：** 

    - **自定义Converter指定结果封装**

    - **DatabaseClient：贴近底层的操作进行封装; 见下面代码**

  - **MyBatis：自定义 ResultMap 标签去来封装**





# 第4章 Spring Security Reactive

[官方网站](https://docs.spring.io/spring-security/reference/reactive/getting-started.html)

目标：

SpringBoot +  Webflux + Spring Data R2DBC + Spring Security

今日任务：

- RBAC权限模型
- WebFlux配置：@EnableWebFluxSecurity、@EnableReactiveMethodSecurity
- SecurityFilterChain 组件
- AuthenticationManager  组件
- UserDetailsService  组件
- 基于注解的方法级别授权

## 4.1 整合

```xml
    <dependencies>
        <!-- 定义三方包 beg -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-webflux</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-r2dbc</artifactId>
        </dependency>
        <dependency>
            <groupId>io.asyncer</groupId>
            <artifactId>r2dbc-mysql</artifactId>
        </dependency>
        <!--主动引入mac下arm版的jar依赖包，默认是osx-x86_64，可解决：nable to load io.netty.resolver.dns.macos.MacOSDnsServerAddressStreamProvider, fallback to system defaults. -->
        <dependency>
            <groupId>io.netty</groupId>
            <artifactId>netty-resolver-dns-native-macos</artifactId>
            <classifier>osx-aarch_64</classifier>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
</dependencies>
```



## 4.2 开发

### 4.2.1 应用安全

- **防止攻击**：
  - DDos、CSRF、XSS、SQL注入...

- **控制权限**
  - 登录的用户能干什么。
  - 用户登录系统以后要控制住用户的所有行为，防止越权；

- 传输加密
  - https
  - X509

- 认证：
  - OAuth2.0
  - JWT


### 4.2.2 RBAC权限模型

Role Based Access Controll： 基于角色的访问控制

一个网站有很多**用户**： zhangsan

每个用户可以有很多**角色**：

一个角色可以关联很多**权限**：

一个人到底能干什么？

权限控制：

- 找到这个人，看他有哪些角色，每个角色能拥有哪些**权限**。  这个人就拥有一堆的 **角色** 或者 **权限**
- 这个人执行方法的时候，我们给方法规定好权限，由权限框架负责判断，这个人是否有指定的权限



所有权限框架：

- 让用户登录进来：  **认证（authenticate）**：用账号密码、各种其他方式，先让用户进来
- 查询用户拥有的所有角色和权限： **授权（authorize）**： 每个方法执行的时候，匹配角色或者权限来判定用户是否可以执行这个方法

导入Spring Security：默认效果

## 4.3 认证

### 4.3.1 静态资源放行

### 4.3.2 其他请求需要登录

```java
package com.coding.boot3.integrated.config;

import com.coding.boot3.integrated.component.AppReactiveUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.reactive.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@EnableReactiveMethodSecurity // 开启方法权限控制
@EnableWebFluxSecurity
@Configuration
public class AppSecurityConfiguration {

    @Autowired
    AppReactiveUserDetailsService userDetailsService;

    @Bean
    SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

        // 1、定义哪些请求需要认证
        http.authorizeExchange(exchanges ->
                exchanges
                        // 1.1、允许所有人都可以访问静态资源
                        .matchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                        // 1.2、剩下的所有请求都需要认证（登录）
                        .anyExchange().authenticated()
        );
        // 2、开启默认的表单登录
        http.formLogin(withDefaults());
        // 3、关闭CSRF（跨站请求伪造）
        http.csrf(ServerHttpSecurity.CsrfSpec::disable);

        /*
        目前认证：用户名是 user，密码是默认生成的并输出到控制台日志
        期望认证：去数据库查用户名和密码
         */
        // 4、配置认证规则：如何去数据库查询到用户；Spring Security底层使用 ReactiveAuthenticationManager 去查询用户信息
        http.authenticationManager(new UserDetailsRepositoryReactiveAuthenticationManager(userDetailsService));
        // 构建出安全配置
        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}

```





<img src="./images/image-20250405233327450.png" alt="image-20250405233327450" style="zoom:50%;" />

这个界面点击登录，最终Spring Security 框架会使用 ReactiveUserDetailsService 组件，按照表单提交的用户名去**数据库查询**这个**用户详情**（**基本信息**[账号、密码]，**角色**，**权限**）；

把数据库中返回的 **用户详情** 中的密码 和 表单提交的密码进行比对。比对成功则登录成功；

```java
@Component
public class AppReactiveUserDetailsService implements ReactiveUserDetailsService {

    @Autowired
    DatabaseClient databaseClient;

    // 自定义如何按照用户名取数据库查询用户信息
    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return Mono.from(databaseClient.sql("""
                        select tu.*, tr.id rid, tr.name rname, tr.value rvalue, tp.id as pid, tp.value as pvalue, tp.uri, tp.description  from t_user tu\s
                        left join t_user_role tur on tur.user_id = tu.id\s
                        left join t_roles tr on tr.id = tur.role_id\s
                        left join t_role_perm trp on trp.role_id  = tr.id\s
                        left join t_perm tp on tp.id = trp.perm_id\s
                        where tu.username = :username
                        order by tu.username, tr.id, tp.id
                        """).bind("username", username)
                .fetch()
                .all()
                .bufferUntilChanged(rowMap -> rowMap.get("username").toString())
                .map(list -> {
                        /*
                            1、不要混用 roles() 和 authorities()，顺序靠后者会覆盖前者。（哪怕只是 authorities() 执行2次，后者也会覆盖前者）
                            2、角色本质是权限：hasRole('admin') 等价于检查 ROLE_admin 权限。
                            3、最佳实践：统一用 authorities() 显式设置所有权限（包括角色），避免隐式行为。
                         */
                    // 如何同时支持角色和权限？
                    User.UserBuilder userBuilder = User.builder().username(list.get(0).get("username").toString())
                            .password(list.get(0).get("password").toString());
                    Collection<? extends GrantedAuthority> roles = userBuilder.roles(list.stream().map(rowMap -> rowMap.get("rname").toString()).distinct().toArray(String[]::new)).build().getAuthorities();
                    Collection<? extends GrantedAuthority> authorities = userBuilder.authorities(list.stream().map(rowMap -> rowMap.get("pvalue").toString()).distinct().toArray(String[]::new)).build().getAuthorities();
                    Collection<SimpleGrantedAuthority> all = new ArrayList<>();

                    roles.forEach(role -> {
                        if (role instanceof SimpleGrantedAuthority simpleGrantedAuthority) {
                            all.add(simpleGrantedAuthority);
                        }
                    });
                    authorities.forEach(role -> {
                        if (role instanceof SimpleGrantedAuthority simpleGrantedAuthority) {
                            all.add(simpleGrantedAuthority);
                        }
                    });

                    return userBuilder.authorities(all).build();
                }));
    }
}
```



## 4.4 授权

@EnableReactiveMethodSecurity // 开启方法权限控制

```java
package com.coding.boot3.integrated.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class HelloController {

    @PreAuthorize("hasRole('admin')")
    @GetMapping("/hello")
    public Mono<String> hello() {
        return Mono.just("Hello World");
    }

    @PreAuthorize("hasAuthority('download')")
    @GetMapping("/world")
    public Mono<String> world() {
        return Mono.just("World");
    }

}
```

# 补充说明

## 1 模块 `spring-boot-3.x/boot3-20-ai/app` 打开方式

请使用 WebStorm 打开该文件开发前端
