---
title: Babel (pronounced "babble") 的使用
date: '2020-03-19'
spoiler: 概述 Babel 是什么和 Babel 的用法 
tags: JavaScript, Node
---

# 什么是 Babel

在开发基于 JavaScript 的应用比如 Vue, React, Node 时，经常可以看到一串 `@babel/...` 的依赖，通常脚手架已经帮我们完成这些依赖的添加而不需要我们操心，所以对于babel的使用配置一知半解，对这些的依赖也是感到疑惑，但是这些依赖究竟是做什么用的？

> The compiler for writing next generation JavaScript.

用官方的话来说，Babel 是用来写下一代 JavaScript 的编译器。

换句话说，平时我们所使用的浏览器或者 Node 环境并不支持最新的 ECMAScript 语法，或者我们平时开发时所用到的 Vue 和 JSX 语法。所以在我们的代码编写完成后，就需要一个编译器将代码转换成执行环境可以使用的 ES5 语法的 JavaScript 代码，这样我们既可以得到最新的 ES 语法带来的编程便利，又可以获得浏览器的支持。

注：虽然 Babel 可以把代码转换到更低的语法标准上，但目前大部分浏览器都已经支持 ES5，ES4 已经被标废弃 [^1]，所以通常我们会选择转换到 ES5 语法。

注：本文基于 Babel 7

# 使用方式

## 在命令行中使用

Babel 提供了 `@babel-cli` 给予了命令行执行 Babel 的可能，但通常我们并不会全局安装 Babel，而是根据项目安装不同版本的 Babel，

```SHELL
$ npm install @babel/core @babel-cli -D
```

然后，在 `package.json` 中添加

```JSON
{
  ...
  "devDependencies": {
    "babel-cli": "^6.0.0"
  },
  "scripts": {
    "build": "babel src -d dist"
  },
}
```

在命令行执行

```SHELL
$ npm run build
```

Babel 就会编译 `src` 文件夹中的所有文件，并输出到 `dist` 文件夹。

## 在 Webpack 中使用

现在我们的项目通常都会使用打包工具来构建，Webpack 是最常用的打包工具之一，在 Webpack 中使用 Babel 编译时，需要安装 babel-loader

```SHELL
$ npm i @babel/core babel-loader -D
```

然后在 `webpack.config.js` 的配置文件中，配置用 `babel-loader` 来加载处理 JavaScript 文件

```javascript
module.exports = {
    ...
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    }
};
```

## 其他使用方式

其他更多的使用方式可以到 Webpack 的官方文档去查询 

[Babel · The compiler for next generation JavaScript](https://babeljs.io/setup)

# 配置 Babel

Babel 的执行过程大概有三个步骤解析，转换，生成。

前面我们所安装的 `@babel/core` 并不提供任何功能，Babel 是一个社区驱动的开源项目，大部分功能都由社区完成。我们需要通过额外配置告诉 Babel 应该如何去转换。

注：`babylon` (现更名为`@babel/parser`)是 Babel 的语法解析内核

[babylon · Babel](https://babeljs.io/docs/en/babylon.html)

可以通过以下几个方式配置 Babel

### `package.json`

```JSON
{
   ...
   "devDependencies": {
       "@babel/core":"^7.4.5",
       "@babel/cli":"^7.4.4",
       "@babel/preset-env":"^7.4.5"
   }
   "babel": {
       "presets": ["@babel/preset-env"]
   }
}
```

### `.babelrc`

```JSON
{
    "presets": ["@babel/preset-env"]
}
```

### `.babelrc.js`

```javascript
module.exports = {
    presets: ['@babel/preset-env']
};
````

### `babel.config.js`

写法同 `.babelrc.js` 区别在于 `babel.config.js` 必须放在根目录，是针对整个项目的配置，而 `.babelrc.js` 是针对当前文件夹的配置，但是如果将 `.babelrc.js` 放在根目录，效果和 `babel.config.js` 一样，如果两个文件同时存在，`.babelrc` 会覆盖  `babel.config.js`。

## 插件与预设 (Plugins and Presets)

Babel 会安装我们在配置文件中的描述来完成代码的转换。这些转换都是通过 Babel 的各种插件完成的，比如说 ES5 中不支持箭头函数，就要通过 `@babel/plugin-transform-arrow-functions` 这个插件来完成转换。很多 Babel 的插件的功能都像这个插件一样，功能很单一，那么我们总不能一个一个引入一大堆的插件来完成转换，这样配置很不优雅，而且很容易出错。于是就有了预设 `preset`。比如，我们在上一个部分中的 Babel 配置文件中看到了一个 `@babel/preset-env` 的 `preset` 配置，这是 Babel 7 中一个十分重要的预设，用来取代 Babel 6 中关于 `es201X` 的所有预设。我们也可以通过配置可选参数 `targets` 来告诉 `@babel/preset-env` 我们的目标环境。

[@babel/preset-env · Babel](https://babeljs.io/docs/en/babel-preset-env)

```javascript
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    chrome: '58'
                }
            }
        ]
    ]
};
```

## `babel-register`

    $ npm install @babel/register -D

这是一个开发环境使用的工具，当我们在代码中使用 `require` 命令时，目标文件可能不是一个 ES5 标准的 JavaScript 文件，这是就需要 `babel-register` 来进行实时转码，`babel-register` 实现的方式是重载 `require` 命令，为其加上一个 Hook。使用时必须先加载 `babel-register`。

```javascript
require("babel-register");
require("./index.js");
```

## `babel-polyfill`

```SHELL
$ npm install @babel/polyfill
```

Babel 的一系列插件只是对语法进行转换，对于新的内置函数 (`Promise`, `Set`, `Map`)、静态方法(`Array.from`, `Object.assign`)、实例方法 (`Array.prototype.includes`）等就需要 `babel-polyfill` 来解决。但是由于 `babel-polyfill` 是一个整体，体积过大而且存在变量污染的可能性，在 Babel 7 中，已经不推荐使用 `babel-polyfill` 而是通过配置 `@babel/preset-env` 按需引入 `polyfill`。

```javascript
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                // usage: 按需引入 entry: 入口整体引入 false: 不引入
                useBuiltIns: 'usage', 
                // corejs 是给低版本的浏览器提供接口的库，也是 polyfill 的核心
                // 需要安装指定版本的 corejs 库作为生产依赖
                // 2: corejs@2  3: corejs@3
                corejs: 2
            }
        ]
    ]
};
```

通过 `@babel/polyfill` 编译出的代码如下

```javascript
// 编译前
const a = Array.from([1])

// 编译后
"use strict";
require("core-js/modules/es6.string.iterator");
require("core-js/modules/es6.array.from");

var a = Array.from([1]);
```

## `plugin-transform-runtime` 和 `runtime`

这两个插件解决的问题和 `@babel/polyfill` 类似，但是是以辅助函数来实现的，

```shell
$ npm install @babel/plugin-transform-runtime -D
$ npm install @babel/runtime
```

比如还是上面的例子，使用 `plugin-transform-runtime` 编译后的代码如下

```javascript
// 编译前
const a = Array.from([1])

// 编译后
"use strict";
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
var _from = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/from"));

var a = (0, _from["default"])([1]);
```

与 `@babel/polyfill` 不同的是 `plugin-transform-runtime` 并没有改变 `Array`，这样不会造成变量污染，但是也无法实现 `Array.prototype.includes` 这种实例方法。但是对于一般的项目尽量使用 `plugin-transform-runtime` 来处理。

## `babel-node`

其作用是在 Node 环境中，直接运行 es201X 的代码，而不需要额外进行转码。

Reference:

[^1] Babel [https://babeljs.io](https://babeljs.io/)

[^2] ECMAScript Wikipedia Page. [https://en.wikipedia.org/wiki/ECMAScript](https://en.wikipedia.org/wiki/ECMAScript)

[^3] 一口（很长的）气了解 babel [https://zhuanlan.zhihu.com/p/43249121](https://zhuanlan.zhihu.com/p/43249121)

[^4] Babel快速上手使用指南 [https://juejin.im/post/5cf45f9f5188254032204df1#heading-1](https://juejin.im/post/5cf45f9f5188254032204df1#heading-1)