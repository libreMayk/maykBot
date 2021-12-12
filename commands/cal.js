const puppeteer = require("puppeteer");
const { MessageEmbed } = require("discord.js");
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = {
  name: "cal",
  aliases: ["calendar", "kalenteri", "kal"],
  description: "mayk.fi kalenteri",
  category: "category",
  guildOnly: true,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: false,
  cooldown: 2,
  usage: "",
  async execute(message, args) {
    const url = "https://www.mayk.fi/kalenteri/";

    const calEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setTitle("📆 mayk.fi Kalenteri")
      .setURL(url)
      .setDescription(`Tulevat tapahtumat!`)
      .setFooter(
        `mayk.fi`,
        "https://www.mayk.fi/wp-content/uploads/2017/06/favicon.png"
      )
      .setTimestamp();

    const dom = new JSDOM();
    const document = dom.window.document;

    message.reply(":gear: Odota hetki, info lataa...").then((sentMessage) => {
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

        for (let i = 0; i < 5; i++) {
          calEmbed.addField(
            `${eventTimeArray[i].time}`,
            `${eventTimeArray[i].event}`,
            false
          );
        }

        message.channel.send({ embeds: [calEmbed] });

        sentMessage
          .edit(`:white_check_mark: **Tiedot on ladattu!**`)
          .then(() => {
            setTimeout(() => {
              sentMessage.delete();
            }, 3000);
          });
      });
    });
  },
};
