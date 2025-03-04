'use client';

import React from 'react';
import Link from 'next/link';

interface Form {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
  fields: any[];
}

interface FormListProps {
  forms: Form[];
  onDelete: (formId: string) => void;
}

export default function FormList({ forms, onDelete }: FormListProps) {
  return (
    <div className="space-y-6">
      {forms.map((form) => (
        <div key={form._id} className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{form.title}</h3>
                {form.description && (
                  <p className="mt-1 text-sm text-gray-500">{form.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Fields: {form.fields.length} | Created: {new Date(form.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href={`/forms/${form._id}/edit`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Edit
                </Link>
                <Link
                  href={`/forms/${form._id}/preview`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Preview
                </Link>
                <Link
                  href={`/forms/${form._id}/responses`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Responses
                </Link>
                <button
                  onClick={() => onDelete(form._id)}
                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {forms.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No forms</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new form.</p>
          <div className="mt-6">
            <Link
              href="/forms/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Form
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}