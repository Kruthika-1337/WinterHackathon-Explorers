import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function UploadProgress() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 📍 Capture location
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoadingLocation(false);
      },
      () => {
        alert("Location permission denied");
        setLoadingLocation(false);
      }
    );
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (photos.length === 0) {
      alert("Please select images");
      return;
    }

    if (!location) {
      alert("Please capture location first");
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

        await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });
      }

      setMessage("✅ All images uploaded successfully");

      // ✅ AUTO REDIRECT
      setTimeout(() => {
        navigate("/contractor/dashboard");
      }, 1000);

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

      <button onClick={getLocation} disabled={loadingLocation}>
        {loadingLocation ? "📍 Capturing location..." : "📍 Capture Location"}
      </button>

      {location && (
        <p style={{ color: "green" }}>
          ✔ Location locked<br />
          Lat: {location.lat}<br />
          Lng: {location.lng}
        </p>
      )}

      <br />

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setPhotos([...e.target.files])}
        />
        <br /><br />

        <button type="submit" disabled={!location || uploading}>
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
      </form>

      <br />
      <p>{message}</p>
    </div>
  );
}

export default UploadProgress;