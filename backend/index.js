const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

/* ======================
   FILE STORAGE
====================== */
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
app.use("/uploads", express.static(UPLOAD_DIR));

const upload = multer({ dest: UPLOAD_DIR });

/* ======================
   GEMINI SETUP
====================== */
let model = null;
if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
}

/* ======================
   IN-MEMORY DATABASES
====================== */
let contractorProjects = [];
let projectImages = [];
let complaints = [];

/* ======================
   HEALTH CHECK
====================== */
app.get("/", (_, res) => {
  res.send("🚀 Backend running correctly");
});

/* ======================
   CREATE PROJECT (CONTRACTOR)
====================== */
app.post("/contractor/project", (req, res) => {
  const project = {
    id: contractorProjects.length + 1,
    ...req.body,
    status: "pending",      // 🔴 IMPORTANT
    progress: 0,
    latestImage: null,
  };

  contractorProjects.push(project);
  res.json({ success: true, project });
});

/* ======================
   CONTRACTOR PROJECTS
====================== */
app.get("/contractor/projects", (_, res) => {
  res.json(contractorProjects);
});

/* ======================
   ADMIN – VIEW PENDING
====================== */
app.get("/admin/projects", (_, res) => {
  res.json(contractorProjects.filter(p => p.status === "pending"));
});

/* ======================
   ADMIN – APPROVE PROJECT
====================== */
app.put("/admin/project/:id/approve", (req, res) => {
  const project = contractorProjects.find(
    p => p.id === Number(req.params.id)
  );

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  project.status = "approved"; // ✅ AUTHORITY APPROVAL
  res.json({ success: true });
});

/* ======================
   CONTRACTOR IMAGE UPLOAD
   🔐 AUTHORITY CHECK
====================== */
app.post("/upload", upload.single("photo"), (req, res) => {
  const projectId = Number(req.body.projectId);

  if (!projectId || !req.file) {
    return res.status(400).json({ error: "Invalid upload" });
  }

  const project = contractorProjects.find(p => p.id === projectId);

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  // 🔴 BLOCK UPLOAD BEFORE APPROVAL
  if (project.status !== "approved") {
    return res.status(403).json({
      error: "Project not approved by authority yet"
    });
  }

  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  const image = {
    id: projectImages.length + 1,
    projectId,
    imageUrl,
    latitude: req.body.latitude || null,
    longitude: req.body.longitude || null,
    timestamp: new Date().toISOString(),
  };

  projectImages.push(image);

  project.latestImage = imageUrl;
  project.progress = Math.min(project.progress + 20, 100);

  if (project.progress === 100) {
    project.status = "completed";
  }

  res.json({ success: true, image });
});

/* ======================
   PROJECT IMAGES (CONTRACTOR)
====================== */
app.get("/contractor/project/:id/images", (req, res) => {
  const projectId = Number(req.params.id);
  res.json(projectImages.filter(i => i.projectId === projectId));
});

/* ======================
   CITIZEN PROJECT VIEW
====================== */
app.get("/citizen/projects", (_, res) => {
  const data = contractorProjects.map(p => {
    const contractorImage = projectImages
      .filter(i => i.projectId === p.id)
      .at(-1);

    const complaintImage = complaints
      .filter(c => c.projectId === p.id && c.imageUrl)
      .at(-1);

    return {
      ...p,
      latestImage:
        contractorImage?.imageUrl ||
        complaintImage?.imageUrl ||
        null,
    };
  });

  res.json(data);
});

/* ======================
   GEMINI IMAGE ANALYSIS
====================== */
async function analyzeImage(imagePath) {
  if (!model) return null;

  try {
    const img = fs.readFileSync(imagePath, "base64");

    const result = await model.generateContent([
      `
Return ONLY JSON:
{
  "hasPothole": true | false,
  "severity": "low" | "medium" | "high",
  "confidence": 0-100,
  "message": "short explanation"
}
      `,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: img,
        },
      },
    ]);

    return JSON.parse(result.response.text());
  } catch {
    return null;
  }
}

/* ======================
   CITIZEN COMPLAINT
====================== */
app.post(
  "/citizen/project/:id/feedback",
  upload.single("photo"),
  async (req, res) => {
    const projectId = Number(req.params.id);
    const { message, username, type } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const imageUrl = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : null;

    const aiAnalysis = req.file
      ? await analyzeImage(req.file.path)
      : null;

    const complaint = {
      id: complaints.length + 1,
      projectId,
      username: username || "Citizen",
      type: type || "complaint",
      message,
      imageUrl,
      aiAnalysis,
      timestamp: new Date().toISOString(),
    };

    complaints.push(complaint);
    res.json({ success: true, complaint });
  }
);

/* ======================
   CONTRACTOR VIEW COMPLAINTS
====================== */
app.get("/contractor/project/:id/complaints", (req, res) => {
  const projectId = Number(req.params.id);
  res.json(complaints.filter(c => c.projectId === projectId));
});

/* ======================
   START SERVER
====================== */
app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
