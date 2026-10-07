import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASSWORD || '';
const emailFrom = process.env.EMAIL_FROM || smtpUser || 'no-reply@recruitmentplatform.com';
const platformUrl = process.env.PLATFORM_URL || 'http://localhost:5173';

export const isSmtpConfigured = Boolean(smtpHost && smtpUser && smtpPass);

let transporter = null;

if (isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

/**
 * Base HTML Email Template Layout.
 */
const renderEmailLayout = ({ title, headline, bodyHtml, ctaText, ctaUrl }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; color: #1e293b; }
      .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
      .header { background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 30px 24px; text-align: center; color: #ffffff; }
      .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
      .content { padding: 32px 28px; line-height: 1.6; font-size: 15px; }
      .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-weight: 600; font-size: 13px; margin: 12px 0; }
      .badge-blue { background-color: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
      .badge-green { background-color: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
      .badge-red { background-color: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
      .badge-purple { background-color: #faf5ff; color: #6b21a8; border: 1px solid #e9d5ff; }
      .info-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0; }
      .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
      .info-row:last-child { margin-bottom: 0; }
      .info-label { color: #64748b; font-weight: 500; }
      .info-value { color: #0f172a; font-weight: 600; }
      .cta-button { display: inline-block; background-color: #4f46e5; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 20px; }
      .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${headline}</h1>
      </div>
      <div class="content">
        ${bodyHtml}
        ${
          ctaText && ctaUrl
            ? `<div style="text-align: center; margin-top: 24px;">
                <a href="${ctaUrl}" class="cta-button">${ctaText}</a>
               </div>`
            : ''
        }
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} AI Recruitment Platform. All rights reserved.</p>
        <p>This is an automated operational notification regarding your application.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

/**
 * Generic safe email sender. Failure will NEVER throw or roll back database operations.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  if (!to) return false;

  if (!isSmtpConfigured || !transporter) {
    console.log(`[Email Service Mock] Email to ${to} | Subject: ${subject}`);
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: `"AI Recruitment Platform" <${emailFrom}>`,
      to,
      subject,
      text: text || subject,
      html,
    });
    console.log(`[Email Service] Sent email to ${to} (MessageId: ${info.messageId})`);
    return true;
  } catch (err) {
    console.error(`[Email Service Error] Failed to send email to ${to}:`, err.message);
    return false;
  }
};

/**
 * Event Trigger 1: Application Submitted
 */
export const sendApplicationSubmittedEmail = async ({
  candidateEmail,
  candidateName,
  company,
  jobTitle,
}) => {
  const subject = `Application Received: ${jobTitle} at ${company}`;
  const headline = 'Application Submitted Successfully';
  const bodyHtml = `
    <p>Dear <strong>${candidateName}</strong>,</p>
    <p>Thank you for applying to the <strong>${jobTitle}</strong> position at <strong>${company}</strong>. We have successfully received your application.</p>
    <div class="info-box">
      <div class="info-row"><span class="info-label">Job Title:</span> <span class="info-value">${jobTitle}</span></div>
      <div class="info-row"><span class="info-label">Company:</span> <span class="info-value">${company}</span></div>
      <div class="info-row"><span class="info-label">Status:</span> <span class="info-value">Applied</span></div>
    </div>
    <p>Our recruiting team is reviewing your profile and resume. You can track your real-time application status directly on your platform dashboard.</p>
  `;

  const html = renderEmailLayout({
    title: subject,
    headline,
    bodyHtml,
    ctaText: 'View Application Status',
    ctaUrl: `${platformUrl}/dashboard`,
  });

  return await sendEmail({ to: candidateEmail, subject, html });
};

/**
 * Event Trigger 2: Application Status Update
 */
export const sendApplicationStatusUpdateEmail = async ({
  candidateEmail,
  candidateName,
  company,
  jobTitle,
  oldStatus,
  newStatus,
  recruiterNotes,
}) => {
  // Prevent duplicate emails for unchanged status
  if (oldStatus === newStatus) return false;

  const subject = `Application Update: ${jobTitle} at ${company} - ${newStatus}`;
  const headline = `Application Status Updated: ${newStatus}`;

  let badgeClass = 'badge-blue';
  if (newStatus === 'Shortlisted' || newStatus === 'Selected') badgeClass = 'badge-green';
  if (newStatus === 'Rejected' || newStatus === 'Withdrawn') badgeClass = 'badge-red';
  if (newStatus === 'Interview Scheduled') badgeClass = 'badge-purple';

  const bodyHtml = `
    <p>Dear <strong>${candidateName}</strong>,</p>
    <p>Your application status for the <strong>${jobTitle}</strong> role at <strong>${company}</strong> has been updated.</p>
    <div style="text-align: center;">
      <span class="badge ${badgeClass}">${newStatus}</span>
    </div>
    <div class="info-box">
      <div class="info-row"><span class="info-label">Company:</span> <span class="info-value">${company}</span></div>
      <div class="info-row"><span class="info-label">Job Title:</span> <span class="info-value">${jobTitle}</span></div>
      <div class="info-row"><span class="info-label">Current Status:</span> <span class="info-value">${newStatus}</span></div>
    </div>
    ${
      recruiterNotes
        ? `<p><strong>Recruiter Feedback:</strong><br><em>"${recruiterNotes}"</em></p>`
        : ''
    }
    <p>Log in to your account dashboard to view full details and next steps.</p>
  `;

  const html = renderEmailLayout({
    title: subject,
    headline,
    bodyHtml,
    ctaText: 'Go to Dashboard',
    ctaUrl: `${platformUrl}/dashboard`,
  });

  return await sendEmail({ to: candidateEmail, subject, html });
};

/**
 * Event Trigger 3: Interview Scheduled
 */
export const sendInterviewScheduledEmail = async ({
  candidateEmail,
  candidateName,
  company,
  jobTitle,
  interviewDate,
  interviewTime,
  interviewType,
  meetingLink,
  interviewerName,
  notes,
}) => {
  const subject = `Interview Scheduled: ${jobTitle} at ${company}`;
  const headline = 'Interview Scheduled';

  const formattedDate = new Date(interviewDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const bodyHtml = `
    <p>Dear <strong>${candidateName}</strong>,</p>
    <p>Great news! An interview has been scheduled for your application to <strong>${jobTitle}</strong> at <strong>${company}</strong>.</p>
    <div class="info-box">
      <div class="info-row"><span class="info-label">Interview Type:</span> <span class="info-value">${interviewType}</span></div>
      <div class="info-row"><span class="info-label">Date:</span> <span class="info-value">${formattedDate}</span></div>
      <div class="info-row"><span class="info-label">Time:</span> <span class="info-value">${interviewTime}</span></div>
      ${
        interviewerName
          ? `<div class="info-row"><span class="info-label">Interviewer:</span> <span class="info-value">${interviewerName}</span></div>`
          : ''
      }
    </div>
    ${
      meetingLink
        ? `<div style="text-align: center; margin: 20px 0;">
            <a href="${meetingLink}" target="_blank" class="cta-button" style="background-color: #2563eb;">Join Meeting Link</a>
           </div>`
        : ''
    }
    ${notes ? `<p><strong>Interview Notes:</strong><br>${notes}</p>` : ''}
    <p>Please make sure to join on time. Good luck!</p>
  `;

  const html = renderEmailLayout({
    title: subject,
    headline,
    bodyHtml,
    ctaText: 'View Interview Details',
    ctaUrl: `${platformUrl}/interviews`,
  });

  return await sendEmail({ to: candidateEmail, subject, html });
};

/**
 * Event Trigger 4: Interview Rescheduled
 */
export const sendInterviewRescheduledEmail = async ({
  candidateEmail,
  candidateName,
  company,
  jobTitle,
  interviewDate,
  interviewTime,
  meetingLink,
  notes,
}) => {
  const subject = `Interview Rescheduled: ${jobTitle} at ${company}`;
  const headline = 'Interview Rescheduled';

  const formattedDate = new Date(interviewDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const bodyHtml = `
    <p>Dear <strong>${candidateName}</strong>,</p>
    <p>Your upcoming interview for the <strong>${jobTitle}</strong> position at <strong>${company}</strong> has been rescheduled to a new time.</p>
    <div class="info-box">
      <div class="info-row"><span class="info-label">New Date:</span> <span class="info-value">${formattedDate}</span></div>
      <div class="info-row"><span class="info-label">New Time:</span> <span class="info-value">${interviewTime}</span></div>
    </div>
    ${
      meetingLink
        ? `<div style="text-align: center; margin: 20px 0;">
            <a href="${meetingLink}" target="_blank" class="cta-button">Updated Meeting Link</a>
           </div>`
        : ''
    }
    ${notes ? `<p><strong>Note:</strong> ${notes}</p>` : ''}
  `;

  const html = renderEmailLayout({
    title: subject,
    headline,
    bodyHtml,
    ctaText: 'View Schedule',
    ctaUrl: `${platformUrl}/interviews`,
  });

  return await sendEmail({ to: candidateEmail, subject, html });
};

/**
 * Event Trigger 5: Interview Cancelled
 */
export const sendInterviewCancelledEmail = async ({
  candidateEmail,
  candidateName,
  company,
  jobTitle,
  notes,
}) => {
  const subject = `Interview Cancelled: ${jobTitle} at ${company}`;
  const headline = 'Interview Cancelled';

  const bodyHtml = `
    <p>Dear <strong>${candidateName}</strong>,</p>
    <p>Please be advised that your scheduled interview for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been cancelled.</p>
    ${notes ? `<p><strong>Reason / Note:</strong><br>${notes}</p>` : ''}
    <p>If you have any questions, please check your platform dashboard or contact the recruiting team.</p>
  `;

  const html = renderEmailLayout({
    title: subject,
    headline,
    bodyHtml,
    ctaText: 'Go to Dashboard',
    ctaUrl: `${platformUrl}/dashboard`,
  });

  return await sendEmail({ to: candidateEmail, subject, html });
};

/**
 * Event Trigger 6: Offer Letter Issued
 */
export const sendOfferLetterEmail = async ({
  candidateEmail,
  candidateName,
  company,
  jobTitle,
  designation,
  salary,
  joiningDate,
  expiryDate,
  additionalTerms,
}) => {
  const subject = `🎉 Official Job Offer Letter: ${jobTitle} at ${company}`;
  const headline = 'Congratulations! You Have Received a Job Offer';

  const formattedJoiningDate = joiningDate
    ? new Date(joiningDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'To be agreed';

  const formattedExpiryDate = expiryDate
    ? new Date(expiryDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  const bodyHtml = `
    <p>Dear <strong>${candidateName}</strong>,</p>
    <p>We are delighted to extend an official offer of employment for the position of <strong>${designation || jobTitle}</strong> at <strong>${company}</strong>!</p>
    <div style="text-align: center; margin: 16px 0;">
      <span class="badge badge-purple" style="font-size: 14px; padding: 8px 18px;">Official Offer Letter</span>
    </div>
    <div class="info-box">
      <div class="info-row"><span class="info-label">Designation:</span> <span class="info-value">${designation || jobTitle}</span></div>
      <div class="info-row"><span class="info-label">Company:</span> <span class="info-value">${company}</span></div>
      <div class="info-row"><span class="info-label">Offered CTC / Salary:</span> <span class="info-value" style="color: #16a34a; font-size: 16px;">${salary || 'As per Discussion'}</span></div>
      <div class="info-row"><span class="info-label">Expected Joining Date:</span> <span class="info-value">${formattedJoiningDate}</span></div>
      ${expiryDate ? `<div class="info-row"><span class="info-label">Offer Valid Until:</span> <span class="info-value">${formattedExpiryDate}</span></div>` : ''}
    </div>
    ${additionalTerms ? `<p><strong>Offer Terms & Notes:</strong><br><em>${additionalTerms}</em></p>` : ''}
    <p>Please log in to your account dashboard to review the complete offer letter and respond (Accept or Decline) by the deadline.</p>
  `;

  const html = renderEmailLayout({
    title: subject,
    headline,
    bodyHtml,
    ctaText: 'Review & Respond to Offer',
    ctaUrl: `${platformUrl}/offers`,
  });

  return await sendEmail({ to: candidateEmail, subject, html });
};

/**
 * Event Trigger 7: Offer Letter Responded by Candidate
 */
export const sendOfferResponseEmail = async ({
  hrEmail,
  hrName,
  candidateName,
  company,
  jobTitle,
  response,
  candidateComment,
}) => {
  const isAccepted = response === 'Accepted';
  const subject = `Offer Letter ${response}: ${candidateName} for ${jobTitle}`;
  const headline = `Candidate ${response} Offer Letter`;

  const badgeClass = isAccepted ? 'badge-green' : 'badge-red';

  const bodyHtml = `
    <p>Dear <strong>${hrName || 'Hiring Manager'}</strong>,</p>
    <p>Candidate <strong>${candidateName}</strong> has officialy <strong>${response.toLowerCase()}</strong> the offer letter extended for <strong>${jobTitle}</strong> at <strong>${company}</strong>.</p>
    <div style="text-align: center;">
      <span class="badge ${badgeClass}">${response}</span>
    </div>
    ${
      candidateComment
        ? `<p><strong>Candidate Note:</strong><br><em>"${candidateComment}"</em></p>`
        : ''
    }
    <p>You can check full offer history and applicant status on your HR Recruiter Workspace.</p>
  `;

  const html = renderEmailLayout({
    title: subject,
    headline,
    bodyHtml,
    ctaText: 'View HR Dashboard',
    ctaUrl: `${platformUrl}/hr/offers`,
  });

  return await sendEmail({ to: hrEmail, subject, html });
};

/**
 * Event Trigger 8: HR Account Approved by Admin
 */
export const sendHRApprovedEmail = async ({ hrEmail, hrName }) => {
  const subject = `🎉 Your HR Recruiter Account Has Been Approved!`;
  const headline = 'HR Account Approved — You Can Now Post Jobs';

  const bodyHtml = `
    <p>Dear <strong>${hrName || 'Recruiter'}</strong>,</p>
    <p>Great news! Your HR Recruiter account registration has been reviewed and officialy <strong>APPROVED</strong> by the Platform Administrator.</p>
    <div style="text-align: center; margin: 16px 0;">
      <span class="badge badge-green" style="font-size: 14px; padding: 8px 18px;">Account Active & Approved</span>
    </div>
    <p>You now have full recruiter privileges on HireFlow AI Platform, including:</p>
    <ul>
      <li>Posting new job openings</li>
      <li>Managing candidate application pipelines</li>
      <li>Running AI ATS candidate matching</li>
      <li>Issuing official offer letters</li>
    </ul>
    <p>Log in to your HR Recruiter Workspace to post your first job opening.</p>
  `;

  const html = renderEmailLayout({
    title: subject,
    headline,
    bodyHtml,
    ctaText: 'Post a Job Now',
    ctaUrl: `${platformUrl}/hr/jobs/new`,
  });

  return await sendEmail({ to: hrEmail, subject, html });
};


