const { Message } = require("discord.js");
const { Builder } = require("selenium-webdriver");
const fs = require("fs");
const { Options } = require("selenium-webdriver/firefox");

const message = new Message();

export default async function getFood() {
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

    message.reply("Tällä viikolla ruokalassa MAYK:issä:");

    console.log("\u001b[1;31mTällä viikolla ruokalassa MAYK:issä:\n");

    // ! log the menu items
    const cc = ruokaHeaderWrappers.map(async (e) => {
      const ruokaHeaderPvm = await e.findElement({
        className: "ruoka-header-pvm",
      });
      const ruokaHeaderRuoka = await e.findElement({
        className: "ruoka-header-ruoka",
      });
      const ruokaHeaderKasvisruoka = await e.findElement({
        className: "ruoka-header-kasvisruoka",
      });

      const ruokaHeaderPvmText = await ruokaHeaderPvm.getText();
      const ruokaHeaderRuokaText = await ruokaHeaderRuoka.getText();
      const ruokaHeaderKasvisruokaText = await ruokaHeaderKasvisruoka.getText();

      const ruokaHeaderText = {
        pvm: ruokaHeaderPvmText,
        ruoka: ruokaHeaderRuokaText,
        kasvisruoka: ruokaHeaderKasvisruokaText,
      };

      console.log(
        `\u001b[1;0m${ruokaHeaderText.pvm}: \u001b[34m ${
          ruokaHeaderText.ruoka
        }, \u001b[32m ${ruokaHeaderText.kasvisruoka.replace(
          /\nKasvisruoka/g,
          "\u001b[0m"
        )}`
      );

      message.reply(
        `${ruokaHeaderText.pvm}: ${
          ruokaHeaderText.ruoka
        }, ${ruokaHeaderText.kasvisruoka.replace(/\nKasvisruoka/g, "")}`
      );
    });
    const dd = await Promise.all(cc);

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

    driver.quit();
  } catch (e) {
    console.log(e);
  }
}
