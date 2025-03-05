import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import connectToDatabase from '@/lib/mongodb';
import Form from '@/models/Form';
import { initFirebaseAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin
initFirebaseAdmin();

export async function GET(req: NextRequest) {
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
    console.log('Received token:', token);
    
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const userId = decodedToken.uid;
    console.log('Verified user ID:', userId);

    try {
      await connectToDatabase();
      console.log('Connected to database');
      
      try {
        const forms = await Form.find({ userId })
          .sort({ createdAt: -1 })
          .lean();
        
        console.log(`Found ${forms?.length || 0} forms for user ${userId}`);
        
        // If no forms found, return an empty array instead of error
        return NextResponse.json({ forms: forms || [] });
      } catch (findError) {
        console.error('Error finding forms:', findError);
        // Return empty forms array on error to prevent UI from breaking
        return NextResponse.json({ forms: [] });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Return empty forms array on error to prevent UI from breaking
      return NextResponse.json({ forms: [] });
    }
  } catch (error) {
    console.error('Error fetching forms:', error);
    // Return empty forms array on error to prevent UI from breaking
    return NextResponse.json({ forms: [] });
  }
}

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
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const userId = decodedToken.uid;

    const { title, description, fields } = await req.json();

    if (!title || !fields || !Array.isArray(fields)) {
      return NextResponse.json(
        { error: 'Title and fields are required' },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      
      const form = new Form({
        userId,
        title,
        description,
        fields,
      });

      await form.save();
      console.log('Form created successfully:', form._id);

      return NextResponse.json(
        { form, message: 'Form created successfully' },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error', details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the form', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}