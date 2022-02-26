const { MessageEmbed, MessageAttachment } = require("discord.js");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: "hsl",
  aliases: ["hsl", "bus", "bussi", "hel"],
  description: "HSL - Katso miten pääset koulusta johonkin, tai etsi paikkaa.",
  category: "util",
  guildOnly: true,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: true,
  cooldown: 0,
  usage: "<etsi/apua> <etsi:paikka/kunta/kaupunki>",
  execute(message, args) {
    try {
      const allArgs = [
        "search",
        "find",
        "hae",
        "etsi",
        "haku",
        "apua",
        "help",
        "auta",
        "?",
        "rt",
        "realtime",
        "real-time",
        "reaaliaika",
        "reaaliaikainen",
      ];

      const hslEmbed = new MessageEmbed()
        .setColor("#007ac9")
        .setAuthor("hsl.fi", "https://raw.githubusercontent.com/libreMayk/maykBot/main/assets/hsl.png", "https://hsl.fi/")
        .setThumbnail(
          "https://raw.githubusercontent.com/libreMayk/maykBot/main/assets/hsl.png"
        )
        .setTitle("<:hslLogo:914091968785711134>  Helsingin Seudun Liikenne")
        .setDescription(`HSL - Lähellä koulua olevat pysäkit`)
        .setTimestamp();
      if (!args.length || !allArgs.includes(args[0].toLowerCase())) {
        fetch(
          "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: `{\"query\":\"{\\n  stopsByRadius(lat: 60.22984760837544, lon: 24.925459757586037, radius: 700) {\\n    edges {\\n      node {\\n        stop {\\n          name\\n          code\\n          gtfsId\\n          zoneId\\n          vehicleMode\\n          routes {\\n            shortName\\n            url\\n          }\\n        }\\n        distance\\n      }\\n    }\\n  }\\n}\"}`,
          }
        ).then((response) => {
          response.json().then((data) => {
            data.data.stopsByRadius.edges.map((element) => {
              if (element.node.stop.routes.length > 0) {
                const alueMoji = () => {
                  return `:regional_indicator_${element.node.stop.zoneId.toLowerCase()}:`;
                };

                hslEmbed.addFields({
                  name: `🚏 ${element.node.stop.name} (${element.node.stop.code})`,
                  value: `${alueMoji()} **Alue:** ${
                    element.node.stop.zoneId
                  }\n📍 **Etäisyys:** ${
                    element.node.distance
                  }m\n🚌 **Bussit:** ${element.node.stop.routes
                    .map((route) => route.shortName)
                    .join(", ")}\n${
                    message.author.id !== process.env.DEV_ID
                      ? ""
                      : `🆔 **gtfsId:** \`${
                          element.node.stop.gtfsId
                        }\`\n🔗 **URL:**\n\`${element.node.stop.routes
                          .map((route) => route.url)
                          .join("`, `")}\``
                  }`,
                  inline: false,
                });
              } else {
                hslEmbed.setDescription(`Ei ole pysäkkiä!`);
              }
            });
            message.channel.send({ embeds: [hslEmbed] });
          });
        });
      } else if (
        args[0] === "apua" ||
        args[0] === "help" ||
        args[0] === "auta" ||
        args[0] === "?"
      ) {
        hslEmbed.setDescription(
          `Käytä: \n\`${process.env.PREFIX}hsl\`\n\`${process.env.PREFIX}hsl hae <paikka>\``
        );
        message.channel.send({ embeds: [hslEmbed] });
      } else if (
        args[0] === "rt" ||
        args[0] === "realtime" ||
        args[0] === "real-time" ||
        args[0] === "reaaliaika" ||
        args[0] === "reaaliaikainen"
      ) {
        fetch(
          "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: `{\"query\":\"{\\n\\tnearest(\\n\\t\\tlat: 60.22984760837544\\n\\t\\tlon: 24.925459757586037\\n\\t\\tmaxDistance: 700\\n\\t\\tfilterByPlaceTypes: DEPARTURE_ROW\\n\\t) {\\n\\t\\tedges {\\n\\t\\t\\tnode {\\n\\t\\t\\t\\tplace {\\n\\t\\t\\t\\t\\t... on DepartureRow {\\n\\t\\t\\t\\t\\t\\tstop {\\n\\t\\t\\t\\t\\t\\t\\tname\\n\\t\\t\\t\\t\\t\\t\\tcode\\n\\t\\t\\t\\t\\t\\t\\tzoneId\\n\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\tstoptimes {\\n\\t\\t\\t\\t\\t\\t\\trealtimeDeparture\\n\\t\\t\\t\\t\\t\\t\\trealtimeArrival\\n\\t\\t\\t\\t\\t\\t\\trealtime\\n\\t\\t\\t\\t\\t\\t  departureDelay\\n\\t\\t\\t\\t\\t\\t\\ttrip {\\n\\t\\t\\t\\t\\t\\t\\t\\troute {\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tshortName\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tlongName\\n\\t\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t\\theadsign\\n\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t}\\n\\t\\t\\t}\\n\\t\\t}\\n\\t}\\n}\\n\"}`,
          }
        ).then((response) => {
          response
            .json()
            .then((data) => {
              const realtimeEmbed = new MessageEmbed()
                .setColor("#007ac9")
                .setAuthor("hsl.fi", "https://raw.githubusercontent.com/libreMayk/maykBot/main/assets/hsl.png", "https://hsl.fi/")
                .setThumbnail(
                  "https://raw.githubusercontent.com/libreMayk/maykBot/main/assets/hsl.png"
                )
                .setTitle(
                  "<:hslLogo:914091968785711134>  Helsingin Seudun Liikenne"
                )
                .setDescription(
                  `HSL - Lähellä koulua olevat bussit ja linjat\n\n**Huom!** Tämä komento on vielä vain testausta varten, ja ei ole vielä toteutettu käyttöön, joten jotain voi mennä pieleen.`
                )
                .setTimestamp();

              data.data.nearest.edges.map((element) => {
                const alueMoji = () => {
                  return `:regional_indicator_${element.node.place.stop.zoneId.toLowerCase()}:`;
                };

                const place = element.node.place;

                function toTime(time) {
                  var hours = Math.floor(time / (60 * 60));
                  time = time - hours * 60 * 60;
                  var minutes = Math.floor(time / 60);

                  if (hours > 24) {
                    hours = hours - 24;
                  }
                  if (hours === 0) {
                    hours = "00";
                  }
                  if (minutes < 10) {
                    minutes = "0" + minutes;
                  }
                  if (hours < 10) {
                    hours = "0" + hours;
                  }

                  return hours + ":" + minutes;
                }

                place.stoptimes.map((stoptimes) => {
                  if (stoptimes.realtime === true) {
                    realtimeEmbed.addFields({
                      name: `🚏 ${place.stop.name} (${place.stop.code})`,
                      value: `${alueMoji()} **Alue:** ${
                        place.stop.zoneId ? place.stop.zoneId : "Ei aluetta"
                      }\n🗺️ **Reitti:** ${place.stoptimes.map((stoptimes) => {
                        return stoptimes
                          ? stoptimes.trip.route.shortName
                          : "Ei reittiä";
                      })} (${place.stoptimes.map((stoptimes) => {
                        return stoptimes
                          ? stoptimes.trip.route.longName
                          : "Ei reittiä";
                      })})\n🚌 **Bussi:** ${place.stoptimes.map((stoptimes) => {
                        return stoptimes ? stoptimes.headsign : "Ei bussia";
                      })}\n🛬 **Saapumisaika:** ${place.stoptimes.map(
                        (stoptimes) => {
                          return stoptimes
                            ? toTime(stoptimes.realtimeArrival)
                            : "Ei saapumisaikaa";
                        }
                      )}\n⌛ **Lähdön viivästys:** ${place.stoptimes.map(
                        (stoptimes) => {
                          return stoptimes
                            ? `${Math.round(
                                stoptimes.departureDelay / 60
                              )} min ${Math.round(
                                stoptimes.departureDelay % 60
                              )} sek`
                            : "Ei viivästysaikaa";
                        }
                      )}`,
                      inline: false,
                    });
                  } else {
                    return;
                  }
                });
              });
              message.channel.send({ embeds: [realtimeEmbed] });
            })
            .catch((error) => {
              console.error(error);
              message.reply(`:x: **Tapahtui virhe:**\n\`${error}\``);
              return;
            });
        });
      } else if (
        args[0] === "search" ||
        args[0] === "find" ||
        args[0] === "hae" ||
        args[0] === "etsi" ||
        args[0] === "haku"
      ) {
        const argsNew = args.slice(1).join(" ");
        if (argsNew.length === 0) {
          hslEmbed.setDescription(
            `Kirjoita haluamasi osoiten tai paikan nimi!`
          );
        } else {
          fetch(
            `https://api.digitransit.fi/geocoding/v1/search?text=${argsNew}&size=1`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          ).then((response) => {
            response.json().then((data) => {
              if (!data.features[0] || !data.features[0].properties) {
                message.reply(`:x: Ei ole semmosta paikkaa!`);
              } else {
                const element = data.features[0];

                const checkAddress = () => {
                  if (
                    !element.properties.street ||
                    !element.properties.housenumber
                  ) {
                    return ``;
                  } else {
                    return `${element.properties.street} ${element.properties.housenumber}, `;
                  }
                };

                const checkNeighborCity = () => {
                  if (
                    !element.properties.neighbourhood ||
                    !element.properties.localadmin
                  ) {
                    return ``;
                  } else {
                    return `${element.properties.neighbourhood}, ${element.properties.localadmin}, `;
                  }
                };

                const checkRegion = () => {
                  if (!element.properties.region) {
                    return ``;
                  } else {
                    return `${element.properties.region}, `;
                  }
                };

                const hslHakuEmbed = new MessageEmbed()
                  .setColor("#007ac9")
                  .setAuthor("hsl.fi", "https://raw.githubusercontent.com/libreMayk/maykBot/main/assets/hsl.png", "https://hsl.fi/")
                  .setThumbnail(
                    "https://raw.githubusercontent.com/libreMayk/maykBot/main/assets/hsl.png"
                  )
                  .setTitle(
                    `<:hslLogo:914091968785711134> Helsingin Seudun Liikenne`
                  )
                  .setDescription(
                    `
                    ${element.properties.label}
                  `
                  )
                  .addFields(
                    {
                      name: `🏠 Osoite`,
                      value: `${checkAddress()}${
                        element.properties.postalcode
                      }, ${checkNeighborCity()}${checkRegion()}${
                        element.properties.country
                      }`,
                      inline: false,
                    },
                    {
                      name: `
                      📍 Sijainti
                      `,
                      value: `${element.geometry.coordinates[0]}, ${element.geometry.coordinates[1]}`,
                      inline: false,
                    }
                  )
                  .setTimestamp();

                if (message.author.id !== process.env.DEV_ID) {
                  message.channel.send({ embeds: [hslHakuEmbed] });
                } else {
                  hslHakuEmbed.addFields({
                    name: `ℹ Dev-info`,
                    value: `ID: \`${element.properties.id}\`\nNEIGHBORHOOD_GID: \`${element.properties.neighbourhood_gid}\`\nLOCAL_ADMIN_GID: \`${element.properties.localadmin_gid}\`\nREGION_GID: \`${element.properties.region_gid}\`\nCOUNTRY_GID: \`${element.properties.country_gid}\`\n`,
                    inline: false,
                  });

                  message.channel.send({ embeds: [hslHakuEmbed] });
                }
              }
            });
          });
        }
      }
    } catch (error) {
      console.error(error);
      message.reply(`:x: **Tapahtui virhe:**\n\`${error}\``);
      return;
    }
  },
};
