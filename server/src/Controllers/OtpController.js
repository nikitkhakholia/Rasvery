const Otp = require("../Models/Otp");
const { sendEmail } = require("../Services/EmailService");
const { sendSMS_TEXTLOCAL } = require("../Services/SMSService");

// generate and send otp to users
exports.generateOtp = async (req, res) => {
  if (req.body.to) {
    Otp.findOneAndUpdate(
      {
        to: req.body.to,
      },
      {
        $set: { otp: Math.floor(100000 + Math.random() * 900000) },
      },
      { new: true, upsert: true },
      async (err, otp) => {
        if (err) {
          return res.status(400).json({
            status: 0,
            error: "Failed to generate otp.",
          });
        }
        //send email
        if (otp.to.match("^[\\w-\\.+]*[\\w-\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$")) {
          var mailSent = null;

          mailSent = true; //temp bypass
          if (false) {
            var mail = req.site.mails.find((u) => u.for === "cs");
            mailSent = await sendEmail({
              host: mail.host,
              port: mail.port,
              secure: mail.type,
              user: mail.user,
              pass: mail.pass,
              from: "Dawaayi Customer Service <" + mail.user + ">",
              to: otp.to,
              subject: `Your OTP to register with Dawaayi`,
              htmlBody: `<!DOCTYPE html>
                      <html>
                      <head>
                      <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
                      <title></title>
                      <style>
                      body {
                          font-family: 'Poppins';
                      }
                      </style>
                      </head>
                      <body>
                      <h3 style='color:#E71D36;'>Your requested OTP!</h3>
                      <p>Your requested OTP from Dawaayi is <strong><big>${otp.otp}</big></strong>.</p>

                      <small><p style='color:#6c757d'>If you did not request an OTP, then you can ignore this email.</p></small>

                      <small><small><p>This email has been sent to you by 'www.dawaayi.com'.</p></small></small>

                      </body>
                      </html>`,
              replyTo: "noreply@noreply.com",
            });
          }
          if (mailSent) {
            return res.json({ status: 1, message: "OTP sent successfully." });
          } else {
            return res.status(400).json({ status: 0, message: "Failed." });
          }
        }
        // send sms
        if (otp.to.match(/[0-9]{10}/)) {
          var smsSent = false;
          smsSent = true; //temp bypass
          if (false) {
            smsSent = await sendSMS_TEXTLOCAL({
              message: `${otp.otp} is your One Time Password, valid for 30 minutes only. Please do not share your OTP with anyone. Thank you for shopping at dawaayi.com`,
              smsTo: otp.to,
              apiKey: req.site.smsService.find((s) => s.name === "TEXTLOCAL")
                .apiKey,
              sender1: req.site.smsService.find((s) => s.name === "TEXTLOCAL")
                .senderId,
              // unicode: 1,
            });
          }
          if (sms) {
            return res.json({ status: 1, message: "OTP sent successfully." });
          } else {
            return res.status(400).json({
              status: 0,
              error: "Failed to generate otp.",
            });
          }
        }
      }
    );
  }
};
// exports.verifyOtp = (req, res) => {
//   if (req.query.to) {
//     Otp.findOne({ to: req.query.to, siteId: req.site._id }, (err, doc) => {
//       if (req.query.otp == doc.otp) {
//         return res.json({
//           status: 1,
//           error: "Verified.",
//         });
//       }
//       return res.status(400).json({
//         status: 0,
//         error: "Failed to verify otp.",
//       });
//     });
//   }
// };
