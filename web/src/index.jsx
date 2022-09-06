import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import { AlertProvider } from "./contexts/AlertContext";
import FirebaseProvider from "./contexts/FirebaseContext";

// attaching root element from dom
const root = ReactDOM.createRoot(document.getElementById("root"));
// remdering react component
root.render(
  // router for various pages
  <BrowserRouter>
    {/* context provider wraper to show alerts from all pages */}
    <AlertProvider>
      {/* context provider wraper for firebase  */}
      <FirebaseProvider>
        {/* header component */}
        <Header />
        {/* various routes in the page */}
        <Routes></Routes>
      </FirebaseProvider>
    </AlertProvider>
  </BrowserRouter>
);
