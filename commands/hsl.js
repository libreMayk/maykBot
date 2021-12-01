const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: "hsl",
  aliases: ["hsl"],
  description: "HSL | Katso miten pääset Maunulasta jonnekin!",
  category: "util",
  guildOnly: false,
  memberpermissions: "VIEW_CHANNEL",
  adminPermOverride: true,
  cooldown: 0,
  usage: "<usage>",
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
      ];

      const hslEmbed = new MessageEmbed()
        .setColor("#007ac9")
        .setAuthor("digitransit.fi")
        .setThumbnail(
          "https://yt3.ggpht.com/a-/AAuE7mCZV-1Cc1Jfi0aIvOfKcvA3_jOS-OG3YHLRLg=s900-mo-c-c0xffffffff-rj-k-no"
        )
        .setTitle("<:hslLogo:914091968785711134>  Helsingin Seudun Liikenne")
        .setDescription(`HSL - Lähellä koulua olevat pysäkit`)
        .setTimestamp();

      if (
        !args.length ||
        // or if the first argument is not one of allArgs
        !allArgs.includes(args[0].toLowerCase())
      ) {
        fetch(
          "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: `{\"query\":\"{\\n  stopsByRadius(lat: ${config.maykLat}, lon: ${config.maykLon}, radius: 500) {\\n    edges {\\n      node {\\n        stop {\\n          name\\n          code\\n          gtfsId\\n          zoneId\\n          vehicleMode\\n          routes {\\n            shortName\\n          url\\n          }\\n        }\\n        distance\\n      }\\n    }\\n  }\\n}\\n\"}`,
          }
        ).then((response) => {
          response.json().then((data) => {
            //   map on embed
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
                    message.author.id !== config.devId
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
          `Käytä: \n\`${config.prefix}hsl\`\n\`${config.prefix}hsl hae <paikka>\``
        );
        message.channel.send({ embeds: [hslEmbed] });
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
                  .setAuthor("digitransit.fi")
                  .setThumbnail(
                    "https://yt3.ggpht.com/a-/AAuE7mCZV-1Cc1Jfi0aIvOfKcvA3_jOS-OG3YHLRLg=s900-mo-c-c0xffffffff-rj-k-no"
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

                if (message.author.id !== config.devId) {
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
    }
  },
};
