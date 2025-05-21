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

function Login() {
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
        try {
            const res = await login(form);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.name || res.data.email);
            localStorage.setItem("role" , res.data.role);
            localStorage.setItem('userId' , res.data._id);
            setSuccess(true);
            setMessage("✅ Login successful. Redirecting...");
            setTimeout(() => navigate("/users"), 1500);
        } catch (err) {
            setSuccess(false);
            setMessage(err.response?.data?.message || "❌ Login failed");
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
            bgcolor="linear-gradient(to right, #f0f2f5, #dfe6ed)"
            sx={{
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
                <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                    Welcome Back
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" textAlign="center" mb={2}>
                    Please login to your account
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
                        autoComplete="email"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        margin="normal"
                        autoComplete="current-password"
                        required
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
                        {loading ? <CircularProgress size={26} /> : "Login"}
                    </Button>

                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate("/reset-request")}
                        sx={{ mt: 2, textTransform: "none" }}
                    >
                        Forgot Password?
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

export default Login;
