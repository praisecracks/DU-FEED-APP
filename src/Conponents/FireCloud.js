const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password"
  }
});

exports.sendEmail = functions.https.onRequest(async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).send("Missing email address.");
  }

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Congratulations! Email Notifications Enabled",
    text: `Hi ${name},\n\nYou've successfully enabled email notifications. We'll keep you updated with the latest news!\n\nBest regards,\nYour Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email.");
  }
});
