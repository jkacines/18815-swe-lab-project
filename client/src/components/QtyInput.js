import React, { useState } from "react";
import { Button, TextField } from "@mui/material";

function QtyInput() {
  const [qty, setQty] = useState("");

  const handleCheckIn = () => {
    alert(`Checked in ${qty || 0} units`);
  };

  const handleCheckOut = () => {
    alert(`Checked out ${qty || 0} units`);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        width: "100%",
        flexWrap: "nowrap",       // ✅ prevent wrapping
      }}
    >
      <TextField
        label="Enter qty"
        size="small"
        variant="outlined"
        sx={{
          flexGrow: 1,            // expands to fill available space
          "& .MuiInputBase-root": { height: 36 },
        }}
      />
      <Button
        variant="outlined"
        size="small"
        sx={{
          height: 36,
          whiteSpace: "nowrap",   // ✅ keeps text on one line
          flexShrink: 0,          // ✅ prevents button from shrinking
        }}
      >
        Check In
      </Button>
      <Button
        variant="outlined"
        size="small"
        sx={{
          height: 36,
          whiteSpace: "nowrap",   // ✅ keeps text on one line
          flexShrink: 0,          // ✅ prevents button from shrinking
        }}
      >
        Check Out
      </Button>
    </div>
  );
}

export default QtyInput;
