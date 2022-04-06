const colorThief = require("colorthief");
const { MessageEmbed } = require("discord.js");
const got = (...args) => import("got").then(({ default: got }) => got(...args));
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const exps = require("../exports.json");

module.exports = {
  name: "blogi",
  aliases: ["blog", "blogpost"],
  description: "Blogi mayk.fi sivustolta!",
  category: "info",
  guildOnly: true,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: true,
  cooldown: 2,
  usage: "",
  async execute(message, args) {
    const url = "https://www.mayk.fi/blogi/";

    message.reply(":gear: Odota hetki, data lataa...").then((sentMessage) => {
      got(url)
        .then((response) => {
          const dom = new JSDOM(response.body);
          const document = dom.window.document;

          const title = document.querySelector(
            "h2.w-grid-item-elm.usg_post_title_1.color_link_inherit.post_title.entry-title"
          ).textContent;

          const link = document
            .querySelector(
              "h2.w-grid-item-elm.usg_post_title_1.color_link_inherit.post_title.entry-title a"
            )
            .getAttribute("href");

          const desc = document.querySelector(
            "div.w-grid-item-elm.usg_post_content_1.post_content"
          ).textContent;

          const time = document.querySelector(
            "time.w-grid-item-elm.usg_post_date_1.post_date.entry-date.published"
          ).textContent;

          const img = document
            .querySelector(
              "img.attachment-us_600_400_crop.size-us_600_400_crop.wp-post-image"
            )
            .getAttribute("src");

          colorThief.getColor(`${img}`).then(async (color) => {
            const imageColorHex =
              "#" + color.map((c) => Number(c).toString(16)).join("");

            const newsEmbed = new MessageEmbed()
              .setColor(`${imageColorHex}`)
              .setTitle(`${title}`)
              .setURL(`${link}`)
              .setAuthor("mayk.fi", exps.maykLogoURL, "https://mayk.fi/blogi")
              .setDescription(`${desc}`)
              .setImage(`${img}`)
              .setFooter(`${time}`);

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
