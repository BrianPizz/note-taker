const express = require('express');
const path = require('path');
const fs = require('fs');
const noteList = require('./db/db.json')
const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data))
    })
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1),
        };

        fs.readFile(`./db/db.json`, (err, data) => {
            if (err) throw err;
            const notes = JSON.parse(data);
            notes.push(newNote);

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

app.get('api/notes/:id', (req, res) => {
    const requestNote = req.params.id.toLowerCase();

    for (let i = 0; i < noteList.length; i++) {
        if (requestNote === noteList[i].term.toLowerCase()) {
            return res.json(noteList[i]);
        }
    }
});

app.delete('/api/notes/:id', (req, res) => {
    console.info(`${req.method} request received to delete note`);

    fs.readFile(`./db/db.json`, (err, data) => {
        if (err) throw err;
        const deleteNotes = JSON.parse(data);
        const updatedNotes = deleteNotes.filter(note => note.id !== req.params.id)

        fs.writeFile(`./db/db.json`, JSON.stringify(updatedNotes, null, 4), (err) =>
            err ? console.error(err) : console.log(`Note deleted!`))
        res.json(updatedNotes)
    })
    
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);
