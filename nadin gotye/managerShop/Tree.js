var Tree = {
  order : "push",
  
  run: function(data, view, parent){
    var parent = parent || new El(view[0]);
    //console.log(data);
    for(prop in data){
      if(typeof data[prop] =="object"){
        var elem = new El(view[0]);
        if(elem.tagName == parent.tagName){
          HTML.unshift(parent.parentNode, elem);
        }
        else{
          HTML.unshift(parent, elem);
        }
        this.run(data[prop], view, elem);
      }
      else{
        var elem=new El(view.slice(-1)[0], data[prop]);
        HTML[this.order](parent, elem);
      }
    }
    if(!parent.childElementCount){
      var grand = parent.parentNode;
      grand.removeChild(parent);
    //return parent;
    }
  }
}

var HTML = {
  push : function(parent, child){
    parent.appendChild(child);
  },
  unshift : function(parent, child){
    parent.insertBefore(child, parent.firstElementChild);
  }
}

function El(tag){
  parent = parent || document.body;
  var el = document.createElement(tag);
  for(var index = 1; index<arguments.length; index++){
    var value = arguments[index];
    setValue(el, value);  
  }
  return el;
}

function setValue(el, value){
  if(value==undefined) return;
  if(value.constructor == Array){
    value.forEach(function(v){
      setValue(el, v);  
    });
  }
  else if(value instanceof HTMLElement){
    el.appendChild(value);  
  }

  else if(typeof value == "object"){
    for(at in value){
      el.setAttribute(at, value[at]);
    }  
  }  
  else{
    el.textContent = value;
  }    
}