const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


module.exports.getLogin = (req, res) => {
    res.render('login');
}

module.exports.getRegister = (req, res) => {
    res.render('register');
}

module.exports.logoutUser = (req, res) => {
    res.clearCookie('user');
    res.redirect('/login');
}

module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15d' });

        user.save().then(() => {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15d' });
            res.cookie('user', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
            });
        }).then(() => {
            console.log('User registered successfully');
            res.redirect('/habits');
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
        console.error('Error registering user:', error);
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15d' });

        res.cookie('user', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        });

        res.redirect('/');
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.error('Error logging in user:', error);
    }
}


module.exports.sendFriendRequest = async (req, res) => {
    try {

        const { userId } = req.body

        const user = await User.findById(userId);
        const ourId = req.user.userId
        user.friendRequest.push(ourId.toString());
        await user.save();

    } catch (error) {
        console.log(error);
    }
}
