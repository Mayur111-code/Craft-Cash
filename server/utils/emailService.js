const axios = require('axios');

/**
 * Send email using EmailJS
 */
const sendEmail = async (to, subject, htmlContent) => {
  try {
    const data = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: {
        to_email: to,
        subject: subject,
        message_html: htmlContent
      }
    };

    const response = await axios.post(
      'https://api.emailjs.com/api/v1.0/email/send',
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log(`📩 Email sent to ${to}`);
    return response.data;
  } catch (error) {
    console.error(
      '❌ Email sending failed:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/* =========================================================
   OTP EMAIL TEMPLATE
========================================================= */

const getOtpTemplate = (otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CraftCash - Verify Your Account</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">

  <div style="max-width:600px; margin:40px auto; background-color:#0d0d0d; color:#ffffff;
              border-radius:16px; overflow:hidden; border:0.5px solid #2a2a2a;">

    <!-- Header -->
    <div style="background-color:#111; padding:30px 24px 24px; text-align:center; border-bottom:1px solid #1e1e1e;">
      <div style="display:inline-flex; align-items:center; gap:10px; margin-bottom:8px;">
        <div style="width:32px; height:32px; background:#00e5ff; border-radius:8px;
                    display:inline-flex; align-items:center; justify-content:center;">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="5" width="12" height="8" rx="1.5" stroke="#0d0d0d" stroke-width="1.4"/>
            <path d="M5 5V4a3 3 0 0 1 6 0v1" stroke="#0d0d0d" stroke-width="1.4" stroke-linecap="round"/>
            <circle cx="8" cy="9" r="1.2" fill="#0d0d0d"/>
          </svg>
        </div>
        <span style="font-size:24px; font-weight:800; color:#00e5ff; letter-spacing:1px;">CraftCash</span>
      </div>
      <p style="color:#555; font-size:11px; letter-spacing:2px; margin:0; text-transform:uppercase;">
        Where your spending finds clarity
      </p>
    </div>

    <!-- Body -->
    <div style="padding:40px 36px 36px; text-align:center;">

      <!-- Email Icon -->
      <div style="width:60px; height:60px; border-radius:50%; background:#1a1a1a;
                  border:1.5px solid #2e2e2e; display:inline-flex; align-items:center;
                  justify-content:center; margin-bottom:22px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="7" width="18" height="13" rx="2" stroke="#00e5ff" stroke-width="1.5"/>
          <path d="M3 10.5L12 15.5L21 10.5" stroke="#00e5ff" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>

      <h2 style="color:#ffffff; font-size:20px; font-weight:700; margin:0 0 10px;">
        Verify your account
      </h2>
      <p style="color:#666; font-size:14px; line-height:1.7; margin:0 0 30px;">
        Use the one-time password below to complete your registration.<br/>
        Do not share this code with anyone.
      </p>

      <!-- OTP Badge -->
      <div style="background:#00e5ff; border-radius:12px; display:inline-block;
                  padding:18px 48px; margin-bottom:28px;">
        <div style="font-size:11px; font-weight:600; color:#005f6b; letter-spacing:2px;
                    text-transform:uppercase; margin-bottom:6px;">Your OTP</div>
        <div style="font-size:36px; font-weight:800; color:#002b33; letter-spacing:12px;
                    font-family:'Courier New', monospace;">${otp}</div>
      </div>

      <!-- Divider -->
      <div style="border-top:1px solid #1e1e1e; margin:0 0 22px;"></div>

      <!-- Info Row -->
      <table style="width:100%; max-width:360px; margin:0 auto;">
        <tr>
          <td style="text-align:center; padding:0 10px;">
            <div style="width:36px; height:36px; border-radius:50%; background:#1a1a1a;
                        border:1px solid #2a2a2a; display:inline-flex; align-items:center;
                        justify-content:center; margin-bottom:8px;">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="#00e5ff" stroke-width="1.2"/>
                <path d="M7 4.5V7L8.5 8.5" stroke="#00e5ff" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
            </div>
            <div style="font-size:12px; color:#555;">Expires in</div>
            <div style="font-size:13px; font-weight:600; color:#ccc;">10 minutes</div>
          </td>
          <td style="width:1px; background:#222; padding:0;"></td>
          <td style="text-align:center; padding:0 10px;">
            <div style="width:36px; height:36px; border-radius:50%; background:#1a1a1a;
                        border:1px solid #2a2a2a; display:inline-flex; align-items:center;
                        justify-content:center; margin-bottom:8px;">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L8.5 5H12.5L9.5 7.5L10.5 11.5L7 9.5L3.5 11.5L4.5 7.5L1.5 5H5.5L7 1.5Z"
                      stroke="#00e5ff" stroke-width="1.2" stroke-linejoin="round"/>
              </svg>
            </div>
            <div style="font-size:12px; color:#555;">Single use</div>
            <div style="font-size:13px; font-weight:600; color:#ccc;">One time only</div>
          </td>
          <td style="width:1px; background:#222; padding:0;"></td>
          <td style="text-align:center; padding:0 10px;">
            <div style="width:36px; height:36px; border-radius:50%; background:#1a1a1a;
                        border:1px solid #2a2a2a; display:inline-flex; align-items:center;
                        justify-content:center; margin-bottom:8px;">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7C2 4.2 4.2 2 7 2s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5z"
                      stroke="#00e5ff" stroke-width="1.2"/>
                <path d="M5 7l1.5 1.5L9 5" stroke="#00e5ff" stroke-width="1.2"
                      stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div style="font-size:12px; color:#555;">Secured by</div>
            <div style="font-size:13px; font-weight:600; color:#ccc;">CraftCash</div>
          </td>
        </tr>
      </table>

      <p style="color:#3a3a3a; font-size:12px; margin:24px 0 0; line-height:1.6;">
        If you did not request this, please ignore this email or contact support.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color:#111; padding:18px 24px; text-align:center; border-top:1px solid #1e1e1e;">
      <div style="display:inline-flex; align-items:center; gap:6px; margin-bottom:8px;">
        <div style="width:16px; height:16px; background:#00e5ff; border-radius:4px;
                    display:inline-flex; align-items:center; justify-content:center;">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <rect x="1" y="2.5" width="6" height="4" rx="0.8" stroke="#0d0d0d" stroke-width="0.8"/>
            <path d="M2.5 2.5V2a1.5 1.5 0 0 1 3 0v.5" stroke="#0d0d0d" stroke-width="0.8" stroke-linecap="round"/>
          </svg>
        </div>
        <span style="color:#00e5ff; font-size:12px; font-weight:700; letter-spacing:0.5px;">CraftCash</span>
      </div>
      <p style="color:#3a3a3a; font-size:11px; margin:0;">
        &copy; ${new Date().getFullYear()} CraftCash Expense Tracker. All rights reserved.
      </p>
    </div>

  </div>

</body>
</html>



`;
};

/* =========================================================
   BUDGET ALERT EMAIL TEMPLATE
========================================================= */

const getBudgetAlertTemplate = (
  userName,
  percentage,
  totalSpent,
  budgetLimit,
  remaining
) => {
  const isCritical = percentage >= 90;
  const color = isCritical ? '#ff0000' : '#fff500';
  const textColor = isCritical ? '#ffffff' : '#000000';

  return `
<div style="font-family:Arial, sans-serif; max-width:600px; margin:40px auto;
            background-color:#000; color:#fff; padding:20px; border-radius:10px;">

  <div style="text-align:center; border-bottom:1px solid #333; padding-bottom:20px;">
    <h1 style="color:#fff500; margin:0;">My Own CashCraft</h1>
    <p style="color:#888; margin:5px 0;">Financial Intelligence</p>
  </div>

  <div style="padding:30px 0; text-align:center;">
    <div style="display:inline-block; background:${color}; color:${textColor};
                padding:10px 25px; border-radius:50px; font-size:22px; font-weight:bold;">
      ${percentage}% Budget Used
    </div>

    <h2 style="margin:20px 0 10px;">Hello ${userName},</h2>

    <p style="color:#ccc;">
      Here’s a quick snapshot of your monthly budget:
    </p>

    <div style="background:#111; padding:20px; border-radius:8px; margin-top:20px; text-align:left;">
      <p><strong>Total Budget:</strong> ₹${budgetLimit.toLocaleString()}</p>
      <p style="color:${color};"><strong>Total Spent:</strong> ₹${totalSpent.toLocaleString()}</p>
      <p style="color:#00ff00;"><strong>Available:</strong> ₹${remaining.toLocaleString()}</p>
    </div>

    <p style="color:#888; font-size:12px; margin-top:30px;">
      Stay in control with CashCraft 💛
    </p>
  </div>

  <div style="border-top:1px solid #333; padding-top:15px; text-align:center; font-size:10px; color:#555;">
    &copy; ${new Date().getFullYear()} CashCraft Expense Tracker
  </div>
</div>
`;
};

/* =========================================================
   MONTHLY REMINDER EMAIL TEMPLATE
========================================================= */

const getMonthlyReminderTemplate = (userName) => {
  const monthName = new Date().toLocaleString('default', { month: 'long' });

  return `
<div style="font-family:Arial, sans-serif; max-width:600px; margin:40px auto;
            background:#000; color:#fff; padding:20px; border-radius:10px;">

  <div style="text-align:center; border-bottom:1px solid #333; padding-bottom:20px;">
    <h1 style="color:#fff500; margin:0;">My Own CashCraft</h1>
    <p style="color:#888;">New Month, New Goals</p>
  </div>

  <div style="padding:30px 0; text-align:center;">
    <h2>Welcome to ${monthName}!</h2>

    <p style="color:#ccc;">
      Hello ${userName}, it’s the perfect time to plan your finances for this month.
    </p>

    <a href="https://cashcraft-app.com"
       style="display:inline-block; margin-top:25px;
              background:#fff500; color:#000; padding:14px 30px;
              text-decoration:none; border-radius:6px; font-weight:bold;">
      Set Budget Now
    </a>
  </div>

  <div style="border-top:1px solid #333; padding-top:15px; text-align:center; font-size:10px; color:#555;">
    &copy; ${new Date().getFullYear()} CashCraft Expense Tracker
  </div>
</div>
`;
};

module.exports = {
  sendEmail,
  getOtpTemplate,
  getBudgetAlertTemplate,
  getMonthlyReminderTemplate
};
