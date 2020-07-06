# 状态

状态是系统在某一时刻展现的抽象。app 是对状态的解释，而事件则引起状态的变化。一个有限状态机在任意确认的时刻只可能处在一种状态。状态机的当前状态通过一个 `State` 实例描述：

```js {13-18,21-26}
const lightMachine = Machine({
  id: 'light',
  initial: 'green',
  states: {
    green: {
      /* ... */
    }
    // ...
  }
});

console.log(lightMachine.initialState);
// State {
//   value: 'green',
//   actions: [],
//   context: undefined,
//   // ...
// }

console.log(lightMachine.transition('yellow', 'TIMER'));
// State {
//   value: { red: 'walk' },
//   actions: [],
//   context: undefined,
//   // ...
// }
```

## State 定义

`State` 对象可以被 JSON 序列化，且拥有以下属性：

- `value` - 当前状态值（如 `{ red: 'walk' }`）
- `context` - 当前状态的[上下文](./context.md)
- `event` - 出发上一个状态过渡到当前状态的事件对象
- `actions` - 待执行的 [actions](./actions.md) 数组
- `activities` - a mapping of [activities](./activities.md) to `true` if the activity started, or `false` if stopped.
- `history` - 上一个 `State` 实例
- `meta` - [state node](./statenodes.md) 的 `meta` 属性上的任意静态数据
- `done` - 当前状态是否是终态 <Badge text="4.7.1" />

## State 实例的方法和属性

`State` 实例上有一些实用方法和属性，可以提升开发体验：

### `state.matches(parentStateValue)`

此方法确定当前 `state.value` 是否为给定 `parentStateValue` 的子集，换句话说，其是否匹配(matches)状态值。举个例子，假设当前 `state.value` 为 `{ red: 'stop' }`：

```js
console.log(state.value);
// => { red: 'stop' }

console.log(state.matches('red'));
// => true

console.log(state.matches('red.stop'));
// => true

console.log(state.matches({ red: 'stop' }));
// => true

console.log(state.matches('green'));
// => false
```

::: tip
如果想要确认是否匹配一组状态中的某一个，可以使用 [`.some()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)：

```js
const isMatch = [{ customer: 'deposit' }, { customer: 'withdrawal' }].some(
  state.matches
);
```

:::

### `state.nextEvents`

指定了将导致从当前状态过渡的下一个事件：

```js
const { initialState } = lightMachine;

console.log(initialState.nextEvents);
// => ['TIMER', 'EMERGENCY']
```

这对于确定可以采取哪些下一个事件并在 UI 中表示这些潜在事件（例如启用/禁用某些按钮）很有用。

### `state.changed`

指定此 `状态` 是否已从先前状态更改。 如果有以下情况，则状态被视为“已更改”：

- 当前值不等于前一个值，或者
- 有任何新的 actions（副作用）待执行

初始状态（没有历史）下会返回 `undefined`。

```js
const { initialState } = lightMachine;

console.log(initialState.changed);
// => undefined

const nextState = lightMachine.transition(initialState, 'TIMER');

console.log(nextState.changed);
// => true

const unchangedState = lightMachine.transition(nextState, 'UNKNOWN_EVENT');

console.log(unchangedState.changed);
// => false
```

### `state.done`

指定当前 `状态` 是否是 [“终态”](./final.md) - 即状态是否已经流转到最终情况且往后不再可以过渡到其他状态。

```js
const answeringMachine = Machine({
  initial: 'unanswered',
  states: {
    unanswered: {
      on: {
        ANSWER: 'answered'
      }
    },
    answered: {
      type: 'final'
    }
  }
});

const { initialState } = answeringMachine;
initialState.done; // false

const answeredState = answeringMachine.transition(initialState, 'ANSWER');
answeredState.done; // true
```

### `state.toStrings()`

该方法返回一个字符串数组来表示所有的状态值路径。假设当前 `state.value` 为 `{ red: 'stop' }`：

```js
console.log(state.value);
// => { red: 'stop' }

console.log(state.toStrings());
// => ['red', 'red.stop']
```

对于基于字符串的环境（如 CSS className 或 data-\* 属性）来说非常有用。

### `state.children`

将产生的 service/actor ID 映射到其实例的对象。查看 [📖 Referencing Services](./communication.md#referencing-services) 了解更多。

**举例：**

```js
const machine = Machine({
  // ...
  invoke: [
    { id: 'notifier', src: createNotifier },
    { id: 'logger', src: createLogger }
  ]
  // ...
});

const service = invoke(machine)
  .onTransition((state) => {
    state.children.notifier; // service from createNotifier()
    state.children.logger; // service from createLogger()
  })
  .start();
```

## 持久化状态

上文提到，`State` 对象可以被持久化为一个 JSON 字符串：

```js
const jsonState = JSON.stringify(currentState);

// Example: persisting to localStorage
try {
  localStorage.setItem('app-state', jsonState);
} catch (e) {
  // unable to save to localStorage
}
```

用 静态方法 `State.create(...)` 和 public 方法 `machine.resolveState(...)` 恢复 state：

```js
import { State, interpret } from 'xstate';
import { myMachine } from '../path/to/myMachine';

// Retrieving the state definition from localStorage
const stateDefinition = JSON.parse(localStorage.getItem('app-state'));

// Use State.create() to restore state from a plain object
const previousState = State.create(stateDefinition);

// Use machine.resolveState() to resolve the state definition to a new State instance relative to the machine
const resolvedState = myMachine.resolveState(previousState);
```

然后，可以将状态传递到 解释服务(interpreted service) 的.start（...）方法来从此解析状态解释该状态机：

```js
// ...

// This will start the service at the specified State
const service = interpret(myMachine).start(resolvedState);
```

这还将维护和还原以前的 [历史记录状态](./history.md)，并确保 `.events` 和 `.nextEvents` 可以取到正确的值。

## 状态元数据

元数据是描述任何 [状态节点](./statenodes.md) 相关属性的静态数据，可以在状态节点的 `.meta` 属性上指定

```js {17-19,22-24,30-32,35-37,40-42}
const fetchMachine = Machine({
  id: 'fetch',
  initial: 'idle',
  states: {
    idle: {
      on: { FETCH: 'loading' }
    },
    loading: {
      after: {
        3000: 'failure.timeout'
      },
      on: {
        RESOLVE: 'success',
        REJECT: 'failure',
        TIMEOUT: 'failure.timeout' // manual timeout
      },
      meta: {
        message: 'Loading...'
      }
    },
    success: {
      meta: {
        message: 'The request succeeded!'
      }
    },
    failure: {
      initial: 'rejection',
      states: {
        rejection: {
          meta: {
            message: 'The request failed.'
          }
        },
        timeout: {
          meta: {
            message: 'The request timed out.'
          }
        }
      },
      meta: {
        alert: 'Uh oh.'
      }
    }
  }
});
```

状态机会收集所有状态节点的 `.meta` 数据并根据状态值进行展示，并将其放置在满足下列条件的对象上：

- keys 是 [state node IDs](./ids.md)
- 这些值是状态节点 `.meta` 值

例如，如果上述状态机处于 `failure.timeout` 状态（由两个 ID 为 `“failure”` 和 `“failure.timeout”` 的状态节点表示），则 `.meta` 属性将组合所有 `.meta` 值，如下所示：

```js {4-11}
const failureTimeoutState = fetchMachine.transition('loading', 'TIMEOUT');

console.log(failureTimeoutState.meta);
// => {
//   failure: {
//     alert: 'Uh oh.'
//   },
//   'failure.timeout': {
//     message: 'The request timed out.'
//   }
// }
```

::: tip TIP：汇总元数据
要如何处理此元数据取决于开发者自己。 理想情况下，它应 _仅_ 包含 JSON 可序列化的值。 若希望以不同的方式合并/聚合元数据。 例如，此函数将丢弃状态节点 ID 密钥（如果它们不相关）并合并元数据

```js
function mergeMeta(meta) {
  return Object.keys(meta).reduce((acc, key) => {
    const value = meta[key];

    // Assuming each meta value is an object
    Object.assign(acc, value);

    return acc;
  }, {});
}

const failureTimeoutState = fetchMachine.transition('loading', 'TIMEOUT');

console.log(mergeMeta(failureTimeoutState.meta));
// => {
//   alert: 'Uh oh.',
//   message: 'The request timed out.'
// }
```

:::

## 注意点

- 尽量不手动创建 `State` 实例。 将 `State` 视为 _仅_ 来自 machine.transition（...）或 service.onTransition（...）的只读对象
- 为了防止内存泄漏，`state.history` 将不会保留其历史记录； 即 `state.history.history === undefined`。 否则，我们将创建一个巨大的链表并重塑区块链。
  - 该行为在未来的版本中可配置
