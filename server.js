const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection (optional). If it fails, fall back to a file-based store.
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Root',
  database: process.env.DB_NAME || 'donationDB'
};

let db = null;
let useFileDb = false;
const fileDbPath = path.join(__dirname, 'centers.json');
let fileCenters = [];

try {
  db = mysql.createConnection(dbConfig);
  db.connect((err) => {
    if (err) {
      console.warn('MySQL connection failed, falling back to file DB:', err.message);
      useFileDb = true;
      // ensure file exists
      try {
        if (fs.existsSync(fileDbPath)) {
          fileCenters = JSON.parse(fs.readFileSync(fileDbPath, 'utf8') || '[]');
        } else {
          fs.writeFileSync(fileDbPath, JSON.stringify([]), 'utf8');
          fileCenters = [];
        }
      } catch (fsErr) {
        console.error('Failed to initialize file DB:', fsErr.message);
      }
      return;
    }
    console.log('Connected to MySQL database');
  });
} catch (e) {
  console.warn('MySQL initialization failed, using file DB:', e.message);
  useFileDb = true;
  if (fs.existsSync(fileDbPath)) {
    try { fileCenters = JSON.parse(fs.readFileSync(fileDbPath, 'utf8') || '[]'); } catch(e) { fileCenters = []; }
  } else {
    try { fs.writeFileSync(fileDbPath, JSON.stringify([]), 'utf8'); } catch(e) {}
    fileCenters = [];
  }
}

// Add center - Updated column names
app.post("/add-center", (req, res) => {
  const { center_name, address, contact_number, center_timings, accepted_categories, latitude, longitude } = req.body;

  if (!center_name) return res.status(400).json({ error: 'center_name is required' });

  if (useFileDb) {
    const newCenter = {
      id: (fileCenters.length ? (fileCenters[fileCenters.length-1].id || fileCenters.length) : 1) + 0,
      center_name,
      address,
      contact_number,
      center_timings,
      accepted_categories,
      latitude,
      longitude
    };
    fileCenters.push(newCenter);
    try {
      fs.writeFileSync(fileDbPath, JSON.stringify(fileCenters, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to write file DB:', err.message);
      return res.status(500).json({ error: 'Failed to save center' });
    }
    return res.json({ message: 'Center added (file DB)', id: newCenter.id });
  }

  const sql = `INSERT INTO centers (center_name, address, contact_number, center_timings, accepted_categories, latitude, longitude)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [center_name, address, contact_number, center_timings, accepted_categories, latitude, longitude], (err, result) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error occurred" });
    }

    res.json({ message: "Center added successfully", id: result.insertId });
  });
});

// Get all centers
app.get("/centers", (req, res) => {
  if (useFileDb) {
    return res.json(fileCenters);
  }
  const sql = "SELECT * FROM centers";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  if (useFileDb) console.log('Using file-based DB at', fileDbPath);
});