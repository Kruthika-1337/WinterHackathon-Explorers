import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProject() {
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Project Details:", {
      description,
      startDate,
      endDate,
    });

    // Send to backend
    try {
      await fetch("http://localhost:5000/contractor/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, startDate, endDate }),
      });

      alert("Project saved successfully!");

      // Redirect to dashboard after save
      navigate("/contractor/dashboard");

    } catch (error) {
      console.error("Error adding project:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Add New Project</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Project Description"
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

        <button type="submit">Save Project</button>
      </form>
    </div>
  );
}

export default AddProject;