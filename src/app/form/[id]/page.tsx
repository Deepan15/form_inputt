'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FormPreview from '@/components/forms/FormPreview';
import Link from 'next/link';

interface Form {
  _id: string;
  title: string;
  description: string;
  fields: any[];
}

export default function PublicFormView() {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async (responses: Record<string, any>) => {
    try {
      setSubmitting(true);
      setError('');
      
      const response = await fetch('/api/public/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: id,
          responses,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      setSubmitted(true);
    } catch (error: any) {
      setError(error.message || 'An error occurred while submitting the form');
    } finally {
      setSubmitting(false);
    }
  };
if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded max-w-md w-full text-center">
          {error}
        </div>
        <Link href="/" className="mt-4 text-blue-600 hover:text-blue-800">
          Return to Home
        </Link>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded max-w-md w-full text-center">
          Form not found
        </div>
        <Link href="/" className="mt-4 text-blue-600 hover:text-blue-800">
          Return to Home
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="bg-green-100 text-green-700 p-6 rounded-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
          <p className="mb-4">Your response has been submitted successfully.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Another Response
          </button>
        </div>
        <Link href="/" className="mt-4 text-blue-600 hover:text-blue-800">
          Return to Home
        </Link>
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
        />
      </div>
    </div>
  );
}