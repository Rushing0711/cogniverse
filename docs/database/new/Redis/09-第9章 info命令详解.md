# 第9章 info命令详解

这里面参数比较多，在这我们主要关注几个重点的参数。

```bash
# Server
# Redis服务器版本
redis_version:5.0.8
redis_git_sha1:00000000
redis_git_dirty:0
redis_build_id:c09b553745bda413
redis_mode:standalone
os:Linux 3.10.0-1062.el7.x86_64 x86_64
arch_bits:64
multiplexing_api:epoll
atomicvar_api:atomic-builtin
gcc_version:4.8.5
process_id:105372
run_id:5fe51dddd038c4f5751c313e8f0a44c7de28fb28
tcp_port:6379
uptime_in_seconds:214752
uptime_in_days:2
hz:10
configured_hz:10
lru_clock:2017930
executable:/usr/local/redis/redis-server
# 启动Redis时使用的配置文件路径
config_file:/usr/local/redis/redis.conf

# Clients
# 已连接客户端的数量
connected_clients:2
client_recent_max_input_buffer:2
client_recent_max_output_buffer:0
blocked_clients:0

# Memory
used_memory:20605040
# Redis目前存储数据使用的内容
used_memory_human:19.65M
used_memory_rss:27955200
used_memory_rss_human:26.66M
used_memory_peak:20719048
used_memory_peak_human:19.76M
used_memory_peak_perc:99.45%
used_memory_overhead:11025256
used_memory_startup:861344
used_memory_dataset:9579784
used_memory_dataset_perc:48.52%
allocator_allocated:20571232
allocator_active:27917312
allocator_resident:27917312
total_system_memory:6124597248
# Redis可以使用的内存总量，和服务器的内存有关
total_system_memory_human:5.70G
used_memory_lua:37888
used_memory_lua_human:37.00K
used_memory_scripts:0
used_memory_scripts_human:0B
number_of_cached_scripts:0
maxmemory:200000000
maxmemory_human:190.73M
maxmemory_policy:noeviction
allocator_frag_ratio:1.36
allocator_frag_bytes:7346080
allocator_rss_ratio:1.00
allocator_rss_bytes:0
rss_overhead_ratio:1.00
rss_overhead_bytes:37888
mem_fragmentation_ratio:1.36
mem_fragmentation_bytes:7383968
mem_not_counted_for_evict:0
mem_replication_backlog:0
mem_clients_slaves:0
mem_clients_normal:66616
mem_aof_buffer:0
mem_allocator:libc
active_defrag_running:0
lazyfree_pending_objects:0

# Persistence
loading:0
rdb_changes_since_last_save:0
rdb_bgsave_in_progress:0
rdb_last_save_time:1646185019
rdb_last_bgsave_status:ok
rdb_last_bgsave_time_sec:0
rdb_current_bgsave_time_sec:-1
rdb_last_cow_size:360448
aof_enabled:0
aof_rewrite_in_progress:0
aof_rewrite_scheduled:0
aof_last_rewrite_time_sec:-1
aof_current_rewrite_time_sec:-1
aof_last_bgrewrite_status:ok
aof_last_write_status:ok
aof_last_cow_size:0

# Stats
total_connections_received:14
total_commands_processed:400239
instantaneous_ops_per_sec:0
total_net_input_bytes:14722884
total_net_output_bytes:15807481
instantaneous_input_kbps:0.00
instantaneous_output_kbps:0.00
rejected_connections:0
sync_full:0
sync_partial_ok:0
sync_partial_err:0
expired_keys:0
expired_stale_perc:0.00
expired_time_cap_reached_count:0
evicted_keys:0
keyspace_hits:11
keyspace_misses:1
pubsub_channels:0
pubsub_patterns:0
latest_fork_usec:528
migrate_cached_sockets:0
slave_expires_tracked_keys:0
active_defrag_hits:0
active_defrag_misses:0
active_defrag_key_hits:0
active_defrag_key_misses:0

# Replication
role:master
connected_slaves:0
master_replid:fbcd950f8c060c2ac9ca8731ec1fd883505c793a
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0

# CPU
used_cpu_sys:68.496385
used_cpu_user:32.703689
used_cpu_sys_children:0.295049
used_cpu_user_children:0.065101

# Cluster
cluster_enabled:0

# Keyspace
# db0表示0号数据库，keys：表示0号数据库的key总量，expires：表示0号数据库失效被删除的数量。
db0:keys=200000,expires=0,avg_ttl=0
db1:keys=2,expires=0,avg_ttl=0
```
