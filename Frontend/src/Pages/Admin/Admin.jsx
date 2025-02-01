import React, { useEffect, useState } from "react";
import "./Admin.css";
import { FiUser } from "react-icons/fi";
import Dashboard from "./Pages/Dashboard";
import ProductManagement from "./Pages/Product/ProductManagement";
import OrderManagement from "./Pages/OrderManagement";
import UserManagement from "./Pages/UserManagement";
import Collections from "./Pages/Collections/Collections";
import Corousel from "./Pages/Corousel";
import Settings from "./Pages/Settings";
import Logo from "../../assets/images/logo.png"

const Admin = () => {
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  // Function to dynamically render the selected component
  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "Dashboard":
        return <Dashboard />;
      case "Products":
        return <ProductManagement />;
      case "Users":
        return <UserManagement />;
      case "Orders":
        return <OrderManagement />;
      case "Collections":
        return <Collections />;
      case "Corousel":
        return <Corousel />;
      case "Settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-panel">
      <Sidebar setSelectedComponent={setSelectedComponent} />
      <div className="content-container">{renderSelectedComponent()}</div>
    </div>
  );
};

const Sidebar = ({ setSelectedComponent }) => {
  const [userName, setUserName] = useState(localStorage.getItem("user"));
  const [loginInfo, setLoginInfo] = useState("Login");

  useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      setUserName(localStorage.getItem("user").toLocaleUpperCase());
      setLoginInfo("Logout");
    } else {
      setLoginInfo("Login");
    }
  }, []);

  const handleLog = () => {
    // Clear user info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoginInfo("Login");
  };

  return (
    <div className="left-container">
      <div className="admin-navBar">
        <ul>

          <h4 className="mx-2"><FiUser /> {userName}</h4>
          <li onClick={() => setSelectedComponent("Dashboard")}>Dashboard</li>
          <li onClick={() => setSelectedComponent("Users")}>Users</li>
          <li onClick={() => setSelectedComponent("Products")}>Products</li>
          <li onClick={() => setSelectedComponent("Orders")}>Orders</li>
          <li onClick={() => setSelectedComponent("Collections")}>Collections</li>
          <li onClick={() => setSelectedComponent("Corousel")}>Corousel</li>
          <li onClick={() => setSelectedComponent("Settings")}>Settings</li>
        </ul>
      </div>
    </div>
  );
};

export default Admin;
