const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "cal",
  aliases: ["calendar", "kalenteri", "kal"],
  description: "mayk.fi kalenteri",
  category: "category",
  guildOnly: true,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: false,
  cooldown: 2,
  usage: "<usage>",
  async execute(message, args) {
    // get info using puppeteer
    const url = "https://www.mayk.fi/kalenteri/";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    page.reload();

    // parse html
    const $ = cheerio.load(html);
    const events = [];
    $("div.event").each((i, el) => {
      const event = {
        title: $(el).find("h2").text(),
        date: $(el).find("time").attr("datetime"),
        link: $(el).find("a").attr("href"),
      };
      events.push(event);
      //   send as fields in embed
      const calEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("mayk.fi kalenteri")
        .setURL(url)
        .setDescription()
        .addField(`${event.title}`, `${event.date}`, true)
        .setFooter(
          `mayk.fi`,
          "https://www.mayk.fi/wp-content/uploads/2017/06/favicon.png"
        )
        .setTimestamp();

      message.channel.send({ embeds: [calEmbed] });
    });
    await browser.close();
  },
};
