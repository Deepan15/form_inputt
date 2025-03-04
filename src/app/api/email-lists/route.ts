import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import EmailList from '@/models/EmailList';
import { adminAuth } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;
    
    await connectToDatabase();
    const emailLists = await EmailList.find({ userId });
    
    return NextResponse.json({ emailLists });
  } catch (error) {
    console.error('Error fetching email lists:', error);
    return NextResponse.json({ error: 'Failed to fetch email lists' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;
    
    const { name, emails } = await req.json();
    
    await connectToDatabase();
    const emailList = new EmailList({
      name,
      userId,
      emails,
    });
    
    await emailList.save();
    
    return NextResponse.json({ emailList }, { status: 201 });
  } catch (error) {
    console.error('Error creating email list:', error);
    return NextResponse.json({ error: 'Failed to create email list' }, { status: 500 });
  }
}