import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ContractorDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({});

  const handleAddProject = () => {
    navigate("/contractor/add-project");
  };

  // 🔹 Load projects + image stats
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:5000/contractor/projects");
        const data = await res.json();
        setProjects(data);

        const statsObj = {};

        for (let p of data) {
          const imgRes = await fetch(
            `http://localhost:5000/contractor/project/${p.id}/images`
          );
          const images = await imgRes.json();

          statsObj[p.id] = {
            total: images.length,
            lastUpdated:
              images.length > 0
                ? new Date(
                    images[images.length - 1].timestamp
                  ).toLocaleString()
                : "No uploads yet",
          };
        }

        setStats(statsObj);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    loadData();
  }, []);

  // 🔥 Proper delete handler
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Delete this project permanently?")) return;

    try {
      await fetch(
        `http://localhost:5000/contractor/project/${projectId}`,
        { method: "DELETE" }
      );

      // ✅ Remove from UI instantly
      setProjects(projects.filter((p) => p.id !== projectId));

      // ✅ Remove stats
      const newStats = { ...stats };
      delete newStats[projectId];
      setStats(newStats);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Contractor Dashboard</h2>
      <p>Welcome Contractor 👷‍♂️</p>

      <button onClick={handleAddProject}>Add New Project</button>

      <br /><br />

      <h3>Your Projects</h3>

      {projects.length === 0 ? (
        <p>No projects added yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {projects.map((p) => (
            <li
              key={p.id}
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <strong>{p.description}</strong>
              <br />
              🗓 {p.startDate} → {p.endDate}

              <p style={{ marginTop: "10px" }}>
                📸 Total Uploads: {stats[p.id]?.total || 0}
                <br />
                ⏱ Last Updated: {stats[p.id]?.lastUpdated || "—"}
              </p>

              <button
                onClick={() =>
                  navigate(`/contractor/project/${p.id}/upload`)
                }
              >
                Upload Progress
              </button>

              <button
                onClick={() =>
                  navigate(`/contractor/project/${p.id}/images`)
                }
                style={{ marginLeft: "10px" }}
              >
                View Images
              </button>

              <button
                onClick={() =>
                  navigate(`/contractor/project/${p.id}/progress`)
                }
                style={{ marginLeft: "10px" }}
              >
                Weekly Progress Graph
              </button>

              <button
                onClick={() => handleDeleteProject(p.id)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Delete Project
              </button>
              <button
                onClick={() =>
                navigate(`/contractor/project/${p.id}/edit`)}
                style={{ marginLeft: "10px" }}
              >
                Edit Project
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ContractorDashboard;