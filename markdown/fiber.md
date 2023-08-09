<!--
 * @Author: changcheng
 * @LastEditTime: 2023-08-02 22:03:30
-->

## Fiber

为什么使用 Fiber?

### 1.性能瓶颈

JS 任务执行时间过长

浏览器刷新频率为 60Hz,大概 16.6 毫秒渲染一次，而 JS 线程和渲染线程是互斥的，所以如果 JS 线程执行任务时间超过 16.6ms 的话，就会导致掉帧，导致卡顿，解决方案就是 React 利用空闲的时间进行更新，不影响渲染进行的渲染

把一个耗时任务切分成一个个小任务，分布在每一帧里的方式就叫时间切片

目前大多数设备的屏幕刷新率为 60 次/秒

### 2.屏幕刷新率

浏览器渲染动画或页面的每一帧的速率也需要跟设备屏幕的刷新率保持一致

页面是一帧一帧绘制出来的，当每秒绘制的帧数（FPS）达到 60 时，页面是流畅的,小于这个值时，用户会感觉到卡顿

每个帧的预算时间是 16.66 毫秒 (1 秒/60)

1s 60 帧，所以每一帧分到的时间是 1000/60 ≈ 16 ms。所以我们书写代码时力求不让一帧的工作量超过 16ms

### 3.帧

每个帧的开头包括样式计算、布局和绘制

JavaScript 执行 Javascript 引擎和页面渲染引擎在同一个渲染线程,GUI 渲染和 Javascript 执行两者是互斥的

如果某个任务执行时间过长，浏览器会推迟渲染

<img src="../img/lifeofframe.jpeg">

### 模拟时间切片

requestIdleCallback,React 中没有使用`requestIdleCallback`，因为该方法有浏览器兼容性问题，而且时间不可控

```javaScript
      // 模拟程序的用时
       function sleep(d) {
        for (var t = Date.now(); Date.now() - t <= d; );
      }
      const works = [
        () => {
          console.log("第1个任务开始");
          sleep(20); //sleep(20);
          console.log("第1个任务结束");
        },
        () => {
          console.log("第2个任务开始");
          sleep(20); //sleep(20);
          console.log("第2个任务结束");
        },
        () => {
          console.log("第3个任务开始");
          sleep(20); //sleep(20);
          console.log("第3个任务结束");
        },
      ];

      requestIdleCallback(workLoop);

      function workLoop(deadline) {
        // 因为一帧是16.6ms，浏览器执行完高优先级之后，如果还有时间，会执行workLoop，timeRemaining获取此帧剩余的时间
        console.log("本帧剩余时间", parseInt(deadline.timeRemaining()));
        // 合作式调度
        while (deadline.timeRemaining() > 1 && works.length > 0) {
          performUnitOfWork();
        }
        // 如果还有剩余任务
        if (works.length > 0) {
          console.log(`只剩下${parseInt(deadline.timeRemaining())}ms,时间片到了等待下次空闲时间的调度`);
          requestIdleCallback(workLoop);
        }
      }

      function performUnitOfWork() {
        works.shift()();
      }
```

### Fiber

我们可以通过某些调度策略合理分配 CPU 资源，从而提高用户的响应速度

通过 Fiber 架构，让自己的调和过程变成可被中断。 适时地让出 CPU 执行权，除了可以让浏览器及时地响应用户的交互

Fiber 是一个执行单元,每次执行完一个执行单元, React 就会检查现在还剩多少时间，如果没有时间就将控制权让出去

<img src="../img/fiberFlow.png">

### Fiber 是一种数据结构

React 目前的做法是使用链表, 每个虚拟节点内部表示为一个 Fiber

从顶点开始遍历

如果有第一个儿子，先遍历第一个儿子

如果没有第一个儿子，标志着此节点遍历完成

如果有弟弟遍历弟弟

如果有没有下一个弟弟，返回父节点标识完成父节点遍历，如果有叔叔遍历叔叔

没有父节点遍历结束

### Fiber 树

```javaScript
   /**
 *
 * @param {*} tag fiber的类型 函数组件0  类组件1 原生组件5 根元素3
 * @param {*} pendingProps 新属性，等待处理或者说生效的属性
 * @param {*} key 唯一标识
 */
export function FiberNode(tag, pendingProps, key) {
  this.tag = tag;
  this.key = key;
  this.type = null; //fiber类型，来自于 虚拟DOM节点的type  span div p
  //每个虚拟DOM=>Fiber节点=>真实DOM
  this.stateNode = null; //此fiber对应的真实DOM节点  h1=>真实的h1DOM

  this.return = null; //指向父节点
  this.child = null; //指向第一个子节点
  this.sibling = null; //指向弟弟

  //fiber哪来的？通过虚拟DOM节点创建，虚拟DOM会提供pendingProps用来创建fiber节点的属性
  this.pendingProps = pendingProps; //等待生效的属性
  this.memoizedProps = null; //已经生效的属性

  //每个fiber还会有自己的状态，每一种fiber 状态存的类型是不一样的
  //类组件对应的fiber 存的就是类的实例的状态,HostRoot存的就是要渲染的元素
  this.memoizedState = null;
  //每个fiber身上可能还有更新队列
  this.updateQueue = null;
  //副作用的标识，表示要针对此fiber节点进行何种操作
  this.flags = NoFlags; //自己的副作用
  //子节点对应的副使用标识
  this.subtreeFlags = NoFlags;
  //替身，轮替 在后面讲DOM-DIFF的时候会用到
  this.alternate = null;
  this.index = 0;
  this.deletions = null;
  this.lanes = NoLanes;
  this.childLanes = NoLanes;
  this.ref = null;
}
```

<img src="../img/renderFiber1.jpeg">

### 递归创建 Fiber 树

<img src="../img/di_gui_gou_jian_fiber_shu.jpeg">

### Fiber 双缓存树

1.react 根据双缓冲机制维护了两个 fiber 树，因为更新时依赖于老状态的

`current Fiber树`：用于渲染页面

`workinProgress Fiber树`：用于在内存构建中，方便在构建完成后直接替换 current Fiber 树

2.Fiber 双缓存

`首次渲染时`：
render 阶段会根据 jsx 对象生成新的 Fiber 节点，然后这些 Fiber 节点会被标记成带有‘Placement’的副作用，说明他们是新增节点，需要被插入到真实节点中，在 commitWork 阶段就会操作成真实节点，将它们插入到 dom 树中。

`页面触发更新时`:
render 阶段会根据最新的 jsx 生成的虚拟 dom 和 current Fiber 树进行对比，比较之后生成 workinProgress Fiber(workinProgress Fiber 树的 alternate 指向 Current Fiber 树的对应节点，这些 Fiber 会带有各种副作用，比如‘Deletion’、‘Update’、'Placement’等)这一对比过程就是 diff 算法

当 workinProgress Fiber 树构建完成，workInprogress 则成为了 curent Fiber 渲染到页面上

diff ⽐较的是什么？ ⽐较的是 current fiber 和 vdom，⽐较之后⽣成 workInprogress Fiber

![avatar](../img/renderRootFiber.jpg)
