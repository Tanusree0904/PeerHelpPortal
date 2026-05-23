const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = path.join(__dirname, "data.json");

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Add request
app.post("/add", (req, res) => {
  const { roll, subject, description, contact } = req.body;

  if (!roll || !subject || !description || !contact) {
    return res.status(400).send("Please fill all fields");
  }

  const data = readData();
  data.push({
    id: Date.now(),
    roll,
    subject,
    description,
    contact
  });

  writeData(data);
  res.send("Added");
});

// Get all requests
app.get("/requests", (req, res) => {
  res.json(readData());
});

// Delete request
app.delete("/delete/:id", (req, res) => {
  const id = Number(req.params.id);
  const data = readData().filter(item => item.id !== id);
  writeData(data);
  res.send("Deleted");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});