let api = require('express').Router();
let authController = require('../controllers/auth.controller');

api.post('/sign-in', authController.signIn);
api.post('/sign-up', authController.signUp);
api.get('/sign-out', authController.signOut);
api.get('/verify/:activationCode', authController.verify);
api.post('/forgot-password', authController.forgotPassword);
api.post('/reset-password', authController.resetPassword);

module.exports = api;