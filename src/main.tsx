/*import React from "react";
import ReactDOM from "react-dom/client";
import { Application } from "./modules/application/application";
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Application />);   */
import React from "react";
import ReactDOM from "react-dom";
import { Application } from "./modules/application/application";

const root = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
  root,
);
