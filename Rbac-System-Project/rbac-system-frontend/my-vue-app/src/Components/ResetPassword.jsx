import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Fade,
} from "@mui/material";
import { resetPassword } from "../../../Api/ApiService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        password: newPassword,
        token,
      };

      await resetPassword(data);

      setMessage("✅ Password successfully reset!");
      setError("");

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("");
      setError(
        err.response?.data?.message ||
          "❌ An error occurred while resetting the password."
      );
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      width="100vw"
      sx={{ px: 2, bgcolor: "#f4f6f8" }}
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
          variant="h5"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
        >
          Reset Password
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={3}
        >
          Enter your new password below.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3, py: 1.3, fontWeight: "bold", borderRadius: 2 }}
          >
            Reset Password
          </Button>
        </form>

        <Fade in={!!message || !!error}>
          <Box mt={3}>
            {message && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                {message}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Fade>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
