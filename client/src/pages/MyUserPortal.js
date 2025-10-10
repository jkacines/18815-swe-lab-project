import React from "react";
import Projects from "../components/Projects";
import { Avatar, Typography, Chip } from "@mui/material";

const MyUserPortal = ({ user, onLogout }) => {
  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "1rem",
        }}
      >
        <h1 style={{ margin: 0 }}>User Dashboard</h1>

        {/* Right side: user avatar + name + logout */}
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
                  {user.username ? user.username[0].toUpperCase() : "U"}
                </Avatar>
              }
              sx={{
                fontSize: "0.95rem",
                height: 38,             // slightly larger than your small chips
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

      {/* Two-column layout */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "2rem",
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ flex: 1 }}>
          <h2>Welcome to the Hardware Checkout System!</h2>
          <p>Dashboard functionality coming soon...</p>

          <div style={{ marginTop: "2rem" }}>
            <h3>Features to be implemented:</h3>
            <ul>
              <li>View available hardware resources</li>
              <li>Request hardware checkout</li>
              <li>Manage your projects</li>
              <li>View checkout history</li>
            </ul>
          </div>

          {user && (
            <div
              style={{
                marginTop: "2rem",
                padding: "1rem",
                background: "#f7fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h4>User Information:</h4>
              <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div
          style={{
            flex: 1,
            borderLeft: "1px solid #e2e8f0",
            paddingLeft: "2rem",
          }}
        >
          <Projects />
        </div>
      </div>
    </div>
  );
};

export default MyUserPortal;
