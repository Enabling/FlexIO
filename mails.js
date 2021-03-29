"use strict";
const nodemailer = require("nodemailer");

async function mail(pCallSid, pFrom, pTo, pDateTime, pUrl) {

    let transporter = nodemailer.createTransport({
        host: 'smtp.googlemail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'yourmail@address.be',
            pass: 'yourpassword',
        },
    });

    let info = await transporter.sendMail({
        from: " yourmail@address.be ",
        to: " yourdestinationmail@address.be",
        subject: "SUPPORT CALL " + pCallSid,
        html: "<p>Call information: <br>" +
            "<br>" +
            "From: " + pFrom + "<br>" +
            "To: " + pTo + "<br>" +
            "Message left on: " + pDateTime + "<br>" +
            "Please check this <a href=\"" + pUrl + "\">link<\/a></p>",
    });

    console.log("Message sent: %s", info.messageId);
}

module.exports = { mail };
