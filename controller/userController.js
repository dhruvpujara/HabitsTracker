const User = require('../model/userModel');
const Habbit = require('../model/habbit');


module.exports.getHabits = async (req, res) => {

    let consistency = 0;
    let totalHabits = 0;
    let completedHabits = 0;
    const date = new Date().toISOString().split('T')[0];
    const user = await User.findById(req.user.userId);
    const habits = user.habbits;
    let consistencyMessage = null;

    // check daily status and update 
    const checkStatusAndUpdate = async (habit) => {
        const habitFound = await Habbit.findById(habit);

        if (habitFound.completedDates.includes(date)) {
            habitFound.isCompletedToday = true;
            completedHabits++;
            await habitFound.save();
        } else {
            habitFound.isCompletedToday = false;
            await habitFound.save();
        }
    }

    for (const habit of habits) {
        totalHabits++;
        await checkStatusAndUpdate(habit);
    }

    let percentage = ((completedHabits / totalHabits) * 100)

    // consistencyMessage 
    if (totalHabits == 0) {
        consistencyMessage = "You haven't created any habits yet. Start your journey today! 🌱";
        percentage = 0;
    } else if (totalHabits > 0) {

        if (completedHabits == 0) {
            consistencyMessage = "0 habits completed today. Start with one! 💪"
        } else {
            if (percentage == 0) {
                consistencyMessage = "0% consistency. Start your streak today! 🌟";
            } else if (percentage >= 1 && percentage <= 19) {
                consistencyMessage = "Every day is a fresh start. Begin again today! 🌅";
            } else if (percentage >= 20 && percentage <= 39) {
                consistencyMessage = "Small steps add up. Consistency is key! 🔑";
            } else if (percentage >= 40 && percentage <= 59) {
                consistencyMessage = "Steady progress. You're building momentum! 🌱";
            } else if (percentage >= 60 && percentage <= 79) {
                consistencyMessage = "Good progress! Keep the streak alive! 💪";
            } else if (percentage >= 80 && percentage <= 100) {
                consistencyMessage = "Excellent consistency! You're crushing your goals! 🏆";
            }
        }

    }

    user.todaysPercentage = percentage
    await user.save();

    res.render('habits', {
        consistencyMessage: consistencyMessage,
        percentage: percentage
    });
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

    const user = await User.findById(req.user.userId);

    if (user.friends.length > 0) {
        console.log("not null");
    } else {
        console.log("null")
    }

    res.render('profile', { user: user });

};

