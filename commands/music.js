const ytdl = require("ytdl-core");

var servers = {};
var streamOptions = {volume:0.2};
var ytdlOptions = {filter:"audioonly", quality:"lowest"};

var msgTimer = 30000;
var playing = false;
var hasBeenRun = false;

//functions
function play(connection, message){
	playing = true;
	var server = servers[message.guild.id];
	server.dispatcher = connection.playStream(ytdl(server.queue[0]['link'],ytdlOptions),streamOptions);
	servers[message.guild.id].now_playing = server.queue[0]['info'] + "requested by "+server.queue[0]['author'];
	server.queue.shift();
		server.dispatcher.on("end", function(){
		if(server.queue[0]){
			setTimeout(function(){
				play(connection, message)
			}, 1000);
		}
		else {
			server.now_playing = "";
			connection.disconnect();
		}
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
	if(!servers[message.guild.id]){
		servers[message.guild.id] = { queue:[], now_playing:"" };
	}
	ytdl.getInfo(link, (error, info) => {
		if(error) {
			message.reply("The requested video (" +link+ ") does not exist or cannot be played.").then(msg => msg.delete(msgTimer));
		} else {
			var server = servers[message.guild.id];
			server.queue.push({info:info["title"], link:link, author:message.author});
			message.reply('"' + info["title"] + '" has been added to the queue.').then(msg => msg.delete(msgTimer));
			if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
				play(connection, message);
			});
			message.delete();
		}
	});
	hasBeenRun = true;
}

function queue(message){
	if(!playing){
		if(hasBeenRun){
			var server = servers[message.guild.id];
			if(server.queue.length > 0){
				var respons = {embed:{
					color:3447003,
					title: "",
					fields:[]
					}
				}
				var song_amount = 0;
				for(var i=0; i < server.queue.length; i++){
					var name = "["+i+"]: " + server.queue[i]["info"];
					var value = "requested by "+server.queue[i]["author"];
					respons.embed.fields.push({name:name, value:value});
					song_amount++;
				}
				if(song_amount == 1) respons.embed.title = ":musical_note: Current queue | " + song_amount + " entry";
				else respons.embed.title = ":notes: Current queue | " + song_amount + " entries ";
				message.channel.send(respons).then(msg => msg.delete(msgTimer));
			} else{
				message.reply("There are no more songs left in the queue.").then(msg => msg.delete(msgTimer));
			}
		} else{
			message.reply("The queue is empty.").then(msg => msg.delete(msgTimer));
		}
	} else {
		message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimer));
	}
	message.delete();
}

function np(message){
	if(!playing){
		if(hasBeenRun){
			var server = servers[message.guild.id];
			if(server.now_playing == ""){
				message.reply("There is no song playing.").then(msg => msg.delete(msgTimer));
			} else{
				var respons = {embed:{
					color:3447003,
					title: ":musical_note: Currently playing",
					description:server.now_playing
					}
				}
				message.channel.send(respons).then(msg => msg.delete(msgTimer));
			}
		} else{
			message.reply("No songs have been queued yet.").then(msg => msg.delete(msgTimer));
		}
	} else{
		message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimer));
	}
	message.delete();
}

function skip(message){
	if(!playing){
		if(hasBeenRun){
			var server = servers[message.guild.id];
			if(server.queue.length > 0){
				if(server.dispatcher) server.dispatcher.end();
				message.reply("Skipping song").then(msg => msg.delete(msgTimer));
			} else{
				message.reply("The queue needs to have atleast 1 or more songs");
			}
		} else{
			message.reply("You need to put a song in the queue before you can skip them doofus").then(msg => msg.delete(msgTimer));
		}
	} else{
		message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimer));
	}
	message.delete();
}

function stop(message){
	if(!playing){
		if(hasBeenRun){
			var server = servers[message.guild.id];
			server.queue = [];
			if(server.dispatcher) server.dispatcher.end();
			message.reply("Queue stopped").then(msg => msg.delete(msgTimer));
		}
		else return;
	} else{
		message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimer));
	}
	message.delete();
}

module.exports = {run, skip, stop, np, queue}
