'use client';

import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/layout/Dashboard';
import FormSender from '@/components/forms/FormSender';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Form {
  _id: string;
  title: string;
  description?: string;
}

export default function ShareFormPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [publicLink, setPublicLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      if (!user) return;
      
      try {
        const token = await user.getIdToken();
        const response = await fetch(`/api/forms/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch form');
        }
        
        const data = await response.json();
        setForm(data.form);
        
        // Generate public link
        const origin = window.location.origin;
        setPublicLink(`${origin}/public/forms/${id}`);
      } catch (error) {
        console.error('Error fetching form:', error);
        setError('Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [user, id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <Dashboard>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Dashboard>
    );
  }

  if (!form) {
    return (
      <Dashboard>
        <div className="px-4 py-6">
          <div className="bg-red-100 text-red-700 p-4 rounded">
            Form not found or you don't have permission to view it.
          </div>
          <div className="mt-4">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
              Back to dashboard
            </Link>
          </div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Share Form: {form.title}</h1>
          <div className="flex space-x-2">
            <Link
              href={`/forms/${id}`}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              View Form
            </Link>
            <Link
              href={`/responses/${id}`}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              View Responses
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Public Link</h2>
              <p className="text-gray-600 mb-4">
                Share this link with anyone to allow them to fill out your form.
              </p>
              
              <div className="flex">
                <input
                  type="text"
                  value={publicLink}
                  readOnly
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Embed in Website</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <code className="text-xs text-gray-800 break-all">
                    {`<iframe src="${publicLink}" width="100%" height="600" frameborder="0"></iframe>`}
                  </code>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">QR Code</h3>
                <div className="bg-white p-4 inline-block rounded-md border border-gray-200">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(publicLink)}`} 
                    alt="QR Code" 
                    width="150" 
                    height="150" 
                  />
                </div>
              </div>
            </div>
          </div>
          
          <FormSender formId={id as string} formTitle={form.title} />
        </div>
      </div>
    </Dashboard>
  );
}