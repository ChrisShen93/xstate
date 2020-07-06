# 状态机

**状态机** 是一系列有限 [状态](./statenodes.md) 的集合，可以通过事件过渡到不同的状态。**状态图** 是状态机的扩展。一般来说，他们有以下特性：

- [嵌套](./hierarchical.md) 状态
- [并发](./parallel.md) 状态
- [历史](./history.md) 状态
- 其他更多内容在 [Statecharts: a Visual Formalism for Complex Systems](https://www.sciencedirect.com/science/article/pii/0167642387900359/pdf) 中有阐述。

## 配置

状态机和状态图可以通过 `Machine()` 工厂函数进行定义：

```js
import { Machine } from 'xstate';

const lightMachine = Machine({
  // Machine identifier
  id: 'light',

  // Initial state
  initial: 'green',

  // Local context for entire machine
  context: {
    elapsed: 0,
    direction: 'east'
  },

  // State definitions
  states: {
    green: {
      /* ... */
    },
    yellow: {
      /* ... */
    },
    red: {
      /* ... */
    }
  }
});
```

状态机的配置项和 [状态节点配置](./statenodes.md) 基本相同，只多了一个 `context` 属性：

- `context` - 代表当下所有状态机后代节点的本地“扩展状态”。在 [context](./context.md) 中查看详细描述。

## 选项

在状态机配置项中，可以用字符串去描述 [actions](./actions.md), [activities](./activities.md), [guards](./guards.md), [services](./communication.md)，它们具体的实现可以通过 `Machine()` 的第二个参数传入:

```js
const lightMachine = Machine(
  {
    id: 'light',
    initial: 'green',
    states: {
      green: {
        // action referenced via string
        entry: 'alertGreen'
      }
    }
  },
  {
    actions: {
      // action implementation
      alertGreen: (context, event) => {
        alert('Green!');
      }
    },
    activities: {
      /* ... */
    },
    guards: {
      /* ... */
    },
    services: {
      /* ... */
    }
  }
);
```

该配置项有 4 个可选属性：

- `actions` - 映射 action 的名称与其实现
- `activities` - 映射 activity 的名称与其实现
- `guards` - 映射过渡条件 (`cond`) 的名称与其实现
- `services` - 映射 invoked service (`src`) 的名称与其实现

## 扩展状态机

可以用 `.withConfig()` 去扩展一个状态机，其接受上述的所有配置参数：

```js
const lightMachine = // (same as above example)

const noAlertLightMachine = lightMachine.withConfig({
  actions: {
    alertGreen: (context, event) => {
      console.log('green');
    }
  }
});
```

## 初始上下文

在上述第一个例子中，`context` 直接在其所属状态机的配置中直接配置。如果想给一个已存在的状态机一个新的上下文(context)，可以使用 `.withContext()`：

```js
const lightMachine = // (same as first example)

const testLightMachine = lightMachine.withContext({
  elapsed: 1000,
  direction: 'north'
});
```

::: warning
`withContext` 不会通过浅拷贝的方式合并原始 `context`，而是直接用传入的 `context` 替换。如果有需要的话可以手动进行 merge 操作：

```js
const testLightMachine = lightMachine.withContext({
  // merge with original context
  ...lightMachine.context,
  elapsed: 1000
});
```

:::
