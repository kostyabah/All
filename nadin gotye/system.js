var goods = document.getElementById("goods");
var selColor = document.getElementById("color");
var lab = document.querySelector("label");
var fash = document.getElementById('model');

var butik = document.getElementById("shop");
var view = document.getElementById("view");
var control = {
  
  shop : "зарозовая",
  dress : {
    date: new Date().getDate() +"."+
          (new Date().getMonth()+1),      
    //shop: "зарозовая",
    code: undefined,
    model: "нет в базе",
    color : "молочный",
    size : "S",
    count : 1
  },
   
  make : function(run){
    if(!this.dress.code){
      //console.log("Введите код");
      return; 
    }
    Siller[run](this.dress, market[butik.value]);
    view.onchange();
    Store.write(market, "market");
  } 
}

window.onload = function(){
  
  if(Object.keys(market).length){
    check("#newShop");
  }
  color.forEach(function(gr, ind){
  selColor.appendChild(new El("optgroup",{label: ind+1 +"-я категория"}, 
      gr.map(function(v){
        return new El("option", v);
      })  
    ))
  });
  var keys = Object.keys(market);
  if(!keys.length)
    return;
  Three(keys,["option"], butik);
  view.onchange();
  //console.log("привет"); 
};
fash.onchange = function(){
  fash.style.display = "none";
  lab.style.display = "block";
  lab.textContent = control.dress.model = fash.value;
  tool.model[control.dress.code] = fash.value;
  Store.write(tool, "tool");
}
var audit = function(elem) {

  if(elem.id == "shop"){
    //market[elem.id] = elem.value
    view.onchange();
    return;
  } 
  control.dress[elem.id] = elem.tagName == "INPUT" ?
    elem.value : 
    elem.options[elem.selectedIndex].text;
  if(elem.id == "code"){
    if(elem.value in tool.model){
      fash.value = tool.model[elem.value];
      fash.style.display = "none";
      lab.style.display = "block";
      lab.textContent = control.dress.model = fash.value;
    }
    else{
      lab.style.display = "none";
      fash.style.display = "block";
      fash.value ="";
    }
    control.dress.code = " " + control.dress.code;
  }
         
}

var load = function(type){
  var table = market[butik.value][type];
  if(!Object.keys(table).length)
    return;
  var parent = goods.parentNode;
  parent.removeChild(goods);
  goods = new El("table", {id :"goods", border : 10});
  parent.appendChild(goods);
  Three(table, ["tr","td"], goods);
  //goods.ondbclick = trSel;
}  

var trSel = function(e){
  var row = e.target.parentNode.cells[1];
  console.log(row);
}
function search(){
  //control.dress = new control.dress();
  onload();
}
function del(){
  //control.dress = new control.dress();
  lS.clear();
  onload();
}