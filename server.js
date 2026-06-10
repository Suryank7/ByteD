require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const connectDB = require('./config/db');
connectDB();

// Cors 
const allowedClients = process.env.ALLOWED_CLIENTS ? process.env.ALLOWED_CLIENTS.split(',') : ['http://localhost:3000'];
const corsOptions = {
    origin: allowedClients
}
app.use(cors(corsOptions));

// Template engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Routes 
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

// Home page route (Upload page)
app.get('/', (req, res) => {
    res.render('index');
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

module.exports = app;
