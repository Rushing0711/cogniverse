# 第5章 Mapping、分词与Java访问


## 5.1、字段类型

参考：https://www.elastic.co/guide/en/elasticsearch/reference/7.17/mapping-types.html#_core_datatypes

## 5.2、映射

Mapping（映射）是用来定义一个文档（document），以及它所包含的属性（field）是如何存储和索引的。比如，使用mapping来定义：

- 哪些字符串属性应该被看做全文本属性（full text fields）。
- 哪些属性包含数字，日期或者地理位置。
- 文档中的所有属性是否都能被索引（_all配置）。
- 日期的格式。
- 自定义映射规则来执行动态添加属性。

### 5.2.1、查看映射

- 查看mapping信息：

```bash
GET bank/_mapping
```

### 5.2.2、创建索引时定义映射

```bash
PUT my_index
{
  "mappings": {
    "properties": {
      "age": {
        "type": "integer"
      },
      "email": {
        "type": "keyword"
      },
      "name": {
        "type": "text"
      }
    }
  }
}
```

### 5.2.3、添加新映射字段

- 为索引添加新的映射字段

```bash
PUT my_index/_mapping
{
  "properties": {
    "employee-id": {
      "type": "keyword",
      "index": false
    }
  }
}
```

### 2.4、修改映射

对于已经存在的映射字段，我们不能更新。更新必须创建新的索引进行数据迁移。

### 2.5、数据迁移

先创建出newbank的正确映射。然后使用如下方式进行数据迁移。

- 创建新索引

```bash
PUT newbank
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "account_number": {
        "type": "long"
      },
      "address": {
        "type": "text"
      },
      "age": {
        "type": "integer"
      },
      "balance": {
        "type": "long"
      },
      "city": {
        "type": "keyword"
      },
      "email": {
        "type": "keyword"
      },
      "employer": {
        "type": "keyword"
      },
      "firstname": {
        "type": "text"
      },
      "gender": {
        "type": "keyword"
      },
      "lastname": {
        "type": "text"
      },
      "state": {
        "type": "keyword"
      }
    }
  }
}
```

- 将就索引的指定type下的数据迁移到新的索引上

```bash
POST _reindex
{
  "source": {
    "index": "bank",
    "type": "account"
  },
  "dest": {
    "index": "newbank"
  }
}
```

## 3、Elasticsearch7为什么去掉type概念？

- 关系型数据库中两个数据表示时独立的，即使他们里面有相同名称的列，也不影响使用，但ES中不是这样的。Elasticsearch是基于Lucene开发的搜索引起，二ES中不同type下名称相同的field最终在Lucene中的处理方式是一样的。
  - 两个不同type下的两个user_name，在ES同一个索引下其实被认为是同一个filed，你必须在两个不同的type中定义相同的field映射。否则，不同type中的相同字段名称就会在处理中出现冲突的情况，导致Lucene处理效率下降。
  - 去掉type就是为了提高ES处理数据的效率。
- Elasticsearch7.x
  - URL中的type参数为可旋。比如，索引一个文档不再要求提供文档类型。
- Elasticsearch8.x
  - 不再支持URL中的type参数。
- 解决：将索引从多类型迁移到单类型，每种类型文档一个独立索引。

# 六、配置

- 查看配置

```bash
$ PUT my_index/_settings
```

# 七、分词

一个tokenizer（分词器）接收一个字符流，将之分割为独立的tokens（词元，通常是独立的单词），然后输出tokens流。

例如：whitespace tokenizer遇到空白字符时分隔文本。它会将文本“Quick brown fox!”分割为[Quick, brown, fox!]。

该tokenizer（分词器）还负责记录各个term（词条）的顺序或position位置（用于phrase短语和word proximity词近邻查询），以及term（词条）所代表的原始word（单词）的start（起始）和end（结束）的character offsets（字符偏移量）（用于高亮显示搜索的内容）。

Elasticsearch提供了很多内置的分词器，可以用来构建custom analyzers（自定义分词器）。

## 0、标准分词器

```bash
POST _analyze
{
  "analyzer": "standard",
  "text": "尚硅谷电商项目"
}
```

## 1、ik分词器

请先安装ik分词器！！！

```bash
POST _analyze
{
  "analyzer": "standard",
  "text": "尚硅谷电商项目"
}
```

## 2、分词演练

```bash
POST _analyze
{
  "analyzer": "ik_smart",
  "text": "我是一个中国人"
}

POST _analyze
{
  "analyzer": "ik_max_word",
  "text": "我是一个中国人"
}

POST _analyze
{
  "analyzer": "ik_smart",
  "text": [
    "乔碧萝殿下",
    "是一个中国人"
  ]
}
```



```json
{
	"settings": {
		"number_of_shards": 5,
		"number_of_replicas": 1
	},
	"mappings": {
		"novel": {
			"properties": {
				"word_count": {
					"type": "integer"
				},
				"author": {
					"type": "keyword"
				},
				"title": {
					"type": "text"
				},
				"publish_date": {
					"type": "date",
					"format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
				}
			}
		}
	}
}
```

# 八、Java访问Elasticsearch

Elasticsearch Clients：https://www.elastic.co/guide/en/elasticsearch/client/index.html

## 1、9300-TCP

- 7.x已经不建议使用，8以后就要废弃！

## 2、9200-HTTP

- JestClient：非官方，更新慢
- RestTemplate：模拟发HTTP请求，ES很多操作需要自己封装，比较麻烦
- HttpClient：同上
- Elasticsearch-Rest-High-Level-Client：官方RestClient，封装了ES操作。【8之后废弃】但可兼容模式配合ES8使用。

[Elasticsearch-Rest-High-Level-Client官网文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/current/java-rest-high-search.html)

```xml
<!-- https://mvnrepository.com/artifact/org.elasticsearch.client/elasticsearch-rest-high-level-client -->
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
    <version>7.17.18</version>
</dependency>
```

- Elasticsearch-Rest-Client：官方RestClient，封装了ES操作，API层次分明且上手简单。【贯穿始终，一直可用】

```xml
<!-- https://mvnrepository.com/artifact/org.elasticsearch.client/elasticsearch-rest-client -->
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-client</artifactId>
    <version>7.17.18</version>
</dependency>
```

- Elasticsearch Java API Client【7.15.0开始启用的新客户端】

```xml
<!-- https://mvnrepository.com/artifact/co.elastic.clients/elasticsearch-java -->
<dependency>
    <groupId>co.elastic.clients</groupId>
    <artifactId>elasticsearch-java</artifactId>
    <version>7.17.18</version>
</dependency>
```













