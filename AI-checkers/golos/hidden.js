var promise = require("./wait");
var fs = require("fs");


var city = promise.file({
  head : __dirname + "/city.list.json"
})
.then(function (data) {
  return data.body
}, error)
.then(function (data){
  return JSON.parse(data).filter(getCity)
}, error)
.then(function(data){
  //data = data.filter(nameCity); 
  console.log(JSON.stringify(data, null, 2));
  return data;
}, error)


var error = function(err){
  console.log(err);
  console.log("eeeeeeeeeeeeeee");
}



/*
var file = {
  read : function(file){
    var buffer = fs.readFileSync(__dirname+file);
    return JSON.parse(buffer.toString());
  },
  write : function(file, data){
    fs.writeFileSync(
    __dirname+file, JSON.stringify(data, null, 2));
  }
}
var cities = file.read("/city.list.json");
ua = cities.slice(0, 1000);
console.log(ua);
ua = ua.filter(getCity);

file.write("/ua.json", ua);
*/
var getCity = function (city){
  return city.country == "UA"
}
var nameCity = function(city){
  return city.name[0] == "Nikolayev";
}


