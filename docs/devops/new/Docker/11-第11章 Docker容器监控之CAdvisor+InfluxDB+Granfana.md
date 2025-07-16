# 第11章 Docker容器监控之CAdvisor+InfluxDB+Grafana

通过`docker stats`命令可以很方便的看到当前宿主机上所有容器的CPU，内存一级网络流量等数据，一般足够用了。

但是，`docker stats` 统计结果只能是当前宿主机的全部容器，数据资料是实时的，没有地方存储、没有健康指标过线预警等功能。

可以使用：CAdvisor监控收集+InfluxDB存储数据+Grafana展示图标。

## 1 CAdvisor

CAdvisor是一个容器资源监控工具，CPU、网络IO、磁盘IO等监控，同时提供了一个WEB页面用于查看容器的实时运动状态。CAdvisor默认存储2分钟的数据，而且只是针对单个物理机。不过，CAdvisor提供了很多数据集成接口，支持InfluxDB、Redis、Kafka、Elasticsearch等集成，可以加上对应配置将监控数据发往这些数据库存储起来。

CAdvisor功能主要有两点：

- 展示Host和容器两个层次的监控数据。
- 展示历史变化数据。

## 2 InfluxDB

InfluxDB是用Go语言编写的一个开源分布式时序、事件和指标数据库，无需外部依赖。

​	CAdvisor默认只在本机保存最近2分钟的数据，为了持久化存储数据和统一收集展示监控数据，需要将数据存储到InfluxDB中。InfluxDB是一个时序数据库，专门用于存储时序相关数据，很适合存储CAdvisor的的数据。而且，CAdvisor本身已经提供了InfluxDB的集成方法，在启动容器时指定即可。

InfluxDB主要功能：

- 基于时间序列，支持与时间有关的相关函数（如最大、最小、求和等）；
- 可度量性：你可以实时对大量数据进行计算；
- 基于事件：它支持任意的事件数据；

## 3 Grafana

Grafana是一个开源的数据监控分析可视化平台，支持多种数据源配置（支持的数据源包括InfluxDB、MySQL、Elasticsearch、OpenTSDB、Graphite等）和丰富的插件及模板功能，支持图标权限控制和报警。

Grafana主要特性：

- 灵活丰富的图形化选项
- 可以混合多种风格
- 支持白天和夜间模式
- 多个数据源

## 4 部署【未完成】

- 创建目录

```bash
$ mkdir -p cig
$ cd cig
```

- 编写`compose.yaml`

```yaml
# cadvisor 不支持arm，忽略！
```



