import React from "react";
import ReactDOM from "react-dom";
import { Application } from "./modules/application/application";

const root = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
  root
);
