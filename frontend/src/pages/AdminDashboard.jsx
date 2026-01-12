import { useEffect, useState } from "react";

function AdminDashboard() {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    const res = await fetch("http://localhost:5000/admin/projects");
    const data = await res.json();
    setProjects(data);
  };

  const approveProject = async (id) => {
    await fetch(
      `http://localhost:5000/admin/project/${id}/approve`,
      { method: "PUT" }
    );
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Authority Dashboard</h2>

      {projects.length === 0 ? (
        <p>No pending projects</p>
      ) : (
        projects.map(p => (
          <div key={p.id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px" }}>
            <p><strong>ID:</strong> {p.id}</p>
            <p>{p.description}</p>
            <p>Status: {p.status}</p>

            <button onClick={() => approveProject(p.id)}>
              Approve
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
