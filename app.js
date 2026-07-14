
// Importing required modules
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const port = process.env.Port;
const http = require('http');
const { Server } = require('socket.io');



const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
});


// routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes');


// app configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(cookieParser());



app.use(userRoutes);
app.use(authRoutes);
app.use(listRoutes);




mongoose.connect(process.env.MONGODB_URI).then(() => {
    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
