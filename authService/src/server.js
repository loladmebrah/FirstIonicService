var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
//var mongoose = require('mongoose');
//var session = require('express-session');
//var config = require('./config/config');
var cors = require('cors');
var port = process.env.PORT || 5000;

var app = express();

var whitelist = ['http://localhost:8100', 'http://localhost:8888'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS, try again'))
    }
  }
}
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(passport.initialize());
var passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);

app.get('/', function(req, res){
    return res.send('Hello! The API is at http://localhost:'+port+'/api');
})

var routes = require('./routes.js');
app.use('/api', routes);

app.listen(port);
console.log('Hello! The API is at http://localhost:'+port+'/api');