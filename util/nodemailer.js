const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = "Robin";
  }

  // methods

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Write the code for send grid in here.
    }

    return nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    console.log("inside send function.");
    // 1. Render HTML based on pug template by using pug.renderFile
    const html = pug.renderFile(
      `${__dirname}/../views/email/${template}.pug`,

      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // 2. Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // text: htmlToText.fromString(html),
      // text: htmlToText.compile(html),
    };

    //3. Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family!..");
  }
  async passwordReset() {
    await this.send(
      "passwordReset",
      "You can have access to reset your password."
    );
  }
};

// console.log(process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD);
// const sendMail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });
//   const mailOptions = {
//     from: "Robin",
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendMail;
