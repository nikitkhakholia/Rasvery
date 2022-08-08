const nodemailer = require("nodemailer");

function sendEmail({
  host,
  port,
  secure,
  user,
  pass,
  from,
  to,
  subject,
  htmlBody,
  replyTo,
  files
}) {
  return new Promise(async (resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: secure,
      auth: {
        user: user,
        pass: pass,
      },
    });
    let info = await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: htmlBody,
      replyTo: replyTo,
      attachments: files
    });
    resolve(true);
  });
}

module.exports = { sendEmail };
