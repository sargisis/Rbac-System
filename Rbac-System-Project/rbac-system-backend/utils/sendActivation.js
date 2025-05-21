import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendActivationEmail = async (email, token) => {
  const link = `${process.env.CLIENT_URL}/activate?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"RBAC System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Activate your account',
    html: `
      <h2>Welcome to the RBAC system</h2>
      <p>Click the link below to activate your account:</p>
      <a href="${link}">${link}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Activation email sent to ${email}`);
  } catch (err) {
    console.error('❌ Failed to send activation email:', err);
    throw err;
  }
};

export default sendActivationEmail;
