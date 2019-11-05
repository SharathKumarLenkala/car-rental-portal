var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/CarRental', {useNewUrlParser: true});
var Schema = mongoose.Schema;

var User = new Schema({
  User_id: {type:String, required:true},
  Firstname: {type:String, required:true},
  Lastname: {type:String, required:true},
  Email: {type:String, required:true},
  Password: {type:String, required:true},
  Address1: String,
  Address2: String,
  City: String,
  State: String,
  Zipcode: String,
  Country: String

}, {collections: 'users'});

var userData = mongoose.model('users', User);

module.exports.getUsers = function(){
  return userData.find();
};
