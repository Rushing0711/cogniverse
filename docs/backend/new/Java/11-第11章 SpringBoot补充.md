# 第11章 SpringBoot补充

## 11.1 监控 spring-boot-starter-actuator

- 如何引入？

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
```

- 如何开放endpoint(s)

```yml
management:
  endpoint:
    shutdown:
      enabled: true # 最特殊的监控端点
  endpoints:
    web:
      exposure:
        include: "*" # 打开所有的监控点
```

- 如何访问：http://ip:port/{context-path}/actuator

- 分类：
  - 应用配置类常用监控：`/actuator/info`, `/actuator/beans`, `/actuator/mappings`
  - 度量指标类常用监控：`/actuator/health`, `/actuator/threaddump`
  - 操作控制类常用监控：`/actuator/shutdown`（POST）

```bash
curl -X POST "http://localhost:8080/actuator/shutdown"
```

## 11.2 feign打开日志

https://blog.csdn.net/youbl/article/details/109047987
