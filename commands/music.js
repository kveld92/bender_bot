const ytdl = require("ytdl-core");

var servers = {};
var streamOptions = {volume:0.2};
var ytdlOptions = {filter:'audioonly', quality:"lowest"};

function play(connection, message){
	var server = servers[message.guild.id];
	server.dispatcher = connection.playStream(ytdl(server.queue[0],ytdlOptions),streamOptions);
	server.queue.shift();
	server.dispatcher.on("end", function(){
		if(server.queue[0]) play(connection, message);
		else connection.disconnect();
	});
	
}

function run(message, link){
	if(!link){
		message.channel.send("Please provide a yt-url.");
		return;
	}
	if(!message.member.voiceChannel){
		message.channel.send("Please join a voice channel before using this command");
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
	if(server.dispatcher) servers.dispatcher.end();
}

function stop(message){
	var server = servers[message.guild.id];
	if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();	
}

module.exports = {run, skip, stop} 
