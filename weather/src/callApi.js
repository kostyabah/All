export default function (type, data) {
    var head = "https://api.openweathermap.org/data/2.5/"
    data.APPID = "95b6cd227ea49a0370aa443afad6ad81";
    var getWeb = function(){
        var result = [];
        console.log(data)
        for(_prop in data){
            
        result.push(`${_prop}=${data[_prop]}`)
        }
        console.log(result.join("&"));
        return result.join("&");
    }
    var url =`${head}${type}?${getWeb(data)}`
    console.log(url);
    return fetch(url).then(function(res){
      return res.json();  
    })
}

var getWeb = function(data){
    
}