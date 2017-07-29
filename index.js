const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');
const util = require('./util/functions.js');

bot.on("ready", function(){
	util.getDateTime(function(dateTime){
		console.log("Bender [BOT] is operational @ "+dateTime);
		var string = `${config.prefix}help | ` + dateTime;
		bot.user.setGame(string);
	});
});

bot.on("message", function(message){
	if(message.author.equals(bot.user)) return;

	if(!message.content.startsWith(config.prefix)) return;
	util.checkBlacklist(message.author.id, function(isBListed){
		if(isBListed != "clear"){
			var respons = {embed:{
				color:3447003,
				title: "Denied:no_entry_sign:",
				thumbnail: {
						url:"http://i.imgur.com/GD0lKbV.png"
				},
				description: "You have been naughty, so you are being blocked from using these commands",
				fields: [
					{
						name:"Reason: ",
						value: isBListed
					}
				]
				}
			}
			message.reply(respons).then(msg => msg.delete(10000));
			message.delete();
		} else{
			var args = message.content.substring(config.prefix.length).split(" ");
			console.log(message.author.username+" typed: "+message);
			switch(args[0].toLowerCase()){
				case "summon":
					require("./commands/music").summon(message);
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
				case "ytpl":
					require("./commands/music").run(message, "playlist", args[1]);
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
				//admin commands
				case "link":
					require("./commands/link").run(message);
					break;
				case "block":
					require("./commands/block").run(message, args[1], args);
					break;
				case "unblock":
					require("./commands/block").unblock(message, args[1]);
					break;
				case "blacklist":
					require("./commands/block").blacklist(message);
					break;
				default:
					message.channel.send(`Invalid command, type ${config.prefix}help for a list of commands.`).then(msg => msg.delete(5000));
					message.delete();
			}
		}
	});
});

bot.on("disconnect", event => {
	console.log("Disconnected: " + event.reason + " (" + event.code + ")");
});

bot.login(config.token);
