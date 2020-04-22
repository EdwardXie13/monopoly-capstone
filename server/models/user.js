// ----------------------------------------------------------------------------------------------
//  External Dependencies
// ----------------------------------------------------------------------------------------------
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ----------------------------------------------------------------------------------------------
//  Schema Setup
// ----------------------------------------------------------------------------------------------
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,
    ready: { type: Boolean, default: false }
});

// ----------------------------------------------------------------------------------------------
//  Helper methods
// ----------------------------------------------------------------------------------------------
userSchema.pre('save', function(next) {
    const user = this;

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) { return callback(err); }

        callback(null, isMatch);
    });
}

module.exports = mongoose.model('user', userSchema);