import React from "react";
import { TextField, InputAdornment, Typography, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./SidebarPanel.css"; // shared sidebar styling

function ProjectFilters({
  nameQuery,
  setNameQuery,
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
    </Box>
  );
}

export default ProjectFilters;
