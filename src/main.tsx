import Config from "../Config";
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Loading from "./components/Loading";



let pagePrefix = './pages'
if (Config.backendConfig.SimulatorMode) {
  pagePrefix = './simulator_pages'
}

const DependencyGraph = Config.backendConfig.SimulatorMode
  ? lazy(() => import("./simulator_pages/DependencyGraph"))
  : lazy(() => import("./pages/DependencyGraph"));

const Metrics = Config.backendConfig.SimulatorMode
  ? lazy(() => import("./simulator_pages/Metrics"))
  : lazy(() => import("./pages/Metrics"));

const Insights = Config.backendConfig.SimulatorMode
  ? lazy(() => import("./simulator_pages/Insights"))
  : lazy(() => import("./pages/Insights"));

const Endpoints = Config.backendConfig.SimulatorMode
  ? lazy(() => import("./simulator_pages/Endpoints"))
  : lazy(() => import("./pages/Endpoints"));

const Interfaces = Config.backendConfig.SimulatorMode
  ? lazy(() => import("./simulator_pages/Interfaces"))
  : lazy(() => import("./pages/Interfaces"));

const Swagger = Config.backendConfig.SimulatorMode
  ? lazy(() => import("./simulator_pages/Swagger"))
  : lazy(() => import("./pages/Swagger"));

const Difference = lazy(() => import("./pages/Diff"));
const SimulateDependencyGraph = lazy(() => import("./simulator_pages/SimulateDependencyGraph"));
const Simulation = lazy(() => import("./simulator_pages/Simulation"));

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
