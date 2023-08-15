export const NoFlags = 0b0000;
//只有有此flag才会执行effect
export const HasEffect = 0b0001;//1
//useLayoutEffect  积极的，会在UI绘制前之前，类似于微任务
export const Layout = 0b0100;//4
//useEffect 消极的，会在UI绘制后执行，类似于宏任务
export const Passive = 0b1000;//8