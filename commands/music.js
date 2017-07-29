const ytdl = require("ytdl-core");
const request = require("request");

var servers = {};
var streamOptions = {volume:0.2};
var ytdlOptions = {filter:"audioonly", quality:"lowest", highWaterMark:130712};

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
	if(!server.repeat) server.queue.shift();
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
				message.reply("Please provide a valid youtube link. Example: https://www.youtube.com/watch?v=c7eG283AUGM").then(msg => msg.delete(msgTimer));
				message.delete();
				return;
			}
		} else{
			message.reply("Please provide a youtube link").then(msg => msg.delete(msgTimerShort));
			message.delete();
			return;
		}
		if(!servers[message.guild.id]){
			servers[message.guild.id] = { queue:[], now_playing:"", paused:false, repeat: false };
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
		if(arg[1]){
		arg.shift();
			arg = arg.join(" ");
			arg = arg.toString();
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
						servers[message.guild.id] = { queue:[], now_playing:"", paused:false, repeat: false };
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
		}else message.reply("Please provide a search term. Example: headhunterz destiny").then(msg => msg.delete(msgTimerShort));
	}
	else if(cmd == "playlist"){
		if(arg){
			var playlistId = arg.split("&list=").pop().split("&")[0];
			if(playlistId){
				request("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + playlistId + "&key=" + ytApiKey , (error, response, body) => {
					var json = JSON.parse(body);
					if ("error" in json) {
						message.reply("An error has occurred: " + json.error.errors[0].message + " - " + json.error.errors[0].reason).then(msg => msg.delete(msgTimerShort));
					} else if (json.items.length === 0) {
							message.reply("No videos found within playlist.").then(msg => msg.delete(msgTimerShort));
					} else {
							if(!servers[message.guild.id]){
								servers[message.guild.id] = { queue:[], now_playing:"", paused:false, repeat: false };
							}
							var server = servers[message.guild.id];
							console.log(json);
							for (var i = 0; i < json.items.length; i++) {
								var link = "https://www.youtube.com/watch?v="+json.items[i].snippet.resourceId.videoId;
								var info = json.items[i].snippet.title;
								server.queue.push({info:info, link:link, author:message.author});
							}
							if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
								play(connection, message);
							});
						}
				});
			} else message.reply("Please provide a valid youtube playlist").then(msg => msg.delete(msgTimerShort));
		} else message.reply("Please provide a valid link").then(msg => msg.delete(msgTimerShort));
		message.delete();
	}
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
					thumbnail: {
							url:"http://i.imgur.com/GD0lKbV.png"
					},
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
			} else message.reply("There are no more songs left in the queue.").then(msg => msg.delete(msgTimerShort));
		} else message.reply("The queue is empty.").then(msg => msg.delete(msgTimerShort));
	} else message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimerShort));
	message.delete();
}

function np(message){
	if(!playing){
		if(hasBeenRun){
			var server = servers[message.guild.id];
			if(server.now_playing == ""){
				var repeat = (server.repeat) ? "ON" : "OFF";
				var respons = {embed:{
					color:3447003,
					thumbnail: {
							url:"http://i.imgur.com/GD0lKbV.png"
					},
					title: ":cd: Currently playing",
					description:"Silence... :dash: "+ "\n :repeat: "+repeat
					}
				}
				message.channel.send(respons).then(msg => msg.delete(msgTimerShort));
			} else{
				var repeat = (server.repeat) ? "ON" : "OFF";
				var respons = {embed:{
					color:3447003,
					thumbnail: {
							url:"http://i.imgur.com/GD0lKbV.png"
					},
					title: ":cd: Currently playing",
					description:server.now_playing + "\n :repeat: "+repeat
					}
				}
				message.channel.send(respons).then(msg => msg.delete(msgTimer));
			}
		} else message.reply("No songs have been queued yet.").then(msg => msg.delete(msgTimerShort));
	} else message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimerShort));
	message.delete();
}

function skip(message){
	if(!playing){
		if(hasBeenRun){
			var server = servers[message.guild.id];
			if(!server.repeat){
				if(server.queue.length > 0){
					if(server.dispatcher){
						server.dispatcher.end();
						server.paused = false;
						message.reply("Skipping song :fast_forward: ").then(msg => msg.delete(msgTimer));
					}
				} else message.reply("The queue needs to have atleast 1 or more songs").then(msg => msg.delete(msgTimerShort));
			}else message.reply("Unable to skip song when repeat is on.").then(msg => msg.delete(msgTimerShort));
		} else message.reply("You need to add a song to the queue first.").then(msg => msg.delete(msgTimerShort));
	} else message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimerShort));
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
					message.reply("Queue stopped :stop_button: ").then(msg => msg.delete(msgTimer));
				} else message.rely("Play a song before using this command... :face_palm:").then(msg => msg.delete(msgTimerShort));
			} else message.reply("There is no song playing at the moment. :face_palm:").then(msg => msg.delete(msgTimerShort));
		} else message.reply("Play a song before using this command... :face_palm:").then(msg => msg.delete(msgTimerShort));
	} else message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimerShort));
	message.delete();
}

function pause(message){
	if(!playing){
		if(hasBeenRun){
			var server = servers[message.guild.id];
			if(!server.paused){
				server.dispatcher.pause();
				message.channel.send(":pause_button: " + server.now_playing).then(msg => msg.delete(msgTimerShort));
				server.paused = true;
			}else message.reply("Song already paused").then(msg => msg.delete(msgTimerShort));
		} else message.reply("Play a song before using this command... :face_palm:").then(msg => msg.delete(msgTimerShort));
	} else message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimerShort));
	message.delete();
}
function resume(message){
	if(!playing){
		if(hasBeenRun){
			var server = servers[message.guild.id];
			if(server.paused){
				server.dispatcher.resume();
				message.channel.send(":play_pause: "+server.now_playing).then(msg => msg.delete(msgTimerShort));
				server.paused = false;
			}else message.reply("Song already playing").then(msg => msg.delete(msgTimerShort));
		} else message.reply("Play a song before using this command... :face_palm:").then(msg => msg.delete(msgTimerShort));
	} else message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimerShort));
	message.delete();
}

function repeat(message){
	if(!playing){
		if(hasBeenRun){
			var server = servers[message.guild.id];
			if(server.repeat == true){
				server.repeat = false;
			}
			else {
				server.repeat = true;
			}
			if(!server.queue[0]== ""){
				if(server.queue[0]["info"] == server.now_playing.split("requested").shift().trim()){
					server.queue.shift();
				}
			}
			(server.repeat) ? message.channel.send(":repeat: ON") : message.channel.send(":repeat: OFF")
		} else message.reply("You need to play atleast one song before you can use this command...").then(msg => msg.delete(msgTimerShort));
	} else message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimerShort));
	message.delete();
}

function summon(message){
	if(!playing){
		if(hasBeenRun){
			var server = servers[message.guild.id];
			if(server.now_playing == ""){
				message.reply("Use yts or ytl instead to start playing a song").then(msg => msg.delete(msgTimerShort));
			} else {
			  message.member.voiceChannel.join();
			}
		} else message.reply("Use yts or ytl instead to start playing a song").then(msg => msg.delete(msgTimerShort));
	} else message.reply("Please wait a moment before using this command").then(msg => msg.delete(msgTimerShort));
	message.delete();
}
module.exports = {run}

module.exports = {run, skip, stop, np, queue, pause, resume, repeat, summon}
