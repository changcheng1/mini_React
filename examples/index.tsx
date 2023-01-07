/*
 * @Author: changcheng
 * @LastEditTime: 2023-01-07 16:36:44
 */
import React from "../packages/react";
import { createRoot,render } from "../packages/react-dom";
import { MemorizedComponentDemo } from "./MemorizedComponent";
// createRoot(document.querySelector("#app")!).render(<MemorizedComponentDemo />);
// const singleDom = <div>渲染内容</div>
 render(<MemorizedComponentDemo />, document.querySelector("#app")!);

