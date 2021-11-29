const puppeteer = require("puppeteer");
const colorThief = require("colorthief");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "blogi",
  aliases: ["blog", "blogpost"],
  description: "Blogi mayk.fi sivustolta!",
  category: "info",
  guildOnly: true,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: true,
  cooldown: 2,
  usage: "<usage>",
  async execute(message, args) {
    // get info using puppeteer
    const url = "https://www.mayk.fi/blogi/";

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [title] = await page.$x("//a[@rel='bookmark']");
    const [desc] = await page.$x(
      "//div[@class='w-grid-item-elm usg_post_content_1  post_content']"
    );
    const [time] = await page.$x(
      "//time[@class='w-grid-item-elm usg_post_date_1  post_date entry-date published']"
    );
    const [img] = await page.$x(
      "//img[@class='attachment-us_600_400_crop size-us_600_400_crop wp-post-image']"
    );

    const titleNew = await title.getProperty("textContent");
    const descNew = await desc.getProperty("textContent");
    const timeNew = await time.getProperty("textContent");
    const imageNew = await img.getProperty("src");
    const linkNew = await title.getProperty("href");

    colorThief.getColor(`${await imageNew.jsonValue()}`).then(async (color) => {
      const imageColorHex =
        "#" + color.map((c) => Number(c).toString(16)).join("");

      console.log(imageColorHex);

      const newsEmbed = new MessageEmbed()
        .setColor(`${imageColorHex}`)
        .setTitle(`${await titleNew.jsonValue()}`)
        .setURL(`${await linkNew.jsonValue()}`)
        .setDescription(`${await descNew.jsonValue()}`)
        .setAuthor(
          `mayk.fi`,
          "https://www.mayk.fi/wp-content/uploads/2017/06/favicon.png"
        )
        .setImage(`${await imageNew.jsonValue()}`)
        .setFooter(`${await timeNew.jsonValue()}`);

      message.channel.send({ embeds: [newsEmbed] });
    });

    await browser.close();
  },
};
