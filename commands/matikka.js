const math = require("mathjs");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "matikka",
  aliases: ["matematiikka", "math", "ma"],
  description: "Smol laskin",
  category: "util",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: false,
  cooldown: 2,
  usage: "",
  execute(message, args) {
    if (args.length < 1) {
      return message.reply(
        `**Käytä**: \`${process.env.PREFIX}${this.name} <lauseke>\``
      );
    }
    try {
      const que = args.join(" ");
      const result = math.evaluate(que);

      if (!isNaN(que)) {
        message.reply("Lausekkeesi on virheellinen!");
        message.react("❌");
        return;
      } else if (que.length > 2000) {
        message.reply("Lausekkeesi on liian pitkä!");
        message.react("❌");
        return;
      } else {
        const mathEmbed = new MessageEmbed()
          .setColor("#546e7a")
          .setTitle("Matikka")
          .addFields(
            { name: "Lauseke", value: `${que}`, inline: true },
            { name: "Vastaus", value: `${result}`, inline: true }
          )
          .setTimestamp()
          .setFooter(
            `Lauseke tehty ${message.author.username}`,
            message.author.displayAvatarURL()
          );

        message.channel.send({ embeds: [mathEmbed] });
      }
    } catch (err) {
      message.reply(`:x: Lausekkeesi on virheellinen!`);
      message.react("❌");
    }
  },
};
