const conf = require('./../config/config');
const pool = conf.dbpos();

function singleSelect(table, columns, condition){
    const text = 'SELECT '+columns+' FROM '+table+' WHERE '+condition+'= $1';
    return text;
}

function getDynamical(length){
    let t=[];
    for(let i =1; i<=length; i++) t.push('$'+i)
    return t.join(',');
}

function Insert(table, columns){
    let text = 'INSERT INTO '+table+'('+columns.join(',')+') VALUES ('+getDynamical(columns.length)+')';
    return text;
}

function searchForUser(user, callback){
    const query = singleSelect('tuser', '*', 'username');
    pool.query(query, [user.username], (err, res) => {
        callback(err, res.rows);
    });
    return callback;
}

function identifyUser(user, callback){
    const query = singleSelect('tuser', '*', 'accountid');
    pool.query(query, [user.id], (err, res) => {
        callback(err, res.rows);
    });
    return callback;
}

function insertUser(user, callback){
    const query = Insert('tuser',['username','password','accountnumber','email','accountid']);
    const values = [user.username,user.password,user.accountnumber,user.email, user.accountid];
    pool.query(query, values, (err, res) => {
        if(res)
            callback(err, res.rows);
        else
            callback(err, res);
    });
    return callback;
}

module.exports = {
    Find: function(usr, cb){
        return searchForUser(usr, cb);
    },
    Identify: function(usr, cb){
        return identifyUser(usr, cb);
    },
    InsertUser: function(user, cb){
        return insertUser(user, cb);
    }
}