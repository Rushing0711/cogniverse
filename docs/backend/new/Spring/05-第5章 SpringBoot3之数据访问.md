# 第5章 SpringBoot3之数据访问

> SpringBoot 整合 `Spring`、`SpringMVC`、`MyBatis`进行**数据访问场景**开发

## 5.1 创建SSM整合项目

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



