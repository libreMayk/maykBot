const { Builder } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/firefox");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const weatherMojis = require("../json/weatherMojis.json");
const config = require("../config.json");

module.exports = {
  name: "saa",
  aliases: ["sää", "weather"],
  description: "Näyttää säätä Maunulassa.",
  category: "info",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: true,
  cooldown: 2,
  usage: "",
  async execute(message, args) {
    message.reply(":gear: *Pieni hetki, info lataa...*").then((sentMessage) => {
      // timeout for the message
      setTimeout(() => {
        sentMessage
          .edit(`:white_check_mark: **Infon lataus on valmis!**`)
          .then(() => {
            // timeout for the message
            setTimeout(() => {
              sentMessage.delete();
            }, 1000);
          });
      }, 3500);
    });

    try {
      const driver = await new Builder()
        .setFirefoxOptions(new Options().headless())
        .forBrowser("firefox")
        .build();
      await driver.get("https://www.foreca.fi/Finland/Helsinki/Maunula");

      // d-inline-flex flex-wrap justify-content-between w-100 row mb-3
      const lampotilaText = await driver
        .findElement({
          className: "temp",
        })
        .getText();

      const tuuli = await driver
        .findElement({
          // partialLinkText: "<p>Tuntuu Kuin <em></em></p>",
          tagName: "em",
        })
        .getText();

      const ilmanpaine = await driver
        .findElement({
          className: "value",
        })
        .getText();

      let lat = config.maykLat;
      let lon = config.maykLon;
      let apiKey = config.weatherApiKey;
      const ilmankosteus = async () =>
        await fetch(
          `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((json) => {
            return json.main.humidity;
          });

      const weatherEmoji =
        weatherMojis.emojisText[
          Math.floor(Math.random() * weatherMojis.emojisText.length)
        ];

      let weatherEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`${weatherEmoji}  Sää Maunulassa:`)
        .setDescription(
          `Sää Maunulassa klo ${new Date().toLocaleString("fi-FI", {
            hour: "numeric",
            minute: "numeric",
          })}`
        )
        .addFields(
          {
            name: "Lämpötila",
            value: `${lampotilaText + "C"}`,
            inline: true,
          },
          {
            name: "Ilmanpaine",
            value: `${
              ilmanpaine.length > 5 ? ilmanpaine.slice(0, 5) : ilmanpaine
            } hPa`,
            inline: true,
          },
          {
            name: "Ilmankosteus",
            value: `${ilmankosteus}%`,
            inline: true,
          },
          {
            name: "Tuuli",
            value: `${tuuli}`,
            inline: true,
          }
        )
        .setFooter(
          "Päivitetty viimeksi: " +
            new Date().toLocaleString("fi-FI", {
              weekday: "long",
              day: "numeric",
              month: "numeric",
              hour: "numeric",
              minute: "numeric",
            })
        );

      message.channel.send({ embeds: [weatherEmbed] });

      if (!driver.quit()) {
        await driver.quit();
      }
    } catch (error) {
      console.error(error);
      message.reply(":x: **Tapahtui virhe:** Säätietoja ei saatu haettua.");
    }
  },
};
