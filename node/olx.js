var pr = require("./wait"),
	 cheerio = require("cheerio");

pr.obhod({
	head : "https://www.olx.ua/obyavlenie/ukladka-laminata-45-grn-ustanovka-plintusov-10grn-IDtXn72.html#027b9efacf",
	length : 5000,
	next : function(data){
		return data.head;
	},
	make : function(data){
		console.log(data.result.length);
		return data.result.length;
	}
}, "req")
.then(function(result){
	console.log("all =" + result.length);
});
/*
pr.req({
	head : "https://www.olx.ua/obyavlenie/ukladka-laminata-45-grn-ustanovka-plintusov-10grn-IDtXn72.html#027b9efacf"
})

.then(function(data) {
	return data.body;
})
.then(function(data){
	console.log(data);
});
*/
