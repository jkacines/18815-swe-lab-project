import React from "react";
import { LinearProgress, Box, Typography } from "@mui/material";

function HWSetStatus({ label, used, capacity }) {
  const percent = Math.min((used / capacity) * 100, 100);

  return (
    <Box
      sx={{
        backgroundColor: "#f9fafb",
        padding: "6px 10px",   // ↓ tighter padding
        borderRadius: "6px",
        mb: 0.75,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.25 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: "#444" }}>
          {used}/{capacity}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 6,            // ↓ thinner progress bar
          borderRadius: 3,
        }}
      />
    </Box>
  );
}

export default HWSetStatus;
