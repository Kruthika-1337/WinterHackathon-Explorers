// EditProject.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/contractor/projects`)
      .then(res => res.json())
      .then(data => {
        const project = data.find(p => p.id === Number(id));
        if (project) {
          setDescription(project.description);
          setStartDate(project.startDate);
          setEndDate(project.endDate);
        }
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:5000/contractor/project/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, startDate, endDate }),
    });

    navigate("/contractor/dashboard");
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Edit Project</h2>

      <form onSubmit={handleUpdate}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /><br /><br />

        <label>Start Date</label><br />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        /><br /><br />

        <label>End Date</label><br />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        /><br /><br />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProject;
