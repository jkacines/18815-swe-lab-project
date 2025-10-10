import React, { useState } from "react";
import ProjectCard from "./ProjectCard";

function Projects({ nameQuery, userQuery, minQty, maxQty }) {
  const [joined, setJoined] = useState([false, true, false]);

  const handleJoinToggle = (index) => {
    const updated = [...joined];
    updated[index] = !updated[index];
    setJoined(updated);
  };

  // Example data
  const projects = [
    {
      name: "Project Name 1",
      users: ["Alice", "Bob"],
      hwset1: { used: 50, capacity: 100 },
      hwset2: { used: 0, capacity: 100 },
    },
    {
      name: "Sensor Node Project",
      users: ["Charlie", "Dana"],
      hwset1: { used: 80, capacity: 100 },
      hwset2: { used: 10, capacity: 100 },
    },
    {
      name: "AI Hardware Tester",
      users: ["Eve"],
      hwset1: { used: 100, capacity: 100 },
      hwset2: { used: 90, capacity: 100 },
    },
  ];

    const filtered = projects.filter((p) => {
    const totalRemaining =
      (p.hwset1?.capacity - p.hwset1?.used || 0) +
      (p.hwset2?.capacity - p.hwset2?.used || 0);

    const projectName = p.name?.toLowerCase() || "";
    const searchName = nameQuery?.toLowerCase() || "";
    const searchUser = userQuery?.toLowerCase() || "";

    const matchesName = projectName.includes(searchName);
    const matchesUser = Array.isArray(p.users)
      ? p.users.some((u) => (u?.toLowerCase() || "").includes(searchUser))
      : false;

    const matchesQty =
      (!minQty || totalRemaining >= Number(minQty)) &&
      (!maxQty || totalRemaining <= Number(maxQty));

    return matchesName && matchesUser && matchesQty;
  });


  return (
    <div className="projects-container">
      {filtered.length > 0 ? (
        filtered.map((proj, i) => (
          <ProjectCard
            key={i}
            name={proj.name}
            users={proj.users}
            joined={joined[i]}
            onToggle={() => handleJoinToggle(i)}
          />
        ))
      ) : (
        <p>No matching projects found.</p>
      )}
    </div>
  );
}

export default Projects;
