let mongoose = require('mongoose');

module.exports = function (config) {
    mongoose.connect(config.db, function (err) {
        if (err) {
            console.log('Connection to database failed.');
        } else {
            console.log('Connected to database.');
        }
    });
};