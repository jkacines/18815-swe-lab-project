import React from "react";
import ProjectCard from "./ProjectCard";

function Projects({ nameQuery, projects = [], onUserJoined }) {
  // 🔍 Filter projects by name only
  const filtered = projects.filter((p) =>
    (p.projectName || "").toLowerCase().includes(nameQuery.toLowerCase())
  );

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
            name={proj.projectName}
            users={proj.users || []}
            hwSets={proj.hwSets}
            onUserJoined={onUserJoined}
          />
        ))
      ) : (
        <p>No matching projects found.</p>
      )}

      <h3>Backend Data</h3>
      <pre>{JSON.stringify(filtered, null, 2)}</pre>
    </div>
  );
}

export default Projects;
