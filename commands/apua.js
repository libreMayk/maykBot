module.exports = {
  name: "apua",
  aliases: ["auta", "help"],
  description: "Apua!",
  category: "info",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: true,
  cooldown: 2,
  usage: "<usage>",
  execute(message, args) {
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
  },
};
