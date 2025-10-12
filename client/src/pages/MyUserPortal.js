import React, { useState } from "react";
import Projects from "../components/Projects";
import ProjectFilters from "../components/ProjectFilters";
import ProjectCreate from "../components/ProjectCreate";
import HWCreate from "../components/HWCreate";
import Hardware from "../components/Hardware";
import { Avatar, Chip, ButtonGroup, Button } from "@mui/material";

const MyUserPortal = ({ response, onLogout }) => {
  const [activeView, setActiveView] = useState("projects");

  // Filter states
  const [nameQuery, setNameQuery] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [minQty, setMinQty] = useState("");
  const [maxQty, setMaxQty] = useState("");

  return (
    <div style={{ padding: "2rem" }}>
      {/* ======= HEADER ======= */}
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
        <h1 style={{ margin: 0 }}>Hardware Checkout System</h1>

        {/* Right side: user + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {response.user && (
            <Chip
              label={response.user.username || "User"}
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
                  {response.user.username
                    ? response.user.username[0].toUpperCase()
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

      {/* ======= MAIN CONTENT ======= */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem" }}>
        {/* LEFT COLUMN */}
        <div
          style={{
            flexShrink: 0,
            flexBasis: "380px",  // fixed baseline width
            maxWidth: "400px",   // optional for responsiveness
            minWidth: "360px",   // keeps consistent width
          }}
        >
          {/* Toggle between Projects / Hardware */}
          <ButtonGroup
            variant="outlined"
            color="primary"
            sx={{ mb: 2, width: "100%" }}
          >
            <Button
              onClick={() => setActiveView("projects")}
              variant={activeView === "projects" ? "contained" : "outlined"}
              sx={{ flex: 1 }}
            >
              Projects
            </Button>
            <Button
              onClick={() => setActiveView("hardware")}
              variant={activeView === "hardware" ? "contained" : "outlined"}
              sx={{ flex: 1 }}
            >
              Hardware
            </Button>
          </ButtonGroup>

          {/* Conditional sidebar */}
          {activeView === "projects" ? (
            <>
              <ProjectFilters
                nameQuery={nameQuery}
                setNameQuery={setNameQuery}
                userQuery={userQuery}
                setUserQuery={setUserQuery}
                minQty={minQty}
                setMinQty={setMinQty}
                maxQty={maxQty}
                setMaxQty={setMaxQty}
              />
              <ProjectCreate />
            </>
          ) : (
            <HWCreate />
          )}

          {/* Info Section */}
          <h3>Features to be implemented:</h3>
          <ul>
            <li>View available hardware resources</li>
            <li>Request hardware checkout</li>
            <li>Manage your projects</li>
            <li>View checkout history</li>
          </ul>

          <h3>Backend Data</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>

        {/* RIGHT COLUMN */}
        <div
          style={{
            flex: 1.4,
            borderLeft: "1px solid #e2e8f0",
            paddingLeft: "2rem",
          }}
        >
          {activeView === "projects" ? (
            <Projects
              nameQuery={nameQuery}
              userQuery={userQuery}
              minQty={minQty}
              maxQty={maxQty}
            />
          ) : (
            <Hardware />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyUserPortal;
