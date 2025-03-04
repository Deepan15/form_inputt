import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Form from '@/models/Form';
import FormResponse from '@/models/FormResponse';
import { v4 as uuidv4 } from 'uuid';

// Set the maximum file size (10MB)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const formData = await req.formData();
    
    // Extract responses and files
    const responsesJson = formData.get('responses') as string;
    const responses = JSON.parse(responsesJson || '{}');
    
    // Get client info
    const userAgent = req.headers.get('user-agent') || '';
    const ipAddress = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      '0.0.0.0';

    await connectToDatabase();

    // Verify the form exists
    const form = await Form.findById(id);
    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Check if form has expired
    if (form.expiresAt && new Date(form.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This form has expired and is no longer accepting responses' },
        { status: 403 }
      );
    }

    // Validate required fields
    const requiredFields = form.fields
      .filter((field: { required: boolean; id: string }) => field.required)
      .map((field: { id: string }) => field.id);
    
    const missingFields = requiredFields.filter((fieldId: string) => {
      // For file fields, check if a file was uploaded
      const field = form.fields.find((f: { id: string }) => f.id === fieldId);
      if (field && field.type === 'file') {
        return !formData.get(`file_${fieldId}`);
      }
      // For other fields, check responses
      return !responses[fieldId];
    });

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: missingFields },
        { status: 400 }
      );
    }

    // Process file uploads
    const fileUploads = [];
    for (const field of form.fields) {
      if (field.type === 'file') {
        const file = formData.get(`file_${field.id}`) as File;
        if (file) {
          // In a real implementation, you would upload this file to a storage service
          // like AWS S3, Google Cloud Storage, etc. and get a URL back
          // For this example, we'll just store metadata
          const fileData = {
            fieldId: field.id,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            fileUrl: `/api/files/${uuidv4()}`, // This would be a real URL in production
          };
          fileUploads.push(fileData);
        }
      }
    }

    // Create form response
    const formResponse = new FormResponse({
      formId: id,
      respondentEmail: responses.email || null,
      respondentName: responses.name || null,
      responses: Object.fromEntries(
        Object.entries(responses).map(([key, value]) => [key, value])
      ),
      fileUploads,
      token: uuidv4(),
      ipAddress,
      userAgent,
    });

    await formResponse.save();

    // If the form is configured to send a copy of each response to the owner
    // You would implement that logic here

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      responseId: formResponse._id,
    });
  } catch (error: any) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting the form', message: error.message },
      { status: 500 }
    );
  }
}