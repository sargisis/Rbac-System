import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Paper,
    Fade,
} from "@mui/material";
import { requestActivation } from "../../../Api/ApiService";

function ResetRequest() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            await requestActivation({ email });
            setSuccess(true);
            setMessage("✅ Reset link sent to your email.");
        } catch (err) {
            setSuccess(false);
            setMessage(err.response?.data?.message || "❌ Failed to send reset link.");
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
            sx={{ px: 2, boxSizing: "border-box", overflow: "hidden" }}
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
                    Forgot Your Password?
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    mb={3}
                >
                    Enter your email and we'll send you a reset link.
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        autoComplete="email"
                        required
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, py: 1.3, fontWeight: "bold", borderRadius: 2 }}
                    >
                        Send Reset Link
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

export default ResetRequest;
