const routes = require('express').Router();
const { isAuthenticated } = require('../controller/utility/isAuthenticated');
const userController = require('../controller/userController');
const listController = require('../controller/listController');

routes.get('/addHabit', userController.getAddHabit);

routes.get('/', isAuthenticated, userController.getHome);
routes.get('/habits', isAuthenticated, userController.getHabits);
routes.get('/profile', isAuthenticated, userController.getProfile);

routes.post('/sendRequest', isAuthenticated, userController.sendRequest);




module.exports = routes;