const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from Express backend" });
});

//run
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});