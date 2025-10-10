import React from "react";
import { Box, Typography, Chip, Avatar, Stack, Paper } from "@mui/material";

function UserList({ users }) {
  // Example: users = ["alice", "bob", "charlie"]
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "#f9fafb",
        padding: "6px 10px",     // ↓ smaller padding
        borderRadius: "6px",
        mb: 1,                   // ↓ smaller bottom margin
      }}
    >
      <Typography
        variant="subtitle2"      // ↓ smaller font than subtitle1
        sx={{ fontWeight: "bold", mb: 0.5 }}
      >
        Authorized Users
      </Typography>

      <Stack direction="row" spacing={0.5} flexWrap="wrap">
        {users.map((user, i) => (
          <Chip
            key={i}
            label={user}
            color="primary"
            variant="outlined"
            size="small"          // ✅ much thinner chips
            avatar={<Avatar sx={{ width: 24, height: 24 }}>{user[0].toUpperCase()}</Avatar>}
          />
        ))}
      </Stack>
    </Paper>
  );
}

export default UserList;
