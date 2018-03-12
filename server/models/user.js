let bcrypt = require('bcrypt-nodejs');
let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {
        type: String,
        match: [/.+\@.+\..+/, 'Please type a valid email address'],
        trim: true,
        required: true,
        unique: true
    },
    username: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    activationCode: {
        type: String,
        default: ''
    },
    testScore: {
        type: Schema.Types.Mixed,
        default: 'Not passed test yet!'
    },
    recoveryCode: {
        type: String
    },
    recoveryCodeExpiryDate: {
        type: Date
    }
});

/**
 * Hashes password before save
 */
userSchema.pre('save', function (next) {
    let self = this;

    if (this.password && this.password.length >= 6) {
        bcrypt.genSalt(8, function (err, salt) {
            bcrypt.hash(self.password, salt, null, function (err, hash) {
                self.password = hash;
                next();
            });
        });
    }
});

/**
 * Generates hash
 *
 * @param password
 * @returns {*}
 */
userSchema.methods.generateHash = function(password) {
    if (password && password.length >= 6) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }
};

/**
 * Compares passwords
 *
 * @param password
 */
userSchema.methods.comparePassword = function (password) {
    if (password && this.password) {
        return bcrypt.compareSync(password, this.password);
    }
};

module.exports = mongoose.model('User', userSchema);