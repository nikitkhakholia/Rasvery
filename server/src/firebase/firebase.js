var admin = require("firebase-admin");

var _dawaayi = admin.initializeApp(
  {
    credential: admin.credential.cert(require("./dawaayi-d3c8d-firebase-adminsdk-hye2a-01ae23230b.json")),
  },
  "dawaayi"
);
exports.Firebase=(siteName=>{
  if(siteName=='dawaayi'){
    return _dawaayi
  }
})
