import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function EditProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Load existing project data
  useEffect(() => {
    fetch("http://localhost:5000/contractor/projects")
      .then(res => res.json())
      .then(projects => {
        const project = projects.find(p => p.id == projectId);
        if (!project) {
          alert("Project not found");
          navigate("/contractor/dashboard", { replace: true });
          return;
        }

        setDescription(project.description);
        setStartDate(project.startDate);
        setEndDate(project.endDate);
        setLoading(false);
      });
  }, [projectId, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    await fetch(
      `http://localhost:5000/contractor/project/${projectId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          startDate,
          endDate,
        }),
      }
    );

    alert("✅ Project updated");
    navigate("/contractor/dashboard");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>Edit Project</h2>

      <form onSubmit={handleUpdate}>
        <label>Project Description</label><br />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br /><br />

        <label>Start Date</label><br />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <br /><br />

        <label>End Date</label><br />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Update Project</button>
        <button
          type="button"
          style={{ marginLeft: "10px" }}
          onClick={() => navigate("/contractor/dashboard")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditProject;