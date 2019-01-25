var express = require('express');
    routes = express.Router();
var userController = require('./controller/user-controller');
var passport = require('passport');

routes.get('/', (req,res)=>{
    return res.send('hello api server talking');
});

routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);

routes.get('/special', passport.authenticate('jwt', {session: false}), (req, res)=>{
    return res.json({msg: `Hey ${req.user.email}! inb4 N wordz. this is epic.`});
});

module.exports = routes;