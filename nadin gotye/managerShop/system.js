var goods = document.getElementById("goods");
var selColor = document.getElementById("color");

var fash = document.getElementById('model');

var butik = document.getElementById("shop");
var view = document.getElementById("view");
var control = {

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
      alert("Введите код");
      return; 
    }
     
    Siller.store = market[butik.value];
    Siller.state = view.value;
    Siller[run](this.dress);
    view.onchange();
    Store.write(market, "market");
  } 
}

window.onload = function(){
  
  color.forEach(function(gr, ind){
  selColor.appendChild(new El("optgroup",{label: ind+1 +"-я категория"}, 
      gr.map(function(v){
        return new El("option", v);
      })  
    ))
  });

  var keys = Object.keys(market);
  if(keys.length){
    Tree.order = "unshift";
    Tree.run(keys,["option"], butik);
  }
  else{
    check("#shop");
    return  
  }
  butik.selectedIndex = 0;
  view.onchange();
};
fash.onchange = function(){
  control.dress.model = fash.value;
  tool.model
    [control.dress.code.replace(" ","")] = fash.value;
  Store.write(tool, "tool");
  //Store.write(market, "market");
}
var selectShop = function(elem){
  if(elem.value == "add"){
    console.log(elem.value)  
    check("#shop");
    return;
  }
  view.onchange();
}
var audit = function(elem) {
   
  control.dress[elem.id] = elem.tagName == "INPUT" ?
    elem.value : 
    elem.options[elem.selectedIndex].text;
  if(elem.id == "code"){
    if(elem.value in tool.model){
      fash.value = tool.model[elem.value];
      control.dress.model = fash.value;
    }
    else{
      fash.value ="";
      control.dress.model = "нет товара";
    }
    control.dress.code = " " + control.dress.code;
  }
         
}

var load = function(type){
  
  var parent = goods.parentNode;
  parent.removeChild(goods);
  goods = new El("table", {id :"goods", border : 10});
  parent.appendChild(goods);
  var table = market[butik.value][type];
  if(!Object.keys(table).length)
    return;
  Tree.order = "push";
  Tree.run(table, ["tr","td"], goods);
  
  goods.ondblclick = trSel;
}  

var trSel = function(e){
  var store = market[butik.value];
  //console.log(store.sostav);
  var row = e.target.parentNode;
  var cells = Array.from(row.cells);
  var dr = {
    date : cells[0].textContent,
    code : cells[1].textContent,
    model: cells[2].textContent,
    color: cells[3].textContent,
    size: cells[4].textContent,
    count: cells[5].textContent
  };
  Siller.store = store;
  Siller.state = view.value;
  Siller.find(dr);
  view.onchange();    
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