const fs = require('fs');

function checkBlacklist(id, callback){
  var blacklist;
  fs.exists('blacklist.json', function(exists){
  	if(exists){
      fs.readFile('blacklist.json','utf8' ,function(err, data){
        if(err) throw err;
        blacklist = JSON.parse(data);
        var counter = 0;
        var users = blacklist.user;
        var exists = "clear";
        console.log(data);
        for(var i = 0; i < users.length; i++){
          if(users[i].id == id){
            exists = users[i].reason;
          }
        }
        callback(exists);
      });
  	}else return;
  });
}
module.exports = {checkBlacklist}
