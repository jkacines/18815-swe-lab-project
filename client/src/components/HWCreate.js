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
import "./ProjectCreate.css"; // reuse same message styling

function HWCreate() {
  const [hwName, setHwName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Validate input
  const validateForm = () => {
    const newErrors = {};
    if (!hwName.trim()) newErrors.hwName = "Hardware set name is required.";
    if (!capacity || capacity <= 0)
      newErrors.capacity = "Capacity must be a positive number.";
    return newErrors;
  };

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
      const response = await axios.post("http://localhost:8001/hardware/create", {
        hwName,
        capacity: Number(capacity),
      });

      if (response.data.success) {
        setMessage(`✅ ${response.data.message}`);
        setHwName("");
        setCapacity("");
      } else {
        setMessage(`❌ ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error creating hardware:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage("❌ Failed to create hardware set. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f9fafb",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        marginTop: "1.5rem",
      }}
    >
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

      {/* Submit Button */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#3182ce",
          "&:hover": { backgroundColor: "#2b6cb0" },
          alignSelf: "flex-end",
        }}
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? "Creating..." : "Create Hardware"}
      </Button>
    </Box>
  );
}

export default HWCreate;
