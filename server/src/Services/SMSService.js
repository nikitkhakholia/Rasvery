var http = require("http");

async function sendSMS_TEXTLOCAL({ message, smsTo, apiKey, sender1, unicode }) {
  return new Promise((resolve, reject) => {
    var msg = encodeURI(message);
    var number = smsTo;
    var apikey = apiKey;
    var sender = sender1;
    var data =
      "apikey=" +
      apikey +
      "&sender=" +
      sender +
      "&numbers=" +
      number +
      "&message=" +
      msg +
      "&unicode=" +
      unicode;
    var options = {
      host: "api.textlocal.in",
      path: "/send?" + data,
    };
    callback = function (response) {
      var str;
      response.on("data", function (chunk) {
        str = JSON.parse(chunk);
      });
      response.on("end", function () {
        if (str.status && str.status == "success") {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    };
    setTimeout(() => {
      resolve(true);
    }, 3000);
    http.request(options, callback).end();
  });
}

module.exports = { sendSMS_TEXTLOCAL };
