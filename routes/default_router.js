var express = require('express');
var ImportItemUtility = require('../utility/itemDB');
var userItem = require('../models/userItem');
var bodyParser = require('body-parser');


var urlEncodedParser = bodyParser.urlencoded({extended: false});
var getItems = ImportItemUtility.getItems;
var getItem = ImportItemUtility.getItem;
var getItemsByCategory = ImportItemUtility.getItemsByCategory;

var {body, check, validationResult} = require('express-validator/check');
var {sanitizeBody} = require('express-validator/filter');

var router = express.Router();

router.use( function(req, res, next) {
    res.locals.user = req.session.theUser;
    next();
});

router.get('/', function(req, res){
  res.render('index.ejs');
});

router.get('/categories', function(req, res){
      var data = getItemsByCategory();
      res.render('categories.ejs', {"catalogData": data});
});

router.get('/item', [
  check('item-code').exists(),
  check('item-code').isLength({ min:4, max:4 })
], function(req, res){
  var reqParams = req.query;
  itemcode = reqParams['item-code'];
  var ItemObject = getItem(itemcode);
  var errors = validationResult(req);

  if (!errors.isEmpty() || typeof ItemObject === "undefined" || typeof req.session.theUser === "undefined")
  {
    res.redirect('/categories');
  }
  else
  {
    userItem.isItemSaved(req.session.theUser.User_id, itemcode).exec(function(error, data) {
    //  console.log(data);
      if(data.length === 0){
        res.render('item.ejs', {"item":ItemObject, "checkItem": 0});
      }
      else {
        res.render('item.ejs', {"item":ItemObject, "checkItem": 1});
      }
    });

  }

});


router.get('/feedback', [
  check('item-code').exists(),
  check('item-code').isLength({ min:4, max:4 })
 ], function(req, res){


    var reqParams = req.query;
    var errors = validationResult(req);
    itemcode = reqParams['item-code'];
    var itemObject = getItem(itemcode);

    if(!errors.isEmpty() || typeof itemObject === "undefined"){
      res.redirect('/profile/myitem');
    }

    else {
      var id = req.session.theUser.User_id;
      userItem.isItemSaved(id, String(itemcode)).exec(function(error, data) {
      var currentItem = data[0];
      var stars = parseInt(currentItem.rating);
      itemObject.rating = stars;
      res.render('feedback.ejs', {"item":itemObject, "isTested":currentItem.madeit});
      });
    }

});



router.get('/about', function(req, res){
  res.render('about.ejs');
});

router.get('/contact', function(req, res){
  res.render('contact.ejs');
});

module.exports = router;
