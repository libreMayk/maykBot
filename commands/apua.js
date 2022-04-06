const { MessageEmbed, MessageButton } = require("discord.js");
const exps = require("../exports.json");

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
      .setAuthor("mayk.fi", exps.maykLogoURL, "https://mayk.fi/")
      .setTitle("Kaikki komennot")
      .setDescription("Näyttää kaikki komennot.")
      .setFooter("mayk.fi", exps.maykLogoURL);

    message.client.commands
      .filter((cmd) => cmd.name !== "help")
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
