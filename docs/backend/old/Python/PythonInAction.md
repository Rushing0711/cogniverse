# Python

[返回列表](https://github.com/EmonCodingBackEnd/backend-tutorial)

[TOC]

# 一、Python安装

请参考 [Python安装](https://github.com/EmonCodingBackEnd/backend-tutorial/blob/master/tutorials/Linux/LinuxInAction.md)



# 二、安装包管理工具Conda【不推荐】

1. 安装包下载地址

`Miniconda`： https://docs.conda.io/en/latest/miniconda.html#linux-installers

安装教程： https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html

```bash
$ wget -cP /usr/local/src/ https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
```

2. 安装

```bash
$ bash /usr/local/src/Miniconda3-latest-Linux-x86_64.sh 
```

根据提示安装，一些关键信息如下：

配置安装位置，默认是 `/home/emon/miniconda3`，使用默认，直接回车。

> Miniconda3 will now be installed into this location:
> /home/emon/miniconda3
>
>   - Press ENTER to confirm the location
>   - Press CTRL-C to abort the installation
>   - Or specify a different location below
>
> [/home/emon/miniconda3] >>> 

是否要初始化，这里选择 `yes`

> Do you wish the installer to initialize Miniconda3
> by running conda init? [yes|no]
> [no] >>> 

初始化后，在 `/home/emon/.bashrc` 会添加一些conda的配置。

3、安装后配置

安装完成后，重新登录才生效！

>==> For changes to take effect, close and re-open your current shell. <==
>
>If you'd prefer that conda's base environment not be activated on startup, 
>   set the auto_activate_base parameter to false: 
>
>conda config --set auto_activate_base false

如果不需要启动就切换到base，可以配置如下：

```bash
# 配置后会保存在文件 $ vim .condarc 中
$ conda config --set auto_activate_base false
$ conda config --show|grep activate
auto_activate_base: False
```

4、更新

```bash
$ conda update conda
```

5、卸载

删除即可：

```bash
$ rm -rf ~/miniconda3/
```

删除环境配置：

```bash
# 打开文件，并删除如下部分
$ vim ~/.bashrc
```

```bash
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/home/emon/miniconda3/bin/conda' 'shell.bash' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/home/emon/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/home/emon/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/home/emon/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<
```

删除其他可能创建的conda隐藏文件或文件夹：

```bash
$ rm -rf ~/.condarc ~/.conda ~/.continuum
```

6、配置

- 查看配置帮助

```bash
$ conda config -h
```

- 查看所有配置

```bash
$ conda config --show
```

- 配置国内源

```bash
$ conda config --set show_channel_urls yes
$ conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
$ conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
$ conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
$ conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/bioconda/
```

- 查看配置

```bash
$ conda config --show-sources
==> /home/emon/.condarc <==
auto_activate_base: False
channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/msys2/
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
  - defaults
show_channel_urls: true
```

- 删除配置源

```bash
$ conda config --remove channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
$ conda config --remove channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
$ conda config --remove channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
$ conda config --remove channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/bioconda/
```



7、conda命令

| 命令                                                      | 说明                                     |
| --------------------------------------------------------- | ---------------------------------------- |
| conda info                                                | 查看conda信息                            |
| conda info --envs                                         | 查看环境信息                             |
| conda-env list 或者 conda info --envs 或者 conda env list | 查看已有虚拟环境                         |
| which python                                              | 进入虚拟环境后，最好检查下当前环境       |
| conda list                                                | 查看环境下已有的安装包                   |
| conda create -n py39 python=3.9                           | 创建名称为 py39 的虚拟环境               |
| conda remove -n py39 --all                                | 删除py39虚拟环境                         |
| conda activate [py39]                                     | 激活虚拟环境，如果指定则激活py39虚拟环境 |
| conda deactivate                                          | 退出虚拟环境                             |
| conda create -n py39latest --clone py39                   | 将py39重命名为py39latest                 |
| conda remove -n py39 --all                                | 再删除py39虚拟环境，达到重命名的效果     |
| conda install `<pkg>`                                       | 安装包                                   |
| conda uninstall `<pkg>`                                     | 卸载包                                   |
| conda update conda `<pkg>`                                  | 更新包                                   |
| conda update --all                                        | 更新所有包                               |



## conda虚拟环境下安装其他包【不推荐】

### 1、安装Scrapy

1. 安装

```bash
$ conda install scrapy
或者指定安装渠道：
$ conda install -c conda-forge scrapy
```

2. 验证

- 查看命令

```bash
$ scrapy
Scrapy 2.4.0 - no active project
```

- 执行简单shell

```bash
$ scrapy shell 'http://www.huiba123.com'
```



# 三、python3.3以后自带的venv环境管理工具

| 命令                         | 说明         |
| ---------------------------- | ------------ |
| python3 -m venv env_name     | 创建虚拟环境 |
| source env_name/bin/activate | 激活环境     |
| deactivate                   | 退出环境     |

## venv虚拟环境下用pip安装其他包

### 1、安装Scrapy

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

## 2、安装ModelScope

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

