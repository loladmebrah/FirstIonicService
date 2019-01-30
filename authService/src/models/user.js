var queryMaker = require('./../queries/querycontroller');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');

class UserP{
    constructor(bodyRequest){
        this.accountid = this.getUniqueId(64);
        this.email = bodyRequest.email;
        this.accountnumber = bodyRequest.accountnumber;
        this.username = bodyRequest.username;
        this.password = bodyRequest.password;
    }

    set email(e) {
        this._email = e.toLowerCase();
    }
    
    get email() {
        return this._email;
    }

    set accountNumber(acn) {
        this._accountnumber = acn.toUpperCase();
    }
    
    get accountNumber() {
        return this._accountnumber;
    }

    set username(usr) {
        this._username = usr.toLowerCase();
    }
    
    get username() {
        return this._username;
    }

    set password(pass) {
        this._password = pass;
    }
    
    get password() {
        return this._password;
    }

    getUniqueId(len){
        return crypto
                .randomBytes(Math.ceil((len * 3) / 4))
                .toString('base64') // convert to base64 format
                .slice(0, len) // return required number of characters
                .replace(/\+/g, '0') // replace '+' with '0'
                .replace(/\//g, '0') // replace '/' with '0'
    }

    comparePassword(candidatePassword, cb){
        bcrypt.compare(candidatePassword, this.password, (err, isMatch)=>{
            if(err) return cb(err);
            cb(null, isMatch);
        });
    }

    preSave(callback){
        var user = this;
        bcrypt.genSalt(10, function(err_, salt){
            if (err_) {
                callback(err_);
                return err_;
            }else{
                bcrypt.hash(user.password, salt, function(err__, hash){
                    if(err__){
                        callback(err__);
                        return err__;
                    }
                    user.password = hash;
                    callback(err__);
                    return err__;
                });
            }
        });     
    }

    saveUser(callback){
        this.preSave((e)=>{
            if(e){
                console.log("Error in hash procedure, impossible to register user ", e);
                callback(e, "Error in hash procedure, impossible to register user ");
            }else{
                let userResponse = {email: this.email, accountid: this.accountid, accountnumber: this.accountnumber, username: this.username, password: this.password};
                console.log(userResponse);
                queryMaker.InsertUser(userResponse, ( err, res )=>{
                    if(err)
                        callback(err, res);
                    else
                        callback(err, userResponse);
                }); 
            }
        });
    }
}

function searchUser(user, cb){
    queryMaker.Find(user, (e, res)=>{
        if(res.length>0)
            cb(e, res[0]);
        else
            cb(e, null);
    });
}

function userExists(user, cb){
    queryMaker.Find(user, (e, res)=>{
        cb(e, res.length>0);
    });
}

function identifyUser(user, cb){
    queryMaker.Identify(user, (e, res)=>{
        if(res.length>0)
            cb(e, res[0]);
        else
            cb(e, null);
    });
}

module.exports = {
    findUser: function(userName, callback){
        userExists(userName, callback);
    },
    getUser: function(userName, callback){
        searchUser(userName, callback);
    },
    identifyU: function(username, callback){
        identifyUser(username, callback);
    },
    createUser: function(bodRequest){
        return new UserP(bodRequest);
    }
}