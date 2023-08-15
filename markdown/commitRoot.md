<!--
 * @Author: changcheng
 * @LastEditTime: 2023-08-15 18:17:32
-->

### commitRoot

getHostSibling：找到可以插在它的前面的那个 fiber 对应的真实 DOM

```javaScript
/**
 * 找到要插入的锚点
 * 找到可以插在它的前面的那个fiber对应的真实DOM
 * @param {*} fiber
 */
function getHostSibling(fiber) {
  let node = fiber;
  // 标签循环
  siblings: while (true) {
    // 先看有没有弟弟
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null;
      }
      // 没有弟弟就找父亲
      node = node.return;
    }
    // 找兄弟节点
    node = node.sibling;
    //如果兄弟节点不是原生节点也不是文本节点
    while (node.tag !== HostComponent && node.tag !== HostText) {
      // 如果是新增节点，找它的兄弟节点
      if (node.flags & Placement) {
        // 进行最外层的循环
        continue siblings;
      } else {
        node = node.child;
      }
    }
    if (!(node.flags & Placement)) {
      return node.stateNode;
    }
  }
}
```
