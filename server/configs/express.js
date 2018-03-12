let bodyparser = require('body-parser');
let express = require('express');
let morgan = require('morgan');
let cors = require('cors');

module.exports = function (app) {
    app.use(express({}));
    app.use(morgan('dev'));
    app.use(cors());

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Accept, Content-Type, Origin, X-Requested-With');
        next();
    });

    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({
        extended: true
    }));

    app.use('/api', require('../api/main.api'));
};
