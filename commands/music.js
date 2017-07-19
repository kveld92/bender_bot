const ytdl = require("ytdl-core");

var servers = {};
var streamOptions = {volume:0.2};
var ytdlOptions = {filter:"audioonly", quality:"lowest"};

var msgTimer = 5000;
var playing = false;

//functions
function play(connection, message){
	playing = true;
	var server = servers[message.guild.id];
	console.log(server.queue[0]);
	server.dispatcher = connection.playStream(ytdl(server.queue[0]['link'],ytdlOptions),streamOptions);
	server.queue.shift();
		server.dispatcher.on("end", function(){
		if(server.queue[0]){
			setTimeout(function(){
				play(connection, message)
			}, 1000);
		}
		else {connection.disconnect();}
	});
	playing = false;
}

//exports
function run(message, link){
	if(link){
		var regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
		if(!link.match(regExp)){
			message.reply("Please provide a valid youtube link. Example: https://www.youtube.com/watch?v=c7eG283AUGM").then(msg => msg.delete(msgTimer));
			message.delete();
			return;
		}
	} else{
		message.reply("Please provide a youtube link").then(msg => msg.delete(msgTimer));
		message.delete();
		return;
	}
	if(!message.member.voiceChannel){
		message.reply("Please join a voice channel before using this command.").then(msg => msg.delete(msgTimer));
		message.delete();
		return;
	}

	ytdl.getInfo(link, (error, info) => {
		if(error) {
			message.reply("The requested video (" +link+ ") does not exist or cannot be played.").then(msg => msg.delete(msgTimer));
		} else {
			if(!servers[message.guild.id]){
				servers[message.guild.id] = { queue:[] };
			}
			var server = servers[message.guild.id];
			server.queue.push({info:info["title"], link:link, author:message.author.username});
			message.reply('"' + info["title"] + '" has been added to the queue.').then(msg => msg.delete(msgTimer));
			if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
				play(connection, message);
			});
			message.delete();
		}
	});
}

function skip(message){
	if(!playing){
		var server = servers[message.guild.id];
		if(server.dispatcher) server.dispatcher.end();
		message.reply("Skipping song").then(msg => msg.delete(msgTimer));
	} else{
		message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimer));
	}
	message.delete();
}

function stop(message){
	if(!playing){
		var server = servers[message.guild.id];
		server.queue = [];
		if(server.dispatcher) server.dispatcher.end();
		message.reply("Stopping queue").then(msg => msg.delete(msgTimer));
	} else{
		message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimer));
	}
	message.delete();
}

module.exports = {run, skip, stop}
