const { MessageEmbed } = require("discord.js");
const puppeteer = require("puppeteer");
const colorThief = require("colorthief");

module.exports = {
  name: "yle",
  aliases: ["yle-uutiset", "yle-news", "news", "uutiset"],
  description: "Uutisia Ylestä!",
  category: "category",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: false,
  cooldown: 0,
  usage: "",
  async execute(message, args) {
    message.reply(":gear: Odota hetki, info lataa...").then((sentMessage) => {
      // timeout for the message
      setTimeout(() => {
        sentMessage
          .edit(`:white_check_mark: **Infon lataus on valmis!**`)
          .then(() => {
            setTimeout(() => {
              sentMessage.delete();
            }, 3000);
          });
      }, 3500);
    });

    try {
      const url = "https://yle.fi/uutiset/";
      // get news from yle.fi
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);

      const [title] = await page.$x(
        "//h3[@class='Typography__ResponsiveTypography-sc-1his0m9-1 gbPrlN link-accent']"
      );
      const [desc] = await page.$x(
        "//p[@class='Typography-sc-1his0m9-0 ixVCar']"
      );
      const [image] = await page.$x(
        "//img[@class='ResponsiveImage__Img-sc-yvl7gl-0 gpkPTK']" ||
          "//img[@class='ResponsiveImage__Img-sc-yvl7gl-0 gpkPTK blurhashFadeIn']"
      );
      const [link] = await page.$x(
        "//a[@class='GridSystem__GridRow-sc-15162af-1 gLjaGI visitableLink']"
      );
      const [time] = await page.$x(
        "//time[@class='DateTime__Time-sc-327z34-0 fNRHDu']"
      );
      const [subject] = await page.$x(
        "//span[@class='Tag__Chip-sc-d06pgy-2 grlKv']"
      );
      const titleNew = await title.getProperty("textContent");
      const descNew = await desc.getProperty("textContent");
      const imageNew = await image.getProperty("src");
      const linkNew = await link.getProperty("href");
      const timeNew = await time.getProperty("textContent");
      const subjectNew = await subject.getProperty("textContent");

      colorThief
        .getColor(`${await imageNew.jsonValue()}`)
        .then(async (color) => {
          const imageColorHex =
            "#" + color.map((c) => Number(c).toString(16)).join("");
          const newsEmbed = new MessageEmbed()
            .setColor(`${imageColorHex}`)
            .setTitle(`${await titleNew.jsonValue()}`)
            .setURL(`${await linkNew.jsonValue()}`)
            .setDescription(`${await descNew.jsonValue()}`)
            .setAuthor(`yle.fi`)
            .setImage(`${await imageNew.jsonValue()}`)
            .setFooter(
              `${await subjectNew.jsonValue()} | ${await timeNew.jsonValue()}`
            );

          message.channel.send({ embeds: [newsEmbed] });
        });

      await browser.close();
    } catch (error) {
      console.log(error);
      message.reply(`:x: **Tapahtui virhe:**\n\`${error}\``);

      await browser.close();
    }
  },
};
