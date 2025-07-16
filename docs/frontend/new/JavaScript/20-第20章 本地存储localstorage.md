# 第20章 本地存储localstorage

## 20.1、本地存储介绍

- 以前我们页面写的数据一刷新页面就没有了。
- 随着互联网的快速发展，基于网页的应用越来越普遍，同时也变得越来越复杂了，为了满足各种各样的需求，会经常性在本地存储大量的数据，HTML5规范提出了相关解决方案。
    - 数据存储在<span style="color:red;font-weight:bold;">用户浏览器</span>中
    - 设置、读取方便、甚至页面刷新不丢失数据
    - 容量较大，sessionStorage和localStorage约5M左右
- 常见的使用场景：
    - https://todomvc.com/examples/vanilla-es6/ 页面刷新数据不丢失

## 20.2、本地存储分类

### 20.2.1、localStorage

目标：能够使用 localStorage 把数据存储在浏览器中。

- **作用：**可以将数据永久存储在本地（用户的电脑），除非手动删除，否则关闭页面也会存在。
- **特性：**
    - 可以多窗口（页面）共享（同一个刘篮球可以共享）。
    - 以键值对的形式存储使用。

- **语法**

    - **存储数据：**

  ```js
  localStorage.setItem(key, value);
  ```

    - 获取数据

  ```js
  localStorage.getItem(key);
  ```

    - 删除数据

  ```js
  localStorage.removeItem(key);
  ```

### 20.2.2、sessionStorage

- 特性：

    - 声明周期为关闭浏览器窗口。
    - 在同一个窗口（页面）下数据可以共享。
    - 以键值对的形式存储使用。

    - 用法和 localStorage 基本相同。

## 20.3、本地存储复杂数据类型

目标：能够存储复杂数据类型以及取出数据。

- 本地只能存储字符串，无法存储复杂数据类型。
- 解决：需要将复杂数据类型转换成JSON字符串，再存储到本地。
- **语法：**

```js
JSON.stringify(复杂数据类型)
```

- **问题：**因为本地存储里面取出来的是字符串，不是对象，无法直接使用。
- **解决：**把取出来的字符串转换为对象
- **语法：**

```js
const obj = JSON.parse(localStorage.getItem("obj"));
```
