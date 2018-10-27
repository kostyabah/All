var Dom = function(elem, parent){
  this.parent = parent;
  this.el = elem;
  this.attrs = elem.attributes;
  this.tmpl = elem.innerHTML;
  this.display = elem.style.display;
  this.child = Dom.setChild(elem, this); 
}
Dom.setChild = function(elem, parent){
  return Array.from(elem.children)
  .map(function(child){
    return new Dom(child, parent) 
  })
}
Dom.equal =function(first, second){
  
},
Dom.prototype = {
  test : function(){
    var dom = this, n=0;
    while(dom = dom.parent){
      if("list" in dom) return false;  
    }
    //dom.list = dom.list.replace(this.tmpl, this.list);
    return true;  
  }
}
var Q = function (el, data) {
  var element = document.querySelector(el);
  this._dom = new Dom(element);
  this._data = data;
  this._copy = {};
  var that = this;
  var update = function(){
      
    Glf(that._dom, that._data, that);
    //console.groupEnd("end", that)
    that._copy = JSON.parse(JSON.stringify(that._data));
  }
  var getter = function(key){
    return function(){
      var value = that._data[key]
      if(!Dom.equal(that._data, that._copy))
        update();
      return that._data[key];
    }
  }
  var setter = function(key){
    return function(value){
      that._data[key] = value;
      update();
    }
  }
  var assign = function(obj, key){
    Object.defineProperty(obj, key, {
      get : getter(key),
      set : setter(key)
    })
  }
  Object.keys(that._data).forEach(function(key){
    assign(that, key);
    //assign(that.app, key);
  })

  update();
}



var Glf = function(dom, data, main){

  var el = dom.el;
  Array.from(el.attributes)
  .forEach(function(attr){
    
    //console.log(attr.name+" : "+attr.value)
    if(attr.name.indexOf("-") > -1){
      var args = attr.name.split("-");
      var getArg = event[args[1]];  

      var type = "on" + [args[0]];
      
      if(el[type]!==null) return;
      console.log(type);
      el[type] = function(e){
        var copy = JSON.stringify(data);
        var arg = getArg(e, this);
        //console.log(data, attr.value);
        //console.log(arg);
        var end = data[attr.value](arg);


        if (copy == JSON.stringify(data))
          return
        //console.group("--------start------------", this);
        Glf(main._dom, data, main);
        main._copy = JSON.parse(JSON.stringify(data));
        //console.groupEnd("--------end--------", this);
        if(end)
          return end;
      }
      return;
    }
    if(!plan[attr.name])
      return;
    var prop = attr.value.split("_").slice(-1)[0];
    var old_data = parser(main._copy, prop);
    var model = parser(data, prop);
    var notChange = Dom.equal(model, old_data);
    
    if(notChange && dom.test()) {
      return; 
    }
    //if(attr.name == "each");
      //dom.flag = false;    
    //console.log(notChange);
    plan[attr.name](el, model, dom, attr.value);
  })
  
  if(!el.childElementCount) return;
  
  //Array.from(el.children)
  dom.child.forEach(function(child){
    Glf(child, data, main);
  })
  if("list" in dom)
    delete dom.list;
}
  
var parser = function(data, link){
  
  return link.split(".")
  .reduce(function(res, value){
    //console.log(res, value)
    if(res === undefined)
      return;
    return  res[value];
  }, data);
   
}

var methods = {
  
}

var event = {
  on : function(e, that){
    return that;  
  },
  dlg : function(e, that){
    return e.target
  },
  
  point : function(e, that){
    return {
      x : e.clientX - that.clientLeft,
      y : e.clientY - that.clientTop,
      which : e.which,
      shift : e.shiftKey,
      alt : e.altKey,
      ctrl : e.ctrlKey
    }
  }  
}     
var plan = {
  menu : function(el, data){
    el.oncontextmenu = function(e){
      data({
        x: e.clientX,
        y: e.clientY
      });
      return false;
    }  
  },
  on : function(el, data){
    Object.keys(data).forEach(function(key){
      var func = data[key];
      el.addEventListener(key, func, false)
    })  
  },
  key : function(el, data){

    el.onkeydown = function(e){
      switch(e.keyCode){
        case 104 :
          data.enter();
          break;
        case 105 :
          data.space();
          break;
        case 40 :
          data.left();
          break;
        case 38 :
          data.right();
          break;
        case 42 :
          data.top();
          break;
        case 36 :
          data.bottom();
          break;
        default :
          data[e.keyCode]();
          break;              
      }    
    }  
  },
     
  if : function(el, data, dom){
    
    if(!data){
      el.style.display = "none"
    }else{
      el.style.display = dom.display;
    }
  },
  each: function(el, data, dom, key){
    //console.log(data);
    el.innerHTML = "";
    if(Object.keys(data).length == 0){
      dom.child = [];
      return;
    }
  

    var template = dom.tmpl;
    key = key.split("_")[0];
    var reg = new RegExp(key+"(-k|-n|-v(\\.\\w+)+|-v)","gi")
    
    var reduce = function(prop, value, n){
      
      var result = template.replace(reg, 
        function(change){
          if(change == key+"-k")
            return prop
          else if(change == key+"-v")
            return value
          else if(change == key+"-n")
            return n        
          else{
            change = change.replace(key+"-v.","")
            //console.log(change, value);
            return parser(value, change) 
          }
        });
      return result;
    }
  
    var n = 0;
    dom.list = "";    
    for(prop in data){
      dom.list += reduce(prop, data[prop], n++)  
    }

    
    
    el.innerHTML = dom.list;    
    console.log(el.innerHTML)   
    dom.child = Dom.setChild(el, dom);
    //console.log(dom);
  },
  css: function(el, value){
    Object.assign(el.style, value) 
  },
  attr: function(el,value){
    Object.assign(el, value)
  },
  text: function(el, value){
    el.textContent = value
  }
};
