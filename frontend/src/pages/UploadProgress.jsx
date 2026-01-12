// UploadProgress.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function UploadProgress() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (photos.length === 0) {
      alert("Please select one or more photos");
      return;
    }

    setUploading(true);

    try {
      for (let photo of photos) {
        const formData = new FormData();
        formData.append("photo", photo);
        formData.append("projectId", projectId);
        formData.append("contractorName", "Contractor"); // replace later when login works

        await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });
      }

      navigate("/contractor/dashboard");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Upload Work Progress</h2>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setPhotos([...e.target.files])}
        />

        <br /><br />

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

export default UploadProgress;
