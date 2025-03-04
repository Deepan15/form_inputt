import mongoose, { Schema, Document } from 'mongoose';

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

export default mongoose.models.Form || mongoose.model<IForm>('Form', FormSchema);