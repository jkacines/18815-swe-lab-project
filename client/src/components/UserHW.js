// src/components/UserHW.js
import React from "react";
import {
  Box,
  Typography,
  List,
  Paper,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import "./SidebarPanel.css";

function UserHW({ username, userHardwareData }) {
  if (!username) {
    return (
      <Box className="sidebar-panel" sx={{ mt: 3 }}>
        <Typography color="error">
          ❌ Missing username. Please log in again.
        </Typography>
      </Box>
    );
  }

  const data = userHardwareData;

  return (
    <Box className="sidebar-panel" sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        My Hardware Overview
      </Typography>

      {!data ? (
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      ) : data.projects?.length > 0 ? (
        <List dense sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {data.projects.map((proj, i) => (
            <Paper
              key={i}
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#f9fafb",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  mb: 0.5,
                }}
              >
                <BuildIcon
                  fontSize="small"
                  color="action"
                  sx={{ mr: 1, opacity: 0.8 }}
                />
                {proj.projectName}
              </Typography>

              {Object.keys(proj.hwUsage || {}).length > 0 ? (
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "1.4rem",
                    color: "#4A5568",
                    fontSize: "0.9rem",
                  }}
                >
                  {Object.entries(proj.hwUsage).map(([hw, qty]) => (
                    <li key={hw}>
                      <strong>{hw}</strong>: {qty}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic", pl: 3 }}
                >
                  No hardware checked out.
                </Typography>
              )}
            </Paper>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          You’re not part of any projects yet.
        </Typography>
      )}
    </Box>
  );
}

export default UserHW;
