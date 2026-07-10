const routes = require('express').Router();
const { isAuthenticated } = require('../controller/utility/isAuthenticated');
const listController = require('../controller/listController');


routes.post('/addHabit', isAuthenticated, listController.addHabbit);

module.exports = routes;