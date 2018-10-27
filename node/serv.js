var express = require("express"),
	wait = require("./wait"),
  fs = require("fs"),
	json = require("body-parser").json();
var app = express();
app.use(express.static(__dirname + "/front"));
app.use(express.static(__dirname + "/other"));
//app.use(express.urlencoded());
var inc = 0;
console.log(json);
var open = function(name){
    return fs.readdirSync(__dirname+name);
}
//console.log(open());
app.get('/user', function (req, res) {
  res.send(open("/other"));
});
app.post("/post", json, function(req, res){
	console.log(req.body);
	res.send(req.body);
});
app.listen(3000, function () {
  console.log(
  	'Example app listening on port 3000!');
});
