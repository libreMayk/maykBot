const { MessageEmbed } = require("discord.js");
const puppeteer = require("puppeteer");

module.exports = {
  name: "news",
  aliases: ["uutiset"],
  description: "Uutisia Ylestä!",
  category: "category",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: true,
  cooldown: 2,
  usage: "<usage>",
  async execute(message, args) {
    const url = "https://yle.fi/uutiset/";
    // get news from yle.fi
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [title] = await page.$x(
      "//h3[@class='Typography__ResponsiveTypography-sc-1his0m9-1 gbPrlN link-accent']"
    );
    const [image] = await page.$x(
      "//img[@class='ResponsiveImage__Img-sc-yvl7gl-0 gpkPTK']"
    );
    const [link] = await page.$x(
      "//a[@class='Headline__Direction-sc-5nx0d9-0 lBMyl visitableLink']"
    );
    const [time] = await page.$x(
      "//time[@class='DateTime__Time-sc-327z34-0 fNRHDu']"
    );
    const [subject] = await page.$x(
      "//span[@class='Tag__Chip-sc-d06pgy-2 grlKv']"
    );
    const titleNew = await title.getProperty("textContent");
    const imageNew = await image.getProperty("src");
    const linkNew = await link.getProperty("href");
    const timeNew = await time.getProperty("textContent");
    const subjectNew = await subject.getProperty("textContent");

    const newsEmbed = new MessageEmbed()
      .setColor("NOT_QUITE_BLACK")
      .setTitle("Uutiset")
      .setURL(`${await linkNew.jsonValue()}`)
      .setDescription(`${await titleNew.jsonValue()}`)
      .setImage(`${await imageNew.jsonValue()}`)
      .setFooter(
        `${await subjectNew.jsonValue()} | ${await timeNew.jsonValue()}`
      );

    message.channel.send({ embeds: [newsEmbed] });
  },
};
