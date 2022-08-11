/*
 * @Author: changcheng
 * @LastEditTime: 2022-08-11 11:37:16
 */
import React, { memo, useState, useEffect, Component } from "../packages/react";

export function MemorizedComponentDemo() {
  const [number, dispatch] = useState(1);
  return <div>{number}</div>;
}
