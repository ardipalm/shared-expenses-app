const path = require('path');

// Add this before your routes:
app.use(express.static(path.join(__dirname, 'public')));


// Get all expenses
app.get('/expenses', (req, res) => {
  db.all("SELECT * FROM expenses", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Add new expense
app.post('/expenses', (req, res) => {
  const { date, description, amount, paid_by } = req.body;
  db.run(
    "INSERT INTO expenses (date, description, amount, paid_by) VALUES (?, ?, ?, ?)",
    [date, description, amount, paid_by],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

// Get all paybacks
app.get('/paybacks', (req, res) => {
  db.all("SELECT * FROM paybacks", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Add new payback
app.post('/paybacks', (req, res) => {
  const { date, from_family_id, to_family_id, amount } = req.body;
  db.run(
    "INSERT INTO paybacks (date, from_family_id, to_family_id, amount) VALUES (?, ?, ?, ?)",
    [date, from_family_id, to_family_id, amount],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});
