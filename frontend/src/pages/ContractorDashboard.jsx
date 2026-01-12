import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ContractorDashboard.css";

function ContractorDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({}); // ✅ FIXED

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
            latestImage:
              images.length > 0 ? images[images.length - 1].imageUrl : null,
            progress: Math.min(images.length * 20, 100), // 5 uploads = 100%
          };
        }

        setStats(statsObj);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    loadData();
  }, []);

  return (
    <div className="contractor-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>👷 Contractor Dashboard</h2>
          <p>Manage your government projects</p>
        </div>

        <button
          className="add-project-btn"
          onClick={() => navigate("/contractor/add-project")}
        >
          + Add Project
        </button>
      </div>

      {/* Projects */}
      {projects.length === 0 ? (
        <p>No projects added yet.</p>
      ) : (
        <div className="project-grid">
          {projects.map((p) => (
            <div className="project-card" key={p.id}>
              <h4>{p.description}</h4>

              {stats[p.id]?.latestImage ? (
                <img
                  src={stats[p.id].latestImage}
                  alt="progress"
                  className="project-thumb"
                />
              ) : (
                <div className="no-image">No uploads yet</div>
              )}

              <p>📸 Uploads: {stats[p.id]?.total || 0}</p>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${stats[p.id]?.progress || 0}%`,
                  }}
                />
              </div>

              <small>{stats[p.id]?.progress || 0}% completed</small>

              <div className="project-actions">
                <button
                  onClick={() =>
                    navigate(`/contractor/project/${p.id}/upload`)
                  }
                >
                  Upload
                </button>

                <button
                  onClick={() =>
                    navigate(`/contractor/project/${p.id}/images`)
                  }
                >
                  View Images
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContractorDashboard;
