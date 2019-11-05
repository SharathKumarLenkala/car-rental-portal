var Item = require('../models/item');

itemDataByProductCode = {};
var allItemsData = [];
Item.allItemsData().exec(function(error, allItems){
  allItemsData = allItems;
  allItems.forEach(function(item) {
    item['imageUrl'] = "../assets/images/" + item['image'];
    itemDataByProductCode[item.code] = item;
  });
});


var getItems = function() {
  return allItemsData;
};

var getItem = function(code) {
  return itemDataByProductCode[String(code)];
};

var getItemByCode = function(code) {
  for(var i=0; i<allItemsData.length;i++){
    var item = allItemsData[i];
    if(item.code === String(code)){
      return item;
    }
  }
};

var getItemsByCategory = function() {
  var getItemsByCategory = {};
  allItemsData.map(function(itemObject) {
    if (Object.keys(getItemsByCategory).includes(itemObject['category'])) {
      var curData = getItemsByCategory[itemObject['category']];
      itemObject['imageUrl'] = "../assets/images/" + itemObject['image'];
      curData.push(itemObject);
      getItemsByCategory[itemObject['category']] = curData;
    }
    else {
      getItemsByCategory[itemObject['category']] = [itemObject]
    }
  });
  return getItemsByCategory;
};

module.exports = {
  "getItems": getItems,
  "getItem": getItem,
  "getItemsByCategory": getItemsByCategory,
  "getItemByCode":getItemByCode
};
