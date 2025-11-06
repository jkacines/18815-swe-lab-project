import React, { useState } from "react";
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
import "./SidebarPanel.css";

function ProjectCreate({ hardware = [], onProjectUpdated }) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [hardwareSets, setHardwareSets] = useState([{ name: "", quantity: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!projectName.trim()) newErrors.projectName = "Project name is required.";
    if (hardwareSets.some((hw) => !hw.name || !hw.quantity))
      newErrors.hardwareSets = "All hardware entries must have a name and quantity.";
    return newErrors;
  };

  const handleAddHardware = () =>
    setHardwareSets([...hardwareSets, { name: "", quantity: "" }]);

  const handleRemoveHardware = (index) =>
    setHardwareSets(hardwareSets.filter((_, i) => i !== index));

  const handleHardwareChange = (index, field, value) => {
    const updated = [...hardwareSets];
    updated[index][field] = value;
    setHardwareSets(updated);
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

    const hwSetsPayload = {};
    hardwareSets.forEach((hw) => {
      if (hw.name && hw.quantity) hwSetsPayload[hw.name] = Number(hw.quantity);
    });

    setIsLoading(true);
    try {
      const response = await axios.post("https://backendserver1-ab6b6912c013.herokuapp.com/projects/create", {
        projectName,
        description,
        hwSets: hwSetsPayload,
      });

      if (response.data.success) {
        setMessage(`✅ ${response.data.message}`);
        setProjectName("");
        setDescription("");
        setHardwareSets([{ name: "", quantity: "" }]);
        if (onProjectUpdated) onProjectUpdated(); // 🔹 notify parent
      } else {
        setMessage(`❌ ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      setMessage("❌ Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="sidebar-panel">
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
        <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <TextField
            select
            label="Select Hardware"
            variant="outlined"
            size="small"
            value={hw.name}
            onChange={(e) => handleHardwareChange(index, "name", e.target.value)}
            sx={{ flex: 2 }}
          >
            {hardware.length > 0 ? (
              hardware.map((option) => (
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
        </div>
      ))}

      {errors.hardwareSets && (
        <Typography variant="body2" color="error">
          {errors.hardwareSets}
        </Typography>
      )}

      <Button
        variant="outlined"
        size="small"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleAddHardware}
        sx={{ alignSelf: "flex-start" }}
      >
        Add Hardware Set
      </Button>

      {message && (
        <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <Button
        variant="contained"
        className="create-btn"
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? "Creating..." : "Create Project"}
      </Button>
    </Box>
  );
}

export default ProjectCreate;
