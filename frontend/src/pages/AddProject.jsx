import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProject() {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !startDate || !endDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/contractor/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          startDate,
          endDate,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Project added successfully ✅");
        navigate("/contractor/dashboard");
      } else {
        alert("Failed to add project");
      }
    } catch (err) {
      console.error("Add project error:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "500px" }}>
      <h2>Add New Project</h2>

      <form onSubmit={handleSubmit}>
        <label>Project Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{ width: "100%", marginBottom: "15px" }}
        />

        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ width: "100%", marginBottom: "15px" }}
        />

        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ width: "100%", marginBottom: "20px" }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Project"}
        </button>
      </form>
    </div>
  );
}

export default AddProject;
