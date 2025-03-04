'use client';

import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/layout/Dashboard';
import FormResponseViewer from '@/components/forms/FormResponseViewer';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FormField } from '@/components/forms/FormBuilder';

interface FileUpload {
  fieldId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
}

interface Form {
  _id: string;
  title: string;
  fields: FormField[];
}

interface FormResponse {
  _id: string;
  formId: string;
  respondentEmail?: string;
  respondentName?: string;
  responses: Record<string, any>;
  fileUploads?: FileUpload[];
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export default function ResponsesPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
        
        // Fetch responses
        const responsesResponse = await fetch(`/api/forms/${id}/responses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!responsesResponse.ok) {
          throw new Error('Failed to fetch responses');
        }
        
        const responsesData = await responsesResponse.json();
        setResponses(responsesData.responses);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, id]);

  const handleExportCSV = () => {
    if (!form || !responses.length) return;
    
    // Create CSV header
    const headers = ['Respondent', 'Date', ...form.fields.map(field => field.label)];
    
    // Create CSV rows
    const rows = responses.map(response => {
      const row = [
        response.respondentEmail || 'Anonymous',
        new Date(response.submittedAt).toLocaleDateString(),
      ];
      
      // Add field values
      form.fields.forEach(field => {
        let value = response.responses[field.id];
        
        // Format value based on field type
        if (value === undefined || value === null) {
          value = '';
        } else if (typeof value === 'boolean') {
          value = value ? 'Yes' : 'No';
        } else if (field.type === 'file') {
          const fileUpload = response.fileUploads?.find(upload => upload.fieldId === field.id);
          value = fileUpload ? fileUpload.fileName : '';
        } else {
          value = String(value);
        }
        
        row.push(value);
      });
      
      return row;
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${form.title}_responses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredResponses = responses.filter(response => {
    if (filter === 'all') return true;
    if (filter === 'anonymous') return !response.respondentEmail;
    if (filter === 'identified') return !!response.respondentEmail;
    return true;
  }).sort((a, b) => {
    const dateA = new Date(a.submittedAt).getTime();
    const dateB = new Date(b.submittedAt).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

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
          <h1 className="text-2xl font-bold">Responses: {form.title}</h1>
          <div className="flex space-x-2">
            <Link
              href={`/forms/${id}`}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              View Form
            </Link>
            <Link
              href={`/forms/${id}/share`}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Share Form
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {responses.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">No responses yet for this form.</p>
            <Link
              href={`/forms/${id}/share`}
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Share Form to Get Responses
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Filter:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Responses</option>
                  <option value="identified">With Email</option>
                  <option value="anonymous">Anonymous</option>
                </select>
                
                <label className="text-sm font-medium text-gray-700 ml-4">Sort:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
              
              <div className="text-sm text-gray-500">
                Showing {filteredResponses.length} of {responses.length} responses
              </div>
            </div>
            
            <FormResponseViewer 
              responses={filteredResponses} 
              fields={form.fields} 
              onExportCSV={handleExportCSV} 
            />
          </div>
        )}
      </div>
    </Dashboard>
  );
}