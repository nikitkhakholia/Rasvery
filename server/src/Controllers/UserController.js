const User = require("../Models/User");
const UserService = require("../Services/UserService");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const crypto = require("crypto");
const Otp = require("../Models/Otp");
const { v4: uuidv4 } = require("uuid");
const { Firebase } = require("../firebase/firebase");

exports.getUserById = (req, res, next, id) => {
  CacheClient.get("user_" + id, (e, user) => {
    if (e || !user) {
      UserService.cacheUser(id, req, (err) => {
        if (err) {
          return res.status(400).json({
            status: 0,
            error: "User not found.",
          });
        } else {
          CacheClient.get("user_" + id, (e, user) => {
            req.profile = JSON.parse(user);
            next();
          });
        }
      });
    } else {
      req.profile = JSON.parse(user);
      next();
    }
  });
};
exports.signUp = async (req, res) => {
  const user = new User(req.body);
  if (req.body.session) {
    !user.fname ? (user.fname = "Guest") : "";
    user.password = "" + Math.floor(100000000 + Math.random() * 900000000);
    user.save((err, user) => {
      if (err) {
        if (err.code === 11000) {
          return res.status(400).json({
            status: 0,
            error: `User Already Registered`,
          });
        } else {
          return res.status(400).json({
            status: 0,
            error: `${err.message}`,
          });
        }
      }
      const token = jwt.sign({ salt: user.salt }, process.env.SECRET, {});
      UserService.cacheUser(user._id, req, (err) => {
        if (!err) {
          sendSigninResponse(req, res, user, token);
        }
      });
    });
  }
  if (req.body.otp) {
    Otp.findOne(
      {
        siteId: req.site._id,
        to: req.body.mobile ? req.body.mobile : req.body.email,
      },
      (err, otp) => {
        if (err) {
          return res.status(400).json({
            status: 0,
            error: `${err.message}`,
          });
        }
        if (!otp) {
          return res.status(400).json({
            status: 0,
            error: `Failed to validate OTP.`,
          });
        }
        if (!("" + otp.otp === req.body.otp)) {
          return res.status(400).json({
            status: 0,
            error: `Please check the OTP provided by you.`,
          });
        }
        user.accessKey = Math.random().toString(36).substring(2, 12);
        user.lastLoginTime = new Date();
        user.username = user.email ? user.email : user.mobile;
        user.save((err, user) => {
          if (err) {
            if (err.code === 11000) {
              return res.status(400).json({
                status: 0,
                error: `User Already Registered`,
              });
            } else {
              return res.status(400).json({
                status: 0,
                error: `${err.message}`,
              });
            }
          }
          const token = jwt.sign({ salt: user.salt }, process.env.SECRET, {});
          UserService.cacheUser(user._id, req, (err) => {
            if (!err) {
              sendSigninResponse(req, res, user, token);
            }
          });
        });
      }
    );
  }
  if (req.body.firebaseToken) {
    Firebase()
      .auth()
      .verifyIdToken(req.body.firebaseToken)
      .then((decodedToken) => {
        if (decodedToken.email_verified) {
          User.findOne({
            username: decodedToken.email,
          }).exec((err, user) => {
            if (err) {
              return res.status(400).json({
                status: 0,
                error: `Internal Error 03. Please contact Support.`,
              });
            }
            if (user) {
              // user.firebaseId = decodedToken.uid;
              // user.fname = decodedToken.name;
              // user.imageUrl = decodedToken.picture;
              // user.accessKey = Math.random().toString(36).substring(2, 12);
              // user.lastLoginTime = new Date();
              // user.save((err, user) => {
              //   if (err) {
                  return res.status(400).json({
                    status: 0,
                    error: `Already Registered. Please Sign In.`,
                  });
              //   }
                // const token = jwt.sign(
                //   { salt: user.salt },
                //   process.env.SECRET,
                //   {}
                // );

                // UserService.cacheUser(user._id, req, (err) => {
                //   if (!err) {
                //     sendSigninResponse(req, res, user, token);
                //   } else {
                //     return res.json({
                //       err,
                //     });
                //   }
                // });
              // });
            } else {
              var user1 = new User({
                fname: decodedToken.name,
                email: decodedToken.email,
                username: decodedToken.email,
                password: Math.random().toString(36).substring(2, 12),
                firebaseId: decodedToken.uid,
                imageUrl: decodedToken.picture,
                accessKey: Math.random().toString(36).substring(2, 12),
                lastLoginTime: new Date(),
              });
              user1.save((err, user) => {
                console.log(err);
                if (err) {
                  return res.status(400).json({
                    status: 0,
                    error: `Internal Error 01. Please contact Support.`,
                  });
                }
                const token = jwt.sign(
                  { salt: user.salt },
                  process.env.SECRET,
                  {}
                );
                
                UserService.cacheUser(user._id, req, (err) => {
                  if (!err) {
                    sendSigninResponse(req, res, user, token);
                  } else {
                    return res.json({
                      err,
                    });
                  }
                  //todo password email
                });
              });
            }
          });
          // User.findOneAndUpdate(
          //   { siteId: req.site._id, username: req.site._id + "~" + decodedToken.email },
          //   {
          //     $set: {
          //       email:decodedToken.email,
          //       fname: decodedToken.name,
          //       firebaseId: decodedToken.uid,
          //       password: decodedToken.uid,
          //       imageUrl: decodedToken.picture,
          //       accessKey: Math.random().toString(36).substring(2, 12),
          //       lastLoginTime: new Date()
          //     }
          //   },
          //   { new: true, upsert: true },
          //   (err, user) => {

          //   }
          // )
        } else {
          return res.status(400).json({
            status: 0,
            error: `Internal Error 02. Please contact Support.`,
          });
        }
      });
  }
};
exports.updateUser = (req, res) => {
  delete req.body._id;
  delete req.body.siteId;
  delete req.body.username;
  if (req.profile.mobile) delete req.body.mobile;
  if (req.profile.email) delete req.body.email;
  delete req.body.encryPassword;
  delete req.body.password;
  delete req.body.salt;
  delete req.body.roles;
  delete req.body.firebaseId;
  delete req.body.accessKey;
  delete req.body.lastLoginTime;
  delete req.body.files;
  User.findByIdAndUpdate(
    { _id: req.profile._id, siteId: req.site._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      if (!user) {
        return res.status(400).json({
          status: 0,
          error: `User not found`,
        });
      }
      UserService.cacheUser(user._id, req, (err) => {
        if (!err) {
          res.json({ status: "SUCCESS" });
        }
      });
    }
  );
};
exports.checkUserRole = (role) => {
  return (req, res, next) => {
    if (req.profile.roles.indexOf(role) !== -1) {
      next();
    } else {
      return res.status(400).json({
        status: 0,
        error: `No access granted.`,
      });
    }
  };
};
exports.signIn = (req, res) => {
  const { email, mobile, password, fToken } = req.body;
  if (!password && !fToken) {
    return res.status(400).json({
      status: 0,
      error: `Invalid Request`,
    });
  }
  let username = email ? email : mobile;
  if (fToken) {
    Firebase()
      .auth()
      .verifyIdToken(fToken)
      .then((decodedToken) => {
        username = decodedToken.email_verified ? decodedToken.email : null;
      });
  }

  User.findOne({ username: username }, (err, user) => {
    if (err) {
      return res.status(400).json({
        status: 0,
        error: `${err.message}`,
      });
    }
    if (!user) {
      return res.status(400).json({
        status: 0,
        error: `Please Register First.`,
      });
    }

    if (password) {
      if (!user.authenticate(password)) {
        return res.status(400).json({
          status: 0,
          error: `Please check your email or password.`,
        });
      }
    }

    user.accessKey = Math.random().toString(36).substring(2, 12);
    user.save((err, u) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }

      UserService.cacheUser(u._id, req, (err) => {
        if (!err) {
          const token = jwt.sign({ salt: user.salt }, process.env.SECRET, {});
          sendSigninResponse(req, res, u, token);
        }
      });
    });
  });
};
//  26,78,400secs =31 days
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth",
});
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile.salt == req.auth.salt;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

// checks if the user exists with the given mobile
exports.checkNewEmailMobile = (req, res) => {
  if (req.body.mobile) {
    User.findOne({ mobile: req.body.mobile }, (err, u) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      res.json({ status: u ? "registered" : "ok" });
    });
  }
  if (req.body.email) {
    User.findOne({ email: req.body.email }, (err, u) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      res.json({ status: u ? "registered" : "ok" });
    });
  }
};
exports.userForgotPassword = (req, res) => {
  if (
    req.body.otp &&
    req.body.newPassword &&
    // req.query.newPassword.length>8 &&
    (req.body.email || req.body.mobile)
  ) {
    const username =
      "" +
      req.site._id +
      "~" +
      (req.body.email
        ? req.body.email
        : req.body.mobile
        ? req.body.mobile
        : "");
    User.findOne({ username: username }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          status: 0,
          error: `${err ? err.message : "No user Found."}`,
        });
      }
      if (user) {
        Otp.findOne(
          {
            siteId: req.site._id,
            to: user.email ? user.email : user.mobile,
          },
          (err, otp) => {
            if (err) {
              return res.status(400).json({
                status: 0,
                error: `${err.message}`,
              });
            }
            if (!otp) {
              return res.status(400).json({
                status: 0,
                error: `Please generate OTP.`,
              });
            } else if ("" + otp.otp === req.body.otp) {
              user.salt = uuidv4();
              user.encryPassword = user.securePassword(
                "" + req.body.newPassword
              );
              user.save((err, newuser) => {
                if (!err && newuser) {
                  UserService.cacheUser(user._id, req, (err) => {
                    if (!err) {
                      res.json({ status: "SUCCESS" });
                    }
                  });
                }
              });
            } else {
              return res.status(400).json({
                status: 0,
                error: `Please enter a valid otp.`,
              });
            }
          }
        );
      }
    });
  } else {
    return res.status(400).json({
      status: 0,
      error: `Invalid Request.`,
    });
  }
};

exports.addUserFiles = (fileIds, user, siteId) => {
  return new Promise((resolve, reject) => {
    fileIds.forEach((id, index) => {
      if (id) user.files.push(id);
      if (index === fileIds.length - 1) {
        User.findByIdAndUpdate(
          { _id: user._id, siteId: siteId },
          { $set: { files: user.files } },
          { new: true, useFindAndModify: false },
          (err, user) => {
            if (err) {
              reject(`${err.message}`);
            }
            if (!user) {
              reject(`User not found`);
            }
            UserService.cacheUser(
              "" + user._id,
              { site: { _id: siteId } },
              async (err) => {
                if (!err) {
                  resolve(1);
                }
              }
            );
          }
        );
      }
    });
  });
};
exports.addUserFCMTokens = (req, res) => {
  var token = req.body.token;
  if (!req.profile.fcmTokens) req.profile.fcmTokens = [];
  req.profile.fcmTokens.push({ token: token });
  User.findByIdAndUpdate(
    { _id: req.profile._id, siteId: req.site._id },
    { $set: { fcmTokens: req.profile.fcmTokens } },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          status: 0,
          error: `${err.message}`,
        });
      }
      if (!user) {
        return res.status(400).json({
          status: 0,
          error: `User not found`,
        });
      }
      UserService.cacheUser(user._id, req, (err) => {
        if (!err) {
          res.json({ status: "SUCCESS" });
        }
      });
    }
  );
};
exports.getAllUsers = (req, res) => {
  User.find({ siteId: req.site._id })
    .select("username email mobile")
    .exec((err, users) => {
      if (err) {
        res.status(400).json({ error: err.message, status: 0 });
      } else {
        res.json({ allUsers: users });
      }
    });
};
const sendSigninResponse = (req, res, user, token) => {
  const {
    _id,
    fname,
    lname,
    dob,
    username,
    mobile,
    email,
    roles,
    gstNo,
    firebaseId,
    sessionId,
    imageUrl,
    accessKey,
    lastLoginTime,
    lastLoginDevice,
    files,
    address,
    createdAt,
    updatedAt,
  } = user;

  return res.json({
    status:1,
    token,
    _id,
    fname,
    lname,
    dob,
    username,
    mobile,
    email,
    roles,
    gstNo,
    firebaseId,
    sessionId,
    imageUrl,
    accessKey,
    lastLoginTime,
    lastLoginDevice,
    files,
    address,
    createdAt,
    updatedAt,
  });
};
