import React from "react";
import { TextField, InputAdornment, Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GroupIcon from "@mui/icons-material/Group";
import TuneIcon from "@mui/icons-material/Tune";

function ProjectFilters({
  nameQuery,
  setNameQuery,
  userQuery,
  setUserQuery,
  minQty,
  setMinQty,
  maxQty,
  setMaxQty,
}) {
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

      {/* Quantity Range Filter */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 0.5, display: "flex", alignItems: "center", gap: "4px" }}>
          <TuneIcon fontSize="small" /> Quantity Range
        </Typography>
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          <TextField
            label="Min"
            type="number"
            variant="outlined"
            size="small"
            value={minQty}
            onChange={(e) => setMinQty(e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Max"
            type="number"
            variant="outlined"
            size="small"
            value={maxQty}
            onChange={(e) => setMaxQty(e.target.value)}
            sx={{ flex: 1 }}
          />
        </Box>
      </Box>

      {/* Authorized User Filter */}
      <TextField
        label="Filter by Authorized User"
        variant="outlined"
        size="small"
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <GroupIcon color="action" />
            </InputAdornment>
          ),
        }}
        fullWidth
      />
    </Box>
  );
}

export default ProjectFilters;
