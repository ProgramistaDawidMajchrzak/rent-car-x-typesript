import React from "react";
import { AppRouter } from "./router";
import PagesRedirectBridge from "./PagesRedirectBridge";
import "../App.css";

function App() {
  return (
    <>
      <PagesRedirectBridge />
      <AppRouter />
    </>
  );
}

export default App;
