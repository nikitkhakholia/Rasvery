const express = require("express");
const { sendEmail } = require("../Services/EmailService");

const router = express.Router();

// router.post("/sendEmail", async (req, res) => {
//     if (req.headers.accesskey === process.env.APP_KEY){
//       var mail = null;
//       if (req.site._id === 2) {
//         mail = await sendEmail({
//           host: req.site.mails.find((u) => u.for === req.body.sender).host,
//           port: req.site.mails.find((u) => u.for === req.body.sender).port,
//           secure: req.site.mails.find((u) => u.for === req.body.sender).secure,
//           user: req.site.mails.find((u) => u.for === req.body.sender).user,
//           pass: req.site.mails.find((u) => u.for === req.body.sender).pass,
//           from:
//             "" +
//             req.body.fromText +
//             "<" +
//             req.site.mails.find((u) => u.for === req.body.sender).user +
//             ">",
//           to: req.body.toEmail,
//           subject: req.body.subject,
//           htmlBody: req.body.htmlBody,
//           replyTo: "noreply@noreply.com",
//           files: req.body.files,
//         });
//       }
//       if (mail) {
//         return res.json({ status: 1, message: "Mail Sent." });
//       } else {
//         return res.json({ status: 0, message: "Failed." });
//       }
//     }else{
//         res.json({ status: 0, message: "Failed." });
//     }
// });

module.exports = router;
