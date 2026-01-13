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
      <h1 style={styles.title}>🏛 Authority Dashboard</h1>
      <p style={styles.subtitle}>Pending Project Verifications</p>

      {loading && <p>Loading projects...</p>}

      {!loading && projects.length === 0 && (
        <div style={styles.empty}>🎉 No pending projects</div>
      )}

      <div style={styles.grid}>
        {projects.map((p) => (
          <div key={p.id} style={styles.card}>
            {/* HEADER */}
            <div style={styles.cardHeader}>
              <span style={styles.projectId}>Project #{p.id}</span>
              <span style={styles.badge}>PENDING</span>
            </div>

            {/* PROJECT DETAILS */}
            <p style={styles.description}>{p.description}</p>

            <hr style={{ margin: "10px 0" }} />

            <p style={styles.info}>
              🏢 <strong>Company:</strong> {p.companyName}
            </p>
            <p style={styles.info}>
              👷 <strong>Contractor:</strong> {p.contractorName}
            </p>
            <p style={styles.info}>
              📞 <strong>Phone:</strong> {p.contractorPhone}
            </p>
            <p style={styles.info}>
              📍 <strong>Construction Location:</strong> {p.location}
            </p>
            <p style={styles.info}>
              💰 <strong>Estimated Budget:</strong> ₹{p.budget}
            </p>

            <p style={styles.date}>
              📅 {p.startDate} → {p.endDate}
            </p>

            {/* ACTION */}
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
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    padding: "22px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  projectId: {
    fontWeight: "bold",
    fontSize: "14px",
  },
  badge: {
    background: "#ff9800",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
  },
  description: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  info: {
    fontSize: "14px",
    marginBottom: "6px",
  },
  date: {
    fontSize: "14px",
    color: "#666",
    marginTop: "10px",
    marginBottom: "15px",
  },
  approveBtn: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#2e7d32",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
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
