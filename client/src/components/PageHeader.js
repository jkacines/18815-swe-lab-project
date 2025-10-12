import React from "react";
import { Avatar, Chip } from "@mui/material";

function PageHeader({ title, user, onLogout }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: "1rem",
      }}
    >
      {/* Title */}
      <h1 style={{ margin: 0 }}>{title}</h1>

      {/* Right side: user info + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {user && (
          <Chip
            label={user.username || "User"}
            color="primary"
            variant="outlined"
            avatar={
              <Avatar
                sx={{
                  bgcolor: "#3182ce",
                  width: 28,
                  height: 28,
                  fontSize: "0.9rem",
                }}
              >
                {user.username
                  ? user.username[0].toUpperCase()
                  : "U"}
              </Avatar>
            }
            sx={{
              fontSize: "0.95rem",
              height: 38,
              paddingRight: "6px",
              borderWidth: "1.5px",
              "& .MuiChip-label": {
                padding: "0 8px",
                fontWeight: 500,
              },
            }}
          />
        )}

        <button
          onClick={onLogout}
          style={{
            padding: "0.5rem 1rem",
            background: "#e53e3e",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default PageHeader;
