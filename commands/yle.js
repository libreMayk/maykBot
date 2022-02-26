const { MessageEmbed } = require("discord.js");
const colorThief = require("colorthief");
const got = (...args) => import("got").then(({ default: got }) => got(...args));
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = {
  name: "yle",
  aliases: ["yle-uutiset", "yle-news", "news", "uutiset"],
  description: "Yle-uutiset.",
  category: "info",
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

          const titleText =
            document.querySelector(
              "h3.Typography-sc-1his0m9-0.CardHeading__Heading-sc-1b16hi0-0.kPXLsQ.gBvjDy.link-accent"
            ).textContent || `yle.fi`;

          const descText =
            document
              .querySelector("div.GridSystem__GridCell-sc-15162af-0.cprjck")
              .querySelector("p.Typography-sc-1his0m9-0.gjMwJH").textContent ||
            `Ei kuvausta.\n${url}`;

          const imageText =
            document
              .querySelector(
                "div.GridSystem__GridCell-sc-15162af-0.cavjrf.GridMedia__StyledGridImage-sc-ya5uyu-0.bzlYEb"
              )
              .querySelector("img.ResponsiveImage__Img-sc-yvl7gl-0.gpkPTK")
              .getAttribute("src") ||
            `https://yle.fi/uutiset/assets/img/share_image_v1.png`;

          const linkText =
            document
              .querySelector(
                "h3.Typography-sc-1his0m9-0.CardHeading__Heading-sc-1b16hi0-0.kPXLsQ.gBvjDy.link-accent"
              )
              .querySelector("a.underlay-link.visitable-link")
              .getAttribute("href") || `${url}`;

          const timeText =
            document
              .querySelector("div.GridSystem__GridCell-sc-15162af-0.cprjck")
              .querySelector("time.DateTime___StyledTime-sc-327z34-0.HgoPW")
              .textContent || "Tänään";

          const subjectText =
            document
              .querySelector("div.GridSystem__GridCell-sc-15162af-0.cprjck")
              .querySelector("a.Tag__Chip-sc-d06pgy-2.grlKv").textContent || "Uutiset";

          colorThief.getColor(`${imageText}`).then(async (color) => {
            const imageColorHex =
              "#" + color.map((c) => Number(c).toString(16)).join("");
            const newsEmbed = new MessageEmbed()
              .setColor(`${imageColorHex}`)
              .setTitle(`${titleText}`)
              .setURL(`https://yle.fi${linkText}`)
              .setDescription(`${descText}`)
              .setAuthor(`yle.fi`, "https://yle.fi/uutiset/assets/img/touch-icons/180px.png", "https://yle.fi/uutiset/")
              .setImage(`${imageText}`)
              .setFooter(`${timeText} | ${subjectText}`);

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
        .catch((error) => {
          console.log(error);
          message.reply(`:x: **Tapahtui virhe:**\n\`${error}\``);
        });
    });
  },
};
