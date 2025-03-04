import React, { useState } from 'react';
import { FormField } from './FormBuilder';

interface FormPreviewProps {
  title: string;
  description?: string;
  fields: FormField[];
  onSubmit: (responses: Record<string, any>) => void;
  isSubmitting?: boolean;
}

const FormPreview: React.FC<FormPreviewProps> = ({
  title,
  description,
  fields,
  onSubmit,
  isSubmitting = false,
}) => {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (fieldId: string, value: any) => {
    setResponses({
      ...responses,
      [fieldId]: value,
    });
    
    // Clear error when field is filled
    if (errors[fieldId]) {
      const newErrors = { ...errors };
      delete newErrors[fieldId];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    
    fields.forEach(field => {
      if (field.required && (!responses[field.id] || responses[field.id] === '')) {
        newErrors[field.id] = 'This field is required';
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(responses);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={field.id}
            placeholder={field.placeholder}
            value={responses[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'textarea':
        return (
          <textarea
            id={field.id}
            placeholder={field.placeholder}
            value={responses[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        );
      case 'dropdown':
        return (
          <select
            id={field.id}
            value={responses[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              checked={responses[field.id] || false}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              className="mr-2 h-5 w-5"
            />
            <label htmlFor={field.id}>Yes</label>
          </div>
        );
      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            value={responses[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'email':
        return (
          <input
            type="email"
            id={field.id}
            placeholder={field.placeholder}
            value={responses[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            placeholder={field.placeholder}
            value={responses[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      {description && <p className="mb-6 text-gray-600">{description}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {fields.map((field) => (
            <div key={field.id} className="form-field">
              <label className="block text-gray-700 mb-2" htmlFor={field.id}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(field)}
              {errors[field.id] && (
                <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPreview;