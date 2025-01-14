const nodemailer = require("nodemailer")

var transporter = nodemailer.createTransport(
    {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth:{
            user: "suporte.secti.ma@gmail.com",
            pass: "dejqmgsxojubepbz"
        }
    });

    module.exports = transporter