import mongoose from 'mongoose';

const FormResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  respondentEmail: String,
  responses: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  token: String, // Unique token for form access
});

export default mongoose.models.FormResponse || mongoose.model('FormResponse', FormResponseSchema);