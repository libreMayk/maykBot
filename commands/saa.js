const { Builder } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/firefox");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const weatherMojis = require("../test/json/weatherMojis.json");
const config = require("../config.json");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const puppeteer = require("puppeteer");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  name: "saa",
  aliases: ["sää", "weather"],
  description: "Näyttää säätä Maunulassa.",
  category: "info",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: false,
  cooldown: 2,
  usage: ``,
  async execute(message, args, client) {
    message.reply(":gear: Odota hetki, info lataa...").then((sentMessage) => {
      setTimeout(() => {
        sentMessage
          .edit(`:white_check_mark: **Tiedot on ladattu!**`)
          .then(() => {
            setTimeout(() => {
              sentMessage.delete();
            }, 1500);
          });
      }, 3500);
    });

    try {
      const url =
        "https://www.ilmatieteenlaitos.fi/local-weather/helsinki/maunula";
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);

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

      const [weatherValue] = await page.$x("//span[@class='col-7 pl-0']");
      const weatherSrc = await weatherValue.getProperty("textContent");
      const weatherText = await weatherSrc.jsonValue();

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
      const weatherInfo = async () => {
        // fetch json from openweathermap and get main.humidity
        const humidity = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const json = await humidity.json();
        return Math.round(json.main.humidity);
      };

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
            value: `${weatherText}`,
            inline: true,
          },
          {
            name: "Ilmanpaine",
            value: `${
              ilmanpaine.length > 5 ? ilmanpaine.slice(0, 5) : ilmanpaine
            } hPa`,
            inline: true,
          },
          // {
          //   name: "Ilmankosteus",
          //   value: `${ilmankosteus()}%`,
          //   inline: true,
          // },
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

      const canvas = createCanvas(700, 300);
      const ctx = canvas.getContext("2d");

      // print all the info like on embed
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "30px Arial";
      ctx.fillStyle = "#000000";
      ctx.fillText(`${weatherEmoji}  Sää Maunulassa:`, 10, 30);
      ctx.font = "20px Arial";
      ctx.fillText(
        `Sää Maunulassa klo ${new Date().toLocaleString("fi-FI", {
          hour: "numeric",
          minute: "numeric",
        })}`,
        10,
        60
      );
      ctx.font = "20px Arial";
      ctx.fillText(`Lämpötila: ${weatherText}`, 10, 90);
      ctx.font = "20px Arial";
      ctx.fillText(
        `Ilmanpaine: ${
          ilmanpaine.length > 5 ? ilmanpaine.slice(0, 5) : ilmanpaine
        } hPa`,
        10,
        120
      );
      ctx.font = "20px Arial";
      ctx.fillText(`Tuuli: ${tuuli}`, 10, 180);

      message.channel.send({
        embeds: [weatherEmbed],
        files: [
          {
            attachment: canvas.toBuffer(),
            name: "weather.png",
          },
        ],
      });

      if (!driver.quit()) {
        await driver.quit();
      }
      await browser.close();
    } catch (error) {
      console.error(error);
      message.reply(":x: **Tapahtui virhe:** Säätietoja ei saatu haettua.");
    }
  },
};
