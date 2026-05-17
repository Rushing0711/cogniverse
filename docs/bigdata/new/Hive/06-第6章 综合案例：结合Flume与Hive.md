# 第6章 综合案例：结合Flume与Hive


- 使用外部分区表和视图实现
- 案例：Flume按天把日志数据采集到HDFS中的对应目录中，使用SQL按天统计每天的相关指标

[基于Flume示例](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/Flume/FlumeInAction.md#321%E6%A1%88%E4%BE%8B%E5%AF%B9%E9%87%87%E9%9B%86%E5%88%B0%E7%9A%84%E6%95%B0%E6%8D%AE%E6%8C%89%E5%A4%A9%E6%8C%89%E7%B1%BB%E5%9E%8B%E5%88%86%E7%9B%AE%E5%BD%95%E5%AD%98%E5%82%A8)

- 基于Flume生成的HDFS文件数据，创建外部分区表

```sql
create external table ex_par_more_type(
log string
)partitioned by (dt string, d_type string)
row format delimited 
fields terminated by '\t'
location '/flume/moreType';
```

- 添加分区

```sql
# 每天执行一次
hive (default)> alter table ex_par_more_type add partition(dt='20220128',d_type='giftRecord') location '/flume/moreType/20220128/giftRecord';
hive (default)> alter table ex_par_more_type add partition(dt='20220128',d_type='userInfo') location '/flume/moreType/20220128/	userInfo';
hive (default)> alter table ex_par_more_type add partition(dt='20220128',d_type='videoInfo') location '/flume/moreType/20220128/videoInfo';
```

- 定时添加分区脚本

```bash
$ vim /usr/local/hive/custom/shell/addPartition.sh
```

```bash
#!/bin/bash

# 每天凌晨1点定时添加当天日期的分区

if [ "a$1" = "a" ]; then
	dt=`date +%Y%m%d`
else
	dt=$1
fi

# 指定添加分区操作
hive -e "
alter table ex_par_more_type add if not exists partition(dt='${dt}',d_type='giftRecord') location '/flume/moreType/${dt}/giftRecord';
alter table ex_par_more_type add if not exists partition(dt='${dt}',d_type='userInfo') location '/flume/moreType/${dt}/	userInfo';
alter table ex_par_more_type add if not exists partition(dt='${dt}',d_type='videoInfo') location '/flume/moreType/${dt}/videoInfo';
"
```

```bash
$ chmod u+x /usr/local/hive/custom/shell/addPartition.sh
$ sh -x /usr/local/hive/custom/shell/addPartition.sh 20220128
```

**说明**：别忘记添加到crontab定时任务。

```bash
00 01 * * * emon /bin/bash /usr/local/hive/custom/shell/addPartition.sh >> /usr/local/hive/custom/shell/addPartition.log
```

- 查询数据

```sql
hive (default)> select * from ex_par_more_type where dt='20220128' and d_type='giftRecord';
```

- 创建视图

```sql
create view gift_record_view as select 
get_json_object(log,'$.send_id') as send_id,
get_json_object(log,'$.good_id') as good_id,
get_json_object(log,'$.video_id') as video_id,
get_json_object(log,'$.gold') as gold,
dt
from ex_par_more_type
where d_type='giftRecord';

create view user_info_view as select 
get_json_object(log,'$.uid') as uid,
get_json_object(log,'$.nickname') as nickname,
get_json_object(log,'$.usign') as usign,
get_json_object(log,'$.sex') as sex,
dt
from ex_par_more_type
where d_type='userInfo';

create view video_info_view as select 
get_json_object(log,'$.id') as id,
get_json_object(log,'$.uid') as uid,
get_json_object(log,'$.lat') as lat,
get_json_object(log,'$.lnt') as lnt,
dt
from ex_par_more_type
where d_type='videoInfo';
```

- 查询视图

```sql
hive (default)> select * from gift_record_view;
hive (default)> select * from gift_record_view where dt='20220128';
hive (default)> select * from user_info_view;
hive (default)> select * from  video_info_view;
```

