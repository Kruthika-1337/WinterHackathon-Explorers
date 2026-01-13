import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CitizenDashboard.css";

function CitizenDashboard() {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("live");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const citizenName = user?.name || "Citizen";

  useEffect(() => {
    fetch("http://localhost:5000/citizen/projects")
      .then(res => res.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  const filtered =
    activeTab === "live"
      ? projects.filter(p => p.status !== "completed")
      : projects.filter(p => p.status === "completed");

  return (
    <div className="citizen-page">

      {/* TOP BAR */}
      <div className="top-bar">
        <h3>🏛 Government Portal</h3>
        <div className="user-box">
          🔔 <span>{citizenName}</span>
        </div>
      </div>

      {/* GREETING */}
      <div className="welcome">
        <h2>Hi {citizenName},</h2>
        <p>Track development projects around you</p>
      </div>

      {/* TABS */}
      <div className="tabs">
        <button
          className={activeTab === "live" ? "active" : ""}
          onClick={() => setActiveTab("live")}
        >
          Live Work
        </button>
        <button
          className={activeTab === "completed" ? "active" : ""}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
      </div>

      {/* PROJECTS */}
      <div className="project-list">
        {filtered.map(p => (
          <div className="project-card" key={p.id}>

            {/* HEADER */}
            <div className="project-header">
              <h3>{p.description}</h3>
              <span className={`badge ${p.status}`}>
                {p.status.toUpperCase()}
              </span>
            </div>

            {/* STAGES */}
            <div className="stages">
              {["Start", "Stage 1", "Stage 2", "Stage 3", "End"].map((s, i) => (
                <div
                  key={i}
                  className={`stage ${p.progress >= (i + 1) * 20 ? "done" : ""}`}
                >
                  {s}
                </div>
              ))}
            </div>

            {/* IMAGES */}
            <div className="image-row">
              {p.latestImage ? (
                <img src={p.latestImage} alt="progress" />
              ) : (
                <div className="no-image">No images yet</div>
              )}
            </div>

            {/* DETAILS */}
            <div className="details">
              <p><strong>Company:</strong> {p.companyName}</p>
              <p><strong>Contractor:</strong> {p.contractorName}</p>
              <p><strong>Location:</strong> {p.location}</p>
            </div>

            {/* PROGRESS */}
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${p.progress}%` }}
              />
            </div>
            <small>{p.progress}% completed</small>

            {/* ACTIONS */}
            <div className="actions">
              <button
                onClick={() =>
                  navigate(`/citizen/project/${p.id}/feedback`)
                }
              >
                💬 Comment / Complaint
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CitizenDashboard;
