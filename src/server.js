const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3001;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ltvlhk1504###***",
  database: "hackathon_adv",
});

app.use(bodyParser.json());

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Mock authentication, replace with actual authentication logic
  if (username === "admin" && password === "admin") {
    const token = jwt.sign({ username, role: "admin" }, "your_secret_key");
    res.json({ token });
  } else if (username === "user" && password === "user") {
    const token = jwt.sign({ username, role: "user" }, "your_secret_key");
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
});

app.get("/tasks", authenticateToken, (req, res) => {
  db.query("SELECT * FROM Task", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post("/tasks", authenticateToken, (req, res) => {
  const { name, priority, deadline } = req.body;
  db.query(
    "INSERT INTO Task (name, priority, deadline, done) VALUES (?, ?, ?, ?)",
    [name, priority, deadline, false],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Task added successfully", id: result.insertId });
    }
  );
});

app.put("/tasks/:id", authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const { name, priority, deadline, done } = req.body;
  db.query(
    "UPDATE Task SET name=?, priority=?, deadline=?, done=? WHERE id=?",
    [name, priority, deadline, done, taskId],
    (err) => {
      if (err) throw err;
      res.json({ message: "Task updated successfully" });
    }
  );
});

app.delete("/tasks/:id", authenticateToken, (req, res) => {
  const taskId = req.params.id;
  db.query("DELETE FROM Task WHERE id=?", [taskId], (err) => {
    if (err) throw err;
    res.json({ message: "Task deleted successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
