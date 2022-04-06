const { MessageEmbed } = require("discord.js");
const got = (...args) => import("got").then(({ default: got }) => got(...args));
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const exps = require("../exports.json");

module.exports = {
  name: "cal",
  aliases: ["calendar", "kalenteri", "kal"],
  description: "mayk.fi kalenteri!",
  category: "util",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: false,
  cooldown: 2,
  usage: "<määrä>",
  async execute(message, args) {
    const url = "https://www.mayk.fi/kalenteri/";

    const dom = new JSDOM();
    const document = dom.window.document;

    message.reply(":gear: Odota hetki, data lataa...").then((sentMessage) => {
      got(url).then((response) => {
        document.body.innerHTML = response.body;
        const event = document.querySelectorAll("div.summary");
        const time = document.querySelectorAll("abbr.dtstart");

        const eventArray = Array.from(event).map((item) => {
          return item.textContent;
        });
        const timeArray = Array.from(time).map((item) => {
          return item.textContent;
        });

        const eventTimeArray = eventArray.map((item, index) => {
          return {
            event: item,
            time: timeArray[index],
          };
        });

        const amountArgs = () => {
          if (!args[0]) {
            return 5;
          } else {
            if (isNaN(args[0])) {
              return 5;
            } else {
              if (args[0] > 15) {
                return 15;
              } else if (args[0] < 3) {
                return 3;
              } else {
                return Math.round(args[0]);
              }
            }
          }
        };

        const calEmbed = new MessageEmbed()
          .setColor("BLURPLE")
          .setTitle("📆 mayk.fi kalenteri")
          .setURL(url)
          .setDescription(`**${amountArgs()}** tapahtumaa`)
          .setFooter(`mayk.fi`, exps.maykLogoURL)
          .setTimestamp();

        for (let i = 0; i < amountArgs(); i++) {
          calEmbed.addField(
            `${eventTimeArray[i].time}`,
            `${eventTimeArray[i].event}`,
            false
          );
        }

        message.channel.send({ embeds: [calEmbed] });

        sentMessage.edit(`:white_check_mark: **Data on ladattu!**`).then(() => {
          setTimeout(() => {
            sentMessage.delete();
          }, 3000);
        });
      });
    });
  },
};
