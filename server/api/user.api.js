let api = require('express').Router();
let userController = require('../controllers/user.controller');

api.get('/current', userController.retrieveCurrentUser);

module.exports = api;