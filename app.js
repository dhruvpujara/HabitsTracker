const express = require('express');
const dotenv = require('dotenv');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes');



dotenv.config();
const port = process.env.Port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(cookieParser());



app.use(userRoutes);
app.use(authRoutes);
app.use(listRoutes);


mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
