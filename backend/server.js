const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let centers = [];

// Add center
app.post("/add-center", (req, res) => {
  const center = req.body;

  centers.push(center);

  res.json({
    message: "Center added successfully",
    data: center
  });
});

// Get centers
app.get("/centers", (req, res) => {
  res.json(centers);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});