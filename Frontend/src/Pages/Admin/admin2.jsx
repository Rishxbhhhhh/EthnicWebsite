import React, { useEffect, useState } from "react";
import "./Admin.css";
import { FiUser } from "react-icons/fi";
import Dashboard from "./Pages/Dashboard";
import ProductManagement from "./Pages/ProductManagement";
import OrderManagement from "./Pages/OrderManagement";

const Admin = () => {
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  // Function to dynamically render the selected component
  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "Dashboard":
        return <Dashboard />;
      case "Products":
        return <ProductManagement />;
      case "Orders":
        return <OrderManagement />;
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
      setUserName(localStorage.getItem("user"));
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
          <li>
            <FiUser /> {userName}
          </li>
          <li onClick={() => setSelectedComponent("Dashboard")}>Dashboard</li>
          <li onClick={() => setSelectedComponent("Products")}>Products</li>
          <li onClick={() => setSelectedComponent("Orders")}>Orders</li>
        </ul>
      </div>
    </div>
  );
};

export default Admin;
