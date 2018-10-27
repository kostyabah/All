var getConfig = function(){
  fetch("config.json").then(function(res){
    return res.json()
  }).then(function(data){
    console.log(data);
  });
}
var different = 0, start = true;
 
function getDirectionTo(startPoint, endPoint) {
  return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
}

function getDistance(point1, point2) {
  return Math.hypot(point1.x - point2.x, point1.y - point2.y);
}

function getInput(data){
  var index = data.playerIndex;
  var your = [
    data.yourTeam.players[(data.playerIndex+1)%3],
    data.yourTeam.players[(data.playerIndex+2)%3]
  ];
  var vrag = data.opponentTeam.players;  
  var ball = data.ball;
  var field = [
    {
      x : 0,  y: 0
    },
    {
      x : data.settings.field.width,  y: 0
    },
    {
      x : 0,  y: data.settings.field.height
    },
    {
      x : data.settings.field.width,  
      y : data.settings.field.height
    }
  ]
  var player = data.yourTeam.players[index]
  
  var  all = [ball].concat(your).concat(vrag).concat(field);
  return all.map(function(point){ 
    return {
      x: point.x - player.x,
      y: point.y - player.y,
      dist : getDistance(point, player)
    } 
  })
}

var generate = function(){
  var modific = [];
  for(var n = 0; n<10; n++)
    modific.push(Math.random());  
  return modific;  
}

//==========================================================

function getPlayerMove(data){
  var all = getInput(data);
  var ball = data.ball
  var state = new Position(all);
  var player = data.yourTeam.players[data.playerIndex]
  var bonus = data.yourTeam.goals - data.opponentTeam.goals;
  bonus -= different; 
  different += bonus;
  
  base.action = generate();

  /*
  if(bonus != 0){
    match.append(path);
  }
  
  else */
  if(pickBall(ball)){
    
    var strateg = new Strateg();
    strateg.state = state;
     
    if(base.strategs.length){
      var rating = ball.velocity*Math.cos(ball.direction);
      //console.log(rating);
      rating = 50*Math.exp(rating / 20);
      //console.log(rating);
      //console.log("---------------------")
      base.strategs[0].rating = rating > 90 ? 90 : rating;    
    }
      
    base.correct(all)
    strateg.action = base.action;
    base.strategs.unshift(strateg);

  }else{
    //console.log("hi");
    base.correct(all);
  }
  
    
  var result = all.reduce(function(res, value, ind){
    
    return {
      x : res.x + value.x * base.action[ind],
      y : res.y + value.y * base.action[ind]
    }
  }, { x : 0, y: 0});
  
  var direction = getDirectionTo(player, result);
  var velocity = data.settings.player.maxVelocity;
  return {velocity, direction};

}



var direct = 0, speed = 0
function pickBall(ball){
  var flag = true;
  
  if(ball.velocity){
    
    if(ball.direction != direct){
      direct = ball.direction
    }else if(ball.velocity > speed){

    }else{
      flag = false;
    }
    speed = ball.velocity
  }else{
    flag = false;
  } 
  return flag;
}

var base = {
  
  depthCof : 1,
  multi : 15,
  action : [],
  strategs : [],
  //state : null,
  correct : function(state){
    var that = this;
    var compare = function(pos1, pos2){
      return pos1.equals(state) > pos2.equals(state); 
    }

    if(!this.strategs.length)
      return;    
    var like = this.strategs
    .reduce(function(res, strateg, ind){
      //console.log(res.state)  
      if(ind && compare(res.state, strateg.state)){
        return res;   
      }else{
        return strateg;
      }  
    })
    
    var known = 50 * Math.exp(like.rating / 5)
    if(known > 90) known = 90;
    this.action = this.action.map(function(value, index){
       return (like.action[index]*known + value*(100-known))/100; 
    })  
  }
    
}

function Strateg(){
  this.action = [];
}
Strateg.prototype = {}

function Position(points){
  this.points = points
}
var middle = function(ves){
  return function(res, value,ind){
    return res + value*ves[ind];  
  } 
}
Position.prototype = {
  equals : function(other){
    var that = this;
    var ves = [5,0,0,2,2,2,2,1.5,2,1.5]
    var ves1 = [1,0,0,0,0,0,0,0,0,0]
    return other.map(function(point, index){
      var currPoint = that.points[index];
      return Math.exp(-getDistance(currPoint, point)/10);
    }).reduce(middle(ves), 0);  
  }
}
onmessage = (e) => postMessage(getPlayerMove(e.data));