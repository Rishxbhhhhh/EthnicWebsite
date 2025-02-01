import React, { createContext, useContext, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "react-toastify/ReactToastify.css";

import Header from "./Component/Header/Header";
import Signup from "./Pages/Signup/Signup";
import Login from "./Pages/Login/Login";
import Admin from "./Pages/Admin/Admin";
import Error from "./Pages/Error/Error";
import Home from "./Pages/Home/Home";

// Authentication Context banate hain
const AuthContext = createContext();

const App = () => {
  // Authentication state yahan handle karein
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <BrowserRouter>
        <Routes>
          {/* Header ke sath wale routes */}
          <Route element={<HeaderLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/404" element={<Error />} />
          </Route>

          {/* Header ke bina wale routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Admin Route */}
          <Route
            path="/admin"
            element={
              // <PrivateRoute>
                <Admin />
              // </PrivateRoute>
            }
          />

          {/* Agar koi galat route par jaye toh */}
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

// Header Layout component
const HeaderLayout = () => {
  return (
    <>
      <Header /> {/* Sab routes par ye header dikhayega */}
      <Outlet /> {/* Niche ka content render karega */}
    </>
  );
};

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  // Agar user logged in hai toh route dikhayega, warna login par bhej dega
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;
