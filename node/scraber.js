var pr = require("./wait");
    cheerio = require("cheerio"),
    Promise = require("promise");

var header = "https://ru.corner-stats.com",
	linkes = ["/premier-league/ukraine/tournament/6"]; //
	data = "table>tr>td>table>tr";
	hrefSl = 'div[style="margin-left:15px; margin-top:10px; font-size:12px; "]>a';

var devide = [
  function(name){
    return sleep(name);
  },
  function(name){console.log(name)}
]
 
var url = "http://www.imperia-laminata.com.ua/?rs=adwords5_g_192783009115_%D0%BB%D0%B0%D0%BC%D0%B8%D0%BD%D0%B0%D1%82%20%D0%BE%D0%B4%D0%B5%D1%81%D1%81%D0%B0&gclid=Cj0KCQjwq7XMBRCDARIsAKVI5QaACUJe2uldJFRXDLECc_wR4_mJbp6VPiVGXEXx-ZE7Pl2NBpwDQe8aAqJaEALw_wcB"   

pr.make = function(data){

}

pr.req({
	head: header+linkes[0], 
	hrefs : 'div[style="margin-left:15px; margin-top:10px; font-size:12px; "]>a',
	linkes : ["/premier-league/ukraine/tournament/6"]
})
.then(function(data){
	var $ = cheerio.load(data.body);   
	var result = $(data.hrefs);
	result.each(function(i, elem){
    	data.linkes.push($(elem).attr("href"));
    });
    return data.linkes;
})
.then(function(linkes){
	return promise.obhod(linkes);	
});