import { useState } from "react";

function CitizenFeedback({ projectId }) {
  const [text, setText] = useState("");
  const [type, setType] = useState("feedback");
  const [message, setMessage] = useState("");

  const submitFeedback = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/citizen/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        type,
        text,
      }),
    });

    setMessage("✅ Submitted successfully");
    setText("");
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Feedback / Complaint</h3>

      <form onSubmit={submitFeedback}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="feedback">Feedback</option>
          <option value="complaint">Complaint</option>
        </select>

        <br /><br />

        <textarea
          required
          placeholder="Write here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "300px", height: "80px" }}
        />

        <br /><br />

        <button type="submit">Submit</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default CitizenFeedback;
