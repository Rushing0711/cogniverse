# 第6章 Logstash安装与配置


### 6.1、安装与配置

1. 下载

```shell
$ wget -cP /usr/local/src/ https://artifacts.elastic.co/downloads/logstash/logstash-7.6.2.tar.gz
```

2. 解压安装

```shell
$ tar -zxvf /usr/local/src/logstash-7.6.2.tar.gz -C /usr/local/ElasticStack/Logstash/
```

3. 创建软连接

```shell
$ ln -s /usr/local/ElasticStack/Logstash/logstash-7.6.2/ /usr/local/logstash
```

4. 配置

- 配置`logstash.yml`文件

```shell
# 打开文件并追加
$ vim /usr/local/logstash/config/logstash.yml 
```

```shell
http.host: "0.0.0.0"
```

- 配置`jvm.options`

```shell
# 打开文件并追加
$ vim /usr/local/logstash/config/jvm.options 
```

```
#-Xms1g
#-Xmx1g
-Xms256m
-Xmx256m
```

5. 测试安装是否成功

```bash
$ /usr/local/logstash/bin/logstash -e 'input { stdin { } } output { stdout {} }'
```

**说明：** `-e`参数启用命令行模式。

看到如下输出表示成功：

```
[2020-08-07T14:40:35,609][INFO ][logstash.javapipeline    ][main] Starting pipeline {:pipeline_id=>"main", "pipeline.workers"=>8, "pipeline.batch.size"=>125, "pipeline.batch.delay"=>50, "pipeline.max_inflight"=>1000, "pipeline.sources"=>["config string"], :thread=>"#<Thread:0x2d2eec91 run>"}
[2020-08-07T14:40:36,706][INFO ][logstash.javapipeline    ][main] Pipeline started {"pipeline.id"=>"main"}
The stdin plugin is now waiting for input:
[2020-08-07T14:40:36,760][INFO ][logstash.agent           ] Pipelines running {:count=>1, :running_pipelines=>[:main], :non_running_pipelines=>[]}
[2020-08-07T14:40:37,076][INFO ][logstash.agent           ] Successfully started Logstash API endpoint {:port=>9600}
```

在打开的命令行下随便输入内容，比如：

```bash
hello world
```

会输出如下：

```bash
{
      "@version" => "1",
          "host" => "localhost.localdomain",
    "@timestamp" => 2020-08-07T06:53:47.828Z,
       "message" => "hello world"
}
```

6. 命令使用详解

```bash
[emon@emon bin]$ ./logstash -h
Usage:
    bin/logstash [OPTIONS]

Options:
    -n, --node.name NAME          Specify the name of this logstash instance, if no value is given
                                  it will default to the current hostname.
                                   (default: "emon")
    -f, --path.config CONFIG_PATH Load the logstash config from a specific file
                                  or directory.  If a directory is given, all
                                  files in that directory will be concatenated
                                  in lexicographical order and then parsed as a
                                  single config file. You can also specify
                                  wildcards (globs) and any matched files will
                                  be loaded in the order described above.
    -e, --config.string CONFIG_STRING Use the given string as the configuration
                                  data. Same syntax as the config file. If no
                                  input is specified, then the following is
                                  used as the default input:
                                  "input { stdin { type => stdin } }"
                                  and if no output is specified, then the
                                  following is used as the default output:
                                  "output { stdout { codec => rubydebug } }"
                                  If you wish to use both defaults, please use
                                  the empty string for the '-e' flag.
                                   (default: nil)
    --field-reference-parser MODE (DEPRECATED) This option is no longer
                                  configurable.
                                  
                                  Use the given MODE when parsing field
                                  references.
                                  
                                  The field reference parser is used to expand
                                  field references in your pipeline configs,
                                  and has become more strict to better handle
                                  ambiguous- and illegal-syntax inputs.
                                  
                                  The only available MODE is:
                                   - `STRICT`: parse in a strict manner; when
                                     given ambiguous- or illegal-syntax input,
                                     raises a runtime exception that should
                                     be handled by the calling plugin.
                                  
                                   (default: "STRICT")
    --modules MODULES             Load Logstash modules.
                                  Modules can be defined using multiple instances
                                  '--modules module1 --modules module2',
                                     or comma-separated syntax
                                  '--modules=module1,module2'
                                  Cannot be used in conjunction with '-e' or '-f'
                                  Use of '--modules' will override modules declared
                                  in the 'logstash.yml' file.
    -M, --modules.variable MODULES_VARIABLE Load variables for module template.
                                  Multiple instances of '-M' or
                                  '--modules.variable' are supported.
                                  Ignored if '--modules' flag is not used.
                                  Should be in the format of
                                  '-M "MODULE_NAME.var.PLUGIN_TYPE.PLUGIN_NAME.VARIABLE_NAME=VALUE"'
                                  as in
                                  '-M "example.var.filter.mutate.fieldname=fieldvalue"'
    --setup                       Load index template into Elasticsearch, and saved searches, 
                                  index-pattern, visualizations, and dashboards into Kibana when
                                  running modules.
                                   (default: false)
    --cloud.id CLOUD_ID           Sets the elasticsearch and kibana host settings for
                                  module connections in Elastic Cloud.
                                  Your Elastic Cloud User interface or the Cloud support
                                  team should provide this.
                                  Add an optional label prefix '<label>:' to help you
                                  identify multiple cloud.ids.
                                  e.g. 'staging:dXMtZWFzdC0xLmF3cy5mb3VuZC5pbyRub3RhcmVhbCRpZGVudGlmaWVy'
    --cloud.auth CLOUD_AUTH       Sets the elasticsearch and kibana username and password
                                  for module connections in Elastic Cloud
                                  e.g. 'username:<password>'
    --pipeline.id ID              Sets the ID of the pipeline.
                                   (default: "main")
    -w, --pipeline.workers COUNT  Sets the number of pipeline workers to run.
                                   (default: 24)
    --java-execution              Use Java execution engine.
                                   (default: true)
    --plugin-classloaders         (Beta) Load Java plugins in independent classloaders to isolate their dependencies.
                                   (default: false)
    -b, --pipeline.batch.size SIZE Size of batches the pipeline is to work in.
                                   (default: 125)
    -u, --pipeline.batch.delay DELAY_IN_MS When creating pipeline batches, how long to wait while polling
                                  for the next event.
                                   (default: 50)
    --pipeline.unsafe_shutdown    Force logstash to exit during shutdown even
                                  if there are still inflight events in memory.
                                  By default, logstash will refuse to quit until all
                                  received events have been pushed to the outputs.
                                   (default: false)
    --path.data PATH              This should point to a writable directory. Logstash
                                  will use this directory whenever it needs to store
                                  data. Plugins will also have access to this path.
                                   (default: "/usr/local/logstash/data")
    -p, --path.plugins PATH       A path of where to find plugins. This flag
                                  can be given multiple times to include
                                  multiple paths. Plugins are expected to be
                                  in a specific directory hierarchy:
                                  'PATH/logstash/TYPE/NAME.rb' where TYPE is
                                  'inputs' 'filters', 'outputs' or 'codecs'
                                  and NAME is the name of the plugin.
                                   (default: [])
    -l, --path.logs PATH          Write logstash internal logs to the given
                                  file. Without this flag, logstash will emit
                                  logs to standard output.
                                   (default: "/usr/local/logstash/logs")
    --log.level LEVEL             Set the log level for logstash. Possible values are:
                                    - fatal
                                    - error
                                    - warn
                                    - info
                                    - debug
                                    - trace
                                   (default: "info")
    --config.debug                Print the compiled config ruby code out as a debug log (you must also have --log.level=debug enabled).
                                  WARNING: This will include any 'password' options passed to plugin configs as plaintext, and may result
                                  in plaintext passwords appearing in your logs!
                                   (default: false)
    -i, --interactive SHELL       Drop to shell instead of running as normal.
                                  Valid shells are "irb" and "pry"
    -V, --version                 Emit the version of logstash and its friends,
                                  then exit.
    -t, --config.test_and_exit    Check configuration for valid syntax and then exit.
                                   (default: false)
    -r, --config.reload.automatic Monitor configuration changes and reload
                                  whenever it is changed.
                                  NOTE: use SIGHUP to manually reload the config
                                   (default: false)
    --config.reload.interval RELOAD_INTERVAL How frequently to poll the configuration location
                                  for changes, in seconds.
                                   (default: 3000000000)
    --http.host HTTP_HOST         Web API binding host (default: "127.0.0.1")
    --http.port HTTP_PORT         Web API http port (default: 9600..9700)
    --log.format FORMAT           Specify if Logstash should write its own logs in JSON form (one
                                  event per line) or in plain text (using Ruby's Object#inspect)
                                   (default: "plain")
    --path.settings SETTINGS_DIR  Directory containing logstash.yml file. This can also be
                                  set through the LS_SETTINGS_DIR environment variable.
                                   (default: "/usr/local/logstash/config")
    --verbose                     Set the log level to info.
                                  DEPRECATED: use --log.level=info instead.
    --debug                       Set the log level to debug.
                                  DEPRECATED: use --log.level=debug instead.
    --quiet                       Set the log level to info.
                                  DEPRECATED: use --log.level=info instead.
    -h, --help                    print help
```

7. 几个实例

- 准备一个`logstash-simple.conf`配置文件

```
$ vim /usr/local/logstash/config/logstash-simple.conf
```

```
input { stdin { } }
output {
  elasticsearch { hosts => ["localhost:9200"] }
  stdout { codec => rubydebug }
}
```

执行命令测试：

```bash
$ /usr/local/logstash/bin/logstash -f /usr/local/logstash/config/logstash-simple.conf 
```

可以在控制台命令行输入消息，会被传递到es服务器。

- 准备一个`mysql.conf`配置文件【一个接近实战的例子】

```bash
# 上传mysql驱动jar到该目录下，比如mysql-connector-java-5.1.41.jar
$ mkdir -pv /usr/local/logstash/config/custom_config/mysql_config
```

```bash
# 编辑goods.config
$ vim /usr/local/logstash/config/custom_config/mysql_config/goods.conf 
```

```bash
input {
    stdin {}
    jdbc {
        # 驱动jar包位置
        jdbc_driver_library => "/usr/local/logstash/config/custom_config/mysql_config/mysql-connector-java-5.1.41.jar"
        # 驱动类
        jdbc_driver_class => "com.mysql.jdbc.Driver"
        jdbc_paging_enabled => "true"
        jdbc_page_size => "50000"
        # 数据库
        jdbc_connection_string => "jdbc:mysql://192.168.1.52:3306/hbsitedb-test?useSSL=false"
        # 用户名密码
        jdbc_user => "jpss"
        jdbc_password => "Jpss541018!"
        # 是否开启记录追踪
        record_last_run => "true"
        plugin_timezone => "local"
        # 是否需要追踪字段，如果为true，则需要制定tracking_column，默认是timestamp
        use_column_value => "true"
        # 指定追踪的字段
        tracking_column => "modify_time"
        # 追踪字段的类型，目前只有数字和时间类型，默认是数字类型
        tracking_column_type => "timestamp"
        # 执行
        last_run_metadata_path => "/usr/local/logstash/config/custom_config/mysql_config/last_run_metadata_path"
        schedule => "* * * * *"
        statement_filepath => "/usr/local/logstash/config/custom_config/mysql_config/goods.sql"
    }
}
filter {
    json {
        source => "message"
        remove_field => ["message"]
    }
}
output {
    elasticsearch {
        hosts => "192.168.1.56:9200"
        index => "logstash-es-goods-%{+YYYY.MM.dd}"
        # 需要关联的数据库中有一个id字段，对应索引的id号
        document_id => "%{id}"
    }
    stdout {
        codec => json_lines
    }
}
```

```bash
# 编辑goods.sql文件
$ vim /usr/local/logstash/config/custom_config/mysql_config/goods.sql
```

```sql
select sku.id, spu.id spu_id, spu.tenant_id , spu.shop_id , spu.cover , spu.imgs , spu.spu_name , sku.price , sku.spread_price , spu.sale_start_time ,spu.sale_end_time, spu.modify_time
from goods_sku sku
left join goods_spu spu
on spu.id=sku.spu_id
where spu.modify_time > :sql_last_value
```

执行配置文件：

```bash
$ /usr/local/logstash/bin/logstash -f /usr/local/logstash/config/custom_config/mysql_config/goods.conf
```

### 6.2、安装插件

查看安装了哪些logstash插件：

```bash
$ /usr/local/logstash/bin/logstash-plugin list --verbose
```

### 6.2.1、查看是否安装了`logstash-integration-jdbc`插件

```bash
[emon@localhost ~]$ /usr/local/logstash/bin/logstash-plugin list --verbose|grep jdbc
logstash-integration-jdbc (5.0.1)
 ├── logstash-input-jdbc
 ├── logstash-filter-jdbc_streaming
 └── logstash-filter-jdbc_static
```

发现已经安装了`logstash-integration-jdbc`插件。



#### 6.2.2、logstash-integration-jdbc【已废弃】

- logstash插件地址：https://github.com/logstash-plugins
- logstash-integration-jdbc插件地址：https://github.com/logstash-plugins/logstash-integration-jdbc

1. 安装`gem`

由于插件是基于ruby语言开发，需要安装Ruby包管理器`RubyGems`。

```bash
[emon@localhost ~]$ sudo yum install gem
```

`gem`命令用于构建、上传、下载以及安装Gem包。`gem`的用法在功能上与`apt-get`、`yum`和`npm`非常相似。

| 命令                       | 说明                     |
| -------------------------- | ------------------------ |
| gem install mygem          | 安装                     |
| gem uninstal mygem         | 卸载                     |
| gem list --local           | 列出已安装的gem          |
| gem list --remote          | 列出可用的gem            |
| gem rdoc --all             | 为所有的gems创建RDoc文档 |
| gem fetch mygem            | 下载gem，但不安装        |
| gem search STRING --remote | 从可用的gem中搜索        |
| gem sources -l             | 查看当前源               |

2. 配置`gem`镜像

由于国内网络，导致`rubygems.org`存放在Amazon S3上面的资源文件间歇性的链接失败。所以你会遇到`gem install rack`或者`bundle install`的时候半天没有响应，具体可用`gem install rails -V`来查看执行过程。

- 查看`gem`源

```bash
$ gem sources -l
*** CURRENT SOURCES ***

https://rubygems.org/
```

- 移除`https://rubygems.org/`并添加国内下载源`https://gems.ruby-china.com/`

```bash
$ gem sources --remove https://rubygems.org/
https://rubygems.org/ removed from sources
$ gem sources -a https://gems.ruby-china.com/
https://gems.ruby-china.com/ added to sources
```

如果你使用`Gemfile`和`Bundle`（例如：Rails项目）

你可以使用`bundle`的`gem`源代码镜像命令。

```bash
bundle config mirror.https://rubygems.org https://gems.ruby-china.com/
```




---


[返回列表](https://github.com/EmonCodingBackEnd/backend-tutorial)

[TOC]

## 6.3、Logstash简介

- Data Shipper
  - ETL
  - Extract
  - Transform
  - Load

## 1、安装

### 1.1、安装依赖

请确保安装了JDK1.8，安装方式参考： [JDK1.8安装参考](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/Linux/LinuxInAction.md)

打开后搜索 **安装JDK** 即可。

### 1.2、下载

官网： <https://www.elastic.co/>

下载地址页： <https://www.elastic.co/downloads>

```shell
$ wget -cP /usr/local/src/ https://artifacts.elastic.co/downloads/logstash/logstash-5.6.11.tar.gz
```

### 1.3、创建安装目录

```shell
$ mkdir /usr/local/Logstash
```

### 1.4、解压安装

```shell
$ tar -zxvf /usr/local/src/logstash-5.6.11.tar.gz -C /usr/local/Logstash/
```

### 1.5、创建软连接

```shell
$ ln -s /usr/local/Logstash/logstash-5.6.11/ /usr/local/logstash
```

### 1.6、配置`logstash.yml`文件

```shell
$ vim /usr/local/logstash/config/logstash.yml 
```

```
http.host: "0.0.0.0"
```

### 1.7、准备一个`logstash.conf`配置文件

```shell
[emon@emon logstash]$ vim nginx_logstash.conf
```

```
input {
  stdin { }
}

filter {
  grok {
    match => {
      "message" => '%{IPORHOST:remote_ip} - %{DATA:user_name} \[%{HTTPDATE:time}\] "%{WORD:request_action} %{DATA:reques} HTTP/%{NUMBER:http_version}" %{NUMBER:response} %{NUMBER:bytes} "%{DATA:referrer}" "%{DATA:agent}"'
    }
  }

  date {
    match => [ "time", "dd/MM/YYYY:HH:mm:ss Z" ]
    locale => en
  }

  geoip {
    source => "remote_ip"
    target => "geoip"
  }

  useragent {
    source => "agent"
    target => "user_agent"
  }
}

output {
  stdout {
    codec => rubydebug
  }
}
```

### 1.8、测试

```shell
$ head -n 2 /usr/local/nginx/logs/access.log | /usr/local/logstash/bin/logstash -f /usr/local/logstash/nginx_logstash.conf 
```









## 2、处理流程

- Input
  - file
  - redis
  - beats
  - kafka
- Filter
  - grok
  - mutate
  - drop
  - date
- Output
  - stdout
  - elasticsearch
  - redis
  - kafka

### 2.1、处理流程 -- Input 和 Output 配置

```
input {file {path => "/tmp/abc.log"}}
```

```
output {stdout{codec => rubydebug}}
```

### 2.2、处理流程 -- Filter配置

- Grok
  - 基于正则表达式提供了丰富可重用的模式（pattern）
  - 基于此可以将非结构化数据作结构化处理
- Date
  - 将字符串类型的时间字段转换为时间戳类型，方便后续数据处理
- Mutate
  - 进行增加、修改、删除、替换等字段相关的处理
- ......

#### 2.2.1 配置Grok示例

```
==>待处理文本
55.3.244.1 GET /index.html 15824 0.043
==>Grok表达式
%{IP:client} %{WORD:method} %{URIPATHPARAM:request} %{NUMBER:bytes} %{NUMBER:duration}
==>结果
{
    "client": "55.3.244.1",
    "method": "GET",
    "request": "/index.html",
    "bytes": 15824,
    "duration": 0.043
}
```







## 配置说明

## 1、JVM配置

### 1.1、配置堆内存大小

默认的1g调整为256m

```
#-Xms1g
#-Xmx1g
-Xms256m
-Xmx256m
```

