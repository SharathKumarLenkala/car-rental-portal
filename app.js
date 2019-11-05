
var express = require('express');
var http = require('http');
var session = require('express-session');
var default_router = require('./routes/default_router.js');
var user_router = require('./routes/user_router.js');
var profile_router = require('./routes/profile_router.js');

var app = express();
app.set('view engine', 'ejs');
app.use(session({secret: 'secret-ssshh'}));
app.use('/assets', express.static('assets'));

app.use('/', default_router);
app.use('/user', user_router.router);
app.use('/profile', profile_router);

app.listen(3000, function(){
  console.log("Application is running at port 3000");
});
