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
  usage: "",
  async execute(message, args) {
    // get info using puppeteer
    const url = "https://www.mayk.fi/kalenteri/";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [event] = await page.$x("//div[@class='summary']");
    const [time] = await page.$x("//abbr[@class='dtstart']");

    const eventText = await event.getProperty("textContent");
    const eventContent = await eventText.jsonValue();
    const timeText = await time.getProperty("textContent");
    const timeContent = await timeText.jsonValue();

    //   send as fields in embed
    const calEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setTitle("mayk.fi Kalenteri")
      .setURL(url)
      .setDescription(`Tulevat tapahtumat!`)
      .setFooter(
        `mayk.fi`,
        "https://www.mayk.fi/wp-content/uploads/2017/06/favicon.png"
      )
      .setTimestamp();

    // map event and time to embed fields
    const eventArray = eventContent.split("\n");
    const timeArray = timeContent.split("\n");
    const eventTimeArray = eventArray.map((item, index) => {
      return {
        event: item,
        time: timeArray[index],
      };
    });

    //   add fields to embed
    eventTimeArray.forEach((item) => {
      calEmbed.addField(item.time, item.event);
    });

    message.channel.send({ embeds: [calEmbed] });
    await browser.close();
  },
};
