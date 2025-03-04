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
  }>;
  createdAt: Date;
  updatedAt: Date;
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
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Form || mongoose.model<IForm>('Form', FormSchema);