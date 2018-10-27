//  Simple strategy : split the field into 3 parts (with 1:2:3 proportion) and each player will control its part.
//
//  Player 0 - goalkeeper
//  Player 1 - defender
//  Player 3 - playmaker
//  -------------------------
//  |   |      |            |
//  |   |      |            |
//  | 0 |  1   |     2      |
//  |   |      |            |
//  |   |      |            |
//  -------------------------
//
//  Each player is responcible to kick out the ball from its zone.
'use strict';

function getPlayerMove(data) {
  var team = data.yourTeam.players;
  var currentPlayer = team[data.playerIndex];
  
  var ball = data.ball;
  var ballStop = ball;//getBallStats(ball, data.settings);  
  
  var sixthPartOfFieldWidth = data.settings.field.width / 6 ;
  var playerZoneStartX = sixthPartOfFieldWidth * [0,1,3][data.playerIndex];
  var playerZoneWidth = sixthPartOfFieldWidth * [1,2,3][data.playerIndex];

  var direction = currentPlayer.direction;
  var velocity = data.settings.player.maxVelocity;
  var action = function(act, player){
     return getDistance(act, ballStop) < getDistance(player, ballStop) ? act : player; 
  }  
  if ((ballStop.x > playerZoneStartX) && (ballStop.x < playerZoneStartX + playerZoneWidth)
       ||  team.reduce(action) == currentPlayer) {
    // ball stops in the current player zone
    const ballRadius = ball.settings.radius;
    if (ballStop.x - currentPlayer.x > ballRadius) {
       // can go and kick it to the opponent side
       direction = getDirectionTo(currentPlayer, ballStop);
       velocity = data.settings.player.maxVelocity; // dont care about acceleration, game engine reduce it to max allowed value
    } else {
       // do not kick to the my goalpost, move to the position behind the ball
       
       var stopPoint = {
         x: ballStop.x - ballRadius * 2,
         y: ballStop.y + (ballStop.y > currentPlayer.y ?  - ballRadius : + ballRadius) * 2
       }
       direction = getDirectionTo(currentPlayer, stopPoint);
       velocity = data.settings.player.maxVelocity;
       //getDistance(currentPlayer, stopPoint);
    }
  } else {
    // ball stops in the other player zone, let move the current player to its zone and wait
    var zonePoint = {
      x: playerZoneStartX + 10,
      y: ball.y + Math.random() * 40 - 20
    };
    direction = getDirectionTo(currentPlayer, zonePoint);
    velocity = data.settings.player.maxVelocity;
  }
        
  
  return {
    direction: direction,
    velocity: velocity
  };
}

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


onmessage = (e) => postMessage(getPlayerMove(e.data));
