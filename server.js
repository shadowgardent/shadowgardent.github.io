const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const TO_EMAIL = process.env.TO_EMAIL;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS }
});

transporter.verify()
  .then(() => console.log('SMTP ready'))
  .catch(err => console.error('SMTP verify failed:', err));

app.post('/send', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ ok:false, error:'Missing fields' });

    const mailOptions = {
      from: `"${name}" <${SMTP_USER}>`,
      replyTo: email,
      to: TO_EMAIL,
      subject: `Contact form: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Sent:', info.messageId);
    return res.json({ ok: true, id: info.messageId });
  } catch (err) {
    console.error('Send error:', err);
    return res.status(500).json({ ok:false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));