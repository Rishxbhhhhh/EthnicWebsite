import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Select, FormControl, InputLabel, Button, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]); // State to hold user data
  const [selectedUser, setSelectedUser] = useState(null); // State for the user being edited
  const [updatedRole, setUpdatedRole] = useState(""); // State for updated role
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/users/users"); // Update URL as per your backend route
        setUsers(response.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle role update for a user
  const handleUpdateRole = async () => {
    if (!selectedUser || !updatedRole) {
      alert("Please select a user and a role to update.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8080/users/users/${selectedUser._id}`, { role: updatedRole });
      alert(response.data.message || "Role updated successfully!");
      
      // Update the user's role in the UI
      setUsers(users.map(user => user._id === selectedUser._id ? { ...user, role: updatedRole } : user));
      setSelectedUser(null);
      setUpdatedRole("");
    } catch (err) {
      console.error(err);
      alert("Failed to update role. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>User Management</Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Current Role</TableCell>
                <TableCell>Update Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user._id}>
                  <TableCell style={{textTransform:'capitalize'}}>{user.firstname} {user.lastname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => setSelectedUser(user)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedUser && (
        <div style={{ marginTop: "20px" }}>
          <Typography style={{textTransform:'capitalize'}} variant="h6">Edit Role for: {selectedUser.firstname}</Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={updatedRole}
              onChange={e => setUpdatedRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateRole}
            style={{ marginTop: "10px" }}
          >
            Update Role
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
