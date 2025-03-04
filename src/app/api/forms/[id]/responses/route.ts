import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import connectToDatabase from '@/lib/mongodb';
import Form from '@/models/Form';
import FormResponse from '@/models/FormResponse';
import { initFirebaseAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin
initFirebaseAdmin();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const { id } = params;

    await connectToDatabase();

    // Verify the form belongs to the user
    const form = await Form.findOne({ _id: id, userId });
    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Get form responses
    const responses = await FormResponse.find({ formId: id }).sort({ submittedAt: -1 });

    return NextResponse.json({ responses });
  } catch (error) {
    console.error('Error fetching form responses:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching form responses' },
      { status: 500 }
    );
  }
}