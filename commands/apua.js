const config = require("../config.json");

module.exports = {
  name: "apua",
  aliases: ["auta", "help"],
  description: "Apua!",
  category: "info",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: true,
  cooldown: 2,
  usage: `${config.prefix}${this.name}`,
  execute(message, args, command) {
    if (!args.length) {
      message.reply(`
        Kaikki komennot:\n\n${
          // listaa kaikki komennot
          message.client.commands
            // .filter((cmd) => cmd.name !== "help")
            .map(
              (cmd) =>
                `**${cmd.name}${
                  cmd.aliases ? `, ${cmd.aliases.join(", ")}` : ""
                }**: ${cmd.description}`
            )
            .join("\n")
        }
    `);
    } else if (args[1] === command.name || args[1] === command.aliases) {
      message.reply(
        `Name: ${command.name}\nDescription: ${command.description}\nAliases: ${command.aliases}\nCategory: ${command.category}\nCooldown: ${command.cooldown}\nUsage: ${command.usage}`
      );
    }
  },
};
