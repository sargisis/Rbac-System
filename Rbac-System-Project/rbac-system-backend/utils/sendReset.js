import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendResetEmail = async (email, token) => {
  const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

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
    subject: 'Password Reset',
    html: `
      <h3>Password Reset</h3>
      <p>Click below to reset your password:</p>
      <a href="${link}">${link}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendResetEmail;
