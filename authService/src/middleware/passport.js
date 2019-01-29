var User = require('../models/userMongo');
var UserP = require('../models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var config = require('../config/config');

var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}

module.exports = new JwtStrategy(opts, function(jwt_payload, done){
    console.log("payload");
    console.log(jwt_payload);
    UserP.findUser(jwt_payload, function(err, user){
        if (err){
            return done(err, false);
        }
        if(user){
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
});
