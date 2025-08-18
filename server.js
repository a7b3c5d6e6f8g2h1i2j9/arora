
const bcrypt = require("bcrypt");
require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();

app.use(bodyparser.json());
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));

// Environment variables
const mongoURI = process.env.DATABASE_URI;
const PORT = process.env.PORT || 3000;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

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

app.post("/sign_up", async (req, res) => {
    try {
        const { name, Phone, email, message } = req.body;

        // Save to DB
        const data = { name, Phone, email, message };
        await db.collection("users").insertOne(data);
        console.log("Record inserted successfully");

        // Respond to user immediately
        res.redirect("/signup_successfull.html");

        // Send emails AFTER responding
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
        res.status(500).send("Something went wrong.");
    }
});

app.get("/", (req, res) => {
    res.set({ "Access-Control-Allow-Origin": "*" });
    return res.redirect("index.html");
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
