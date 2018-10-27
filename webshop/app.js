var express = require("express"),
	jsonbody = require("body-parser").json(),
	multer = require('multer'),
	fs = require("fs"),
	upload = multer(),
	path = require('path'),
	promise = require("./wait.js")
	app = express();
	
app.use(express.static(__dirname +"/"));
console.log(__dirname);

var callback =(req, res)=>{
	var path = __dirname + "/img",
		name = "";
	//console.log(req.body);
	if(req.body) name = req.body.array.shift();
	path += "/" + name	
	 
	fs.readdir(path, function(err, list){
		//console.log(list)
		if(name){
			req.body.names.push({
				name : name,
				photos : list
			})
			res.send(req.body)
		}else{
			res.send({
				array : list,
				names : []
			})
		}	
	})
}

app.get("/img", callback);
app.post("/img", jsonbody, callback);

app.post("/upload", upload.array(), function(req, res){
	//console.log(req.body);
	//res.send(req.body);
	
	console.log(req.body.image.length);
	//var photo = req.body.photo;
	var name = req.body.name;
	var data = req.body.image.replace(/^data:image\/jpeg;base64,/, "");
	console.log("--------------------");
	console.log(name);
	//var buffer = decodeImage(req.body.image).data;
	fs.open(`image/${name}.jpeg`, "w+", 0644,function(err, body){
		if(err){
			console.log("create error");
			return;
		} 
		fs.writeFile(`image/${name}.jpeg`, data, "base64", function(err, suc){
			if(err){
				return res.send(err);
				console.log("write error");
			}
			else{
				console.log("very good");
				console.log(name);
				return res.send(name);
			}
		});
		
		
	});
})

app.listen(process.env.PORT || 3000, function(){
	console.log("listen port : 3000");
})

