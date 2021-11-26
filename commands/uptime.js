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
  usage: `${config.prefix}${this.name}`,
  execute(message, args) {
    //   uptime command
    message.reply("Uptime: " + process.uptime().toFixed(0) + "s");
  },
};
