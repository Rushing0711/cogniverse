# 第2章 Mongo数据库介绍


## 2.1、概念对比

| RDBMS         | MongoDB                      |
| ------------- | ---------------------------- |
| 数据库        | 数据库                       |
| 表格          | 集合                         |
| 行            | 文档                         |
| 列            | 字段                         |
| 表联合        | 嵌入文档                     |
| 主键          | 主键（MongoDB提供了key为_id) |
| Mysqld/Oracle | mongod                       |
| mysql/sqlplus | mongo                        |

## 2.2、数据类型（Mongodb8.2）

https://www.mongodb.com/zh-cn/docs/manual/reference/operator/query/type/

| 类型                  | 数值 | 别名                  | 注意     |
| :-------------------- | :--- | :-------------------- | :------- |
| double                | 1    | "double"              |          |
| 字符串                | 2    | "string"              |          |
| 对象                  | 3    | "object"              |          |
| 阵列                  | 4    | "array"               |          |
| 二进制数据            | 5    | "binData"             |          |
| 未定义                | 6    | "undefined"           | 已弃用。 |
| ObjectId              | 7    | "objectId"            |          |
| 布尔                  | 8    | "bool"                |          |
| Date                  | 9    | "date"                |          |
| null                  | 10   | "null"                |          |
| 正则表达式            | 11   | "regex"               |          |
| 数据库指针            | 12   | "dbPointer"           | 已弃用。 |
| JavaScript            | 13   | "javascript"          |          |
| 符号                  | 14   | "symbol"              | 已弃用。 |
| 带作用域的 JavaScript | 15   | "javascriptWithScope" | 已弃用。 |
| 32 位整数             | 16   | "int"                 |          |
| 时间戳                | 17   | "timestamp"           |          |
| 64 位整型             | 18   | "long"                |          |
| Decimal128            | 19   | "decimal"             |          |
| Min key               | -1   | "minKey"              |          |
| Max key               | 127  | "maxKey"              |          |

## 2.3、对象主键ObjectId

对象主键是一个可快速生成的12字节id，是文档的默认主键。

对象主键组成部分：

ObjectId使用12字节的存储空间，每一个字节是两位十六进制数字，是一个24位的字符串，该12字节按照如下方法生成：

| 字节数      | 含义                 |
| ----------- | -------------------- |
| 第1-4字节   | UNIX时间戳，精确到秒 |
| 第5-7字节   | 主机标识符           |
| 第8-9字节   | 进程PID              |
| 第10-12字节 | 计数器               |

- 生成主键ObjectId

```js
> ObjectId()
ObjectId("602d2112ebecf117915b097b")
```

- 提取ObjectId的创建时间

```js
> ObjectId("602d2112ebecf117915b097b").getTimestamp()
ISODate("2021-02-17T13:58:42Z")
```

- 复合主键

```js
> use test
> db.accounts.insert(
	{
        _id: {accountNo: "001", type: "savings"},
        name: "irene",
        balance: 80
    }
)
WriteResult({ "nInserted" : 1 })
```



