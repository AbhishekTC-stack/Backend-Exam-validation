require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Student Course Registration API is running" }));
app.use("/api/students", studentRoutes);

// Malformed JSON body -> 400
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Unknown route -> 404
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
