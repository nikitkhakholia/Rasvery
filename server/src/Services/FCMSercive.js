const { Firebase } = require("../firebase/firebase");

exports.notifyDevices = async (siteName, tokens, data) => {
  const messages = [];
  tokens.forEach(token => {
      messages.push({
        data: data,
        token: token,
      })
  });
  Firebase(siteName)
    .messaging()
    .sendAll(messages)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};