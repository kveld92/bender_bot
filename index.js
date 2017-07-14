const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');


var dice = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6"
]

bot.on("ready", function(){
	console.log("Bender-bot is operational");
});

bot.on("message", function(message){
	if(message.author.equals(bot.user)) return;
	
	if(!message.content.startsWith(config.prefix)) return;
	
	var args = message.content.substring(config.prefix.length).split(" ");
	console.log(message.author.username+" typed: "+message);
	switch(args[0]){
		case "ping":
			require("./commands/ping").ping(message);
			//message.channel.send("Pong!");
			//message.delete();
			break;
		case "info":
			message.channel.send("https://media.giphy.com/media/hB5Lpvi8pmg7K/giphy.gif");
			message.delete();
			break;
		case "diceroll":
			message.channel.send(message.author.toString()+" rolled a "+dice[Math.floor(Math.random()*dice.length)]);
			message.delete();
			break;
		case "help":
			message.channel.send({embed:{
				color:3447003,
				author:{
					name: bot.user.username,
					icon_url: bot.user.avatarURL	
				},
				title: "Bender_Bot",
				description: "This is a list of commands bender_bot will listen to",
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
