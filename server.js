let app = require('express')();

let config = require('./server/configs/config');

require('./server/configs/mongoose')(config);
require('./server/configs/express')(app);

app.listen(config.port, function (err) {
    if (err) {
        console.log('Connection to port ' + config.port + ' failed: ', err);
    } else {
        console.log('Listening on port' + config.port);
    }
});