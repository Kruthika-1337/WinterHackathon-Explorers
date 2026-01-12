import { useState } from "react";

function Contractor() {
  const [file, setFile] = useState(null);
  const [projectId, setProjectId] = useState(""); // 🔑 REQUIRED
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file || !projectId) {
      setMessage("❌ Please select project and image");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("projectId", projectId); // 🔒 SEND PROJECT ID

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`❌ ${data.error}`);
        return;
      }

      setMessage("✅ Work proof uploaded successfully!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Backend error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Contractor Dashboard</h2>

      <input
        type="number"
        placeholder="Enter Project ID"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
      />

      <br /><br />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Upload Work Proof
      </button>

      <br /><br />

      {message && <p>{message}</p>}
    </div>
  );
}

export default Contractor;
