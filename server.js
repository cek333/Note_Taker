const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 8080;

const dbPath = path.join(__dirname, "db/db.json");

// for parsing incoming POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// for serving all the normal html
app.use( express.static('public') );

// routes
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// endpoints
app.get('/api/notes', function(req, res) {
  // Read `db.json` file and return all saved notes as JSON.
  let notes = JSON.parse( fs.readFileSync(dbPath, 'utf8') );
  // console.log(`[GET /api/notes]`, notes);
  // Add id's to notes. (id = array index)
  notes.map( (note, idx) => note.id = idx);
  res.json(notes);
});

app.post('/api/notes', function(req, res) {
  // Save note to db.json and return new note to the client
  let notes = JSON.parse( fs.readFileSync(dbPath, 'utf8') );
  let newId = notes.length;
  let newNote = req.body;
  notes.push(newNote);
  fs.writeFileSync(dbPath, JSON.stringify(notes));
  newNote.id = newId;
  // console.log(`[POST /api/notes]`, newNote);
  res.json(newNote);
});

app.delete('/api/notes/:id', function(req, res) {
  // Delete note with 'id'. i.e. Delete index=id in array
  let notes = JSON.parse( fs.readFileSync(dbPath, 'utf8') );
  notes.splice(req.params.id, 1);
  fs.writeFileSync(dbPath, JSON.stringify(notes));
  res.json({message: `Note deleted!`});
});

app.listen(PORT, () => {
    console.log( `Listening on port ${PORT}` );
})