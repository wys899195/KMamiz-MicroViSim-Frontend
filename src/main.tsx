import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { CircularProgress } from "@mui/material";

const DependencyGraph = lazy(() => import("./pages/DependencyGraph"));
const Metrics = lazy(() => import("./pages/Metrics"));
const Insights = lazy(() => import("./pages/Insights"));
const Labels = lazy(() => import("./pages/Labels"));
const Interfaces = lazy(() => import("./pages/Interfaces"));
const Swagger = lazy(() => import("./pages/Swagger"));

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Header />
      <Suspense fallback={<CircularProgress />}>
        <Routes>
          <Route path="/" element={<DependencyGraph />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/labels" element={<Labels />} />
          <Route path="/interfaces" element={<Interfaces />} />
          <Route path="/swagger/:service" element={<Swagger />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
