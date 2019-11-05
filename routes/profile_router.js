var express = require('express');
var ImportItemUtility = require('../utility/itemDB');
var  userDB = require('../models/user');
var userItem = require('../models/userItem');
var bodyParser = require('body-parser');
var  userProfile = require('../models/userProfile');
var user_router = require('./user_router');
var signedin_User = user_router.signedin_User;


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

router.get('/myitem', function(req, res) {
  if(!req.session.theUser){
    res.redirect('/user/signin');
  }
  else {
    userItem.getItems(req.session.theUser.User_id).exec(function(error, data){
      res.render('myitem.ejs', {data: data});
    });
  }
});

router.get('/save', [
  check('item-code').exists(),
  check('item-code').isLength({ min:4, max:4 }),
 ], function(req, res) {
  var reqParams = req.query;
  var errors = validationResult(req);

  if(!errors.isEmpty()){
    res.redirect('/profile/myitem');
  }
  else {
    itemcode = reqParams['item-code'];
    var id = req.session.theUser.User_id;
    var item = ImportItemUtility.getItemByCode(itemcode);

    if(typeof item !== "undefined") {
      var newUserItem = {"id": id, "code": itemcode, "item": item.name, "category": item.category, "rating": "", "madeit": "false"};
      var useritem = new userItem.UserItemModel(newUserItem);
      userItem.UserItemModel.collection.insertOne(newUserItem, function(error, data){
      //console.log("Item Saved");
      res.redirect('/profile/myitem');
    });
   }
   else {
      res.redirect('/profile/myitem');
   }
 }
});

router.post('/update-rating', urlEncodedParser, [
  check('item-code').exists(),
  check('user-rating').exists(),
  check('item-code').isLength({ min:4, max:4 }),
  check('user-rating').isInt({ gt: 0, lt:6 })
 ], function(req, res) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.redirect('/profile/myitem');
  }
  else{
   var queryString = req.body;
   var itemcode = queryString['item-code'];
   var id = req.session.theUser.User_id;;
   var rating = queryString['user-rating'];
   userItem.isItemSaved(id, itemcode).exec(function(error, data) {
     var currentItem = data[0];
     if(typeof currentItem !== "undefined"){
       let updatedUserItem = {"id": id, "code": itemcode, "item": currentItem.item, "category": currentItem.category, "rating": String(rating), "madeit": currentItem.madeit};
         var condition = {id:id, code:itemcode};
         userItem.UserItemModel.updateOne(condition, updatedUserItem, function(error, data){
           res.redirect('/profile/myitem');
         });
     }
     else {
       res.redirect('/profile/myitem');
     }
   });
 }
});

router.post('/update-madeit', urlEncodedParser, [
check('item-code').exists(),
check('madeit').exists(),
check('item-code').isLength({ min:4, max:4 }),
check('madeit').isIn(["true", "false"])
], function(req, res) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.redirect('/profile/myitem');
  }
  else{
    var queryString = req.body;
    var itemcode = queryString['item-code'];
    var madeIt = queryString['madeit'];
    var id = req.session.theUser.User_id;
    userItem.isItemSaved(id, itemcode).exec(function(error, data) {
      var currentItem = data[0];
      if(typeof currentItem !== "undefined"){
        let updatedUserItem = {"id": id, "code": itemcode, "item": currentItem.item, "category": currentItem.category, "rating": currentItem.rating, "madeit": madeIt};
          var condition = {id:id, code:itemcode};
          userItem.UserItemModel.updateOne(condition, updatedUserItem, function(error, data){
            res.redirect('/profile/myitem');
          });
      }
      else {
        res.redirect('/profile/myitem');
      }
    });
  }
});




router.post('/delete', urlEncodedParser, [
  check('item-code').exists(),
  check('item-code').isLength({ min:4, max:4 })
 ],  function(req, res) {
   var errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.redirect('/profile/myitem');
  }
  else {
    var queryString = req.body;
    var itemcode = queryString['item-code'];
    var userId = req.session.theUser.User_id;
    userItem.UserItemModel.find({id: userId, code: itemcode}).deleteOne(function(error, data){
      res.redirect('/profile/myitem');
    });
  }
});

module.exports = router;
