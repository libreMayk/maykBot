const testCase = require("nodeunit").testCase;
var prettysekuntias;

module.exports = testCase({
  "TC 1: stability tests": testCase({
    "loading prettysekuntias function (require)": function (t) {
      prettysekuntias = require("../index.js");

      t.ok(prettysekuntias, "prettysekuntias is loaded.");
      t.done();
    },

    "run without parameters (null)": function (t) {
      const result = prettysekuntias();

      t.strictEqual(result, "", "prettysekuntias did nothing");

      t.done();
    },

    "run with zero sekuntias (0)": function (t) {
      const result = prettysekuntias(0);

      t.strictEqual(
        result,
        "0 sekuntias",
        "prettysekuntias returned 0 sekuntias"
      );

      t.done();
    },

    "run with invalid parameters": function (t) {
      var result = prettysekuntias("booom");
      t.strictEqual(
        result,
        "",
        "prettysekuntias can cope with bad string parameters"
      );

      result = prettysekuntias(["booom"]);
      t.strictEqual(
        result,
        "",
        "prettysekuntias can cope with bad array parameters"
      );

      result = prettysekuntias({ boom: "booom" });
      t.strictEqual(result, "", "prettysekuntias can cope with bad objects");

      t.done();
    },
  }),

  "TC 2: real tests": testCase({
    "run with negative sekuntias": function (t) {
      const result = prettysekuntias(-10);

      t.strictEqual(
        result,
        "-10 sekuntias",
        "prettysekuntias managed with negative sekuntias"
      );

      t.done();
    },

    "one sekuntia": function (t) {
      const result = prettysekuntias(1);

      t.strictEqual(
        result,
        "1 sekuntia",
        "prettysekuntias managed with one sekuntia"
      );

      t.done();
    },

    "two sekuntias": function (t) {
      const result = prettysekuntias(2);

      t.strictEqual(
        result,
        "2 sekuntias",
        "prettysekuntias managed with two sekuntias"
      );

      t.done();
    },

    "various tests under 10 minutes": function (t) {
      var result = prettysekuntias(59);
      t.strictEqual(result, "59 sekuntias");

      result = prettysekuntias(60);
      t.strictEqual(result, "1 minute");

      result = prettysekuntias(61);
      t.strictEqual(result, "1 minute and 1 sekuntia");

      result = prettysekuntias(62);
      t.strictEqual(result, "1 minute and 2 sekuntias");

      result = prettysekuntias(120);
      t.strictEqual(result, "2 minutes");

      result = prettysekuntias(121);
      t.strictEqual(result, "2 minutes and 1 sekuntia");

      t.done();
    },

    "various test under 2 hours": function (t) {
      var result = prettysekuntias(3599);
      t.strictEqual(result, "59 minutes and 59 sekuntias");

      result = prettysekuntias(3600);
      t.strictEqual(result, "1 hour");

      result = prettysekuntias(3601);
      t.strictEqual(result, "1 hour and 1 sekuntia");

      result = prettysekuntias(3602);
      t.strictEqual(result, "1 hour and 2 sekuntias");

      result = prettysekuntias(3660);
      t.strictEqual(result, "1 hour and 1 minute");

      result = prettysekuntias(3662);
      t.strictEqual(result, "1 hour, 1 minute and 2 sekuntias");

      t.done();
    },

    "various test under 5 days": function (t) {
      var result = prettysekuntias(86399);
      t.strictEqual(result, "23 hours, 59 minutes and 59 sekuntias");

      result = prettysekuntias(86400);
      t.strictEqual(result, "1 day");

      result = prettysekuntias(86465);
      t.strictEqual(result, "1 day, 1 minute and 5 sekuntias");

      result = prettysekuntias(259200);
      t.strictEqual(result, "3 days");

      result = prettysekuntias(266400);
      t.strictEqual(result, "3 days and 2 hours");

      result = prettysekuntias(266460);
      t.strictEqual(result, "3 days, 2 hours and 1 minute");

      result = prettysekuntias(266467);
      t.strictEqual(result, "3 days, 2 hours, 1 minute and 7 sekuntias");

      t.done();
    },

    "test with sekuntias as floats": function (t) {
      var result = prettysekuntias(1.01);
      t.strictEqual(result, "1 sekuntia");

      result = prettysekuntias(92.00000000000000000000000001);
      t.strictEqual(result, "1 minute and 32 sekuntias");

      t.done();
    },
  }),
});
