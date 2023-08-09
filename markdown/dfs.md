<!--
 * @Author: changcheng
 * @LastEditTime: 2023-08-02 14:11:22
-->

### Fiber 采用深度优先遍历（先进后出）

深度优先搜索英文缩写为 DFS 即 Depth First Search

其过程简要来说是对每一个可能的分支路径深入到不能再深入为止，而且每个节点只能访问一次
应用场景

React 虚拟 DOM 的构建

React 的 fiber 树构建

优点：内存占用少，缺点：深度情况很深的情况效率不高

```javaScript
let root = {
  name: "A",
  children: [
    {
      name: "B",
      children: [{ name: "B1" }, { name: "B2" }],
    },
    {
      name: "C",
      children: [{ name: "C1" }, { name: "C2" }],
    },
  ],
};
function dfs(node) {
  console.log(node.name);
   node.children?.forEach(dfs);
}
dfs(root);
```

### 广度优先(BFS)（先进先出）

度优先搜索算法（又称广度优先搜索），其英文全称是 Breadth First Search

算法首先搜索距离为 k 的所有顶点，然后再去搜索距离为 k+l 的其他顶点

优点：寻找深度小，缺点就是内存占用大

```javaScript
let root = {
  name: "A",
  children: [
    {
      name: "B",
      children: [{ name: "B1" }, { name: "B2" }],
    },
    {
      name: "C",
      children: [{ name: "C1" }, { name: "C2" }],
    },
  ],
};
function bfs(node) {
  const stack = [];
  stack.push(node);
  let current;
  while ((current = stack.shift())) {
    console.log(current.name);
    current.children?.forEach(child => {
      stack.push(child);
    });
  }
}
bfs(root)
```
