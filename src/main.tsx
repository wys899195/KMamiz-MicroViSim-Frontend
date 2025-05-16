import Config from "../Config";
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Loading from "./components/Loading";

const DependencyGraph = lazy(() => import("./pages/DependencyGraph"));
const Metrics = lazy(() => import("./pages/Metrics"));
const Insights = lazy(() => import("./pages/Insights"));
const Endpoints = lazy(() => import("./pages/Endpoints"));
const Interfaces = lazy(() => import("./pages/Interfaces"));
const Swagger = lazy(() => import("./pages/Swagger"));
const Difference = lazy(() => import("./pages/Diff"));

const SimulateDependencyGraph = lazy(() => import("./pages/simulator_pages/SimulateDependencyGraph"));
const Simulation = lazy(() => import("./pages/simulator_pages/Simulation"));

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Header />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<DependencyGraph />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/endpoints" element={<Endpoints />} />
          <Route path="/interfaces" element={<Interfaces />} />
          <Route path="/swagger/:service" element={<Swagger />} />
          {!Config.backendConfig.SimulatorMode && (
            <Route path="/diff" element={<Difference />} />
          )}
          {Config.backendConfig.SimulatorMode && (
            <> 
              <Route path="/simulation" element={<Simulation/>} /> 
              <Route path="/simulate-dependencyGraph" element={<SimulateDependencyGraph />} />
            </>
          )}
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
