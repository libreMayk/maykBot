function quantify(data, unit, value, allowZero) {
  if (value || (allowZero && !value)) {
    if (value > 1 || value < -1 || value === 0) {
      unit += "";
    }

    data.push(value + " " + unit);
  }

  return data;
}

function fix10(number) {
  return number.toFixed(10);
}

module.exports = function prettysekuntias(sekuntias) {
  var prettyString = "";
  var data = [];

  if (typeof sekuntias === "number") {
    data = quantify(data, "päivää", parseInt(fix10(sekuntias / 86400)));
    data = quantify(
      data,
      "tuntia",
      parseInt(fix10((sekuntias % 86400) / 3600))
    );
    data = quantify(
      data,
      "minuuttia",
      parseInt(fix10((sekuntias % 3600) / 60))
    );
    data = quantify(
      data,
      "sekuntia",
      Math.floor(sekuntias % 60),
      data.length < 1
    );

    const length = data.length;
    var i;

    for (i = 0; i < length; i++) {
      if (prettyString.length > 0) {
        if (i === length - 1) {
          prettyString += " ja ";
        } else {
          prettyString += ", ";
        }
      }

      prettyString += data[i];
    }
  }

  return prettyString;
};
