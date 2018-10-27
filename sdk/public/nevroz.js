function getDirectionTo(startPoint, endPoint) {
  return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
}

function getDistance(point1, point2) {
  return Math.hypot(point1.x-point2.x, point1.y - point2.y);
}
function getSituation(data) {
  function guestSort(Apl, Bpl){

    return Apl.x - Bpl.x;  
  }
  function homeSort(Apl, Bpl){

  };
  var ball = data.ball;
  function sortDistanse(first, second){
    var fr = getDistance(first, ball);
    var sec = getDistance(second, ball);
    return (sec - fr)*(-1);  
  }   
  var indexDistanse;

  //var ball = data.ball; 
  var guest = data.opponentTeam.players.slice();
  var home = data.yourTeam.players.slice();
  guest.sort(sortDistanse);
  home.sort(sortDistanse);
  var all = home.concat(guest);
  all.sort(sortDistanse);
  var Xstate = home.slice();
  Xstate.sort(function(Apl, Bpl){ return Apl.x - Bpl.x });
  var indexBall = 3;
  for(var index = 0; index < Xstate.length; index++){
    //console.log(ball.x+"="+Xstate[index].x);

    if(ball.x < Xstate[index].x){
      indexBall = index;
      break; 
    }  
  }   
  return { guest, home, all, Xstate, indexBall};    
}

var strateg = [
  ball,
  {
    x : ball.x - data.settings.ball.radius,
    y : player.y
  },
  {
    x : player.x,
    y : ball.y
  },
];  


var positive = [];
var error = [];
var state = 3;

var known = {
  result : [1, 0, 0],
  index : 0,
  next : function(index){
    if(index < result.length){
      //var count = result[index];
      this.result[index-1] = 0;
      this.result[index] = 1;
    }else{
      
    }
  }
}
var baza = [1,0,0];
function sliyan(fr, sec){
  var result = fr.slice()
  for(var n = 0; n < fr.length){
    result[n] = (fr[n]+ sec[n]) / 2;
  }
  return result;
}
function generator(number){
  var otvet = baza.slice();
  if(number < baza.length){
    otvet[number] = 1;
    otvet[number - 1] = 0;
  }else{
    otvet = sliyan(generator(0),generator(1))
  }
  return otvet;
}
function getPlayerMove(data){
  /*
  var sit = getSituation(data);
  var home = sit.home;
  var guest = sit.guest;
  var index = sit.home.indexOf(player);
  */
  var player = data.yourTeam.players[data.playerIndex];
  var ball = data.ball;
  //console.log(home);
  var result = [1, 0, 0, 0, 0];  
  if(state > sit.indexBall 
    && sit.indexBall == sit.Xstate.indexOf(player)){

    error.unshift({
      key : { player, ball },
      value : result   
    });
    result = next(result);
    console.log("error");
    console.log(error);
    state = sit.indexBall;
  }
  else if(state < sit.indexBall
    && sit.indexBall == sit.Xstate.indexOf(player)){
    positive.unshift({
      key : error[0].key,
      value : result
    })
    state = sit.indexBall;
  }
  result = error.reduce(function(res, elem){
    if(elem.key == { player, ball })
      return elem.value;
  }, result);
  var direct = strateg.reduce(function(res, value, ind){
    //console.log(ves[index][ind]);
    return  {
      x : res.x + value.x * result[ind],
      y : res.y + value.y * result[ind]
    }
  },{ x : 0, y : 0});
  
  var direction = getDirectionTo(player, direct);
  var velocity = data.settings.player.maxVelocity;
  return {velocity, direction};
}


onmessage = (e) => postMessage(getPlayerMove(e.data));