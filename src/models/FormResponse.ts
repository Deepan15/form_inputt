import mongoose from 'mongoose';

export interface IFormResponse extends mongoose.Document {
  formId: mongoose.Types.ObjectId;
  respondentEmail?: string;
  respondentName?: string;
  responses: Map<string, any>;
  fileUploads?: Array<{
    fieldId: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    fileUrl: string;
  }>;
  submittedAt: Date;
  token?: string;
  ipAddress?: string;
  userAgent?: string;
}

const FormResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
    index: true
  },
  respondentEmail: String,
  respondentName: String,
  responses: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  fileUploads: [{
    fieldId: String,
    fileName: String,
    fileSize: Number,
    fileType: String,
    fileUrl: String,
  }],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  token: String, // Unique token for form access
  ipAddress: String,
  userAgent: String,
});

// Add indexes for better query performance
FormResponseSchema.index({ formId: 1, submittedAt: -1 });
FormResponseSchema.index({ token: 1 }, { unique: true, sparse: true });

export default mongoose.models.FormResponse || mongoose.model<IFormResponse>('FormResponse', FormResponseSchema);