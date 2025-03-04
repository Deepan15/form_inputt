'use client';

import React, { useState } from 'react';
import { FormField } from './FormBuilder';
import FileUploadField from './FileUploadField';

interface FormPreviewProps {
  title: string;
  description?: string;
  fields: FormField[];
  onSubmit: (responses: Record<string, any>, files: Record<string, File>) => Promise<void>;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export default function FormPreview({
  title,
  description,
  fields,
  onSubmit,
  isSubmitting = false,
  submitButtonText = 'Submit',
}: FormPreviewProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (fieldId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value,
    }));
    
    // Clear error for this field if it exists
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleFileChange = (fieldId: string, file: File | null) => {
    if (file) {
      setFiles(prev => ({
        ...prev,
        [fieldId]: file,
      }));
    } else {
      setFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[fieldId];
        return newFiles;
      });
    }
    
    // Clear error for this field if it exists
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required) {
        if (field.type === 'file') {
          if (!files[field.id]) {
            newErrors[field.id] = 'This field is required';
          }
        } else if (['text', 'email', 'number', 'date', 'textarea', 'url', 'phone'].includes(field.type)) {
          if (!responses[field.id]) {
            newErrors[field.id] = 'This field is required';
          }
        } else if (field.type === 'dropdown' || field.type === 'radio') {
          if (!responses[field.id]) {
            newErrors[field.id] = 'Please select an option';
          }
        }
      }
      
      // Validate email format
      if (field.type === 'email' && responses[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(responses[field.id])) {
          newErrors[field.id] = 'Please enter a valid email address';
        }
      }
      
      // Validate URL format
      if (field.type === 'url' && responses[field.id]) {
        try {
          new URL(responses[field.id]);
        } catch (e) {
          newErrors[field.id] = 'Please enter a valid URL';
        }
      }
      
      // Validate number range
      if (field.type === 'number' && responses[field.id]) {
        const value = Number(responses[field.id]);
        if (field.minValue !== undefined && value < field.minValue) {
          newErrors[field.id] = `Value must be at least ${field.minValue}`;
        }
        if (field.maxValue !== undefined && value > field.maxValue) {
          newErrors[field.id] = `Value must be at most ${field.maxValue}`;
        }
      }
      
      // Validate text length
      if ((field.type === 'text' || field.type === 'textarea') && responses[field.id] && field.maxLength) {
        if (responses[field.id].length > field.maxLength) {
          newErrors[field.id] = `Text must be at most ${field.maxLength} characters`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit(responses, files);
      setSubmitted(true);
      // Reset form
      setResponses({});
      setFiles({});
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="mt-3 text-lg font-medium text-gray-900">Form Submitted Successfully</h2>
          <p className="mt-2 text-sm text-gray-500">Thank you for your submission!</p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {description && <p className="mt-2 text-gray-600">{description}</p>}
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {fields.map((field) => (
          <div key={field.id} className="mb-6">
            {field.type === 'text' && (
              <div>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  id={field.id}
                  name={field.id}
                  value={responses[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required={field.required}
                  maxLength={field.maxLength}
                />
                {errors[field.id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
                )}
              </div>
            )}
            
            {field.type === 'email' && (
              <div>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="email"
                  id={field.id}
                  name={field.id}
                  value={responses[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required={field.required}
                />
                {errors[field.id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
                )}
              </div>
            )}
            
            {field.type === 'number' && (
              <div>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="number"
                  id={field.id}
                  name={field.id}
                  value={responses[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required={field.required}
                  min={field.minValue}
                  max={field.maxValue}
                />
                {errors[field.id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
                )}
              </div>
            )}
            
            {field.type === 'date' && (
              <div>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="date"
                  id={field.id}
                  name={field.id}
                  value={responses[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required={field.required}
                />
                {errors[field.id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
                )}
              </div>
            )}
            
            {field.type === 'textarea' && (
              <div>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  id={field.id}
                  name={field.id}
                  value={responses[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required={field.required}
                  maxLength={field.maxLength}
                />
                {errors[field.id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
                )}
              </div>
            )}
            
            {field.type === 'dropdown' && (
              <div>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <select
                  id={field.id}
                  name={field.id}
                  value={responses[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required={field.required}
                >
                  <option value="">Select an option</option>
                  {field.options?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors[field.id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
                )}
              </div>
            )}
            
            {field.type === 'radio' && (
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </span>
                <div className="space-y-2">
                  {field.options?.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`${field.id}-${index}`}
                        name={field.id}
                        value={option}
                        checked={responses[field.id] === option}
                        onChange={() => handleInputChange(field.id, option)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        required={field.required && index === 0}
                      />
                      <label htmlFor={`${field.id}-${index}`} className="ml-2 block text-sm text-gray-700">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                {errors[field.id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
                )}
              </div>
            )}
            
            {field.type === 'checkbox' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={field.id}
                  name={field.id}
                  checked={responses[field.id] || false}
                  onChange={(e) => handleInputChange(field.id, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required={field.required}
                />
                <label htmlFor={field.id} className="ml-2 block text-sm text-gray-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {errors[field.id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
                )}
              </div>
            )}
            
            {field.type === 'file' && (
              <FileUploadField
                id={field.id}
                label={field.label}
                required={field.required}
                maxFileSize={field.maxFileSize}
                allowedFileTypes={field.allowedFileTypes}
                onChange={handleFileChange}
                error={errors[field.id]}
              />
            )}
            
            {field.type === 'phone' && (
              <div>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="tel"
                  id={field.id}
                  name={field.id}
                  value={responses[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder || 'e.g., +1 (555) 123-4567'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required={field.required}
                />
                {errors[field.id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
                )}
              </div>
            )}
            
            {field.type === 'url' && (
              <div>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="url"
                  id={field.id}
                  name={field.id}
                  value={responses[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder || 'https://example.com'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required={field.required}
                />
                {errors[field.id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
                )}
              </div>
            )}
            
            {field.type === 'rating' && (
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </span>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: field.maxValue || 5 }, (_, i) => i + 1).map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleInputChange(field.id, rating)}
                      className={`h-8 w-8 flex items-center justify-center rounded-full focus:outline-none ${
                        responses[field.id] >= rating
                          ? 'bg-yellow-400 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                {errors[field.id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
                )}
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              submitButtonText
            )}
          </button>
        </div>
      </form>
    </div>
  );
}