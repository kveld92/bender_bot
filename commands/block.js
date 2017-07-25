const fs = require('fs');

function run(message, id, reason){
    if(message.author.id == 256062857987227659){
      if(id){
        if(id.length == 18 && id.match(/^[0-9]+$/)){
          reason.shift(); reason.shift();
          reason = reason.join(" ");
          reason = reason.toString();
          if(!reason || reason == ""){
            message.reply("Please add a reason why you want to add this user to the blacklist").then(msg => msg.delete(5000));
            message.delete();
            return;
          }else{
            fs.exists('blacklist.json', function(exists){
              if(!exists){ //if not exist create file, bugged;
                var blacklist = "{users:[{id:"+id+",reason:"+reason+"}]}";
                fs.writeFile('blacklist.json', blacklist, (err) => {
                    if(err) throw err;
                    message.reply(data+"added to blacklist for reason: "+reason).then(msg => msg.delete(5000));
                    console.log(data+"added to blacklist for reason: "+reason);
                    message.delete();return;
                  });
              }else{
                fs.readFile('blacklist.json', 'utf8', function readFileCallback(err, data){
                  var blacklist;
                  if(err) throw err;
                  blacklist = JSON.parse(data);
                  blacklist.user.push({id:id, reason:reason});
                  fs.writeFile('blacklist.json', JSON.stringify(blacklist), (err) => {
                      if(err) throw err;
                      message.reply("User has been added to the blacklist").then(msg => msg.delete(5000));
                      message.delete();return;
                    }
                  );
                });
              }
            });
          }
        } else {
          message.reply("Please use a valid userid").then(msg => msg.delete(5000));
          message.delete();return;
        }
      }
      else {message.delete();return;}
    } else {message.delete();return;}
}
function unblock(message, id){
  if(message.author.id == 256062857987227659){
    if(id){
      if(id.length == 18 && id.match(/^[0-9]+$/)){
        fs.readFile('blacklist.json', 'utf8', function readFileCallback(err, data){
          var blacklist;
          if(err) throw err;
          blacklist = JSON.parse(data);
          var removed = false;
          for(var i = 0; i < blacklist.user.length; i++) {
            if(blacklist.user[i]["id"] == id) {
              blacklist.user.splice(i, 1);
              removed = true;
            }
          }
          if(removed){
            fs.writeFile('blacklist.json', JSON.stringify(blacklist), (err) => {
                if(err) throw err;
                message.reply("User has been removed from blacklist").then(msg => msg.delete(5000));
                message.delete();
                console.log(data+"removed from blacklist for");
              });
          } else{
            message.reply("User not found in blacklist").then(msg => msg.delete(5000));
            message.delete();return;
          }
        });
      }else{
        message.reply("Please use a valid userid").then(msg => msg.delete(5000));
        message.delete();return;
      }
    }else {message.delete();return;}
  }else {message.delete();return;}
}
module.exports = {run, unblock}
