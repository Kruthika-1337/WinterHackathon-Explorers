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
   STORAGE SETUP
====================== */
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

app.use("/uploads", express.static(UPLOAD_DIR));

const upload = multer({ dest: UPLOAD_DIR });

/* ======================
   GEMINI SETUP (OPTIONAL)
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
    status: "pending", // pending → approved → completed
    progress: 0,
    latestImage: null,
  };

  contractorProjects.push(project);
  res.json({ success: true, project });
});

/* ======================
   GET CONTRACTOR PROJECTS
====================== */
app.get("/contractor/projects", (_, res) => {
  res.json(contractorProjects);
});

/* ======================
   ADMIN – VIEW PENDING PROJECTS
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

  project.status = "approved";
  res.json({ success: true });
});

/* ======================
   CONTRACTOR IMAGE UPLOAD
   🔒 BLOCKED UNTIL APPROVED
====================== */
app.post("/upload", upload.single("photo"), (req, res) => {
  try {
    const projectId = Number(req.body.projectId);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const project = contractorProjects.find(p => p.id === projectId);

    if (!project || project.status !== "approved") {
      return res.status(403).json({
        error: "Project not approved by authority yet",
      });
    }

    // ✅ FULL IMAGE URL (FIX)
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const image = {
      id: projectImages.length + 1,
      projectId,
      imageUrl,
      timestamp: new Date().toISOString(),
    };

    projectImages.push(image);

    project.latestImage = imageUrl;
    project.progress = Math.min(project.progress + 20, 100);

    if (project.progress === 100) {
      project.status = "completed";
    }

    res.json({ success: true, image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ======================
   GET PROJECT IMAGES
====================== */
app.get("/contractor/project/:id/images", (req, res) => {
  const projectId = Number(req.params.id);
  res.json(projectImages.filter(i => i.projectId === projectId));
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
Return ONLY valid JSON:
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
  } catch (err) {
    console.error("Gemini Error:", err);
    return null;
  }
}

/* ======================
   CITIZEN VIEW PROJECTS
====================== */
app.get("/citizen/projects", (_, res) => {
  const data = contractorProjects.map(p => {
    const lastImage = projectImages
      .filter(i => i.projectId === p.id)
      .at(-1);

    return {
      ...p,
      latestImage: lastImage?.imageUrl || null,
    };
  });

  res.json(data);
});

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

    // ✅ FULL IMAGE URL (FIX)
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
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
