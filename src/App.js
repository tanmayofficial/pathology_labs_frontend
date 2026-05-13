import React from "react";
import "./App.css";
import AppRoutes from "./AppRoutes";
import { ToastContainer } from "react-toastify";

const App = () => (
  <div className="app">
    <AppRoutes />
    <ToastContainer />
  </div>
);

export default App;
