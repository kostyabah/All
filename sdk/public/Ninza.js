function random(from, to){
  return from + (to - from) * Math.random();
}
function getDirectionTo(startPoint, endPoint) {
  return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
}

function getDistance(point1, point2) {
  return Math.hypot(point1.x - point2.x, point1.y - point2.y);
}
var score = [0, 0];
var oldBall = null;
var direct = 0;
var print = function(){

}

var event = function(data, ball){
  if(data.yourTeam.goals > score[0]){
     score[0]++;
     console.log("--------YYEESS-------");
     console.log(score.join(" : ")); 
  }
  else if(data.opponentTeam.goals > score[1]){
    score[1]++;
    console.log("----OH--MY---GOD-----");
    console.log(score.join(" : "));  
  }
  else if(direct != ball.direction){
    //oldBall.velocity = ball.velocity;
    //oldBall.direction = ball.direction;
    direct = ball.direction;
    var procent = ball.x * 100 / width;
    console.log(Math.round(procent));  
  }
} 
var ball = ""
function getPlayerMove(data){
  //console.log(data);

  var player = data.yourTeam.players[data.playerIndex];
  ball = data.ball;

  //console.log(data)

  var width = data.settings.field.width;
  var radius = data.settings.ball.radius;
  
  //else if(){}
  var segm = ball.x - player.x < radius 
      ? random(0, Math.PI/4) : 0;
  segm = ball.y > player.y ? -segm : segm
  var around = (ball.x - player.x) * Math.PI / width; 
  var proba = random(-around, around);  
  var direction = getDirectionTo(player, ball)
       + proba - segm;
  var velocity = data.settings.player.maxVelocity;
  return {velocity, direction};
}


onmessage = (e) => postMessage(getPlayerMove(e.data));