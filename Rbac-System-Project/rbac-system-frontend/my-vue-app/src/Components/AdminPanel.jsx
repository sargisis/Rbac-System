import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Switch,
  Avatar,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  fetchUsers,
  updateUser,
  deleteUser,
  createUser,
} from "../../../Api/ApiService";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
  });
  const [creating, setCreating] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetchUsers(token);
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [token]);

  const handleEdit = (user) => {
    navigate(`/admin/edit/${user._id}`);
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Delete user ${user.name}?`)) {
      try {
        await deleteUser(user._id, token);
        setUsers(users.filter((u) => u._id !== user._id));
      } catch (err) {
        console.error("Delete error", err);
      }
    }
  };

  const handleToggle = async (user) => {
    try {
      const updated = { ...user, active: !user.active };
      await updateUser(user._id, updated, token);
      setUsers(users.map((u) => (u._id === user._id ? updated : u)));
    } catch (err) {
      console.error("Toggle error", err);
    }
  };

  const handleCreateChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async () => {
    try {
      setCreating(true);
      await createUser(newUser, token);
      setCreateModal(false);
      setNewUser({ name: "", email: "", phone: "", role: "user" });
      const res = await fetchUsers(token);
      setUsers(res.data);
    } catch (err) {
      alert("❌ Failed to create user");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      width="100vw"
      sx={{
        background: "linear-gradient(to right, #f0f2f5, #e0eafc)",
        overflow: "auto",
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        textAlign="center"
        color="black"
      >
        Admin Panel — User Management
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={() => setCreateModal(true)}>
          Create User
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {Array.isArray(users) && users.filter((u) => u.role !== "admin").length > 0 ? (
            users
              .filter((user) => user.role !== "admin")
              .map((user) => (
                <Paper
                  key={user._id}
                  elevation={3}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 3,
                    backgroundColor: "#fff",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={user.avatar ? `http://localhost:3000${user.avatar}` : undefined}
                      sx={{ bgcolor: "#1976d2" }}
                    >
                      {!user.avatar && (user.name?.charAt(0).toUpperCase() || "U")}
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold">{user.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {user.email}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {user.phone}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Tooltip title="View Profile">
                      <IconButton color="primary" onClick={() => setSelectedUser(user)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit User">
                      <IconButton color="info" onClick={() => handleEdit(user)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton color="error" onClick={() => handleDelete(user)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Activate/Deactivate">
                      <Switch
                        checked={user.active}
                        onChange={() => handleToggle(user)}
                        color="success"
                      />
                    </Tooltip>
                  </Box>
                </Paper>
              ))
          ) : (
            <Typography textAlign="center" color="text.secondary">
              No users found.
            </Typography>
          )}
        </Box>
      )}

      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} maxWidth="xs" fullWidth>
        <DialogTitle textAlign="center">👤 User Profile</DialogTitle>
        <Divider />
        <DialogContent>
          {selectedUser && (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={2}>
              <Avatar
                src={selectedUser.avatar ? `http://localhost:3000${selectedUser.avatar}` : undefined}
                sx={{ bgcolor: "#1976d2", width: 64, height: 64, fontSize: 28 }}
              >
                {!selectedUser.avatar && (selectedUser.name?.charAt(0).toUpperCase() || "U")}
              </Avatar>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography><strong>📛 Name:</strong> {selectedUser.name}</Typography>
                <Typography><strong>📧 Email:</strong> {selectedUser.email}</Typography>
                <Typography><strong>📱 Phone:</strong> {selectedUser.phone}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUser(null)} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createModal} onClose={() => setCreateModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle textAlign="center">➕ Create New User</DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 2 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField label="Email" name="email" value={newUser.email} onChange={handleCreateChange} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCreateModal(false)} disabled={creating}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateSubmit} disabled={creating}>
            {creating ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;