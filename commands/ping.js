async function run(bot, message){
  let currentTime = new Date().getTime();
  message.reply(currentTime-message.createdTimestamp + "ms").then(msg => msg.delete(5000));
  message.delete();
}
module.exports = {run}
