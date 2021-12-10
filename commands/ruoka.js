// const getFood = require("../scripts/getFood");
const { Builder } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/firefox");
const fs = require("fs");
const config = require("../config.json");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const twemoji = require("twemoji");

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
      setTimeout(() => {
        sentMessage.edit(`
        :white_check_mark: **Tällä viikolla ruokalassa MAYK:issä:**
      `);
      }, 1500);
    });

    const ruokaEmbed = new MessageEmbed()
      .setTitle(`Ruoka`)
      .setColor("GREEN")
      .setDescription(`Ruoka tällä viikolla MAYK:issä!`)
      .setTimestamp();

    const canvas = createCanvas(500, 150);
    const ctx = canvas.getContext("2d");

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

        // convert date to number
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
            return 6;
          }
        };

        const ruokaPvmText =
          ruokaMenu[
            dateTodayNumConverted() - 1 === 6 || 7
              ? 0
              : dateTodayNumConverted() - 1
          ].querySelector(".ruoka-header-pvm").textContent;
        const ruokaText = ruokaMenu[
          dateTodayNumConverted() - 1 === 6 || 7
            ? 0
            : dateTodayNumConverted() - 1
        ].querySelector(".ruoka-header-ruoka").textContent;
        const kasvisruokaText = ruokaMenu[
          dateTodayNumConverted() - 1 === 6 || 7
            ? 0
            : dateTodayNumConverted() - 1
        ].querySelector(".ruoka-header-kasvisruoka").textContent;

        if (dateTodayNumConverted()) {
          ctx.font = "bold 25px Consolas";
          ctx.fillText(
            `${ruokaPvmText.replace(/\s+/g, "")} ${dateToday}`,
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
          ctx.fillText(`Tänään ei ole ruokaa!`, 10, 80);
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

          console.log(dateTodayLong);

          ruokaEmbed.addFields({
            name: `${
              ruokaPvm.toLowerCase().replace(/\s+/g, "") === dateTodayLong
                ? ":bowl_with_spoon: "
                : ""
            }${ruokaPvm.replace(/\s+/g, "")}`,
            value: `🍽️  ${ruoka}\n🌱  ${kasvisruoka.replace(
              /  Kasvisruoka/g,
              ""
            )}`,
            inline: false,
          });
        });

        message.channel.send({
          embeds: [ruokaEmbed],
          files: [attachment],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
