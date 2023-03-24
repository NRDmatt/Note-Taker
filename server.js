const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text
  };
  fs.readFile(path.join(__dirname, 'db', 'db.json'), (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  fs.readFile(path.join(__dirname, 'db', 'db.json'), (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const filteredNotes = notes.filter(note => note.id !== id);
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(filteredNotes), (err) => {
      if (err) throw err;
      res.sendStatus(204);
    });
  });
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT} http://localhost:3000`));