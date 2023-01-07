/*
 * @Author: changcheng
 * @LastEditTime: 2023-01-04 22:57:10
 */
import React from "../packages/react";
import { createRoot,render } from "../packages/react-dom";
import { MemorizedComponentDemo } from "./MemorizedComponent";
// createRoot(document.querySelector("#app")!).render(<MemorizedComponentDemo />);
const singleDom = <div>渲染内容</div>
render(singleDom, document.querySelector("#app")!);

