'use client';

import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/layout/Dashboard';
import EmailListManager from '@/components/email-lists/EmailListManager';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Email {
  email: string;
  name?: string;
}

interface EmailList {
  _id: string;
  name: string;
  emails: Email[];
  createdAt: string;
  updatedAt: string;
}

export default function EmailListView() {
  const params = useParams();
  const id = params?.id as string;
  const auth = useAuth();
  const user = auth.user;
  const router = useRouter();
  const [emailList, setEmailList] = useState<EmailList | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmailList = async () => {
      if (!user) return;
      
      try {
        // For dummy auth, we can use a simple token
        const token = 'dummy-token';
        
        const response = await fetch(`/api/email-lists/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch email list');
        }
        
        const data = await response.json();
        setEmailList(data.emailList);
      } catch (error) {
        console.error('Error fetching email list:', error);
        setError('Failed to load email list data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmailList();
  }, [user, id]);

  const handleSave = async (name: string, emails: Email[]) => {
    if (!user) return;
    
    try {
      setSaving(true);
      setError('');
      
      // For dummy auth, we can use a simple token
      const token = 'dummy-token';
      
      const response = await fetch(`/api/email-lists/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          emails,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update email list');
      }
      
      const data = await response.json();
      setEmailList(data.emailList);
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating the email list');
    } finally {
      setSaving(false);
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

  if (!emailList) {
    return (
      <Dashboard>
        <div className="px-4 py-6">
          <div className="bg-red-100 text-red-700 p-4 rounded">
            Email list not found or you don't have permission to view it.
          </div>
          <div className="mt-4">
            <Link href="/email-lists" className="text-blue-600 hover:text-blue-800">
              Back to email lists
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
          <h1 className="text-2xl font-bold">Edit Email List</h1>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <EmailListManager
          initialName={emailList.name}
          initialEmails={emailList.emails}
          onSave={handleSave}
          saving={saving}
        />
      </div>
    </Dashboard>
  );
}