import mongoose, { Schema, Document } from 'mongoose';

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

export default mongoose.models.EmailList || mongoose.model<IEmailList>('EmailList', EmailListSchema);