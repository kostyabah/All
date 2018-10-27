var lS = window.localStorage;
var Shop = function(name){
  this.name = name;
  this.sostav = {};
  this.history= {};    
}

var Siller = {
  store : {},
  state : "",
  intro  : function(dress){
    if(this.state !== "sostav"){
      getModel(this.store.sostav, dress, -1);
    }
    getModel(this.store[this.state], dress, 1);
  },
  
  delete : function(dress){
    var store = this.store[this.state];
    var key = Object.keys(store)
          .slice(-1)[0];
    var dr = store[key].pop();
    if(!store[key].length)
      delete store[key];
    if(this.state == "sostav")
      return;
    getModel(this.store.sostav, dr, 1);
  },
  update : function(dress){
    this.delete(dress);
    this.intro(dress);
  },
  find : function(dress){
    getModel(this.store[this.state], dress, 0);
  }
}

var format = {
  prodaj : [],
  intro : []
}

var compare = {

  pattern : ["count"],
  equal : function (elem, store){
    for(prop in elem){
      if(this.pattern.indexOf(prop)>-1)
        continue;
      if(elem[prop]!=store[prop])
        return false;
    }
    //console.log(elem);
    return true;
  }
}
var getModel = function(store, dress, n){
  n *= dress.count;
  if(store && dress.code in store)  
  	store[dress.code] = getItem(store[dress.code]);
  else
  	store[dress.code] = [copy(dress)]; 
  var index = store[dress.code];
  delete store[dress.code];
  
  if(index.length){
    store[dress.code] = index;
  }
  
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
   // console.log(compare);
    compare.pattern = n < 1 ?
      ["count","date", "model"] : 
      ["count","model"];
    
    for(var i=0; i<item.length; i++){
      if(compare.equal(dress, item[i])){
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
          alert("Нет товара "
            +JSON.stringify(dress,"",4));
         // dress.code = null;
          break;
        }  
      }
      item[i].model = dress.model;  
    }
    item.forEach(function(it){
     it.model = dress.model; 
    })
    return item;
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

var initStore = function(exam){
  for(prop in exam){
    if(!lS.getItem(prop))
      Store.write(exam[prop], prop);
  }
}

initStore({
  market : {},
  tool: {
    model: model,
    color: color
  }
});


  