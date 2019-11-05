var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/CarRental', {useNewUrlParser: true});
var Schema = mongoose.Schema;

var UserItem = new Schema({
  id: {type:String, required:true},
  code: {type:String, required:true},
  category: {type:String, required:true},
  item: {type:String, required:true},
  rating: String,
  madeit: String
}, {collections: 'useritems'});

var userItemData = mongoose.model('useritems', UserItem);

module.exports.getItems = function(userId) {
  return userItemData.find({
    id: userId
  });
};

module.exports.addItem = function(userItem) {
  var newUserItem  =  new userItemData(userItem);
  return newUserItem.save();
};

module.exports.isItemSaved = function(userId, itemCode) {
  return userItemData.find({
    id: userId,
    code: itemCode
  });
};

module.exports.UserItemModel = userItemData;
