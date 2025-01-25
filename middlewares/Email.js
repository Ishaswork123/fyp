const { transporter } = require("./Email.confiq");
const { Verification_Email_Template, Welcome_Email_Template } = require("./EmailTemplate");

const sendVerificationEmail = async (email, verificationCode) => {
  try {
    if (!email || !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      console.error("Invalid email address:", email);
      return;
    }

    console.log('Sending verification email to:', email);

    const response = await transporter.sendMail({
      from: '"Tamroz" <univer7ity22o3@gmail.com>',
      to: email, // list of receivers
      subject: "Verify your Email", // Subject line
      text: "Verify your Email", // plain text body
      html: Verification_Email_Template.replace("{verificationCode}", verificationCode),
    });
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.log("Email error", error);
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    if (!email || !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}$/)) {
        console.error("Invalid email address:", email);
    }

    console.log('Sending welcome email to:', email);

    const response = await transporter.sendMail({
      from: '"Tamroz" <univer7ity22o3@gmail.com>',
      to: email, // list of receivers
      subject: "Welcome Email", // Subject line
      text: "Welcome Email", // plain text body
      html: Welcome_Email_Template.replace("{name}", name),
    });
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.log("Email error", error);
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
};
