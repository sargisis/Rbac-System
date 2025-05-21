import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../../Api/ApiService";
import Header from "./Header";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getUserById(id, token);
        setUser({
          name: res.data.name || "",
          phone: res.data.phone || "",
        });
      } catch (err) {
        console.error("User fetch error:", err);
        setError("Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, token]);

  const validatePhone = (value) => {
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!value.trim()) return "Phone is required";
    if (!phoneRegex.test(value)) return "Invalid phone format";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneValidation = validatePhone(user.phone);
    if (phoneValidation) {
      setPhoneError(phoneValidation);
      return;
    }

    setSaving(true);
    try {
      await updateUser(id, user, token);
      const currentUserId = localStorage.getItem("userId");
      if (id === currentUserId) {
        localStorage.setItem("username", user.name || user.email);
      }
      navigate("/users");
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handlePhoneChange = (e) => {
    setUser({ ...user, phone: e.target.value });
    setPhoneError("");
  };

  if (loading) return <CircularProgress sx={{ m: 4 }} />;
  if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      width="100vw"
      bgcolor="linear-gradient(to right, #f0f2f5, #dfe6ed)"
      sx={{ overflow: "hidden", px: 2, boxSizing: "border-box" }}
    >
      <Header />

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
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
          <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
            Edit User
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone"
              value={user.phone}
              onChange={handlePhoneChange}
              margin="normal"
              error={!!phoneError}
              helperText={phoneError}
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3, py: 1.5, fontWeight: "bold", fontSize: "1rem", borderRadius: 2 }}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default EditUser;
