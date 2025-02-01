import React, { useState } from "react";
import { TextField, MenuItem, Select, FormControl, InputLabel, Button } from "@mui/material";
import Sidebar from "../Admin";

const OrderManagement = () => {
  const [status, setStatus] = useState("");

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <div>
      
      <h2>Order Management</h2>
      <FormControl fullWidth>
        <InputLabel id="status-label">Order Status</InputLabel>
        <Select
          labelId="status-label"
          value={status}
          onChange={handleStatusChange}
          label="Order Status"
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="shipped">Shipped</MenuItem>
          <MenuItem value="delivered">Delivered</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>
      
      <Button variant="contained" color="primary" style={{ marginTop: "20px" }}>
        Update Order Status
      </Button>
    </div>
  );
};

export default OrderManagement;
