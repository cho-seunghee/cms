import React, { useState, createContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import MainForm from "./pages/MainForm";
import "./index.css";

export const UserContext = createContext();

const App = () => {
  const [user, setUser] = useState({
    username: "",
    userId: "",
    ip: "",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/" element={<LoginForm />} /> {/* 로그인 페이지 */}
        <Route path="/main/*" element={<MainForm />} />{" "}
        {/* 메인 페이지 및 하위 경로 */}
        {/* <Route
          path="/main/*"
          element={user ? <MainForm /> : <Navigate to="/" />}
        /> */}
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
