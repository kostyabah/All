function getDirectionTo(startPoint, endPoint) {
  return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
}

function getDistance(point1, point2) {
  return Math.hypot(point1.x-point2.x, point1.y - point2.y);
}

function getBallStats(ball, gameSettings) {
  var stopTime = getStopTime(ball);
  var stopDistance = ball.velocity * stopTime
    - ball.settings.moveDeceleration * (stopTime) * stopTime / 2;

  var x = ball.x + stopDistance * Math.cos(ball.direction);
  var y = Math.abs(ball.y + stopDistance * Math.sin(ball.direction));

  // check the reflection from field side
  if (y > gameSettings.field.height) y = 2 * gameSettings.field.height - y;

  return { stopTime, stopDistance, x, y };
}

function getStopTime(ball) {
  return ball.velocity / ball.settings.moveDeceleration;
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

function random(from, into){
  return start + (end - start) * Math.random();
}
function getMiddle(first, second){
   return {
     x : (first.x + second.x) / 2,
     y : (first.y + second.y) / 2  
   } 
}
var probel =[];
var critic = [];
var decide = [
  function(player, sit, data){
    return {
      velocity : data.settings.player.maxVelocity,
      direction : getDirectionTo(player, data.ball)
    }
  },
  function(player, sit, data){
    var AttOpp = sit.guest[0];
    var distanseOpp = getDistance(AttOpp, data.ball);
    var distanse = getDistance(player, data.ball);
    var velocity = AttOpp.velocity * distanseOpp / distanse;
    velocity = velocity < data.settings.player.maxVelocity ?
               velocity : data.settings.player.maxVelocity;
    var direction = 2*getDirectionTo(player, AttOpp) 
                  - getDirectionTo(data.ball, AttOpp);
    var maxVelocity = data.settings.player.maxVelocity;
    if(data.ball.x < player.x){
      direction = getDirectionTo(player, AttOpp);
      velocity = maxVelocity;
    }                
    return {
      velocity : velocity,
      direction : direction
    };                 
  },
  function(player,  sit, daat){
    var opponent = sit.guest[0];
    return {
      velocity : data.settings.player.maxVelocity,
      direction : getDirectionTo(player, opponent)  
    }  
  },
  function(player, sit, data){
    var point = {
      x : random(player.x, data.ball.x),
      y : player.y
    };
    var direction = getDirectionTo(player, point);
    var velocity = data.settings.player.maxVelocity;
    return { velocity, direction }
  },
  function(player, sit, data){
    var point = {
      x : player.x,
      y : random(player.y, data.ball.y)
    };
    var direction = getDirectionTo(player, point);
    var velocity = data.settings.player.maxVelocity;
    return { velocity, direction } 
  },
  function (player, sit, data){
    var direction = getDirectionTo(player, point);
    var velocity = data.settings.player.maxVelocity;
    return { velocity, direction }   
  }
  
]
var flag = [false, false, false];
var isError = function(player, ball, sit, index){
  flag[index] = !flag[index]
  return flag[index] &&
    Math.cos(ball.direction) < 0 
    && sit.all.indexOf(player) == 0
}
var ves = [
  [ 1, 0, 0, 0, 0],
  [ 1, 0, 0, 0, 0],
  [ 0, 0, 1, 0, 0]
];
var positive = [];
var error = [];
function getPlayerMove(data){
  //console.log(data);
  var sit = getSituation(data);
  var player = data.yourTeam.players[data.playerIndex];
  var ball = data.ball;
  var home = sit.home;
  var guest = sit.guest;
  var index = sit.home.indexOf(player);
  //console.log(home);
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
    guest[0],
    player
  ];
  var delta = 0.2;
  if(isError(player, ball, sit, index)){
    //change
    ves[0] = ves[1].slice();
    error.push({player, ball, guest});
    //console.log("error");
    //console.log(error);
  }
  /*
  bestStrateg = decide.map(function(taktik){
    return taktik(player, sit, data)
  })
  .map(function(result){
    return {
      result : result,
      x : player.x + Math.cos(result.direction),
      y : player.y + Math.sin(result.direction)
    }
  })
  .reduce(function(proba, index){

  });  
  */
  var result = strateg.reduce(function(res, value, ind){
    //console.log(ves[index][ind]);
    return  {
      x : res.x + value.x * ves[index][ind],
      y : res.y + value.y * ves[index][ind]
    }
  },{ x : 0, y : 0});
  
  var direction = getDirectionTo(player, result);
  var velocity = data.settings.player.maxVelocity;
  return {velocity, direction};
}


onmessage = (e) => postMessage(getPlayerMove(e.data));