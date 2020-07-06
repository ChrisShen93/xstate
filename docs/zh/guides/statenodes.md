# 状态节点

状态机包含状态节点，这些状态节点共同描述了状态机可以处于的 [整体状态](./states.md)。在下文描述的`fetchMachine`中，有 **状态节点**，例如：

```js
// ...
{
  states: {
    // state node
    idle: {
      on: {
        FETCH: 'pending';
      }
    }
  }
}
```

其整体状态，即 `machine.transition()` 的返回值或 `service.onTransition` 的回调值

```js
const nextState = fetchMachine.transition('pending', 'FULFILL');
// State {
//   value: { success: 'items' },
//   actions: [],
//   context: undefined,
//   ...
// }
```

## 状态节点

在 XState 中，**状态节点** 指定状态配置。它们在状态机的状态属性中定义。同样，子状态节点是在状态节点的状态属性上分层定义的。

`machine.transition(state, event)` 产生出的状态即状态节点的集合。如下的状态机中有一个 `success` 状态节点 和 一个 `items` 子状态节点，状态值 `{ success: 'items' }` 代表了这些状态节点。

```js
const fetchMachine = Machine({
  id: 'fetch',

  // Initial state
  initial: 'idle',

  // States
  states: {
    idle: {
      on: {
        FETCH: 'pending'
      }
    },
    pending: {
      on: {
        FULFILL: 'success',
        REJECT: 'failure'
      }
    },
    success: {
      // Initial child state
      initial: 'items',

      // Child states
      states: {
        items: {
          on: {
            'ITEM.CLICK': 'item'
          }
        },
        item: {
          on: {
            BACK: 'items'
          }
        }
      }
    },
    failure: {
      on: {
        RETRY: 'pending'
      }
    }
  }
});
```

<iframe src="https://xstate.js.org/viz/?gist=932f6d193fa9d51afe31b236acf291c9&embed=1"></iframe>

## 状态节点的类型

共有五种状态节点：

- **atomic** 类型没有子节点，即为叶子节点
- **compound** 类型有一个或多个子 `states`，且有一个 `initial` 状态
- **parallel** 类型有两个或多个子 `states`，且没有 `initial` 状态
- **final** 类型为特殊的叶子节点，表示一个抽象的终止状态
- **history** 类型是代表了其父节点最近的一次浅拷贝/深拷贝的历史状态的抽象节点

节点类型可以被显式地定义在 `state` 上：

```js
const machine = Machine({
  id: 'fetch',
  initial: 'idle',
  states: {
    idle: {
      type: 'atomic',
      on: {
        FETCH: 'pending'
      }
    },
    pending: {
      type: 'parallel',
      states: {
        resource1: {
          type: 'compound',
          initial: 'pending',
          states: {
            pending: {
              on: {
                'FULFILL.resource1': 'success'
              }
            },
            success: {
              type: 'final'
            }
          }
        },
        resource2: {
          type: 'compound',
          initial: 'pending',
          states: {
            pending: {
              on: {
                'FULFILL.resource2': 'success'
              }
            },
            success: {
              type: 'final'
            }
          }
        }
      },
      onDone: 'success'
    },
    success: {
      type: 'compound',
      initial: 'items',
      states: {
        items: {
          on: {
            'ITEM.CLICK': 'item'
          }
        },
        item: {
          on: {
            BACK: 'items'
          }
        },
        hist: {
          type: 'history',
          history: 'shallow'
        }
      }
    }
  }
});
```

<iframe src="https://xstate.js.org/viz/?gist=75cc77b35e98744e8d10902147feb313&embed=1"></iframe>

对于 parallel、history、final 类型来说，显式地声明 `type` 对 ts 的类型检查有帮助。

## 瞬态节点

瞬态节点是一个“临时”状态节点，它立即过渡为另一个状态节点。 也就是说，状态机在任何时刻都不会停留在瞬态。 根据不同的条件，瞬态节点可以明确应该过渡到哪一个目标状态。 它们与 UML 中的[伪态选择](https://www.uml-diagrams.org/state-machine-diagrams.html#choice-pseudostate)相似。

瞬态节点有且应该仅有一个空事件[null event](./events.md#null-events)，当进入瞬态，该事件就会立刻被触发：

```js
const timeOfDayMachine = Machine({
  id: 'timeOfDay',
  initial: 'unknown',
  context: {
    time: undefined
  },
  states: {
    // Transient state
    unknown: {
      on: {
        '': [
          { target: 'morning', cond: 'isBeforeNoon' },
          { target: 'afternoon', cond: 'isBeforeSix' },
          { target: 'evening' }
        ]
      }
    },
    morning: {},
    afternoon: {},
    evening: {}
  }
}, {
  guards: {
    isBeforeNoon: // ...
    isBeforeSix: // ...
  }
});

const timeOfDayService = interpret(timeOfDayMachine
  .withContext({ time: Date.now() }))
  .onTransition(state => console.log(state.value))
  .start();

// => 'morning' (assuming the time is before noon)
```

<iframe src="https://xstate.js.org/viz/?gist=ca6a3f84f585c3e9cd6aadc3ae00b886&embed=1"></iframe>

## 状态节点的元数据

元数据是描述任何状态节点[state node](./statenodes.md)中相关属性的静态数据，可以在 `.meta` 属性上声明：

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

查看 [state meta data](./state.md#状态元数据) 查看更多信息。
