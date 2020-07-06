# 安装

使用 NPM 或 Yarn 来安装 XState，或通过 `<script>` 直接从 CDN 中引入：

## 包管理器

```bash
npm install xstate@latest --save
# or:
yarn add xstate@latest --save
```

## 导出

下面列出了 XState 中常用的导出：

```js {2-9}
import {
  Machine,
  State,
  actions,
  assign,
  send,
  sendParent,
  interpret,
  spawn
} from 'xstate';
```

## CDN

直接从 [unpkg CDN](https://unpkg.com/xstate@4/dist/) 中引入 XState:

- XState core: [https://unpkg.com/xstate@4/dist/xstate.js](https://unpkg.com/xstate@4/dist/xstate.js)
- XState web: [https://unpkg.com/xstate@4/dist/xstate.web.js](https://unpkg.com/xstate@4/dist/xstate.web.js)
  - 浏览器版本，使用 es 模块化构建

```html
<script src="https://unpkg.com/xstate@4/dist/xstate.js"></script>
```

可以通过全局变量 `XState` 使用上面提到的导出项：

```js
const { Machine, actions, interpret } = XState; // global variable: window.XState

const lightMachine = Machine({
  // ...
});

const lightService = interpret(lightMachine);
```
