const nodemailer = require("nodemailer");

// Looking to send emails in production? Check out our Email API/SMTP product!
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3f24695a59053a",
    pass: "0655d5d8801a60",
  },
});
module.exports = transporter;
