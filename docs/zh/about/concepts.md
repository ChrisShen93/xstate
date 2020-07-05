# 概念

XState 是一个可以创建、解释、执行有限状态机和状态图，并以 `actors` 的形式管理、调用这些状态机的 js 库。下面有一些基本概念，掌握他们可以帮助你更好地使用 XState。

## 有限状态机

有限状态机是一种数学计算模型，用于描述系统的行为，该系统在任意给定时刻只能处于一种状态。举个例子，用状态机来描述人的行为，可以有两种状态：`睡着` 或 `清醒`。在任意时刻，一个人要么是 `睡着` 的状态，要么是 `清醒` 的状态，不可能同时处于这两种状态，也不可能同时都不处于这两种状态。

一般来说，有限状态机由以下五个部分组成：

- 有限数量的 **状态(states)**
- 有限数量的 **事件(events)**
- 一个 **初始状态(initial state)**
- 一个根据当前状态和事件来决定下一个状态的 **过渡函数(transition function)**
- 一个或零个 **最终态(final state)**

在状态机中，**state** 可以认为是系统当前所处的“状态”，一般不代表系统中的所有数据（这些数据往往是无限多的）。举个例子，水可以有 `固体` `液体` `气体` `等离子体` 四种状态，然而水的温度却是不可定量、无限多的。

参考链接：

- [Finite-state machine](https://en.wikipedia.org/wiki/Finite-state_machine) article on Wikipedia
- [Understanding State Machines](https://www.freecodecamp.org/news/state-machines-basics-of-computer-science-d42855debc66/) by Mark Shead
- [▶️ A-Level Comp Sci: Finite State Machine](https://www.youtube.com/watch?v=4rNYAvsSkwk)

## 状态图

状态图可以用来描述有状态的响应式系统(stateful reactive system)。计算机科学家 David Harel 在 1987 年发表的[论文](https://www.sciencedirect.com/science/article/pii/0167642387900359/pdf)中提出了这一模型。XState 对它进行了一些扩展：

- 条件过渡
- 动作（进入、离开、过渡）
- 上下文
- 并发状态
- 嵌套状态
- 历史

参考链接：

- [Statecharts: A Visual Formalism for Complex Systems](https://www.sciencedirect.com/science/article/pii/0167642387900359/pdf) by David Harel
- [The World of Statecharts](https://statecharts.github.io/) by Erik Mogensen

## Actor 模型

Actor 模型是计算机科学领域中的一个并行计算模型。一个 actor 可以做三件事：

- **接收** 消息
- **发送** 消息给其他 actors
- 响应自己接受到的消息(**行为**)，如：
  - 改变自身状态
  - 给其他 actors 发送消息
  - **孵化(spawn)** 新的 actors

Actor 的行为可以用状态机(或状态图)来描述。

参考链接：

- [Actor model](https://en.wikipedia.org/wiki/Actor_model) article on Wikipedia
- [The actor model in 10 minutes](https://www.brianstorti.com/the-actor-model/) by Brian Storti
