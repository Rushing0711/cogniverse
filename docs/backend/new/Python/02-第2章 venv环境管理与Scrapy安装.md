# 第2章 venv环境管理与Scrapy安装

## 2.1 python3.3以后自带的venv环境管理工具

| 命令                         | 说明         |
| ---------------------------- | ------------ |
| python3 -m venv env_name     | 创建虚拟环境 |
| source env_name/bin/activate | 激活环境     |
| deactivate                   | 退出环境     |

## 2.2 venv虚拟环境下用pip安装Scrapy

1. 安装

```bash
(firstenv) $ pip install Scrapy
```

2. 验证

- 查看命令

```bash
(firstenv) $ scrapy
Scrapy 2.4.1 - no active project
```

- 执行简单shell

```bash
(firstenv) $ scrapy shell 'http://www.huiba123.com'
```

执行报错：

>  ModuleNotFoundError: No module named '_sqlite3'

解决：

```bash
# 安装依赖
(firstenv) $ sudo yum install -y sqlite-devel
# 重新编译
(firstenv) [emon@emon Python-3.7.7]$ ./configure --enable-optimizations --enable-loadable-sqlite-extensions --prefix=/usr/local/Python/Python3.7.7
# 清理之前的安装
(firstenv) [emon@emon Python-3.7.7]$ rm -rf /usr/local/Python/Python-3.7.7/
# 安装
(firstenv) [emon@emon Python-3.7.7]$ make
(firstenv) [emon@emon Python-3.7.7]$ make install
# 解决后再次执行
(firstenv) $ scrapy shell 'http://www.huiba123.com'
```

## 2.3 安装ModelScope

1. 创建虚拟环境

```bash
python3 -m venv p3
```

2. 激活环境

```bash
source p3/bin/activate
```

3. 安装

```bash
pip install modelscope
```

4. 下载

```bash
modelscope download --model deepseek-ai/DeepSeek-R1-Distill-Qwen-32B
```

5. 退出环境

```bash
deactivate
```
