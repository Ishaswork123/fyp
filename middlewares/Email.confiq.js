const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "univer7ity22o3@gmail.com",
    pass: "ecqs lshm ifjf lqmd",
  },
});

module.exports = { transporter };

  
