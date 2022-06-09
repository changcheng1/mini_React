<!--
 * @Author: changcheng
 * @LastEditTime: 2022-06-09 10:18:07
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
