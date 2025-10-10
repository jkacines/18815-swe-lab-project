import React from "react";
import ProjectCard from "./ProjectCard";
// import "./Projects.css";

function Projects({ nameQuery, userQuery, minQty, maxQty }) {
  // (your existing filtering logic stays the same)

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
    const hw1Used = Number(p.hwset1?.used) || 0;
    const hw1Cap = Number(p.hwset1?.capacity) || 0;
    const hw2Used = Number(p.hwset2?.used) || 0;
    const hw2Cap = Number(p.hwset2?.capacity) || 0;

    // total available hardware remaining (both sets combined)
    const totalRemaining = (hw1Cap - hw1Used) + (hw2Cap - hw2Used);

    const name = p.name?.toLowerCase() || "";
    const users = p.users?.map((u) => u.toLowerCase()) || [];

    const matchesName = name.includes(nameQuery.toLowerCase());
    const matchesUser = users.some((u) =>
      u.includes(userQuery.toLowerCase())
    );

    const min = Number(minQty);
    const max = Number(maxQty);

    const matchesQty =
      (!minQty || totalRemaining >= min) &&
      (!maxQty || totalRemaining <= max);

    return matchesName && matchesUser && matchesQty;
  });

  return (
    <div
      className="projects-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {filtered.length > 0 ? (
        filtered.map((proj, i) => (
          <ProjectCard
            key={i}
            name={proj.name}
            users={proj.users}
            joined={false}
            onToggle={() => {}}
          />
        ))
      ) : (
        <p>No matching projects found.</p>
      )}
    </div>
  );
}

export default Projects;
