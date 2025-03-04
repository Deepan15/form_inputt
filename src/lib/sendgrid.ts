import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendFormEmail = async (
  to: string,
  formTitle: string,
  formLink: string,
  senderName: string
) => {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL as string,
    subject: `Please fill out the form: ${formTitle}`,
    html: `
      <div>
        <h1>You've been invited to fill out a form</h1>
        <p>${senderName} has invited you to fill out the form: ${formTitle}</p>
        <p>Please click the link below to access the form:</p>
        <a href="${formLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Access Form</a>
        <p>This link is unique to you and should not be shared.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};