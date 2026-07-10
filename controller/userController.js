const User = require('../model/userModel');
const Habbit = require('../model/habbit');


module.exports.getHabits = (req, res) => {

    let consistency = 0;
    let totalHabits = 0;
    let completedHabits = 0;
    const userId = req.user.userId;

    for (habit of req.user.habbits) {
        totalHabits++;
        if (habit.completedHabits.includes(new Date().toDateString())) {
            completedHabits++;
        }
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

