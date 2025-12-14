import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";
import App from "./App";

// A wrapper to protect routes (check if user is logged in)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Route (The Dashboard) */}
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <App />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default AppRouter;