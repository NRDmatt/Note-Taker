const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Serve the public folder as a static directory
app.use(express.static(path.join(__dirname, "public")));

// Route for getting notes
app.get("/api/notes", (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
  const notes = JSON.parse(data);
  res.json(notes);
});

// Route for adding a new note
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  const data = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
  let notes = JSON.parse(data);

  // Assign a unique id to the new note
  newNote.id = Date.now().toString();

  // Check if notes is an array, and if not, create a new one
  if (!Array.isArray(notes)) {
    notes = [];
  }

  // Add the new note to the array of notes
  notes.push(newNote);

  // Write the updated array of notes to the db.json file
  fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(notes));

  res.json(newNote);
});

// Route for deleting a note
app.delete("/api/notes/:id", (req, res) => {
  const idToDelete = req.params.id;
  const data = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
  const notes = JSON.parse(data);

  // Filter out the note with the id to delete
  const updatedNotes = notes.filter((note) => note.id !== idToDelete);

  // Write the updated array of notes to the db.json file
  fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(updatedNotes));

  res.sendStatus(204);
});

// Route for the index.html page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Route for the notes.html page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Starts the server
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT} http://localhost:3000`);
});