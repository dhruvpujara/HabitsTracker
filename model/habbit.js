const mongoose = require('mongoose');

const habbitSchema = new mongoose.Schema({
    habitName: {
        type: String,
        required: true
    },
    habitType: {
        type: String,
        required: true,
        enum: ['yes or no', 'measurable', 'monthly', 'weekly', 'daily']
    },
    frequency: {
        type: String,
        required: true
    },
    habitQuestion: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'check_circle' // Default icon
    },
    iconColor: {
        type: String,
        default: '#6366f1' // Default color
    },
    completedDates: {
        type: [Date],
        default: []
    }
});

module.exports = mongoose.model('Habbit', habbitSchema);