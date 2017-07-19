function convertMS(millisec) {
	var seconds = (millisec / 1000).toFixed(0);
	var minutes = Math.floor(seconds / 60);
	var hours = "";
	if (minutes > 59) {
		hours = Math.floor(minutes / 60);
		hours = (hours >= 10) ? hours : "0" + hours;
		minutes = minutes - (hours * 60);
		minutes = (minutes >= 10) ? minutes : "0" + minutes;
	}
	seconds = Math.floor(seconds % 60);
	seconds = (seconds >= 10) ? seconds : "0" + seconds;
	if (hours != "") {
		return hours + ":" + minutes + ":" + seconds;
	}
	return minutes + ":" + seconds;

}

function run(bot, message){
		message.channel.send({embed: {
			color: 3447003,
			title: "Bender [BOT]",
			description: "Created by <@256062857987227659>",
			thumbnail: {
					url:"http://i.imgur.com/GD0lKbV.png"
			},
			fields: [
			{ name: "Uptime",		  value: `${convertMS(bot.uptime)}`,						inline: true  },
			{ name: "RAM Usage",	  value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,      inline: true  }
			]
		}}).then(msg => msg.delete(10000));
		message.delete();
}
module.exports = {run}
