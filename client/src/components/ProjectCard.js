import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import HWSetStatus from "./HWSetStatus"; // existing component

function ProjectCard({ name, users, hwSets = {}, joined, onToggle }) {
  const [qty, setQty] = useState("");

  // Total available = sum of (capacity - used)
  const totalAvailable = Object.values(hwSets).reduce((sum, hw) => {
    const used = hw.used ?? 0;
    const capacity = hw.capacity ?? 0;
    return sum + Math.max(capacity - used, 0);
  }, 0);

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "1.5rem",
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      {/* Project title */}
      <h3 style={{ marginBottom: "0.5rem" }}>{name}</h3>

      {/* Authorized users */}
      {users && users.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <strong>Authorized Users:</strong>{" "}
          {users.map((u, i) => (
            <span key={i} style={{ marginRight: "0.5rem" }}>
              {u}
            </span>
          ))}
        </div>
      )}

      {/* Hardware sets */}
      {Object.entries(hwSets).map(([hwName, hw]) => {
        const used = hw.used ?? 0;
        const capacity = hw.capacity ?? 0;
        const available = capacity - used;
        return (
          <HWSetStatus
            key={hwName}
            label={hwName}
            usage={`${available}/${capacity} available`}
            progress={capacity ? (available / capacity) * 100 : 0}
          />
        );
      })}

      {/* Divider */}
      <hr style={{ margin: "1rem 0" }} />

      {/* Check in/out */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TextField
          label="Enter qty"
          size="small"
          variant="outlined"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          sx={{ flex: 1 }}
        />
        <Button variant="outlined" size="small">
          CHECK IN
        </Button>
        <Button variant="outlined" size="small">
          CHECK OUT
        </Button>
      </div>

      {/* Divider */}
      <hr style={{ margin: "1rem 0" }} />

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#4a5568", fontSize: "0.9rem" }}>
          {totalAvailable} total available
        </span>
        <Button
          variant="contained"
          size="small"
          onClick={onToggle}
          sx={{ backgroundColor: joined ? "#e53e3e" : "#3182ce" }}
        >
          {joined ? "LEAVE" : "JOIN"}
        </Button>
      </div>
    </div>
  );
}

export default ProjectCard;
