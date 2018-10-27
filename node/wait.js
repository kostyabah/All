
var fs = require('fs'),
  Promise = require("Promise"),
  request = require("request"),
	iconv = require('iconv-lite');

var promise = {
  req : function(data){
    return new Promise(function(resolve, reject){
      request(data.head, function(er, res, body){
        //data = data || {};
        data.body = body;
        if(body)
          resolve(data);
        else{
          //console.log(model.result);
          //writeFile(model.result);
        } 
      }); 
    });
  },
  file : function(data){
    return new Promise(function(resolve, reject){
      fs.readFile(data.head, function (err, logData) {
        if (err) {
          reject(err);
          console.log(err);
          return;
        };
        //data.body = logData;
        data.body =iconv.encode (iconv.decode (
          logData, 'win1251'), 'utf8').toString();
        resolve(data);
      });
    });
  },
  write : function(data){
    return new Promise(function(resolve, reject){
      fs.writeFile(data.head, JSON.stringify(data.body), 
        function(error){
          if(error) reject(error); // если возникла ошибка
          else resolve(data);
          console.log("----------------------");
          console.log("Асинхронная запись файла завершена. Содержимое файла:");
          var data = fs.readFileSync(data.head, "utf8");
          console.log(data);  // выводим считанные данные                 
      });
    })
  },
  create : function(data){
    return new Promise(function(resolve, reject){
      fs.open(data.head, "w+", 0644,
        function(err, body){
          console.log({
            err: err,
            body: body
          });
          if(err)
            reject(err);
          else
            resolve(data);
        })
      .then(function(data){
        return promise.file(data);
      })
      
    });
  },
  dir : function(data){
    return new Promise(function(resolve, reject){
      fs.readdir(data.head, function (err, logData) {
        if (err) {reject(err); return};
        data.body = logData;
        resolve(data);
      });
    });
  },
  all : function(reader){
    //var reader = promise.fs(name);  
    for(var n=0; n < devide.length; n++){
      reader.wait = reader.wait
      .then(reader.devide[n]);
    }
    return reader;
  },
  obhod : function(data, type){
    data.result = [];
    //data.linkes  data.head
    var start = promise[type](data);
    for(var n=0; n < data.length; n++){
      start = start.then(function(data){
        data.result.push(data.make(data));
        data.head = data.next(data);
        return data.head ? 
            promise[type](data) :
            data.result;
      },function(err){
        console.log("error");
        console.log(err);
        return err
      });
    }
    return start;
  },

  sleep : function(n, out){
    return new Promise(function (resolve, reject) { 
       setTimeout(resolve, out, n);    
    });
  }
}
module.exports = promise;