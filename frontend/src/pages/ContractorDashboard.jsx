import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ContractorDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:5000/contractor/projects");
      const data = await res.json();
      setProjects(data);

      const s = {};
      for (let p of data) {
        const r = await fetch(
          `http://localhost:5000/contractor/project/${p.id}/images`
        );
        const imgs = await r.json();
        s[p.id] = {
          total: imgs.length,
          lastUpdated:
            imgs.length > 0
              ? new Date(imgs[imgs.length - 1].timestamp).toLocaleString()
              : "No uploads yet",
        };
      }
      setStats(s);
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete project?")) return;
    await fetch(`http://localhost:5000/contractor/project/${id}`, {
      method: "DELETE",
    });
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Contractor Dashboard</h2>

      <button onClick={() => navigate("/contractor/add-project")}>
        Add New Project
      </button>

      <br /><br />

      {projects.map(p => (
        <div key={p.id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "15px" }}>
          <strong>{p.description}</strong><br />
          🗓 {p.startDate} → {p.endDate}

          <p>
            📸 Uploads: {stats[p.id]?.total || 0}<br />
            ⏱ Last update: {stats[p.id]?.lastUpdated || "—"}
          </p>

          <button onClick={() => navigate(`/contractor/project/${p.id}/upload`)}>
            Upload Progress
          </button>
          <button onClick={() => navigate(`/contractor/project/${p.id}/images`)}>
            View Images
          </button>
          <button onClick={() => navigate(`/contractor/project/${p.id}/edit`)}>
            Edit
          </button>
          <button onClick={() => handleDelete(p.id)} style={{ color: "red" }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default ContractorDashboard;