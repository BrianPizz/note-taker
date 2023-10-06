// Express and node imports
const express = require('express');
const path = require('path');
// initialize path to index.js
const api = require('./routes/index.js');
// specify port for sever
const PORT = 3001;
// Initialize instance on express
const app = express();
// middleware for parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static middleware
app.use(express.static('public'));
// use path to index.js
app.use('/api', api);

// GET request for start page
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
// GET request for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// Listen for connections
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);
