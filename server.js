// Require dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(express.static('public'));
// html routes
// /notes will now send the user to notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'notes.html')); 
});


// intial webpage to be loaded will be index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'index.html'));
});

app.get("/api/notes", (req, res) => {
  // Read the db.json file
  const dbFilePath = path.join(__dirname, "db", "db.json");
  fs.readFile(dbFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to retrieve notes." });
    }

    // Parse the JSON data and send it as the response
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post("/api/notes", (req, res) => {
  // Read the db.json file
  const dbFilePath = path.join(__dirname, "db", "db.json");
  fs.readFile(dbFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to retrieve notes." });
    }

    // Parse the JSON data and get the notes array
    const notes = JSON.parse(data);

    // Create a new note object with a unique id
    const newNote = {
      id: uuidv4(),
      title: req.body.title,
      text: req.body.text,
    };

    // Add the new note to the notes array
    notes.push(newNote);

    // Write the updated notes array back to db.json
    fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to save note." });
      }

      // Send the new note as the response
      res.json(newNote);
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});