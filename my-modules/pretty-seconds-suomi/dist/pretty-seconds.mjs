function n(n, t, e, r) {
  return (
    (e || (r && !e)) &&
      ((e > 1 || e < -1 || 0 === e) && (t += ""), n.push(e + " " + t)),
    n
  );
}
function t(n) {
  return n.toFixed(10);
}
module.exports = function (e) {
  var r = "",
    o = [];
  if ("number" == typeof e) {
    (o = n(o, "päivää", parseInt(t(e / 86400)))),
      (o = n(o, "tuntia", parseInt(t((e % 86400) / 3600)))),
      (o = n(o, "minuuttia", parseInt(t((e % 3600) / 60))));
    var u,
      a = (o = n(o, "sekuntia", Math.floor(e % 60), o.length < 1)).length;
    for (u = 0; u < a; u++)
      r.length > 0 && (r += u === a - 1 ? " ja " : ", "), (r += o[u]);
  }
  return r;
};
//# sourceMappingURL=pretty-sekuntias.mjs.map
