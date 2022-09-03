import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import { AlertProvider } from "./contexts/AlertContext";

// attaching root element from dom
const root = ReactDOM.createRoot(document.getElementById("root"));
// remdering react component
root.render(
  // router for various pages
  <BrowserRouter>
  {/* context provider wraper to show alerts from all pages */}
    <AlertProvider>
      {/* header component */}
      <Header />
      {/* various routes in the page */}
      <Routes></Routes>
    </AlertProvider>
  </BrowserRouter>
);
