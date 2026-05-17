# 第1章 初识Nginx

- <span style="background-color:rgb(255, 213, 94);">nginx.conf</span>
  - <span style="background-color:rgb(167, 135, 184);">全局块</span>：配置影响nginx全局的指令。如：用户组，nginx进程pid存放路径，日志存放路径，配置文件引入，允许生成worker process数等。
  - <span style="background-color:rgb(167, 135, 184);">events块</span>：配置影响nginx服务器或与用户的网络连接。如：每个进程的最大连接数，选取那种事件驱模型处理连接请求，是否允许同时接受多个网络连接，开启多个网络连接序列化等。
  - <span style="background-color:rgb(146, 197, 113);">http块</span>：可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置，如文件引入，mime-type定义，日志定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等。
    - <span style="background-color:rgb(202, 172, 191);">http全局块</span>：如upstream，错误页面，连接超时等。
    - <span style="background-color:rgb(185, 221, 167);">server块</span>：配置虚拟主机的相关参数，一个http中可以有多个server。
      - <span style="background-color:rgb(223, 215, 230);">location</span>：配置请求的路由，以及各种页面的处理情况。
      - <span style="background-color:rgb(223, 215, 230);">location</span>：
      - <span style="background-color:rgb(223, 215, 230);">......</span>：
