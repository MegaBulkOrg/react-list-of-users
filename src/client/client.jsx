import * as React from "react";
import { hydrateRoot } from "react-dom/client";
import { ClientApp } from "../App";

window.addEventListener("load", () => {
  hydrateRoot(document.getElementById("react_root"), <ClientApp />);
});
