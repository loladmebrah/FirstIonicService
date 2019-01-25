const Pool  = require('pg').Pool;

function getPool (){
    return new Pool({
        user: 'admin',
        host: 'localhost',
        database: 'users_db',
        password: '123456',
        port: 5432,
    })
}

module.exports = {
    jwtSecret: 'annuit-coeptis',
    dbp: 'postgres://admin@localhost:5432/users_db',
    dbm: 'mongodb://localhost/ionict-jwt',
    _db: function(){return getPool();}
};