import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CitizenDashboard() {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Fetch projects by address
  const fetchProjects = async () => {
    if (!address) {
      alert("Please select an address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/citizen/projects?address=${encodeURIComponent(
          address
        )}`
      );

      const data = await res.json();
      setProjects(data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      alert("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Citizen Dashboard</h2>
      <p>Select your area to view development works</p>

      {/* 📍 Address Selector */}
      <select
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ padding: "8px", width: "250px" }}
      >
        <option value="">-- Select Address --</option>
        <option value="Main Street">Main Street</option>
        <option value="XYZ Colony">XYZ Colony</option>
        <option value="Green Park">Green Park</option>
        <option value="Sector 9">Sector 9</option>
      </select>

      <br /><br />

      <button onClick={fetchProjects}>
        {loading ? "Loading..." : "View Projects"}
      </button>

      <br /><br />

      {/* 📋 Project List */}
      {projects.length === 0 && !loading ? (
        <p>No projects found for this area.</p>
      ) : (
        projects.map((project) => (
          <div
            key={project.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
              background: "#fff",
            }}
          >
            <h3>{project.description}</h3>

            <p>📍 Location: {project.address}</p>
            <p>
              🗓 {project.startDate} → {project.endDate}
            </p>

            <p>
              📊 Status:{" "}
              <strong>{project.status || "In Progress"}</strong>
            </p>

            <button
              onClick={() =>
                navigate(`/citizen/project/${project.id}`)
              }
            >
              View Project
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default CitizenDashboard;
