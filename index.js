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
	switch(args[0]){
		case "ping":
			require("./commands/ping").run(message);
			break;
		case "info":
			require("./commands/info").run(bot, message);
			break;
		case "diceroll":
			require("./commands/diceroll").run(message);
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
						value: "Info about the amazing bender_bot"				
					}
				]	
				}
			});
			message.delete();
			break;
		default:
			message.channel.send("Invalid command, type !help for a list of commands.");
			message.delete();
	}	
});

bot.login(config.token);
