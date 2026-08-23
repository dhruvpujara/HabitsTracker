const User = require('../model/userModel');
const Habbit = require('../model/habbit');


module.exports.getHabits = async (req, res) => {
    let totalHabits = 0;
    let totalCompletionScore = 0;
    const date = new Date().toISOString().split('T')[0];
    const user = await User.findById(req.user.userId);
    const habits = user.habbits;
    let consistencyMessage = null;

    const checkStatusAndUpdate = async (habit) => {
        const habitFound = await Habbit.findById(habit);

        if (habitFound.habitType == "yes or no") {
            if (habitFound.completedDates.includes(date)) {
                habitFound.isCompletedToday = true;
                totalCompletionScore += 100; // Fully completed = 100%
                await habitFound.save();
            } else {
                habitFound.isCompletedToday = false;
                totalCompletionScore += 0; // Not completed = 0%
                await habitFound.save();
            }
        } else {
            // Calculate raw percentage
            let rawPercentage = habitFound.target > 0
                ? ((habitFound.achievedTarget / habitFound.target) * 100)
                : 0;

            // CAP THE PERCENTAGE AT 100% - THIS IS THE KEY CHANGE!
            let cappedPercentage = Math.min(rawPercentage, 100);

            // Store the capped percentage
            habitFound.todaysPercentage = rawPercentage
            await habitFound.save();

            // Add this habit's capped percentage to the total score
            totalCompletionScore += cappedPercentage;
        }
    }

    for (const habit of habits) {
        totalHabits++;
        await checkStatusAndUpdate(habit);
    }

    // Calculate overall percentage
    let percentage = 0;
    if (totalHabits > 0) {
        percentage = parseFloat((totalCompletionScore / totalHabits).toFixed(2));
    }

    // Consistency messages remain the same...
    if (totalHabits == 0) {
        consistencyMessage = "You haven't created any habits yet. Start your journey today! 🌱";
        percentage = 0;
    } else if (totalHabits > 0) {
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

    user.todaysPercentage = percentage;
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


module.exports.sendRequest = async (req, res) => {

    const { friendId } = req.body
    const ourId = req.user.userId

    const friend = await User.findById(friendId);
    friend.friendRequest.push(ourId);
    await friend.save();
}
