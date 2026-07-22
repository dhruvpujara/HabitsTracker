const routes = require('express').Router();
const { isAuthenticated } = require('../controller/utility/isAuthenticated');
const authController = require('../controller/authController');


routes.get('/login', authController.getLogin);
routes.get('/register', authController.getRegister);
routes.post('/logout', isAuthenticated, authController.logoutUser);


routes.post('/register', authController.registerUser);
routes.post('/login', authController.loginUser);



module.exports = routes;