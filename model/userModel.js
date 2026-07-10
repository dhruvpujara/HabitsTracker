const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    habbits: [{
        type: String,
        ref: 'Habbit'
    }]
});

module.exports = mongoose.model('User', userSchema);