const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const stuffRoutes = require('./routes/stuff')
const userRoutes = require('./routes/user')
const helmet = require('helmet');
const rateLimit = require('express-rate-limit')

mongoose.connect('mongodb+srv://Pedro:natsudragnir@cluster0.fsbzrtv.mongodb.net/',)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))
const app = express();

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1h
    max: 100, //Requests by IP
    message: "Trop de requêtes, veuillez réessayer plus tard."
})

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});




app.use(bodyParser.json())
app.use(limiter);
app.use(helmet());
app.use('/api/books', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
