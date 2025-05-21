import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { getUserById, updateUser } from "../../../Api/ApiService";

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(id, token);
        setUser(res.data);
      } catch (err) {
        setError("Failed to load user." , err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, token]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateUser(id, user, token);
      navigate("/admin-panel");
    } catch (err) {
      setError("Failed to save changes." , err);
    } finally {
      setSaving(false);
    }
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
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      width="100vw"
      sx={{
        background: "linear-gradient(to right, #f0f2f5, #dfe6ed)",
        px: 2,
        animation: "fadeIn 0.5s ease",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 4,
          backgroundColor: "#fff",
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
          sx={{ mb: 3 }}
        >
          ✏️ Edit User (Admin)
        </Typography>
  
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={user.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            margin="normal"
            required
          />
  
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3, py: 1.5, fontWeight: "bold", fontSize: "1rem" }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
  
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  );
  
};

export default AdminEditUser;
