import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import connectToDatabase from '@/lib/mongodb';
import EmailList from '@/models/EmailList';
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
    console.log('Received token for email lists:', token);
    
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
    console.log('Verified user ID for email lists:', userId);

    try {
      await connectToDatabase();
      console.log('Connected to database for email lists');
      
      try {
        const emailLists = await EmailList.find({ userId })
          .sort({ createdAt: -1 })
          .lean();
        
        console.log(`Found ${emailLists?.length || 0} email lists for user ${userId}`);
        
        // If no email lists found, return an empty array instead of error
        return NextResponse.json({ emailLists: emailLists || [] });
      } catch (findError) {
        console.error('Error finding email lists:', findError);
        // Return empty email lists array on error to prevent UI from breaking
        return NextResponse.json({ emailLists: [] });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Return empty email lists array on error to prevent UI from breaking
      return NextResponse.json({ emailLists: [] });
    }
  } catch (error) {
    console.error('Error fetching email lists:', error);
    // Return empty email lists array on error to prevent UI from breaking
    return NextResponse.json({ emailLists: [] });
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

    const { name, emails } = await req.json();

    if (!name || !emails || !Array.isArray(emails)) {
      return NextResponse.json(
        { error: 'Name and emails are required' },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      
      const emailList = new EmailList({
        userId,
        name,
        emails,
      });

      await emailList.save();
      console.log('Email list created successfully:', emailList._id);

      return NextResponse.json(
        { emailList, message: 'Email list created successfully' },
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
    console.error('Error creating email list:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the email list', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}