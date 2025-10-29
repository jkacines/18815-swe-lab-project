import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Checkbox } from "@mui/material";
import HWSetStatus from "./HWSetStatus";
import UserBanner from "./UserBanner";

function ProjectCard({ name, users = [], hwSets = {}, username, onUserJoined }) {
  const [qty, setQty] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedHW, setSelectedHW] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isMember = users.some(
    (u) =>
      (typeof u === "object" ? u.username : u) ===
      (typeof username === "object" ? username.username : username)
  );

  // --- JOIN PROJECT ---
  const handleJoin = async () => {
    const uname = typeof username === "object" ? username.username : username;

    if (!uname) {
      setMessage("❌ Missing username — please log in again.");
      return;
    }

    setIsJoining(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8001/projects/addUser", {
        projectName: name,
        username: uname,
      });

      if (res.data.success) {
        setMessage("✅ Joined project successfully");
        if (onUserJoined) onUserJoined();
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

  // --- CHECK IN / OUT ---
  const handleHardwareAction = async (action) => {
    if (!selectedHW) {
      setMessage("❌ Please select a hardware set first.");
      return;
    }
    if (!qty || qty <= 0) {
      setMessage("❌ Enter a valid quantity.");
      return;
    }

    setIsProcessing(true);
    setMessage("");

    const uname =
      typeof username === "object" ? username.username : username;

    // Define endpoint inside function scope
    const endpoint =
      action === "checkin"
        ? "http://localhost:8001/projects/checkin"
        : "http://localhost:8001/projects/checkout";

    try {
      // Send username along with project info
      const res = await axios.post(endpoint, {
        username: uname,
        projectName: name,
        hwName: selectedHW,
        qty: Number(qty),
      });

      if (res.data.success) {
        // Use processedQty returned by backend (fall back to requested qty)
        const processed = res.data.processedQty ?? Number(qty);
        setMessage(
          `✅ User "${uname}" successfully ${
            action === "checkin" ? "checked in" : "checked out"
          } ${processed} of ${selectedHW}`
        );
        if (onUserJoined) onUserJoined();
        setQty("");
      } else {
        setMessage(`❌ ${res.data.message || "Action failed"}`);
      }
    } catch (err) {
      console.error(`Error during ${action}:`, err);
      setMessage(`❌ Failed to ${action} hardware.`);
    } finally {
      setIsProcessing(false);
    }
  };


  const handleSelectHW = (hwName) => {
    setSelectedHW((prev) => (prev === hwName ? null : hwName));
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "1.5rem",
        backgroundColor: isMember ? "#f0fff4" : "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <h3 style={{ margin: 0 }}>{name}</h3>
        {!isMember && (
          <Button
            variant="contained"
            size="small"
            disabled={isJoining}
            onClick={handleJoin}
            sx={{
              backgroundColor: "#3182ce",
              "&:hover": { backgroundColor: "#2b6cb0" },
            }}
          >
            {isJoining ? "Joining..." : "JOIN"}
          </Button>
        )}
      </div>

      {/* Authorized users */}
      <div style={{ marginBottom: "1rem" }}>
        <strong>Authorized Users:</strong>
        <div
          style={{
            marginTop: "0.5rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
          }}
        >
          {users.length > 0 ? (
            users.map((u, i) => (
              <UserBanner
                key={i}
                username={typeof u === "object" ? u.username : u}
                color={isMember ? "success" : "primary"}
              />
            ))
          ) : (
            <span style={{ color: "#718096" }}>No users yet</span>
          )}
        </div>
      </div>

      {/* Compact HW sets list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {Object.entries(hwSets).map(([hwName, hwData]) => {
          const used = hwData.used ?? 0;
          const capacity = hwData.capacity ?? 0;
          const available = capacity - used;
          const isSelected = selectedHW === hwName;

          return (
            <div
              key={hwName}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.4rem",
              }}
            >
              {/* Checkbox on the left — owned by ProjectCard */}
              <Checkbox
                checked={isSelected}
                onChange={() => handleSelectHW(hwName)}
                color="primary"
                size="small"
                sx={{
                  padding: "0.25rem",
                  "& .MuiSvgIcon-root": { fontSize: "1rem" },
                }}
              />

              {/* HWSetStatus unchanged — just displays label + progress */}
              <div style={{ flex: 1 }}>
                <HWSetStatus
                  label={hwName}
                  available={available}
                  capacity={capacity}
                />
              </div>
            </div>
          );
        })}
      </div>

      <hr style={{ margin: "1rem 0" }} />

      {/* Check in/out buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TextField
          label="Enter qty"
          size="small"
          variant="outlined"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          sx={{ flex: 1 }}
        />
        <Button
          variant="outlined"
          size="small"
          disabled={!isMember || isProcessing}
          onClick={() => handleHardwareAction("checkin")}
        >
          CHECK IN
        </Button>
        <Button
          variant="outlined"
          size="small"
          disabled={!isMember || isProcessing}
          onClick={() => handleHardwareAction("checkout")}
        >
          CHECK OUT
        </Button>
      </div>

      {/* Message */}
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
