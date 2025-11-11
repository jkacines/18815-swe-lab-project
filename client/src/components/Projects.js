import React from "react";
import ProjectCard from "./ProjectCard";

function Projects({ nameQuery, projects = [], username, onUserJoined, showMyProjects }) {
  //const filtered = projects.filter((p) => {
    // const matchesName = (p.projectName)
    //   .toLowerCase()
    //   .includes(nameQuery.toLowerCase());

   // const matchesName = (p.projectName).toLowerCase() == nameQuery.toLowerCase();

    // const isUserInProject = showMyProjects
    //   ? p.users?.some(
    //       (u) =>
    //         (typeof u === "object" ? u.username : u) ===
    //         (typeof username === "object" ? username.username : username)
    //     )
    //   : true;
    
    //   const isUserAuthorized = isUserInProject || (nameQuery.trim() !== "" && matchesName);

   // return matchesName;

  //});
   const filtered = projects.filter((p) => {
     const matchesName =
        nameQuery.trim() !== "" &&
        p.projectName.toLowerCase().includes(nameQuery.toLowerCase());

     const isUserInProject = showMyProjects
        ? p.users?.some(
            (u) =>
               (typeof u === "object" ? u.username : u) ===
               (typeof username === "object" ? username.username : username)
          )
        : false;

       return matchesName || isUserInProject;
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
            name={proj.projectName}
            users={proj.users || []}
            hwSets={proj.hwSets}
            username={username}
            onUserJoined={onUserJoined}
          />
        ))
      ) : (
        <p style={{ color: "#718096", textAlign: "center" }}>
          No projects found
        </p>
      )}

      {/* <h3>Backend Data</h3>
      <pre>{JSON.stringify(filtered, null, 2)}</pre> */}
    </div>
  );
}

export default Projects;
