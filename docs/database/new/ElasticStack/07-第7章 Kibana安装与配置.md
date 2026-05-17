# 第7章 Kibana安装与配置


1. 下载

```shell
$ wget -cP /usr/local/src/ https://artifacts.elastic.co/downloads/kibana/kibana-7.6.2-linux-x86_64.tar.gz
```

2. 解压安装

```shell
$ tar -zxvf /usr/local/src/kibana-7.6.2-linux-x86_64.tar.gz -C /usr/local/ElasticStack/Kibana/
```

3. 创建软连接

```shell
$ ln -s /usr/local/ElasticStack/Kibana/kibana-7.6.2-linux-x86_64/ /usr/local/kibana
```

4. 配置`kibana.yml`文件

```shell
$ vim /usr/local/kibana/config/kibana.yml 
```

```yaml
server.host: 0.0.0.0
```

5. 解决启动问题

- 问题一

  - 问题描述

  ```bash
  [warning][config][encryptedSavedObjects][plugins] Generating a random key for xpack.encryptedSavedObjects.encryptionKey
  ```

  - 解决办法

  ```bash
  # 打开文件并追加，注意值不小于32位长度
  # vim /usr/local/kibana/config/kibana.yml
  xpack.encryptedSavedObjects.encryptionKey: encryptedSavedObjects12345678909876543210
  ```

- 问题二

  - 问题描述

  ```bash
  [warning][config][plugins][security] Generating a random key for xpack.security.encryptionKey
  ```

  - 解决办法

  ```bash
  # 打开文件并追加，注意值不小于32位长度
  # vim /usr/local/kibana/config/kibana.yml
  xpack.security.encryptionKey: encryptionKeysecurity12345678909876543210
  ```

- 问题三

  - 问题描述

  ```bash
  [warning][reporting] Generating a random key for xpack.reporting.encryptionKey. To prevent pending reports from failing on restart, please set xpack.reporting.encryptionKey in kibana.yml
  ```

  - 解决办法

  ```bash
  # 打开文件并追加，注意值不小于32位长度
  # vim /usr/local/kibana/config/kibana.yml
  xpack.reporting.encryptionKey: encryptionKeyreporting12345678909876543210
  ```

- 问题四

  - 问题描述

  ```bash
  [warning][savedobjects-service] Unable to connect to Elasticsearch. Error: [validation_exception] Validation Failed: 1: this action would add [2] total shards, but this cluster currently has [999]/[1000] maximum shards open;
  ```

  - 解决办法1

  ```bash
  # 打开es的配置文件
  # vim /usr/local/es/config/elasticsearch.yml
  cluster.max_shards_per_node: 1500
  ```

  - 解决办法2

  ```bash
  # 执行shell命令
  curl -X PUT "192.168.1.107:9200/_cluster/settings" -H 'Content-Type: application/json' -d'
  {
      "persistent" : {
          "cluster.max_shards_per_node" : "10000"
      }
  }
  '
  ```

  - 解决办法3

  ```bash
  PUT /_cluster/settings
  {
    "persistent": {
      "cluster": {
        "max_shards_per_node":10000
      }
    }
  }
  ```

  **说明**：persistent:永久生效，transient：临时生效

- 优化实践

```
如果现在你的场景是分片数不合适了，但是又不知道如何调整，那么有一个好的解决方法就是按照时间创建索引，然后进行通配查询。如果每天的数据量很大，则可以按天创建索引，如果是一个月积累起来导致数据量很大，则可以一个月创建一个索引。如果要对现有索引进行重新分片，则需要重建索引。

对于分片数的大小，业界一致认为分片数的多少与内存挂钩，认为 1GB 堆内存对应 20-25 个分片。因此，具有30GB堆的节点最多应有600个分片，但是越低于此限制，您可以使其越好。而一个分片的大小不要超过50G，通常，这将有助于群集保持良好的运行状况。
```



5. 配置启动

```shell
$ sudo vim /etc/supervisor/supervisor.d/kibana.ini
```

```ini
[program:kibana]
command=/usr/local/kibana/bin/kibana
autostart=false                 ; 在supervisord启动的时候也自动启动
startsecs=10                    ; 启动10秒后没有异常退出，就表示进程正常启动了，默认为1秒
autorestart=true                ; 程序退出后自动重启,可选值：[unexpected,true,false]，默认为unexpected，表示进程意外杀死后才重启
startretries=3                  ; 启动失败自动重试次数，默认是3
user=emon                       ; 用哪个用户启动进程，默认是root
priority=70                     ; 进程启动优先级，默认999，值小的优先启动
redirect_stderr=true            ; 把stderr重定向到stdout，默认false
stdout_logfile_maxbytes=20MB    ; stdout 日志文件大小，默认50MB
stdout_logfile_backups = 20     ; stdout 日志文件备份数，默认是10
stdout_logfile=/etc/supervisor/supervisor.d/kibana.log ; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以需要手动>创建目>录（supervisord 会自动创建日志文件）
stopasgroup=true                ;默认为false,进程被杀死时，是否向这个进程组发送stop信号，包括子进程
killasgroup=true                ;默认为false，向进程组发送kill信号，包括子进程
```

```shell
$ sudo supervisorctl update
$ sudo supervisorctl start kibana
```

**说明：**如果碰到启动失败，一直解决不了，可以使用root用户启动，并在command后追加`--allow-root`即可。

6. 访问

http://192.168.3.116:5601





[返回列表](https://github.com/EmonCodingBackEnd/backend-tutorial)

[TOC]



# 一、配置说明

- 配置文件位于`/usr/local/kibana/config/kibana.yml`文件夹中
  - `kibana.yml`关键配置说明
    - `server.host/server.port` 访问kibana用的地址和断开
    - `elasticsearch.url` 待访问elasticsearch的地址



- Kibana常用功能说明
  - Discover 数据搜索查看
  - Visualize 图表制作
  - Dashboard 仪表盘制作
  - Timelion 时序数据的高级可视化分析
  - DevTools 开发者工具
  - Management 配置











