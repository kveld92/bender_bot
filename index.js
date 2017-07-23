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
						name: `${config.prefix}roll`,
						value: "Bender will roll a dice for you!"
					},
					{
						name: `${config.prefix}info`,
						value: "Displays some technical information."
					},
					{
						name: `${config.prefix}yts`,
						value: `Play a song from youtube with a search term. ${config.prefix}yts<search term>.`
					},
					{
						name: `${config.prefix}ytl`,
						value: `Play a song from youtube using a link. \n${config.prefix}ytl <link>`
					},
					{
						name: `${config.prefix}repeat`,
						value: "Repeat will repeat the next song added to the list."
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
