import { useState } from "react";

function CitizenFeedback({ projectId, onClose }) {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("feedback");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !message) {
      alert("Please enter username and message");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("message", message);
      formData.append("type", type);

      if (photo) {
        formData.append("photo", photo);
      }

      const res = await fetch(
        `http://localhost:5000/citizen/project/${projectId}/feedback`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        setSuccess("✅ Feedback submitted successfully");
        setMessage("");
        setPhoto(null);
      } else {
        alert("Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
        marginTop: "20px",
        background: "#f9f9f9",
      }}
    >
      <h3>Feedback / Complaint</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <option value="feedback">Feedback</option>
          <option value="complaint">Complaint</option>
        </select>

        <textarea
          placeholder="Write your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{ marginLeft: "10px" }}
          >
            Close
          </button>
        )}
      </form>

      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default CitizenFeedback;
