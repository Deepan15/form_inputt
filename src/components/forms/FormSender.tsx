'use client';

import React, { useState } from 'react';

interface Email {
  email: string;
  name?: string;
}

interface EmailList {
  _id: string;
  name: string;
  emails: Email[];
}

interface Form {
  _id: string;
  title: string;
}

interface FormSenderProps {
  form: Form;
  emailLists: EmailList[];
  onSend: (formId: string, emails: Email[], senderName: string) => Promise<void>;
}

export default function FormSender({ form, emailLists, onSend }: FormSenderProps) {
  const [selectedListId, setSelectedListId] = useState('');
  const [senderName, setSenderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedListId) {
      setError('Please select an email list');
      return;
    }
    
    const selectedList = emailLists.find(list => list._id === selectedListId);
    
    if (!selectedList) {
      setError('Selected email list not found');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await onSend(form._id, selectedList.emails, senderName);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Send Form: {form.title}</h2>
        
        {success ? (
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Form sent successfully!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your form has been sent to the selected email list.</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                  >
                    Send to another list
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="emailList" className="block text-sm font-medium text-gray-700 mb-1">
                Select Email List *
              </label>
              {emailLists.length === 0 ? (
                <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
                  No email lists available. Please create an email list first.
                </div>
              ) : (
                <select
                  id="emailList"
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select an email list</option>
                  {emailLists.map((list) => (
                    <option key={list._id} value={list._id}>
                      {list.name} ({list.emails.length} contacts)
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
                Sender Name (Optional)
              </label>
              <input
                type="text"
                id="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter sender name"
              />
              <p className="mt-1 text-xs text-gray-500">
                This name will appear as the sender in the email. If left blank, "Form App" will be used.
              </p>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading || emailLists.length === 0}
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Form'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}