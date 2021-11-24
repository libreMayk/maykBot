const config = require("../config.json");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const puppeteer = require("puppeteer");
const scrapeWeb = require("../scripts/scrapeCovid.js");

const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0";
const cookieJar = new jsdom.CookieJar();

const resources = new jsdom.ResourceLoader({
  userAgent,
});

const defs = {
  referrer: "https://covid-19.fi/",
  contentType: "text/html",
  includeNodeLocations: true,
  storageQuota: 10000000,
  pretendToBeVisual: true,
  cookieJar,
  resources,
};

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
  adminPermOverride: true,
  cooldown: 2,
  usage: `${config.prefix}${this.name}`,
  async execute(message, args) {
    // Scrape data from covid-19.fi
    const url = "https://covid-19.fi/";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const [el] = await page.$x("//span[@class='statisticCardValue']");
    const src = await el.getProperty("textContent");
    const srcText = await src.jsonValue();

    const covidEmbed = new MessageEmbed()
      .setAuthor("thl.fi")
      .setTitle("COVID-19 Info")
      .setURL(url)
      .setDescription(
        "Epäiletkö tartuntaa? Tee koronavirustaudin oirearvio: https://omaolo.fi/"
      )
      .addFields(
        {
          name: "Tartunnat",
          value: `**${srcText}** tartuntaa`,
          inline: false,
        },
        {
          name: "Oireet",
          value:
            "► Kuume\n► Yskä\n► Hengenahdistus\n► Lihassärky\n► Väsymys\n► Kurkkukipu",
          inline: false,
        },
        {
          name: "Suojautuminen",
          value:
            "► Pese kädet saippualla\n► Vältä suuria väkijoukkoja\n► Älä koskettele silmiäsi, suutasi, tai kasvojasi, ellet ole juuri pessyt käsiäsi\n► Vältä kättelyä\n► Yski ja aivasta kertakäyttöliinaan tai hihaasi",
          inline: false,
        }
      )
      .setColor(
        // Discord red
        "GREEN"
      )
      .setImage(
        // thl logo
        "https://thl.fi/o/thl-liferay-theme/images/thl_common/thl-logo-fi.png"
      )
      .setTimestamp();

    // new button row
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
  },
};
