var crypto = require('crypto');
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var User = require('../models/').User;

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async function(email, password, done) {
        var user = await User.findOne(
            { where: {
                    email: email
                }
            });
        if (user == null) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    }
));