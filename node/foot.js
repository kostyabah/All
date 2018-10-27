
var fs = require('fs');
/*
fs.readFile('example_log.txt', function (err, logData) {
  if (err) throw err;
  var text = logData.toString();
});
*/
var we = "Черноморец Одес";

function Match(str){
	
	this.date=str.match(/\d\d\/\d\d\/\d\d/gi)[0];
	this.players = str.match(/[а-яё]+(\s+\(?[а-яё]+)?/gi);
	this.count=(function(str){
		var count = str.match(/\d\s+:\s+\d/gi);
		if(count){
			return count.join("").match(/\d/gi);	
		}
		else
			return null;
	})(str);
	
}

function Player(name){
	this.name=name;
	this.matches = [];
};
Player.prototype = {
	setMatch : function(match, i){
		var result={};
		for(key in match){
			result[key]=match[key];	
		}
		
		result.state = i==0? "home" : "guest";
		result.opponent=this.getOpponent(match);
		this.matches.unshift(result);
	},
	
	getOpponent : function(match){
		var index = match.players.indexOf(this.name);
		index = index==0? 1 : 0;
		return match.players[index]; 
	}
};

var Send = {
	ask : {},
	addMatch : function(name, match, i){
		if(!(name in this.ask)){
			this.ask[name] = new Player(name);
		}
		this.ask[name].setMatch(match, i);
	},
	between : function(name, bef, after){
		//console.log(this);
		return this.ask[name].matches.slice(bef, after);  
	} 
};


function addMatch(match){
	match.players.forEach(function(name, i){
		Send.addMatch(name, match, i);
	});
	//delete match.players;
}