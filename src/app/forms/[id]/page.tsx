'use client';

import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/layout/Dashboard';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FormField } from '@/components/forms/FormBuilder';

interface Form {
  _id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

interface EmailList {
  _id: string;
  name: string;
  emails: { email: string; name?: string }[];
}

export default function FormView() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [emailLists, setEmailLists] = useState<EmailList[]>([]);
  const [selectedListId, setSelectedListId] = useState('');
  const [senderName, setSenderName] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const token = await user.getIdToken();
        
        // Fetch form
        const formResponse = await fetch(`/api/forms/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!formResponse.ok) {
          throw new Error('Failed to fetch form');
        }
        
        const formData = await formResponse.json();
        setForm(formData.form);
        
        // Fetch email lists
        const emailListsResponse = await fetch('/api/email-lists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (emailListsResponse.ok) {
          const emailListsData = await emailListsResponse.json();
          setEmailLists(emailListsData.emailLists);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, id]);

  const handleSendForm = async () => {
    if (!user || !form || !selectedListId) return;
    
    try {
      setSending(true);
      setError('');
      setSuccess('');
      
      const selectedList = emailLists.find(list => list._id === selectedListId);
      if (!selectedList) {
        throw new Error('Selected email list not found');
      }
      
      const token = await user.getIdToken();
      
      const response = await fetch('/api/send-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          formId: form._id,
          emails: selectedList.emails,
          senderName: senderName || user.displayName || 'Form App',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send form');
      }
      
      setSuccess(`Form sent to ${selectedList.emails.length} recipients`);
      setSelectedListId('');
      setSenderName('');
    } catch (error: any) {
      setError(error.message || 'An error occurred while sending the form');
    } finally {
      setSending(false);
    }
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
            <Link href="/forms" className="text-blue-600 hover:text-blue-800">
              Back to forms
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
          <h1 className="text-2xl font-bold">{form.title}</h1>
          <div className="flex space-x-3">
            <Link
              href={`/forms/edit/${form._id}`}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit Form
            </Link>
            <Link
              href={`/responses/${form._id}`}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              View Responses
            </Link>
          </div>
        </div>
        
        {form.description && (
          <p className="mb-6 text-gray-600">{form.description}</p>
        )}
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Form Fields</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            {form.fields.map((field) => (
              <div key={field.id} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </p>
                    <p className="text-sm text-gray-500">Type: {field.type}</p>
                  </div>
                  {field.type === 'dropdown' && field.options && field.options.length > 0 && (
                    <div className="text-sm text-gray-500">
                      Options: {field.options.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Send Form</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {success}
              </div>
            )}
            
            {emailLists.length === 0 ? (
              <div>
                <p className="text-gray-500 mb-4">You need to create an email list before sending this form.</p>
                <Link
                  href="/email-lists/new"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Email List
                </Link>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="emailList">
                    Select Email List
                  </label>
                  <select
                    id="emailList"
                    value={selectedListId}
                    onChange={(e) => setSelectedListId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an email list</option>
                    {emailLists.map((list) => (
                      <option key={list._id} value={list._id}>
                        {list.name} ({list.emails.length} contacts)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="senderName">
                    Sender Name (Optional)
                  </label>
                  <input
                    id="senderName"
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Name"
                  />
                </div>
                
                <button
                  onClick={handleSendForm}
                  disabled={!selectedListId || sending}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Form'}
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Form Link</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="mb-2">Share this link to allow anyone to fill out this form:</p>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/form/${form._id}`}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/form/${form._id}`);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}