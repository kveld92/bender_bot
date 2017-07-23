const config = require('../config.json');

function run(message){
  message.channel.send({embed:{
    color:3447003,
    title: "Commands",
    image:{
        url:"https://i.ytimg.com/vi/jLDsxmCAM6A/hqdefault.jpg"
    },
    thumbnail: {
        url:"http://i.imgur.com/GD0lKbV.png"
    },
    fields:[
      {
        name: `${config.prefix}ping`,
        value: "Pongs the latency!"
      },
      {
        name: `${config.prefix}summon`,
        value: "Summons bender to your voice channel!"
      },
      {
        name: `${config.prefix}roll`,
        value: "Bender will roll a dice for you!"
      },
      {
        name: `${config.prefix}info`,
        value: "Displays some technical information."
      },
      {
        name: `${config.prefix}yts`,
        value: `Play a song from youtube with a search term. \n ${config.prefix}yts <search term>.`
      },
      {
        name: `${config.prefix}ytl`,
        value: `Play a song from youtube using a link. \n${config.prefix}ytl <link>`
      },
      {
        name: `${config.prefix}np`,
        value: "Displays the current song"
      },
      {
        name: `${config.prefix}repeat`,
        value: "Repeat will repeat the next song added to the list."
      },
      {
        name: `${config.prefix}skip`,
        value: "Skips the current song."
      },
      {
        name: `${config.prefix}stop`,
        value: "Stops the current queue"
      }
    ]
    }
  }).then(msg => msg.delete(60000));
  message.delete();
}
module.exports = {run}
