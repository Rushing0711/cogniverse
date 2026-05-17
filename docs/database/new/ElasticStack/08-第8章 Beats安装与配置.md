# 第8章 Beats安装与配置


1. 下载

```bash
$ wget -cP /usr/local/src/ https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.6.2-linux-x86_64.tar.gz
```

2. 解压安装

```bash
$ tar -zxvf /usr/local/src/filebeat-7.6.2-linux-x86_64.tar.gz -C /usr/local/ElasticStack/Beats/
```

3. 创建软连接

```bash
$ ln -s /usr/local/ElasticStack/Beats/filebeat-7.6.2-linux-x86_64/ /usr/local/filebeat
```

4. 配置文件

`/usr/local/filebeat/filebeat.reference.yml` 包含所有未过时的配置项

`/usr/local/filebeat/filebeat.yml` 配置文件

filebeat命令需要在根目录下执行，所以先切换到根目录下：

```bash
$ cd /usr/local/filebeat/
```

- 如何使用`filebeat`命令

```bash
[emon@emon filebeat]$ ./filebeat -h
```

```bash
Usage:
  filebeat [flags]
  filebeat [command]

Available Commands:
  enroll      Enroll in Kibana for Central Management                  	
  export      Export current config or index template					# 导出
  generate    Generate Filebeat modules, filesets and fields.yml
  help        Help about any command
  keystore    Manage secrets keystore									# 秘钥存储
  modules     Manage configured modules									# 模块配置管理
  run         Run filebeat												# 执行（默认执行）
  setup       Setup index template, dashboards and ML jobs				# 设置初始环境
  test        Test config												# 测算配置
  version     Show current version info
```

- 如何使用`file beat [command]子命令

```bash
# 查看使用方法： filebeat [command] -h，比如：
[emon@emon filebeat]$ ./filebeat modules -h
```

- 如何测算配置文件是否正确：

```bash
[emon@emon filebeat]$ ./filebeat test config
```

- 如何测算配置文件是否可以连通到output

```bash
[emon@emon filebeat]$ ./filebeat test output
```

- 配置`filebeat.yml`文件，log输入类型为例

```bash
# 备份
$ cp /usr/local/filebeat/filebeat.yml /usr/local/filebeat/filebeat.yml.bak
# 编辑
$ vim /usr/local/filebeat/filebeat.yml 
```

5. 几个实例

- 实例一：logstash作为输出
  - 配置logstash

  ```bash
  # 创建目录
  $ mkdir -pv /usr/local/logstash/config/custom_config/hbsite/
  # 自定义grok的patterns
  $ vim /usr/local/logstash/config/custom_config/hbsite/patterns/custom-grok-patterns
  ```

  ```bash
  CDATE ((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))\s+([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])\.\d{3}
  CTID TID:\w*\.\d+\.\d+|TID:N/A
  CMETHOD (GET|HEAD|POST|PUT|PATCH|DELETE|OPTIONS|TRACE)
  CURL [\w?/&=%]+
  CBROWER_NAME [\w/\s]+
  COSNAME_NAME [\w/\s]+
  CPID \d+
  CTHREAD [\s\w-]+
  ```
  
  ```bash
  # 编辑文件
  $ vim /usr/local/logstash/config/custom_config/hbsite/hbsite_log.conf
  ```
  
  ```bash
  input {
    beats {
      port => 5044
    }
  }
  filter {
    grok {
      patterns_dir => ["/usr/local/logstash/config/custom_config/hbsite/patterns"]
      break_on_match => false
      match => {
        "message" => ["%{CDATE:logger.date} \[%{CTID:logger.tid}] \[\s+]\s+%{LOGLEVEL:logger.level} %{CPID:logger.pid} --- \[%{CTHREAD:logger.thread}", "%{CDATE:logger.date} \[%{CTID:logger.tid}] \[%{IPORHOST:logger.clientIp} %{CMETHOD:logger.method} %{CURL:logger.url} %{CBROWER_NAME:logger.browerName},%{COSNAME_NAME:logger.osName}]\s+%{LOGLEVEL:logger.level} %{CPID:logger.pid} --- \[%{CTHREAD:logger.thread}"]
      }
    }
    date {
      match => ["logger.date", "yyyy-MM-dd HH:mm:ss.SSS"]
    }
  }
  output {
    elasticsearch {
      hosts => ["http://192.168.1.66:9200"]
      index => "hbsite-log-%{+YYYY.MM.dd}"
    }
  }
  ```
  
  ```bash
    # 执行配置文件
    $ /usr/local/logstash/bin/logstash -f /usr/local/logstash/config/custom_config/filebeats_config/filebeats.conf
  ```
  
  ```bash
  # 配置supervisor启动
  $ sudo vim /etc/program/huiba-logstash.ini
  ```
  
  ```bash
  [program:huiba-logstash]
  command=/usr/local/logstash/bin/logstash -f /usr/local/logstash/config/custom_config/hbsite/hbsite_log.conf
  autostart=false                 ; 在supervisord启动的时候也自动启动
  startsecs=10                    ; 启动10秒后没有异常退出，就表示进程正常启动了，默认为1秒
  autorestart=true                ; 程序退出后自动重启,可选值：[unexpected,true,false]，默认为unexpected，表示进程意外杀死后才重启
  startretries=3                  ; 启动失败自动重试次数，默认是3
  user=saas                       ; 用哪个用户启动进程，默认是root
  priority=70                     ; 进程启动优先级，默认999，值小的优先启动
  redirect_stderr=true            ; 把stderr重定向到stdout，默认false
  stdout_logfile_maxbytes=20MB    ; stdout 日志文件大小，默认50MB
  stdout_logfile_backups = 20     ; stdout 日志文件备份数，默认是10
  environment=JAVA_HOME="/usr/local/java"
  stdout_logfile=/etc/program/huiba-logstash.log ; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以需要手动>创建目录（supervisord 会自动创建日志文件）
  stopasgroup=true                ;默认为false,进程被杀死时，是否向这个进程组发送stop信号，包括子进程
  killasgroup=true                ;默认为false，向进程组发送kill信号，包括子进程
  ```
  
- 配置filebeat
  
  ```bash
  # 编辑配置文件
  $ vim /usr/local/filebeat/filebeat.yml
  ```
  
  ```bash
  #=========================== Filebeat inputs =============================
  
  filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /home/saas/huiba/site/huiba-site-server/logs/huiba-site-provider.log
    fields:
      appName: huiba-site-provider
    fields_under_root: true
    # multiline开头的3个配置表示：匹配 yyyy-MM-dd HH:mm:ss 开头的日志，作为独立成行的标志；该标志后面的行要和该行合并处理
    multiline.pattern: ^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))\s+([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])
    multiline.negate: true
    multiline.match: after
    close_inactive: 2m
  
  - type: log
    enabled: true
    paths:
      - /home/saas/huiba/site/huiba-site-es-server/logs/huiba-site-es-provider.log
    fields:
      appName: huiba-site-es-provider
    fields_under_root: true
    # multiline开头的3个配置表示：匹配 yyyy-MM-dd HH:mm:ss 开头的日志，作为独立成行的标志；该标志后面的行要和该行合并处理
    multiline.pattern: ^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))\s+([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])
    multiline.negate: true
    multiline.match: after
    close_inactive: 2m
  
  #============================= Filebeat modules ===============================
  
  filebeat.config.modules:
    path: ${path.config}/modules.d/*.yml
    reload.enabled: false
  
  #==================== Elasticsearch template setting ==========================
  
  setup.template.settings:
    index.number_of_shards: 1
  
  #----------------------------- Logstash output --------------------------------
  output.logstash:
    # The Logstash hosts
    hosts: ["192.168.1.66:5044"]
  
  #================================ Processors =====================================
  
  # Configure processors to enhance or manipulate events generated by the beat.
  
  processors:
    - add_host_metadata: ~
    - add_cloud_metadata: ~
    - add_docker_metadata: ~
    - add_kubernetes_metadata: ~
  ```
  
  
```

```

  ```bash
  # 执行配置文件，注意--path.config和-c参数的不同之处
  $ /usr/local/filebeat/filebea --path.config /usr/local/filebeat -e
  ```

  ```bash
  # 配置supervisor启动
  $ sudo vim /etc/program/huiba-site-filebeat.ini 
  ```

  ```bash
  [program:huiba-site-filebeat]
  command=/usr/local/filebeat/filebeat -c /usr/local/filebeat/filebeat.yml -e
  autostart=false                 ; 在supervisord启动的时候也自动启动
  startsecs=10                    ; 启动10秒后没有异常退出，就表示进程正常启动了，默认为1秒
  autorestart=true                ; 程序退出后自动重启,可选值：[unexpected,true,false]，默认为unexpected，表示进程意外杀死后才重启
  startretries=3                  ; 启动失败自动重试次数，默认是3
  user=saas                       ; 用哪个用户启动进程，默认是root
  priority=70                     ; 进程启动优先级，默认999，值小的优先启动
  redirect_stderr=true            ; 把stderr重定向到stdout，默认false
  stdout_logfile_maxbytes=20MB    ; stdout 日志文件大小，默认50MB
  stdout_logfile_backups = 20     ; stdout 日志文件备份数，默认是10
  stdout_logfile=/etc/program/huiba-site-filebeat.log ; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以需要手动>创建目录（supervisord 会自动创建日志文件）
  stopasgroup=true                ;默认为false,进程被杀死时，是否向这个进程组发送stop信号，包括子进程
  killasgroup=true                ;默认为false，向进程组发送kill信号，包括子进程
  ```

  




[返回列表](https://github.com/EmonCodingBackEnd/backend-tutorial)

[TOC]

# 一、简介

- Lightweight Data Shipper
  - Filebeat 日志文件
  - Metricbeat 度量数据
  - Packetbeat 网络数据
  - Winlogbeat Windows数据
  - Heartbeat 健康检查

## 8.1、Filebeat简介

### 8.1.1、安装

1. 下载

官网： <https://www.elastic.co/>

下载地址页： <https://www.elastic.co/downloads>

```shell
$ wget -cP /usr/local/src/ https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-5.6.11-linux-x86_64.tar.gz
```

2. 创建安装目录

```shell
$ mkdir /usr/local/Filebeat
```

3. 解压安装

```shell
$ tar -zxvf /usr/local/src/filebeat-5.6.11-linux-x86_64.tar.gz -C /usr/local/Filebeat/
```

4. 创建软连接

```shell
$ ln -s /usr/local/Filebeat/filebeat-5.6.11-linux-x86_64/ /usr/local/filebeat
```

5. 配置`filebeat.yml`

复制一份，进行调整：

```shell
$ grep -v "#" /usr/local/filebeat/filebeat.yml > /usr/local/filebeat/nginx.yml
# 设置为只能拥有者可写，否则会报错
$ chmod go-w /usr/local/filebeat/nginx.yml 
$ vim /usr/local/filebeat/nginx.yml 
```

内容如下：

```yaml
filebeat.prospectors:
- input_type: stdin
output.console:
  pretty: true
```

6. 测试

```shell
$ head -n 2 /usr/local/nginx/logs/access.log | /usr/local/filebeat/filebeat -e -c /usr/local/filebeat/nginx.yml 
```



### 8.1.2、处理流程

- 处理流程
  - 输入 Input
  - 处理 Filter
  - 输出 Output

![Beats入门](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/ElasticStack/Beats/images/20180902193823.png)

- Filebeat Input 配置简介
  - yaml 语法
  - input_type
    - log
    - stdin

```yaml
filebeat.prospectors:
  - input_type: log
    paths:
      - /var/log/apache/httpd-*.log
  - input_type: log
  	paths:
      - /var/log/messages
      - /var/log/*.log
```



- Filebeat Output 配置简介
  - Console
  - Elasticsearch
  - Logstash
  - Kafka
  - Redis
  - File

```yaml
output.elasticsearch:
  hosts: ["http://localhost:9200"]
  username: "admin"
  passwor: "s3cr3t"
```

```yaml
output.console:
  pretty: true
```

- Filebeat Filter 配置简介
  - Input 时处理
    - Include_lines
    - exclude_lines
    - exclude_files
  - Output 前处理 --Processor
    - drop_event
    - drop_fields
    - Decode_json_fields
    - Include_fields

```yaml
processors:
  - drop_event:
    when:
      regexp:
        message: "^DBG"
  - decode_json_fields:
    fields: ["inner"]
```

### 8.1.3、Filebeat+Elasticsearch Ingest Node

- Filebeat 缺乏数据转换能力的
- Elasticsearch Ingest Node
  - 新增的node类型
  - 在数据写入es前对数据进行处理
  - pipeline api

### 8.1.4、Filebeat Module 简介

- 对于社区常见需求进行配置封装增加易用性
  - Nginx
  - Apache
  - MySQL
- 封装内容
  - filebeat.yml配置
  - ingest node pipeline配置
  - Kibana dashboard
- 最佳实践参考



### 1.5、Filebeat收集nginx log

- 通过stdin收集日志
- 通过console输出结果



## 2、Packetbeat简介

- 实时抓取网络包
- 自动解析应用层协议
  - ICMP（v4 and v6）
  - DNS
  - HTTP
  - MySQL
  - Redis
  - ......
- Wireshark

### 2.1、安装

1. 下载

官网： <https://www.elastic.co/>

下载地址页： <https://www.elastic.co/downloads>

```shell
$ wget -cP /usr/local/src/ https://artifacts.elastic.co/downloads/beats/packetbeat/packetbeat-5.6.11-linux-x86_64.tar.gz
```

2. 创建安装目录

```shell
$ mkdir /usr/local/Packetbeat
```

3. 解压安装

```shell
$ tar -zxvf /usr/local/src/packetbeat-5.6.11-linux-x86_64.tar.gz -C /usr/local/Packetbeat/
```

4. 创建软连接

```shell
$ ln -s /usr/local/Packetbeat/packetbeat-5.6.11-linux-x86_64/ /usr/local/packetbeat
```

5. 配置`packetbeat.yml`

复制一份，进行调整：

```shell
$ grep -v "#" /usr/local/packetbeat/packetbeat.yml > /usr/local/packetbeat/es.yml
$ vim /usr/local/packetbeat/es.yml 
```

内容如下：

```shell
packetbeat.interfaces.device: ens33
packetbeat.protocols.http:
  ports: [9200]
  send_request: true
  include_body_for: ["application/json", "x-www-form-urlencoded"]
output.console:
  pretty: true
```

6. 测试

```shell
$ sudo /usr/local/packetbeat/packetbeat -e -c /usr/local/packetbeat/es.yml -strict.perms=false
```

然后在网页访问Elasticsearch： http://192.168.8.116:9200/



### 2.2、Packetbeat解析http协议

- 解析elasticsearch http请求

```yaml
packetbeat.interfaces.device: lo0
packetbeat.protocols.http: ports: [9200]
send_request: true
include_body_for: ["application/json","x-www-form-urlencoded"]
output.console:
  pretty: true
```

- 运行

```
sudo ./packetbeat -e -c es.yml -strict.perms=false
```





## 