const config = require("../config.json");
const wilma = require("../wilmaCred.json");
const OpenWilma = require("openwilma");
const api = new OpenWilma();

module.exports = {
  name: "wilma",
  aliases: ["wilma"],
  description: "description",
  category: "info",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: true,
  cooldown: 2,
  usage: `${config.prefix}${this.name}`,
  execute(message, args) {
    api
      .login(
        "https://yvkoulut.inschool.fi",
        `${wilma.wilmaEmail}`,
        `${wilma.wilmaPass}`
      )
      .then(async (result) => {
        message.reply("Logged in!");
        api.messages.getAll("inbox").then(async (result) => {
          console.log("Messages in the inbox:\n", result);
        });
      })
      .catch(async (err) => {
        message.reply(`:x: Error: \`${err}\``);
      });
  },
};
