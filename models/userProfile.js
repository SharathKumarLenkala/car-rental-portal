var UserItem = require('./userItem');

var userItemList = [];

var addItem = function(userItem)  {
  var flag = 1;
  for(var i=0;i<userItemList.length;i++){
    if(userItemList[i].code === userItem.code){
      flag = 0;
    }
  }
  if(flag === 1){
    userItemList.push(userItem);
  }
};

var removeItem = function(userIitem) {
  var i = getItemIndex(userIitem);
  userItemList.splice(i,1);
};

var updateItem = function(userItem) {
  var i = getItemIndex(userItem);
  userItemList[i] = userItem;
};

var getItems = function(id)  {
  return userItemList.filter(item => {
    if(item.id === id){
      return item;
    }
  });
};

var emptyProfile = function()  {
  userItemList = [];
};

var getCurrentItemByCode = function(id, code)  {
  for(var i=0;i<userItemList.length;i++){
    if(userItemList[i].id === id && userItemList[i].code === code){
      return userItemList[i];
    }
  }
};

var getItemIndex = function(userItem)  {
  var index;
  for(var i=0; i<userItemList.length;i++){
    if(userItemList[i].code === userItem.code && userItemList[i].id === userItem.id){
      index = i;
    }
  };
  return index;
};
 

var isItemSaved = function(id, code) {
  for(var i=0;i<userItemList.length;i++){
    if(userItemList[i].id === id && userItemList[i].code === code){
      return 1;
    }
  }
  return 0;
};

var getAllItems = function() {
  return userItemList;
};



module.exports = {
  "addItem": addItem,
  "removeItem":removeItem,
  "updateItem":updateItem,
  "getItems":getItems,
  "emptyProfile":emptyProfile,
  "getItemIndex":getItemIndex,
  "getCurrentItemByCode":getCurrentItemByCode,
  "isItemSaved":isItemSaved
};
