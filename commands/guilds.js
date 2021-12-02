const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "guilds",
  aliases: ["palv", "palvelimet"],
  description: "Näyttää kaikki palvelimet missä botti on.",
  category: "util",
  guildOnly: true,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: true,
  dev: true,
  cooldown: 2,
  usage: "",
  async execute(message, args) {
    // show all guilds where bot is in, map to embed
    const guildEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setTitle("Palvelimet")
      .setDescription(`Yhteensä: **${message.client.guilds.cache.size}**`)
      .setTimestamp();

    message.client.guilds.cache.map(async (guild) => {
      guildEmbed.addFields({
        name: `${guild.name}`,
        value: `**ID**: ${guild.id}\n**${
          guild.memberCount
        }** jäsentä\n**Omistaja**: ${(await guild.fetchOwner()).user.tag}`,
        inline: false,
      });
    });

    message.author.send({ embeds: [guildEmbed] });
  },
};
