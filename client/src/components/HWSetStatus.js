import React from "react";

function HWSetStatus({ label, available, capacity }) {
  const percent = (available / capacity) * 100;

  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>{label}</strong>
        <span>{available}/{capacity}</span>
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
            width: `${percent}%`,
            height: "100%",
            background: percent < 30 ? "#e53e3e" : "#38a169",
          }}
        ></div>
      </div>
    </div>
  );
}

export default HWSetStatus;
