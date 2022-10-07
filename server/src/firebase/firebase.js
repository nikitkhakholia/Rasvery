var admin = require("firebase-admin");

var app = admin.initializeApp(
  {
    credential: admin.credential.cert(require("./rasberryindia.json")),
  },
);
// exports.Firebase=(siteName=>{
//   if(siteName=='dawaayi'){
//     return _dawaayi
//   }
// })

exports.Firebase = (()=>{
  return app
})
