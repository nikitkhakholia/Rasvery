const User = require("../Models/User");

exports.cacheUser = (id, req, next) => {
  User.findOne({ _id: id })
    .select("-createdAt -updatedAt -__v")
    .exec((err, user) => {
      if (err || !user) {
        next(true);
      } else {
        CacheClient.set("user_" + user._id, JSON.stringify(user), (e) => {
          next(false);
        });
      }
    });
};

exports.cacheAdminUserFCMTokens = async (req, next) => {
  var adminTokens = [];
  await User.find({ siteId: req.site._id, roles: "ROLE_ADMIN" })
    .select("fcmTokens")
    .exec((err, users) => {
      if (err) next(true);
      if (users.length == 0) next(true);
      if (users.length > 0) {
        users.forEach((user, i) => {
          user.fcmTokens.forEach((token, j) => {
            if (true) {
              adminTokens.push(token.token);
            } else {
              // todo delete expired token
            }

            if ((i == (users.length - 1)) && (j == (user.fcmTokens.length - 1))) {
              CacheClient.set(
                "admin_user_fcm_tokens",
                JSON.stringify(adminTokens),
                (e)=>{
                  next(false)
                }
              );
            }
          });
        });
      }
    });
};
