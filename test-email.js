const fs = require('fs');
const nodemailer = require('nodemailer');

const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.replace('\r', '').match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2].trim();
});

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT),
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Success: Server is ready to take our messages');
  }
});
