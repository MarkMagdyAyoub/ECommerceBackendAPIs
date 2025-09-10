const nodemailer = require('nodemailer');
const emailTemplate = require('./mailTemplate');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APPLICATION_EMAIL,
    pass: process.env.APPLICATION_PASSWORD
  },
  tls:{
    rejectUnauthorized:false
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.error("Nodemailer verification failed:", err);
    process.exit(1);
  }
  else 
    console.log("Nodemailer ready to send emails");
});

const sendMail = async (email) => {
  try {
    const info = await transporter.sendMail({
      from: `QuickCart <${process.env.APPLICATION_EMAIL}>`,
      to: email,
      subject: "Verify Your Email",
      text: "Please click the link to verify your email",
      html: emailTemplate(email)
    });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
};

module.exports = {
  sendMail
}
