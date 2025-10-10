import React, { useState } from "react";
import ProjectCard from "./ProjectCard";

function Projects() {
  const [joined, setJoined] = useState([false, true, false]);

  const handleJoinToggle = (index) => {
    const updated = [...joined];
    updated[index] = !updated[index];
    setJoined(updated);
  };

  const projects = [
    { name: "Project Name 1", users: ["Alice", "Bob", "Charlie"] },
    { name: "Project Name 2", users: ["Eve", "Mallory"] },
    { name: "Project Name 3", users: [] },
  ];


  return (
    <div className="projects-container">
      {projects.map((proj, i) => (
        <ProjectCard
          key={i}
          name={proj.name}
          users={proj.users}
          joined={joined[i]}
          onToggle={() => handleJoinToggle(i)}
        />
      ))}
    </div>
  );
}

export default Projects;
