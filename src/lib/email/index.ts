import nodemailer from 'nodemailer';

// Transporter will be created dynamically when sending
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return transporter;
  }
  
  return null;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const mailer = getTransporter();

    if (mailer) {
      // Send email using Nodemailer transporter
      const info = await mailer.sendMail({
        from: process.env.EMAIL_FROM || '"HunarOKram" <noreply@hunarokram.com>',
        to,
        subject,
        html
      });
  
      console.log('Email sent via Nodemailer:', info.messageId);
      return true;
    }

    // Fallback to MOCK when no valid SMTP config is provided
    console.log('-----------------------------------------------------');
    console.log(`[MOCK EMAIL SENT TO: ${to}]`);
    console.log(`Subject: ${subject}`);
    console.log('-----------------------------------------------------');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function generateOTP(): string {
  // Generate a 6-digit numeric OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(email: string, otp: string) {
  const subject = `${otp} is your verification code`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #1a1a1a;">Verify your email</h2>
      <p style="color: #6b6b6b; font-size: 16px;">Please use the following 6-digit code to verify your email address. This code will expire in 15 minutes.</p>
      <div style="background-color: #faf9f7; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #d45f2a;">${otp}</span>
      </div>
      <p style="color: #6b6b6b; font-size: 14px;">If you didn't request this code, you can safely ignore this email.</p>
    </div>
  `;
  return sendEmail({ to: email, subject, html });
}

