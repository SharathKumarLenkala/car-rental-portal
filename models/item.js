var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/CarRental', {useNewUrlParser: true});
var Schema = mongoose.Schema;

var Item =  new Schema({
  code: {type:String, required:true},
  name: {type:String, required:true},
  category: {type:String, required:true},
  description: {type:String},
  rating: {type:String, required:true},
  image: {type:String, required:true},
  specification: String,
}, {collection: 'CatItems'});


var itemData = mongoose.model('CatItems', Item);

module.exports.allItemsData = function() {
  return itemData.find();
};
