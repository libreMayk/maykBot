!(function (e, n) {
  "object" == typeof exports && "undefined" != typeof module
    ? n()
    : "function" == typeof define && define.amd
    ? define(n)
    : n();
})(0, function () {
  function e(e, n, t, o) {
    return (
      (t || (o && !t)) &&
        ((t > 1 || t < -1 || 0 === t) && (n += "s"), e.push(t + " " + n)),
      e
    );
  }
  function n(e) {
    return e.toFixed(10);
  }
  module.exports = function (t) {
    var o = "",
      f = [];
    if ("number" == typeof t) {
      (f = e(f, "päivää", parseInt(n(t / 86400)))),
        (f = e(f, "tuntia", parseInt(n((t % 86400) / 3600)))),
        (f = e(f, "minuuttia", parseInt(n((t % 3600) / 60))));
      var r,
        u = (f = e(f, "sekuntia", Math.floor(t % 60), f.length < 1)).length;
      for (r = 0; r < u; r++)
        o.length > 0 && (o += r === u - 1 ? " ja " : ", "), (o += f[r]);
    }
    return o;
  };
});
//# sourceMappingURL=pretty-sekuntias.umd.js.map
