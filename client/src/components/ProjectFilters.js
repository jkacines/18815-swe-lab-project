import React from "react";
import {
  TextField,
  InputAdornment,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./SidebarPanel.css"; // shared sidebar styling

function ProjectFilters({
  nameQuery,
  setNameQuery,
  showMyProjects,
  setShowMyProjects,
}) {
  return (
    <Box className="sidebar-panel">
      <Typography variant="h6" sx={{ mb: 1 }}>
        Filter Projects
      </Typography>

      {/* Project Name Filter */}
      <TextField
        label="Search by Project Name"
        variant="outlined"
        size="small"
        value={nameQuery}
        onChange={(e) => setNameQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        fullWidth
      />

      {/* My Projects Filter */}
      <FormControlLabel
        control={
          <Checkbox
            checked={showMyProjects}
            onChange={(e) => setShowMyProjects(e.target.checked)}
            color="primary"
          />
        }
        label="My Projects"
        sx={{ mt: 1 }}
      />
    </Box>
  );
}

export default ProjectFilters;
