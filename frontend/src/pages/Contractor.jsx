import { useState } from "react";

function Contractor() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Work proof uploaded successfully!");
      } else {
        setMessage("❌ Upload failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Backend error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Contractor Dashboard</h2>

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