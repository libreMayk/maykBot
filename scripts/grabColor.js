const colorThief = require("colorthief");

function grabColor(url) {
  colorThief.getColor(url).then((color) => {
    const imageColorHex =
      "#" + color.map((c) => Number(c).toString(16)).join("");

    return imageColorHex;
  });
}

module.exports = grabColor;
