import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../../../Api/ApiService";

function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const res = await login(form);
      const { token, role, name, email, _id } = res.data;

      if (role !== "admin") {
        throw new Error("Access denied. Admins only.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("username", name || email);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", _id);

      setSuccess(true);
      setMessage("✅ Welcome Admin! Redirecting...");

      setTimeout(() => navigate("/admin-panel"), 1500);
    } catch (err) {
      setSuccess(false);
      setMessage(
        err.response?.data?.message || err.message || "❌ Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      width="100vw"
      sx={{
        background: "linear-gradient(to right, #f0f2f5, #dfe6ed)",
        overflow: "hidden",
        px: 2,
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
        >
          Admin Login
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          textAlign="center"
          mb={2}
        >
          Only administrators are allowed to log in
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="current-password"
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: 2,
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={26} /> : "Login as Admin"}
          </Button>
        </form>

        <Fade in={!!message}>
          <Alert
            severity={success ? "success" : "error"}
            sx={{ mt: 3, borderRadius: 2 }}
          >
            {message}
          </Alert>
        </Fade>
      </Paper>
    </Box>
  );
}

export default AdminLogin;
