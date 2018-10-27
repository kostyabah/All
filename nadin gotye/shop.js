var lS = window.localStorage;
var Shop = function(name){
  this.name = name;
  this.sostav = {};
  this.history= {};    
}

var Siller = {
  prodaj : function(dress, store){
    getModel(store.sostav, dress, -1);
    getModel(store.history, dress, 1);
  },
  intro  : function(dress, store){
    getModel(store.sostav, dress, 1);
  },
  move : function(dress, from, to){
    getModel(from.sostav, dress, -1);
    getModel(to.sostav, dress, 1);
  }
}

var format = {
  prodaj : [],
  intro : []
}

var getModel = function(store, dress, n){
  
  n *= dress.count;
  if(store && dress.code in store)  
  	store[dress.code] = getItem(store[dress.code]);
  else
  	store[dress.code] = [copy(dress)]; 
  var index = store[dress.code];
  delete store[dress.code];
  console.log(store);
  if(index.length){
    store[dress.code] = index;
  }
  console.log(store);
  function copy(dress){
    //var arr = [];
    var first = {};
    for(prop in dress){
      first[prop] = dress[prop];
    }
    //arr.push(first);
    return first;
  }
  function getItem(item){

    for(var i=0; i<item.length; i++){
      if(equal(dress, item[i])){
        item[i].count = 
            parseInt(item[i].count) + n; 
        if(item[i].count!=0){
          item.push(item[i]);
        }
        item.splice(i,1);
        break;
      }  
      else if(i+1 == item.length){
        if(n>0){
          item.push(copy(dress));
          break;  
        }
        else{
          dress.code = null;
          return;
        }  
      }  
    }
   
    return item;
  }
  function equal(elem, store){
    for(prop in elem){
      if(prop == "count")
        continue;
      if(elem[prop]!=store[prop])
        return false;
    }
    //console.log(elem);
    return true;
  }
    
}

var lS = window.localStorage;
var Store = {
  write : function(data, key){
    var getJSON = function(data){
      return typeof data == "string" ?
        data : JSON.stringify(data);
    };
    if(key){
      lS.setItem(key, getJSON(data));  
    }
    else{
      for(prop in data){
        lS.setItem(prop, getJSON(data[prop]));
      }
    }  
  },
  read : function(key){
    if(key){
      return JSON.parse(lS.getItem(key));
    }
    else {
      return Object.keys(lS);
    }
  }
}

if(!lS.length){
  console.log("hi");
  Store.write({
    tool : {
      color : color,
      model: model
    },
    market : {}
  });
}
  