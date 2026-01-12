const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const { google } = require("googleapis");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Multer
const upload = multer({ dest: "uploads/" });

// Google OAuth
const oauthClientData = JSON.parse(fs.readFileSync("oauth-client.json"));
const oauth2Client = new google.auth.OAuth2(
  oauthClientData.web.client_id,
  oauthClientData.web.client_secret,
  oauthClientData.web.redirect_uris[0]
);

const token = JSON.parse(fs.readFileSync("token.json"));
oauth2Client.setCredentials(token);

const drive = google.drive({ version: "v3", auth: oauth2Client });

// In-memory DB
let contractorProjects = [];
let projectImages = [];
let projectFeedbacks = [];

/* HEALTH */
app.get("/", (_, res) => res.send("Backend running ✔"));

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
/* Get readable address */
async function getAddressFromIP(ip) {
  try {
    const geo = await axios.get(`https://ipapi.co/${ip}/json/`);
    const { latitude, longitude } = geo.data;
    if (!latitude || !longitude) return "Address unavailable";

    const addr = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      { params: { latlng: `${latitude},${longitude}`, key: process.env.GOOGLE_MAPS_API_KEY } }
    );

    return addr.data.results?.[0]?.formatted_address || "Address unavailable";
  } catch {
    return "Address unavailable";
  }
}

/* Upload image */
app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const projectId = Number(req.body.projectId);
    const contractorName = req.body.contractorName || "Unknown Contractor";
    const timestamp = new Date().toISOString();

    const userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "8.8.8.8";
    const address = await getAddressFromIP(userIP);

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
    await drive.permissions.create({ fileId, requestBody: { role: "reader", type: "anyone" } });
    fs.unlinkSync(req.file.path);

    const img = {
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
    res.status(500).json({ error: "Upload failed" });
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
/* Contractor Projects */
app.post("/contractor/project", (req, res) => {
  const { description, startDate, endDate } = req.body;
  const project = {
    id: contractorProjects.length + 1,
    description,
    startDate,
    endDate,
  };
  contractorProjects.push(project);
  res.json({ success: true, project });
});

app.get("/contractor/projects", (_, res) => res.json(contractorProjects));

app.put("/contractor/project/:id", (req, res) => {
  const id = Number(req.params.id);
  const p = contractorProjects.find(x => x.id === id);
  if (!p) return res.status(404).json({ error: "Not found" });

  p.description = req.body.description;
  p.startDate = req.body.startDate;
  p.endDate = req.body.endDate;
  res.json({ success: true, project: p });
});

app.delete("/contractor/project/:id", (req, res) => {
  const id = Number(req.params.id);
  contractorProjects = contractorProjects.filter(p => p.id !== id);
  projectImages = projectImages.filter(i => i.projectId !== id);
  projectFeedbacks = projectFeedbacks.filter(f => f.projectId !== id);
  res.json({ success: true });
});

/* Project images */
app.get("/contractor/project/:id/images", (req, res) => {
  res.json(projectImages.filter(i => i.projectId === Number(req.params.id)));
});

/* Citizen search */
app.get("/citizen/search", (req, res) => {
  const q = req.query.q?.toLowerCase() || "";
  if (q.split(" ").length < 2) return res.json([]);

  const seen = new Set();
  const results = [];

  for (const img of projectImages) {
    if (q.split(" ").every(w => img.address.toLowerCase().includes(w))) {
      if (!seen.has(img.projectId)) {
        const p = contractorProjects.find(x => x.id === img.projectId);
        results.push({
          projectId: img.projectId,
          description: p?.description || "",
          address: img.address,
          thumbnail: img.imageUrl,
        });
        seen.add(img.projectId);
      }
    }
  }

  res.json(results);
});

/* Citizen Feedback */
app.post("/citizen/project/:id/feedback", upload.single("photo"), async (req, res) => {
  try {
    const projectId = Number(req.params.id);
    let imageUrl = null;

    if (req.file) {
      const driveResponse = await drive.files.create({
        requestBody: { name: req.file.originalname },
        media: { mimeType: req.file.mimetype, body: fs.createReadStream(req.file.path) },
      });
      const fileId = driveResponse.data.id;
      await drive.permissions.create({ fileId, requestBody: { role: "reader", type: "anyone" } });
      fs.unlinkSync(req.file.path);
      imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
    }

    const f = {
      id: projectFeedbacks.length + 1,
      projectId,
      username: req.body.username,
      message: req.body.message,
      type: req.body.type,
      imageUrl,
      timestamp: new Date().toISOString(),
    };

    projectFeedbacks.push(f);
    res.json({ success: true, feedback: f });
  } catch (err) {
    res.status(500).json({ error: "Feedback failed" });
  }
});

/* Contractor sees feedback */
app.get("/contractor/project/:id/feedback", (req, res) =>
  res.json(projectFeedbacks.filter(f => f.projectId === Number(req.params.id)))
);

/* Dummy Auth */
app.post("/citizen/login", (_, res) => res.json({ success: true }));
app.post("/contractor/login", (_, res) => res.json({ success: true }));

app.listen(5000, () => console.log("Running http://localhost:5000"));