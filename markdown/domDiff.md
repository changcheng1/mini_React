### DomDiff

DomDiff 的过程其实就是老的 Fiber 树 和 新的 jsx 对比生成新的 Fiber 树 的过程，分为单节点和多节点两种分别对应**reconcileSingleElement**和**reconcileChildrenArray**

**只对同级元素进行比较**

**不同的类型对应不同的元素**

**可以通过 key 来标识同一个节点**

### 单节点

+ 新旧节点 type 和 key 都不一样，标记为删除

+ 如果对比后发现新老节点一样的，那么会复用老节点，复用老节点的 DOM 元素和 Fiber 对象
再看属性有无变更 ，如果有变化，则会把此 Fiber 节点标准为更新

+ 如果 key 相同，但是 type 不同，则不再进行后续对比了，
直接把老的节点全部删除

![avatar](./img/singleDomDiff.jpg)

```javaScript

  function reconcileSingleElement(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    element: ReactElement
  ): Fiber {
    const key = element.key;
    let child = currentFirstChild;
    // 首先判断是否存在对应DOM节点
    while (child !== null) {
      // 上一次更新存在DOM节点，接下来判断是否可复用
      // 首先比较key是否相同
      if (child.key === key) {
        // key相同，接下来比较type是否相同
        switch (child.tag) {
          // ...省略case
          default: {
            if (child.elementType === element.type) {
              // type相同则表示可以复用
              // 删除剩下的兄弟节点
               deleteRemainingChildren(returnFiber, child.sibling)
               // 复用fiber，更新props
               const existing = useFiber(child, element.props)
               existing.return = returnFiber
               return existing
            }
            //key相同但是type变了，直接停止遍历，把后面的节点都删了
            deleteRemainingChildren(returnFiber, child)
            break
          }
        }
        // 代码执行到这里代表：key相同但是type不同
        // 将该fiber及其兄弟fiber标记为删除
        deleteRemainingChildren(returnFiber, child);
        break;
      } else {
        // key不同，将该fiber标记为删除
        deleteChild(returnFiber, child);
      }
      child = child.sibling;
    }
    //一个都不能复用，直接重新创建一个，根据jsx创建fiber节点
    const created = createFiberFromElement(element, returnFiber.mode, lanes)
    // 建立与父级的关系
    created.return = returnFiber
    return created
  }

```

### 多节点

DOM DIFF 的三个规则

+ 只对同级元素进行比较，不同层级不对比
+ 不同的类型对应不同的元素
+ 可以通过 key 来标识同一个节点

第 1 轮遍历

+ 如果 key 不同则直接结束本轮循环
+ newChildren 或 oldFiber 遍历完，结束本轮循环
+ key 相同而 type 不同，标记老的 oldFiber 为删除，继续循环
+ key 相同而 type 也相同，则可以复用老节 oldFiber 节点，继续循环

第 2 轮遍历

+ newChildren 遍历完而 oldFiber 还有，遍历剩下所有的 oldFiber 标记为删除，DIFF 结束
+ oldFiber 遍历完了，而 newChildren 还有，将剩下的 newChildren 标记为插入，DIFF 结束
+ newChildren 和 oldFiber 都同时遍历完成，diff 结束
+ newChildren 和 oldFiber 都没有完成，则进行节点移动的逻辑

第 3 轮遍历

+ 处理节点移动的情况

```javaScript

  // 之前
  abcd
  // 之后
  acdb

  ===第一轮遍历开始===
  a（之后）vs a（之前）
  key不变，可复用
  此时 a 对应的oldFiber（之前的a）在之前的数组（abcd）中索引为0
  所以 lastPlacedIndex = 0;

  继续第一轮遍历...

  c（之后）vs b（之前）
  key改变，不能复用，跳出第一轮遍历
  此时 lastPlacedIndex === 0;
  ===第一轮遍历结束===

  ===第二轮遍历开始===
  newChildren === cdb，没用完，不需要执行删除旧节点
  oldFiber === bcd，没用完，不需要执行插入新节点

  将剩余oldFiber（bcd）保存为map

  // 当前oldFiber：bcd
  // 当前newChildren：cdb

  继续遍历剩余newChildren

  key === c 在 oldFiber中存在
  const oldIndex = c（之前）.index;
  此时 oldIndex === 2;  // 之前节点为 abcd，所以c.index === 2
  比较 oldIndex 与 lastPlacedIndex;

  如果 oldIndex >= lastPlacedIndex 代表该可复用节点不需要移动
  并将 lastPlacedIndex = oldIndex;
  如果 oldIndex < lastplacedIndex 该可复用节点之前插入的位置索引小于这次更新需要插入的位置索引，代表该节点需要向右移动

  在例子中，oldIndex 2 > lastPlacedIndex 0，
  则 lastPlacedIndex = 2;
  c节点位置不变

  继续遍历剩余newChildren

  // 当前oldFiber：bd
  // 当前newChildren：db

  key === d 在 oldFiber中存在
  const oldIndex = d（之前）.index;
  oldIndex 3 > lastPlacedIndex 2 // 之前节点为 abcd，所以d.index === 3
  则 lastPlacedIndex = 3;
  d节点位置不变

  继续遍历剩余newChildren

  // 当前oldFiber：b
  // 当前newChildren：b

  key === b 在 oldFiber中存在
  const oldIndex = b（之前）.index;
  oldIndex 1 < lastPlacedIndex 3 // 之前节点为 abcd，所以b.index === 1
  则 b节点需要向右移动
  ===第二轮遍历结束===

  最终acd 3个节点都没有移动，b节点被标记为移动

```

![avatar](./img/domDiff_move.jpg)

```javaScript

      function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
        //将要返回的第一个新fiber，也就是workInProgress
        let resultingFirstChild = null;
        //上一个新fiber
        let previousNewFiber = null;
        //当前的老fiber
        let oldFiber = currentFirstChild;
        //下一个老fiber
        let nextOldFiber = null;
        //新的虚拟DOM的索引
        let newIdx = 0;
        // 新的Fiber节点在老的Fiber节点中的索引位置，用来处理Fiber节点位置的变化，也就是oldFiber index
        let lastPlacedIndex = 0;
        //处理更新的情况 老fiber和新fiber都存在
        for (; oldFiber && newIdx < newChildren.length; newIdx++) {
            //先缓存下一个老fiber
            nextOldFiber = oldFiber.sibling;
            //  判断该对应位置的fiber是否可以复用
            //  只有type相同且key也相同的情况下才会复用
            //  diff函数会根据该函数的返回值进行相关的操作
            //  如果key不相同直接返回null代表可能节点的位置发生了变更，
            //  简单的循环是行不通的所以待会会进入updateFromMap逻辑，
            //  如果是key相同但是type变了就选择不复用，而是选择重新创建一个元素返回
            //  就会将以前同key的元素标记为删除
            const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx]);
            //如果key 不一样，直接跳出第一轮循环
            if (!newFiber)
                break;
            //老fiber存在，但是新节点没有alternate，说明是新创建的节点，将老Fiber标记为删除，继续遍历
            if (oldFiber && !newFiber.alternate) {
                deleteChild(returnFiber, oldFiber);
            }
              //  如果是首次mount则 lastPlacedIndex没有意义，该值主要用来判断该节点在这次更新后
              //  是不是原来在他后面的节点，现在跑到他前面了如果是他就是需要重新插入dom树的
              //  那么怎么判断他后面的节点是不是跑到他前面了呢，考虑以下情况
              //  更新前: 1 -> 2 -> 3 -> 4
              //  更新后: 1 -> 3 -> 2 -> 4
              //  在处理该次更新时，当遍历到2时，此时lastPlacedIndex为2，而2的oldIndex为1
              //  所以可以判断到newFiber.oldIndex<lastPlacedIndex，老的Fiber对应的真实dom需要移动了
              //  但是现在跑到他前面了，所以newFiber也就是2是需要重新插入dom树的
              //  在commit阶段时，对2相应的dom进行重新插入时，
              //  会寻找他后面第一个不需要进行插入操作的dom元素作为insertBefore
              //  的第二个参数，所以2对应的dom会被插入到4前面

            lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
            if (previousNewFiber === null) {
                resultingFirstChild = newFiber;
            } else {
                previousNewFiber.sibling = newFiber;
            }
            previousNewFiber = newFiber;
            oldFiber = nextOldFiber;
        }
        // 老Fiber和新Fiber同时遍历完成，删除剩下的oldFiber就行
        if (newIdx === newChildren.length) {
            deleteRemainingChildren(returnFiber, oldFiber);
            return resultingFirstChild;
        }
        //如果老Fiber是遍历完的，但是新的Fiber还没遍历完，第一次挂载其实也是在这里的逻辑，因为没有oldFiber
        if (oldFiber === null) {
            //循环虚拟DOM数组， 为每个虚拟DOM创建一个新的fiber
            for (; newIdx < newChildren.length; newIdx++) {
                const newFiber = createChild(returnFiber, newChildren[newIdx]);
                lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
                if (!previousNewFiber) {
                    resultingFirstChild = newFiber;
                } else {
                    previousNewFiber.sibling = newFiber;
                }
                previousNewFiber = newFiber;
            }
            return resultingFirstChild;
        }
        //将剩下的老fiber放入map中 {key:key,value:Fiber}
        const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
        for (; newIdx < newChildren.length; newIdx++) {
            //去map中找找有没key相同并且类型相同可以复用的老fiber 老真实DOM
            const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx]);
            if (newFiber !== null) {
                //说明是复用的老fiber
                if (newFiber.alternate) {
                    existingChildren.delete(newFiber.key || newIdx);
                }
                lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
                if (previousNewFiber === null) {
                    resultingFirstChild = newFiber;
                } else {
                    previousNewFiber.sibling = newFiber;
                }
                previousNewFiber = newFiber;
            }
        }
        //map中剩下是没有被 复用的，全部删除
        existingChildren.forEach(child => deleteChild(returnFiber, child));
        return resultingFirstChild;
    }

```
