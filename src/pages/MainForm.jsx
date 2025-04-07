import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/main/MainLayout";
import TabulatorDirect from "./TabulatorDirect";
import PermissionManager from "./PermissionManager";

const MainForm = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="main" element={<div></div>} />
        <Route path="tabulatorDirect" element={<TabulatorDirect />} />
        <Route path="permissions" element={<PermissionManager />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Route>
    </Routes>
  );
};

export default MainForm;
