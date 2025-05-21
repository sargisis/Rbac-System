import React from "react";
import { Box, Button, Typography } from "@mui/material";

const Header = () => {
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Box
      position="fixed" 
      top={16}
      right={24}
      display="flex"
      alignItems="center"
      gap={2}
      zIndex={10}
    >
      <Typography variant="body1" color="text.primary">
        {username}
      </Typography>
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Header;
