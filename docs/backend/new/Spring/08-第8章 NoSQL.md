# 第8章 NoSQL

## 8.1 场景整合

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

## 8.2 自动配置原理

1. <span style="color:red;">`META-INF/spring/org.springframework.boott.autoconfigure.AutoConfiguration.imports`</span>中导入了<span style="color:red;">`RedisAutoConfiguration`</span>、<span style="color:red;">`RedisReactiveAutoConfiguration`</span>和<span style="color:red;">`RedisRepositoriesAutoConfiguration`</span>。所有属性绑定<span style="color:red;">`RedisProperties`</span>中。
2. <span style="color:red;">`RedisReactiveAutoConfiguration`</span>属于响应式编程，不用管。<span style="color:red;">`RedisRepositoriesAutoConfiguration`</span>属于JPA操作，也不用管。
3. <span style="color:red;">`RedisAutoConfiguration`</span>配置了以下组件：
   1. <span style="color:red;">`LettuceConnectionConfiguration`</span>：给容器中注入了连接工厂<span style="color:red;">`LettuceConnectionFactory`</span>，和操作redis的客户端<span style="color:red;">`DefaultClientResources`</span>。
   2. <span style="color:red;">`RedisTemplate<Object, Object>`</span>：可给redis中存储任意对象，会使用jdk默认序列化方式。
   3. <span style="color:red;">`StringRedisTemplate`</span>：给redis中存储字符串，如果要存储对象，需要开发人员自己进行序列化。**key-value都必须是字符串**进行操作。

## 8.3 定制化

### 8.3.1 序列化机制

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

### 8.3.2 redis客户端

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

### 8.3.3 配置参考

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

