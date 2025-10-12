import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

function HWSetStatus({ label, available, capacity }) {
  const percent = (available / capacity) * 100;

  function HWSetStatus({ label, usage, progress }) {
    return (
      <div style={{ marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>{label}</strong>
          <span>{usage}</span>
        </div>
        <div
          style={{
            background: "#eee",
            height: "6px",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: progress < 30 ? "#e53e3e" : "#38a169",
            }}
          ></div>
        </div>
      </div>
    );
  }

}

export default HWSetStatus;
