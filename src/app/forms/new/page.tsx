'use client';

import React, { useState } from 'react';
import Dashboard from '@/components/layout/Dashboard';
import FormBuilder, { FormField } from '@/components/forms/FormBuilder';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function NewForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleSave = async (fields: FormField[]) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError('');
      
      const token = await user.getIdToken();
      
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          fields,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create form');
      }
      
      const data = await response.json();
      router.push(`/forms/${data.form._id}`);
    } catch (error: any) {
      setError(error.message || 'An error occurred while creating the form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Form</h1>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <FormBuilder
          onSave={handleSave}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
        />
      </div>
    </Dashboard>
  );
}