window.onload = function(e){
  var svg = document.querySelector("svg");
  Array.from(svg.children).forEach(getAttr)
  var reg = new RegExp("(n[a-z]+)|[^n\W\d][a-z]*","gi") 
  var text = "20*n*n%50" 
  console.log(text.match(text))
}

var setAttr = function(elem, data){
  
  for(prop in data){
    var value = data[prop];
    if(Array.isArray(value)){
      value = value.join(", ");
    }else if(typeof value =="object"){
      value = Object.keys(value)
      .reduce(function(res, key){
        return `${res} ${key}: ${value[key]};`
      }, "")
    }

    elem.setAttribute(prop, value)
  }
}
var getAttr = function(elem){
  var tag = elem.tagName.toLowerCase(); 
  var attr ={}, props = elem.attributes;
  for(var n = 0; n < props.length; n++){ 
    attr[props[n].name] = props[n].value;
  }
  Object.assign(Art, attr)
  console.log(Art);
  setAttr(elem, Art[tag])
    
}

var getFormul = function(text){

  while(text.search(/(n\w+)|[^n\W\d]\w*/gi) > -1){
    text = text.replace(/(n\w+)|[^n\W\d]\w*/gi, function(change){
      return '('+Art[change]+')'
    })
  }
  
  return Function("n", `return ${text}`);
}
var helper = {}
var Art = {
  hue : 0, sat : 0, light : 0, opacity : 1, 
  fill: false, width: 1,
  
  get color(){
    return `hsl(${this.hue}, ${this.sat}%, ${this.light}%)`
  },
  get points() {
    var res = "";      
    for(var n = 0; n < this.max; n++){
      res = `${res}${this.xfun(n)},${this.yfun(n)} `
    }
    return res
  },
  get list(){
    var result = [];
    for(var n = 0; n<this.max; n++){
      result.push({
        x : this.xfun(n),
        y : this.yfun(n),
        dx : this.dxfun(n),
        dy : this.dyfun(n) 
      })
    }
    if(this.fill)
      result.push(result[0]);
    console.log(result)
    return result;
  },
  get xfun(){
    return  getFormul(this.x);
  },
  get yfun(){
    return getFormul(this.y);
  },

  get dxfun(){
    return getFormul(this.dx);
  },
  get dyfun(){
    return getFormul(this.dy);
  },
  
  get d(){   
    return this.list.reduce(function(res, val, ind){
      if(ind==0){
        return `M ${val.x},${val.y} C${val.x+val.dx},${val.y+val.dy} `  
      }else if(ind==1){
        return res + `${val.x-val.dx},${val.y-val.dy} ${val.x},${val.y}` 
      }else{
        return res + `S${val.x-val.dx},${val.y-val.dy} ${val.x},${val.y}`  
      }
    },"");
  },

  get polyline(){
    return {
      points : this.points,
      fill : this.color,
      "fill-opacity" : this.opacity,
    }
  },
  get polygon(){
    return this.polyline
  },
  get path(){
    return {
      d : this.d,
      fill : this.fill ? this.color : "none",
      "fill-opacity": this.fill ? this.opacity : "none",
      stroke : !this.fill ? this.color : "none",
      "stroke-opacity": !this.fill ? this.opacity : "none",
      "stroke-width": this.width
    }  
  }
};