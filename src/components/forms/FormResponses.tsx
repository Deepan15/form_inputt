'use client';

import React, { useState } from 'react';

interface FormField {
  id: string;
  type: string;
  label: string;
}

interface FormResponse {
  _id: string;
  formId: string;
  responses: Record<string, any>;
  submittedAt: string;
}

interface FormResponsesProps {
  form: {
    _id: string;
    title: string;
    fields: FormField[];
  };
  responses: FormResponse[];
}

export default function FormResponses({ form, responses }: FormResponsesProps) {
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);

  const toggleExpand = (responseId: string) => {
    if (expandedResponse === responseId) {
      setExpandedResponse(null);
    } else {
      setExpandedResponse(responseId);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Responses for: {form.title}</h2>
        <p className="mt-1 text-sm text-gray-500">
          Total responses: {responses.length}
        </p>
      </div>

      {responses.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No responses yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {responses.map((response) => (
            <div key={response._id} className="p-6">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(response._id)}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Response submitted on {new Date(response.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <svg 
                    className={`h-5 w-5 text-gray-500 transform ${expandedResponse === response._id ? 'rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {expandedResponse === response._id && (
                <div className="mt-4 space-y-4">
                  {form.fields.map((field) => (
                    <div key={field.id} className="border-b border-gray-100 pb-2">
                      <p className="text-sm font-medium text-gray-700">{field.label}</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {response.responses[field.id] !== undefined && response.responses[field.id] !== '' 
                          ? (typeof response.responses[field.id] === 'boolean' 
                              ? (response.responses[field.id] ? 'Yes' : 'No')
                              : response.responses[field.id])
                          : <span className="text-gray-400">No response</span>}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}