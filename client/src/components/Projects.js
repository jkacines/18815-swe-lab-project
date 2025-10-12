import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectCard from "./ProjectCard";

function Projects({ nameQuery }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch projects from backend when component loads
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:8001/projects");
        if (response.data.success) {
          setProjects(response.data.projects || []);
        } else {
          setError("Failed to load projects.");
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Error fetching projects.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
            joined={false}
            onToggle={() => {}}
            hwSets={proj.hwSets}
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
