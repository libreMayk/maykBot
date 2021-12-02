// const getFood = require("../scripts/getFood");
const { Builder } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/firefox");
const fs = require("fs");
const config = require("../config.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

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
    // declare sent message, or the message by the bot itself
    message.reply(":gear: Odota hetki, info lataa...").then((sentMessage) => {
      // timeout for the message
      setTimeout(() => {
        sentMessage.edit(`
        :white_check_mark: **Tällä viikolla ruokalassa MAYK:issä:**
      `);
      }, 3500);
    });
    // create new promise, and when done, return a value
    const promise = new Promise(async (resolve, reject) => {
      try {
        let driver = await new Builder()
          .setFirefoxOptions(new Options().headless())
          .forBrowser("firefox")
          .build();
        await driver.get("https://mayk.fi/tietoa-meista/ruokailu/");

        const ruokaViikkoWrapper = await driver.findElement({
          id: "ruoka-viikko-wrapper",
        });

        const ruokaHeaderWrappers = await driver.findElements({
          className: "ruoka-template-header",
        });

        const ruokaHeaderPvm = driver.findElement({
          className: "ruoka-header-pvm",
        });
        const ruokaHeaderRuoka = driver.findElement({
          className: "ruoka-header-ruoka",
        });
        const ruokaHeaderKasvisruoka = driver.findElement({
          className: "ruoka-header-kasvisruoka",
        });

        const ruokaHeaderPvmText = ruokaHeaderPvm.getText();
        const ruokaHeaderRuokaText = ruokaHeaderRuoka.getText();
        const ruokaHeaderKasvisruokaText = ruokaHeaderKasvisruoka.getText();

        const ruokaHeaderText = {
          pvm: ruokaHeaderPvmText,
          ruoka: ruokaHeaderRuokaText,
          kasvisruoka: ruokaHeaderKasvisruokaText,
        };

        // ! log the menu items
        const ruokaEmbed = new MessageEmbed()
          .setTitle(`Ruoka tällä viikolla MAYK:issä!`)
          .setColor("GREEN")
          .setDescription(`Ruoka mayk.fi/tietoa-meista/ruokailu`)
          .setTimestamp();

        const cc = ruokaHeaderWrappers.map(async (e) => {
          ruokaEmbed.addFields({
            name: `${await e
              .findElement({
                className: "ruoka-header-pvm",
              })
              .getText()}`,
            value: `🍽️  ${await e
              .findElement({
                className: "ruoka-header-ruoka",
              })
              .getText()}\n🌱  ${(
              await e
                .findElement({
                  className: "ruoka-header-kasvisruoka",
                })
                .getText()
            ).replace(/\nKasvisruoka/g, "")}`,
            inline: false,
          });
        });

        const dd = await Promise.all(cc);
        dd;
        message.channel.send({ embeds: [ruokaEmbed] });

        // take a screenshot
        const dateNow = new Date(Date.now())
          .toLocaleDateString()
          .replace(/\//g, "-");

        // console.log(`\n\u001b[1;35mScreenshot taken at ${dateNow}\u001b[0m\n`);
        // await driver.takeScreenshot(ruokaViikkoWrapper[0]).then((image) => {
        //   fs.writeFileSync(
        //     `../screenshots/maykScreenshot-${dateNow}.png`,
        //     image,
        //     "base64"
        //   );
        // });

        await driver.quit();
      } catch (e) {
        console.log(e);
      }

      resolve();
    });

    // when promise is done, do something
    // promise.then(() => {
    //   // edit client message
    //   message.edit("Odota hetki, info lataa...");
    // });
  },
};
