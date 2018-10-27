function getDirectionTo(startPoint, endPoint) {
  return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
}

function getDistance(point1, point2) {
  return Math.hypot(point1.x - point2.x, point1.y - point2.y);
}

function random(from, to){
  return from + (to - from) * Math.random();
}

function getProba(player, ball){
  return {
    x : player.x + (ball.x - player.x) * Math.random(),
    y : player.x + (ball.y - player.y) * Math.random(),
  } 
}
  
var direct = null;
var known = [];
function getPlayerMove(data){
  //console.log(data);
  
  var player = data.yourTeam.players[data.playerIndex];
  var ball = data.ball;
  var radius = data.settings.ball.radius;
  var proba = getProba(player, ball);
  

  
  //ball.direction != direct || 
  if(ball.velocity > 0 && ball.direction != direct){
    direct = ball.direction;
    known.push({
      direct : direct,
      ball : ball,
      x : radius * Math.cos(direct),
      y : radius * Math.sin(direct)
    });
  }
  var result;
  var best = function(err, oput){
    
    return getDistance(ball, oput.ball) < getDistance(ball, err) 
          ? oput.ball : err; 
  }

  known.forEach(function(proba, index){
    
  });
  //var result = best(player, ball, proba);
  var pi = Math.PI;     
  var direction = getDirectionTo(player, shubalo) //+ random(-pi/2, pi/2);
  var velocity = data.settings.player.maxVelocity;
  return {velocity, direction};
}

function getShortBall(start, known){

}
onmessage = (e) => postMessage(getPlayerMove(e.data));