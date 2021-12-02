const config = require("../config.json");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");

module.exports = {
  name: "covid",
  aliases: [
    "korona",
    "corona",
    "covid19",
    "coronavirus",
    "koronavirus",
    "covid-19",
  ],
  description: "COVID-19 info",
  category: "info",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: false,
  cooldown: 2,
  usage: ``,
  async execute(message, args) {
    await fetch("https://covid-api.com/api/reports/total?iso=FIN", {
      accept: "application/json",
      headers: {
        "x-rapidapi-host": "covid-api.com",
      },
    }).then((res) =>
      res.json().then((data) => {
        const covidEmbed = new MessageEmbed()
          .setAuthor("thl.fi")
          .setTitle("COVID-19 Info")
          .setURL("https://thl.fi/")
          .setDescription(
            "Epäiletkö tartuntaa? Tee koronavirustaudin oirearvio: https://omaolo.fi/"
          )
          .addFields(
            {
              name: "Tartunnat",
              value: `**${
                data.data.confirmed > 0 ? data.data.confirmed : "0"
              }** tartuntaa yhteensä\n**${
                data.data.confirmed_diff > 0 ? data.data.confirmed_diff : "0"
              }** tartuntaa eilen`,
              inline: true,
            },
            {
              name: "Kuolemat",
              value: `**${
                data.data.deaths > 0 ? data.data.deaths : "0"
              }** kuolemaa yhteensä\n**${
                data.data.deaths_diff > 0 ? data.data.deaths_diff : "0"
              }** kuolemaa eilen`,
              inline: true,
            },
            {
              name: "Oireet",
              value:
                "> Kuume\n> Yskä\n> Hengenahdistus\n> Lihassärky\n> Väsymys\n> Kurkkukipu",
              inline: false,
            },
            {
              name: "Suojautuminen",
              value:
                "> Pese kädet saippualla\n> Vältä suuria väkijoukkoja\n> Älä koskettele silmiäsi, suutasi, tai kasvojasi, ellet ole juuri pessyt käsiäsi\n> Vältä kättelyä\n> Yski ja aivasta kertakäyttöliinaan tai hihaasi",
              inline: false,
            }
          )
          .setColor("DARK_GREEN")
          .setImage(
            "https://thl.fi/o/thl-liferay-theme/images/thl_common/thl-logo-fi.png"
          )
          .setTimestamp();

        const covidRow = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("thl.fi")
            .setStyle("LINK")
            .setURL("https://thl.fi/fi/"),
          new MessageButton()
            .setLabel("omaolo.fi")
            .setStyle("LINK")
            .setURL("https://omaolo.fi/")
        );

        message.reply({
          embeds: [covidEmbed],
          components: [covidRow],
        });
      })
    );
  },
};
