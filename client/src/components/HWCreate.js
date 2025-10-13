import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import NumbersIcon from "@mui/icons-material/Numbers";
import "./SidebarPanel.css"; // shared styling

function HWCreate({ onHardwareUpdated }) {
  const [hwName, setHwName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Validate form input
  const validateForm = () => {
    const newErrors = {};
    if (!hwName.trim()) newErrors.hwName = "Hardware set name is required.";
    if (!capacity || capacity <= 0)
      newErrors.capacity = "Capacity must be a positive number.";
    return newErrors;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:8001/hardware/create", {
        hwName,
        capacity: Number(capacity),
      });

      if (res.data.success) {
        setMessage(`✅ ${res.data.message}`);
        setHwName("");
        setCapacity("");
        if (onHardwareUpdated) onHardwareUpdated(); // refresh parent data
      } else {
        setMessage(`❌ ${res.data.message}`);
      }
    } catch (err) {
      console.error("Error creating hardware:", err);
      setMessage("❌ Failed to create hardware set. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="sidebar-panel">
      <Typography variant="h6" sx={{ mb: 1 }}>
        Create Hardware Set
      </Typography>

      {/* Hardware Name */}
      <TextField
        label="Hardware Set Name"
        variant="outlined"
        size="small"
        value={hwName}
        onChange={(e) => setHwName(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BuildIcon color="action" />
            </InputAdornment>
          ),
        }}
        error={!!errors.hwName}
        helperText={errors.hwName}
        fullWidth
      />

      {/* Capacity */}
      <TextField
        label="Capacity"
        variant="outlined"
        size="small"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <NumbersIcon color="action" />
            </InputAdornment>
          ),
        }}
        error={!!errors.capacity}
        helperText={errors.capacity}
        fullWidth
      />

      {/* Message */}
      {message && (
        <div
          className={`message ${
            message.includes("✅") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      {/* Submit */}
      <Button
        variant="contained"
        className="create-btn"
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? "Creating..." : "Create Hardware"}
      </Button>
    </Box>
  );
}

export default HWCreate;
