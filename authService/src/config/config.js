const Pool  = require('pg').Pool;

function getPool (){
    return new Pool({
        user: 'llhewbfa',
        host: 'baasu.db.elephantsql.com',
        database: 'llhewbfa',
        password: 'wVd2psVDZ9jCpqgCmadflEjTLOJvCbBn',
        port: 5432,
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000
    })
}

function getConnectionObj(){
    return {
        user: 'llhewbfa',
        host: 'baasu.db.elephantsql.com',
        database: 'llhewbfa',
        password: 'wVd2psVDZ9jCpqgCmadflEjTLOJvCbBn',
        port: 5432
    }
}

module.exports = {
    jwtSecret: 'annuit-coeptis',
    dbp: 'postgres://llhewbfa:wVd2psVDZ9jCpqgCmadflEjTLOJvCbBn@baasu.db.elephantsql.com:5432/llhewbfa',
    dbm: 'mongodb://localhost/ionict-jwt',
    _dbpos: function(){return getConnectionObj()},
    dbpos: function(){return getPool()},
    _db: function(){return getPool();}
};