const User = require('../model/userModel');
const Habbit = require('../model/habbit');

module.exports.addHabbit = async (req, res) => {
    try {
        const { habitType, habitName, habitQuestion, frequency, icon, iconColor, measurementUnit, target } = req.body;

        if (!habitName || !habitQuestion || !frequency || !icon || !iconColor) {
            res.redirect("/addHabit")
        }

        if (habitType == "measurable") {
            if (!measurementUnit || !target) {
                res.redirect("/addHabit")
            }
        }

        const userId = req.user.userId;
        const user = await User.findById(userId);

        const habitData = {
            habitQuestion: habitQuestion,
            habitName: habitName,
            habitType: habitType,
            frequency: frequency,
            measurementUnit: measurementUnit || null,
            target: target || null,
            achievedTarget: null,
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
        const { habitId, completed, achievedTarget } = req.body;
        const userId = req.user.userId;

        let today = new Date().toISOString().split('T')[0];

        let habit = await Habbit.findById(habitId);

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        // if habit type is completed or not
        if (habit.habitType == "yes or no") {
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
        }

        // if habit is measurable in units 
        if (habit.habitType == "measurable") {
            habit.achievedTarget = achievedTarget;
            if (achievedTarget >= habit.target) {
                habit.isCompletedToday = true;
            } else {
                habit.isCompletedToday = false;
            }
        }


        await habit.save();

        res.status(200).json({ message: "Habit updated", habit });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports.deleteHabit = async (req, res) => {
    const { habitId } = req.body
    const user = await User.findById(req.user.userId)

    user.habbits = user.habbits.filter(habit => habit !== habitId)
    await user.save()
    await Habbit.findByIdAndDelete(habitId)


    res.redirect("/habits")
}