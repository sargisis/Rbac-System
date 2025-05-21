import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { activateAccount } from "../../../Api/ApiService";

function ActivateAccount() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    repeatPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.repeatPassword) {
      return setMessage("❌ Passwords do not match");
    }

    try {
      await activateAccount({ ...form, token });
      setMessage("✅ Account activated. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Activation failed");
    }
  };

  if (!token) return <Typography variant="h6">❌ No token provided</Typography>;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      width="100vw"
      bgcolor="#f5f5f5"
    >
      <Box
        maxWidth="400px"
        width="100%"
        p={3}
        boxShadow={3}
        borderRadius={2}
        bgcolor="#fff"
      >
        <Typography variant="h4" align="center" gutterBottom color="black">
          Activate Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Repeat Password"
            type="password"
            name="repeatPassword"
            value={form.repeatPassword}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Activate Account
          </Button>
        </form>
        {message && (
          <Typography mt={2} variant="body2" color="error" align="center">
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
  
}

export default ActivateAccount;
