var pr = require("./wait"),
	Promise = require("promise"),
	iconv = require("iconv-lite"),
	fs = require("fs");
var dir = "C:/Users/Hp/Desktop/Астрология/Zet 9/DBase/История/";	
dir = dir.replace("/","\\");

pr.dir({
	head : dir
}).then(function(list){
	//console.log(list);
	list.make = function(data){
		//console.log(data.head);
		console.log();
		return iconv.encode 
			(iconv.decode (data.body, 'win1251'), 'utf8')
			.toString().length;
	}
	return pr.obhod(list,"file");
	
}).then(function(data){
	console.log("-----------I-error------------");
	console.log(data);
	console.log();
});

//console.log(process.argv);