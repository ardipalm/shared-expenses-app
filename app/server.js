const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to SQLite DB
const dbPath = path.join(__dirname, 'data', 'expenses.db');
const db = new sqlite3.Database(dbPath);

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS families (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    members INTEGER NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    description TEXT,
    amount REAL NOT NULL,
    paid_by INTEGER NOT NULL,
    FOREIGN KEY (paid_by) REFERENCES families(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS paybacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    from_family_id INTEGER,
    to_family_id INTEGER,
    amount REAL NOT NULL,
    FOREIGN KEY (from_family_id) REFERENCES families(id),
    FOREIGN KEY (to_family_id) REFERENCES families(id)
  )`);
});

// Routes
app.get('/', (req, res) => res.send('Shared Expenses API'));

app.get('/families', (req, res) => {
  db.all("SELECT * FROM families", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post('/families', (req, res) => {
  const { name, members } = req.body;
  db.run("INSERT INTO families (name, members) VALUES (?, ?)", [name, members], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ id: this.lastID });
  });
});

// You can add similar routes for /expenses and /paybacks...

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
