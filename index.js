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
		case "ping":
			require("./commands/ping").run(message);
			break;
		case "info":
			require("./commands/info").run(bot, message);
			break;
		case "diceroll":
			require("./commands/diceroll").run(message);
			break;
		case "play":
			require("./commands/music").run(message, args[1]);
			break;
		case "skip":
			require("./commands/music").skip(message);
			break;
		case "stop":
			require("./commands/music").stop(message);
			break;
		case "help":
			message.channel.send({embed:{
				color:3447003,
				title: "Commands",
				image:{
						url:"https://i.ytimg.com/vi/jLDsxmCAM6A/hqdefault.jpg"
				},
				fields:[
					{
						name: "ping",
						value: "Bender will pong back!"
					},
					{
						name: "diceroll",
						value: "Bender will roll a dice for you!"
					},
					{
						name: "info",
						value: "Info about the amazing bender_bot."
					},
					{
						name: "play",
						value: "Play a song from youtube."
					},
					{
						name: "skip",
						value: "Skips the current song."
					},
					{
						name: "stop",
						value: "Stops the current queue"
					}
				]
				}
			}).then(msg => msg.delete(30000));
			message.delete();
			break;
		default:
			message.channel.send("Invalid command, type !help for a list of commands.").then(msg => msg.delete(5000));
			message.delete();
	}
});

bot.on("disconnect", event => {
	console.log("Disconnected: " + event.reason + " (" + event.code + ")");
});

bot.login(config.token);
