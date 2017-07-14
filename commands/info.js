function convertMS(ms) {
		  var d, h, m, s;
		    s = Math.floor(ms / 1000);
			  m = Math.floor(s / 60);
			    s = s % 60;
				  h = Math.floor(m / 60);
				    m = m % 60;
					  d = Math.floor(h / 24);
					    h = h % 24;
						  return d+":"+h+":"+m+":"+s;

};
function run(bot, message){
		message.channel.send({embed: {
			color: 3447003,
			title: "Bender [BOT]",
			description: "Created by VLKN#5161",
			thumbnail: {
					url:"http://i.imgur.com/GD0lKbV.png"
			},
			fields: [
			{ name: "Uptime",		  value: `${convertMS(bot.uptime)}`,						inline: true  },
			{ name: "RAM Usage",	  value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,      inline: true  }	
			]								
		}});
		message.delete();
}
module.exports = {run}
