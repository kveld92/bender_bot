const ytdl = require("ytdl-core");
const request = require("request");

var servers = {};
var streamOptions = {volume:0.2};
var ytdlOptions = {filter:"audioonly", quality:"lowest"};

var msgTimer = 30000;
var msgTimerShort = 5000;
var playing = false;
var hasBeenRun = false;
var ytApiKey = 'AIzaSyBzi4jyq4rugkTfU-KZ_07h3FvcIrFItK8';

//functions
function play(connection, message){
	playing = true;
	var server = servers[message.guild.id];
	server.dispatcher = connection.playStream(ytdl(server.queue[0]['link'],ytdlOptions),streamOptions);
	servers[message.guild.id].now_playing = server.queue[0]['info'] + " requested by "+server.queue[0]['author'];
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
function run(message, cmd, arg){
	if(!message.member.voiceChannel){
		message.reply("Please join a voice channel before using this command.").then(msg => msg.delete(msgTimerShort));
		message.delete();
		return;
	}
	if(cmd == "link"){
		if(arg){
			var regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
			if(!arg.match(regExp)){
				message.reply("Please provide a valid youtube link. Example: https://www.youtube.com/watch?v=c7eG283AUGM").then(msg => msg.delete(msgTimerShort));
				message.delete();
				return;
			}
		} else{
			message.reply("Please provide a youtube link").then(msg => msg.delete(msgTimerShort));
			message.delete();
			return;
		}
		if(!servers[message.guild.id]){
			servers[message.guild.id] = { queue:[], now_playing:"" };
		}
		ytdl.getInfo(arg.toString(), (error, info) => {
			if(error) {
				message.reply("The requested video (" +arg+ ") does not exist or cannot be played.").then(msg => msg.delete(msgTimerShort));
			} else {
				var server = servers[message.guild.id];
				server.queue.push({info:info["title"], link:arg, author:message.author});
				message.reply('"' + info["title"] + '" has been added to the queue.').then(msg => msg.delete(msgTimerShort));
				if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
					play(connection, message);
				});
				message.delete();
			}
		});
	}
	else if(cmd =="search"){
		arg = arg.replace(/_/g, " ");
		request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(arg) + "&key=" + ytApiKey, (error, response, body) => {
			var json = JSON.parse(body);
			if("error" in json) {
				message.reply("An error has occurred: " + json.error.errors[0].message + " - " + json.error.errors[0].reason);
				return;
			} else if(json.items.length === 0) {
				message.reply("No videos found matching the search criteria.");
				return;
			} else {
				var link = "https://www.youtube.com/watch?v=" + json.items[0].id.videoId;
				if(!servers[message.guild.id]){
					servers[message.guild.id] = { queue:[], now_playing:"" };
				}

				ytdl.getInfo(link.toString(), (error, info) => {
					if(error) {
						message.reply("The requested video (" +link+ ") does not exist or cannot be played.").then(msg => msg.delete(msgTimerShort));
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
			}
		});
	}
	else{
		message.reply("Please provide a valid play command. Use the help command to see a list of commands").then(msg => msg.delete(msgTimerShort));;
		message.delete();
	}
	hasBeenRun = true;
}
//repeat function??

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
					var nr = i+1;
					var name = "["+nr+"]: " + server.queue[i]["info"];
					var value = "requested by "+server.queue[i]["author"];
					respons.embed.fields.push({name:name, value:value});
					song_amount++;
				}
				if(song_amount == 1) respons.embed.title = ":musical_note: Current queue | " + song_amount + " entry";
				else respons.embed.title = ":notes: Current queue | " + song_amount + " entries ";
				message.channel.send(respons).then(msg => msg.delete(msgTimer));
			} else{
				message.reply("There are no more songs left in the queue.").then(msg => msg.delete(msgTimerShort));
			}
		} else{
			message.reply("The queue is empty.").then(msg => msg.delete(msgTimerShort));
		}
	} else {
		message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimerShort));
	}
	message.delete();
}

function np(message){
	if(!playing){
		if(hasBeenRun){
			var server = servers[message.guild.id];
			if(server.now_playing == ""){
				message.reply("There is no song playing.").then(msg => msg.delete(msgTimerShort));
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
			message.reply("No songs have been queued yet.").then(msg => msg.delete(msgTimerShort));
		}
	} else{
		message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimerShort));
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
				message.reply("The queue needs to have atleast 1 or more songs").then(msg => msg.delete(msgTimerShort));
			}
		} else{
			message.reply("You need to add a song to the queue first.").then(msg => msg.delete(msgTimerShort));
		}
	} else{
		message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimerShort));
	}
	message.delete();
}

function stop(message){
	if(!playing){
		if(hasBeenRun){
			var server = servers[message.guild.id];
			if(server.now_playing && server.now_playing !== ""){
				server.queue = [];
				if(server.dispatcher){
					server.dispatcher.end();
					message.reply("Queue stopped").then(msg => msg.delete(msgTimer));
				} else{
					message.rely("Play a song before using this command... :face_palm:").then(msg => msg.delete(msgTimerShort));
				}
			} else{
				message.reply("There is no song playing at the moment. :face_palm:")
			}
		} else message.reply("Play a song before using this command... :face_palm:").then(msg => msg.delete(msgTimerShort));
	} else{
		message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimerShort));
	}
	message.delete();
}

module.exports = {run, skip, stop, np, queue}
