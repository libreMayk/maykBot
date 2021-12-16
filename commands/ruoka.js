// const getFood = require("../scripts/getFood");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { createCanvas } = require("canvas");
const got = (...args) => import("got").then(({ default: got }) => got(...args));
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = {
  name: "ruoka",
  aliases: ["ruokala", "food"],
  description: "Ruoka tällä viikolla MAYK:issä!",
  category: "info",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: false,
  cooldown: 15,
  usage: ``,
  async execute(message, args) {
    message.reply(":gear: Odota hetki, info lataa...").then((sentMessage) => {
      const ruokaEmbed = new MessageEmbed()
        .setTitle(`Ruoka`)
        .setColor("GREEN")
        .setDescription(`Ruoka tällä viikolla MAYK:issä!`)
        .setTimestamp();

      let canvas = createCanvas();
      let ctx = canvas.getContext("2d");

      ctx.fillStyle = "rgba(255, 255, 255, 0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f7f7f7";
      ctx.font = "bold 40px Consolas";
      ctx.fillText("Ruoka tänään:", 10, 45);
      ctx.font = "25px Consolas";

      got("https://mayk.fi/tietoa-meista/ruokailu/")
        .then((response) => {
          const dom = new JSDOM(response.body);
          const ruokaMenu = dom.window.document.querySelectorAll(
            ".ruoka-template-header"
          );

          const dateToday = new Date().toLocaleString("fi-FI", {
            dateStyle: "short",
          });

          const dateTodayLong = new Date().toLocaleString("fi-FI", {
            weekday: "long",
            timeZone: "Europe/Helsinki",
          });

          const dateTodayNum = new Date().toLocaleDateString("fi-FI", {
            weekday: "short",
            timeZone: "Europe/Helsinki",
          });

          const dateTodayNumConverted = () => {
            if (dateTodayNum === "ma") {
              return 1;
            }
            if (dateTodayNum === "ti") {
              return 2;
            }
            if (dateTodayNum === "ke") {
              return 3;
            }
            if (dateTodayNum === "to") {
              return 4;
            }
            if (dateTodayNum === "pe") {
              return 5;
            }
            if (dateTodayNum === "la") {
              return 6;
            }
            if (dateTodayNum === "su") {
              return 7;
            }
          };

          const ruokaPvmText =
            ruokaMenu[dateTodayNumConverted() - 1].textContent;

          const ruokaText = ruokaMenu[
            dateTodayNumConverted() - 1
          ].querySelector(".ruoka-header-ruoka").textContent;

          const kasvisruokaText = ruokaMenu[
            dateTodayNumConverted() - 1
          ].querySelector(".ruoka-header-kasvisruoka").textContent;

          const whichIsLonger = () => {
            if (ruokaText.length > kasvisruokaText.length) {
              return ruokaText;
            } else if (ruokaPvmText.length > kasvisruokaText.length) {
              return ruokaPvmText;
            } else {
              return kasvisruokaText;
            }
          };

          if (ruokaPvmText.toLocaleLowerCase().includes(dateTodayLong)) {
            canvas.width = whichIsLonger().length * 2.5;
            canvas.height = 150;

            ctx.fillStyle = "rgba(255, 255, 255, 0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#f7f7f7";
            ctx.font = "bold 40px Consolas";
            ctx.fillText("Ruoka tänään:", 10, 40);
            ctx.font = "25px Consolas";

            ctx.font = "bold 25px Consolas";
            ctx.fillText(
              `${
                dateTodayLong.charAt(0).toUpperCase() + dateTodayLong.slice(1)
              } ${dateToday}`,
              10,
              80
            );
            ctx.font = "25px Consolas";
            ctx.fillText(`🍽️ ${ruokaText}`, 10, 110);
            ctx.fillText(
              `🌱 ${kasvisruokaText.replace(/  Kasvisruoka/g, "")}`,
              10,
              140
            );
          } else {
            canvas.width = 485;
            canvas.height = 50;
            ctx.fillStyle = "rgba(255, 255, 255, 0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#f7f7f7";
            ctx.font = "bold 40px Consolas";
            ctx.fillText("Tänään ei ole ruokaa!", 10, 35);
          }

          const attachment = new MessageAttachment(
            canvas.toBuffer(),
            "ruoka.png"
          );

          ruokaEmbed.setImage("attachment://ruoka.png");

          ruokaMenu.forEach((element) => {
            const ruokaPvm =
              element.querySelector(".ruoka-header-pvm").textContent;
            const ruoka = element.querySelector(
              ".ruoka-header-ruoka"
            ).textContent;
            const kasvisruoka = element.querySelector(
              ".ruoka-header-kasvisruoka"
            ).textContent;

            ruokaEmbed.addFields({
              name: `${
                ruokaPvm.toLowerCase().replace(/\s+/g, "") === dateTodayLong
                  ? "⭐ "
                  : ""
              }${ruokaPvm.replace(/\s+/g, "")}`,
              value: `🍽️  ${
                ruokaPvm.toLowerCase().replace(/\s+/g, "") === dateTodayLong
                  ? `**${ruoka}**`
                  : `${ruoka}`
              }\n🌱  ${
                ruokaPvm.toLowerCase().replace(/\s+/g, "") === dateTodayLong
                  ? `**${kasvisruoka.replace(/  Kasvisruoka/g, "")}**`
                  : `${kasvisruoka.replace(/  Kasvisruoka/g, "")}`
              }`,
              inline: false,
            });
          });

          message.channel.send({
            embeds: [ruokaEmbed],
            files: [attachment],
          });

          sentMessage.edit(
            `:white_check_mark: **Tällä viikolla ruokalassa MAYK:issä:**`
          );
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
};
