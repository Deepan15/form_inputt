'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FormPreview from '@/components/forms/FormPreview';
import { FormField } from '@/components/forms/FormBuilder';
import Link from 'next/link';

interface Form {
  _id: string;
  title: string;
  description?: string;
  fields: FormField[];
  expiresAt?: string;
}

export default function PublicFormPage() {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/public/forms/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch form');
        }
        
        const data = await response.json();
        setForm(data.form);
      } catch (error) {
        console.error('Error fetching form:', error);
        setError('Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  const handleSubmit = async (responses: Record<string, any>, files: Record<string, File>) => {
    setSubmitting(true);
    
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Add responses as JSON
      formData.append('responses', JSON.stringify(responses));
      
      // Add files
      Object.entries(files).forEach(([fieldId, file]) => {
        formData.append(`file_${fieldId}`, file);
      });
      
      const response = await fetch(`/api/public/submit-form/${id}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }
      
      // Success - the FormPreview component will show a success message
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setError(error.message || 'An error occurred while submitting the form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-900">
            {error || 'Form not found'}
          </h2>
          <p className="mt-2 text-gray-600">
            The form you're looking for might have been removed or is no longer available.
          </p>
          <div className="mt-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if form has expired
  const isExpired = form.expiresAt && new Date(form.expiresAt) < new Date();
  
  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-900">
            Form Expired
          </h2>
          <p className="mt-2 text-gray-600">
            This form is no longer accepting responses as it has expired.
          </p>
          <div className="mt-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <FormPreview
          title={form.title}
          description={form.description}
          fields={form.fields}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
          submitButtonText="Submit Form"
        />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Powered by Form Input App
          </p>
        </div>
      </div>
    </div>
  );
} 