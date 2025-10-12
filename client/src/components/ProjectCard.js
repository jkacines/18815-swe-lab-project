import React, { useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import HWSetStatus from "./HWSetStatus";

function ProjectCard({ name, users = [], hwSets = {}, joined, onUserJoined }) {
  const [qty, setQty] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [message, setMessage] = useState("");

  // Total available = sum of (capacity - used)
  const totalAvailable = Object.values(hwSets).reduce((sum, hw) => {
    const used = hw.used ?? 0;
    const capacity = hw.capacity ?? 0;
    return sum + Math.max(capacity - used, 0);
  }, 0);

  // --- Handle Join Project ---
  const handleJoin = async () => {
    setIsJoining(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8001/projects/addUser", {
        projectName: name,
        username: localStorage.getItem("username"), // 🔹 assumes username stored on login
      });

      if (res.data.success) {
        setMessage("✅ Joined project successfully");
        if (onUserJoined) onUserJoined(); // 🔹 trigger refresh in parent
      } else {
        setMessage(`❌ ${res.data.message || "Failed to join project"}`);
      }
    } catch (err) {
      console.error("Error joining project:", err);
      setMessage("❌ Failed to join project");
    } finally {
      setIsJoining(false);
    }
  };

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

      {/* Authorized users — always visible */}
      <div style={{ marginBottom: "1rem" }}>
        <strong>Authorized Users:</strong>{" "}
        {users.length > 0 ? (
          users.map((u, i) => (
            <span key={i} style={{ marginRight: "0.5rem" }}>
              {u}
            </span>
          ))
        ) : (
          <span style={{ color: "#718096" }}>No users yet</span>
        )}
      </div>

      {/* Hardware sets */}
      {Object.entries(hwSets).map(([hwName, hwData]) => {
        const used = hwData.used ?? 0;
        const capacity = hwData.capacity ?? 0;
        const available = capacity - used;

        return (
          <HWSetStatus
            key={hwName}
            label={hwName}
            available={available}
            capacity={capacity}
          />
        );
      })}

      {/* Divider */}
      <hr style={{ margin: "1rem 0" }} />

      {/* Check in/out section */}
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
          disabled={isJoining}
          onClick={handleJoin}
          sx={{ backgroundColor: "#3182ce", "&:hover": { backgroundColor: "#2b6cb0" } }}
        >
          {isJoining ? "Joining..." : "JOIN"}
        </Button>
      </div>

      {message && (
        <div
          style={{
            marginTop: "0.8rem",
            padding: "0.6rem",
            borderRadius: "4px",
            background: message.includes("✅") ? "#c6f6d5" : "#fed7d7",
            color: message.includes("✅") ? "#22543d" : "#742a2a",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default ProjectCard;
