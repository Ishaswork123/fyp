const { transporter } = require("./Email.confiq");
const { Verification_Email_Template, Welcome_Email_Template } = require("./EmailTemplate");
const { Verification_Email_Template_for_Reset, Welcome_Email_Template_for_Reset,Welcome_Email_Template_for_Room}=require('./EmailTemplatereset');

const sendVerificationEmail = async (email, verificationCode) => {
  try {
    if (!email || !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      console.error("Invalid email address:", email);
      return;
    }

    console.log('Sending verification email to:', email);

    const response = await transporter.sendMail({
      from: '"PhysicsVerse" <univer7ity22o3@gmail.com>',
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
      from: '"PhysicsVerse" <univer7ity22o3@gmail.com>',
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
const sendVerificationEmail_reset = async (email, verificationCode) => {
  try {
    if (!email || !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      console.error("Invalid email address:", email);
      return;
    }

    console.log('Sending verification email to:', email);

    const response = await transporter.sendMail({
      from: '"PhysicsVerse" <univer7ity22o3@gmail.com>',
      to: email, // list of receivers
      subject: "Verify your Email", // Subject line
      text: "Verify your Email", // plain text body
      html: Verification_Email_Template_for_Reset.replace("{verificationCode}", verificationCode),
    });
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.log("Email error", error);
  }
};

const sendWelcomeEmail_reset = async (email, name) => {
  try {
    if (!email || !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}$/)) {
        console.error("Invalid email address:", email);
    }

    console.log('Sending welcome email to:', email);

    const response = await transporter.sendMail({
      from: '"PhysicsVerse" <univer7ity22o3@gmail.com>',
      to: email, // list of receivers
      subject: "Welcome Email", // Subject line
      text: "Welcome Email", // plain text body
      html: Welcome_Email_Template_for_Reset.replace("{name}", name),
    });
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.log("Email error", error);
  }
};
const sendWelcomeEmail_room = async (email, className, teacher, classCode) => {
  try {
    if (!email || !email.match(/^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/)) {
      console.error("Invalid email address:", email);
      return;
    }

    console.log('Sending welcome email to:', email);

    const response = await transporter.sendMail({
      from: '"PhysicsVerse" <univer7ity22o3@gmail.com>',
      to: email, 
      subject: "Welcome to Your New Class!", 
      text: `Hello, welcome to ${className} class. Your class code is: ${classCode}`, 
      html: Welcome_Email_Template_for_Room(className, teacher, classCode),
    });

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};
module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendVerificationEmail_reset,
  sendWelcomeEmail_reset,
  sendWelcomeEmail_room 
  
};
