// UploadProgress.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./UploadProgress.css";

function UploadProgress() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 📍 Get GPS location
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

  // 📤 Upload images
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("Please capture location first");
      return;
    }

    if (photos.length === 0) {
      alert("Please select at least one image");
      return;
    }

    setUploading(true);
    setMessage("");

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

      setMessage("✅ Progress uploaded successfully");
      setTimeout(() => {
        navigate("/contractor/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h2>📤 Upload Weekly Progress</h2>
        <p className="subtitle">
          Upload geo-tagged work proof images (authority approval required)
        </p>

        {/* Location */}
        <div className="location-box">
          <button type="button" onClick={getLocation}>
            📍 Capture Location
          </button>

          {location && (
            <span className="location-ok">✔ Location Locked</span>
          )}
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload}>
          <div className="file-box">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setPhotos([...e.target.files])}
            />
            <small>{photos.length} file(s) selected</small>
          </div>

          <button
            type="submit"
            className="upload-btn"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
        </form>

        {/* Message */}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default UploadProgress;
