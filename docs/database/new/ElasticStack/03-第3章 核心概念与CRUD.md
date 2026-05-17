# 第3章 核心概念与CRUD

## 3.1、常用术语



- `Type` 索引中的数据类型，可以定义一个或多个类型，文档必须属于一个类型=>相当于数据表<span style="color:red;font-weight:bold;">切记Elasticsearch7开始，不建议使用type了！！！</span>
- `Document` 文档数据，是可以被索引的基本数据单位=>相当于一条表的记录
- `Field` 字段，文档的属性
- `Query DSL` 查询语法
- `分片` 每个索引都有多个分片，每个分片是一个Lucene索引
- `备份` 拷贝一个分片，就完成了分片的备份

## 3.2、基本增删改查


<span style="color:red;font-weight:bold;">请使用Kibana执行如下命令！（也可以转换为Postman）</span>

### 3.2.1、初步检索

-  查看所有节点

```bash
GET /_cat/nodes
```

- 查看es健康状况

```bash
GET /_cat/health
```

- 查看注节点

```bash
GET /_cat/master
```

- 查看所有索引

```bash
GET /_cat/indices
```

- 查询索引的分片

```bash
GET /_cat/shards
```



### 3.2.2、索引一个文档（保存）

- PUT保存一个数据

PUT新增/修改数据。<span style="color:red;font-weight:bold;">PUT必须指定id</span>；由于PUT不要指定id，我们一般都用来做修改操作，不指定id会报错。

在customer索引下的external类型下保存1号数据

```bash
PUT customer/external/1
{
	"name": "John Doe"
}
```

- POST保存一个数据

POST新增/修改数据。如果不指定id，会自动创建id。指定id就会修改这个数据，并新增版本号。

```bash
POST customer/external/1
{
	"name": "John Doe"
}
```

### 3.2.3、查询文档

```bash
GET customer/external/1
```

应答：

```json
{
  "_index" : "customer", // 在哪个索引
  "_type" : "external", // 在哪个类型
  "_id" : "1", // 记录id
  "_version" : 7, // 版本号：针对每个文档的修正(包含删去)操作。
  "_seq_no" : 7, // 并发控制字段，每次更新就会+1，用来做乐观锁：针对每个分片的文档修正(包含删去)操作。
  "_primary_term" : 1, // 同上，主分片重新分配，如重启，就会变化：针对问题导致的主分片重启或主分片切换,每产生一次自增1。
  "found" : true, // 表示数据是否找到
  "_source" : { // 真正的内容
    "name" : "John Doe"
  }
}
// _version是旧版ES的版本号，每个文档都从1开始计数，并独自累加计数
// _seq_no是新版ES的版本号，同一个索引、类型下所有文档在变更时共享该计数，并共享累加值
// 更新携带 ?if_seq_no=0&if_primary_term=1
```

- 防并发更新

```bash
# 请确保if_seq_no和if_primary_term与库中一致，可以通过“查询文档”确认！
PUT customer/external/1?if_seq_no=7&if_primary_term=1
{
	"name": "John Doe New"
}
```

### 3.2.4、更新文档

- 方式一：<span style="color:red;font-weight:bold;">会对比数据，决定是否需要更新；若数据不变，忽略操作，各种版本号也不变化。</span>

```bash
# 指定的id数据不存在时，报错404
POST customer/external/1/_update
{
	"doc": {
		"name": "John Doe"
	}
}
```

- 方式二：<span style="color:red;font-weight:bold;">不对比数据，每次都触发更新操作</span>

```bash
# 指定的id数据不存在时，创建
POST customer/external/1
{
	"name": "John Doe"
}
# 或者
# 指定的id数据不存在时，创建
PUT customer/external/1
{
	"name": "John Doe"
}
```

### 3.2.5、删除文档&索引

- 删除文档

```bash
DELETE customer/external/1
```

- 删除索引

```bash
DELETE customer
```

### 3.2.6、bulk批量API

- 语法格式

bulk API以此按顺序执行所有的action（动作）。如果一个单个的动作因任何原因而失败，不影响后续动作执行。当bulk API返回时，它将提供每个动作的状态（与发送的顺序相同），所以您可以检查是否一个特定的动作是否失败了。

```bash
{action:{metadata}}\n
{request body}\n
{action:{metadata}}\n
{request body}\n
```

- 简单示例

```bash
POST customer/external/_bulk
{"index":{"_id":"1"}}
{"name":"John Doe"}
{"index":{"_id":"2"}}
{"name":"John Doe"}
```

- 复杂示例

```bash
POST /_bulk
{"delete":{"_index":"website","_type":"blog","_id":"123"}}
{"create":{"_index":"website","_type":"blog","_id":"123"}}
{"title":"My first blog post"}
{"index":{"_index":"website","_type":"blog"}}
{"title":"My second blog post"}
{"update":{"_index":"website","_type":"blog","_id":"123"}}
{"doc":{"title":"My updated blog post"}}
```

### 3.2.7、样本测试数据

测试数据（2000行共1000条文档）：https://github.com/elastic/elasticsearch/blob/v7.11.2/docs/src/test/resources/accounts.json

这是一份基于v7.11.2的测试数据，文档的结构如下：

```json
{
    "account_number": 1,
    "balance": 39225,
    "firstname": "Amber",
    "lastname": "Duke",
    "age": 32,
    "gender": "M",
    "address": "880 Holmes Lane",
    "employer": "Pyrami",
    "email": "amberduke@pyrami.com",
    "city": "Brogan",
    "state": "IL"
}
```

- 导入测试数据

```bash
# 2000行共1000条文档，"took" : 338
POST bank/account/_bulk
# <这里加入测试数据>
```

