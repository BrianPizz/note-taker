// Express and node imports
const express = require('express');
const path = require('path');
const fs = require('fs');
// database import
const noteList = require('./db/db.json');
// specify port for sever
const PORT = 3001;
// Initialize instance on express
const app = express();
// middleware for parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static middleware
app.use(express.static('public'));

// GET request for start page
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
// GET request for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// GET request for all notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data))
    })
});
// POST request to add note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add note`);

    const { title, text } = req.body;
    // construct object with data, generate random ID
    if (title && text) {
        const newNote = {
            title,
            text,
            id: Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1),
        };
        // Get db data and add new note to array
        fs.readFile(`./db/db.json`, (err, data) => {
            if (err) throw err;
            const notes = JSON.parse(data);
            notes.push(newNote);
            // Overwrite old data with new array
            fs.writeFile(`./db/db.json`, JSON.stringify(notes, null, 4), (err) =>
                err ? console.error(err) : console.log(`Note added!`))
            res.json(notes)
        })
        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
    } else {
        res.status(500).json('Error in adding note')
    }
});
// GET request to display active note
app.get('api/notes/:id', (req, res) => {
    const requestNote = req.params.id.toLowerCase();
    
    for (let i = 0; i < noteList.length; i++) {
        if (requestNote === noteList[i].term.toLowerCase()) {
            return res.json(noteList[i]);
        }
    }
});
// DELETE request to remove a note
app.delete('/api/notes/:id', (req, res) => {
    console.info(`${req.method} request received to delete note`);
    // Get db data and add filter array to remove note with matching ID
    fs.readFile(`./db/db.json`, (err, data) => {
        if (err) throw err;
        const deleteNotes = JSON.parse(data);
        const updatedNotes = deleteNotes.filter(note => note.id !== req.params.id)
        // Overwrite old data with new array
        fs.writeFile(`./db/db.json`, JSON.stringify(updatedNotes, null, 4), (err) =>
            err ? console.error(err) : console.log(`Note deleted!`))
        res.json(updatedNotes)
    })

});
// Listen for connections
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);
