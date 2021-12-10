const config = require("../config.json");

module.exports = {
  name: "uptime",
  aliases: ["aika"],
  description: "Kuinka vanha olen jo?",
  category: "util",
  guildOnly: true,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: false,
  cooldown: 2,
  usage: ``,
  execute(message, args) {
    message.channel.send({
      content: `Käyttöaika: ${Math.floor(
        (Date.now() - message.client.readyAt) / 1000
      )} sekuntia`,
    });
  },
};
