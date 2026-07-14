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

module.exports.habitUpdate = async (req, res) => {
    try {
        const { habitId, completed } = req.body;
        const userId = req.user.userId;

        let today = new Date().toISOString().split('T')[0];

        let habit = await Habbit.findById(habitId);

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        if (completed) {
            // prevent duplicate dates
            if (!habit.completedDates.includes(today)) {
                habit.completedDates.push(today);
            }
        } else {
            // remove date cleanly
            habit.completedDates = habit.completedDates.filter(
                date => date !== today
            );
        }

        await habit.save();

        res.status(200).json({ message: "Habit updated", habit });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};