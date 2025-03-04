import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Form from '@/models/Form';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await connectToDatabase();

    // Find the form
    const form = await Form.findById(id);
    
    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Check if form is public
    if (!form.isPublic) {
      return NextResponse.json(
        { error: 'This form is not publicly accessible' },
        { status: 403 }
      );
    }

    // Return form data without sensitive information
    return NextResponse.json({
      success: true,
      form: {
        _id: form._id,
        title: form.title,
        description: form.description,
        fields: form.fields,
        expiresAt: form.expiresAt,
      },
    });
  } catch (error: any) {
    console.error('Error fetching public form:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the form', message: error.message },
      { status: 500 }
    );
  }
}