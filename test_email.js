const fs = require('fs');
if (fs.existsSync('.env.local')) {
  const envConfig = fs.readFileSync('.env.local', 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });
}
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('Testing Email Configuration...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'NOT SET');
  console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'NOT SET');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('ERROR: EMAIL_USER or EMAIL_PASS is missing in .env.local');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    console.log('Attempting to connect to Gmail...');
    await transporter.verify();
    console.log('✅ SUCCESS: Nodemailer successfully connected to Gmail! Credentials are correct.');
    
    console.log('Sending test email to 24mc3040@rgipt.ac.in...');
    await transporter.sendMail({
      from: '"UniLoop Security" <' + process.env.EMAIL_USER + '>',
      to: '24mc3040@rgipt.ac.in',
      subject: 'Test Email Delivery',
      text: 'This is a test email to confirm that Nodemailer is successfully delivering emails to your inbox.'
    });
    console.log('✅ TEST EMAIL SENT SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ ERROR connecting to Gmail:', error.message);
    if (error.response) console.error('Response:', error.response);
  }
}

testEmail();
