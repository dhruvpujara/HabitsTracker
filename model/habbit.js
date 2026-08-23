const mongoose = require('mongoose');

const habbitSchema = new mongoose.Schema({
    habitName: {
        type: String,
        required: true
    },
    habitType: {
        type: String,
        required: true,
        enum: ['yes or no', 'measurable']
    },
    isCompletedToday: {
        type: Boolean,
        default: false,
        required: true
    },
    frequency: {
        type: String,
        required: true
    },
    measurementUnit: {
        type: String,
        enum: ['hours', 'minutes', 'litres', 'kgs', 'Numbers']
    },
    target: {
        type: Number
    },
    achievedTarget: {
        type: Number
    },
    habitQuestion: {
        type: String,
        required: true
    },
    todaysPercentage: {
        type: Number
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
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('Habbit', habbitSchema);