var express = require('express');
var ImportItemUtility = require('../utility/itemDB');
var  userDB = require('../models/user');
var userItem = require('../models/userItem');
var bodyParser = require('body-parser');
var  userProfile = require('../models/userProfile');
var {body, check, validationResult} = require('express-validator/check');
var {sanitizeBody} = require('express-validator/filter');


var urlEncodedParser = bodyParser.urlencoded({extended: false});
var getItems = ImportItemUtility.getItems;
var getItem = ImportItemUtility.getItem;
var getItemsByCategory = ImportItemUtility.getItemsByCategory;

var router = express.Router();

router.use(function(req, res, next) {
    res.locals.user = req.session.theUser;
    next();
});

router.get('/signin', function(req, res) {
  if(!req.session.theUser){
    if(typeof req.query.error !== "undefined"){
      res.render('login.ejs', {error: req.query.error});
    }
    else {
        res.render('login.ejs', {error: 0});
    }
  }
});

router.post('/authentication', urlEncodedParser, [
  check('username').isEmail(),
  check('password').isLength({ min: 4, max: 16 })

  /* ,body('username')
  .isEmail()
  .normalizeEmail(),
  sanitizeBody('notifyOnReply').toBoolean()  */
] , function(req, res) {

  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.redirect('/user/signin?error=2');
  }

  else {
    var queryString = req.body;
    var username = queryString['username'];
    var password = queryString['password'];


    var user_List = [];
    userDB.getUsers().exec(function(error, data) {
      user_List = data;
      var user = undefined;
      for(let i=0;i<user_List.length;i++){
        if(user_List[i].Email === username && user_List[i].Password === password){
          user = user_List[i];
          break;
        }
      }

      if(typeof user !== "undefined"){
        req.session.theUser = user;
        userItem.getItems(req.session.theUser.User_id).exec(function(error, data){
          res.redirect('/profile/myitem');
        });
      }
      else {
          res.redirect('/user/signin?error=1');
      }
    });
  }

});


router.get('/signout', function(req, res) {
  userProfile.emptyProfile();
  req.session.destroy();
  res.redirect('/');
});

var signedin_User = function(req) {
  var user_List = [];
  userDB.getUsers().exec(function(error, data) {
    user_List = data;
    var max = user_List.length-1;
    var index = Math.floor(Math.random() * (max - 0 + 1)) + 0;
    req.session.theUser = user_List[index];
  });
};

module.exports = {
  "router":router,
  "signedin_User": signedin_User
};
