import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Switch,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Button,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchUsers, deleteUser, uploadAvatar } from "../../../Api/ApiService";
import { getAvatarUrl } from "../../../Api/ApiService";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetchUsers(token);
        const nonAdminUsers = res.data.filter((user) => user.role !== "admin");
        setUsers(nonAdminUsers);
        setFiltered(nonAdminUsers);
      } catch (err) {
        setError("❌ Failed to fetch users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [token]);

  useEffect(() => {
    const filteredResults = users.filter((u) =>
      u.email.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredResults);
  }, [search, users]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(userId, token);
      const updated = users.filter((u) => u._id !== userId);
      setUsers(updated);
      setFiltered(updated);
    } catch (err) {
      setError("❌ Failed to delete user");
      console.error(err);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUser) return;
  
    try {
      const res = await uploadAvatar(selectedUser._id, file);
      const avatarPath = res.data.avatar;
  
      setAvatarPreview(avatarPath);
      setSelectedUser((prev) => ({ ...prev, avatar: avatarPath }));
  
      const updatedUsers = users.map((u) =>
        u._id === selectedUser._id ? { ...u, avatar: avatarPath } : u
      );
      setUsers(updatedUsers);
      setFiltered(updatedUsers);
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert("❌ Upload failed");
    }
  };
  

  const closeModal = () => {
    setSelectedUser(null);
    setAvatarPreview(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        background: "linear-gradient(to right, #f0f2f5, #e0eafc)",
        px: 3,
        py: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4} color="black">
        Users List
      </Typography>

      <TextField
        fullWidth
        label="Search by email"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" flexDirection="column" gap={2}>
        {filtered.map((user) => (
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
                src={getAvatarUrl(user.avatar)}
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
                <IconButton color="info" onClick={() => navigate(`/users/edit/${user._id}`)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete User">
                <IconButton color="error" onClick={() => handleDelete(user._id)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        ))}
      </Box>

  
      <Dialog open={!!selectedUser} onClose={closeModal} maxWidth="xs" fullWidth>
        <DialogTitle textAlign="center">👤 User Profile</DialogTitle>
        <Divider />
        <DialogContent>
          {selectedUser && (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={2}>
              <Avatar
                src={getAvatarUrl(avatarPreview || selectedUser.avatar)}
                sx={{ width: 64, height: 64, bgcolor: "#1976d2", fontSize: 28 }}
              >
                {!avatarPreview && !selectedUser.avatar && (selectedUser.name?.charAt(0).toUpperCase() || "U")}
              </Avatar>

              <Button variant="outlined" component="label" size="small">
                Upload Avatar
                <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
              </Button>

              <Box display="flex" flexDirection="column" gap={1}>
                <Typography>
                  <strong>🔥 Name:</strong> {selectedUser.name}
                </Typography>
                <Typography>
                  <strong>📧 Email:</strong> {selectedUser.email}
                </Typography>
                <Typography>
                  <strong>📞 Phone:</strong> {selectedUser.phone}
                </Typography>
                <Typography>
                  <strong>✅ Status:</strong>{" "}
                  <span style={{ color: selectedUser.active ? "green" : "red" }}>
                    {selectedUser.active ? "Active" : "Inactive"}
                  </span>
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersList;
