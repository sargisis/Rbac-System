import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { createUser } from "../../../Api/ApiService";
import { useNavigate } from "react-router-dom";

function CreateUser() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await createUser({ email }, token);
      setSuccess(true);
      setMessage("✅ User created. Activation email sent.");
      setEmail("");
    } catch (err) {
      setSuccess(false);
      setMessage(err.response?.data?.message || "❌ Failed to create user");
    }
  };

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
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" color="black">
            Admin Panel
          </Typography>
  
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="User Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ mt: 1 }}
            >
              Create User
            </Button>
          </form>
  
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/admin-panel")}
          >
            View All Users
          </Button>
  
          {message && (
            <Alert severity={success ? "success" : "error"}>{message}</Alert>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

export default CreateUser;
