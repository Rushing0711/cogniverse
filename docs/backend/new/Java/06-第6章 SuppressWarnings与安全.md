# 第6章 SuppressWarnings与安全

## 6.1 @SuppressWarnings注解用法详解

@SuppressWarnings批注允许你选择性地取消特定代码段中的警告。

### 抑制单类型警告

```java
@Test
@SuppressWarnings("unused")
public void testRmdir(){
    try {
        boolean ok = ftpHelper.ftpClient.removeDirectory("src1");
        String s = "";
    } catch(IOException e){
        e.printStackTrace();
    }
}
```

### 抑制多类型警告

```java
@SuppressWarnings(value={"unchecked", "rawtypes"})
public void addItems(String item) {
    List items = new ArrayList();
    items.add(item);
}
```

### 抑制所有类型警告

```java
@SuppressWarnings("all")
public void addItems(String item) {
    List items = new ArrayList();
    items.add(item);
}
```

### @SuppressWarnings的value值

| 关键字                   | 用途                                                         |
| ------------------------ | ------------------------------------------------------------ |
| all                      | 抑制所有警告                                                 |
| boxing                   | 抑制装箱/拆箱操作时的警告                                    |
| cast                     | 抑制映射相关的警告                                           |
| deprecation              | 抑制过期方法警告                                             |
| fallthrough              | 抑制switch缺失break警告                                      |
| finally                  | 抑制finally模块没有返回的警告                                |
| hiding                   | 抑制与隐藏变量的局部变量相关的警告                           |
| incomplete-switch        | 忽略没有完整的switch语句                                     |
| null                     | 忽略对null的操作                                             |
| rawtypes                 | 使用generics时忽略没有指定相应的类型                         |
| serial                   | 忽略在serializable类中没有声明serialVersionUID变量          |
| unchecked                | 抑制没有进行类型检查操作的警告                               |
| unused                   | 抑制没被使用过的代码的警告                                   |

## 6.2 安全

- 通讯安全，加解密、加验签
- 密码管理->配置文件中的明文密码
- 密码管理->硬编码加密秘钥
- XSS攻击
