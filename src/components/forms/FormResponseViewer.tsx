import React from 'react';
import { FormField } from './FormBuilder';

interface FormResponse {
  _id: string;
  formId: string;
  respondentEmail?: string;
  responses: Record<string, any>;
  submittedAt: string;
}

interface FormResponseViewerProps {
  responses: FormResponse[];
  fields: FormField[];
  onExportCSV: () => void;
}

const FormResponseViewer: React.FC<FormResponseViewerProps> = ({
  responses,
  fields,
  onExportCSV,
}) => {
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
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'date':
        return new Date(value).toLocaleDateString();
      default:
        return String(value);
    }
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
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Respondent</th>
              <th className="py-2 px-4 border-b text-left">Date</th>
              {fields.map((field) => (
                <th key={field.id} className="py-2 px-4 border-b text-left">
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((response) => (
              <tr key={response._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {response.respondentEmail || 'Anonymous'}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(response.submittedAt).toLocaleDateString()}
                </td>
                {fields.map((field) => (
                  <td key={field.id} className="py-2 px-4 border-b">
                    {formatValue(response.responses[field.id], field.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormResponseViewer;