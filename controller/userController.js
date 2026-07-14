const User = require('../model/userModel');
const Habbit = require('../model/habbit');


module.exports.getHabits = async (req, res) => {

    let consistency = 0;
    let totalHabits = 0;
    let completedHabits = 0;
    const date = new Date().toISOString().split('T')[0];
    const user = await User.findById(req.user.userId);
    const habits = user.habbits;

    const checkStatusAndUpdate = async (habit) => {
        const habitFound = await Habbit.findById(habit);

        if (habitFound.completedDates.includes(date)) {
            habitFound.isCompletedToday = true;
            await habitFound.save();
        } else {
            habitFound.isCompletedToday = false;
            await habitFound.save();
        }
    }

    for (const habit of habits) {
        totalHabits++;
        checkStatusAndUpdate(habit);
    }

    res.render('habits');
};

module.exports.getHome = async (req, res) => {

    try {
        let habits = [];
        const userId = req.user.userId;
        const user = await User.findById(userId);

        for (let i = 0; i < user.habbits.length; i++) {
            const habitId = user.habbits[i];
            const habit = await Habbit.findById(habitId);
            habits.push(habit);
        }

        res.render('home', { user, habits });

    } catch (error) {
        console.error('Error fetching user or habits:', error);
    }
}

module.exports.getAddHabit = (req, res) => {
    res.render('addHabit');
}



module.exports.getProfile = async (req, res) => {
    res.render('profile', { user: req.user });
    // Continue with profile logic
};

