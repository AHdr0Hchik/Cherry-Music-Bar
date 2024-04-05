const Cookie = require('./Cookie');
const express = require('express');
const sessions = require('express-session');

class Session extends Cookie {
    constructor(email, role, timeExpiration, secret) {
        this.email = email,
        this.role = role,
        this.timeExpiration = timeExpiration,
        this.secret = secret
    }

    async email(email) {
        if(!email) console.log(this.email);
        else this.email = email;
    }
    async role(role) {
        if(!role) console.log(this.role);
        else this.role = role;
    }
    async timeExpiration(timeExpiration) {
        if(!timeExpiration) console.log(this.timeExpiration);
        else this.timeExpiration = timeExpiration;
    }

    async newSession() {
        app.use(sessions({
            secret: "thisismysecrctekey",
            saveUninitialized:true,
            cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
            resave: false
         }));
    }
}
module.exports = Session;