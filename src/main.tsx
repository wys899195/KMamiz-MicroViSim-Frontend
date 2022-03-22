import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import DependencyGraph from "./pages/DependencyGraph";
import Metrics from "./pages/Metrics";
import Swagger from "./pages/Swagger";
import Insights from "./pages/Insights";
import Labels from "./pages/Labels";
import Interfaces from "./pages/Interfaces";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<DependencyGraph />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/labels" element={<Labels />} />
        <Route path="/interfaces" element={<Interfaces />} />
        <Route path="/swagger/:service" element={<Swagger />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
