const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const { google } = require("googleapis");

const app = express();

/* ================================
   MIDDLEWARES
================================ */
app.use(cors());
app.use(express.json());

/* ================================
   MULTER CONFIG
================================ */
const upload = multer({ dest: "uploads/" });

/* ================================
   GOOGLE DRIVE AUTH
================================ */
const oauthClientData = JSON.parse(
  fs.readFileSync("oauth-client.json")
);

const oauth2Client = new google.auth.OAuth2(
  oauthClientData.web.client_id,
  oauthClientData.web.client_secret,
  oauthClientData.web.redirect_uris[0]
);

const token = JSON.parse(fs.readFileSync("token.json"));
oauth2Client.setCredentials(token);

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

/* ================================
   IN-MEMORY DATABASE
================================ */
let contractorProjects = [];
let projectImages = [];

/* ================================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

/* ================================
   CREATE PROJECT (CONTRACTOR)
   → DEFAULT STATUS = PENDING
================================ */
app.post("/contractor/project", (req, res) => {
  const { description, startDate, endDate } = req.body;

  const newProject = {
    id: contractorProjects.length + 1,
    description,
    startDate,
    endDate,
    status: "pending", // 🔒 authority approval required
  };

  contractorProjects.push(newProject);
  res.json({ success: true, project: newProject });
});

/* ================================
   GET CONTRACTOR PROJECTS
================================ */
app.get("/contractor/projects", (req, res) => {
  res.json(contractorProjects);
});

/* ================================
   ADMIN: VIEW PENDING PROJECTS
================================ */
app.get("/admin/projects", (req, res) => {
  const pending = contractorProjects.filter(
    p => p.status === "pending"
  );
  res.json(pending);
});

/* ================================
   ADMIN: APPROVE PROJECT
================================ */
app.put("/admin/project/:id/approve", (req, res) => {
  const id = Number(req.params.id);
  const project = contractorProjects.find(p => p.id === id);

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  project.status = "approved";
  res.json({ success: true, project });
});

/* ================================
   UPLOAD IMAGE (LOCKED 🔒)
   → ONLY IF PROJECT IS APPROVED
================================ */
app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const { projectId, latitude, longitude, timestamp } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

    // 🔒 CHECK PROJECT STATUS
    const project = contractorProjects.find(
      p => p.id === Number(projectId)
    );

    if (!project || project.status !== "approved") {
      return res.status(403).json({
        error: "Project not approved by authority yet",
      });
    }

    // ⬇️ UPLOAD TO GOOGLE DRIVE
    const driveResponse = await drive.files.create({
      requestBody: { name: req.file.originalname },
      media: {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
      },
    });

    const fileId = driveResponse.data.id;

    await drive.permissions.create({
      fileId,
      requestBody: { role: "reader", type: "anyone" },
    });

    const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    fs.unlinkSync(req.file.path);

    const imageData = {
      id: projectImages.length + 1,
      projectId: Number(projectId),
      imageUrl,
      latitude,
      longitude,
      timestamp,
    };

    projectImages.push(imageData);
    res.json({ success: true, image: imageData });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   GET IMAGES BY PROJECT
================================ */
app.get("/contractor/project/:projectId/images", (req, res) => {
  const projectId = Number(req.params.projectId);
  res.json(projectImages.filter(img => img.projectId === projectId));
});

/* ================================
   DUMMY AUTH (FOR NOW)
================================ */
app.post("/citizen/login", (_, res) => res.json({ success: true }));
app.post("/citizen/signup", (_, res) => res.json({ success: true }));
app.post("/contractor/login", (_, res) => res.json({ success: true }));
app.post("/contractor/signup", (_, res) => res.json({ success: true }));

/* ================================
   START SERVER
================================ */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const { projectId, latitude, longitude } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

    /* 🔒 CHECK PROJECT */
    const project = contractorProjects.find(
      (p) => p.id === Number(projectId)
    );

    if (!project || project.status !== "approved") {
      return res.status(403).json({
        error: "Project not approved by authority yet",
      });
    }

    /* ⏳ WEEKLY UPLOAD LOCK */
    const imagesForProject = projectImages.filter(
      (img) => img.projectId === Number(projectId)
    );

    if (imagesForProject.length > 0) {
      const lastUpload = new Date(
        imagesForProject.at(-1).timestamp
      ).getTime();

      const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

      if (Date.now() - lastUpload < ONE_WEEK) {
        return res.status(403).json({
          error: "Weekly upload limit reached",
        });
      }
    }

    /* ☁️ UPLOAD TO GOOGLE DRIVE */
    const driveResponse = await drive.files.create({
      requestBody: { name: req.file.originalname },
      media: {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
      },
    });

    const fileId = driveResponse.data.id;

    await drive.permissions.create({
      fileId,
      requestBody: { role: "reader", type: "anyone" },
    });

    fs.unlinkSync(req.file.path);

const imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;

    const imageData = {
      id: projectImages.length + 1,
      projectId: Number(projectId),
      imageUrl,
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
    };

    projectImages.push(imageData);

    res.json({ success: true, image: imageData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});
