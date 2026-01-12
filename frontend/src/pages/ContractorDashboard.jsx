import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ContractorDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/contractor/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this permanently?")) return;
    await fetch(`http://localhost:5000/contractor/project/${id}`, { method: "DELETE" });
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Contractor Dashboard 👷</h2>

      <button onClick={() => navigate("/contractor/add-project")}>
        ➕ Add Project
      </button>

      <h3 style={{ marginTop: "20px" }}>Your Projects</h3>

      {projects.length === 0 ? <p>No projects yet.</p> : null}

      {projects.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 15 }}>
          <strong>{p.description}</strong><br/>
          🗓 {p.startDate} → {p.endDate}
          <br /><br />
          <button onClick={() => navigate(`/contractor/project/${p.id}/upload`)}>📸 Upload</button>
          <button onClick={() => navigate(`/contractor/project/${p.id}/images`)}
            style={{ marginLeft: 10 }}>🖼 View Images</button>
          <button onClick={() => navigate(`/contractor/project/${p.id}/edit`)}
            style={{ marginLeft: 10 }}>✏ Edit</button>
          <button onClick={() => navigate(`/contractor/project/${p.id}/feedback`)}
            style={{ marginLeft: 10 }}>📢 Feedback</button>
          <button onClick={() => deleteProject(p.id)}
            style={{ marginLeft: 10, color: "red" }}>🗑 Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ContractorDashboard;
