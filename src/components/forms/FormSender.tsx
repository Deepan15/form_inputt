'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface EmailList {
  _id: string;
  name: string;
  emails: { email: string; name?: string }[];
}

interface FormSenderProps {
  formId: string;
  formTitle: string;
}

export default function FormSender({ formId, formTitle }: FormSenderProps) {
  const { user } = useAuth();
  const [emailLists, setEmailLists] = useState<EmailList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [customEmails, setCustomEmails] = useState<string>('');
  const [subject, setSubject] = useState<string>(`Please fill out this form: ${formTitle}`);
  const [message, setMessage] = useState<string>(`Hello,\n\nI've created a form that I'd like you to fill out. Please click the link below to access the form:\n\n[Form Link]\n\nThank you!`);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [allowAnonymous, setAllowAnonymous] = useState<boolean>(false);
  const [sendCopy, setSendCopy] = useState<boolean>(false);
  const [scheduleDate, setScheduleDate] = useState<string>('');

  useEffect(() => {
    const fetchEmailLists = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/email-lists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEmailLists(data.emailLists);
        }
      } catch (error) {
        console.error('Error fetching email lists:', error);
      }
    };

    fetchEmailLists();
  }, [user]);

  const handleSendForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Validate inputs
    if (!selectedListId && !customEmails.trim()) {
      setError('Please select an email list or enter custom email addresses');
      return;
    }
    
    if (customEmails.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emails = customEmails.split(',').map(email => email.trim());
      const invalidEmails = emails.filter(email => !emailRegex.test(email));
      
      if (invalidEmails.length > 0) {
        setError(`Invalid email format: ${invalidEmails.join(', ')}`);
        return;
      }
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const token = await user.getIdToken();
      
      const payload = {
        formId,
        emailListId: selectedListId || null,
        customEmails: customEmails ? customEmails.split(',').map(email => email.trim()) : [],
        subject,
        message,
        expiryDate: expiryDate || null,
        allowAnonymous,
        sendCopy,
        scheduleDate: scheduleDate || null,
      };
      
      const response = await fetch('/api/send-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        setSuccess(true);
        // Reset form
        setSelectedListId('');
        setCustomEmails('');
        setExpiryDate('');
        setScheduleDate('');
        
        // Show success message for 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send form');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred while sending the form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Share Form</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            Form sent successfully!
          </div>
        )}
        
        <form onSubmit={handleSendForm}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email List
            </label>
            <select
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Or Enter Custom Emails (comma separated)
            </label>
            <textarea
              value={customEmails}
              onChange={(e) => setCustomEmails(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="email1@example.com, email2@example.com"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              The form link will be automatically inserted where you place [Form Link].
            </p>
          </div>
          
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Form Expiry Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                If set, the form will no longer accept responses after this date.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule Email (Optional)
              </label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                If set, the email will be sent at the specified time.
              </p>
            </div>
          </div>
          
          <div className="mb-4 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowAnonymous"
                checked={allowAnonymous}
                onChange={(e) => setAllowAnonymous(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="allowAnonymous" className="ml-2 block text-sm text-gray-700">
                Allow anonymous responses (no email required)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendCopy"
                checked={sendCopy}
                onChange={(e) => setSendCopy(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="sendCopy" className="ml-2 block text-sm text-gray-700">
                Send me a copy of each response
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Form'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}