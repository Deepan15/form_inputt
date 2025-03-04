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
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    await connectToDatabase();

    const emailLists = await EmailList.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ emailLists });
  } catch (error) {
    console.error('Error fetching email lists:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching email lists' },
      { status: 500 }
    );
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
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { name, emails } = await req.json();

    if (!name || !emails || !Array.isArray(emails)) {
      return NextResponse.json(
        { error: 'Name and emails are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const emailList = new EmailList({
      userId,
      name,
      emails,
    });

    await emailList.save();

    return NextResponse.json(
      { emailList, message: 'Email list created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating email list:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the email list' },
      { status: 500 }
    );
  }
}