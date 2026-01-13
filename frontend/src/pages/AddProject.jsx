import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProject.css";

function AddProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    description: "",
    contractorName: "",
    companyName: "",
    contractorPhone: "",
    location: "",
    budget: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/contractor/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("✅ Project sent for authority approval");
    navigate("/contractor/dashboard");
  };

  return (
    <div className="add-project-page">
      <div className="add-project-card">
        <h2>Add Government Project</h2>

        <form onSubmit={handleSubmit}>
          <input name="companyName" placeholder="Company Name" onChange={handleChange} required />
          <input name="contractorName" placeholder="Contractor Name" onChange={handleChange} required />
          <input name="contractorPhone" placeholder="Phone Number" onChange={handleChange} required />
          <input name="location" placeholder="Construction Location" onChange={handleChange} required />
          <input name="budget" placeholder="Estimated Budget (₹)" onChange={handleChange} required />

          <textarea name="description" placeholder="Project Description" onChange={handleChange} required />

          <input type="date" name="startDate" onChange={handleChange} required />
          <input type="date" name="endDate" onChange={handleChange} required />

          <button type="submit" className="submit-btn">
            Submit for Approval
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProject;
