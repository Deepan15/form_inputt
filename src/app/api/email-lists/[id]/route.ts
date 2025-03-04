import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import connectToDatabase from '@/lib/mongodb';
import EmailList from '@/models/EmailList';
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

    const emailList = await EmailList.findOne({ _id: id, userId }).lean();
    
    if (!emailList) {
      return NextResponse.json(
        { error: 'Email list not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ emailList });
  } catch (error) {
    console.error('Error fetching email list:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the email list' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const { name, emails } = await req.json();

    if (!name || !emails || !Array.isArray(emails)) {
      return NextResponse.json(
        { error: 'Name and emails are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(e => !emailRegex.test(e.email));
    
    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { 
          error: 'Invalid email format', 
          invalidEmails: invalidEmails.map(e => e.email)
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const emailList = await EmailList.findOne({ _id: id, userId });
    
    if (!emailList) {
      return NextResponse.json(
        { error: 'Email list not found' },
        { status: 404 }
      );
    }

    emailList.name = name;
    emailList.emails = emails;

    await emailList.save();

    return NextResponse.json({ 
      emailList, 
      message: 'Email list updated successfully' 
    });
  } catch (error) {
    console.error('Error updating email list:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the email list' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const emailList = await EmailList.findOne({ _id: id, userId });
    
    if (!emailList) {
      return NextResponse.json(
        { error: 'Email list not found' },
        { status: 404 }
      );
    }

    await emailList.deleteOne();

    return NextResponse.json({ 
      message: 'Email list deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting email list:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the email list' },
      { status: 500 }
    );
  }
}