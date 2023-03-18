// Require dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');

// Set up Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON data
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// HTML routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname,'Develop', 'public',  'notes.html')); 
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop','public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});