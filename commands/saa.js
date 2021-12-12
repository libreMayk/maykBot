const { Builder } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/firefox");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require("fs");
const weatherMojis = require("../test/json/weatherMojis.json");
const config = require("../config.json");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const puppeteer = require("puppeteer");
const { createCanvas, loadImage } = require("canvas");
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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
      const url = "https://www.ilmatieteenlaitos.fi/saa/helsinki/maunula";

      // const dom = new JSDOM();
      // const document = dom.window.document;

      // got(url).then((response) => {
      //   const html = response.body;
      //   document.body.innerHTML = html;

      //   const weatherArray = document.querySelectorAll("span.col-7.pl-0");

      //   console.log(weatherArray[0].textContent);
      //   console.log(weatherArray[1].textContent);
      //   console.log(weatherArray[2].textContent);
      //   console.log(weatherArray[3].textContent);
      //   console.log(weatherArray[4].textContent);
      //   console.log(weatherArray[5].textContent);
      //   console.log(weatherArray[6].textContent);
      //   console.log(weatherArray[7].textContent);
      //   console.log(weatherArray[8].textContent);
      // });

      // const browser = await puppeteer.launch();
      // const page = await browser.newPage();
      // await page.goto(url);

      // const driver = await new Builder()
      //   .setFirefoxOptions(new Options().headless())
      //   .forBrowser("firefox")
      //   .build();
      // await driver.get("https://www.foreca.fi/Finland/Helsinki/Maunula");

      // // d-inline-flex flex-wrap justify-content-between w-100 row mb-3
      // const lampotilaText = await driver
      //   .findElement({
      //     className: "temp",
      //   })
      //   .getText();

      // const [weatherValue] = await page.$x("//span[@class='col-7 pl-0']");
      // const weatherSrc = await weatherValue.getProperty("textContent");
      // const weatherText = await weatherSrc.jsonValue();

      // const tuuli = await driver
      //   .findElement({
      //     // partialLinkText: "<p>Tuntuu Kuin <em></em></p>",
      //     tagName: "em",
      //   })
      //   .getText();

      // const ilmanpaine = await driver
      //   .findElement({
      //     className: "value",
      //   })
      //   .getText();

      let lat = config.maykLat;
      let lon = config.maykLon;
      let apiKey = config.weatherApiKey;
      const weatherInfo = async () => {
        const allData = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const json = await allData.json();

        const windDirMoji = () => {
          if (json.wind.deg >= 0 && json.wind.deg <= 45) {
            return "⬆";
          } else if (json.wind.deg > 45 && json.wind.deg <= 90) {
            return "↗";
          } else if (json.wind.deg > 90 && json.wind.deg <= 135) {
            return "➡";
          } else if (json.wind.deg > 135 && json.wind.deg <= 180) {
            return "↘";
          } else if (json.wind.deg > 180 && json.wind.deg <= 225) {
            return "⬇";
          } else if (json.wind.deg > 225 && json.wind.deg <= 270) {
            return "↙";
          } else if (json.wind.deg > 270 && json.wind.deg <= 315) {
            return "⬅";
          } else if (json.wind.deg > 315 && json.wind.deg <= 360) {
            return "↖";
          } else {
            return "⬆";
          }
        };

        const weatherIconMoji = () => {
          if (
            json.weather[0].icon === "01d" ||
            json.weather[0].icon === "01n"
          ) {
            return ":sunny:";
          } else if (
            json.weather[0].icon === "02d" ||
            json.weather[0].icon === "02n"
          ) {
            return ":partly_sunny:";
          } else if (
            json.weather[0].icon === "03d" ||
            json.weather[0].icon === "03n"
          ) {
            return ":cloud:";
          } else if (
            json.weather[0].icon === "04d" ||
            json.weather[0].icon === "04n"
          ) {
            return ":cloud:";
          } else if (
            json.weather[0].icon === "09d" ||
            json.weather[0].icon === "09n"
          ) {
            return ":white_sun_rain_cloud:";
          } else if (
            json.weather[0].icon === "10d" ||
            json.weather[0].icon === "10n"
          ) {
            return ":cloud_rain:";
          } else if (
            json.weather[0].icon === "11d" ||
            json.weather[0].icon === "11n"
          ) {
            return ":thunder_cloud_rain:";
          } else if (
            json.weather[0].icon === "13d" ||
            json.weather[0].icon === "13n"
          ) {
            return ":snowflake:";
          } else if (
            json.weather[0].icon === "50d" ||
            json.weather[0].icon === "50n"
          ) {
            return ":fog:";
          }
        };

        const canvas = createCanvas(500, 210);
        const ctx = canvas.getContext("2d");

        ctx.font = "20px Consolas";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(
          `Sää Maunulassa klo ${new Date().toLocaleString("fi-FI", {
            hour: "numeric",
            minute: "numeric",
          })}`,
          10,
          20
        );
        ctx.font = "16px Consolas";
        ctx.fillText(
          `Säätila: ${
            json.weather[0].description.charAt(0).toUpperCase() +
            json.weather[0].description.slice(1)
          }`,
          10,
          40
        );
        ctx.font = "16px Consolas";
        ctx.fillText(
          `Lämpötila: ${(json.main.temp - 273.15).toFixed(1)}°C`,
          10,
          60
        );
        ctx.font = "16px Consolas";
        ctx.fillText(`Ilmanpaine: ${json.main.pressure} hPa`, 10, 80);
        ctx.font = "16px Consolas";
        ctx.fillText(`Ilmankosteus: ${json.main.humidity}%`, 10, 100);
        ctx.font = "16px Consolas";
        ctx.fillText(
          `Tuuli:\n   Nopeus: ${json.wind.speed}\n   Suunta: ${
            json.wind.deg
          }° ${windDirMoji()}\n   Puuska: ${json.wind.gust} m/s`,
          10,
          120
        );
        ctx.font = "16px Consolas";
        ctx.fillText(
          `\n\n\nAuringonnousu ja lasku: ${json.sys.sunrise} - ${json.sys.sunset}`,
          10,
          140
        );

        let weatherEmbed = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle(
            `${weatherIconMoji()} Sää Maunulassa klo ${new Date().toLocaleString(
              "fi-FI",
              {
                hour: "numeric",
                minute: "numeric",
              }
            )}`
          )
          .setThumbnail(
            `https://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`
          )
          .setDescription(
            `**Säätila**: ${
              json.weather[0].description.charAt(0).toUpperCase() +
              json.weather[0].description.slice(1)
            }`
          )
          .addFields(
            {
              name: "Lämpötila",
              value: `${(json.main.temp - 273.15).toFixed(1)}°C`,
              inline: true,
            },
            {
              name: "Ilmanpaine",
              value: `${json.main.pressure} hPa`,
              inline: true,
            },
            {
              name: "Ilmankosteus",
              value: `${json.main.humidity}%`,
              inline: true,
            },
            {
              name: `Tuuli`,
              value: `**Nopeus**: ${json.wind.speed}\n**Suunta**: ${
                json.wind.deg
              }° ${windDirMoji()}\n**Puuska**: ${json.wind.gust} m/s`,
              inline: true,
            },
            {
              name: `Auringonnousu ja lasku`,
              value: `🕙 ${new Date(json.sys.sunrise * 1000).toLocaleString(
                "fi-FI",
                {
                  hour: "numeric",
                  minute: "numeric",
                }
              )} - 🕙 ${new Date(json.sys.sunset * 1000).toLocaleString(
                "fi-FI",
                {
                  hour: "numeric",
                  minute: "numeric",
                }
              )}`,
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

        const attachment = new MessageAttachment(canvas.toBuffer(), "sää.png");

        weatherEmbed.setImage(`attachment://sää.png`);

        message.channel.send({
          embeds: [weatherEmbed],
          files: [attachment],
        });
      };

      weatherInfo();
    } catch (error) {
      console.error(error);
      message.reply(`:x: **Tapahtui virhe:**\n\`${error}\``);
    }
  },
};
