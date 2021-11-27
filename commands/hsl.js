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
  cooldown: 5,
  usage: "<usage>",
  execute(message, args) {
    const hslEmbed = new MessageEmbed()
      .setColor("#007ac9")
      .setAuthor("digitransit.fi")
      .setThumbnail(
        "https://yt3.ggpht.com/a-/AAuE7mCZV-1Cc1Jfi0aIvOfKcvA3_jOS-OG3YHLRLg=s900-mo-c-c0xffffffff-rj-k-no"
      )
      .setTitle("<:hslLogo:914091968785711134>  Helsingin Seudun Liikenne")
      .setDescription(`HSL - Lähellä koulua olevat pysäkit`)
      .setTimestamp();

    fetch("https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: `{\"query\":\"{\\n  stopsByRadius(lat: ${config.maykLat}, lon: ${config.maykLon}, radius: 500) {\\n    edges {\\n      node {\\n        stop {\\n          name\\n          code\\n          gtfsId\\n          zoneId\\n          routes {\\n            shortName\\n          }\\n        }\\n        distance\\n      }\\n    }\\n  }\\n}\\n\"}`,
    })
      .then((response) => {
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
                  .join(", ")}\n🆔 **gtfsId:** \`${
                  element.node.stop.gtfsId
                }\`\n`,
                inline: false,
              });
            } else {
              hslEmbed.setDescription(`Ei ole pysäkkiä!`);
            }
          });
          message.channel.send({ embeds: [hslEmbed] });
        });
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
