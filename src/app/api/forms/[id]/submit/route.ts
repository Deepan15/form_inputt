import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Form from '@/models/Form';
import FormResponse from '@/models/FormResponse';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const responses = await req.json();

    await connectToDatabase();

    // Verify the form exists
    const form = await Form.findById(id);
    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Validate required fields
    const requiredFields = form.fields.filter((field: { required: boolean; id: string }) => field.required).map((field: { id: string }) => field.id);
    const missingFields = requiredFields.filter((fieldId: string) => !responses[fieldId]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: missingFields },
        { status: 400 }
      );
    }

    // Create form response
    const formResponse = new FormResponse({
      formId: id,
      responses: Object.fromEntries(
        Object.entries(responses).map(([key, value]) => [key, value])
      ),
    });

    await formResponse.save();

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
    });
  } catch (error: any) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting the form', message: error.message },
      { status: 500 }
    );
  }
}