
const bcrypt = require("bcrypt");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname)));

// Environment variables
const mongoURI = process.env.DATABASE_URI; // FIXED
const PORT = process.env.PORT || 3000;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Connect MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(" Connected to database"))
  .catch((err) => console.error(" Error in connecting to database:", err));

// Schema + Model
const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  message: String,
});
const User = mongoose.model("User", userSchema);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

// Routes
app.get("/", (req, res) => {
  res.send(" Backend is running!");
});

app.post("/sign_up", async (req, res) => {
  try {
    const { name, Phone, email, message } = req.body;

    // Save to DB
    const newUser = new User({ name, phone: Phone, email, message });
    await newUser.save();
    console.log(" Record inserted successfully");

    // Respond quickly
    res.status(200).json({ success: true, message: "Signup successful!" });

    // Send emails AFTER response
    setImmediate(async () => {
      try {
        // Email to YOU
        await transporter.sendMail({
          from: EMAIL_USER,
          to: EMAIL_USER,
          subject: "New Form Submission",
          text: `You have a new form submission:\n\nName: ${name}\nPhone: ${Phone}\nEmail: ${email}\nMessage: ${message}`,
        });

        // Confirmation email to USER
        await transporter.sendMail({
          from: EMAIL_USER,
          to: email,
          subject: "Thank you for contacting us",
          text: `Hi ${name},\n\nWe have received your message and will get back to you soon.\n\nThank you!`,
        });

        console.log("Emails sent successfully");
      } catch (emailErr) {
        console.error("Error sending emails:", emailErr);
      }
    });
  } catch (err) {
    console.error(" Error during signup:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
