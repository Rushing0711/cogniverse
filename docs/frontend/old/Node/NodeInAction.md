Node实战

[返回列表](https://github.com/EmonCodingFrontEnd/frontend-tutorial)

[TOC]

# 官方地址： https://nodejs.org/en/

# 官方文档：https://nodejs.org/en/docs/

# 中文文档：http://nodejs.cn/api/

# npm文档：https://www.npmjs.com/

# editconfig：https://editorconfig.org/







# 四、安装常用模块

## 1、`dependencies`类型包

- axios

一个基于promise的http库，可以用在浏览器和node.js中

```bash
npm i axios -S
```

- webpack

```bash
npm install -g webpack
```

- Bootstrap

  - 安装最新版

  ```
  npm install bootstrap@next
  ```

  - 安装指定版本

  ```
  gem install bootstrap -v 5.0.0.beta3
  ```

- mitt

```bash
npm install --save mitt
```

- vue-router

```bash
npm install vue-router@4
```

- vuex

```bash
npm install vuex@next
```

- markdown-it

```bash
npm install markdown-it --save
npm install --save @types/markdown-it
```

- normalize.css

```bash
npm install --save normalize.css
```

- mockjs

```bash
npm install mockjs
```

- Vant

```bash
npm i vant@next -S
```





# 五、常用前端依赖

## 1、babel

[babel官方文档](https://www.babeljs.cn/docs/usage)

- 安装

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
npm install --save @babel/polyfill
```

- 创建文件并配置`babel.config.json`（需要V7.8.0或更高版本，并将以下内容复制到此文件中：

```bash
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
        "useBuiltIns": "usage",
        "corejs": "3.6.5"
      }
    ]
  ]
}
```

>上述浏览器列表仅用于示例。请根据你所需要支持的浏览器进行调整。参见 [此处](https://www.babeljs.cn/docs/babel-preset-env) 以了解 `@babel/preset-env` 可接受哪些参数。

- 文件转换

  - 文件：

  ```bash
  babel src/index.js -o dist/index.js
  ```

  - 文件夹

  ```bash
  babel src -d dist
  ```

  - 实时监控

  ```bash
  babelk src -w -d dist
  ```

> 注意：如果是在IDE的控制台，可以去掉`./node_modules/.bin/`；如果是在类似`Git Bash`控制台，需要带上`./node_modules/.bin/`；比如：`./node_modules/.bin/babel src -d dist`

- 总结

我们使用 `@babel/cli` 从终端运行 Babel，利用 `@babel/polyfill` 来模拟所有新的 JavaScript 功能，而 `env` preset 只对我们所使用的并且目标浏览器中缺失的功能进行代码转换和加载 polyfill。

## 2、webpack

[webpack官方文档](https://webpack.docschina.org/concepts/)

- 安装

```bash
npm install webpack webpack-cli --save-dev
```



# 六、Koa

## 1、koa-generator

- 安装

```bash
npm install -g koa-generator
```

- 创建项目

```bash
koa2 <projectName>
```

```bash
koa2 -e <projectName>
```

- 安装依赖

```bash
cd koa2-learn && npm install
```

- 运行项目

```bash
set debug=koa* & npm start koa2-learn
或
npm run dev
```

- 访问

```bash
http://localhost:3000
```

## 2、中间件

### 2.1、mongoose

- 功能，mongodb

```bash
npm i mongoose
```

### 2.2、koa-generic-session

- 功能，处理session

```bash
npm i koa-generic-session
```

### 2.3、koa-redis

- 功能，redis

```bash
npm i koa-redis
```







































