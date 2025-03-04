'use client';

import React from 'react';
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
}

interface EmailListViewProps {
  emailLists: EmailList[];
  onDelete: (listId: string) => void;
}

export default function EmailListView({ emailLists, onDelete }: EmailListViewProps) {
  return (
    <div className="space-y-6">
      {emailLists.map((list) => (
        <div key={list._id} className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{list.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Contacts: {list.emails.length} | Created: {new Date(list.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href={`/email-lists/${list._id}/edit`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(list._id)}
                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Email Contacts:</h4>
              <ul className="mt-2 divide-y divide-gray-200">
                {list.emails.slice(0, 5).map((email, index) => (
                  <li key={index} className="py-2">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{email.name || 'No Name'}</p>
                        <p className="text-sm text-gray-500">{email.email}</p>
                      </div>
                    </div>
                  </li>
                ))}
                {list.emails.length > 5 && (
                  <li className="py-2 text-sm text-gray-500">
                    And {list.emails.length - 5} more contacts...
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      ))}

      {emailLists.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No email lists</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new email list.</p>
          <div className="mt-6">
            <Link
              href="/email-lists/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Email List
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}