
const bcrypt = require("bcrypt");
require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");
const corsOptions = {
  origin: "*", // allow all domains (you can restrict to your GitHub Pages URL later)
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
};


const app = express();

app.use(bodyparser.json());
// serve static files from the root folder
app.use(express.static(path.join(__dirname)));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(cors(corsOptions));


// Environment variables
const mongoURI = process.env.DATABASE_URI;
const PORT = process.env.PORT || 3000;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Connect MongoDB
mongoose.connect(mongoURI);
const db = mongoose.connection;
db.on("error", () => console.log("Error in connecting to database."));
db.once("open", () => console.log("Connected to database"));

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Routes
app.post("/sign_up", async (req, res) => {
  try {
    const { name, Phone, email, message } = req.body;

    // Save to DB
    const data = { name, Phone, email, message };
    await db.collection("users").insertOne(data);
    console.log("Record inserted successfully");

    // Respond with JSON (frontend will handle redirect)
    res.status(200).json({ success: true, message: "Signup successful!" });

    // Send emails AFTER response
    setImmediate(async () => {
      try {
        // Email to YOU
        await transporter.sendMail({
          from: EMAIL_USER,
          to: EMAIL_USER,
          subject: "New Form Submission",
          text: `You have a new form submission:\n\nName: ${name}\nPhone: ${Phone}\nEmail: ${email}\nMessage: ${message}`
        });

        // Confirmation email to USER
        await transporter.sendMail({
          from: EMAIL_USER,
          to: email,
          subject: "Thank you for contacting us",
          text: `Hi ${name},\n\nWe have received your message and will get back to you soon.\n\nThank you!`
        });

        console.log("Emails sent successfully");
      } catch (emailErr) {
        console.error("Error sending emails:", emailErr);
      }
    });

  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

//  Important: Listen on Render's port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
