# 第2章 使用pnpm创建monorepo单体仓库

## 1 前置条件

- 安装 [Node.js](https://nodejs.org/)

- 安装 [pnpm](https://pnpm.io/)

## 2 初始化单体仓库

首先新建一个文件夹，名为 `flyin-awesome-monorepo`

进入 `flyin-awesome-monorepo` 文件夹，初始化一个默认的 `package.json` 文件，执行命令：

```bash
$ mkdir flyin-awesome-monorepo && cd flyin-awesome-monorepo
$ pnpm init
```

## 3 创建业务系统子项目

在根目录下创建业务系统子项目。

```bash
$ mkdir apps && cd apps
# Vue + JavaScript
$ pnpm create vite vue-js-app
# Vue + TypeScript
$ pnpm create vite vue-ts-app
# React + TypeScript
$ pnpm create vite react-ts-app
```

## 4 创建共享库（npm包）

在根目录下创建共享库。

```bash
$ mkdir packages && cd packages
# 共享工具项目
$ mkdir shared-utils && cd shared-utils
```

### 4.1 功能规划

- 双格式支持：
  1. 支持 `CommonJS` 和 `ES Module` 两种导入方式
  2. 可在 `Node.js` 和浏览器环境中使用
  3. 同时支持 `JavaScript` 和 `TypeScript` 项目
- 包内容：
  - 常量导出：`VERSION` 和 `DEFAULT_TIMEOUT`
  - 类型定义：`User` 和 `ApiResponse<T>` 类型
  - 函数导出：`deepClone`、`debounce`、`generateId` 和 `formatDate` 四个实用函数

- 开发支持：
  - 使用 `TypeScript` 编写，提供完整的类型支持
  - 使用 `Rollup` 进行构建打包
  - 包含完整的 `Jest` 测试套件
  - 支持自动构建（`prepublishOnly` 脚本）

- 配置亮点：
  - `package.json` 中正确配置了 `exports` 字段，区分 `import` 和 `require` 入口
  - 生成独立的类型定义文件（`.d.ts`）
  - 支持 `source map` 便于调试

### 4.2 文件结构

```bash
packages/shared-utils
├── src
│   └── index.ts
├── tests
│   └── utils.test.ts
├── jest.config.js
├── package.json
├── README.md
├── rollup.config.js
└── tsconfig.json

3 directories, 7 files
```

### 4.3 创建配置文件

- `flyin-awesome-monorepo/packages/shared-utils/package.json`

```js
{
  "name": "@flyin/shared-utils",
  "version": "1.0.0",
  "description": "A utility package that can be used in both CJS and ESM environments",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.esm.js"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.cjs.js"
      }
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "rollup -c",
    "clean": "rm -rf dist",
    "dev": "rollup -c -w",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "prepublishOnly": "npm run build"
  },
  "keywords": [
    "utils",
    "utilities",
    "cjs",
    "esm"
  ],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@rollup/plugin-typescript": "^8.3.0",
    "@types/jest": "^27.4.0",
    "jest": "^27.4.7",
    "rollup": "^2.66.0",
    "ts-jest": "^27.1.3",
    "tslib": "^2.3.1",
    "typescript": "^4.5.5"
  }
}
```

- `flyin-awesome-monorepo/packages/shared-utils/jest.config.js`

```js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/index.ts'
    ],
    testMatch: [
        '**/tests/**/*.{ts,tsx}',
        '**/*.(test|spec).{ts,tsx}'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json'
        }
    },
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/'
    ]
};
```

- `flyin-awesome-monorepo/packages/shared-utils/rollup.config.js`

```js
import typescript from '@rollup/plugin-typescript';
import {defineConfig} from 'rollup';

export default defineConfig({
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.cjs.js',
            format: 'cjs',
            sourcemap: true
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true
        }
    ],
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationMap: true
        })
    ]
});
```

- `flyin-awesome-monorepo/packages/shared-utils/tsconfig.json`

```js
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "strictFunctionTypes": true
  },
  "include": [
    "src"
  ]
}
```

- `flyin-awesome-monorepo/packages/shared-utils/README.md`

````markdown
# @flyin/shared-utils

一个支持 CJS 和 ESM 的简单工具库，可在 Node.js 和浏览器环境中使用。

## 安装

```bash
npm install @flyin/shared-utils
```

## 使用方式

### ESM (推荐)

```javascript
import { add, isEven, VERSION } from '@flyin/shared-utils';

const result = add(1, 2);
const even = isEven(4);
console.log(VERSION);
```

### ESM with default import

```javascript
import utils from '@flyin/shared-utils';

const result = utils.add(1, 2);
const even = utils.isEven(4);
console.log(utils.VERSION);
```

### CommonJS

```javascript
const { add, isEven, VERSION } = require('@flyin/shared-utils');

const result = add(1, 2);
const even = isEven(4);
console.log(VERSION);
```

### CommonJS with default import

```javascript
const utils = require('@flyin/shared-utils');

const result = utils.add(1, 2);
const even = utils.isEven(4);
console.log(utils.VERSION);
```

## API

### 常量

- `VERSION`: 包版本号
- `PI`: 圆周率常量

### 类型

- `UserInfo`: 用户信息类型

### 函数

#### `add(a: number, b: number): number`

计算两个数的和。

#### `isEven(num: number): boolean`

判断一个数是否为偶数。

#### `toUpperCase(str: string): string`

将字符串转换为大写。

## 目录结构

```
.
├── src/              # 源代码
├── tests/            # 测试文件
├── dist/             # 构建产物
├── package.json      # 包配置文件
├── tsconfig.json     # TypeScript 配置
├── rollup.config.js  # Rollup 构建配置
├── jest.config.js    # Jest 测试配置
└── README.md         # 使用文档
```

## 构建

```bash
# 清理旧的构建产物
npm run clean

# 构建项目
npm run build
```

## 测试

```bash
# 运行测试
npm test

# 监听模式运行测试
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage
```

## License

MIT
````

### 4.4 创建功能代码

- `flyin-awesome-monorepo/packages/shared-utils/src/index.ts`

```typescript
// 简单的常量导出
export const VERSION = '1.0.0';
export const PI = 3.14159;

// 简单的类型导出
export type UserInfo = {
  name: string;
  age: number;
};

// 简单的函数导出
/**
 * 计算两个数的和
 * @param a 第一个数
 * @param b 第二个数
 * @returns 两数之和
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * 判断一个数是否为偶数
 * @param num 要判断的数
 * @returns 如果是偶数返回true，否则返回false
 */
export function isEven(num: number): boolean {
  return num % 2 === 0;
}

/**
 * 将字符串转换为大写
 * @param str 输入字符串
 * @returns 转换后的大写字符串
 */
export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

// 默认导出一个包含所有功能的对象
const utils = {
  VERSION,
  PI,
  add,
  isEven,
  toUpperCase
};

export default utils;

```

### 4.5 创建测试代码

- `flyin-awesome-monorepo/packages/shared-utils/tests/utils.test.ts`

```typescript
import { add, isEven, toUpperCase, VERSION, PI } from '../src/index';

describe('Simple Utils tests', () => {
  describe('Constants', () => {
    it('should have correct VERSION', () => {
      expect(VERSION).toBe('1.0.0');
    });

    it('should have correct PI value', () => {
      expect(PI).toBe(3.14159);
    });
  });

  describe('add function', () => {
    it('should add two numbers correctly', () => {
      expect(add(1, 2)).toBe(3);
      expect(add(-1, 1)).toBe(0);
      expect(add(0, 0)).toBe(0);
      expect(add(1.5, 2.5)).toBe(4);
    });
  });

  describe('isEven function', () => {
    it('should correctly identify even numbers', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(3)).toBe(false);
      expect(isEven(0)).toBe(true);
      expect(isEven(-2)).toBe(true);
      expect(isEven(-3)).toBe(false);
    });
  });

  describe('toUpperCase function', () => {
    it('should convert string to uppercase', () => {
      expect(toUpperCase('hello')).toBe('HELLO');
      expect(toUpperCase('World')).toBe('WORLD');
      expect(toUpperCase('')).toBe('');
    });
  });
});
```

## 5 创建聚合项目

在根目录下创建业务系统子项目。

```bash
$ mkdir platforms && cd platforms
# 聚合项目：Vue + TypeScript
$ pnpm create vite portal
```

### 5.1 为业务子项目添加一个页面

- `flyin-awesome-monorepo/apps/vue-js-app/src/views/Home.vue`

```vue
<template>
  <div class="vue-js">
    <h1>这是 JavaScript 模块的首页</h1>
    <p>来自 vue-js-app</p>
    <p class="cool">使用 @flyin/shared-utils的方法：toUpperCase 得到 {{ toUpperCase('vue-js-app') }}</p>
  </div>
</template>

<script>
import {toUpperCase} from '@flyin/shared-utils'

export default {
  name: 'JsHomePage',
  methods: {toUpperCase}
}
</script>

<style scoped>
.vue-js {
  margin-top: 30px;
  height: 300px;
  background: linear-gradient(to right, #a8edea, #fed6e3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cool {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  background-size: 200% 200%;
  animation: simpleGradientShift 2s ease infinite;
}

@keyframes simpleGradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

</style>
```

- `flyin-awesome-monorepo/apps/vue-ts-app/src/views/Home.vue`

```vue
<template>
  <div class="vue-ts">
    <h1>这是 TypeScript 模块的首页</h1>
    <p>来自 vue-ts-app</p>
    <p class="cool">使用 @flyin/shared-utils的方法：toUpperCase 得到 {{ toUpperCase('vue-ts-app') }}</p>
  </div>
</template>

<script setup lang="ts">
// 这是一个 Composition API with <script setup> 组件
import {toUpperCase} from '@flyin/shared-utils'
</script>

<style scoped lang="css">
.vue-ts {
  margin-top: 30px;
  height: 300px;
  background: linear-gradient(to right, #00b09b, #96c93d, #ff6b6b, #ff8e8e, #4ecdc4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cool {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  background-size: 200% 200%;
  animation: simpleGradientShift 2s ease infinite;
}

@keyframes simpleGradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>
```

### 5.2 把业务子项目页面聚合到聚合项目

- `flyin-awesome-monorepo/platforms/portal/src/router.ts`

```ts
import {createRouter, createWebHistory} from 'vue-router';

// 【核心】使用动态导入语法引入其他模块的组件
// Vite 在构建时会将这些依赖一起打包进来
const routes = [
    {
        path: '/',
        redirect: '/js' // 默认重定向到JS模块
    },
    {
        path: '/js',
        name: 'JS Module',
        // 这是编译时集成！最终会打包进同一个chunk。
        component: () => import('vue-js-app/src/views/Home.vue')
    },
    {
        path: '/ts',
        name: 'TS Module',
        component: () => import('vue-ts-app/src/views/Home.vue')
    }
];

export const router = createRouter({
    history: createWebHistory(),
    routes
});
```

- `flyin-awesome-monorepo/platforms/portal/src/main.ts`

```ts
import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {router} from "./router"; // [!code ++][!code focus:1]

createApp(App).mount('#app') // [!code --][!code focus:1]
createApp(App).use(router).mount('#app') // [!code ++][!code focus:1]
```

- `flyin-awesome-monorepo/platforms/portal/src/App.vue`

```vue
<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo"/>
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo"/>
    </a>
  </div>
  <HelloWorld msg="Vite + Vue"/> <!-- [!code --][!code focus:14] -->
  <HelloWorld msg="Vite + Vue" v-if="false"/> <!-- [!code ++] -->
  <div class="unified-portal"> <!-- [!code ++] -->
    <nav> <!-- [!code ++] -->
      <h1>统一门户入口</h1> <!-- [!code ++] -->
      <router-link to="/js">JS 模块</router-link> <!-- [!code ++] -->
      | <!-- [!code ++] -->
      <router-link to="/ts">TS 模块</router-link> <!-- [!code ++] -->
    </nav> <!-- [!code ++] -->
    <main> <!-- [!code ++] -->
      <router-view/> <!-- [!code ++] -->
    </main> <!-- [!code ++] -->
  </div> <!-- [!code ++] -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.unified-portal { /* [!code ++][!code focus:32] */
  background-image: linear-gradient(315deg, #00b09b 0%, #96c93d 74%); /* [!code ++] */
  padding: 20px; /* [!code ++] */
  border-radius: 8px; /* [!code ++] */
  width: 800px; /* [!code ++] */
  height: 500px; /* [!code ++] */
} /* [!code ++] */

.unified-portal nav a { /* [!code ++] */
  font-size: 18px; /* [!code ++] */
  text-decoration: none; /* [!code ++] */
  color: #333333; /* 默认状态使用深灰色 */ /* [!code ++] */
  padding: 8px 16px; /* [!code ++] */
  border-radius: 4px; /* [!code ++] */
  transition: all 0.3s ease; /* [!code ++] */
  margin: 0 5px; /* [!code ++] */
} /* [!code ++] */

/* 鼠标悬停样式 */ /* [!code ++] */
.unified-portal nav a:hover { /* [!code ++] */
  color: #ffffff; /* 悬停时变为白色字体 */ /* [!code ++] */
  background-color: #3498db; /* 蓝色背景 */ /* [!code ++] */
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.4); /* [!code ++] */
} /* [!code ++] */
  
/* 激活状态样式 */ /* [!code ++] */
.unified-portal nav a.router-link-active { /* [!code ++] */
  color: #ffffff; /* 激活状态白色字体 */ /* [!code ++] */
  background-color: #9b59b6; /* 紫色背景标识激活状态 */ /* [!code ++] */
  font-weight: bold; /* [!code ++] */
  box-shadow: 0 2px 8px rgba(155, 89, 182, 0.4); /* [!code ++] */
} /* [!code ++] */

</style>
```

## 6 融合子项目与库

### 6.1 配置pnpm的工作区workspace

为了在 Monorepo 中管理多个项目，我们需要配置 pnpm workspace。在项目根目录下创建一个 `pnpm-workspace.yaml` 文件，并添加以下内容：

- **`pnpm-workspace.yaml`**

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'platforms/*'
```

这表示所有位于 `packages` 目录下的子目录都将被视为独立的包（项目）。**这个文件可以帮助我们在安装公共依赖的情况下，也将 `packages` 下的项目所需要的依赖也同时进行安装。**

根目录下的`package.json`添加`workspace`。

- **根目录 `package.json`**

```json
{
  "name": "flyin-awesome-monorepo",
  "version": "1.0.0",
  "description": "",
  "workspaces": [ // [!code ++][!code focus:3]
    "packages/*"  // [!code ++]
  ],              // [!code ++]
  "main": "index.js",
  "scripts": {
    "dev": "pnpm --filter portal run dev", // [!code ++][!code focus:12]
    "build": "pnpm --filter portal run build", // [!code ++]
    "dev:js": "pnpm --filter vue-js-app run dev",  // [!code ++]
    "build:js": "pnpm --filter vue-js-app run build", // [!code ++]
    "dev:ts": "pnpm --filter vue-ts-app run dev", // [!code ++]
    "build:ts": "pnpm --filter vue-ts-app run build", // [!code ++]
    "dev:react": "pnpm --filter react-ts-app run dev", // [!code ++]
    "build:react": "pnpm --filter react-ts-app run build", // [!code ++]
    "dev:all": "pnpm --parallel --filter \"./apps/*\" run dev", // [!code ++]
    "build:all": "pnpm --filter \"./apps/*\" run build", // [!code ++]
    "build:shared": "pnpm --filter \"./packages/shared-utils\" run build", // [!code ++]
    "test": "echo \"Error: no test specified\" && exit 1" // [!code ++]
  },
  "devDependencies": { // [!code ++][!code focus:3]
    // 这里放一些全局的开发工具，比如用于统一代码格式的prettier、eslint等（注意，这行需要删除，避免编译失败）
  }, // [!code ++]
  "keywords": [],
  "author": "wenqiu <liming20110711@163.com>",
  "license": "ISC",
  "packageManager": "pnpm@10.14.0"
}
```

### 6.2 在项目间建立依赖(在根目录执行)

```bash
$ pnpm --filter vue-js-app add "@flyin/shared-utils@workspace:*"
$ pnpm --filter vue-ts-app add "@flyin/shared-utils@workspace:*"
$ pnpm --filter portal add "vue-js-app@workspace:*"
$ pnpm --filter portal add "vue-ts-app@workspace:*"
```

### 6.3 为聚合项目安装路由

```bash
$ pnpm --filter portal add vue-router
```

## 7 核心工作流与命令

### 7.1 安装所有依赖 (在根目录执行)

```bash
$ pnpm install
```

### 7.2 为单个项目安装依赖(在根目录执行)

```bash
$ pnpm --filter vue-ts-app add axios
```

### 7.3 查看某个项目的目录结构

```bash
$ pnpm --filter @flyin/shared-utils exec tree
```

### 7.4 运行特定项目的脚本(在根目录执行)

- 命令范例

```bash
# 启动 vue-js-app
$ pnpm --filter vue-js-app dev
$ pnpm -F vue-js-app dev
$ pnpm dev:js

# 构建 vue-js-app
$ pnpm build:js
```

- 如何启动聚合项目？

```bash
# 编译shared-utils
$ pnpm build:shared
# 启动聚合项目
$ pnpm run dev
```

- 如何启动所有业务子项目？

```bash
# 并行启动所有应用（在根package.json中定义了脚本）
$ pnpm run dev:all
```





### 7.5 聚合项目演示

![image-20250920232208991](images/image-20250920232208991.png)





