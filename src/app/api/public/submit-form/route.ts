import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import FormResponse from '@/models/FormResponse';
import Form from '@/models/Form';

export async function POST(req: NextRequest) {
  try {
    const { formId, responses, respondentEmail } = await req.json();

    if (!formId || !responses) {
      return NextResponse.json(
        { error: 'Form ID and responses are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if form exists
    const form = await Form.findById(formId);
    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Create form response
    const formResponse = new FormResponse({
      formId,
      respondentEmail: respondentEmail || undefined,
      responses,
      submittedAt: new Date(),
    });

    await formResponse.save();

    return NextResponse.json(
      { success: true, message: 'Form submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting the form' },
      { status: 500 }
    );
  }
}