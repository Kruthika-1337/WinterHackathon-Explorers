import { useEffect, useState } from "react";

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  const approveProject = async (id) => {
    await fetch(`http://localhost:5000/admin/project/${id}/approve`, {
      method: "PUT",
    });
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Authority Dashboard</h1>
      <p style={styles.subtitle}>Pending Project Approvals</p>

      {loading && <p>Loading projects...</p>}

      {!loading && projects.length === 0 && (
        <div style={styles.empty}>🎉 No pending projects</div>
      )}

      <div style={styles.grid}>
        {projects.map((p) => (
          <div key={p.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.projectId}>Project #{p.id}</span>
              <span style={styles.badge}>Pending</span>
            </div>

            <p style={styles.description}>{p.description}</p>

            <p style={styles.date}>
              📅 {p.startDate} → {p.endDate}
            </p>

            <button
              style={styles.approveBtn}
              onClick={() => approveProject(p.id)}
            >
              ✅ Approve Project
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;

/* =========================
   STYLES
========================= */

const styles = {
  page: {
    padding: "40px",
    background: "#f4f6f8",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "5px",
    fontSize: "28px",
  },
  subtitle: {
    color: "#555",
    marginBottom: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  projectId: {
    fontWeight: "bold",
  },
  badge: {
    background: "#ff9800",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
  },
  description: {
    marginBottom: "10px",
    fontSize: "15px",
  },
  date: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "15px",
  },
  approveBtn: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    background: "#2e7d32",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
  },
  empty: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    color: "#666",
  },
};
