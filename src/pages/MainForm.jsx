import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import TabulatorDirect from "../pages/TabulatorDirect";
// import '../assets/css/main.css';

const MainForm = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          path="main"
          element={
            <div>
              <div id="main">
                Welcome to Main Page!
              </div>
            </div>
          }
        />
        <Route
          path="tabulatorDirect"
          element={
            <div>
              <div id="tabulatorDirect">
                <TabulatorDirect />
              </div>
            </div>
          }
        />
        <Route
          path="contact"
          element={
            <div>
              <div id="contact">
                Contact Page
              </div>
              <div id="support">
                Support Section
              </div>
            </div>
          }
        />
        <Route path="products/1" element={<div>Product 1 Page</div>} />
        <Route path="products/2" element={<div>Product 2 Page</div>} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Route>
    </Routes>
  );
};

export default MainForm;
