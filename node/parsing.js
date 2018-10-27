var request = require("request"),
    cheerio = require("cheerio"),
    Promise = require("promise"),
    pr = require("./reader"),
    header = "https://ru.corner-stats.com",
	$,
	linkes = ["/premier-league/ukraine/tournament/6"]; 
var data = "table>tr>td>table>tr";
var hrefSl = 'div[style="margin-left:15px; margin-top:10px; font-size:12px; "]>a'; 
var filter = function(){
	return true
};

request(header+linkes[0], function(er, res, body){
	var $ = cheerio.load(body);   
    var result = $(hrefSl);
    result.each(function(i, elem){
    	linkes.push($(elem).attr("href"));
    });
   
    var check = new Wait(linkes);
    for(var i=0; i<linkes.length; i++){
    	check = check.then(
    	function(model){
    		console.log(model.hrefs.shift());
    		model.add();
    		console.log();
	    	return new Wait(model.hrefs);
	    });	
    }
    /**/
});

var Wait = function(linkes){
	return new Promise(function(resolve, reject){
		request(header+linkes[0], function(er, res, body){
		    var model = new Model(body);
		    if(body)
		    	resolve(model);
		    else{
		    	console.log(model.result);
		    	//writeFile(model.result);
		    }	
		});	
	});
};

var Model = function(body){
	this.hrefs = linkes;
	this.result = mass;
	if(!body){
		console.log("ibody");
		return;
	}
	var $ = cheerio.load(body);
	this.data = $(data);
	this.add = function(){
		this.data.each(function(i, elem){
			var str = $(elem).text()
				.replace(/\s+[\r\n]\s+/gi, " ");
			mass.unshift(str);
		});
	}
}

var writeFile = function(obj, name){
	name = name || "front/history.json";
	require('fs').writeFileSync(
		'./'+name, JSON.stringify(obj, null, 4));
}
var mass = [];


var reg = new RegExp("","gi");