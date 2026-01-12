import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function UploadProgress() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState(null);
  const [uploading, setUploading] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Location permission denied")
    );
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("Capture location first");
      return;
    }

    if (photos.length === 0) {
      alert("Select images");
      return;
    }

    setUploading(true);

    try {
      for (let photo of photos) {
        const formData = new FormData();
        formData.append("photo", photo);
        formData.append("projectId", projectId);
        formData.append("latitude", location.lat);
        formData.append("longitude", location.lng);
        formData.append("timestamp", new Date().toISOString());

        const res = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(`❌ ${data.error}`);
          setUploading(false);
          return;
        }
      }

      setMessage("✅ Upload successful");
      setTimeout(() => navigate("/contractor/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Upload Progress</h2>
      <p>Project ID: {projectId}</p>

      <button onClick={getLocation}>📍 Capture Location</button>

      {location && (
        <p style={{ color: "green" }}>
          Location locked ✔
        </p>
      )}

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setPhotos([...e.target.files])}
        />
        <br /><br />

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default UploadProgress;
