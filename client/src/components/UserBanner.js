import React from "react";
import { Chip } from "@mui/material";

function UserBanner({ username, color = "primary", variant = "outlined" }) {
  return (
    <Chip
      label={username || "User"}
      color={color}
      variant={variant}
      sx={{
        fontSize: "0.95rem",
        height: 32,
        borderRadius: "8px",
        borderWidth: "1.5px",
        "& .MuiChip-label": {
          padding: "0 10px !important", // balanced spacing
          fontWeight: 500,
        },
      }}
    />
  );
}

export default UserBanner;
