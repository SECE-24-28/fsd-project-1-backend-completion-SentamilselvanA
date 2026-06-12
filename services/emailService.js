const nodemailer = require('nodemailer');

const isEmailConfigured = () =>
  process.env.EMAIL_HOST &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS &&
  process.env.EMAIL_PORT &&
  !process.env.EMAIL_USER.includes('your_') &&
  !process.env.EMAIL_PASS.includes('your_');

// Create transporter once — reused across all calls
let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const port = Number(process.env.EMAIL_PORT) || 587;
  // port 465 = SSL (secure: true), port 587 = STARTTLS (secure: false + requireTLS: true)
  const secure = port === 465;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure,
    requireTLS: !secure,          // force STARTTLS on port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,     // 10s to establish connection
    greetingTimeout: 10000,       // 10s to wait for server greeting
    socketTimeout: 15000,         // 15s socket inactivity timeout
    tls: {
      rejectUnauthorized: false,  // allow self-signed certs in dev
    },
    logger: process.env.NODE_ENV === 'development',
    debug: process.env.NODE_ENV === 'development',
  });

  return transporter;
};

// Verify SMTP connection on server startup
const verifyEmailConnection = async () => {
  if (!isEmailConfigured()) {
    console.warn('[Email] Not configured — email sending is disabled.');
    return false;
  }
  try {
    await getTransporter().verify();
    console.log('[Email] SMTP connection verified ✅');
    return true;
  } catch (err) {
    console.error('[Email] SMTP verification failed ❌:', err.message);
    console.error('[Email] Check: Gmail App Password, 2FA enabled, port/host, firewall/VPN blocking port 587');
    transporter = null; // reset so next call retries
    return false;
  }
};

const sendEmail = async ({ to, subject, html }) => {
  if (!isEmailConfigured()) {
    console.log(`[Email skipped — not configured] To: ${to} | Subject: ${subject}`);
    return { skipped: true };
  }

  try {
    const info = await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || `"Rhythm Dance Academy" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[Email sent] To: ${to} | MessageId: ${info.messageId}`);
    return info;
  } catch (err) {
    // Reset transporter on connection errors so next call gets a fresh one
    if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') {
      transporter = null;
    }
    throw err;
  }
};

exports.verifyEmailConnection = verifyEmailConnection;

exports.sendWelcomeEmail = (user) =>
  sendEmail({
    to: user.email,
    subject: 'Welcome to Rhythm Dance Academy!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#d946ef">Welcome, ${user.name}! 🎭</h2>
        <p>Your account has been created successfully.</p>
        <p>Start your dance journey with us at <a href="${process.env.CLIENT_URL}">Rhythm Dance Academy</a>.</p>
      </div>`,
  });

exports.sendVerificationEmail = (user, token) =>
  sendEmail({
    to: user.email,
    subject: 'Verify Your Email — Rhythm Dance Academy',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#d946ef">Hello ${user.name},</h2>
        <p>Click the button below to verify your email address:</p>
        <a href="${process.env.CLIENT_URL}/verify-email/${token}"
           style="display:inline-block;background:#d946ef;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
          Verify Email
        </a>
        <p style="color:#888;font-size:13px;margin-top:16px">This link expires in 24 hours.</p>
      </div>`,
  });

exports.sendPasswordResetEmail = (user, token) =>
  sendEmail({
    to: user.email,
    subject: 'Password Reset — Rhythm Dance Academy',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#d946ef">Hello ${user.name},</h2>
        <p>We received a request to reset your password. Click the button below:</p>
        <a href="${process.env.CLIENT_URL}/reset-password/${token}"
           style="display:inline-block;background:#d946ef;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
          Reset Password
        </a>
        <p style="color:#888;font-size:13px;margin-top:16px">This link expires in 10 minutes. If you did not request this, ignore this email.</p>
      </div>`,
  });

exports.sendApplicationStatusEmail = (application, status) =>
  sendEmail({
    to: application.email,
    subject: `Application ${status} — Rhythm Dance Academy`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#d946ef">Hello ${application.fullName},</h2>
        <p>Your application for <strong>${application.selectedCourse}</strong> has been <strong>${status}</strong>.</p>
        <p>Thank you for your interest in Rhythm Dance Academy!</p>
      </div>`,
  });

exports.sendEnquiryReplyEmail = (enquiry, reply) =>
  sendEmail({
    to: enquiry.email,
    subject: 'Reply to Your Enquiry — Rhythm Dance Academy',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#d946ef">Hello ${enquiry.name},</h2>
        <p>Thank you for your enquiry. Here is our response:</p>
        <div style="background:#f9f9f9;border-left:4px solid #d946ef;padding:12px 16px;border-radius:4px">
          ${reply}
        </div>
      </div>`,
  });
