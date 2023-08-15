import * as React from "react";
import { createRoot } from "react-dom/client";

function FunctionComponent() {
  let [numbers, setNumbers] = React.useState(2);
  return (
    <div
      onClick={() => {
        setNumbers((numbers += 1));
      }}
    >
      {numbers}
    </div>
  );
}
let element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
root.render(element);
