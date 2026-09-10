const routes = require('express').Router();
const { isAuthenticated } = require('../controller/utility/isAuthenticated');
const listController = require('../controller/listController');


routes.post('/addHabit', isAuthenticated, listController.addHabbit);
routes.post('/habitsUpdate', isAuthenticated, listController.habitUpdate);
routes.post('/delete', isAuthenticated, listController.deleteHabit);

module.exports = routes;