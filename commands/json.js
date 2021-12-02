const config = require("../config.json");
const fs = require("fs");

module.exports = {
  name: "json",
  aliases: ["json"],
  description: "json test",
  category: "util",
  guildOnly: true,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: false,
  cooldown: 2,
  usage: ``,
  execute(message, args) {
    const authorius = message.author;
    fs.writeFile(
      "./json/nicknames.json",
      JSON.stringify(
        {
          users: {
            username: authorius.username,
            tag: authorius.tag,
            ...authorius,
          },
        },
        null,
        4
      ),
      (err) => {
        if (err) console.log(err);
      }
    );

    message.reply({
      files: ["./json/nicknames.json"],
    });
  },
};
