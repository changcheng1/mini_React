/*
 * @Author: changcheng
 * @LastEditTime: 2022-08-06 21:11:19
 */
import { CSSProperties } from "react";
import React, { memo, useState, useEffect } from "../packages/react";

type Color = "#fff" | "green";
type Component =
  | "NestedComponent"
  | "NormalComponent"
  | "MemorizedComponentWithUnstableProps"
  | "MemorizedNestedComponent"
  | "MemorizedComponentWithCustomCompareFunc"
  | "MemorizedComponent";

const prevColors: Record<Component, Color> = {
  NestedComponent: "green",
  NormalComponent: "green",
  MemorizedComponentWithUnstableProps: "green",
  MemorizedNestedComponent: "green",
  MemorizedComponentWithCustomCompareFunc: "green",
  MemorizedComponent: "green",
};

const useCurrentOutlineStyle = (componentName: Component): CSSProperties => {
  const currColor = prevColors[componentName] === "#fff" ? "green" : "#fff";
  prevColors[componentName] = currColor;
  return {
    outline: `1px solid ${currColor}`,
  };
};

const NormalComponent = () => {
  return (
    <div>
      NormalComponent
      <NestedComponent />
      <MemorizedNestedComponent />
    </div>
  );
};

const NestedComponent = () => {
  const outlineStyle = useCurrentOutlineStyle("NestedComponent");
  return <div style={outlineStyle}>-- NestedComponent</div>;
};

const MemorizedNestedComponent = memo(() => {
  const outlineStyle = useCurrentOutlineStyle("MemorizedNestedComponent");

  return <div style={outlineStyle}>-- MemorizedNestedComponent</div>;
});

const MemorizedComponent = memo(() => {
  const outlineStyle = useCurrentOutlineStyle("MemorizedComponent");

  return <div style={outlineStyle}>MemorizedComponent</div>;
});

const MemorizedComponentWithUnstableProps = memo<{ count: number }>(
  ({ count }) => {
    const outlineStyle = useCurrentOutlineStyle(
      "MemorizedComponentWithUnstableProps"
    );

    return (
      <div style={outlineStyle}>
        MemorizedComponentWithUnstableProps {count}
      </div>
    );
  }
);

const MemorizedComponentWithCustomCompareFunc = memo<{ text: string }>(
  ({ text }) => {
    const outlineStyle = useCurrentOutlineStyle(
      "MemorizedComponentWithCustomCompareFunc"
    );

    return <div style={outlineStyle}>最大字符长度-8 {text}</div>;
  },
  (oldProps, newProps) => newProps.text.length > 8
);
export const MemorizedComponentDemo = () => {
  let [count, setCount] = useState(0);
  useEffect(() => {}, []);
  return (
    <div>
      <button
        onClick={() => {
          setCount((count += 1));
          console.log("count", count);
        }}
      >
        点击
      </button>
      <p>{count}</p>
    </div>
  );
};
