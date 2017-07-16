const ytdl = require("ytdl-core");

var servers = {};
var streamOptions = {volume:0.2};
var ytdlOptions = {filter:"audioonly", quality:"lowest"};

//functions
function play(connection, message){
	var server = servers[message.guild.id];
	server.dispatcher = connection.playStream(ytdl(server.queue[0],ytdlOptions),streamOptions);
	server.queue.shift();
	server.dispatcher.on("end", function(){
		if(server.queue[0]){play(connection, message);}
		else {connection.disconnect();}
	});
}

//exports
function run(message, link){
	if(link){
		var regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
		if(!link.match(regExp)){
			message.channel.send("Please provide a valid youtube link. Example: https://www.youtube.com/watch?v=c7eG283AUGM").then(msg => msg.delete(5000));
			message.delete();
			return;
		}
	} else{
		message.channel.send("Please provide a youtube link").then(msg => msg.delete(5000));
		message.delete();
		return;
	}
	if(!message.member.voiceChannel){
		message.channel.send("Please join a voice channel before using this command.").then(msg => msg.delete(5000));
		message.delete();
		return;
	}
	if(!servers[message.guild.id]) servers[message.guild.id] = {
		queue:[]
	};
	var server = servers[message.guild.id];
	server.queue.push(link);

	if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
		play(connection, message);
	});
	message.delete();
}

function skip(message){
	var server = servers[message.guild.id];
	if(server.dispatcher) server.dispatcher.end();
	message.delete();
}

function stop(message){
	var server = servers[message.guild.id];
	if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
	message.delete();
}

module.exports = {run, skip, stop}
