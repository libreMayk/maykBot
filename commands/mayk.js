const { MessageEmbed } = require("discord.js");

const got = (...args) => import("got").then(({ default: got }) => got(...args));
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = {
  name: "mayk",
  aliases: ["mayk"],
  description:
    "Tästä löytyy kaikkia infoa lyhyesti: milloin koulu alkaa, sää, HSL-info ja muuta.",
  category: "info",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: false,
  cooldown: 2,
  usage: ``,
  async execute(message, args) {
    const dom = new JSDOM();
    const document = dom.window.document;

    const maykEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setTitle("MAYK - Maunulan-Yhteiskoulu")
      .setURL("https://mayk.fi")
      .setAuthor("Maunulan-Yhteiskoulu", message.client.user.displayAvatarURL())
      .setDescription(
        "Tästä löytyy kaikkia infoa lyhyesti: milloin koulu alkaa, sää, HSL-info ja muuta."
      )
      .setThumbnail(message.client.user.displayAvatarURL())
      .addFields(
        {
          name: "Koulu alkaa",
          value: "Koulu alkaa klo 8.15",
          inline: true,
        },
        {
          name: "Sää",
          value: `Sää Maunulassa klo ${new Date().toLocaleString("fi-FI", {
            hour: "numeric",
            minute: "numeric",
          })}: ${undefined}`,
          inline: true,
        },
        {
          name: "HSL",
          value: "Bussi nro 53 tulee klo {undefined}",
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter(
        "Maunulan-Yhteiskoulu",
        message.client.user.displayAvatarURL()
      );

    message.channel.send({ embeds: [maykEmbed] });
  },
};
