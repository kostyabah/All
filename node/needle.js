var fs = require("fs");
var tress = require('tress');
var needle = require('needle');

var URL = 'http://www.ferra.ru/ru/techlife/news/';
var results = [];

// `tress` последовательно вызывает наш обработчик для каждой ссылки в очереди
var q = tress(function(url, callback){

    //тут мы обрабатываем страницу с адресом url
    needle.get(url, function(err, res){
        if (err) throw err;

        // здесь делаем парсинг страницы из res.body
            // делаем results.push для данных о новости
            // делаем q.push для ссылок на обработку

        callback(); //вызываем callback в конце
    });
});

// эта функция выполнится, когда в очереди закончатся ссылки
q.drain = function(){
    require('fs').writeFileSync('./data.json', JSON.stringify(results, null, 4));
}

// добавляем в очередь ссылку на первую страницу списка
q.push(URL);