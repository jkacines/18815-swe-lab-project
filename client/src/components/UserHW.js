// src/components/UserHW.js
import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
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
      ) : (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1, mb: 0.5 }}>
            Projects
          </Typography>

          {data.projects?.length > 0 ? (
            <List dense>
              {data.projects.map((proj, i) => (
                <React.Fragment key={i}>
                  <ListItem disableGutters>
                    <ListItemText
                      primary={proj.projectName}
                      secondary={
                        Object.keys(proj.hwUsage || {}).length > 0 ? (
                          <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                            {Object.entries(proj.hwUsage).map(([hw, qty]) => (
                              <li key={hw}>
                                {hw}: {qty}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <em>No hardware checked out</em>
                        )
                      }
                    />
                  </ListItem>
                  {i < data.projects.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              You’re not part of any projects yet.
            </Typography>
          )}

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2, mb: 0.5 }}>
            Total Hardware Checked Out
          </Typography>

          {data.totalHW && Object.keys(data.totalHW).length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "1rem" }}>
              {Object.entries(data.totalHW).map(([hw, qty]) => (
                <li key={hw}>
                  {hw}: {qty}
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2" color="text.secondary">
              You currently have no hardware checked out.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}

export default UserHW;
