import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { HomeProvider } from "./context";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <HomeProvider>
        <App />
      </HomeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
