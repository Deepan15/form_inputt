import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import connectToDatabase from '@/lib/mongodb';
import Form from '@/models/Form';
import sgMail from '@sendgrid/mail';
import { initFirebaseAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin
initFirebaseAdmin();

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { formId, emails, senderName } = await req.json();

    if (!formId || !emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Form ID and emails are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify the form belongs to the user
    const form = await Form.findOne({ _id: formId, userId });
    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Get the app URL from environment variables
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const formUrl = `${appUrl}/form/${formId}`;

    // Send emails
    const messages = emails.map(recipient => ({
      to: recipient.email,
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: `${senderName || 'Form App'}: ${form.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${form.title}</h2>
          ${form.description ? `<p>${form.description}</p>` : ''}
          <p>You've been invited to fill out this form.</p>
          <div style="margin: 30px 0;">
            <a href="${formUrl}" style="background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Fill Out Form
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p>${formUrl}</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;" />
          <p style="color: #6B7280; font-size: 14px;">
            This email was sent from Form Input App.
          </p>
        </div>
      `,
    }));

    await sgMail.send(messages);

    return NextResponse.json({
      success: true,
      message: `Form sent to ${emails.length} recipients`,
    });
  } catch (error) {
    console.error('Error sending form:', error);
    return NextResponse.json(
      { error: 'An error occurred while sending the form' },
      { status: 500 }
    );
  }
}