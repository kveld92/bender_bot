const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');

bot.on("ready", function(){
	console.log("Bender [BOT] is operational");
});

bot.on("message", function(message){
	if(message.author.equals(bot.user)) return;

	if(!message.content.startsWith(config.prefix)) return;

	var args = message.content.substring(config.prefix.length).split(" ");
	console.log(message.author.username+" typed: "+message);
	switch(args[0].toLowerCase()){
		case "summon":
			require("./commands/summon").run(message);
			break;
		case "ping":
			require("./commands/ping").run(bot, message);
			break;
		case "info":
			require("./commands/info").run(bot, message);
			break;
		case "roll":
			require("./commands/diceroll").run(message);
			break;
		case "ytl":
			require("./commands/music").run(message, "link", args[1]);
			break;
		case "yts":
			require("./commands/music").run(message, "search", args);
			break;
		case "skip":
			require("./commands/music").skip(message);
			break;
		case "stop":
			require("./commands/music").stop(message);
			break;
		case "np":
			require("./commands/music").np(message);
			break;
		case "queue":
			require("./commands/music").queue(message);
			break;
		case "pause":
			require("./commands/music").pause(message);
			break;
		case "resume":
			require("./commands/music").resume(message);
			break;
		case "repeat":
			require("./commands/music").repeat(message);
			break;
		case "help":
			require("./commands/help").run(message);
			break;
		default:
			message.channel.send(`Invalid command, type ${config.prefix}help for a list of commands.`).then(msg => msg.delete(5000));
			message.delete();
	}
});

bot.on("disconnect", event => {
	console.log("Disconnected: " + event.reason + " (" + event.code + ")");
});

bot.login(config.token);
