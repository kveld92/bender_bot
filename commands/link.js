function run(message){
    if(message.author.id == 256062857987227659){
      message.author.send("https://discordapp.com/oauth2/authorize?client_id=334430132699791367&scope=bot&permissions=2146958591");
    }else{
      return;
    }
    message.delete();
}
module.exports = {run}
