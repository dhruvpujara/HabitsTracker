const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
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
    }],
    friendRequest: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId
    }]
});

module.exports = mongoose.model('User', userSchema);