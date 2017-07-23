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
			require("./commands/ping").run(bot, message);
			break;
		case "info":
			require("./commands/info").run(bot, message);
			break;
		case "diceroll":
			require("./commands/diceroll").run(message);
			break;
		case "play":
			require("./commands/music").run(message, args[1], args[2]);
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
			message.channel.send({embed:{
				color:3447003,
				title: "Commands",
				image:{
						url:"https://i.ytimg.com/vi/jLDsxmCAM6A/hqdefault.jpg"
				},
				thumbnail: {
						url:"http://i.imgur.com/GD0lKbV.png"
				},
				fields:[
					{
						name: `${config.prefix}diceroll`,
						value: "Bender will roll a dice for you!"
					},
					{
						name: `${config.prefix}info`,
						value: "Displays some technical information."
					},
					{
						name: `${config.prefix}play`,
						value: `Play a song from youtube. \nUse ${config.prefix}play link <link> or ${config.prefix}play search <search term>. \nUse '_' instead of space for your search term. \nExample: ${config.prefix}play search bag_raiders_shooting_star`
					},
					{
						name: `${config.prefix}skip`,
						value: "Skips the current song."
					},
					{
						name: `${config.prefix}stop`,
						value: "Stops the current queue"
					}
				]
				}
			}).then(msg => msg.delete(60000));
			message.delete();
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
