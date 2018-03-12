let nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');

let transporter = nodemailer.createTransport(smtpTransport({
    service: 'Mail.ru',
    auth: {
        user: 'send.mail.98@mail.ru',
        pass: 'karimabdullavash98'
    }
}));

/**
 * Sends mail with activation code to user's Email address
 *
 * @param options
 * @param res
 */
function sendEmail(options, res) {
    options = options || {};
    options.from = options.from || 'send.mail.98@mail.ru';
    options.to = options.to || '';
    options.subject = options.subject || '';
    options.html = options.html || '';

    transporter.sendMail(options, function (err, response) {
        if (err) {
            res.status(500).json({
                status: 'An error occurred in sending mail.',
                data: err
            });
        } else {
            res.status(200).json({
                status: 'OK'
            });
        }
    });
}

module.exports = {
    sendEmail: sendEmail
};