import mongoose, { Schema, Document, Model } from 'mongoose';
import { mockDatabase, usingMockDb } from '@/lib/mongodb';

export interface IForm extends Document {
  userId: string;
  title: string;
  description?: string;
  fields: Array<{
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
    maxFileSize?: number;
    allowedFileTypes?: string[];
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
  isPublic?: boolean;
  expiresAt?: Date;
  allowAnonymousResponses?: boolean;
}

const FormSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    fields: [
      {
        id: { type: String, required: true },
        type: { type: String, required: true },
        label: { type: String, required: true },
        placeholder: { type: String },
        required: { type: Boolean, default: false },
        options: [{ type: String }],
        maxFileSize: { type: Number },
        allowedFileTypes: [{ type: String }],
        maxLength: { type: Number },
        minValue: { type: Number },
        maxValue: { type: Number },
      },
    ],
    isPublic: { type: Boolean, default: false },
    expiresAt: { type: Date },
    allowAnonymousResponses: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create a mock Form model for when MongoDB is not available
class MockFormModel {
  static async find(query: any) {
    console.log('Mock Form.find called with query:', query);
    // Return empty array if no forms exist yet
    if (mockDatabase.forms.size === 0) {
      return {
        sort: () => ({
          lean: () => []
        })
      };
    }
    
    const forms = Array.from(mockDatabase.forms.values())
      .filter((form: any) => form.userId === query.userId);
    
    return {
      sort: () => ({
        lean: () => forms
      })
    };
  }

  static async findById(id: string) {
    console.log('Mock Form.findById called with id:', id);
    return mockDatabase.forms.get(id) || null;
  }

  constructor(data: any) {
    Object.assign(this, data, {
      _id: `form_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  async save() {
    console.log('Mock Form.save called');
    const form = this as any;
    mockDatabase.forms.set(form._id, form);
    return form;
  }
}

// Always use the mock model for now
const Form = MockFormModel as any;

export default Form;