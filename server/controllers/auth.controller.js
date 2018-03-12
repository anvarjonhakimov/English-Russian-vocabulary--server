let crypto = require('crypto');
let jwt = require('jsonwebtoken');

let config = require('../configs/config');
let User = require('../models/user');
let mailController = require('../controllers/mail.controller');

/**
 * Creates token
 *
 * @param user
 * @returns {*}
 */
function createToken(user) {
    return jwt.sign({
        user: user
    }, config.secretKey, {
        expiresIn: '1d'
    });
}

/**
 * Signs up new user
 *
 * @param req
 * @param res
 */
function signUp(req, res) {
    let data = req.body,
        status;

    if (!data || !data.email || !data.username || !data.password) {
        res.status(400).send('Bad request.');
        return;
    }

    data.activationCode = crypto.createHmac('sha1', data.email).update(data.password).digest('hex');

    User.create(data, function (err, newUser) {
        if (err) {
            if (err.code === 11000) {
                status = 'User with the given email: ' + data.email + ' already exists.';
            }

            res.status(500).json({
                status: status || 'An error occurred in creating user.',
                data: err
            });
        } else {
            const subject = 'Welcome to my site ' + newUser.username + '! Please verify your email',
                html = '<span><a href="' + data.origin + '/verify-email/' + newUser.activationCode + '" target="_blank">Click here</a> to verify your email.</span>',
                mailOptions = {
                    to: newUser.email,
                    subject: subject,
                    html: html
                };

            mailController.sendEmail(mailOptions, res);
        }
    });
}

/**
 * Signs in user
 *
 * @param req
 * @param res
 */
function signIn(req, res) {
    const data = req.body,
        query = {
            email: data.email
        };

    if (!data || !data.email || !data.password) {
        res.status(400).send('Bad request.');
        return;
    }

    User.findOne(query, function (err, currentUser) {
        if (err) {
            res.status(500).json({
                status: 'An error occurred in singing in.',
                data: err
            });
        } else if (currentUser) {
            let token = createToken(currentUser);
            let validPassword = currentUser.comparePassword(req.body.password);

            if (!validPassword) {
                res.status(400).json({
                    status: 'Invalid password. Please enter your password again.'
                });
            } else {
                if (!token) {
                    res.status(500).json({
                        status: 'Failed to create token.'
                    });
                } else if (!currentUser.verified) {
                    res.status(403).json({
                        status: 'Your email is not verified yet.'
                    });
                } else {
                    res.status(200).json({
                        status: 'OK',
                        token: token
                    });
                }
            }
        } else {
            res.status(404).json({
                status: 'User does not exist.'
            });
        }
    });
}

/**
 * Verifies email address
 *
 * @param req
 * @param res
 */
function verify(req, res) {
    const query = {
            activationCode: req.params.activationCode
        },
        update = {
            $set: {
                verified: true
            }
        },
        options = {
            new: true
        };

    User.findOneAndUpdate(query, update, options, function (err, updatedUser) {
        if (err) {
            res.status(500).json({
                status: 'An error occurred in verifying.',
                data: err
            });
        } else if (updatedUser) {
            res.status(200).json({
                status: 'OK'
            });
        } else {
            res.status(400).json({
                status: 'incorrect activation code.',
                data: req.params.activationCode
            });
        }
    });
}

/**
 * Creates recovery code when user requests for forgot password
 *
 * @param req
 * @param res
 */
function forgotPassword(req, res) {
    const data = req.body,
        origin = data.origin,
        now = new Date().getTime(),
        query = {
            email: data.email
        },
        update = {
            recoveryCode: crypto.createHmac('sha1', data.email).update(now.toString()).digest('hex'),
            recoveryCodeExpiryDate: new Date(now + 84600000)
        },
        options = {
            new: true
        };

    if (!data || !data.email) {
        res.status(400).send('Bad request.');
        return;
    }

    User.findOneAndUpdate(query, update, options, function (err, updatedUser) {
        if (err) {
            res.status(500).json({
                status: 'An error occurred in creating recovery code.',
                data: err
            });
        } else if (updatedUser) {
            const subject = 'Reset Your Password',
                html = '<p>We got a request to reset your password.</p>\n<p><a href="' + origin + '/reset-password/' + updatedUser.username + '/' + updatedUser.recoveryCode + '">Reset Password</a></p>\n<p>If you ignore this message, your password won\'t be changed.</p>',
                mailOptions = {
                to: updatedUser.email,
                subject: subject,
                html: html
            };

            mailController.sendEmail(mailOptions, res);
        } else {
            res.status(404).json({
                status: 'User with the given email address: ' + data.email + ' does not exist.'
            });
        }
    });
}

/**
 * Resets old password to new
 *
 * @param req
 * @param res
 */
function resetPassword(req, res) {
    const data = req.body,
        generateHash = new User().generateHash,
        query = {
            username: data.username,
            recoveryCode: data.recoveryCode,
            recoveryCodeExpiryDate: {$gte: new Date()}
        },
        update = {
            password: generateHash(data.newPassword),
            $unset: {
                recoveryCode: '',
                recoveryCodeExpiryDate: ''
            }
        },
        options = {
            new: true
        };

    if (!data) {
        res.status(400).send('Bad request.');
        return;
    }

    if (data.newPassword && data.newPassword.length > 5) {
        User.findOneAndUpdate(query, update, options, function (err, updatedUser) {
            if (err) {
                res.status(500).json({
                    status: 'An error occurred in resetting password.',
                    data: err
                });
            } else if (updatedUser) {
                res.status(200).json({
                    status: 'OK'
                });
            } else {
                res.status(400).json({
                    status: 'Wrong activation code.'
                });
            }
        });
    } else {
        res.status(400).json({
            status: 'Password length must be greater than 5.',
            data: data.newPassword
        });
    }
}

/**
 * Signs out user
 *
 * @param req
 * @param res
 */
function signOut(req, res) {
    res.status(200).json({
        status: 'OK'
    });
}

module.exports = {
    signUp: signUp,
    signIn: signIn,
    signOut: signOut,
    verify: verify,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword
};