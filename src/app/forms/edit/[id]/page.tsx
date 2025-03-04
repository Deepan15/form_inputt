'use client';

import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/layout/Dashboard';
import FormBuilder, { FormField } from '@/components/forms/FormBuilder';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';

export default function EditForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
        setTitle(data.form.title);
        setDescription(data.form.description || '');
        setFields(data.form.fields);
      } catch (error) {
        console.error('Error fetching form:', error);
        setError('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [user, id]);

  const handleSave = async (updatedFields: FormField[]) => {
    if (!user) return;
    
    try {
      setSaving(true);
      setError('');
      
      const token = await user.getIdToken();
      
      const response = await fetch(`/api/forms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          fields: updatedFields,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update form');
      }
      
      router.push(`/forms/${id}`);
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating the form');
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

  return (
    <Dashboard>
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Form</h1>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <FormBuilder
          initialFields={fields}
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