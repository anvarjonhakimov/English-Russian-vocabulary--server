let api = require('express').Router();
let jwt = require('jsonwebtoken');
let config = require('../configs/config');

api.use('/auth', require('./auth.api'));

api.use(function (req, res, next) {
    let token = req.headers.authorization;

    if (token) {
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                res.status(401).json({
                    message: 'Failed to authenticate user.'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(401).json({
            message: 'No token provided.'
        });
    }
});

api.use('/users', require('./user.api'));
api.use('/vocabulary', require('./vocabulary.api'));
api.use('/test', require('./test.api'));

module.exports = api;