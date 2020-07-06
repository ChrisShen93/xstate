# 快速开始

假设我们要将 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 建模为状态机。 首先，使用 NPM 或 Yarn 安装 XState

```bash
npm install xstate --save
```

接着，在项目中引入 `Machine`，这是创建状态机或状态图的工厂函数：

```js
import { Machine } from 'xstate';

const promiseMachine = Machine(/* ... */);
```

然后传入 [状态机配置](./machines.md#配置)。由于这里的例子是一个[嵌套状态机](./hierarchical.md)，我们需要提供一些特定的配置项：

- `id` - 用来标记状态机，并为其后代状态节点的 id 设置前缀
- `initial` - 用来指定当前状态机节点的初始状态
- `states` - 用来定义后端状态节点

```js
import { Machine } from 'xstate';

const promiseMachine = Machine({
  id: 'promise',
  initial: 'pending',
  states: {
    pending: {},
    resolved: {},
    rejected: {}
  }
});
```

我们需要在 state 节点上 添加 [过渡](./transitions/md)，并将 `resolved` 和 `rejected` 标记为 [终态节点](./final.md) ———— promise 状态机一旦到达这些状态则停止运行：

```js
import { Machine } from 'xstate';

const promiseMachine = Machine({
  id: 'promise',
  initial: 'pending',
  states: {
    pending: {
      on: {
        RESOLVE: 'resolved',
        REJECT: 'rejected'
      }
    },
    resolved: {
      type: 'final'
    },
    rejected: {
      type: 'final'
    }
  }
});
```

我们需要添加 [interpret](./interpretation.md) 去驱动状态机运行，interpret 会创建一个服务(service)：

```js
import { Machine, interpret } from 'xstate';

const promiseMachine = Machine({
  /* ... */
});

const promiseService = interpret(promiseMachine).onTransition((state) =>
  console.log(state.value)
);

// Start the service
promiseService.start();
// => 'pending'

promiseService.send('RESOLVE');
// => 'resolved'
```

你可以在 [可视化状态图 XState Viz](https://xstate.js.org/viz) 中拷贝/粘贴 `Machine(...)`部分的代码：

<iframe src="https://xstate.js.org/viz/?gist=9e4476d6312ac1bb29938d6c5e7f8f84&embed=1"></iframe>
