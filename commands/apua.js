const { MessageEmbed, MessageButton } = require("discord.js");
const config = require("../config.json");

module.exports = {
  name: "apua",
  aliases: ["auta", "help"],
  description: "Saat heti apua - kaikki komennot ovat täällä!",
  category: "info",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: false,
  cooldown: 2,
  usage: ``,
  async execute(message, args, command, client) {
    const helpEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setAuthor(
        "mayk.fi",
        "https://www.mayk.fi/wp-content/uploads/2017/06/favicon.png"
      )
      .setTitle("Kaikki komennot")
      .setDescription("Näyttää kaikki komennot.")
      .setFooter(
        "mayk.fi",
        "https://www.mayk.fi/wp-content/uploads/2017/06/favicon.png"
      );

    message.client.commands
      // .filter((cmd) => cmd.name !== "help")
      .map((cmd) =>
        helpEmbed.addFields({
          name: `${cmd.name} | ${cmd.aliases.join(", ")}`,
          value: `${cmd.description}\n**Odotusaika:** ${cmd.cooldown}s ${
            cmd.dev ? "\n***DEV-komento***" : ""
          }`,
          inline: false,
        })
      );

    message.reply({ embeds: [helpEmbed] });
  },
};
