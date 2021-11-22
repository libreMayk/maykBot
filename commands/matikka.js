const config = require("../config.json");
const math = require("mathjs");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "matikka",
  aliases: ["matematiikka", "math", "ma"],
  description: "Smol laskin",
  category: "util",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: true,
  cooldown: 2,
  usage: `${config.prefix}matikka <lauseke>`,
  execute(message, args) {
    if (args.length < 1) {
      return message.reply(`**Käytä**: \`${this.usage}\``);
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
        //  Create a new Discord.MessageEmbed()
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
      message.reply(`Lausekkeesi on virheellinen!`);
      message.react("❌");
    }
  },
};
