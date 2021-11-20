module.exports = {
  name: "sää",
  aliases: ["saa"],
  description: "Näyttää säätä Maunulassa.",
  category: "info",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: true,
  cooldown: 5000,
  usage: "",
  execute(message, args) {
    message.reply("Sää tänään: null");
  },
};
