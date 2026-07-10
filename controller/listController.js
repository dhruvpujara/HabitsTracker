const User = require('../model/userModel');
const Habbit = require('../model/habbit');

module.exports.addHabbit = async (req, res) => {
    try {
        const { habitType, habitName, habitQuestion, frequency, icon, iconColor } = req.body;

        const userId = req.user.userId;
        const user = await User.findById(userId);

        const habitData = {
            habitQuestion: habitQuestion,
            habitName: habitName,
            habitType: habitType,
            frequency: frequency,
            icon: icon || 'check_circle',
            iconColor: iconColor || '#6366f1'
        };

        const habbit = new Habbit(habitData);
        await habbit.save();

        user.habbits.push(habbit._id);
        await user.save().then(() => {
            res.redirect('/habits');
        });

    } catch (error) {
        console.error('Error adding habit:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};