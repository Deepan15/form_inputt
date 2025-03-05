import mongoose, { Schema, Document } from 'mongoose';
import { mockDatabase, usingMockDb } from '@/lib/mongodb';

export interface IEmailList extends Document {
  userId: string;
  name: string;
  emails: Array<{
    email: string;
    name?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const EmailListSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    emails: [
      {
        email: { type: String, required: true },
        name: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Create a mock EmailList model for when MongoDB is not available
class MockEmailListModel {
  static async find(query: any) {
    console.log('Mock EmailList.find called with query:', query);
    // Return empty array if no email lists exist yet
    if (mockDatabase.emailLists.size === 0) {
      return {
        sort: () => ({
          lean: () => []
        })
      };
    }
    
    const emailLists = Array.from(mockDatabase.emailLists.values())
      .filter((list: any) => list.userId === query.userId);
    
    return {
      sort: () => ({
        lean: () => emailLists
      })
    };
  }

  static async findById(id: string) {
    console.log('Mock EmailList.findById called with id:', id);
    return mockDatabase.emailLists.get(id) || null;
  }

  constructor(data: any) {
    Object.assign(this, data, {
      _id: `emaillist_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  async save() {
    console.log('Mock EmailList.save called');
    const emailList = this as any;
    mockDatabase.emailLists.set(emailList._id, emailList);
    return emailList;
  }
}

// Always use the mock model for now
const EmailList = MockEmailListModel as any;

export default EmailList;