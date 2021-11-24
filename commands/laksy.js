const config = require("../config.json");

module.exports = {
  name: "laksy",
  aliases: ["läksy", "läksyt", "laksyt", "homework", "hw"],
  description: "description",
  category: "category",
  guildOnly: true,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: true,
  cooldown: 2,
  usage: `${config.prefix}${this.name}`,
  execute(message, args) {
    message.reply("Läksyt!");
  },
};
