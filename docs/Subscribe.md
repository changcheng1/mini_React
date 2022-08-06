<!--
 * @Author: changcheng
 * @LastEditTime: 2022-08-03 16:00:42
-->

```javaScript
// 经典发布订阅结构
const list = [['国家大事',['小王']],['美女',['小常','小谢']]]
class EventBus {
  constructor() {
    this.eventBus = new Map();
  }
  on(eventName, message) {
    if (!this.eventBus.has(eventName)) {
      this.eventBus.set(eventName, []);
    }
    this.eventBus.get(eventName).push(message);
  }
  emit(eventName) {
    if (!this.eventBus.has(eventName)) return;
    for (let i = 0; i < this.eventBus.get(eventName).length; i++) {
      console.log(`${this.eventBus.get(eventName)[i]}收到${eventName}`);
    }
  }
}
let newEvent = new EventBus();
newEvent.on("国家大事", "小王");
newEvent.on("美女", "小常");
newEvent.on("美女", "小谢");
newEvent.emit("国家大事");
newEvent.emit("美女");
```

## componentWillReceiveProps 和 getDerivedStateFromProps 的区别

componentWillReceiveProps(nextProps) 首次加载不会触发，父组件导致子组件更新时，即便 props 没变化，也会执行。

getDerivedStateFromProps(nextProps, prevState) **首次加载**，**父组件更新**，**props**，**setState**，**forceUpdate** 都会触发，将父级传入的 props 映射到 state 上，新生命周期当中用来替代 componentWillReceiveProps,如果不改变，需要 return null

---

requestAnimationFrame 用来替代 setTimeout，按帧执行，可以根据刷新率决定执行时间，隐藏不可见状态，不进行重绘和回流,减少 cpu 和 gpu 用量，高优先级

```javaScript
    <div style="background: blue; width: 0; height: 40px"></div>
    <button>开始</button>

    var div = document.querySelector("div");
    var button = document.querySelector("button");
    let startTime;
    function progress() {
      div.style.width = div.offsetWidth + 1 + "px";
      if (div.offsetWidth < 100) {
        console.log(Date.now() - startTime); // 16ms左右，较稳定 1000ms/60hz
        startTime = Date.now();
        requestAnimationFrame(progress);
        // 浏览器刷新间隔会执行requestAnimationFrame，根据系统的刷新频率决定，
        // 节省系统资源，改变视觉效果，用来替代setTimeout,属于高优先级任务
      }
    }
    button.onclick = () => {
      startTime = Date.now();
      requestAnimationFrame(progress);
    };
```

---
