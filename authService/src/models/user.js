var queryMaker = require('./../queries/querycontroller');
var bcrypt = require('bcryptjs');

class UserP{
    constructor(bodyRequest){
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
            }else{
                let userResponse = {email: this.email, accountnumber: this.accountnumber, username: this.username, password: this.password};
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

//exporta como funciones independientes:
/*
    encontrar usuario
    crear clase
*/

//exporta como metodos de clase:
/*
    constructor
    save
    compare password
*/
/*
{
"email":"222222",
"username":"222222",
"accountNumber":"222222",
"password":"222222"
}

{ 
"username":"victory", 
"password":"defeat", 
"accountNumber":"FA445G58", 
"email": "test@test.com"
}
*/

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

module.exports = {
    findUser: function(userName, callback){
        userExists(userName, callback);
    },
    getUser: function(userName, callback){
        searchUser(userName, callback);
    },
    createUser: function(bodRequest){
        return new UserP(bodRequest);
    }
}