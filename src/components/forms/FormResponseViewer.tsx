import React, { useState } from 'react';
import { FormField } from './FormBuilder';

interface FileUpload {
  fieldId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
}

interface FormResponse {
  _id: string;
  formId: string;
  respondentEmail?: string;
  respondentName?: string;
  responses: Record<string, any>;
  fileUploads?: FileUpload[];
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

interface FormResponseViewerProps {
  responses: FormResponse[];
  fields: FormField[];
  onExportCSV: () => void;
}

export default function FormResponseViewer({
  responses,
  fields,
  onExportCSV,
}: FormResponseViewerProps) {
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);

  if (responses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No responses yet.</p>
      </div>
    );
  }

  const formatValue = (value: any, type: string) => {
    if (value === undefined || value === null) return '-';
    
    switch (type) {
      case 'checkbox':
        return value ? 'Yes' : 'No';
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'rating':
        return '⭐'.repeat(Number(value));
      default:
        return String(value);
    }
  };

  const getFileUpload = (response: FormResponse, fieldId: string) => {
    return response.fileUploads?.find(upload => upload.fieldId === fieldId);
  };

  const toggleResponseDetails = (responseId: string) => {
    if (expandedResponse === responseId) {
      setExpandedResponse(null);
    } else {
      setExpandedResponse(responseId);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Form Responses ({responses.length})</h2>
        <button
          onClick={onExportCSV}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export as CSV
        </button>
      </div>
      
      <div className="space-y-4">
        {responses.map((response) => (
          <div key={response._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleResponseDetails(response._id)}
            >
              <div>
                <h3 className="font-medium">
                  {response.respondentName || response.respondentEmail || 'Anonymous'}
                </h3>
                <p className="text-sm text-gray-500">
                  Submitted on {new Date(response.submittedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <svg 
                  className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedResponse === response._id ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {expandedResponse === response._id && (
              <div className="p-4 border-t border-gray-200">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  {fields.map((field) => {
                    if (field.type === 'file') {
                      const fileUpload = getFileUpload(response, field.id);
                      return (
                        <div key={field.id} className="py-2">
                          <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                          <dd className="mt-1">
                            {fileUpload ? (
                              <div className="flex items-center">
                                <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                  <a 
                                    href={fileUpload.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {fileUpload.fileName}
                                  </a>
                                  <p className="text-xs text-gray-500">
                                    {formatFileSize(fileUpload.fileSize)} • {fileUpload.fileType}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">No file uploaded</span>
                            )}
                          </dd>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={field.id} className="py-2">
                        <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                        <dd className="mt-1">{formatValue(response.responses[field.id], field.type)}</dd>
                      </div>
                    );
                  })}
                  
                  {/* Additional metadata */}
                  <div className="py-2 col-span-2 mt-4 border-t border-gray-200 pt-4">
                    <dt className="text-sm font-medium text-gray-500">Submission Details</dt>
                    <dd className="mt-1 text-sm text-gray-500">
                      <p>IP Address: {response.ipAddress || 'Not recorded'}</p>
                      <p>Browser: {response.userAgent ? response.userAgent.split(' ')[0] : 'Not recorded'}</p>
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}