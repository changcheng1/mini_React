/*
 * @Author: changcheng
 * @LastEditTime: 2022-09-25 19:46:21
 */
import React from "../packages/react";
import { createRoot } from "../packages/react-dom";
import { MemorizedComponentDemo } from "./MemorizedComponent";
 createRoot(document.querySelector("#app")!).render(<MemorizedComponentDemo />);
