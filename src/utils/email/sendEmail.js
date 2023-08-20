import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  service: process.env.SERVICE,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const emailSender = async (options) => {
  const info = await transporter.sendMail({
    from: `"E-Commerce App 📦" <${process.env.EMAIL_ADDRESS}>`,
    to: options?.email,
    subject: options?.subject,
    html: options.verifyEmailHtml,
  });

  console.log("Message sent: %s", info.messageId);
};

emailSender().catch(console.error);
