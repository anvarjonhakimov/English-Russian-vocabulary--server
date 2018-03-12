let User = require('../models/user');

/**
 * Retrieves current user
 *
 * @param req
 * @param res
 */
function retrieveCurrentUser(req, res) {
    const decodedUser = req.decoded.user,
        query = {
            _id: decodedUser._id
        };

    if (decodedUser && decodedUser._id) {
        User.findOne(query, function (err, user) {
            if (err) {
                res.status(500).json({
                    status: 'An error occurred in retrieving current user.',
                    data: err
                });
            } else if (user) {
                res.status(200).json({
                    status: 'OK',
                    data: user
                });
            } else {
                res.status(404).json({
                    status: 'The user with the given ID: ' + decodedUser._id + ' does not exist.'
                });
            }
        }).select('-_id -password -activationCode -verified');
    } else {
        res.status(401).json({
            status: 'Authentication failed.'
        });
    }
}

module.exports = {
    retrieveCurrentUser: retrieveCurrentUser
};