import React from "react";
import { Button } from "@mui/material";
import HWSetStatus from "./HWSetStatus";
import QtyInput from "./QtyInput";
import "./ProjectCard.css";

import UserList from "./UserList";

function ProjectCard({ name, users, joined, onToggle }) {
  const bgColor = joined ? "#e6f4ea" : "white";

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "12px 16px",
        borderRadius: "8px",
        backgroundColor: bgColor,
        minWidth: "300px",
        maxWidth: "100%",
      }}
    >
      <h3 class="project-title">{name}</h3>

      {/* ✅ New MUI UserList component */}
      <UserList users={users} />

      <HWSetStatus label="HWSet1" used={50} capacity={100} />
      <HWSetStatus label="HWSet2" used={0} capacity={100} />

      <QtyInput />

      <Button
        variant={joined ? "contained" : "outlined"}
        color={joined ? "error" : "primary"}
        onClick={onToggle}
        fullWidth
        sx={{ mt: 1 }}     // ↓ smaller top margin
      >
        {joined ? "Leave" : "Join"}
      </Button>

    </div>
  );
}


export default ProjectCard;
