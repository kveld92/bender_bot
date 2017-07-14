var dice = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6"
];

function run(message){
	message.channel.send(message.author.toString()+" rolled a "+dice[Math.floor(Math.random()*dice.length)]);
	message.delete();
}

module.exports = {run}
