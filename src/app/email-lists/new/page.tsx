'use client';

import React, { useState } from 'react';
import Dashboard from '@/components/layout/Dashboard';
import EmailListManager from '@/components/email-lists/EmailListManager';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Email {
  email: string;
  name?: string;
}

export default function NewEmailList() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleSave = async (name: string, emails: Email[]) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError('');
      
      const token = await user.getIdToken();
      
      const response = await fetch('/api/email-lists', {
        method: 'POST',
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
        throw new Error('Failed to create email list');
      }
      
      const data = await response.json();
      router.push(`/email-lists/${data.emailList._id}`);
    } catch (error: any) {
      setError(error.message || 'An error occurred while creating the email list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Email List</h1>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <EmailListManager onSave={handleSave} />
      </div>
    </Dashboard>
  );
}