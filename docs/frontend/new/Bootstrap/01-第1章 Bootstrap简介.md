# 第1章 Bootstrap简介

##  1 Bootstrap简介

### 1.1 什么是Bootstrap？

Bootstrap是一个用于快速开发Web应用程序和网站的前端框架。Bootstrap是前端开发中比较受欢迎的框架，简洁且灵活。它基于HTML、CSS和JavaScript，HTML定义页面元素，CSS定义页面布局，而JavaScript负责页面元素的响应。Bootstrap将HTML、CSS和JavaScript封装成一个个功能组件，用起来简洁灵活，使得Web开发更加快捷。

Bootstrap5目前是Bootstrap的最新版本，利用提供的Sass变量和大量mixin、响应式栅格系统、可扩展的预制组件、基于jQuery的强大的插件系统，能够快速为你的想法开发出原型或者构建整个app。

**浏览器兼容性：**Bootstrap5兼容所有主流浏览器（Chrome、Firefox、Edge、Safari和opera）。如果您需要支持IE11及以下版本，请使用 Bootstrap4或者Bootstrap3.

## 2 Bootstrap安装

### 2.1 官网下载Bootstrap资源

[下载地址](https://v5.bootcss.com/docs/getting-started/download/)

```bash
# bootstrap-5.3.0-alpha1-dist
$ tree
```

::: details Bootstrap-5.3.0生产文件解压后目录结构

```bash
.
├── css
│   ├── bootstrap-grid.css
│   ├── bootstrap-grid.css.map
│   ├── bootstrap-grid.min.css
│   ├── bootstrap-grid.min.css.map
│   ├── bootstrap-grid.rtl.css
│   ├── bootstrap-grid.rtl.css.map
│   ├── bootstrap-grid.rtl.min.css
│   ├── bootstrap-grid.rtl.min.css.map
│   ├── bootstrap-reboot.css
│   ├── bootstrap-reboot.css.map
│   ├── bootstrap-reboot.min.css
│   ├── bootstrap-reboot.min.css.map
│   ├── bootstrap-reboot.rtl.css
│   ├── bootstrap-reboot.rtl.css.map
│   ├── bootstrap-reboot.rtl.min.css
│   ├── bootstrap-reboot.rtl.min.css.map
│   ├── bootstrap-utilities.css
│   ├── bootstrap-utilities.css.map
│   ├── bootstrap-utilities.min.css
│   ├── bootstrap-utilities.min.css.map
│   ├── bootstrap-utilities.rtl.css
│   ├── bootstrap-utilities.rtl.css.map
│   ├── bootstrap-utilities.rtl.min.css
│   ├── bootstrap-utilities.rtl.min.css.map
│   ├── bootstrap.css
│   ├── bootstrap.css.map
│   ├── bootstrap.min.css
│   ├── bootstrap.min.css.map
│   ├── bootstrap.rtl.css
│   ├── bootstrap.rtl.css.map
│   ├── bootstrap.rtl.min.css
│   └── bootstrap.rtl.min.css.map
└── js
    ├── bootstrap.bundle.js
    ├── bootstrap.bundle.js.map
    ├── bootstrap.bundle.min.js
    ├── bootstrap.bundle.min.js.map
    ├── bootstrap.esm.js
    ├── bootstrap.esm.js.map
    ├── bootstrap.esm.min.js
    ├── bootstrap.esm.min.js.map
    ├── bootstrap.js
    ├── bootstrap.js.map
    ├── bootstrap.min.js
    └── bootstrap.min.js.map

3 directories, 44 files
```

:::

下载了已编译的Bootstrap解压出来得到了Bootstrap文件夹，只要把html与Bootstrap文件夹放在一起，然后使用相对路径引用`bootstrap.bunmdle.min.js`和`bootstrap.min.css`文件即可。

1. 下载已编译版js和css文件，解压缩后将目录改名称为bootstrap5，放在你的网站目录。
2. 在网页`<head></head>`之间，添加：

```html
<link href="/static/bootstrap5/css/bootstrap.min.css" rel="stylesheet">
```

3. 在网页`<body></body>`之间，靠近结束标签的位置，添加：

```html
<script src="/static/bootstrap5/js/bootstrap.bundle.min.js"></script>
```

Bootstrap自带的大部分组件都需要依赖JavaScript才能起作用。将`<script>`标签，粘贴到页面底部，并且是在`</body>`标签之前，就能起作用了。

注意：要确保`bootstrap.min.css`和`bootstrap.bundle.min.js`确实在这个路径下。

**Bootstrap5的html模板：**

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link href="./static/bootstrap-5.3.0-alpha1-dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<script src="./static/bootstrap-5.3.0-alpha1-dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

### 2.2 使用 jsDelivr 免费 CDN 

使用 [jsDelivr](https://www.jsdelivr.com/) 的话可以跳过下载文件的操作，直接在你的项目中使用 Bootstrap 编译过的 CSS 和 JS 文件。

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/mhDoLbDldZc3qpsJHpLogda//BVZbgYuw6kof4u2FrCedxOtgRZDTHgHUhOCVim" crossorigin="anonymous"></script>
```

### 2.3 通过npm

在你的 Node.js 项目中安装 Bootstrap 的 [npm 软件包](https://www.npmjs.com/package/bootstrap)：

```bash
$ npm install bootstrap@5.3.0-alpha1
```

`const bootstrap = require('bootstrap')` 或 `import bootstrap from 'bootstrap'` 会将所有 Bootstrap 的插件加载到一个 `bootstrap` 对象上。 `bootstrap` 模块本身导出（export）所有插件。Bootstrap 的所有 jQuery 插件都放在软件包顶级目录下的 `/js/dist/*.js` 中，每个插件都可以独立加载。

Bootstrap 的 `package.json` 文件中包含以下一些元数据信息：

- `sass` - path to Bootstrap’s main [Sass](https://sass-lang.com/) source file
- `style` - path to Bootstrap’s non-minified CSS that’s been compiled using the default settings (no customization)



## 3 Bootstrap容器

容器是Bootstrap一个基本的构建模块，它包含、填充和对齐给定设备或视口中的内容。

Bootstrap需要一个容器元素来包裹网站的内容。

我们可以使用以下两个容器类：

- `.container`类用于固定宽度并支持响应式布局的容器。
- `.container-fluid`类用于100%宽度，占据全部视口（viewport）的容器。

### 3.1 固定宽度

`.container`类用于创建固定宽度的响应式页面。

**注意：**宽度（max-width）会根据屏幕宽度同比例放大或缩小。

|           | 超级小屏幕<br /><576px | 小屏幕<br />>=576px | 中等屏幕<br />>=768px | 大屏幕<br />>992px | 特大屏幕<br />>=1200px | 超级大屏幕<br />>=1400px |
| --------- | ---------------------- | ------------------- | --------------------- | ------------------ | ---------------------- | ------------------------ |
| max-width | 100%                   | 540px               | 720px                 | 960px              | 1140px                 | 1320px                   |

### 3.2 100%宽容

`.container-fluid`类用于创建一个全屏幕尺寸的容器，容器始终跨越整个屏幕宽度（width始终为100%）：

二者之间的共同点为，两者都可以将高度设置成auto，即自动模式。最大的不同就是宽度的设定上。

`.container`根据屏幕宽度利用媒体查询，已经设定了固定的宽度，作用为阶段性的改变宽度，所以在改变浏览器的大小时，页面是一个阶段一个阶段变化的。

`.container-fluid`则是将宽度设定为auto，所以当缩放浏览器时，它会保持全屏大小，始终保持100%的宽度。

### 3.3 响应式容器

可以使用`.container-sm|md|lg|xl`类来创建响应式容器。

容器的`max-width`属性值会根据屏幕的大小来改变。

| class            | 超级小屏幕<br /><576px | 小屏幕<br />>=576px | 中等屏幕<br />>=768px | 大屏幕<br />>992px | 特大屏幕<br />>=1200px | 超级大屏幕<br />>=1400px |
| ---------------- | ---------------------- | ------------------- | --------------------- | ------------------ | ---------------------- | ------------------------ |
| `.container-sm`  | 100%                   | 540px               | 720px                 | 960px              | 1140px                 | 1320px                   |
| `.container-md`  | 100%                   | 100%                | 720px                 | 960px              | 1140px                 | 1320px                   |
| `.container-lg`  | 100%                   | 100%                | 100%                  | 960px              | 1140px                 | 1320px                   |
| `.container-xl`  | 100%                   | 100%                | 100%                  | 100%               | 1140px                 | 1320px                   |
| `.container-xxl` | 100%                   | 100%                | 100%                  | 100%               | 100%                   | 1320px                   |

## 4 网格系统

### 4.1 网格系统介绍

Bootstrap提供了一套响应式、移动设备优先的流式网格系统，随着屏幕或视口（viewport）尺寸的增加，系统会自动分为最多12列。

我们也可以根据自己的需求，定义列数。Bootstrap 5的网格系统是响应式的，列会根据屏幕大小自动重新排列。请确保每一行中列的总和等于或小于12。

Bootstrap 5网格系统有以下6个类：

- `.col` - 针对所有设备
- `.col-sm`  - 平板 - 屏幕宽度等于或大于 576px。
- `.col-md` - 桌面显示器 - 屏幕宽度等于或大于 768px
- `.col-lg` - 大桌面显示器 - 屏幕宽度等于或大于 992px。
- `.col-xl` - 特大桌面显示器 - 屏幕宽度等于或大于 1200px。
- `.col-xxl` - 超大桌面显示器 - 屏幕宽度等于或大于 1400px。

### 4.2 网格系统规则

Bootstrap 5 网格系统规则：

- 网格每一行需要放在设置了`.container`（固定宽度）或`.container-fluid`（全屏宽度）类的容器中，这样就可以自动设置一些外边距与内边距。
- 使用行来创建水平的列组。
- 内容需要放置在列中，并且只有列可以是行的直接子节点。
- 预定义的类如`.row` 和 `.col-sm-4` 可用于快速制作网格布局。

### 4.3 网格的基本结构

#### 4.3.1 等宽响应式列

```html
<!--创建最多12列的响应式行-->
<div class="container">
    <div class="row">
        <!--div.col-md-1*12>{$}-->
        <div class="col-md-1">1</div>
        <div class="col-md-1">2</div>
        <div class="col-md-1">3</div>
        <div class="col-md-1">4</div>
        <div class="col-md-1">5</div>
        <div class="col-md-1">6</div>
        <div class="col-md-1">7</div>
        <div class="col-md-1">8</div>
        <div class="col-md-1">9</div>
        <div class="col-md-1">10</div>
        <div class="col-md-1">11</div>
        <div class="col-md-1">12</div>
    </div>
    <div class="row">
        <div class="col-md-4">1</div>
        <div class="col-md-4">2</div>
        <div class="col-md-4">3</div>
    </div>
</div>
```

要进行栅格系统操作，首先就要创建栅格系统的容器。

`container`和`row`共同组成栅格容器，`row`代表的就是一行。

创建栅格容器后，设置名为`col-md-`的div，当尾数为1时，表示每个div的宽度占1/12，所以每行最多可以放置12个子div。

若超过12个，则会在下一行显示。

#### 4.3.2 不等宽响应式列

```html
<div class="container">
    <div class="row">
        <div class="col-md-4">1</div>
        <div class="col-md-8">2</div>
    </div>
</div>
```

#### 4.3.3 嵌套列

```html
<div class="container">
		<div class="row">
        <div class="col-md-9">
            <div class="row">
                <div class="col-md-6">1</div>
                <div class="col-md-6">2</div>
            </div>
            <div class="row">
                <div class="col-md-3">1</div>
                <div class="col-md-6">2</div>
            </div>
        </div>
    </div>
</div>
```

#### 4.3.4 偏移列

偏移列是通过类名(`offset-*-*`）来设置的。第一个星号（`*`）可以是sm、md、lg、xl，表示屏幕设备类型，第二个星号（`*`）可以是1到11的数字。

```html
<div class="container">
    <div class="row">
        <div class="col-md-4">1</div>
        <div class="col-md-4 offset-md-4">2</div>
    </div>
    <div class="row">
        <div class="col-md-6 offset-md-3">1</div>
    </div>
</div>
```

`.offset-md-4`是把`.col-md-4`往右移了四列格子。

#### 4.3.5 列顺序

通过类（`.order`）来控制内容的可视顺序。这些类是响应式的，因此可以配合网络类使用。如（`.order-md-1 .order-md-3）

```html
<div class="container">
    <div class="row">
        <div class="col-md-9 order-2">
            <h1>这是最新的文章列表</h1>
            <ul>
                <li>文章标题一 作者 日期</li>
                <li>文章标题一 作者 日期</li>
                <li>文章标题一 作者 日期</li>
            </ul>
        </div>
        <div class="col-md-3 order-1">
            <h1>导航栏</h1>
            <ul>
                <li>首页</li>
                <li>视频直播</li>
                <li>视频回放</li>
            </ul>
        </div>
    </div>
  
    <!--
    排序优先级：order-first > 未指定排序，按照代码先后顺序 > order-1 > order-2 > ... > order-5 > order-last
    所以，如下的展示顺序是 8->7->2->3->4->5->6
    -->
    <div class="row">
        <div class="col-md-4 order-last">1</div>
        <div class="col-md-4 order-1">2</div>
        <div class="col-md-4 order-2">3</div>
        <div class="col-md-4 order-3">4</div>
        <div class="col-md-4 order-4">5</div>
        <div class="col-md-4 order-5">6</div>
        <div class="col-md-4">7</div>
        <div class="col-md-4 order-first">8</div>
    </div>
</div>
```

## 5 排版

Bootstrap 5 默认的 font-size 为 16px，line-height 为 1.5。默认的 font-family 为 “Helvetica Neue”，Helvetica，Arial，sans-serif。此外，所有的 `<p>`元素 margin-top:0、margin-bottom:1rem(16px)。

### 5.1标题标签`h1`-`h6`

可以使用类 `.h1`-`.h6`来设置标题。

```html
<div class="container">   
		<p class="h1">h1 Bootstrap 标题</p>
    <p class="h2">h2 Bootstrap 标题</p>
    <p class="h3">h3 Bootstrap 标题</p>
    <p class="h4">h4 Bootstrap 标题</p>
    <p class="h5">h5 Bootstrap 标题</p>
    <p class="h6">h6 Bootstrap 标题</p>
</div>
```

### 5.2 Display标题类

Bootstrap 5 还提供了使标题更突出的类，当我们需要标题突出时可以使用这些标题类。突出标题以更大的字体显示，并且会对其进行加粗。

```html
<div class="container">   
    <h1 class="display-1">Display 1</h1>
    <h1 class="display-2">Display 2</h1>
    <h1 class="display-3">Display 3</h1>
    <h1 class="display-4">Display 4</h1>
    <h1 class="display-5">Display 5</h1>
    <h1 class="display-6">Display 6</h1>
</div>
```

### 5.3 使用类突出显示段落

还可以通过在段落上添加类`.lead`来突出段落。

```html
<div class="container">   
    <p class="lead">这是一个段落</p>
    <p>这是一个段落</p>
</div>
```

### 5.4 自定义标题

我们可以使用带有类 `.text-muted` 的 `<p>` 标签来显示更小且颜色更浅的文本。

```html
<div class="container">   
		<p class="text-muted">样式text-muted</p>
</div>
```

Bootstrap 5 中 HTML `<small>` 元素用于创建字号更小的颜色更浅的文本。

也可以添加类`.small`指定更小文本（为父元素的85%）

```html
<div class="container">   
		<small>small标签小字体</small>
    <p class="small">样式.small</p>
</div>
```

### 5.5 文本对齐

可以使用文本对齐类轻松地将文本左对齐、右对齐和居中对齐。

```html
<div class="container">   
    <p class="text-start">这是一个左对齐的段落</p>
    <p class="text-center">这是一个居中对齐的段落</p>
    <p class="text-end">这是一个右对齐的段落</p>
</div>
```

还可以使用响应式文本对齐类根据屏幕大小对齐文本。

```html
<div class="container">   
    <p class="text-sm-center">文本将在屏幕宽度等于或大于 576px 视口及以上居中对齐。</p>
    <p class="text-md-center">文本将在屏幕宽度等于或大于 768px 视口及以上居中对齐。</p>
    <p class="text-lg-center">文本将在屏幕宽度等于或大于 992px 视口及以上居中对齐。</p>
    <p class="text-xl-center">文本将在屏幕宽度等于或大于 1200px 视口及以上居中对齐。</p>
    <p class="text-xxl-center">文本将在屏幕宽度等于或大于 1400px 视口及以上居中对齐。</p>
</div>
```

### 5.6 文本转换

可以将文本转换为小写、大写、设定单词首字母大写。

`.text-lowercase`：设定文本小写。

`.text-uppercase`：设定文本大写。

`.text-capitalize`：设定单词首字母大写

```html
<div class="container">   
    <p class="text-uppercase">this is uppercase</p>
    <p class="text-lowercase">THIS IS LOWERCASE</p>
    <p class="text-capitalize">this is capitalize</p>
</div>
```

### 5.7 截断长文本

对于较长的文本，可以使用类.text-truncate用省略号截断文本。在一行中显示一段文本但没有足够的可用空间时，它特别有用。

```html
<div class="container">   
    <div class="row">
        <p class="col-sm-2 text-truncate">
            对于较长的文本，可以使用类.text-truncate用省略号截断文本。在一行中显示一段文本但没有足够的可用空间时，它特别有用。
        </p>
    </div>
</div>
```

### 5.8 文本换行和溢出

通过类名（`.text-wrap`）可以设置文字在超过盒子宽度时自动换行。

通过类名（`.text-nowrap`）可以组织文字的换行，此时文字会溢出盒子。

```html
<div class="container">   
    <div class="row">
        <p class="col-sm-4 text-wrap" style="background-color: lightpink">
            对于较长的文本，可以使用类.text-truncate用省略号截断文本。在一行中显示一段文本但没有足够的可用空间时，它特别有用。
        </p>
    </div>

    <div class="row">
        <p class="col-sm-4 text-nowrap" style="background-color: lightpink">
            对于较长的文本，可以使用类.text-truncate用省略号截断文本。在一行中显示一段文本但没有足够的可用空间时，它特别有用。
        </p>
    </div>
</div>
```

### 5.9 文本大小

Bootstrap 5默认字体初识大小为16px。

在Bootstrap 5中将文本大小分为了六类，分别对应标题的h1-h6。

添加类名`.fs-*`或添加类名`h*`（`*`号为1-6的数值）

```html
<div class="container">   
    <p class="fs-1">这是一个fs-1</p>
    <p class="fs-2">这是一个fs-2</p>
    <p class="fs-3">这是一个fs-3</p>
    <p class="fs-4">这是一个fs-4</p>
    <p class="fs-5">这是一个fs-5</p>
    <p class="fs-6">这是一个fs-6</p>
</div>
```

### 5.10 字体粗细及斜体

在Bootstrap 5中将字体的粗细分为了5类 `.fw-bolder(bolder)` `.fw-bold(700)` `.fw-normal(400)` `.fw-light(300)` `.fw-lighter(lighter)` 斜体则是通过类名（`.fst-italic`)来控制，而通过类名（`.fst-normal`）也可以取消斜体。

```html
<div class="container">   
  	<p class="fw-bolder">这是一个fw-bolder</p>
    <p class="fw-bold">这是一个fw-bold</p>
    <p class="fw-normal">这是一个fw-normal</p>
    <p class="fw-light">这是一个fw-light</p>
    <p class="fw-lighter">这是一个fw-lighter</p>
    <p class="fst-italic">这是一个fst-italic</p>
    <p class="fst-normal">这是一个fst-normal</p>
</div>
```

### 5.12 行高（行距）

Bootstrap 5默认字体初始行高为1.5。

在Bootstrap 5中将行高分为了4种`.lh-1(1rem)` `.lh-sm(1.25rem)` `.lh-base(1.5rem)` `.lh-lg(2rem)`

```html
<div class="container">   
		<p style="background-color: lightblue" class="lh-1">离离原上草，一岁一枯荣；野火烧不尽，春风吹又生。</p>
    <p style="background-color: lightpink" class="lh-sm">离离原上草，一岁一枯荣；野火烧不尽，春风吹又生。</p>
    <p style="background-color: lightgreen" class="lh-base">离离原上草，一岁一枯荣；野火烧不尽，春风吹又生。</p>
    <p style="background-color: lightsalmon" class="lh-lg">离离原上草，一岁一枯荣；野火烧不尽，春风吹又生。</p>
    <p style="background-color: lightgray">离离原上草，一岁一枯荣；野火烧不尽，春风吹又生。</p>
</div>
```

## 6 颜色

Bootstrap 5提供了一些有代表意义的颜色类：

- `.text-muted`
- `.text-primary`
- `.text-success`
- `.text-info`
- `.text-warning`
- `.text-danger`
- `.text-secondary`
- `.text-dark`
- `.text-body`（默认颜色，为黑色）
- `.text-light`
- `.text-white`

可以使用上下文颜色类来强调文本并通过颜色来传达含义，针对文本颜色的类是：

```html
<div class="container">   
  	<p class="text-muted">柔和的文本 浅灰色</p>
    <p class="text-primary">重要的文本 蓝色</p>
    <p class="text-success">成功的文本 浅绿色</p>
    <p class="text-info">代表一些提示信息的文本 浅蓝色</p>
    <p class="text-warning">警告文本 黄色</p>
    <p class="text-danger">危险操作文本 红褐色</p>
    <p class="text-secondary">副标题 灰色</p>
    <p class="text-dark">深灰色文字 黑暗的</p>
    <p class="text-body">默认颜色，为黑色</p>
    <p class="text-light">浅灰色文本（白色背景上看不清楚） 非常的浅灰色</p>
    <p class="text-white" style="background-color: #1a1e21">白色文本（白色背景上看不清楚） 白色</p>
</div>
```

可以设置文本颜色透明度为 50%，使用 `.text-black-50` 或 `.text-white-50` 类：

```html
<div class="container">   
    <p class="text-black-50">透明度为 50% 的黑色文本</p>
    <p class="text-white-50" style="background-color: #1a1e21">透明度为 50% 的白色文本，背景为黑色。</p>
</div>
```

与上下文颜色类类似，可以使用上下文背景颜色类来设置 `background-color` 元素以对它们施加额外的强调。

```html
<div class="container">   
    <p class="bg-primary text-white">重要的背景颜色</p>
    <p class="bg-success text-white">成功的背景颜色</p>
    <p class="bg-info text-white">代表一些提示信息的背景颜色</p>
    <p class="bg-warning">警告的背景颜色</p>
    <p class="bg-danger text-white">危险操作的背景颜色</p>
    <p class="bg-secondary text-white">副标题的背景颜色</p>
    <p class="bg-dark text-white">深灰色的背景颜色</p>
    <p class="bg-light text-dark">浅灰色的背景颜色</p>
</div>
```

## 7 列表

使用Bootstrap创建列表。

可以创建三种不同类型的HTML列表：

- 无序列表 —— 顺序无关紧要的项目列表。无序列表中的列表项标有项目符号，例如 `○`、`●`等 `ul>li`

- 有序列表 —— 顺序确实很重要的项目列表。无序列表中的列表项用数字标记，例如 `1`、`vi`等 `ol>li`
- 定义列表 —— 术语列表及其相关描述。`dl>dt`

### 7.1 无样式的有序列表和无序列表

需要从列表项中删除默认样式，可以通过简单地将类`.list-unstyled`应用到响应的`<ul>`或`<ol>`元素来做到这一点。

```html
<div class="container">   
    <ul>
        <li>选项1</li>
        <li>选项2</li>
        <li>选项3</li>
    </ul>
    <ul class="list-unstyled">
        <li>选项1</li>
        <li>选项2</li>
        <li>选项3</li>
    </ul>

    <ol>
        <li>选项1</li>
        <li>选项2</li>
        <li>选项3</li>
    </ol>
    <ol class="list-unstyled">
        <li>选项1</li>
        <li>选项2</li>
        <li>选项3</li>
    </ol>
</div>
```

### 7.2 内联列表

如果要使用有序列表或无序列表创建水平菜单，则需要将所有列表项放在一行中（即并排）。可以通过将类`.list-inline`添加到`<ul>`或`<ol>`并将类`.list-inline-item`添加到子`<li>`元素来完成次操作。

```html
<div class="container">   
    <dl class="row">
        <dt class="col-sm-3">bg-primary</dt>
        <dd class="col-sm-9">重要的背景颜色</dd>
        <dt class="col-sm-3">bg-success</dt>
        <dd class="col-sm-9">执行成功的背景颜色</dd>
        <dt class="col-sm-3" >bg-warning</dt>
        <dd class="col-sm-9">警告的背景颜色</dd>
    </dl>

    <ul class="list-inline">
        <li class="list-inline-item">橘子</li>
        <li class="list-inline-item">苹果</li>
        <li class="list-inline-item">香蕉</li>
        <li class="list-inline-item">水蜜桃</li>
        <li class="list-inline-item">哈密瓜</li>
    </ul>
</div>
```

## 8 列表组

列表组是非常有用且灵活的组件，用于以漂亮的方式显示元素列表。在最基本的形式中，列表组只是一个带有`.list-group`类的无序列表，且列表中的元素带有`.list-group-item`类。

### 8.1 基础的列表组

```html
<div class="container">   
    <ul class="list-group">
        <li class="list-group-item">第一项</li>
        <li class="list-group-item">第二项</li>
        <li class="list-group-item">第三项</li>
    </ul>
</div>
```



### 8.2 设置禁用和活动项

可以将类`.active`添加到`.list-group-item`类的后面用来指示当前项目元素是活动的。同样，可以将`.disabled`添加到`.list-group-item`后面，从而使其看起来是禁用状态。

```html
<div class="container">   
    <ul class="list-group">
        <li class="list-group-item active">第一项</li>
        <li class="list-group-item">第二项</li>
        <li class="list-group-item disabled">第三项</li>
    </ul>
</div>
```



### 8.3 链接项的列表组

要创建一个链接的列表项，可以将`<li>`替换`<a>`。如果想鼠标悬停显示灰色背景可以添加`.list-group-item-action`类。

```html
<div class="container">   
    <ul class="list-group">
        <li href="#" class="list-group-item list-group-item-action">第一项</li>
        <li href="#" class="list-group-item list-group-item-action">第二项</li>
        <li href="#" class="list-group-item list-group-item-action">第三项</li>
    </ul>
</div>
```

### 8.4 移除列表变宽

使用`.list-group-flush`类添加到`list-group`元素上，用以移除外边框和圆角，从而创建与其父容器边对边的列表组。

```html
<div class="container">   
    <ul class="list-group list-group-flush">
        <li class="list-group-item list-group-item-action">第一项</li>
        <li class="list-group-item list-group-item-action">第二项</li>
        <li class="list-group-item list-group-item-action">第三项</li>
    </ul>
</div>
```

### 8.5 水平列表组

`.list-group-horizontal`类添加到`.list-group`，可以将列表项水平显示而不是垂直显示（并排而不是堆叠）

```html
<div class="container">   
    <ul class="list-group list-group-horizontal">
        <li class="list-group-item list-group-item-action active">第一项</li>
        <li class="list-group-item list-group-item-action">第二项</li>
        <li class="list-group-item list-group-item-action">第三项</li>
    </ul>
</div>
```

### 8.6 创建编号列表组

可以通过简单地在`.list-group`元素上添加类`.list-groupu-numbered`来创建带有元素编号的列表组。

```html
<div class="container">   
    <ul class="list-group list-group-numbered">
        <li class="list-group-item list-group-item-action">第一项</li>
        <li class="list-group-item list-group-item-action">第二项</li>
        <li class="list-group-item list-group-item-action">第三项</li>
    </ul>
</div>
```

数字是通过CSS（而不是`<ol>`元素的默认浏览器样式）生成的。

### 8.7 带徽章的列表组

带徽章的列表组其实就是将Bootstrap框架中的徽章组件和基础列表组件结合在一起的一个效果，只需在`.list-groupt-item`的基础上追加徽章组件`badge`。

```html
<div class="container">   
		<ul class="list-group">
        <li class="list-group-item list-group-item-action">第一项
            <small class="badge bg-danger">hot</small></li>
        <li class="list-group-item list-group-item-action">第二项</li>
        <li class="list-group-item list-group-item-action">第三项</li>
    </ul>
</div>
```

### 8.8 多种颜色列表项

和大多数其他组件一样，可以在列表组项目上使用相应的类来对它们进行额外的背景色设置，来对它们施加额外的强调。

列表项目的颜色可以通过以下列来设置：

- `.list-group-item-success`
- `.list-group-item-secondary`
- `.list-group-item-info`
- `.list-group-item-warning`
- `.list-group-item-danger`
- `.list-group-item-primary`
- `.list-group-item-dark`

- `.list-group-item-light`

```html
<div class="container">   
		<ul class="list-group">
        <li class="list-group-item list-group-item-action list-group-item-success">Success item</li>
        <li class="list-group-item list-group-item-action list-group-item-secondary">Secondary item</li>
        <li class="list-group-item list-group-item-action list-group-item-info">Info item</li>
        <li class="list-group-item list-group-item-action list-group-item-warning">Warning item</li>
        <li class="list-group-item list-group-item-action list-group-item-danger">Danger item</li>
        <li class="list-group-item list-group-item-action list-group-item-primary">Primary item</li>
        <li class="list-group-item list-group-item-action list-group-item-dark">Dark item</li>
        <li class="list-group-item list-group-item-action list-group-item-light">Light item</li>
    </ul>
</div>
```

### 8.9 向列表组添加自定义内容

Bootstrap框架在链接列表组的基础上增加了两个样式：

`.list-group-item-heading`：用来定义列表项头部样式。

`.list-group-item-text`：用来定义列表项主要内容。

这两个样式最大的作用就是用来帮助开发者可以自定义列表项里的内容。

```html
<div class="container">   
    <div class="list-group">
        <a href="#" class="list-group-item active">
            <h3 class="list-group-item-heading">网站服务</h3>
        </a>
        <a href="#" class="list-group-item">
            <h3 class="list-group-item-heading">标题一</h3>
            <p class="list-group-item-text">内容一</p>
        </a>
        <a href="#" class="list-group-item">
            <h3 class="list-group-item-heading">标题二</h3>
            <p class="list-group-item-text">内容而</p>
        </a>
    </div>
</div>
```

## 9 徽章

徽章一般用于在网页上标明一些有价值的信息，例如重要的标题、警告信息、通知计数器等。

### 9.1 创建徽章

徽章（Badges）主要用于突出显示新的或未读的项。如需使用徽章，只需要将`.badge`类加上带有指定意义的颜色类（如`.bg-secondary`）添加到`<span>`元素上即可。徽章可以根据父元素的大小的变化而变化：

```html
<div class="container">   
		<span class="badge bg-danger">hot</span>
</div>
```

### 9.2 徽章的颜色

```html
<div class="container">   
    <span class="badge bg-primary">主要</span>
    <span class="badge bg-secondary">次要</span>
    <span class="badge bg-success">成功</span>
    <span class="badge bg-danger">危险</span>
    <span class="badge bg-warning">警告</span>
    <span class="badge bg-info">信息</span>
    <span class="badge bg-light">浅色</span>
    <span class="badge bg-dark">深色</span>
</div>
```

### 9.3 胶囊徽章

使用`.rounded-pill`类来设置药丸形状徽章（具有更多圆角的徽章）

```html
<div class="container">   
		<span class="badge rounded-pill bg-primary">主要</span>
</div>
```

### 9.4 元素内的徽章

```html
<div class="container">   
    <ul class="list-inline">
        <li class="list-inline-item">首页</li>
        <li class="list-inline-item">分类</li>
        <li class="list-inline-item">消息
            <span class="badge rounded-pill bg-secondary">5</span>
        </li>
    </ul>
</div>
```

## 10 表格

### 10.1 创建一个简单的表格

Bootstrap 5通过`.table`类来设置基础表格的样式。

```html
<div class="container">
    <table class="table">
        <thead>
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>联系方式</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>1</td>
            <td>张三</td>
            <td>18</td>
            <td>12345678901</td>
        </tr>
        <tr>
            <td>2</td>
            <td>李四</td>
            <td>28</td>
            <td>18765432101</td>
        </tr>
        <tr>
            <td>3</td>
            <td>王五</td>
            <td>38</td>
            <td>19012345678</td>
        </tr>
        </tbody>
    </table>
</div>

```

### 10.2 表格颜色

通过指定意义的颜色类名可以为表格的行或者单元格设置颜色。表格颜色类的说明：

| 类名             | 描述                             |
| ---------------- | -------------------------------- |
| .table-primary   | 蓝色：指定这时一个重要的操作     |
| .table-success   | 绿色：指定这是一个允许执行的操作 |
| .table-danger    | 红色：指定这是一个危险的操作     |
| .table-info      | 浅蓝色：表示内容已变更           |
| .table-warning   | 橘色：表示需要注意的操作         |
| .table-active    | 灰色：用于鼠标悬停效果           |
| .table-secondary | 灰色：表示内容不怎么重要         |
| .table-light     | 浅灰色，可以是表格行的背景       |
| .table-dark      | 深灰色，可以是表格行的背景       |

```html
<div class="container">
    <table class="table table-success">
        <thead>
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>联系方式</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>1</td>
            <td>张三</td>
            <td>18</td>
            <td>12345678901</td>
        </tr>
        <tr>
            <td>2</td>
            <td>李四</td>
            <td>28</td>
            <td>18765432101</td>
        </tr>
        <tr>
            <td>3</td>
            <td>王五</td>
            <td>38</td>
            <td>19012345678</td>
        </tr>
        </tbody>
    </table>
  
    <table class="table">
        <thead>
        <tr class="table-active">
            <th>编号</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>联系方式</th>
        </tr>
        </thead>
        <tbody>
        <tr class="table-primary">
            <td>1</td>
            <td>张三</td>
            <td>18</td>
            <td>12345678901</td>
        </tr>
        <tr class="table-info">
            <td>2</td>
            <td>李四</td>
            <td>28</td>
            <td>18765432101</td>
        </tr>
        <tr class="table-warning">
            <td>3</td>
            <td>王五</td>
            <td>38</td>
            <td>19012345678</td>
        </tr>
        </tbody>
    </table>
</div>
```

### 10.3 创建带条纹行的表格

通过添加`.table-striped`类，可在`<tbody>`内的行上看到条纹，即在基础表格的代码上为标签`<table>`添加`.table-striped`类。

```html
<div class="container">
    <table class="table table-striped">
        <thead>
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>联系方式</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>1</td>
            <td>张三</td>
            <td>18</td>
            <td>12345678901</td>
        </tr>
        <tr>
            <td>2</td>
            <td>李四</td>
            <td>28</td>
            <td>18765432101</td>
        </tr>
        <tr>
            <td>3</td>
            <td>王五</td>
            <td>38</td>
            <td>19012345678</td>
        </tr>
        <tr>
            <td>4</td>
            <td>赵六</td>
            <td>48</td>
            <td>19012345678</td>
        </tr>
        <tr>
            <td>5</td>
            <td>田七</td>
            <td>58</td>
            <td>19012345678</td>
        </tr>
        </tbody>
    </table>
</div>
```

### 10.4 带边框表格

通过将类`.table-bordered`添加到`.table`基类创建的表格上，就可以在表格和单元格的所有边上添加边框。

```html
<div class="container">
    <table class="table table-bordered">
        <thead>
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>联系方式</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>1</td>
            <td>张三</td>
            <td>18</td>
            <td>12345678901</td>
        </tr>
        <tr>
            <td>2</td>
            <td>李四</td>
            <td>28</td>
            <td>18765432101</td>
        </tr>
        <tr>
            <td>3</td>
            <td>王五</td>
            <td>38</td>
            <td>19012345678</td>
        </tr>
        </tbody>
    </table>
</div>
```

### 10.5 无边框表格

通过添加`.table-borderless`类可以取消表格和单元格所有边的边框。

```html
<div class="container">
    <table class="table table-borderless">
        <thead>
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>联系方式</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>1</td>
            <td>张三</td>
            <td>18</td>
            <td>12345678901</td>
        </tr>
        <tr>
            <td>2</td>
            <td>李四</td>
            <td>28</td>
            <td>18765432101</td>
        </tr>
        <tr>
            <td>3</td>
            <td>王五</td>
            <td>38</td>
            <td>19012345678</td>
        </tr>
        </tbody>
    </table>
</div>
```

### 10.6 鼠标悬停状态表格

`.table-hover`类可以为表格的每一行添加鼠标悬停效果（灰色背景）：

```html
<div class="container">
    <table class="table table-hover">
        <thead>
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>联系方式</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>1</td>
            <td>张三</td>
            <td>18</td>
            <td>12345678901</td>
        </tr>
        <tr>
            <td>2</td>
            <td>李四</td>
            <td>28</td>
            <td>18765432101</td>
        </tr>
        <tr>
            <td>3</td>
            <td>王五</td>
            <td>38</td>
            <td>19012345678</td>
        </tr>
        </tbody>
    </table>
</div>
```

### 10.7 创建较小的表格

`.table-sm`类用于通过减少内边距来设置较小的表格，使表格更紧凑并节省空间。

```html
<div class="container">
    <table class="table table-sm">
        <thead>
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>联系方式</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>1</td>
            <td>张三</td>
            <td>18</td>
            <td>12345678901</td>
        </tr>
        <tr>
            <td>2</td>
            <td>李四</td>
            <td>28</td>
            <td>18765432101</td>
        </tr>
        <tr>
            <td>3</td>
            <td>王五</td>
            <td>38</td>
            <td>19012345678</td>
        </tr>
        </tbody>
    </table>
</div>
```

### 10.8 响应式表格

要使任何表格具有响应性，只需要将`.table`元素包裹在`.table-responsive`元素内，即可创建响应式表格。还可以使用`.table-responsive{-sm|-md|-lg|-xl|-xxl}`根据视口宽度指定表格合适应具有滚动条。

注意：`.table-responsive`类是在table外包裹一个div实现。

可以通过以下类设定在指定屏幕宽度下显示滚动条：

| 类名                  | 屏幕宽度 |
| --------------------- | -------- |
| .table-responsive-sm  | <576px   |
| .table-responsive-md  | <768px   |
| .table-responsive-lg  | <992px   |
| .table-responsive-xl  | <1200px  |
| .table-responsive-xxl | <1400px  |

```html
<div class="container">
    <div class="table-responsive">
        <table class="table">
            <thead>
            <tr class="text-nowrap">
                <th>编号</th>
                <th>姓名</th>
                <th>年龄</th>
                <th>联系方式</th>
                <th>编号</th>
                <th>姓名</th>
                <th>年龄</th>
                <th>联系方式</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>1</td>
                <td>张三</td>
                <td>18</td>
                <td>12345678901</td>
                <td>1</td>
                <td>张三</td>
                <td>18</td>
                <td>12345678901</td>
            </tr>
            <tr>
                <td>2</td>
                <td>李四</td>
                <td>28</td>
                <td>18765432101</td>
                <td>2</td>
                <td>李四</td>
                <td>28</td>
                <td>18765432101</td>
            </tr>
            <tr>
                <td>3</td>
                <td>王五</td>
                <td>38</td>
                <td>19012345678</td>
                <td>3</td>
                <td>王五</td>
                <td>38</td>
                <td>19012345678</td>
            </tr>
            </tbody>
        </table>
    </div>
</div>
```

## 11 图像

### 11.1 圆角图片

`.rounded`类为图像添加圆角：

```html
<div class="container">
    <img src="../imgs/诛仙仙境透视背景.jpg" alt="诛仙仙境透视背景.jpg" style="width: 350px" class="rounded">
</div>
```

### 11.2 圆形

`.rounded-circle`类可以设置椭圆形图片：

```html
<div class="container">
    <img src="../imgs/诛仙仙境透视背景.jpg" alt="诛仙仙境透视背景.jpg" style="width: 350px" class="rounded-circle">
</div>
```

### 11.3 缩略图

`.img-thumbnail`类用于设置图片缩略图（图片有边框）

```html
<div class="container">
		<img src="../imgs/诛仙仙境透视背景.jpg" alt="诛仙仙境透视背景.jpg" style="width: 350px" class="img-thumbnail">
</div>
```

### 11.4 对齐图像

使用`.float-start`类将图形向左浮动，或者使用`.float-end`向右浮动：

```html
<div class="container">
    <img src="../imgs/诛仙仙境透视背景.jpg" alt="诛仙仙境透视背景.jpg" style="width: 350px" class="float-start">
    <img src="../imgs/诛仙仙境透视背景.jpg" alt="诛仙仙境透视背景.jpg" style="width: 350px" class="float-end">
</div>
```

### 11.5 图片居中

使用`.mx-auto(margin:auto)`和`.d-block(display:block)`类来设置图片居中对齐；注意，是两个一起使用。

```html
<div class="container">
    <img src="../imgs/诛仙仙境透视背景.jpg" alt="诛仙仙境透视背景.jpg" style="width: 350px" class="mx-auto d-block">
</div>
```

### 11.6 响应式图片

图像有各种各样的尺寸，我们需要根据屏幕的大小自动适应。

我们可以通过在`<img>`标签中添加`.img-fluid`类来设置响应式图片。

此类主要将样式`max-width:100%`和`height:auto`应用于图像，以便它很好地缩放以适合包含元素。

```html
<div class="container">
		<img src="../imgs/诛仙仙境透视背景.jpg" alt="诛仙仙境透视背景.jpg" class="img-fluid">
</div>
```

## 12 按钮

### 12.1 按钮样式

Bootstrap内置了几种预定义的按钮样式，每种样式都有自己的语义目的，并添加了一些额外的按钮。

任何带有`.btn`的元素都会继承圆角的默认外观。

```html
<div class="container">
    <button type="button" class="btn">基本按钮</button>
    <button type="button" class="btn btn-primary">主要按钮</button>
    <button type="button" class="btn btn-secondary">次要按钮</button>
    <button type="button" class="btn btn-success">成功</button>
    <button type="button" class="btn btn-info">信息</button>
    <button type="button" class="btn btn-warning">警告</button>
    <button type="button" class="btn btn-danger">危险</button>
    <button type="button" class="btn btn-dark">黑色</button>
    <button type="button" class="btn btn-light">浅色</button>
    <button type="button" class="btn btn-link">链接</button>
</div>
```

按钮类可用于`<a>`、`<button>`或`<input>`元素：

```html
<div class="container">   
		<a href="#" class="btn btn-success">链接按钮</a>
    <button type="button" class="btn btn-success">基本按钮</button>
    <input type="button" class="btn btn-success" value="输入按钮">
    <input type="submit" class="btn btn-success" value="提交按钮">
    <input type="reset" class="btn btn-success" value="重置按钮">
</div>
```

### 12.2 按钮设置边框

Bootstrap 5还提供了八个轮廓/边框按钮。鼠标移动到按钮上添加突出的效果：

```html
<div class="container">   
    <button type="button" class="btn btn-outline-primary">主要</button>
    <button type="button" class="btn btn-outline-secondary">次要</button>
    <button type="button" class="btn btn-outline-success">成功</button>
    <button type="button" class="btn btn-outline-info">信息</button>
    <button type="button" class="btn btn-outline-warning">警告</button>
    <button type="button" class="btn btn-outline-danger">危险</button>
    <button type="button" class="btn btn-outline-dark">深色</button>
    <button type="button" class="btn btn-outline-light text-dark">浅色</button>
</div>
```

### 12.3 按钮尺寸

Bootstrap 5可以设置按钮的大小，使用`.btn-lg`类设置大按钮，使用`.btn-sm`类设置小按钮：

```html
<div class="container">   
    <button type="button" class="btn btn-primary">默认按钮大小</button>
    <button type="button" class="btn btn-lg btn-primary">大型按钮</button>
    <button type="button" class="btn btn-sm btn-primary">小型按钮</button>
</div>
```

### 12.4 块级按钮

如需创建跨越父元素整个宽度的块级按钮，通过添加`.btn-block`类可以设置块级按钮，`.d-grid`类设置在父级元素中：

```html
<div class="container">   
    <div class="d-grid gap-2">
        <button type="button" class="btn btn-primary">宽屏按钮</button>
        <button type="button" class="btn btn-primary">宽屏按钮</button>
    </div>
    <hr>
    <button class="btn btn-primary w-50" type="button">用 w-50 的按钮</button>
    <hr>
    <button class="btn btn-primary w-100" type="button">用 w-100 的按钮</button>
</div>
```

| 类                                                           | 描述                                         |
| ------------------------------------------------------------ | -------------------------------------------- |
| .btn-lg                                                      | 这会让按钮看起来比较大。                     |
| .btn-sm                                                      | 这会让按钮看起来比较小。                     |
| .btn-block<span style="color:red;font-weight:bold;">【已废弃】</span> | 这会创建块级的按钮，会横跨父元素的全部宽度。 |

### 12.5 活动/禁用按钮

按钮可以设置为激活或者禁止点击的状态。

`.active`类可以设置按钮是可用的，`disabled`属性可以设置按钮是不可以点击的。注意`<a>`元素不支持`disabled`属性，你可以通过添加`.disabled`类来禁止链接的点击。

```html
<div class="container">   
    <button type="button" class="btn btn-primary active">激活的按钮</button>
    <button type="button" class="btn btn-primary disabled">禁止点击的按钮（类控制）</button>
    <button type="button" class="btn btn-primary" disabled>禁止点击的按钮（属性控制）</button>
    <a href="#" class="btn btn-primary disabled">禁止点击的链接</a>
</div>
```

`.disabled`类只会使链接在视觉上看起来像已禁用，但是除非从中删除`href`属性，否则该链接将保持可点击状态。



## 13 按钮组

要创建一个按钮组，只需要将一系列具有`.btn`类的按钮包装在`<div>`元素中，然后在其上应用`.btn-group`类。还可以在单个按钮上应用`.active`类似指示活动状态。

### 13.1 基本的按钮组

```html
<div class="container">
    <div class="btn-group">
        <button type="button" class="btn btn-success active">按钮1</button>
        <button type="button" class="btn btn-success">按钮2</button>
        <button type="button" class="btn btn-success">按钮3</button>
    </div>
    <hr>
    <div class="btn-group">
        <button type="button" class="btn btn-success">按钮1</button>
        <button type="button" class="btn btn-warning">按钮2</button>
        <button type="button" class="btn btn-danger">按钮3</button>
    </div>
</div>
```

### 13.2 按钮组的大小

以使用`.btn-group-lg|sm|xs`类来设置按钮组的大小，可应用到整个按钮组的大小调整，而不需要对每个按钮进行大小调整。

```html
<div class="container">
    <div class="btn-group btn-group-lg">
        <button type="button" class="btn btn-success">按钮1</button>
        <button type="button" class="btn btn-warning">按钮2</button>
        <button type="button" class="btn btn-danger">按钮3</button>
    </div>
    <div class="btn-group btn-group-xs">
        <button type="button" class="btn btn-success">按钮1</button>
        <button type="button" class="btn btn-warning">按钮2</button>
        <button type="button" class="btn btn-danger">按钮3</button>
    </div>
    <div class="btn-group btn-group-sm">
        <button type="button" class="btn btn-success">按钮1</button>
        <button type="button" class="btn btn-warning">按钮2</button>
        <button type="button" class="btn btn-danger">按钮3</button>
    </div>
</div>
```

### 13.3 垂直按钮组

可以使按钮组显示未垂直堆叠而不是水平堆叠。为此，只需要将类`.btn-group`替换为类`.btn-group-vertical`。

```html
<div class="container">   
    <div class="btn-group-vertical">
        <button type="button" class="btn btn-primary active">按钮1</button>
        <button type="button" class="btn btn-primary">按钮2</button>
        <button type="button" class="btn btn-primary">按钮3</button>
    </div>
</div>
```

## 14 加载器

### 14.1 基本用法

使用Bootstrap读取图标以表示元件加载状态，这些读取图标完全使用HTML、CSS。要创建spinner/加载器，可以使用`.spinner-border`类：

```html
<div class="container">
    <div class="spinner-border"></div>
</div>
```

可以使用文本颜色类设置不同的颜色：

```html
<div class="container"> 
    <div class="spinner-border text-muted"></div>
    <div class="spinner-border text-primary"></div>
    <div class="spinner-border text-success"></div>
    <div class="spinner-border text-info"></div>
    <div class="spinner-border text-warning"></div>
    <div class="spinner-border text-danger"></div>
    <div class="spinner-border text-secondary"></div>
    <div class="spinner-border text-dark"></div>
    <div class="spinner-border text-light"></div>
</div>
```

### 14.2 闪烁的加载效果

使用`.spinner-grow`类来设置闪烁的加载效果。

```html
<div class="container"> 
    <div class="spinner-border text-muted"></div>
    <div class="spinner-border text-primary"></div>
    <div class="spinner-border text-success"></div>
    <div class="spinner-border text-info"></div>
    <div class="spinner-border text-warning"></div>
    <div class="spinner-border text-danger"></div>
    <div class="spinner-border text-secondary"></div>
    <div class="spinner-border text-dark"></div>
    <div class="spinner-border text-light"></div>
</div>
```

### 14.3 设置加载效果大小

使用`.spinner-border-sm`或`.spinner-growsm`类来创建加载效果的大小：

```html
<div class="container"> 
    <div class="spinner-border spinner-border-sm"></div>
    <div class="spinner-grow spinner-grow-sm"></div>
</div>
```

### 14.4 加载按钮

```html
<div class="container"> 
    <button class="btn btn-primary">
        <span class="spinner-border spinner-border-sm"></span>
        加载中...
    </button>
    <button class="btn btn-primary">
        <span class="spinner-grow spinner-grow-sm"></span>
        加载中...
    </button>
    <button class="btn btn-primary" disabled>
        <span class="spinner-border spinner-border-sm"></span>
        禁用...
    </button>
    <button class="btn btn-primary" disabled>
        <span class="spinner-grow spinner-grow-sm"></span>
        禁用...
    </button>
</div>
```

## 15 进度条

### 15.1 基本用法

进度条可用于向用户显示任务或操作的进度。进度条（progress bar）支持堆叠、动画背景和文本标签。

工作原理：

- 我们使用`.progress`作为最外层元素，用于指示进度条（progress bar）的最大值。

- 我们在内部使用`.progress-bar`来指示到目前为止的进度。

- `.progress-bar`需要通过内联样式、工具类或自定义CSS属性来设置其宽度。

下面的示例将展示如何创建一个带有垂直渐变的简单进度条。

```html
<div class="container">
    <div class="progress">
        <div class="progress-bar" style="width: 50%"></div>
    </div>
</div>
```

### 15.2 进度条的高度

进度条的高度默认为 1rem （通常为 16px），但我们也可以根据需要通过在`.progres`元素上设置 CSS height 属性来设置其高度。

注意，必须为进度容器和进度条设置相同的高度：

```html
<div class="container">
    <div class="progress" style="height: 2px;">
        <div class="progress-bar bg-success" style="width: 50%;"></div>
    </div>

    <hr>
    <div class="progress" style="height: 20px;">
        <div class="progress-bar bg-success" style="width: 50%;"></div>
    </div>
</div>
```

### 15.3 进度条标签

通过在`.progress-bar`元素内添加文本，就可以为进度条（progress bar）添加标签，以显示可见的百分比。

```html
<div class="container">
    <div class="progress">
        <div class="progress-bar bg-success" style="width: 60%;">60%</div>
    </div>
</div>
```

### 15.4 进度条颜色

可以使用背景颜色实用程序类来创建各种颜色的进度条，以便通过不同颜色传达不同的含义。默认情况下，进度条为蓝色（主要）。

```html
<div class="container">
    <div class="progress">
        <div class="progress-bar bg-info" style="width: 20%;">20%</div>
    </div>
    <div class="progress">
        <div class="progress-bar bg-success" style="width: 40%;">40%</div>
    </div>
    <div class="progress">
        <div class="progress-bar bg-warning" style="width: 60%;">60%</div>
    </div>
    <div class="progress">
        <div class="progress-bar bg-danger" style="width: 90%;">90%</div>
    </div>
</div>
```

### 15.5 条纹的进度条

要创建条纹的进度条，只需要向`.progress-bar`元素添加一个额外的类`.progress-bar-striped`。

条纹是通过进度条背景颜色上的CSS渐变生成的。与纯色类似，还可以使用相同的背景色实用程序类创建不同颜色的带条纹的进度条。

```html
<div class="container">
    <div class="progress">
        <div class="progress-bar progress-bar-striped" style="width: 50%">50%</div>
    </div>
    <div class="progress">
        <div class="progress-bar bg-warning progress-bar-striped" style="width: 60%">60%</div>
    </div>
    <div class="progress">
        <div class="progress-bar bg-danger progress-bar-striped" style="width: 70%">70%</div>
    </div>
</div>
```

### 15.6 进度条动画

将类`.progress-bar-animated`添加到带有类`.progress-bar`的元素上可以为条纹的进度条设置动画，它将通过CSS3动画从右到左未条纹设置动画。

```html
<div class="container">
    <div class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 50%"></div>
    </div>
</div>
```

### 15.7 混合色彩进度条

可以在一个进度组件中放置多个进度条来使它们并排在一起，进度条也可以堆叠。

```html
<div class="container">
    <div class="progress">
        <div class="progress-bar bg-success" style="width: 40%">空闲空间（40%）</div>
        <div class="progress-bar bg-warning" style="width: 25%">警告空间（25%）</div>
        <div class="progress-bar bg-danger" style="width: 15%">危险空间（15%）</div>
        <div class="progress-bar bg-dark" style="width: 15%">黑暗空间（15%）</div>
        <div class="progress-bar bg-primary" style="width: 5%">主空间（5%）</div>
    </div>
</div>
```

## 16 小工具

Bootstrap 5提供了很多有用的类来帮助我们快速实现效果，不需要重复写一些CSS代码，可以在不使用任何CSS代码的情况下快速设置元素样式。

### 16.1 边框类

使用边框类为元素添加或删除边框：

```html
<div class="container">
    <div class="border bg-light border-primary">边框颜色为primary</div>
    <div class="border border-0">移除所有边框</div>
    <div class="border border-1">设置边框宽度为1px</div>
    <div class="border border-2">设置边框宽度为2px</div>
    <div class="border border-3">设置边框宽度为3px</div>
    <div class="border border-4">设置边框宽度为4px</div>
    <div class="border border-5">设置边框宽度为5px</div>
    <div class="border border-top-0">顶部无边框</div>
    <div class="border border-end-0">右侧无边框</div>
    <div class="border border-bottom-0">底部无边框</div>
    <div class="border border-start-0">左侧无边框</div>

    <div class="bg-success" style="min-height:5px"></div>
    <div class="border-top">顶部边框</div>
    <div class="border-end">右侧边框</div>
    <div class="border-bottom">底部边框</div>
    <div class="border-start">左侧边框</div>

    <div class="bg-success" style="min-height:5px"></div>
    <div class="border border-primary">主色调边框</div>
    <div class="border border-secondary">次要色调边框</div>
    <div class="border border-success">成功边框</div>
    <div class="border border-info">信息边框</div>
    <div class="border border-warning">警告边框</div>
    <div class="border border-danger">危险边框</div>
    <div class="border border-light">浅色边框</div>
    <div class="border border-dark">深灰色边框</div>
    <div class="border border-white">白色边框</div>
</div>
```

### 16.2 边框圆角

使用rounded类为元素添加圆角：

```html
<div class="container">
    <div class="rounded bg-info">全圆角</div>
    <div class="rounded-top bg-info">顶部圆角</div>
    <div class="rounded-end bg-info">右侧圆角</div>
    <div class="rounded-bottom bg-info">底部圆角</div>
    <div class="rounded-start bg-info">左侧圆角</div>
    <div class="rounded-circle bg-info">圆形 (用于制作正圆头像等)</div>
    <div class="rounded-pill bg-info">胶囊形 (用于标签、导航项)</div>
    <div class="rounded-0 bg-info">直角，无圆角</div>
    <div class="rounded-1 bg-info">小圆角 (通常约 0.25rem / 4px)</div>
    <div class="rounded-2 bg-info">默认圆角 (通常约 0.375rem / 6px)</div>
    <div class="rounded-3 bg-info">大圆角 (通常约 0.5rem / 8px)</div>
    <div class="rounded-4 bg-info">更大圆角 (通常约 1rem / 16px)</div>
    <div class="rounded-5 bg-info">最大圆角 (通常约 2rem / 32px)</div>
</div>
```

### 16.3 浮动与清除浮动

元素向右浮动使用`.float-end`类，向左浮动使用`.float-start`类，`.clearfix`类用于清除浮动。

```html
<div class="container">
    <div class="clearfix bg-primary">
        <span class="float-start">向左浮动</span>
        <span class="float-end">向右浮动</span>
    </div>
</div>
```

响应式浮动

可以根据屏幕尺寸来设置浮动效果`.float-*-left|right`，其中`*`表示。

- sm(>=576px)
- md(>=768px)
- lg(>=992px)
- xl(>=1200px)
- xxl(>=1400px)

```html
<div class="container">
    <div class="clearfix bg-success">
        <div class="float-sm-end">在小型屏幕或者更宽的屏幕上向右浮动</div>
    </div>
    <div class="clearfix bg-success">
        <div class="float-md-end">在中型屏幕或者更宽的屏幕上向右浮动</div>
    </div>
    <div class="clearfix bg-success">
        <div class="float-lg-end">在大型屏幕或者更宽的屏幕上向右浮动</div>
    </div>
    <div class="clearfix bg-success">
        <div class="float-xl-end">在超大型屏幕或者更宽的屏幕上向右浮动</div>
    </div>
    <div class="clearfix bg-success">
        <div class="float-xxl-end">在特大型屏幕或者更宽的屏幕上向右浮动</div>
    </div>
</div>
```

### 16.4 居中对齐

使用`.mx-auto`类来设置元素居中对齐（添加`margin-left`和`margin-right`为auto）

```html
<div class="container">
    <div class="bg-primary mx-auto text-center" style="width: 500px;line-height: 50px ">这是一个居中盒子</div>
</div>
```

文本对齐类：

| 类               | 描述                                       |
| ---------------- | ------------------------------------------ |
| .text-start      | 文本左对齐                                 |
| .text-center     | 文本居中对齐                               |
| .text-end        | 文本右对齐                                 |
| .text-wrap       | 隐藏溢出的文本                             |
| .text-nowrap     | 防止文本换行                               |
| .text-truncate   | 使用省略号截断文本                         |
| .text-break      | 将长文本截断，防止溢出                     |
| .text-lowercase  | 将文本转换为小写                           |
| .text-uppercase  | 将文本转换为大写                           |
| .text-capitalize | 将每个单词的第一个字体转换成大写           |
| .fw-bold         | 将元素的字体设置为粗体                     |
| .fw-bolder       | 将元素的字体粗细设置为更粗（相对于父元素） |
| .fw-normal       | 将元素的字体设置为正常                     |
| .fw-light        | 将元素的字体设置为细体                     |
| .fw-lighter      | 将元素的字体粗细设置为更细（相对于父元素） |

















































































