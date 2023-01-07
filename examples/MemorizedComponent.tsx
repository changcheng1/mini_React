/*
 * @Author: changcheng
 * @LastEditTime: 2022-10-17 14:19:18
 */
import React, { memo, useState, useEffect, Component } from "../packages/react";

export function MemorizedComponentDemo() {
  const [number,setNumber] = useState('初始状态')
  return  <p onClick={()=>{
    setNumber('更新一次')
    setNumber('更新二次')
    setNumber('更新三次')
  }}>{number}</p>
}
