const config = require("../config.json");
const prettySeconds = require("../my-modules/pretty-seconds-suomi");

module.exports = {
  name: "uptime",
  aliases: ["päälläoloaika"],
  description: "Yes.",
  category: "util",
  guildOnly: true,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: false,
  cooldown: 2,
  usage: ``,
  execute(message, args) {
    message.channel.send(
      `Päälläoloaika: ${prettySeconds(
        Math.floor((message.client.uptime / 1000) % 60)
      )}`
    );
  },
};
