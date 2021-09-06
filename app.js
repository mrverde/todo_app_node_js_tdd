const express = require("express");
const todoRoutes = require("./routes/todo.routes");
const mongodb = require("./mongodb/mongodb.connect");
const app = express();

mongodb.connect();

app.use(express.json());

app.use("/todos", todoRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

app.get("/", (req, res) => {
  res.send("Hello world!");
});

//CRUD
// Create - HTTP POST
// Read - HTTP GET
// Update - HTTP PUT
// Delete - HTTP DELETE

//API
app.get("/api", (req, res) => {
  res.json("Hello API world!");
});

module.exports = app;
