import React, { useState, useEffect } from "react";
import axios from "axios";
import Projects from "../components/Projects";
import ProjectFilters from "../components/ProjectFilters";
import ProjectCreate from "../components/ProjectCreate";
import HWCreate from "../components/HWCreate";
import Hardware from "../components/Hardware";
import PageHeader from "../components/PageHeader";
import { ButtonGroup, Button } from "@mui/material";

const MyUserPortal = ({ response, onLogout }) => {
  // Current user view (projects or hardware)
  const [activeView, setActiveView] = useState("projects");
  const [showMyProjects, setShowMyProjects] = useState(false);

  // Project filter
  const [nameQuery, setNameQuery] = useState("");

  // Current data sets
  const [projects, setProjects] = useState([]);
  const [hardware, setHardware] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:8001/projects");
      if (res.data.success) setProjects(res.data.projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchHardware = async () => {
    try {
      const res = await axios.get("http://localhost:8001/hardware");
      if (res.data.success) setHardware(res.data.hardware);
    } catch (err) {
      console.error("Error fetching hardware:", err);
    }
  };

  const handleProjectUpdated = async () => {
    await fetchProjects();   // refresh project list
    await fetchHardware();   // refresh hardware list
  };


  useEffect(() => {
    fetchProjects();
    fetchHardware();
  }, []);


  return (
    <div style={{ padding: "2rem" }}>
      {/* ======= HEADER ======= */}
      <PageHeader
        title="Hardware Checkout System"
        user={response.user}
        onLogout={onLogout}
      />

      {/* ======= MAIN CONTENT ======= */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem" }}>
        {/* LEFT COLUMN */}
        <div
          style={{
            flexShrink: 0,
            flexBasis: "380px",  // fixed baseline width
            maxWidth: "400px",   // optional for responsiveness
            minWidth: "360px",   // keeps consistent width
          }}
        >
          {/* Toggle between Projects / Hardware */}
          <ButtonGroup
            variant="outlined"
            color="primary"
            sx={{ mb: 2, width: "100%" }}
          >
            <Button
              onClick={() => setActiveView("projects")}
              variant={activeView === "projects" ? "contained" : "outlined"}
              sx={{ flex: 1 }}
            >
              Projects
            </Button>
            <Button
              onClick={() => setActiveView("hardware")}
              variant={activeView === "hardware" ? "contained" : "outlined"}
              sx={{ flex: 1 }}
            >
              Hardware
            </Button>
          </ButtonGroup>

          {/* Conditional sidebar */}
          {activeView === "projects" ? (
            <>
              <ProjectFilters
                nameQuery={nameQuery}
                setNameQuery={setNameQuery}
                showMyProjects={showMyProjects}
                setShowMyProjects={setShowMyProjects}
              />
              <ProjectCreate hardware={hardware} onProjectUpdated={handleProjectUpdated} />
            </>
          ) : (
            <HWCreate onHardwareUpdated={fetchHardware} />
          )}

          {/* <h3>Backend Data</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre> */}
        </div>

        {/* RIGHT COLUMN */}
        <div
          style={{
            flex: 1.4,
            borderLeft: "1px solid #e2e8f0",
            paddingLeft: "2rem",
          }}
        >
          {activeView === "projects" ? (
            <Projects
              nameQuery={nameQuery}
              projects={projects}
              username={response.user}
              onUserJoined={fetchProjects}
              showMyProjects={showMyProjects}
            />
          ) : (
            <Hardware hardware={hardware} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyUserPortal;
