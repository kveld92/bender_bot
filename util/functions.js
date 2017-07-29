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
function getDateTime(callback) {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    callback(year + "/" + month + "/" + day +" ["+ hour + ":" + min + ":" + sec+"]");

}
module.exports = {checkBlacklist, getDateTime}
