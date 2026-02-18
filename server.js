const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* Middlewares */
app.use(cors({
  origin: "*",
  methods: ["POST"]
}));
app.use(express.json());

/* Route */
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      replyTo: email,
      subject: `Portfolio Message from ${name}`,
      html: `
        <h3>New Portfolio Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br/>${message}</p>
      `
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Email failed" });
  }
});

/* Server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
