import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  MenuItem,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import BuildIcon from "@mui/icons-material/Build";
import DescriptionIcon from "@mui/icons-material/Description";
import "./ProjectCreate.css";

function ProjectCreate() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [hardwareSets, setHardwareSets] = useState([{ name: "", quantity: "" }]);
  const [availableHardware, setAvailableHardware] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch available hardware sets from backend
  useEffect(() => {
    const fetchHardware = async () => {
      try {
        const response = await axios.get("http://localhost:8001/hardware");
        if (response.data.success) {
          setAvailableHardware(response.data.hardware);
        }
      } catch (error) {
        console.error("Error fetching hardware:", error);
      }
    };
    fetchHardware();
  }, []);

  // Add a new hardware row
  const handleAddHardware = () => {
    setHardwareSets([...hardwareSets, { name: "", quantity: "" }]);
  };

  // Remove a hardware row
  const handleRemoveHardware = (index) => {
    setHardwareSets(hardwareSets.filter((_, i) => i !== index));
  };

  // Handle changes to a hardware field
  const handleHardwareChange = (index, field, value) => {
    const updated = [...hardwareSets];
    updated[index][field] = value;
    setHardwareSets(updated);
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!projectName.trim()) newErrors.projectName = "Project name is required.";
    if (hardwareSets.some((hw) => !hw.name || !hw.quantity))
      newErrors.hardwareSets = "All hardware entries must have a name and quantity.";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Convert hardware sets to dictionary format for backend
    const hwSetsPayload = {};
    hardwareSets.forEach((hw) => {
      if (hw.name && hw.quantity) hwSetsPayload[hw.name] = Number(hw.quantity);
    });

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8001/projects/create", {
        projectName,
        description,
        hwSets: hwSetsPayload,
      });

      if (response.data.success) {
        setMessage(`✅ ${response.data.message}`);
        setProjectName("");
        setDescription("");
        setHardwareSets([{ name: "", quantity: "" }]);
      } else {
        setMessage(`❌ ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage("❌ Failed to create project. Please try again.");
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
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Create Project
      </Typography>

      {/* Project Name */}
      <TextField
        label="Project Name"
        variant="outlined"
        size="small"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BuildIcon color="action" />
            </InputAdornment>
          ),
        }}
        error={!!errors.projectName}
        helperText={errors.projectName}
        fullWidth
      />

      {/* Project Description */}
      <TextField
        label="Project Description"
        variant="outlined"
        size="small"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <DescriptionIcon color="action" />
            </InputAdornment>
          ),
        }}
        fullWidth
        multiline
        minRows={2}
      />

      {/* Hardware Section */}
      <Typography variant="subtitle1" sx={{ fontWeight: 500, mt: 1 }}>
        Assign Hardware Sets
      </Typography>

      {hardwareSets.map((hw, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <TextField
            select
            label="Select Hardware"
            variant="outlined"
            size="small"
            value={hw.name}
            onChange={(e) => handleHardwareChange(index, "name", e.target.value)}
            sx={{ flex: 2 }}
          >
            {availableHardware.length > 0 ? (
              availableHardware.map((option) => (
                <MenuItem key={option.hwName} value={option.hwName}>
                  {option.hwName} ({option.availability}/{option.capacity} available)
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No hardware sets available</MenuItem>
            )}
          </TextField>

          <TextField
            label="Quantity"
            variant="outlined"
            size="small"
            type="number"
            value={hw.quantity}
            onChange={(e) => handleHardwareChange(index, "quantity", e.target.value)}
            sx={{ flex: 1 }}
          />

          <IconButton
            color="error"
            size="small"
            onClick={() => handleRemoveHardware(index)}
            disabled={hardwareSets.length === 1}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      {errors.hardwareSets && (
        <Typography variant="body2" color="error">
          {errors.hardwareSets}
        </Typography>
      )}

      {/* Add Hardware Button */}
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleAddHardware}
        sx={{ alignSelf: "flex-start" }}
      >
        Add Hardware Set
      </Button>

      {/* Success/Error Message */}
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
        {isLoading ? "Creating..." : "Create Project"}
      </Button>
    </Box>
  );
}

export default ProjectCreate;
