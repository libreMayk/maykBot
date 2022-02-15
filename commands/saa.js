const { MessageEmbed, MessageAttachment } = require("discord.js");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { createCanvas } = require("canvas");

module.exports = {
  name: "saa",
  aliases: ["sää", "weather"],
  description: "Näyttää sään Maunulassa.",
  category: "info",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: false,
  cooldown: 2,
  usage: ``,
  async execute(message, args, client) {
    message.reply(":gear: Odota hetki, info lataa...").then((sentMessage) => {
      setTimeout(() => {
        sentMessage.edit(`:white_check_mark: **Data on ladattu!**`).then(() => {
          setTimeout(() => {
            sentMessage.delete();
          }, 1500);
        });
      }, 3500);
    });

    try {
      let lat = 60.22984760837544;
      let lon = 24.925459757586037;
      let apiKey = process.env.WEATHER_API_KEY;
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
          if (json.wind.deg > 22.5 && json.wind.deg <= 67.5) {
            return "↗";
          } else if (json.wind.deg > 67.5 && json.wind.deg <= 112.5) {
            return "➡";
          } else if (json.wind.deg > 112.5 && json.wind.deg <= 157.5) {
            return "↘";
          } else if (json.wind.deg > 157.5 && json.wind.deg <= 202.5) {
            return "⬇";
          } else if (json.wind.deg > 202.5 && json.wind.deg <= 247.5) {
            return "↙";
          } else if (json.wind.deg > 247.5 && json.wind.deg <= 292.5) {
            return "⬅";
          } else if (json.wind.deg > 292.5 && json.wind.deg <= 337.5) {
            return "↖";
          } else if (json.wind.deg > 337.5 || json.wind.deg <= 22.5) {
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

        const canvas = createCanvas(800, 390);
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "rgba(115, 126, 255, 0.5)";
        ctx.fillRect(0, 0, 800, 390);
        ctx.font = "bold 40px Consolas";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(
          `Sää Maunulassa klo ${new Date().toLocaleString("fi-FI", {
            hour: "numeric",
            minute: "numeric",
          })}`,
          10,
          40
        );
        ctx.font = "26px Consolas";
        ctx.fillText(
          `Säätila: ${
            json.weather[0].description.charAt(0).toUpperCase() +
            json.weather[0].description.slice(1)
          }`,
          10,
          80
        );
        ctx.fillText(
          `Lämpötila: ${(json.main.temp - 273.15).toFixed(1)}°C`,
          10,
          120
        );
        ctx.fillText(`Ilmanpaine: ${json.main.pressure} hPa`, 10, 160);
        ctx.fillText(`Ilmankosteus: ${json.main.humidity}%`, 10, 200);
        ctx.fillText(
          `Tuuli:\n    Nopeus: ${
            json.wind.speed ? json.wind.speed : "ei tietoa"
          } m/s\n    Suunta: ${
            json.wind.deg ? json.wind.deg : "ei tietoa"
          }°\n    Puuska: ${
            json.wind.gust ? json.wind.gust : "ei tietoa"
          }`,
          10,
          240
        );
        ctx.fillText(
          `\n\n\nAuringonnousu ja lasku: ${new Date(
            json.sys.sunrise * 1000
          ).toLocaleString("fi-FI", {
            hour: "numeric",
            minute: "numeric",
          })} - ${new Date(json.sys.sunset * 1000).toLocaleString("fi-FI", {
            hour: "numeric",
            minute: "numeric",
          })}`,
          10,
          280
        );

        let weatherEmbed = new MessageEmbed()
          .setColor("BLURPLE")
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
              value: `**Nopeus**: ${
                json.wind.speed ? json.wind.speed : "ei tietoa"
              } m/s\n**Suunta**: ${
                json.wind.deg ? json.wind.deg : "ei tietoa"
              }° ${windDirMoji()}\n**Puuska**: ${
                json.wind.gust ? json.wind.gust : "ei tietoa"
              }`,
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

        const attachment = new MessageAttachment(canvas.toBuffer(), "saa.png");

        weatherEmbed.setImage(`attachment://saa.png`);

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
