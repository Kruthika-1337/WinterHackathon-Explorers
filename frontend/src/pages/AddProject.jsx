import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProject.css";

function AddProject() {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      alert("✅ Project submitted for authority approval");
      navigate("/contractor/dashboard");
    } catch (error) {
      alert("❌ Something went wrong");
    }
  };

  return (
    <div className="add-project-page">
      <div className="add-project-card">
        <h2>Add New Project</h2>
        <p className="subtitle">
          Fill in project details. Uploads allowed only after authority approval.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Description</label>
            <textarea
              placeholder="Eg: Road widening near City Circle"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            🚀 Submit Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProject;
