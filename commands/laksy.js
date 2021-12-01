const config = require("../config.json");
const fs = require("fs");

module.exports = {
  name: "laksy",
  // aliases: ["läksy", "läksyt", "laksyt", "homework", "hw"],
  aliases: ["json"],
  description: "läksyt ehkä",
  category: "util",
  guildOnly: true,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: false,
  cooldown: 2,
  usage: `${config.prefix}${this.name}`,
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
