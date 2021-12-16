const { MessageEmbed } = require("discord.js");
const colorThief = require("colorthief");
const got = (...args) => import("got").then(({ default: got }) => got(...args));
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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
      const url = "https://yle.fi/uutiset/";
      const dom = new JSDOM();
      const document = dom.window.document;

      got(url)
        .then((response) => {
          document.body.innerHTML = response.body;

          const titleText = document.querySelector(
            "h3.Typography__ResponsiveTypography-sc-1his0m9-1.gbPrlN.link-accent"
          ).textContent;

          const descText = document.querySelector(
            "p.Typography-sc-1his0m9-0.ixVCar"
          ).textContent;

          const imageText = document
            .querySelector("img.ResponsiveImage__Img-sc-yvl7gl-0.gpkPTK")
            .getAttribute("src");

          const linkText = document
            .querySelector(
              "a.GridSystem__GridRow-sc-15162af-1.gLjaGI.visitableLink"
            )
            .getAttribute("href");

          const timeText = document.querySelector(
            "time.DateTime__Time-sc-327z34-0.fNRHDu"
          ).textContent;

          const subjectText = document.querySelector(
            "span.Tag__Chip-sc-d06pgy-2.grlKv"
          ).textContent;

          colorThief.getColor(`${imageText}`).then(async (color) => {
            const imageColorHex =
              "#" + color.map((c) => Number(c).toString(16)).join("");
            const newsEmbed = new MessageEmbed()
              .setColor(`${imageColorHex}`)
              .setTitle(`${titleText}`)
              .setURL(`https://yle.fi${linkText}`)
              .setDescription(`${descText}`)
              .setAuthor(`yle.fi`)
              .setImage(`${imageText}`)
              .setFooter(`${subjectText} | Julkaistu klo ${timeText}`);

            message.channel.send({ embeds: [newsEmbed] });

            sentMessage
              .edit(`:white_check_mark: **Data on ladattu!**`)
              .then(() => {
                setTimeout(() => {
                  sentMessage.delete();
                }, 3000);
              });
          });
        })
        .catch((err) => {
          console.log(err);
          message.reply(`:x: **Tapahtui virhe:**\n\`${error}\``);
        });
    });
  },
};
