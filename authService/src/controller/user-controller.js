var User = require('../models/userMongo');
var UserP = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

function createToken(user){
    return jwt.sign({id: user.accountid}, config.jwtSecret, {
        expiresIn:60
    });
}

exports.registerUser = (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.username || !req.body.accountnumber) {
        return res.status(400).json({'msg': 'register empty', 'body': req.body});
    }

    UserP.findUser({username: req.body.username}, (err, user)=>{
        if(err){
            return res.status(400).json({'msg': err});
        }
        if(user){
            return res.status(400).json({'msg':'The user already exists'});
        }
        let newUser = UserP.createUser(req.body);
        newUser.saveUser((err, user)=>{
            if(err){
                return res.status(400).json({'msg':'Error found saving user', 'Error':err});
            }
            return res.status(201).json(user);
        })
    });
};

exports.loginUser = (req, res) => {
    if (!req.body.password || !req.body.username) {
        return res.status(400).json({'msg': 'login incomplete'});
    }
    UserP.getUser({username: req.body.username}, (err, user)=>{
        if(err){
            return res.status(400).json({'msg': err});
        }
        if(!user){
            return res.status(400).json({'msg':'The user does not exists'});
        }
        let actualUser = UserP.createUser(user);
        actualUser.comparePassword(req.body.password, (err, isMatch) =>{
            if (isMatch && !err && req.body.username == actualUser.username){
                return res.status(200).json({
                    token: createToken(user)
                });
            }else{
                return res.status(400).json({'msg':'Email or password incorrect'});
            }
        });
    });
};