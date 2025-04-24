# backend-spring-learning

[Spring的官网](https://spring.io/)



[SpringFramework的官网](https://spring.io/projects/spring-framework)

[SpringFramework的GitHub](https://github.com/spring-projects/spring-framework)

[Spring5框架教程](https://www.bilibili.com/video/BV1Vf4y127N5/?vd_source=b850b3a29a70c8eb888ce7dff776a5d1)



[SpringBoot的官网](https://spring.io/projects/spring-boot)

[SpringBoot的发布日志](https://github.com/spring-projects/spring-boot/wiki#release-notes)

注意：如下的current是2.7.5版本，如果找不到，可以替换  current=>2.7.5

[SpringBoot属性配置清单](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#appendix.application-properties)

[SpringBoot的依赖清单](https://docs.spring.io/spring-boot/docs/current/reference/html/dependency-versions.html#appendix.dependency-versions)

[SpringBoot的错误处理机制](https://docs.spring.io/spring-boot/docs/current/reference/html/web.html#web.servlet.spring-mvc.error-handling)

[SpringBoot的原生组件Servlet、Filter、Listener](https://docs.spring.io/spring-boot/docs/current/reference/html/web.html#web.servlet.embedded-container.servlets-filters-listeners)

[SpringBoot的Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator)

[SpringBoot的Configuration讲解](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config.files)

[SpringBootStarter](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.build-systems.starters)

[SpringApplication事件](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.spring-application)

[SpringBootAdmin](https://github.com/codecentric/spring-boot-admin)

[SpringBootAdmin文档](https://codecentric.github.io/spring-boot-admin/2.7.5/)

[SpringBoot的GitHub](https://github.com/spring-projects/spring-boot)

[SpringBoot的教程](https://www.bilibili.com/video/BV1xy4y1J7k7?p=1&vd_source=b850b3a29a70c8eb888ce7dff776a5d1)

[Thymeleaf官网](https://www.thymeleaf.org/)



[SpringCloud文档列表](https://docs.spring.io/spring-cloud/docs)

注意：如下的current是2021.0.x（比如2021.0.5）

[SpringCloud组件文档列表](https://docs.spring.io/spring-cloud/docs/2021.0.x/reference/html/)



[SpringBoot的第二部分](https://www.bilibili.com/video/BV1S7411S7bW/?spm_id_from=333.337.search-card.all.click&vd_source=b850b3a29a70c8eb888ce7dff776a5d1)

[雷丰阳谷粒商城](https://www.bilibili.com/video/BV1rK4y1C7fv/?spm_id_from=333.337.search-card.all.click&vd_source=b850b3a29a70c8eb888ce7dff776a5d1)

[微服务Martinfowler](https://martinfowler.com/articles/microservices.html)

[雷丰阳ES7](https://www.bilibili.com/video/BV1py4y1r7Ar/?spm_id_from=333.337.search-card.all.click&vd_source=b850b3a29a70c8eb888ce7dff776a5d1)

[雷丰阳注解驱动](https://www.bilibili.com/video/BV1gW411W7wy/?spm_id_from=333.337.search-card.all.click&vd_source=b850b3a29a70c8eb888ce7dff776a5d1)



[Junit5官网](https://junit.org/junit5/)

[Junit5文档](https://junit.org/junit5/docs/current/user-guide/)



[SpringBoot的教程2.7版](https://www.bilibili.com/video/BV1rv4y1c7f8/?spm_id_from=333.788.recommend_more_video.2&vd_source=b850b3a29a70c8eb888ce7dff776a5d1)





https://www.bilibili.com/video/BV1mm4y1X7Hc/?spm_id_from=333.788.recommend_more_video.0



https://www.bilibili.com/video/BV1xy4y1J7k7/?p=32&spm_id_from=pageDriver&vd_source=b850b3a29a70c8eb888ce7dff776a5d1

https://www.bilibili.com/video/BV1MU4y1C7w1/?spm_id_from=333.788.recommend_more_video.0&vd_source=b850b3a29a70c8eb888ce7dff776a5d1

## Spring Framework五大功能模块

| 功能模块                | 功能介绍                                                |
| ----------------------- | ------------------------------------------------------- |
| Core Container          | 核心容器，在Spring环境下使用任何功能都必须基于IOC容器。 |
| AOP&Aspects             | 面向切面编程                                            |
| Testing                 | 提供了对Junit或TestNG测试框架的整合。                   |
| Data Access/Integration | 提供了对数据访问/集成的功能。                           |
| Spring MVC              | 提供了面向Web应用程序的集成功能。                       |

## 普通参数与基本注解

- 注解
  - @PathVariable
  - @RequestHeader
  - @ModelAttribute
  - @RequestParam
  - @MatrixVariable
  - @CookieValue
  - @RequestBody

- Servlet API
  - WebRequest
  - ServletRequest
  - MultipartRequest
  - HttpSession
  - javax.servlet.http.PushBuilder
  - Principal
  - InputStream
  - Reader
  - HttpMethod
  - Locale
  - TimeZone
  - ZoneId
- 复杂参数
  - Map
  - Errors/BindingResult
  - Model
  - RedirectAttributes
  - 
  - ServletResponse
  - SessionStatus
  - UriComponentsBuilder
  - ServletUriComponentsBuilder
- 自定义对象参数

可以自动类型转换与格式化，可以级联封装。

