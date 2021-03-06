import React from "react";
import ReactDOM from "react-dom";
import "./styles/global.scss";
import "./styles/form.style.scss";
import "./styles/button.style.scss";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={<p>Loading...</p>}>
      <App />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("app-mount"),
);
