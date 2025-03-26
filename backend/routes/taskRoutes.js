const express = require('express');
const router = express.Router();

// Example route for fetching employees
router.get('/', (req, res) => {
  res.send('Fetching employees...'); // Replace with actual database logic
});

// Example route for adding an employee
router.post('/', (req, res) => {
  const { name, position } = req.body;
  res.send(`Added employee: ${name}, Position: ${position}`); // Replace with database logic
});

module.exports = router;